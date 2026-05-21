<!-- v3 | agente: claude-code | 2026-05-21 -->
# Clarify (Claude Code)

Improve UX copy: error messages, labels, microcopy, instructions. Make interfaces easier to understand.

## Use this command when

User says: "confusing text", "unclear labels", "bad error messages", "hard to follow", "better UX writing".

## The 7 copy laws

1. **Every word earns its place.** Cut filler, intros, restated headings.
2. **No em dashes.** Use commas, colons, semicolons, periods, parentheses. Also not `--`.
3. **Voice over voiceover.** Don't narrate what's happening; let the UI show it.
4. **Specific over generic.** "Something went wrong" → "We couldn't reach the server. Check your connection and try again."
5. **Action over description.** Button = verb (Save, Continue, Delete) — not noun (Save Button) — not generic (Submit, OK).
6. **Plain over technical.** 8th-grade reading level UNLESS the user is here for technical terms (then precise > simple).
7. **Honest over salesy.** Don't promise what the product can't deliver. Don't "value prop" microcopy.

## Common copy patterns + rewrites

| Pattern | ❌ Don't | ✅ Do |
|---|---|---|
| Error generic | "An error occurred" | "[Specific failure]. [Action user can take]." |
| Empty state | "No items yet" | "Add your first [thing] to [outcome]" |
| Button verb | "Submit" | Verb specific to action ("Create account", "Send invite") |
| Form label | "Email address" | "Email" (Address is implied) |
| Form help | "Enter your email" | (None — the label is enough) OR specific constraint ("Work email only") |
| Loading | "Loading..." | (subtle indicator + no text), or "Generating report (12s left)" with progress |
| Tooltip | "Click here for more" | What "more" specifically is, e.g., "View invoice history" |
| Confirmation modal | "Are you sure?" | "Delete this account? This can't be undone." |
| Success | "Saved!" | (subtle, no text) OR "Saved to <location>" |

## Register-specific clarify

| Register | Direction |
|---|---|
| **Brand** | Voice carries weight. Distinctive phrasings allowed. Editorial cadence. |
| **Product** | Clarity over voice. Predictable patterns from Linear/Stripe/Figma. |

## Anti-patterns

- ❌ Em dashes (— or --) anywhere
- ❌ "We" / "Let's" narration ("Let's get started...")
- ❌ Genericism ("It looks like something went wrong")
- ❌ Marketing copy in functional UX surfaces
- ❌ Over-helping ("Here's a tip!")
- ❌ Restating heading in body intro
- ❌ Apologizing for the user's own actions

## Routing

FROM `clarify`, suggest GO TO:

| When... | Suggest |
|---|---|
| Copy fix surfaces tone-of-voice question | re-check PRODUCT.md or run `teach` |
| Empty/error states need design beyond copy | `harden` |
| Onboarding copy specifically | `onboard` |
| Final pass | `polish` |

STAY in `clarify` UNTIL: every visible string passes the 7 copy laws.
