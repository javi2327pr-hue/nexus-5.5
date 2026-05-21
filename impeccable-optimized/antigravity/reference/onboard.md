<!-- v3 | agente: antigravity | 2026-05-21 -->
# Onboard (Antigravity)

## Goal
Design first-run flows that minimize friction, identify and unblock the activation moment (aha), and progressively disclose features after activation. Empty states are CTAs, not placeholders.

## Autonomy boundaries
- Cut fields not required for getting started
- Use social login first, email/password fallback
- Single primary path through signup
- Defer non-critical profile data to later
- Identify activation moment specific to product (not generic)
- Use progressive disclosure post-activation
- Do NOT use modal welcome screens
- Do NOT use "Take a tour" patterns
- Do NOT demand profile completion before value
- Do NOT use empty states that just say "No items"

## Acceptance criteria
1. Sign-up fields cut to minimum (justification for each)
2. Social login first if applicable
3. Activation moment identified for this product (not template)
4. Path from sign-up to activation has 0 unnecessary blockers
5. Every empty state is a CTA (named action + outcome)
6. Progressive disclosure designed for post-activation features
7. No modal welcome with multi-slide flow
8. No tooltips/feature announcements as blocking modals

## Optional checkpoints
- Confirm activation moment if not obvious from PRODUCT.md
- Confirm before removing existing onboarding patterns (signal vs spam)
- Otherwise: autonomous

## Inputs / outputs
- Input: target (sign-up flow, empty state, first-run experience)
- Output: redesigned flow + activation map + progressive disclosure plan

## Success metric
- Sign-up completion ≥80% (vs friction-heavy baselines)
- Activation rate ≥40% of sign-ups within session 1
- 0 modal welcome flows
- 100% empty states are CTAs
- 0 "Take a tour" prompts

## Failure mode handling
- Cannot identify aha moment for product → ask user explicitly
- Required fields are external constraints (compliance, payment) → flag, can't cut
- Empty state lacks data to suggest CTA → propose generic action with placeholder
- Activation requires multi-step flow that can't be shortened → design first step well, defer rest
