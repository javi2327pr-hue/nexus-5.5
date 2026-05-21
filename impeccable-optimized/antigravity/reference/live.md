<!-- v3 | agente: antigravity | 2026-05-21 -->
# Live (Antigravity) — playbook only

State machine / journal mechanics in live-protocol.md. This file is operational only.

## Goal
Run interactive variant generation against the user's running dev server: poll for events, on `generate` produce 3 distinct variants per the action loaded, on `accept`/`discard`/`carbonize` handle per protocol, keep session healthy until user exits.

## Autonomy boundaries
- Boot via `scripts/live.mjs`, parse JSON output autonomously
- Run poll loop with default 600s timeout (no short timeouts)
- On `generate`: produce 3 variants (closest / mid-departure / high-departure)
- On `accept`/`discard`: ack and continue
- On carbonize accept: run cleanup, then `live-complete.mjs --id EVENT_ID`, then resume
- On interruption: run `live-status.mjs` / `live-resume.mjs` before guessing
- Foreground poll on Codex/Cursor; background only on Claude Code (which wakes session)
- Do NOT pass short `--timeout=` to poll
- Do NOT use `serverPort` as the browser URL
- Do NOT recap PRODUCT/DESIGN in chat
- Do NOT produce fewer than 3 directions
- Do NOT make 3 directions all in the same aesthetic lane

## Acceptance criteria
1. Boot succeeded (or first-time-setup completed)
2. Browser navigated to correct URL (pageFiles, not serverPort)
3. Poll mode matches harness policy (background for Claude Code, foreground for Codex/Cursor)
4. On each `generate`: 3 directions produced, written in ONE edit, with distinct aesthetic lanes
5. Identity preservation is the default; departure requires PRODUCT.md anti-reference trigger OR explicit user prompt cue
6. Carbonize accepts cleaned up via live-complete.mjs before next poll
7. Interruption recovery via status/resume scripts before any retry
8. Session ends with explicit user accept/discard or exit, never stalled silently

## Optional checkpoints
- Confirm interpretation of user's action choice if ambiguous (e.g., "bolder" on a typography-only surface)
- Confirm before high-departure variant if PRODUCT.md doesn't permit (rare)
- Otherwise: autonomous

## Inputs / outputs
- Input: running dev server URL (inferred) OR static HTML
- Output: variant HTML+CSS written to file system via HMR

## Success metric
- 0 stalled sessions (every event ack'd within next poll)
- 100% of generate events produce 3 distinct directions
- 0 polls with short timeout (always default 600s)
- 0 cases of serverPort confused for app URL

## Failure mode handling
- Config missing/invalid → first-time setup (live-protocol.md), don't proceed without it
- Dev server URL un-inferable → ask user once, then start
- Carbonize accept fails cleanup → STOP, surface state, await user
- Poll stdout doesn't return (wrong harness policy) → switch to foreground, document failure for harness
- User picks an action that's not in reference/ → degrade to generic refine, note in output
- Identity preservation violated by all 3 directions → restart with anti-reference triggers re-checked
