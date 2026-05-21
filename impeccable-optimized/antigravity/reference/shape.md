<!-- v3 | agente: antigravity | 2026-05-21 -->
# Shape (Antigravity)

## Goal
Produce a user-confirmed design brief that captures users, job, content shape, visual direction, and scope boundaries — sufficient input for `craft` to build with no further discovery.

## Autonomy boundaries
- Choose between compact and full brief mode based on ambiguity in input + PRODUCT.md
- Ask up to 5 discovery questions (full mode); 0 questions if compact mode justified
- On Codex: generate 2-3 visual probe images to lock aesthetic lane before brief
- Do NOT advance to build without explicit user confirmation of the brief
- Do NOT treat shape confirmation as code-green when subsequent gates exist (Codex craft has 4 gates)
- Do NOT pad a clear brief into 10 sections to look thorough

## Acceptance criteria
1. Mode chosen explicitly (compact OR full) — never partial
2. If full: brief contains all 10 sections with substantive content (not placeholders)
3. Visual direction names an aesthetic lane OR anchor references (no generic "modern")
4. Out of scope is explicit (what this feature is NOT)
5. Brief is presented and user has explicit confirm/override opportunity
6. On Codex with image_gen: visual probe ran before brief assembly
7. Closing line matches harness capability (Codex: warn about gates 2-4 ahead; others: confirm = build)
8. Routing suggestion emitted on completion

## Optional checkpoints
- Confirm mode choice if PRODUCT.md gives mixed signals (clear in some areas, vague in others)
- Confirm aesthetic lane if user's input has internal contradictions
- Otherwise: autonomous

## Inputs / outputs
- Input: feature description (string), PRODUCT.md context, register reference
- Output: design brief (compact 3-5 bullets OR 10-section full) + closing-line confirmation prompt

## Success metric
- 100% of briefs receive explicit user confirm/override (never silent advance)
- ≥95% of briefs pass downstream `craft` Gate 1 without rework
- 0 generic visual directions ("modern", "clean", "professional" without anchor)
- 0 padding cases (compact mode used when justified)

## Failure mode handling
- PRODUCT.md missing/empty → STOP, run `teach`, resume
- User answer to discovery question is "I don't know" → AskUserQuestion with constrained options
- Visual probe ambiguous (user can't pick) → ask once with bounded options; if still ambiguous, default to safest lane per register and note in brief
- User insists on direction outside register reference (e.g., editorial-typographic on product brief) → flag, ask for explicit override
