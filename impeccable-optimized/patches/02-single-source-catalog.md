# Patch 2 — Single-source command catalog

## Problem

The same command table exists in **three places**:

1. `README.md` (lines ~30-60 with category column)
2. `skill/SKILL.md` (lines 120-148, identical structure, may drift)
3. `skill/scripts/command-metadata.json` (declared "single source of truth" in CLAUDE.md)

The build pipeline does not enforce consistency. Any of the three can drift independently. `pin.mjs` reads from JSON; the other two are hand-maintained.

## Fix

Make `command-metadata.json` the single source. Generate the markdown tables in `README.md` and `SKILL.md` from it at build time, and fail the build if hand-edits in those tables disagree with the JSON.

### Step 1 — Add markers to README.md and SKILL.md

Wrap the command tables in HTML comments that mark generated regions:

```markdown
<!-- BEGIN:commands-table -->
| Command | Category | Description | Reference |
|---|---|---|---|
| ... | ... | ... | ... |
<!-- END:commands-table -->
```

### Step 2 — Add `scripts/generate-commands-table.mjs`

```javascript
#!/usr/bin/env node
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const META = JSON.parse(readFileSync(
  resolve("skill/scripts/command-metadata.json"),
  "utf8"
));

const TARGETS = [
  { file: "README.md",         format: "readme" },
  { file: "skill/SKILL.md",    format: "skill"  },
];

const MARK_BEGIN = "<!-- BEGIN:commands-table -->";
const MARK_END   = "<!-- END:commands-table -->";

function renderTable(format) {
  const rows = META.commands.map((c) => {
    if (format === "readme") {
      return `| \`/impeccable ${c.name}${c.argHint ? " " + c.argHint : ""}\` | ${c.description} |`;
    }
    // skill format includes category + reference link
    return `| \`${c.name}${c.argHint ? " " + c.argHint : ""}\` | ${c.category} | ${c.description} | [reference/${c.name}.md](reference/${c.name}.md) |`;
  });
  const header = format === "readme"
    ? "| Command | What it does |\n|---------|--------------|"
    : "| Command | Category | Description | Reference |\n|---|---|---|---|";
  return `${MARK_BEGIN}\n${header}\n${rows.join("\n")}\n${MARK_END}`;
}

let driftDetected = false;
for (const target of TARGETS) {
  const src = readFileSync(target.file, "utf8");
  const beginIdx = src.indexOf(MARK_BEGIN);
  const endIdx   = src.indexOf(MARK_END);
  if (beginIdx === -1 || endIdx === -1) {
    console.error(`Markers missing in ${target.file} — add ${MARK_BEGIN} and ${MARK_END}`);
    process.exit(2);
  }
  const before = src.slice(0, beginIdx);
  const after  = src.slice(endIdx + MARK_END.length);
  const rendered = renderTable(target.format);

  if (process.argv.includes("--check")) {
    const current = src.slice(beginIdx, endIdx + MARK_END.length);
    if (current !== rendered) {
      console.error(`Drift detected in ${target.file}`);
      driftDetected = true;
    }
  } else {
    const updated = `${before}${rendered}${after}`;
    if (updated !== src) {
      writeFileSync(target.file, updated);
      console.log(`Updated ${target.file}`);
    }
  }
}

if (driftDetected) process.exit(1);
```

### Step 3 — Wire into `bun run build`

In `package.json`:
```json
{
  "scripts": {
    "build": "node scripts/generate-commands-table.mjs && <existing build commands>",
    "build:check": "node scripts/generate-commands-table.mjs --check && <existing check>",
    "prepush": "bun run build:check"
  }
}
```

### Step 4 — CI gate

Add to `.github/workflows/<existing>.yml`:
```yaml
- name: Check command catalog consistency
  run: bun run build:check
```

## Expected behavior after patch

- Editing `command-metadata.json` and running `bun run build` updates both README.md and SKILL.md atomically
- Editing the table directly in README.md or SKILL.md (and not updating the JSON) causes `build:check` and the CI gate to fail
- Drift becomes impossible without an explicit `--force` (which we deliberately don't add)

## Migration

1. Add `<!-- BEGIN:commands-table -->` / `<!-- END:commands-table -->` markers in README.md and skill/SKILL.md around the existing tables (no content change)
2. Run `node scripts/generate-commands-table.mjs` once to confirm zero diff
3. Commit the markers + the new script
4. Wire into build and CI

## Maintenance

When adding a new command:
1. Add the command's entry to `command-metadata.json`
2. Create `skill/reference/<command>.md`
3. Run `bun run build` — tables regenerate automatically

When deprecating a command:
1. Remove from `command-metadata.json`
2. Delete `skill/reference/<command>.md`
3. `cleanup-deprecated.mjs` handles removal in user installations
