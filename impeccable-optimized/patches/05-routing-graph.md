# Patch 5 — Inter-command routing graph

## Problem

Each `reference/<command>.md` is self-contained but commands interact: `audit` may surface issues better handled by `critique`; `craft` flows into many other commands; `polish` may discover production gaps that belong in `harden`.

The current SKILL.md "Routing rules" section only handles command dispatch (input → command). It does not formalize **inter-command flow** during execution.

LLMs default to either (a) staying in the current command and producing low-quality output for an off-topic issue, or (b) silently chaining to another command without telling the user. Both are bad UX.

## Fix

Add a uniform `## Routing` block at the end of every `reference/<command>.md` that documents:
- When the LLM should suggest a switch (FROM here → TO that)
- The trigger condition
- Whether to STAY in current command until something specific happens

Also: a top-level `ROUTING.md` file that documents the full graph as Mermaid + table.

## Block template (paste at end of every reference file)

```markdown
## Routing

FROM `<this-command>`, suggest GO TO:

| When you find... | Suggest | Trigger phrase |
|---|---|---|
| <intent shift X> | `<command-X>` | <one-line cue> |
| <intent shift Y> | `<command-Y>` | <one-line cue> |

STAY in `<this-command>` UNTIL: <terminal condition>

Never chain silently. Emit suggestion + STOP, let user invoke the next command.
```

## Per-command routing matrix (initial)

| Command | Suggests... when |
|---|---|
| `craft` | `shape` (always Gate 1) → `craft` continues → `polish` (after build) → `harden` (production gaps) → `live` (visual tuning) |
| `shape` | `craft` (direction confirmed) OR `teach` (PRODUCT.md missing) |
| `teach` | resume original command (auto) |
| `document` | resume original command (auto) |
| `extract` | `harden` (if extracted tokens reveal coverage gaps) |
| `critique` | `clarify` (copy issue) · `audit` (technical concern) · `layout` (rhythm broken) · `typeset` (hierarchy) |
| `audit` | `critique` (UX issue surfaced) · `optimize` (perf) · `adapt` (responsive miss) · `harden` (edge case) |
| `polish` | `harden` (gaps) · `clarify` (copy) · `typeset` (hierarchy) — terminal otherwise |
| `bolder` | `quieter` (overshot) · `polish` (after) |
| `quieter` | `bolder` (undershot) · `polish` (after) |
| `distill` | `bolder` (too sparse) · `polish` (after) |
| `harden` | `audit` (verify after harden) |
| `onboard` | `clarify` (copy) · `animate` (entrance moments) |
| `animate` | `polish` (after) · `optimize` (perf cost) |
| `colorize` | `bolder` (palette amplification) · `quieter` (overstimulating) |
| `typeset` | `polish` (after) · `layout` (if hierarchy fix reveals layout gap) |
| `layout` | `typeset` (if spacing fix reveals type gap) · `polish` (after) |
| `delight` | `polish` (after) — never `overdrive` (different intent) |
| `overdrive` | `polish` (after) · `optimize` (perf cost) · `harden` (edge cases of effects) |
| `clarify` | `polish` (after) |
| `adapt` | `audit` (verify responsive) · `polish` (after) |
| `optimize` | `audit` (verify perf) · `polish` (after) |
| `live` | terminal — user accepts/discards variants; suggest `polish` after exit |

## Mermaid graph for ROUTING.md

```mermaid
flowchart TD
    USER([User intent]) --> ROUTER[router via SKILL.md]

    ROUTER -->|build feature| CRAFT[craft]
    ROUTER -->|plan UX| SHAPE[shape]
    ROUTER -->|setup| TEACH[teach]
    ROUTER -->|doc DESIGN.md| DOC[document]
    ROUTER -->|extract tokens| EXT[extract]
    ROUTER -->|UX review| CRIT[critique]
    ROUTER -->|tech review| AUD[audit]
    ROUTER -->|ship-ready pass| POL[polish]
    ROUTER -->|amplify| BOLD[bolder]
    ROUTER -->|tone down| QUI[quieter]
    ROUTER -->|strip| DIS[distill]
    ROUTER -->|harden| HRD[harden]
    ROUTER -->|first-run| ONB[onboard]
    ROUTER -->|motion| ANI[animate]
    ROUTER -->|color| COL[colorize]
    ROUTER -->|type| TYP[typeset]
    ROUTER -->|layout| LAY[layout]
    ROUTER -->|delight| DEL[delight]
    ROUTER -->|overdrive| OVR[overdrive]
    ROUTER -->|copy fix| CLA[clarify]
    ROUTER -->|responsive| ADA[adapt]
    ROUTER -->|perf| OPT[optimize]
    ROUTER -->|live mode| LIV[live]

    SHAPE -->|direction confirmed| CRAFT
    SHAPE -->|PRODUCT.md missing| TEACH
    TEACH -.->|resume| USER
    DOC -.->|resume| USER

    CRAFT --> POL
    POL -->|gaps| HRD
    POL -->|copy| CLA
    POL -->|hierarchy| TYP

    CRIT --> CLA
    CRIT --> AUD
    CRIT --> LAY
    CRIT --> TYP

    AUD --> CRIT
    AUD --> OPT
    AUD --> ADA
    AUD --> HRD

    BOLD <-->|overshoot| QUI
    BOLD --> POL
    DIS --> BOLD

    HRD --> AUD
    ANI --> POL
    ANI --> OPT
    COL --> BOLD
    COL --> QUI
    TYP --> LAY
    LAY --> TYP
    DEL --> POL
    OVR --> POL
    OVR --> OPT
    OVR --> HRD
    CLA --> POL
    ADA --> AUD
    OPT --> AUD
    LIV --> POL

    style ROUTER fill:#1f6feb,stroke:#0d47a1,color:#fff
    style CRAFT fill:#e53935,stroke:#b71c1c,color:#fff
    style POL fill:#2e7d32,stroke:#1b5e20,color:#fff
```

## Migration

1. Append the routing block to each `reference/<command>.md` (script-generatable from the matrix above)
2. Create `docs/ROUTING.md` with the Mermaid graph + full table
3. Add to `bun run build` a check that every reference file ends with `## Routing` section (lints for omission)
4. Update SKILL.md to reference `docs/ROUTING.md` from its "Routing between commands" section
