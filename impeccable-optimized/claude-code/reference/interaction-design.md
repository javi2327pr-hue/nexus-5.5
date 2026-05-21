<!-- v3 | agente: claude-code | 2026-05-21 -->
# Interaction design (domain reference)

Loaded by: `craft`, `harden`, `audit`, `critique` (when forms/inputs/interactivity in scope).

## Forms

### Field design
- Label above the input (never inside as placeholder)
- Placeholder = example, NOT label substitute
- Required vs optional: mark optional, not required (smaller set to mark)
- Inline validation on blur, not on every keystroke (jumpy = bad)
- Error message below field, red text + icon, named cause + fix

### Field types
- Email: `type="email"`, `inputmode="email"`, `autocomplete="email"`
- Phone: `type="tel"`, `inputmode="tel"`, format on blur
- Password: visibility toggle, strength feedback, paste allowed
- Date: prefer date pickers over freeform; provide both for accessibility
- Search: `type="search"`, debounce 200-300ms before triggering query

### Form layout
- Single column for long forms (reduces cognitive load)
- Two column ONLY for related short pairs (e.g., First / Last name)
- Group fields semantically (`<fieldset><legend>` for sets)
- Progressive disclosure: don't show all fields upfront if not needed

## Focus states

- Every interactive element has visible focus
- Focus ring: `outline: 2px solid <accent>; outline-offset: 2px;`
- Don't override default outline without replacing it
- `:focus-visible` for keyboard-only focus
- Color contrast: ≥3:1 between focus ring and surrounding background

## Buttons

### Hierarchy
- One primary action per surface (commit to it)
- Secondary actions look like buttons but visually de-emphasized
- Tertiary actions are text links or icon buttons
- Destructive actions: red/danger color, often require confirmation modal

### Affordance
- Buttons look pressable: subtle border, background, or elevation
- Touch targets ≥44×44 at coarse pointer
- Disabled state: visually distinct (not just opacity)
- Loading state: replace label with spinner OR show in-place progress

## Loading patterns (by duration)

| Duration | Pattern |
|---|---|
| <300ms | Nothing (perception of instant) |
| 300ms-1s | Subtle indicator |
| 1s-3s | Skeleton matching final layout |
| 3s+ | Progress bar + cancel option |
| Indeterminate >5s | Status message ("This is taking longer than expected...") |

## Empty states

See `harden.md` for full coverage. In brief:
- First-run empty: design as CTA
- Filtered-to-empty: explain + offer to clear filter
- Search-no-results: offer search suggestions
- Permission-denied: explain why

## Confirmation patterns

- Reversible actions (delete with undo) > confirmation modal
- Modal confirmation only for destructive + irreversible
- Confirmation copy: name the consequence ("Delete this account? This can't be undone.")
- Default button: SAFE option, not destructive

## Drag & drop

- Visual lift on drag start (translateY + shadow)
- Drop zone clearly indicated (border, background, icon)
- Keyboard alternative for drag operations (a11y)
- Cancel via Escape

## Tooltips & popovers

- Tooltip: short label clarifying icon or shortened text
- Popover: longer help or interactive content
- Delay on hover (300-500ms) to avoid accidental triggers
- Dismiss: click outside OR Escape
- Position: avoid covering target on small screens

## Common pitfalls

- ❌ Placeholder as label (lost on focus)
- ❌ Required asterisk on every field (mark optional instead)
- ❌ Custom focus ring with poor contrast
- ❌ Multiple primary buttons on one surface
- ❌ Spinner for sub-300ms operations (creates perception of slowness)
- ❌ Tooltips with critical info (not discoverable)
- ❌ Drag-only interaction (no keyboard alternative)
