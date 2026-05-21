<!-- v3 | agente: antigravity | 2026-05-21 -->
# Color and contrast (Antigravity domain ref)

## Applicability
Consulted by: craft, colorize, polish, critique, audit, live (color action).

## Constraints
1. OKLCH only; never `#000` or `#fff`
2. Chroma 0.005-0.01 at lightness extremes (anything higher reads garish)
3. All neutrals tinted toward brand hue
4. Color strategy picked explicitly from: Restrained / Committed / Full palette / Drenched
5. "≤10% accent" rule applies to Restrained only
6. Dark vs light decided via physical-scene sentence (write it; if doesn't force answer, add detail)
7. Contrast measured (not eyeballed): 4.5:1 body, 3:1 large/UI
8. Category-default palettes rejected (dark-blue observability, navy-gold finance, etc.)
9. No gradient text (absolute ban — `background-clip: text` decorative)

## Acceptance criteria for color output
1. All values in OKLCH (or hex/rgb if legacy with note)
2. All neutrals tinted toward brand hue
3. Color strategy named explicitly (one of 4)
4. Theme decision backed by physical-scene sentence
5. Contrast measurements documented
6. Category reflex check passed
7. Theme switch (if applicable) respects prefers-color-scheme + user override

## Reflex-reject category palettes
- Observability → dark blue + neon
- Healthcare → white + teal
- Finance → navy + gold
- Crypto → neon on black
- AI tools → purple gradient
- Sustainability → green

## Failure modes
- Contrast cannot meet threshold within chosen palette → adjust lightness, re-verify
- Brand has identity color outside reflex-reject → identity-preservation wins; don't second-guess
- Theme switch breaks layouts → fix layouts, don't bypass theme
- Eyeballed contrast claim → reject, demand measurement
