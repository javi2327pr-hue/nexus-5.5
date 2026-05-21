<!-- v3 | agente: codex | 2026-05-21 -->
# Typography (Codex domain ref)

```
FONT SELECTION (every project):
  1. Write 3 brand-voice words (physical-object terms, not "modern"/"elegant")
  2. List 3 reflex fonts → if on reflex-reject list, discard
  3. Browse real catalog (Google Fonts, Pangram Pangram, Klim, Velvetyne, Future Fonts, ABC Dinamo)
  4. Cross-check: final ≠ reflex; if so, restart

REFLEX-REJECT LIST:
  Fraunces, Newsreader, Lora, Crimson*, Playfair Display, Cormorant*,
  Syne, IBM Plex*, Space Mono, Space Grotesk, Inter, DM Sans, DM Serif*,
  Outfit, Plus Jakarta Sans, Instrument*

PAIRING BY BRAND TYPE:
  Editorial/luxury:    display serif + sans body
  Tech/dev/fintech:    one committed sans, weight contrast within
  Consumer/food/travel: humanist sans + script or display serif
  Industrial/utility:  geometric sans + mono for labels
  Cultural/arts:       one type-as-identity, weights only

HIERARCHY:
  Modular scale: 1.25 / 1.333 / 1.5
  Weight contrast ≥1.25 between steps
  Compress middle, expand extremes

LINE SETTINGS:
  Role         Size                              Line-height   Letter-spacing
  Display      clamp(2.5rem,7vw,4.5rem)         0.95-1.05     -1% to -2%
  Headline     clamp(1.75rem,4vw,2.5rem)        1.1-1.2       -0.5% to -1%
  Title        clamp(1.125rem,2.5vw,1.75rem)    1.2-1.3       0
  Body lead    1.0625rem                         1.65          0
  Body         1rem                              1.5-1.65      0
  Caption      0.875rem                          1.5           0
  Micro/label  0.6875-0.75rem                    1.4-1.5       5-10%

LINE LENGTH:
  Body prose:       65-75ch
  Headlines/display: unconstrained
  Tabular/data:      min readable column width

OPENTYPE:
  Tables           → tnum
  Prose numbers    → lnum or pnum
  Body prose       → liga
  Display serif    → dlig
  Book-like        → hanging punctuation
  Multi-script     → case

REGISTER:
  Brand:   1-2 families with intent, aggressive contrast, strict reflex-reject
  Product: 1 sans family, subdued, tabular default, Inter on product is OK
```
