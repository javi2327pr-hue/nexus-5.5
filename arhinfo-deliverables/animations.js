/* ═══════════════════════════════════════════════════════════════════════
 * GLOBAL INVE — animations.js
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Vanilla JS (zero dependencies) para animaciones complementarias al
 * brand-globalinve.css. Cargar con <script src="/js/animations.js" defer>
 * antes de </body>.
 *
 * Provee:
 *   1. RotatingHeadline   — palabras que rotan en h1[data-rotating]
 *   2. AnimatedCounter    — counters animados on-scroll (data-count="20000")
 *   3. RevealOnScroll     — clase .visible aplicada cuando elemento entra en viewport
 *   4. ExpandableModule   — accordion + / − (alternativa a <details>)
 *   5. BackToTop          — botón sticky muestra/oculta según scroll
 *
 * Respeta prefers-reduced-motion: si está activado, todo es estático.
 *
 * ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─────────────────────────────────────────────────────────────────────
  // 1. RotatingHeadline
  //    Usage:
  //      <h1>Software de <span data-rotating
  //          data-words='["Punto de Venta","Inventarios","Gestión"]'></span></h1>
  // ─────────────────────────────────────────────────────────────────────
  function initRotatingHeadlines() {
    const targets = document.querySelectorAll('[data-rotating]');
    targets.forEach((el) => {
      let words;
      try {
        words = JSON.parse(el.getAttribute('data-words') || '[]');
      } catch (_) { words = []; }
      if (!words.length) return;

      let i = 0;
      el.textContent = words[i];
      if (reducedMotion) return; // static if reduced motion

      const interval = parseInt(el.getAttribute('data-interval') || '3000', 10);
      const outDuration = 450;

      setInterval(() => {
        el.classList.add('animate-rotate-up-out');
        el.classList.remove('animate-rotate-up-in');
        setTimeout(() => {
          i = (i + 1) % words.length;
          el.textContent = words[i];
          el.classList.remove('animate-rotate-up-out');
          el.classList.add('animate-rotate-up-in');
        }, outDuration);
      }, interval);
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 2. AnimatedCounter
  //    Usage:
  //      <span data-count="20000" data-prefix="+" data-suffix=""
  //            data-duration="2000">0</span>
  // ─────────────────────────────────────────────────────────────────────
  function initAnimatedCounters() {
    const counters = document.querySelectorAll('[data-count]');
    if (!counters.length) return;

    // Si reduced-motion, mostrar valor final directamente
    if (reducedMotion) {
      counters.forEach((el) => {
        const end = parseInt(el.getAttribute('data-count'), 10) || 0;
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        el.textContent = prefix + end.toLocaleString('es') + suffix;
      });
      return;
    }

    const animate = (el) => {
      const end = parseInt(el.getAttribute('data-count'), 10) || 0;
      const duration = parseInt(el.getAttribute('data-duration') || '2000', 10);
      const prefix = el.getAttribute('data-prefix') || '';
      const suffix = el.getAttribute('data-suffix') || '';
      const start = performance.now();

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
        const value = Math.round(end * eased);
        el.textContent = prefix + value.toLocaleString('es') + suffix;
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animate(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    counters.forEach((el) => observer.observe(el));
  }

  // ─────────────────────────────────────────────────────────────────────
  // 3. RevealOnScroll
  //    Usage: agregar class="reveal-on-scroll" a cualquier elemento.
  //    Cuando entre en viewport, recibe .visible (CSS define el efecto).
  // ─────────────────────────────────────────────────────────────────────
  function initRevealOnScroll() {
    const targets = document.querySelectorAll('.reveal-on-scroll');
    if (!targets.length) return;

    if (reducedMotion) {
      targets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    targets.forEach((el) => observer.observe(el));
  }

  // ─────────────────────────────────────────────────────────────────────
  // 4. ExpandableModule
  //    Usage:
  //      <div class="expandable">
  //        <button class="expandable-trigger" aria-expanded="false">
  //          <span class="expandable-emoji">📦</span>
  //          <div class="expandable-text">
  //            <h3>Título</h3>
  //            <p class="expandable-short">Resumen corto</p>
  //          </div>
  //          <span class="expandable-toggle">+</span>
  //        </button>
  //        <div class="expandable-content">
  //          <div><div class="expandable-content-inner">
  //            Contenido largo...
  //          </div></div>
  //        </div>
  //      </div>
  // ─────────────────────────────────────────────────────────────────────
  function initExpandableModules() {
    const modules = document.querySelectorAll('.expandable');
    modules.forEach((mod) => {
      const trigger = mod.querySelector('.expandable-trigger');
      const toggle = mod.querySelector('.expandable-toggle');
      if (!trigger) return;

      trigger.addEventListener('click', () => {
        const isOpen = mod.classList.toggle('open');
        trigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        if (toggle) toggle.textContent = isOpen ? '−' : '+';
      });
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // 5. BackToTop
  //    Usage:
  //      <button class="back-to-top" aria-label="Volver arriba">↑</button>
  // ─────────────────────────────────────────────────────────────────────
  function initBackToTop() {
    const btn = document.querySelector('.back-to-top');
    if (!btn) return;

    const onScroll = () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
    });
  }

  // ─────────────────────────────────────────────────────────────────────
  // Init all
  // ─────────────────────────────────────────────────────────────────────
  function init() {
    initRotatingHeadlines();
    initAnimatedCounters();
    initRevealOnScroll();
    initExpandableModules();
    initBackToTop();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
