<!-- v3 | agente: antigravity | 2026-05-21 -->
# Optimize (Antigravity)

## Goal
Hit Core Web Vitals targets (LCP ≤2.5s, CLS ≤0.1, INP ≤200ms) and bundle budget (<100KB initial JS) by optimizing loading, bundle, images, rendering, animations.

## Autonomy boundaries
- Measure baseline with Lighthouse + bundle analyzer before changes
- Apply optimization patterns across 5 dimensions
- Audit dependencies (moment → date-fns, lodash → individual)
- Use code splitting on route boundaries
- Use WebP/AVIF + srcset + lazy-below-fold for images
- Use compositor properties only for animations (transform/opacity/filter)
- Virtualize long lists with appropriate library for framework
- Do NOT remove features as "optimization" (that's distill)
- Do NOT optimize for Lighthouse score over real-user metrics
- Do NOT lazy-load above-fold content (defeats LCP)
- Do NOT use `will-change` reflexively

## Acceptance criteria
1. Baseline measured before changes
2. LCP ≤2.5s achieved
3. CLS ≤0.1 achieved
4. INP ≤200ms achieved
5. Initial JS bundle per route <100KB
6. All images: WebP/AVIF + srcset + width/height + lazy-below-fold
7. Critical CSS inlined; non-critical deferred
8. Fonts: font-display: swap + subset + preload primary
9. Long lists virtualized where ≥100 items
10. Animations use only compositor properties

## Optional checkpoints
- Confirm before removing dependencies (might break elsewhere)
- Confirm before changing image formats site-wide (CDN/build implications)
- Confirm before introducing code splitting if not present (routing implications)
- Otherwise: autonomous

## Inputs / outputs
- Input: target (page, route, app)
- Output: optimizations applied + before/after metrics + budget verification

## Success metric
- 100% of changes have measurable improvement (no speculative)
- Targets met across all 5 dimensions
- 0 features removed in name of perf
- 0 above-fold images lazy-loaded

## Failure mode handling
- Cannot hit LCP target without bigger architectural change → STOP, document, suggest broader refactor
- Bundle exceeds budget after audits → escalate, suggest framework choice review
- INP issue is in third-party script → flag, suggest replacement or removal
- Optimization conflicts with brand-specific overdrive moment → ask user to prioritize
