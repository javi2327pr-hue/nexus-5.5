<!-- v3 | agente: antigravity | 2026-05-21 -->
# UX writing (Antigravity domain ref)

## Applicability
Consulted by: craft, clarify, onboard, harden, critique (when copy in scope).

## Constraints — 7 copy laws
1. Every word earns its place
2. No em dashes (also no `--`)
3. Voice over voiceover (don't narrate; let UI show)
4. Specific over generic
5. Action verbs (no generic "Submit"/"OK")
6. Plain over technical (8th-grade unless audience precision-required)
7. Honest over salesy

## Acceptance criteria for copy output
1. Every visible string passes 7 laws
2. 0 em dashes (both `—` and `--`)
3. 0 generic errors / empty states
4. 0 generic buttons (verb-specific)
5. Labels concise (no redundant words)
6. Form help is specific constraint OR absent
7. Confirmation copy names consequence
8. Success copy is subtle (or absent for sub-second ops)
9. Tone matches surface (serious failures = clear, not cute)

## Voice handling
- Brand voice from PRODUCT.md applied in: headlines, onboarding, empty states, marketing
- Voice bleed avoided in: serious failures, settings panels, permission descriptions
- Brand register: voice carries weight, distinctive phrasings, editorial cadence
- Product register: clarity over voice, predictable patterns

## Failure modes
- PRODUCT.md voice undefined → ask via teach
- User insists on em dashes → flag (they're banned), allow explicit override
- Marketing voice requested in error message → reject, suggest brand-marketing surface instead
- Cute tone on serious failure (data loss, payment) → reject, demand clear
- Hardcoded English strings encountered during i18n project → externalize via harden flow
