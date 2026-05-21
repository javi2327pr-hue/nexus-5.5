<!-- v3 | agente: codex | 2026-05-21 -->
# UX writing (Codex domain ref)

```
7 COPY LAWS:
  1. Every word earns place
  2. No em dashes (also no --)
  3. Voice over voiceover (don't narrate, let UI show)
  4. Specific over generic
  5. Action verbs (no "Submit"/"OK"; tie to action)
  6. Plain over technical (8th-grade UNLESS audience expects technical)
  7. Honest over salesy

STRINGS CATALOG (pattern → rewrite):
  Generic error      "An error occurred"        → "[Specific]. [User action]."
  Form error         "Invalid email"            → "Email must include @ and domain"
  Empty state        "No items yet"             → "Add your first [thing] to [outcome]"
  Button verb        "Submit" / "OK"            → Specific verb ("Create account")
  Form label         "Email address"            → "Email"
  Form help          "Enter your email"         → none OR specific constraint
  Tooltip            "More info"                → What "info" specifically is
  Confirmation       "Are you sure?"            → "Delete? This can't be undone."
  Success            "Saved!"                   → subtle/none OR "Saved to <location>"
  Loading            "Loading..."               → indicator OR "Generating report (12s left)"
  Modal title        "Information"              → What modal is about
  Page title         "Welcome"                  → What page actually is

TONE BY SURFACE:
  Serious failures (data loss)     → Clear, accountable, no jokes
  Recoverable errors               → Calm, specific, fix offered
  Empty states                     → Inviting, voice-on
  Success states                   → Subtle, brief
  Marketing                        → On-brand voice
  Settings descriptions            → Clinical, precise
  Onboarding                       → Welcoming, voice-on (not over-helpful)
  Destructive confirmations        → Direct, consequence-named

VOICE BLEEDS WHERE:
  In:  Headlines, onboarding, empty states, marketing
  Out: Serious failures, settings, permission descriptions

REGISTER:
  Brand:   voice carries weight, distinctive, editorial cadence
  Product: clarity over voice, predictable Linear/Stripe/Figma patterns

PITFALLS:
  ❌ Em dashes anywhere
  ❌ "We"/"Let's" narration
  ❌ Genericism in errors
  ❌ Marketing copy in functional UX
  ❌ Over-helping
  ❌ Restating heading in body intro
  ❌ Apologize for user's own actions
  ❌ Cute tone on serious failures
```
