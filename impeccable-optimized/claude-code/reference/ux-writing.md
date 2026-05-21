<!-- v3 | agente: claude-code | 2026-05-21 -->
# UX writing (domain reference)

Loaded by: `craft`, `clarify`, `onboard`, `harden`, `critique` (when copy in scope).

## The 7 copy laws

1. **Every word earns its place.** Cut filler, intros, restated headings.
2. **No em dashes.** Use commas, colons, semicolons, periods, parentheses. Also not `--`.
3. **Voice over voiceover.** Don't narrate; let the UI show.
4. **Specific over generic.** "Something went wrong" → "We couldn't reach the server. Check your connection and try again."
5. **Action verbs.** "Submit" → "Create account" / "Send invite" / "Delete".
6. **Plain over technical.** 8th-grade reading level UNLESS audience expects technical (then precise > simple).
7. **Honest over salesy.** Don't promise what can't be delivered. No marketing copy in functional UX.

## Strings catalog (patterns + rewrites)

| Surface | ❌ Don't | ✅ Do |
|---|---|---|
| Generic error | "An error occurred" | "[Specific]. [Action user can take]." |
| Form error | "Invalid email" | "Email must include @ and domain" |
| Empty state | "No items yet" | "Add your first [thing] to [outcome]" |
| Button verb | "Submit" / "OK" | Specific verb tied to action |
| Form label | "Email address" | "Email" |
| Form help | "Enter your email" | (None) OR specific constraint |
| Tooltip | "More info" | What "info" specifically is |
| Confirmation | "Are you sure?" | "Delete this account? This can't be undone." |
| Success | "Saved!" | (subtle, no text) OR "Saved to <location>" |
| Loading | "Loading..." | (indicator) OR "Generating report (12s left)" |
| Modal title | "Information" | What the modal is about |
| Page title | "Welcome" | What the page actually is |

## Tone (varies by surface, not by product)

| Surface | Tone |
|---|---|
| Error states (serious, like data loss) | Clear, accountable, no jokes |
| Error states (recoverable, minor) | Calm, specific, fix offered |
| Empty states | Inviting, voice-on |
| Success states | Subtle, brief |
| Marketing surfaces | On-brand voice |
| Settings descriptions | Clinical, precise |
| Onboarding | Welcoming, voice-on (not over-helpful) |
| Confirmations (destructive) | Direct, consequence-named |

## Voice (from PRODUCT.md)

The brand voice is in PRODUCT.md (3 concrete words). Apply consistently in places where personality matters:
- Headlines
- Onboarding copy
- Empty state copy
- Marketing surfaces

Don't bleed voice into:
- Error messages on serious failures
- Settings panels
- Permission descriptions

## Register-specific

| Register | Direction |
|---|---|
| **Brand** | Voice carries weight. Distinctive phrasings. Editorial cadence. |
| **Product** | Clarity over voice. Predictable patterns from Linear/Stripe/Figma. |

## Common pitfalls

- ❌ Em dashes anywhere
- ❌ "We" / "Let's" narration ("Let's get started...")
- ❌ Genericism in errors
- ❌ Marketing copy in functional surfaces
- ❌ Over-helping ("Here's a tip!")
- ❌ Restating heading in body intro
- ❌ Apologizing for user's own actions
- ❌ Cute tone on serious failures
