<!-- v3 | agente: claude-code | 2026-05-21 -->
# Typography (domain reference)

Loaded by: `craft`, `typeset`, `polish`, `critique`, `live` (when typography action selected).

## Font selection procedure (every project, never skip)

1. **Write 3 concrete brand-voice words.** Not "modern" or "elegant" — physical-object words like "warm + mechanical + opinionated" or "calm + clinical + careful".
2. **List 3 reflex fonts.** If any are on the reflex-reject list (below), discard.
3. **Browse a real catalog** with the three words in mind: Google Fonts, Pangram Pangram, Future Fonts, Adobe Fonts, ABC Dinamo, Klim, Velvetyne. Find the font for the brand as a *physical object* (museum caption, 1970s terminal manual, fabric label, mid-century diner receipt).
4. **Cross-check.** "Elegant" ≠ serif. "Technical" ≠ sans. "Warm" ≠ Fraunces. If final pick = original reflex, start over.

## Reflex-reject list (training-data defaults)

Fraunces · Newsreader · Lora · Crimson · Crimson Pro · Crimson Text · Playfair Display · Cormorant · Cormorant Garamond · Syne · IBM Plex Mono · IBM Plex Sans · IBM Plex Serif · Space Mono · Space Grotesk · Inter · DM Sans · DM Serif Display · DM Serif Text · Outfit · Plus Jakarta Sans · Instrument Sans · Instrument Serif

## Pairing voice

Distinctive + refined. Specific shape depends on brand:

| Brand type | Pairing shape |
|---|---|
| Editorial / long-form / luxury | Display serif + sans body |
| Tech / dev tools / fintech | One committed sans; weight contrast inside family |
| Consumer / food / travel | Humanist sans + script or display serif |
| Industrial / utility | Geometric sans + mono for technical labels |
| Cultural / arts | One distinctive type-as-identity, weights only |

## Hierarchy through scale + weight

- Modular scale ratio: 1.25 (minor third) / 1.333 (perfect fourth) / 1.5 (perfect fifth)
- Weight contrast between hierarchy steps: ≥1.25 ratio (e.g., 400/700, 300/900)
- Compress middle, expand extremes — big bigger, small smaller

## Line settings by role

| Role | Size | Line height | Letter spacing |
|---|---|---|---|
| Display | clamp(2.5rem, 7vw, 4.5rem) | 0.95-1.05 | -1% to -2% |
| Headline | clamp(1.75rem, 4vw, 2.5rem) | 1.1-1.2 | -0.5% to -1% |
| Title | clamp(1.125rem, 2.5vw, 1.75rem) | 1.2-1.3 | 0 |
| Body lead | 1.0625rem | 1.65 | 0 |
| Body | 1rem | 1.5-1.65 | 0 |
| Caption | 0.875rem | 1.5 | 0 |
| Micro / label | 0.6875-0.75rem | 1.4-1.5 | 5-10% |

## Line length

- Body prose: 65-75ch
- Headlines / display: unconstrained
- Tabular / data: minimum readable column width

## OpenType features

| Context | Feature | Purpose |
|---|---|---|
| Data tables | `tnum` | Tabular numerals (align) |
| Prose numbers | `lnum` or `pnum` | Proportional or lining |
| Body prose | `liga` | Standard ligatures |
| Display serif | `dlig` | Discretionary ligatures |
| Book-like | hanging punctuation | Optical alignment |
| Multi-script | `case` | Case-sensitive forms |

## Brand register vs product register

| | Brand | Product |
|---|---|---|
| Family count | 1-2 with intent | 1 sans family |
| Display use | Aggressive contrast | Subdued, predictable |
| Numbers | Lining default | Tabular default |
| Reflex-reject | Strict apply | Relax (Inter on product is fine) |
