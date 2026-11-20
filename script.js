/**
 * Portfolio & Creative Hub Script — Adimas (izumiinyaa)
 */
(() => {
  'use strict';

  /**
   * Progressively reveal sections with a light staggered cadence.
   */
  function initReveal() {
    const items = document.querySelectorAll('[data-reveal]');
    if (!items.length) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      items.forEach((item) => item.classList.add('is-visible'));
      return;
    }

    document.documentElement.classList.add('js-ready');

    requestAnimationFrame(() => {
      items.forEach((item, index) => {
        window.setTimeout(() => {
          item.classList.add('is-visible');
        }, index * 70);
      });
    });
  }

  /**
   * Filter portfolio project cards by category on portfolio.html.
   */
  function initPortfolioFilter() {
    const filterButtons = document.querySelectorAll('.filter-chip[data-filter]');
    const projectCards = document.querySelectorAll('.project-card[data-category]');
    if (!filterButtons.length || !projectCards.length) return;

    filterButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const selected = button.getAttribute('data-filter') || 'all';

        filterButtons.forEach((btn) => {
          const isActive = btn === button;
          btn.classList.toggle('is-active', isActive);
          btn.setAttribute('aria-pressed', String(isActive));
        });

        projectCards.forEach((card) => {
          const categories = (card.getAttribute('data-category') || '').split(/\s+/);
          const matches = selected === 'all' || categories.includes(selected);
          card.hidden = !matches;
        });
      });
    });
  }

  /**
   * Keep the footer copyright year current automatically.
   */
  function updateCopyrightYear() {
    const yearEl = document.getElementById('year');
    if (yearEl) {
      yearEl.textContent = String(new Date().getFullYear());
    }
  }

  function init() {
    updateCopyrightYear();
    initReveal();
    initPortfolioFilter();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
