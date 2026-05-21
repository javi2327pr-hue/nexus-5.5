# Patch 4 — Split `live.md` (622L → ≤300L + protocol file)

## Problem

`skill/reference/live.md` is **622 lines** — the heaviest reference in the suite. It mixes:

- Operational playbook (what the LLM does when in live mode)
- State machine spec (poll → generate → accept → carbonize → cleanup)
- Durable journal mechanics
- Harness-specific polling policies
- First-time setup
- Per-action references (generate, accept, discard, carbonize, prefetch)

Loading it for any live-mode invocation consumes ~5-6K tokens of context that isn't all relevant to the immediate decision.

## Fix

Split into:

1. `live.md` — playbook (≤300 lines): "what do I do right now in this state"
2. `live-protocol.md` — state machine + journal + acks (≤300 lines): "how the system works under the hood"

The playbook references the protocol on-demand. Routine live operation only needs the playbook.

## Split mapping (source line → target file)

| Source live.md section | Lines | Target |
|---|---|---|
| Prerequisites | 4-6 | live.md |
| The contract (read once) | 8-37 | live.md (compress; keep the 7-step contract; move detail to protocol) |
| Harness policy | 38-43 | live.md (keep — operationally critical) |
| Start | 45-58 | live.md |
| Poll loop | 60-90 | live.md (the dispatch table only; details to protocol) |
| Handle Generate | 92-180 | live.md (operational steps; move "three distinct directions" detail to protocol) |
| Handle Accept | 182-260 | live-protocol.md (carbonize cleanup mechanics) |
| Handle Discard | 262-280 | live.md |
| Handle Prefetch | 282-310 | live-protocol.md |
| Durable journal | 312-380 | live-protocol.md (entire section) |
| Carbonize cleanup deep-dive | 382-470 | live-protocol.md |
| First-time setup | 472-550 | live.md (operational) OR live-protocol.md (config schema) — split |
| Troubleshooting | 552-622 | live-protocol.md |

## Resulting `live.md` (skeleton, ≤300 lines)

```markdown
# Live mode

Interactive variant generation in the browser. User picks elements, picks actions, gets variants hot-swapped via HMR.

## Prerequisites
(unchanged, 3 lines)

## The contract (compressed)
7 numbered steps. Each step ≤2 lines. Defer mechanics to live-protocol.md.

## Harness policy
| Harness | Poll mode |
| Claude Code | background |
| Cursor | foreground |
| Codex | foreground |
| Other | foreground unless verified |

## Start
node {{scripts_path}}/live.mjs

## Poll loop (dispatch only)
LOOP {
  node {{scripts_path}}/live-poll.mjs
  switch event.type {
    case "generate":  → Handle Generate section below
    case "accept":    → Handle Accept section below
    case "discard":   → Handle Discard section below
    case "prefetch":  → Handle Prefetch section below (mechanics in live-protocol.md)
    case "timeout":   → continue LOOP
  }
}

## Handle Generate (operational)
1. Read screenshot if present
2. Load the action's reference file
3. Plan three distinct directions (criteria: see live-protocol.md)
4. Write all variants in one edit
5. Reply with --reply done
6. Resume LOOP

## Handle Accept (operational)
- Plain accepts: terminal immediately
- Carbonize accepts: see live-protocol.md (cleanup state machine)

## Handle Discard (operational)
acknowledge event, resume LOOP.

## Handle Prefetch
node {{scripts_path}}/live-prefetch-handler.mjs
(mechanics: live-protocol.md)

## Exit cleanup
(reference live-protocol.md "Cleanup procedure")

## First-time setup (operational)
node {{scripts_path}}/live.mjs --setup
(config schema: live-protocol.md)
```

## Resulting `live-protocol.md` (skeleton)

```markdown
# Live mode protocol

Specification of the live mode state machine. Not loaded during routine live operation — referenced from live.md when the model needs to understand mechanics.

## State machine

States: idle → polling → handling-generate → awaiting-accept → terminal | carbonize-cleanup → terminal

Transitions: ...

## Durable journal

Path: `.impeccable/live/journal.jsonl`
Schema: { eventId, type, status, deliveredAt, acknowledgedAt, completedAt, payload }
Replay rules: ...

## Carbonize cleanup

Three-phase: ack → finalize → completion-ack
Mechanics: ...

## Acknowledgement protocol

Every delivered event must be acked before the next event is processed.
Ack types: --reply done, live-accept.mjs, live-complete.mjs --id EVENT_ID

## Config schema

`.impeccable/live.config.json`:
{ pageFiles, serverPort, serverToken, ... }

## Variant planning criteria

The "three distinct directions" rule:
- Direction 1: closest-to-current (minimal departure)
- Direction 2: mid-departure (commits to one significant change)
- Direction 3: high-departure (rethinks structure, palette, or aesthetic lane)

## Troubleshooting

Symptom → Resolution table
(full troubleshooting moved here)
```

## Token savings

- Before: 622 lines × ~10 tokens/line ≈ 6,200 tokens per live-mode load
- After: ~300 lines × ~10 tokens/line ≈ 3,000 tokens per live-mode load
- Protocol loaded only when needed: +0 tokens for routine flow, +3,000 only when troubleshooting

## Migration

1. Run the split script (extract sections per mapping above)
2. Verify no broken references (grep for `live.md` in other files → update where the new home is appropriate)
3. Add cross-reference from live.md to live-protocol.md at the relevant points
4. Update build (`bun run build`) to include the new file in `dist/`
5. Test live mode E2E (`bun run test:live-e2e`) to confirm no behavioral change
