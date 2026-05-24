<!-- v3 | agente: claude-code | 2026-05-21 -->
# Cognitive load (special reference)

Loaded by: `critique`, `audit`, `product` register (always), and consulted ad-hoc by other commands.

## Three load types

| Type | What | Design goal |
|---|---|---|
| **Intrinsic** | Inherent difficulty of the task | Can't reduce — minimize via UX |
| **Extraneous** | Noise from how it's presented | Minimize aggressively |
| **Germane** | Effort to build a mental model | Support it; don't waste it |

A good UI reduces extraneous load to zero so the user can spend their attention on intrinsic + germane.

## 8 cognitive-load levers

### 1. Choice architecture
- One primary action per surface (Hick's Law: more options = slower decisions)
- Progressive disclosure (don't show all options upfront)
- Sensible defaults (don't force every decision)

### 2. Recognition over recall
- Show, don't make the user remember (icons + labels, not just icons)
- Recently used / suggested options visible
- Autocomplete with history

### 3. Chunking
- Group related fields visually
- Use whitespace + headings, not just borders
- Limit chunks to 5-9 items where possible

### 4. Hierarchy clarity
- Visual hierarchy matches semantic hierarchy
- Primary content first; secondary actions accessible but de-emphasized
- Clear focal point per surface (the F-pattern / Z-pattern works)

### 5. Cognitive consistency
- Same things in same places across surfaces
- Same actions look the same (button = button = button)
- Patterns once-learned stay valid

### 6. Feedback latency
- <100ms: feels instant (no indicator needed)
- <1s: feels responsive (subtle indicator)
- 1-3s: feels "loading" (skeleton)
- 3s+: feels slow (progress + cancel)

### 7. Error prevention
- Constraint inputs (date picker, autocomplete, dropdown for fixed values)
- Confirm destructive actions OR allow undo (prefer undo)
- Validate inline, after enough info to validate

### 8. Memory aids
- Breadcrumbs
- Persistent state (don't lose work)
- Recently viewed / pinned items
- Search history

## Cognitive load in product vs brand

| Register | Bias |
|---|---|
| **Product** | Aggressive reduction. Every decision has cost. Earned-familiarity bar = reuse patterns. |
| **Brand** | Lower load not the goal — engagement is. But noise still hurts; reduce extraneous. |

## Measuring (not eyeballing)

- Time-on-task (how long to complete primary action)
- Error rate (how often users hit failures, including undo'd actions)
- Recovery time (how long to fix after an error)
- First-action delay (how long before user does ANYTHING after page load)
- Drop-off (where users abandon)

Use real metrics (analytics, session replays) over critic-mode opinions.

## Common pitfalls

- ❌ "More options = more value" (false; choice paralysis is real)
- ❌ Demanding decisions upfront (progressive disclosure)
- ❌ Icons without labels (recognition fails)
- ❌ Inconsistent button styles across surfaces
- ❌ Validation on first keystroke (jumpy = bad)
- ❌ Confirmation modals where undo would work
