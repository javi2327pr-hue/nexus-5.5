<!-- v3 | agente: codex | 2026-05-21 -->
# Clarify (Codex)

```
7 copy laws:
  1. Every word earns its place
  2. No em dashes (also no --)
  3. Voice over voiceover (don't narrate; let UI show)
  4. Specific over generic
  5. Action verbs (no nouns, no generic "Submit"/"OK")
  6. Plain over technical (8th-grade UNLESS audience expects technical)
  7. Honest over salesy

Step 1: Scan all visible strings
  Buttons, labels, errors, empty states, tooltips, loading, confirmations, success

Step 2: Apply rewrite patterns
  Error generic      "An error occurred"        → "[Specific failure]. [Action user can take]."
  Empty state         "No items yet"             → "Add your first [thing] to [outcome]"
  Button verb         "Submit"                   → Specific verb ("Create account")
  Form label          "Email address"            → "Email"
  Form help           "Enter your email"         → none OR specific constraint
  Loading             "Loading..."               → subtle indicator OR "Generating report (12s left)"
  Tooltip             "Click here for more"     → "View invoice history"
  Confirmation        "Are you sure?"            → "Delete this account? This can't be undone."
  Success             "Saved!"                   → subtle/none OR "Saved to <location>"

Step 3: Register-aware
  Brand:   voice carries weight, distinctive phrasings, editorial cadence
  Product: clarity over voice, predictable Linear/Stripe/Figma patterns

Step 4: Verify
  - Scan for em dashes (— and --) → replace
  - Scan for "We" / "Let's" narration → cut
  - Scan for restated headings → cut intros
  - Scan for "Submit"/"OK" buttons → specific verbs

Step 5: Route
  tone-of-voice question      → check PRODUCT.md or /impeccable teach
  empty/error need design     → /impeccable harden
  onboarding copy specifically → /impeccable onboard
  final pass                  → /impeccable polish
```

## Anti-patterns
```
❌ Em dashes anywhere
❌ "We" / "Let's" narration
❌ Genericism in errors/empty
❌ Marketing copy in functional UX
❌ Over-helping ("Here's a tip!")
❌ Restating heading in body intro
❌ Apologizing for user's own actions
```
