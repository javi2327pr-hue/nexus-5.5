<!-- v3 | agente: codex | 2026-05-21 -->
# Live (Codex) — playbook only

Mechanics in live-protocol.md. This file is operational.

```
Step 1: Boot
  node scripts/live.mjs
  Read JSON output completely.
  If ok=false → first-time setup (see live-protocol.md)

Step 2: Navigate browser to URL serving pageFiles[0]
  serverPort is NOT the URL — it's the helper port.
  Infer URL from package.json / docs / terminal / open tab.

Step 3: Harness policy = FOREGROUND POLL
  Codex background sessions don't reliably surface poll stdout.
  Use blocking foreground.

Step 4: LOOP (default long timeout, no short --timeout=)
  node scripts/live-poll.mjs
  Read JSON, dispatch on event.type:

    generate  → Step 5
    accept    → Step 6
    discard   → ack auto, LOOP
    prefetch  → handle per live-protocol.md, LOOP
    timeout   → LOOP

Step 5: Handle generate
  1. Read screenshot if present
  2. Load reference/<action>.md (action = bolder/quieter/animate/etc.)
  3. Plan 3 distinct directions:
     - Dir 1: closest-to-current (minimal departure)
     - Dir 2: mid-departure (one significant change)
     - Dir 3: high-departure (rethinks structure/palette/lane)
       Respect register + PRODUCT.md anti-refs
  4. Write all 3 variants in ONE edit
  5. node scripts/live-poll.mjs --reply done
  6. LOOP

Step 6: Handle accept
  Plain accept    → terminal immediately, LOOP
  Carbonize accept → not terminal yet
    Run carbonize cleanup (see live-protocol.md)
    node scripts/live-complete.mjs --id EVENT_ID
    LOOP

Step 7: Interrupted recovery
  node scripts/live-status.mjs   (see state)
  node scripts/live-resume.mjs   (replay journal)
  Then resume LOOP

Step 8: Exit
  Cleanup procedure → live-protocol.md
  Suggest /impeccable polish if user accepted a variant
```

## Anti-patterns
```
❌ Short --timeout= on poll (use default 600s)
❌ serverPort as URL (it's helper port)
❌ Recap PRODUCT/DESIGN in chat (waste tokens)
❌ <3 directions (3 is the contract)
❌ All 3 same aesthetic lane (defeats purpose)
❌ Background poll on Codex (foreground only)
❌ Skip live-status/resume after interruption (guessing fails)
```
