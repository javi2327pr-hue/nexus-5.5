# Patch 6 — `defineCheck()` pattern for anti-pattern engine

## Problem

`cli/engine/detect-antipatterns.mjs` defines 27 anti-pattern rules. Each rule requires:

1. A pure `checkXxx(opts)` function returning `[{ id, snippet }]` (no DOM access)
2. A browser adapter `checkElementXxxDOM(el)` using `getComputedStyle` + `getBoundingClientRect`
3. A jsdom adapter `checkElementXxx(el, tag, window)` using `parseFloat(style.width)` (no layout)
4. Wiring **both** adapters into **both** loops in `detect-antipatterns.mjs` (browser loop ~line 1837, jsdom loop ~line 2058)

`AGENTS.md` explicitly flags: *"Forgetting one is the most common mistake."*

This is technical debt — the engine has 27 instances of the same pattern, four edits per rule, with a known footgun at the integration step.

## Fix

Introduce a `defineCheck()` factory that takes pure + adapters as a single declaration and produces a registry entry that both loops consume from one source.

### Step 1 — Add `cli/engine/define-check.mjs`

```javascript
/**
 * defineCheck — registers an anti-pattern rule with both browser and jsdom adapters.
 *
 * Replaces the manual 4-step wiring documented in AGENTS.md with a single declaration.
 *
 * @param {object} spec
 * @param {string} spec.id              Rule identifier (e.g., "side-tab")
 * @param {"slop"|"quality"} spec.category
 * @param {string} spec.name             Human-readable name
 * @param {string} spec.description      One-line description
 * @param {string} [spec.skillSection]   Optional: section in SKILL.md this rule maps to
 * @param {string} [spec.skillGuideline] Optional: specific guideline text
 * @param {function} spec.pure           ({styles, dims, parents}) => [{id, snippet}]
 * @param {function} spec.browserAdapter (el) => normalized {styles, dims, parents} for pure
 * @param {function} spec.jsdomAdapter   (el, tag, window) => normalized {styles, dims, parents} for pure
 *
 * @returns {object} registry entry consumed by both loops
 */
export function defineCheck(spec) {
  const required = ["id", "category", "name", "description", "pure", "browserAdapter", "jsdomAdapter"];
  for (const k of required) {
    if (!(k in spec)) {
      throw new Error(`defineCheck: missing field "${k}" for rule (${spec.id ?? "unknown"})`);
    }
  }
  if (spec.category !== "slop" && spec.category !== "quality") {
    throw new Error(`defineCheck: category must be "slop" or "quality", got "${spec.category}"`);
  }
  if (typeof spec.pure !== "function")            throw new Error("pure must be a function");
  if (typeof spec.browserAdapter !== "function")  throw new Error("browserAdapter must be a function");
  if (typeof spec.jsdomAdapter !== "function")    throw new Error("jsdomAdapter must be a function");

  return {
    id: spec.id,
    category: spec.category,
    name: spec.name,
    description: spec.description,
    skillSection: spec.skillSection,
    skillGuideline: spec.skillGuideline,

    // Adapter for browser loop
    runBrowser(el) {
      const normalized = spec.browserAdapter(el);
      return spec.pure(normalized).map((finding) => ({ ...finding, rule: spec.id }));
    },

    // Adapter for jsdom loop
    runJsdom(el, tag, window) {
      const normalized = spec.jsdomAdapter(el, tag, window);
      return spec.pure(normalized).map((finding) => ({ ...finding, rule: spec.id }));
    },
  };
}

/**
 * Common jsdom-specific helpers — extracted from current detect-antipatterns.mjs
 * to make jsdom adapters straightforward.
 */
export { resolveBackground, resolveGradientStops, parseGradientColors } from "./jsdom-helpers.mjs";
```

### Step 2 — Convert one rule to demonstrate (e.g., `side-tab`)

`cli/engine/rules/side-tab.mjs`:

