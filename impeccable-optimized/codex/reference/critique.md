<!-- v3 | agente: codex | 2026-05-21 -->
# Critique (Codex)

```
Step 1: Phase 1 — heuristic scoring
  Load reference/heuristics-scoring.md
  Score 1-10 each:
    - Visual hierarchy
    - Information architecture
    - Cognitive load (load reference/cognitive-load.md)
    - Emotional resonance
    - Craft quality

Step 2: Phase 2 — persona testing
  Load reference/personas.md
  Walk 2-3 relevant personas through the surface
  Note stumble points
  Brand register   → emphasize emotional + craft
  Product register → emphasize cognitive + IA

Step 3: Phase 3 — deterministic anti-pattern scan
  Run: npx impeccable detect <target>
  Cross-reference flags with skill sections violated

Step 4: Phase 4 — LLM critique (12 rules)
  1. AI slop test (1st + 2nd-order)?
  2. Color strategy named (restrained|committed|full|drenched)?
  3. Type scale ratio ≥1.25?
  4. Cards only where best affordance?
  5. Motion functional, not decorative?
  6. Every word earns place?
  7. No em dashes (also no --)?
  8. Hierarchy clear within 3s glance?
  9. Empty/error/loading states designed?
  10. Brand: aesthetic lane named + anchor refs?
  11. Product: would Linear/Figma/Notion user trust it?
  12. Cross-register: competitor screenshot wouldn't look identical?

Step 5: Emit report
  CRITIQUE — <target>
  Scores: hierarchy=N · IA=N · cognitive=N · emotional=N · craft=N
  Persona issues: ...
  Anti-pattern flags: N
  LLM critique: pass/issue per rule
  TOP 3 FIXES (highest leverage):
    1. ... → /impeccable <command>
    2. ...
    3. ...

Step 6: Route
  technical concern    → /impeccable audit
  copy/labels/errors   → /impeccable clarify
  type hierarchy       → /impeccable typeset
  spacing/rhythm       → /impeccable layout
  too bland            → /impeccable bolder
  too aggressive       → /impeccable quieter
  just polish          → /impeccable polish
```

## Anti-patterns
```
❌ Critique without heuristics rubric
❌ Skip npx impeccable detect
❌ Report all 12 LLM rules (filter to top 3 by leverage)
❌ Conflate with audit (technical vs UX/visual)
```
