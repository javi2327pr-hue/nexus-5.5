<!-- v3 | agente: antigravity | 2026-05-21 -->
# Typography (Antigravity domain ref)

## Applicability
Consulted by: craft, typeset, polish, critique, live (typography action). NOT loaded by SKILL.md root — loaded only when one of those commands invokes typography work.

## Constraints applied to any typography work

1. Font selection: write 3 brand-voice words → list reflex fonts → discard if on reflex-reject list → browse catalog with words → cross-check
2. Reflex-reject list strictly applied on brand register; relaxed on product (Inter/Plex acceptable for product UI)
3. Modular scale ratio: 1.25 / 1.333 / 1.5
4. Weight contrast ≥1.25 between hierarchy steps
5. Body line length 65-75ch
6. Line-height varies by role (display 0.95-1.05, body 1.5-1.65)
7. OpenType features applied per context (tnum for tables, liga for body, hanging punctuation for book-like)
8. Letter spacing tightens on display (-1% to -2%), opens on micro (+5-10%)

## Acceptance criteria for typography output
1. Font choice cross-checked against reflex-reject list
2. Pairing matches brand type (editorial/tech/consumer/industrial/cultural)
3. Hierarchy uses scale + weight contrast (≥1.25)
4. Line settings tabulated by role
5. Line length within 65-75ch for body
6. OT features applied where applicable
7. Register-appropriate (brand vs product)

## Reflex-reject list (training-data defaults)
Fraunces, Newsreader, Lora, Crimson*, Playfair Display, Cormorant*, Syne, IBM Plex*, Space Mono/Grotesk, Inter, DM Sans, DM Serif*, Outfit, Plus Jakarta Sans, Instrument*

## Failure modes
- All reflex-list fonts on brand → push back, demand catalog browsing
- Flat weight scale → flag, recommend amplification
- Body >75ch → hard reject, fix container width
- Inter on brand without justification → flag as reflex, ask for override
