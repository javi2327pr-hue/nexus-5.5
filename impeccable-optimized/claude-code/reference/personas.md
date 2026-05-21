<!-- v3 | agente: claude-code | 2026-05-21 -->
# Personas (special reference)

Loaded by: `critique` (always for persona-based testing), `shape` (for user discovery), `onboard` (activation moments).

## When to use personas

Walk a persona through a surface to identify where THEY would stumble — not where YOU would. Personas catch what you can't predict from the inside.

## Persona spec (for any persona)

Every persona needs:
- **Name** (memorable, single-word)
- **Role + context** (who they are, what they're doing here)
- **Goal** (what they're trying to accomplish RIGHT NOW)
- **Pressure** (time? attention? cognitive load? mood?)
- **Familiarity** (with the category? with this product? with the conventions?)
- **Constraints** (device? bandwidth? a11y need? language?)

## 8 default personas (use what fits)

### 1. "First Time"
- **Role**: Just heard about the product. Visiting for the first time.
- **Goal**: Understand what this is and whether it's for them — in <30s.
- **Pressure**: Will leave instantly if confused.
- **Familiarity**: Zero.
- **Test**: Does the surface explain what + for-whom within first 3 seconds?

### 2. "Returning Pro"
- **Role**: Daily user, fluent.
- **Goal**: Get in, do the task, get out. Fast.
- **Pressure**: Time. Knows what they want.
- **Familiarity**: Knows the patterns, the shortcuts, the layout.
- **Test**: Are common actions <2 clicks/keystrokes? Does the UI stay out of their way?

### 3. "Distracted Manager"
- **Role**: Reviewing this for a 30-second meeting context.
- **Goal**: Identify the headline + status. Make a decision.
- **Pressure**: Attention split across 4 things.
- **Familiarity**: Knows the domain, not the product.
- **Test**: Is the primary status / decision-point identifiable in 3 seconds?

### 4. "Skeptical Reviewer"
- **Role**: Evaluating against alternatives.
- **Goal**: Find reasons to dismiss.
- **Pressure**: Has 5 other tabs open with competitors.
- **Familiarity**: Knows the category deeply.
- **Test**: What sets THIS apart in the first 10 seconds? Anti-references avoided?

### 5. "Mobile Commuter"
- **Role**: On a phone, on a subway, one hand.
- **Goal**: Complete a specific action.
- **Pressure**: Spotty connection, glare, one-thumb reach.
- **Familiarity**: Variable.
- **Test**: Touch targets 44×44? Below-fold lazy? Reads in bright light?

### 6. "Accessibility User"
- **Role**: Uses screen reader OR keyboard-only OR high-zoom.
- **Goal**: Same as everyone, but through their AT.
- **Pressure**: Accumulated friction from inaccessible web.
- **Familiarity**: Knows what bad looks like.
- **Test**: Semantic HTML? Focus visible? ARIA correct (not over-applied)? Contrast 4.5:1+?

### 7. "Power User Who Wants Customization"
- **Role**: Has been using product long enough to feel constraints.
- **Goal**: Make the product fit THEIR workflow.
- **Pressure**: None — patience, but frustration accumulating.
- **Familiarity**: Expert.
- **Test**: Are constraints overrideable? Are preferences persistent? Are advanced workflows reachable?

### 8. "Skeptical About AI"
- **Role**: Has tried 5 AI tools, all "with sparkles + purple gradients".
- **Goal**: Be convinced this is real.
- **Pressure**: Fatigue, low trust.
- **Familiarity**: Knows the AI-tool clichés.
- **Test**: Does the brand visibly distance itself from AI-marketing tells? Anti-references applied? Slop test pass?

## Custom personas

For products with specific audiences, write 2-3 product-specific personas in PRODUCT.md:
- Replace "First Time" with the specific first-time user
- Replace "Returning Pro" with the specific daily user
- Keep one outsider perspective (skeptic, accessibility user, mobile commuter)

## Persona walkthrough (the actual exercise)

1. Pick 2-3 personas relevant to the surface
2. For each: imagine landing on the surface as this person, with their goal + pressure + familiarity
3. Walk forward step by step (eyes first scan, then primary action, then hesitations)
4. Note where they stumble (information gap, decision paralysis, friction)
5. Compile findings per persona; identify patterns across personas

## Common pitfalls

- ❌ Walking only one persona (catch what's general, miss what's specific)
- ❌ Walking the persona you ARE (you'll always pass — go for personas unlike yourself)
- ❌ Skipping the accessibility persona (entire user segment invisible)
- ❌ Custom personas that read like marketing personas (need pressure + constraints + familiarity)
- ❌ Persona findings as opinions, not concrete UX fixes
