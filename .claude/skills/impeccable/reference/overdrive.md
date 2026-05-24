<!-- v3 | agente: claude-code | 2026-05-21 -->
# Overdrive (Claude Code)

Push interfaces past conventional limits with technically ambitious implementations. Shaders, spring physics, scroll-driven reveals, 60fps animations.

## Use this command when

User says: "wow", "impress", "go all-out", "extraordinary", "show off what's possible", "ambitious".

## Overdrive is NOT

- `delight` (delight = surprise + personality; overdrive = technical spectacle)
- `bolder` (bolder = visual amplification; overdrive = technical complexity)
- Frequent. Use sparingly. ONE overdrive moment per product, max.

## 5 overdrive surfaces

### 1. Hero moment (brand)
The landing's first impression. Examples:
- WebGL with physics that responds to scroll/cursor
- Scroll-driven scene transitions (Lenis + Framer Motion or GSAP)
- Type set as 3D objects, particle simulations
- High-fidelity 3D model with realistic lighting

### 2. Interaction signature (product OR brand)
The moment that makes someone screenshot the product:
- Spring-physics drag with realistic feel
- Procedural sound design tied to interaction
- Cursor-following effects that feel like a tool, not decoration
- Page transitions that morph state (View Transitions API)

### 3. Data visualization (product)
Don't ship the default chart library look. Custom canvas/SVG:
- Realtime streaming with smooth interpolation
- Interactive 3D for spatial data
- Type-as-data (large numbers that compose meaningfully)

### 4. Loading-as-art
Loading is dead time UNLESS overdriven:
- Shader-based progress (custom GLSL fragment)
- Generative art that completes as load completes
- Brand-specific motion language that IS the loading

### 5. Empty state with substance
Make the empty state worth seeing once:
- Procedurally generated illustration (varies per session)
- Interactive scene that previews the populated state

## Technical constraints

- **60fps non-negotiable** — drop frames = failure
- **Respect reduced-motion** — fallback to static
- **Performance budget** — bundle <100KB additional, no main-thread blocking
- **Progressive enhancement** — works without (uglier) on lower-spec devices
- **Cross-browser** — Safari, Firefox, Chrome, Edge tested

## Register-specific overdrive

| Register | Direction |
|---|---|
| **Brand** | Bigger swings allowed. Hero moments, scroll experiences. |
| **Product** | One interaction signature only. Never in critical task paths (cognitive cost). |

## Routing

FROM `overdrive`, suggest GO TO:

| When... | Suggest |
|---|---|
| Performance cost too high | `optimize` |
| Edge cases of effect need hardening | `harden` |
| Final pass | `polish` |
| Want subtle personality instead | `delight` |

STAY in `overdrive` UNTIL: 60fps verified, reduced-motion fallback works, single moment committed.

## Anti-patterns

- ❌ Five overdrive moments (one per product max)
- ❌ <60fps shipped ("close enough")
- ❌ No reduced-motion fallback
- ❌ Overdrive in critical task paths (cognitive cost)
- ❌ Generic shader effects ("oilspill gradient") — should be brand-specific
- ❌ Confusing overdrive with delight (different intent)
