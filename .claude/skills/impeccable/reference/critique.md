<!-- v3 | agente: claude-code | 2026-05-21 -->
# Critique (Claude Code)

UX design review with heuristic scoring, persona-based testing, anti-pattern detection, and actionable feedback.

## Use this command when

User asks to "review", "critique", "evaluate", "give feedback", "second opinion" on a design or component.

## Difference vs `audit`

- `audit` = **technical** quality (a11y, perf, responsive, anti-patterns)
- `critique` = **UX/visual** quality (hierarchy, clarity, emotional resonance, cognitive load)

Both can run on the same target; they catch different things.

## Flow

### Phase 1 — Heuristic scoring

Score across 5 axes (1-10 each). Load `reference/heuristics-scoring.md` for the rubric.

| Axis | Asks |
|---|---|
| Visual hierarchy | Is the eye guided? Are F-pattern/Z-pattern respected? |
| Information architecture | Right things in right places? Progressive disclosure used? |
| Cognitive load | Could this be simpler? Are choices reasonable? See `cognitive-load.md`. |
| Emotional resonance | Does this feel like SOMETHING? Has POV? |
| Craft quality | Type, spacing, color, motion — competent? |

### Phase 2 — Persona-based testing

Load `reference/personas.md`. Walk 2-3 relevant personas through the surface mentally; note where they'd stumble.

For brand register surfaces: emphasis on emotional + craft axes.
For product register surfaces: emphasis on cognitive load + IA axes.

### Phase 3 — Anti-pattern scan (deterministic)

```bash
npx impeccable detect <target>
```

Cross-reference flags with skill section they violate.

### Phase 4 — LLM critique pass (12 rules)

The 12 LLM-only critique rules (subjective ones the deterministic engine can't run):
1. Does the AI slop test pass (1st + 2nd-order)?
2. Color strategy named explicitly (restrained/committed/full/drenched)?
3. Type scale ratio ≥1.25?
4. Cards used only where they're the best affordance?
5. Motion serving function, not decoration?
6. Copy: every word earns place?
7. No em dashes anywhere?
8. Hierarchy clear within 3-second glance?
9. Empty/error/loading states designed (not just happy path)?
10. Brand register: aesthetic lane named, anchor refs identifiable?
11. Product register: would a fluent Linear/Figma/Notion user trust it?
12. Cross-register: would a competitor's screenshot look identical?

### Phase 5 — Report

```
CRITIQUE — <target>
══════════════════════════════════════════════
Scores (1-10):
  Hierarchy:           7
  IA:                  6
  Cognitive load:      5
  Emotional resonance: 4   ← weakest
  Craft quality:       8

Persona issues:
  • <persona name>: <issue>

Anti-pattern flags: <count> (see audit)

LLM critique:
  ✅ <pass>
  ⚠️ <issue> (rule #N)
  ❌ <issue> (rule #N)

TOP 3 FIXES (highest leverage):
  1. <fix> → suggests /impeccable <command>
  2. ...
  3. ...
```

## Routing

FROM `critique`, suggest GO TO:

| When critique surfaces... | Suggest |
|---|---|
| Technical concern (a11y, perf, responsive) | `audit` |
| Copy / labels / errors | `clarify` |
| Type hierarchy broken | `typeset` |
| Spacing/rhythm broken | `layout` |
| Too bland | `bolder` |
| Too aggressive | `quieter` |
| Just polishing needed | `polish` |

STAY in `critique` UNTIL: scores assigned to all 5 axes AND top 3 fixes identified.

## Anti-patterns

- ❌ Critiquing without loading `heuristics-scoring.md` rubric (subjective drift)
- ❌ Skipping `npx impeccable detect` (miss 27 deterministic checks)
- ❌ Reporting all 12 LLM rules as findings (filter to top 3 fixes, leverage matters)
- ❌ Conflating `critique` with `audit` (different dimensions)