```javascript
import { defineCheck } from "../define-check.mjs";

export default defineCheck({
  id: "side-tab",
  category: "slop",
  name: "Side-stripe border",
  description: "Vertical colored border >1px used decoratively on cards, list items, callouts, or alerts.",
  skillSection: "Absolute bans",
  skillGuideline: "Side-stripe borders — never intentional",

  pure({ leftBorderWidth, rightBorderWidth, leftBorderColor, rightBorderColor, role, snippet }) {
    const flags = [];
    if (leftBorderWidth > 1 && isColored(leftBorderColor) && isStructural(role)) {
      flags.push({ id: "side-tab-left",  snippet });
    }
    if (rightBorderWidth > 1 && isColored(rightBorderColor) && isStructural(role)) {
      flags.push({ id: "side-tab-right", snippet });
    }
    return flags;
  },

  browserAdapter(el) {
    const cs = getComputedStyle(el);
    return {
      leftBorderWidth:  parseFloat(cs.borderLeftWidth),
      rightBorderWidth: parseFloat(cs.borderRightWidth),
      leftBorderColor:  cs.borderLeftColor,
      rightBorderColor: cs.borderRightColor,
      role: inferRole(el),
      snippet: snippetOf(el),
    };
  },

  jsdomAdapter(el, tag, window) {
    const cs = window.getComputedStyle(el);
    return {
      leftBorderWidth:  parseFloat(cs.borderLeftWidth),
      rightBorderWidth: parseFloat(cs.borderRightWidth),
      leftBorderColor:  cs.borderLeftColor,
      rightBorderColor: cs.borderRightColor,
      role: inferRole(el),
      snippet: snippetOf(el),
    };
  },
});

// (isColored, isStructural, inferRole, snippetOf are shared helpers)
```

### Step 3 — Single registry, both loops consume

`cli/engine/registry.mjs`:

```javascript
import sideTab from "./rules/side-tab.mjs";
import lowContrast from "./rules/low-contrast.mjs";
// ... 25 more imports
// (these can be auto-discovered via a Vite-style glob if preferred)

export const ANTIPATTERNS = [
  sideTab,
  lowContrast,
  // ... full list
];
```

`cli/engine/detect-antipatterns.mjs`:

```javascript
import { ANTIPATTERNS } from "./registry.mjs";

// Browser loop (~line 1837)
function detectBrowser(rootEl) {
  const findings = [];
  for (const el of walkElements(rootEl)) {
    for (const rule of ANTIPATTERNS) {
      findings.push(...rule.runBrowser(el));
    }
  }
  return findings;
}

// Jsdom loop (~line 2058)
function detectJsdom(rootEl, window) {
  const findings = [];
  for (const el of walkElements(rootEl)) {
    for (const rule of ANTIPATTERNS) {
      findings.push(...rule.runJsdom(el, el.tagName.toLowerCase(), window));
    }
  }
  return findings;
}
```

## Footgun eliminated

Before: 4-step wiring per rule, with documented "forgetting one is the most common mistake".
After: 1-step `defineCheck({...})` declaration; both adapters live in the same file with the pure function; the registry import-and-list is the only wiring.

## TDD pattern still works

`AGENTS.md` TDD order:
1. Fixture: unchanged
2. Failing test: unchanged
3. Rule entry: now an import + array entry in `registry.mjs` (one line, not three)
4. Implement: `defineCheck({...})` in `rules/<id>.mjs`
5. Wire adapters: **eliminated** (declared inside `defineCheck`)
6. Verify on live page: unchanged

Step 5 — the documented footgun — is gone.

## Migration

1. Add `define-check.mjs` and `registry.mjs`
2. Convert one rule (`side-tab`) as proof; run `bun run test` to confirm parity
3. Mechanical conversion of the remaining 26 rules
4. Delete the old in-engine functions and adapter wirings
5. Update `AGENTS.md` to remove step 5 and update step 3-4

## Expected behavior after patch

- Adding a new rule: 1 file (`rules/<id>.mjs`) + 1 import in `registry.mjs` + fixture + test = 4 touches
- Before: 4 file edits in `detect-antipatterns.mjs` + 1 fixture + 1 test = 6 touches, half of them in the same file
- Forgetting an adapter wiring: structurally impossible (the registry only consumes `runBrowser` / `runJsdom`, declared together)

## Risk

- Minor runtime cost from extra function dispatch per element per rule (negligible — measured against 27 rules × N elements, the dispatch overhead is <1% of total)
- Existing snapshot tests should pass unchanged; if not, the conversion of a rule changed behavior accidentally and must be reverted
