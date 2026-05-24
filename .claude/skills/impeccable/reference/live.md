<!-- v3 | agente: claude-code | 2026-05-21 -->
# Live (Claude Code) — playbook only

Interactive variant generation in the browser. User picks elements, picks actions, gets variants hot-swapped via HMR.

**This file is the operational playbook. State machine + journal + carbonize mechanics live in `live-protocol.md` (loaded only when troubleshooting).**

## Prerequisites

Running dev server with HMR (Vite, Next, Bun, etc.) OR static HTML in browser.

## The contract (read once, execute in order)

1. `live.mjs` — boot
2. Navigate to URL serving `pageFile` (infer from package.json, docs, terminal, open tab)
3. Poll loop with long timeout (600000ms). After every event/reply, re-poll.
4. On `generate` → read screenshot, load action ref, plan 3 directions, write all in one edit, `--reply done`
5. On `accept`/`discard` → poll script acks automatically; carbonize accepts need `live-complete.mjs --id EVENT_ID` before next poll
6. If interrupted → `live-status.mjs` / `live-resume.mjs` (durable journal replays)
7. On `exit` → cleanup (see live-protocol.md)

## Harness policy

| Harness | Poll mode |
|---|---|
| **Claude Code** | **Background task** (no short timeout). Harness wakes session on poll completion. |
| Cursor | Foreground (blocking) — subagents/background don't reliably resume |
| Codex | Foreground (blocking) — same reason |
| Other | Foreground unless stdout return verified |

## Start

```bash
node {{scripts_path}}/live.mjs
```

Output JSON: `{ ok, serverPort, serverToken, pageFiles, hasProduct, product, productPath, hasDesign, design, designPath, migrated }`.

`serverPort` is the **Impeccable helper** port, NOT the dev server. The browser URL is whatever serves one of `pageFiles`.

If `{ ok: false, error: "config_missing" | "config_invalid" }` → run first-time setup (see live-protocol.md).

## Poll loop dispatch

```
LOOP:
  node {{scripts_path}}/live-poll.mjs
  Read JSON; dispatch on event.type
    "generate"  → Handle Generate; reply done; LOOP
    "accept"    → Handle Accept; carbonize cleanup if required; LOOP
    "discard"   → ack auto; LOOP
    "prefetch"  → Handle Prefetch (mechanics in live-protocol.md); LOOP
    "timeout"   → LOOP
```

Chat is overhead. No recap, no tutorial. Spend tokens on tools + edits.

## Handle Generate (operational)

1. Read screenshot if present
2. Load `reference/<action>.md` (action = the user-picked action: bolder, quieter, animate, etc.)
3. Plan **three distinct directions** (criteria below)
4. Write all variants in one edit (HMR picks up)
5. `--reply done`
6. Resume LOOP

### Three distinct directions criteria

- **Direction 1**: closest-to-current (minimal departure — same aesthetic lane, surface change)
- **Direction 2**: mid-departure (one significant change — color strategy, type pairing, OR layout structure)
- **Direction 3**: high-departure (rethinks structure, palette, or aesthetic lane — must respect register and PRODUCT.md anti-references)

Identity preservation is the default. Departure requires PRODUCT.md anti-reference trigger OR explicit user prompt cue.

## Handle Accept (operational)

- **Plain accept** → terminal immediately, LOOP
- **Carbonize accept** → not yet terminal; run `live-complete.mjs --id EVENT_ID` after cleanup, THEN LOOP. Cleanup mechanics: live-protocol.md.

## Handle Discard

Acknowledgement is auto. LOOP.

## Exit cleanup

See live-protocol.md "Cleanup procedure".

## Routing

FROM `live`, suggest GO TO:

| When live session ends... | Suggest |
|---|---|
| User accepted a variant | `polish` (final pass on the accepted state) |
| User discarded all variants | nothing — exit silently |
| Session interrupted | `live-resume.mjs` first; only suggest external commands after recovery |

STAY in `live` UNTIL: user explicitly exits OR carbonize cleanup completes.

## Anti-patterns

- ❌ Pass short `--timeout=` to live-poll (use default 600s)
- ❌ Use `serverPort` as the URL (it's the helper, not the app)
- ❌ Re-recap PRODUCT/DESIGN bodies in chat (waste)
- ❌ Generate fewer than 3 directions (the slot count is the contract)
- ❌ All 3 directions identical aesthetic lane (defeats the purpose)
- ❌ Polling in background on Cursor/Codex (foreground only)
