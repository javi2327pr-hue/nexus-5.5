<!-- v3 | agente: antigravity | 2026-05-21 -->
# Personas (Antigravity special ref)

## Applicability
Consulted by: critique (always for persona-based testing), shape (user discovery), onboard (activation moments).

## Constraints
1. Walk 2-3 personas relevant to surface (never 1, never 5+)
2. Include at least one "outsider" persona (skeptic, accessibility user, mobile commuter)
3. Each persona has: name + role + goal + pressure + familiarity + constraints
4. Findings are concrete UX fixes, not opinions
5. Walk personas unlike yourself (you'll always pass your own walkthrough)
6. Custom personas (per product) include pressure + constraints + familiarity — not marketing personas

## Acceptance criteria
1. Persona set chosen explicitly (2-3, register-appropriate)
2. At least one "outsider" persona included
3. Each persona walked through the surface (eyes → primary action → hesitations)
4. Stumble points documented per persona
5. Cross-persona patterns identified
6. Concrete fixes proposed per finding (not "improve UX")

## 8 default personas (use what fits)
- **First Time** — explained in 3s?
- **Returning Pro** — common actions <2 keystrokes?
- **Distracted Manager** — primary status in 3s?
- **Skeptical Reviewer** — what sets this apart in 10s?
- **Mobile Commuter** — 44×44 touch + bright-light readable?
- **Accessibility User** — semantic + focus + ARIA + contrast?
- **Power User** — overrideable + persistent prefs + advanced reachable?
- **Skeptical About AI** — distances from AI-marketing tells + slop test pass?

## Failure modes
- Cannot identify outsider persona for product → flag, suggest mobile + a11y as defaults
- Custom personas in PRODUCT.md read like marketing → push back, demand pressure/constraints/familiarity
- Findings repeat across personas without cross-pattern → re-walk to find what's distinctive vs universal
- "I would do X" instead of persona walk → reject, demand persona pressure-applied
