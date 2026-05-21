<!-- v3 | agente: codex | 2026-05-21 -->
# Distill (Codex)

```
Step 1: Inventory present elements
  For each visual element, tag job:
    navigation | content | action | feedback | decorative
  Mark decoratives + duplicates as candidates for removal

Step 2: Test "if I removed this..." for each candidate
  Would removing break a user task?  YES → keep
                                     NO  → mark for removal

Step 3: Apply removal in tiers
  Tier 1 (safe):  pure decoration, duplicate copy, redundant icons → remove freely
  Tier 2 (medium): filler illustrations, divider lines, secondary CTAs → remove + verify
  Tier 3 (risky): whole sections, columns, hierarchy steps → AskUserQuestion

Step 4: Reassess what's left
  - May need bolder typography (chrome was carrying hierarchy)
  - May need MORE whitespace (distill removes chrome, not space)
  - May need commitment on primary action (CTA competition gone)

Step 5: "Went too far" check
  If result feels skeletal / placeholder / "AI generated":
    → STOP, suggest /impeccable bolder

Step 6: Emit diff + route
  feels skeletal             → /impeccable bolder
  type now carries hierarchy → /impeccable typeset
  whitespace needs adjust    → /impeccable layout
  removed something used     → revert + ask user
```

## What distill does NOT remove
```
- Function (anything doing a job)
- Identity (brand signature motifs)
- Affordance (button still looks like button)
- Accessibility (focus, errors, semantic structure)
```

## Anti-patterns
```
❌ Remove function alongside decoration
❌ Remove brand signature ("looked decorative")
❌ Collapse whitespace as part of distill
❌ Aggressive distill on brand register
❌ Skip "if I removed this..." test
```
