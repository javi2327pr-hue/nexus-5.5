<!-- v3 | agente: claude-code | 2026-05-21 -->
# Shape (Claude Code)

Plan UX and UI before code. Produces a user-confirmed design brief.

## Use this command when

- Standalone: user wants to plan a feature without building yet
- Called from `craft` (Gate 1): always required before code

## Flow

### Phase A — Multi-round discovery

Ask 3-5 targeted questions covering:

1. **Users**: who specifically, in what context
2. **Job**: what they're trying to do, what they bring to the surface, what state of mind
3. **Content**: real content shape (headlines, body length, imagery type, data density)
4. **Visual direction**: brand cues, anti-references, aesthetic lane (if not in PRODUCT.md)
5. **Scope boundaries**: what this feature is NOT

For trivial briefs (clear scope already in PRODUCT.md): compact mode — 3-5 bullets + "confirm or override". Skip the interview.

### Phase B — Visual probe (when available)

If harness has image_gen (Codex): generate 2-3 quick exploratory visuals to lock aesthetic lane before writing the brief. Mark as "probe — not final mock".

### Phase C — Brief assembly

10-section structured brief (full) OR 3-5 compact bullets:

1. **Feature**: one-line summary
2. **Users**: target audience for this specific feature
3. **Job**: what success looks like for them
4. **Content shape**: real content sketches
5. **Visual direction**: aesthetic lane, named anchor references
6. **Recommended References**: which `reference/<domain>.md` files this build needs
7. **Out of scope**: explicit boundaries
8. **Open questions**: ambiguities user must resolve
9. **Success criteria**: how we'll know it works
10. **Risks**: what could go wrong

### Phase D — Confirm

Present brief, STOP, wait for user confirmation/override.

Closing line if Codex (harness with image_gen):
> "Confirm; once locked, I'll run palette + reference questions before mocks."

Closing line otherwise:
> "Confirm or override; once locked, I'll start the build."

## Routing

FROM `shape`, suggest GO TO:

| When... | Suggest |
|---|---|
| User confirms direction | `craft` (resumes if called from craft; runs 4 gates) |
| PRODUCT.md missing/empty | `teach` (auto), then resume |
| User wants visual variants before code | `live` (needs running dev server) |

STAY in `shape` UNTIL: brief is user-confirmed.

## Anti-patterns

- ❌ Padding a clear brief into a long structured one (use compact mode)
- ❌ Skipping the confirm phase ("I'll just build it")
- ❌ Asking >5 discovery questions (rude; trim)
- ❌ Treating shape confirmation as code-green if Codex with image_gen (gates 2-4 still ahead)
