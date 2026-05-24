<!-- v3 | agente: claude-code | 2026-05-21 -->
# Delight (Claude Code)

Add moments of joy, personality, and unexpected touches. Elevate functional → memorable.

## Use this command when

User says: "add polish/personality", "joy", "delight", "memorable", "fun", "feel alive".

## Delight vs animate

- `animate` = motion (functional + affordance + delight categories of motion)
- `delight` = surprise + personality (motion is one way to achieve it, but not the only)

Delight includes copy, illustration, empty states, sound, haptics, easter eggs, micro-celebration moments.

## 5 delight surfaces

### 1. First-meaningful-action moments
The moment a user does the thing the product exists for. Send first message. Save first item. Complete first task. Make that moment SOMETHING:
- Subtle celebration (confetti is cheap; consider color flash, soft sound, micro-haptic on touch)
- Personality in the confirmation copy

### 2. Empty states
Most empty states say "No items yet". The delightful empty state:
- Hints what the populated state could be
- Has a voice (matches PRODUCT.md tone)
- Offers a clear next step
- May include illustration if PRODUCT.md tone permits

### 3. Loading + waiting moments
Loading is often dead time. The delightful loading:
- Communicates progress
- Has personality (a tip, a quote, a custom illustration — never a generic spinner)
- Stays under 3s OR gives clear escape ("This is taking longer than expected. Continue waiting?")

### 4. Error moments
Errors are vulnerability moments. The delightful error:
- Acknowledges what happened, not just "Error"
- Suggests a path forward
- Doesn't blame the user
- Doesn't try to be cute about serious failures (data loss, payment errors)

### 5. Signature interactions
ONE moment per product where the interaction itself is the delight:
- The way Linear toggles an issue status
- The way Notion's slash menu feels
- The way Stripe's amount input animates

Don't add five; add one. Make it specific to what your product does.

## Register-specific delight

| Register | Direction |
|---|---|
| **Brand** | Generous delight — signature moments, copy personality, illustration. |
| **Product** | Surgical delight — celebrate the user's wins, otherwise stay invisible. |

## Anti-patterns

- ❌ Confetti everywhere (cheap)
- ❌ "Delightful" error messages on serious failures (data loss, payment)
- ❌ Five signature interactions (commit to one)
- ❌ Loading screen tips that distract from the actual loading
- ❌ Easter eggs in surfaces with high cognitive load
- ❌ Empty state illustration on every empty state (overuse)

## Routing

FROM `delight`, suggest GO TO:

| When... | Suggest |
|---|---|
| Want technical spectacle | `overdrive` (different intent — push past conventional limits) |
| Want motion specifically | `animate` |
| Copy needs to carry more delight | `clarify` (often clarity IS the delight) |
| Polish after delight | `polish` |
