<!-- v3 | agente: codex | 2026-05-21 -->
# Cognitive load (Codex special ref)

```
LOAD TYPES:
  Intrinsic   = inherent task difficulty (minimize via UX)
  Extraneous  = noise from presentation (minimize aggressively)
  Germane     = effort to build mental model (support, don't waste)

8 LEVERS:

1. Choice architecture
   - ONE primary action per surface (Hick's Law)
   - Progressive disclosure (don't show all upfront)
   - Sensible defaults

2. Recognition over recall
   - Show, don't make user remember
   - Recently used / suggested visible
   - Autocomplete with history

3. Chunking
   - Group related visually
   - Whitespace + headings (not just borders)
   - 5-9 items per chunk

4. Hierarchy clarity
   - Visual hierarchy = semantic hierarchy
   - Primary first, secondary accessible-de-emphasized
   - Clear focal point per surface

5. Cognitive consistency
   - Same things in same places across surfaces
   - Same actions same look
   - Patterns once-learned stay valid

6. Feedback latency
   <100ms     feels instant (no indicator)
   <1s        feels responsive (subtle indicator)
   1-3s       feels loading (skeleton)
   3s+        feels slow (progress + cancel)

7. Error prevention
   - Constrain inputs (pickers, autocompletes, dropdowns)
   - Confirm destructive OR allow undo (prefer undo)
   - Validate inline AFTER enough info

8. Memory aids
   - Breadcrumbs
   - Persistent state (don't lose work)
   - Recently viewed / pinned
   - Search history

REGISTER:
  Product: aggressive reduction, every decision has cost, reuse patterns
  Brand:   lower load not the goal — engagement is — but noise still hurts

MEASURE (don't eyeball):
  time-on-task, error rate, recovery time, first-action delay, drop-off
  Real metrics > critic opinions

PITFALLS:
  ❌ "More options = more value"
  ❌ Demanding decisions upfront
  ❌ Icons without labels
  ❌ Inconsistent button styles
  ❌ Validation on first keystroke
  ❌ Confirmation modals where undo would work
```
