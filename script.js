/**
 * Portfolio Starter Script — Adimas (izumiinyaa)
 */
(() => {
  'use strict';

  /**
   * Keep the footer copyright year up to date automatically.
   */
  function updateCopyrightYear() {
    const yearElement = document.getElementById('year');
    if (yearElement) {
      yearElement.textContent = String(new Date().getFullYear());
    }
  }

  /**
   * Initialize portfolio scripts once the DOM is ready.
   */
  function init() {
    updateCopyrightYear();
    // Add interactive portfolio logic here
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
