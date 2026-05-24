<!-- v3 | agente: claude-code | 2026-05-21 -->
# Onboard (Claude Code)

Design first-run flows, empty states, activation paths. Guide new users to value.

## Use this command when

User says: "onboarding", "first-time users", "empty states", "activation", "getting started", "new user flow", "aha moment".

## 4 onboarding surfaces

### 1. Welcome / sign-up flow
- Friction = enemy. Cut every field that isn't required to get the user started.
- Social login first; email/password as fallback.
- Single primary path. Multiple paths = decision fatigue.
- Progressive profile: ask for non-critical info LATER, not upfront.

### 2. First-run state (no data yet)
- Empty state designed as a CTA, not a placeholder
- One clear action: create / connect / import / start
- Show a preview of populated state if possible (illustration, demo data)
- Skip "Take a tour" patterns — guide via the actual UI

### 3. Activation moment (the aha)
The first time the user experiences the core value. Examples:
- Notion: first page created
- Linear: first issue moved to "In Progress"
- Stripe: first test payment cleared
- Figma: first frame on the canvas

Identify this moment for YOUR product. Make sure nothing blocks it. Celebrate it (see `delight`).

### 4. Progressive disclosure
After activation, gradually reveal features:
- Contextual tooltips (only when user lands on a new surface)
- Feature announcements (subtle, dismissible, never modal)
- Empty states with hints ("Try [feature] — it does [outcome]")

## Anti-patterns

- ❌ Modal welcome screen with 5 slides (almost always wrong)
- ❌ "Take a tour" pattern (skip rate is ~95%)
- ❌ Demanding profile completion before value
- ❌ Asking for credit card before user sees value
- ❌ Empty state that just says "No items" (use as CTA)
- ❌ Tooltips on every element (overload)

## Register-specific onboard

| Register | Direction |
|---|---|
| **Brand** | Onboarding might be marketing → product handoff (signup is the conversion) |
| **Product** | Single-path, fast, value-first |

## Routing

FROM `onboard`, suggest GO TO:

| When... | Suggest |
|---|---|
| Empty states need design beyond copy | `harden` (empty/error/loading) |
| Onboarding copy specifically | `clarify` |
| Activation celebration | `delight` |
| Final pass | `polish` |

STAY in `onboard` UNTIL: friction cut, activation moment identified + unblocked, empty states are CTAs, progressive disclosure designed.
