<!-- v3 | agente: antigravity | 2026-05-21 -->
# Interaction design (Antigravity domain ref)

## Applicability
Consulted by: craft, harden, audit, critique (when forms/inputs/interactivity in scope).

## Constraints
1. Label above input always (never placeholder as label)
2. Mark optional, not required (smaller set to mark)
3. Inline validation on blur (not every keystroke)
4. Every interactive element has visible focus ring (contrast ≥3:1)
5. ONE primary button per surface; secondary de-emphasized
6. Touch targets ≥44×44 at coarse pointer
7. Loading patterns match duration tier (<300ms none, 1-3s skeleton, 3s+ progress+cancel)
8. Modal confirmation only for destructive + irreversible (else undo)
9. Drag operations have keyboard alternative
10. Tooltips never carry critical info

## Acceptance criteria for interaction output
1. Forms: label-above, optional-marked, validation-on-blur, semantic grouping
2. Focus states: visible, contrast ≥3:1, `:focus-visible` for keyboard-only
3. Buttons: hierarchy clear, touch targets meet 44×44 coarse pointer
4. Loading patterns match duration tier table
5. Empty states designed as CTAs (per harden.md)
6. Confirmation modals only on destructive irreversible
7. Drag has keyboard alternative
8. Tooltips/popovers dismissible via Escape + click outside

## Failure modes
- User insists on required-asterisks-everywhere → flag pattern but allow override
- Touch target cannot fit 44×44 in dense UI (data table buttons) → expand via hit area, not visual size
- Modal confirmation requested for reversible action → suggest undo pattern instead
- Critical info in tooltip → flag, move to inline or persistent UI
