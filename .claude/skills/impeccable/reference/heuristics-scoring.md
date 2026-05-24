<!-- v3 | agente: claude-code | 2026-05-21 -->
# Heuristics scoring (special reference)

Loaded by: `critique` (always), occasionally `audit` for UX-adjacent reviews.

## The 5-axis rubric

Score each axis 1-10. Report scores together; weakest axis identifies the top fix.

### Axis 1 — Visual hierarchy
- Eye guided? Within 3-second glance, primary action / message is identifiable?
- F-pattern / Z-pattern respected (per surface type)?
- Type scale + weight contrast carrying hierarchy (not just color)?

**1-3**: Hierarchy not present; everything competes
**4-6**: Hierarchy weak; user must hunt for primary action
**7-8**: Clear primary path; secondary actions accessible
**9-10**: Eye flows naturally; hierarchy invisible because correct

### Axis 2 — Information architecture
- Right things in right places (no orphan info, no critical info buried)?
- Progressive disclosure used (don't show all upfront)?
- Sensible grouping (5-9 items per chunk)?

**1-3**: Info chaos
**4-6**: Some groupings, but inconsistent
**7-8**: Patterns clear, predictable
**9-10**: IA invisible — user finds things without searching

### Axis 3 — Cognitive load
See `cognitive-load.md`. Score the 8 levers:
- Choice architecture (one primary?)
- Recognition vs recall
- Chunking
- Hierarchy clarity
- Consistency
- Feedback latency
- Error prevention
- Memory aids

**1-3**: High extraneous load
**4-6**: Some unnecessary cognitive burden
**7-8**: Lean; intrinsic load only
**9-10**: Feels effortless

### Axis 4 — Emotional resonance
- Does this feel like SOMETHING? Has POV?
- Specific to its audience, not generic?
- Brand voice consistent across copy?
- Atmosphere serves purpose?

**1-3**: Feels like a template
**4-6**: Some intent; mostly generic
**7-8**: POV identifiable
**9-10**: Distinct + memorable

### Axis 5 — Craft quality
- Type: hierarchy + weight + tracking + line-height tuned?
- Color: OKLCH + tinted neutrals + strategy named?
- Motion: ease-out, no layout animation, reduced-motion?
- Spacing: scale steps + rhythm varied?
- Interactive states: hover/focus/active/disabled/loading distinct?
- No absolute bans surviving (side-stripe, gradient text, glass, hero-metric)?

**1-3**: Multiple craft failures
**4-6**: Competent but inconsistent
**7-8**: Solid; minor polish opportunities
**9-10**: Exceptional craft

## Register weighting

| Register | Heaviest weight | Lightest weight |
|---|---|---|
| **Brand** | Emotional resonance + Craft quality | Cognitive load (still matters, but engagement is goal) |
| **Product** | Cognitive load + IA | Emotional resonance (subtle voice OK) |

## Report format

```
HEURISTIC SCORES — <target>
Hierarchy:           N/10
IA:                  N/10
Cognitive load:      N/10
Emotional resonance: N/10
Craft quality:       N/10

WEAKEST AXIS: <name> (N/10)
TOP 3 FIXES (highest leverage):
  1. ...
  2. ...
  3. ...
```

## Common pitfalls

- ❌ Scoring without rubric loaded (subjective drift)
- ❌ Reporting all 5 axes as bullets without identifying weakest
- ❌ Score variance over time (apply rubric consistently)
- ❌ Conflating "I don't like the colors" with low craft score (color choice ≠ craft)
- ❌ Weighting by personal preference instead of register
