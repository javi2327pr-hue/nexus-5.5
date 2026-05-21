<!-- v3 | agente: codex | 2026-05-21 -->
# Interaction design (Codex domain ref)

```
FORMS:
  Field design:
    - Label ABOVE input (never placeholder as label)
    - Placeholder = example, not substitute
    - Mark OPTIONAL, not required (smaller set)
    - Inline validation on BLUR, not every keystroke
    - Error below field, red + icon, name cause + fix

  Field types:
    Email      type=email, inputmode=email, autocomplete=email
    Phone      type=tel,   inputmode=tel,   format on blur
    Password   visibility toggle + strength + paste allowed
    Date       picker preferred; freeform alt for a11y
    Search     type=search, debounce 200-300ms

  Layout:
    Single column for long forms
    Two column ONLY for related short pairs
    Group with <fieldset><legend>
    Progressive disclosure (don't show all upfront)

FOCUS STATES:
  - Every interactive element visible focus
  - outline: 2px solid <accent>; outline-offset: 2px;
  - Don't override outline without replacement
  - :focus-visible for keyboard-only
  - Contrast ≥3:1 between ring and surrounding

BUTTONS:
  Hierarchy:
    ONE primary per surface
    Secondary look like buttons, de-emphasized
    Tertiary = text links or icon buttons
    Destructive = red/danger, often confirmation modal
  Affordance:
    Pressable look (border / bg / elevation)
    Touch ≥44x44 at coarse pointer
    Disabled visually distinct (not just opacity)
    Loading: replace label with spinner OR in-place progress

LOADING BY DURATION:
  <300ms     → nothing
  300ms-1s   → subtle indicator
  1s-3s      → skeleton matching layout
  3s+        → progress + cancel
  >5s indet  → status message

CONFIRMATION:
  Prefer reversible (delete with undo) > confirmation modal
  Modal only for destructive + irreversible
  Copy names consequence ("Delete? Can't be undone.")
  Default button: SAFE, not destructive

DRAG & DROP:
  Visual lift on drag start
  Drop zone clearly indicated
  Keyboard alternative for a11y
  Cancel via Escape

TOOLTIPS & POPOVERS:
  Tooltip = short label clarifying
  Popover = longer help or interactive
  Hover delay 300-500ms
  Dismiss: click outside OR Escape
  Position avoids covering target on small screens

PITFALLS:
  ❌ Placeholder as label
  ❌ Required asterisks everywhere
  ❌ Custom focus ring with poor contrast
  ❌ Multiple primary buttons
  ❌ Spinner for <300ms ops
  ❌ Tooltips with critical info
  ❌ Drag-only (no keyboard alt)
```
