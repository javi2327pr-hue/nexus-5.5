<!-- v3 | agente: codex | 2026-05-21 -->
# Shape (Codex)

```
Step 1: Determine mode
  - Trivial brief (clear from PRODUCT.md)         → compact mode
  - Ambiguous/multi-screen/stakeholder-heavy      → full mode

Step 2 (full mode): Multi-round discovery
  Ask 3-5 questions max:
    1. Users (who specifically, in what context)
    2. Job (what they're trying to do)
    3. Content shape (real content, not lorem)
    4. Visual direction (lane, anchor refs, anti-refs)
    5. Scope boundaries (what this is NOT)

Step 3 (Codex only): Visual probe
  Generate 2-3 quick exploratory visuals via image_gen
  Mark "probe — not final mock"
  Lock aesthetic lane before writing brief

Step 4: Assemble brief
  Compact (3-5 bullets): one-liner + content + visual lane + confirm/override
  Full (10 sections):
    1. Feature  2. Users  3. Job
    4. Content shape  5. Visual direction
    6. Recommended References  7. Out of scope
    8. Open questions  9. Success criteria  10. Risks

Step 5: Present + STOP
  Closing line (Codex):
    "Confirm; once locked, I'll run palette + reference questions before mocks."
  Wait for user confirmation. Do not advance.

Step 6: On user confirm
  → If called from craft: checkpoint.mjs --gate=1 --status=confirmed, resume craft
  → If standalone: STOP, suggest /impeccable craft

Step 7: Route
  user confirmed  → /impeccable craft (gates 2-4 ahead on Codex)
  PRODUCT.md missing → /impeccable teach (auto, then resume)
  user wants live variants → /impeccable live (needs dev server)
```

## Anti-patterns
```
❌ Pad clear brief into 10 sections (use compact)
❌ Skip confirm phase
❌ >5 discovery questions
❌ Treat shape confirm as code-green (gates 2-4 ahead)
```
