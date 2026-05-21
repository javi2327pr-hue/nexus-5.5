<!-- v3 | agente: antigravity | 2026-05-21 -->
# Animate (Antigravity)

## Goal
Add purposeful motion across 3 categories (functional, affordance, delight) following 5 motion laws (no layout animation, ease-out exponential, duration tiers, stagger, reduced-motion).

## Autonomy boundaries
- Apply functional motion (loading, focus, state changes) without asking
- Apply affordance motion (hover, drag, press) without asking
- Apply delight motion (entrance stagger, ONE signature moment) within register guidance
- Respect prefers-reduced-motion with opacity-only fallback (always)
- Do NOT animate CSS layout properties (width/height/top/left/margin)
- Do NOT add bounce/elastic on serious surfaces
- Do NOT add motion without reduced-motion fallback

## Acceptance criteria
1. Functional motion present on all loading/focus/state-change surfaces
2. Affordance motion present on all interactive elements where appropriate
3. Maximum ONE signature delight motion per surface (not multiple)
4. All motion uses transform/opacity/filter/clip-path (never layout properties)
5. All easing is ease-out exponential family (quart/quint/expo)
6. Duration tier matches grouping: 150ms state, 300ms content, 500ms+ entrance only
7. Stagger 30-60ms between siblings when multi-element
8. @media (prefers-reduced-motion: reduce) fallback present
9. Brand register: signature moments OK; Product register: invisible-not-impressive

## Optional checkpoints
- Confirm signature delight moment placement (might dominate visually)
- Confirm scroll-driven reveal triggers (might fire too early/late)
- Otherwise: autonomous

## Inputs / outputs
- Input: target
- Output: diffed motion additions + reduced-motion fallback + performance note

## Success metric
- 0 CSS-layout animations introduced
- 100% motion has reduced-motion fallback
- 0 bounce/elastic on serious surfaces
- 0 cases of "all duration set to 'looks right'" — explicit tier assignment

## Failure mode handling
- Performance impact from stack of motion → suggest optimize
- Motion conflicts with existing animations → STOP, list conflicts, ask user
- User wants bounce/elastic but surface is serious → flag, ask explicit override
