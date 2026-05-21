<!-- v3 | agente: codex | 2026-05-21 -->
# Heuristics scoring (Codex special ref)

```
LOADED BY: critique (always), occasionally audit for UX-adjacent

5-AXIS RUBRIC (score 1-10 each):

Axis 1 — Visual hierarchy
  Eye guided in 3s glance?
  F/Z pattern respected per surface type?
  Type scale + weight carrying hierarchy (not just color)?
  Score:
    1-3 = chaos
    4-6 = weak hunting
    7-8 = clear primary, accessible secondary
    9-10 = effortless flow

Axis 2 — Information architecture
  Right things in right places?
  Progressive disclosure?
  Chunks 5-9 items?
  Score:
    1-3 = chaos
    4-6 = inconsistent groupings
    7-8 = predictable patterns
    9-10 = invisible IA

Axis 3 — Cognitive load (see reference/cognitive-load.md)
  8 levers: choice, recognition, chunking, hierarchy, consistency,
            feedback latency, error prevention, memory aids
  Score:
    1-3 = high extraneous load
    4-6 = some unnecessary burden
    7-8 = lean (intrinsic only)
    9-10 = effortless

Axis 4 — Emotional resonance
  Has POV? Specific not generic?
  Brand voice consistent?
  Atmosphere serves purpose?
  Score:
    1-3 = template
    4-6 = some intent, mostly generic
    7-8 = POV identifiable
    9-10 = distinct + memorable

Axis 5 — Craft quality
  Type tuned, color OKLCH-tinted, motion correct, spacing scale,
  interactive states distinct, no absolute bans
  Score:
    1-3 = multiple craft failures
    4-6 = competent but inconsistent
    7-8 = solid, minor polish ops
    9-10 = exceptional

REGISTER WEIGHTING:
  Brand:   emotional resonance + craft quality heavy
  Product: cognitive load + IA heavy

REPORT:
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

PITFALLS:
  ❌ Score without rubric loaded (drift)
  ❌ Report all 5 as bullets without weakest axis
  ❌ Score variance over time
  ❌ Conflate "don't like colors" with low craft
  ❌ Weight by preference instead of register
```
