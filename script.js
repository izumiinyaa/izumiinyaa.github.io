(() => {
  'use strict';

  function inisialisasiAnimasiMuncul() {
    const elemenDaftar = document.querySelectorAll('[data-reveal]');
    if (!elemenDaftar.length) return;

    const preferensiGerakBerkurang = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (preferensiGerakBerkurang) {
      elemenDaftar.forEach((elemenTunggal) => {
        elemenTunggal.classList.add('cly--is-visible');
      });
      return;
    }

    document.documentElement.classList.add('cly--js-ready');

    requestAnimationFrame(() => {
      elemenDaftar.forEach((elemenTunggal, indeksUrutan) => {
        window.setTimeout(() => {
          elemenTunggal.classList.add('cly--is-visible');
        }, indeksUrutan * 70);
      });
    });
  }

  function inisialisasiUtama() {
    inisialisasiAnimasiMuncul();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiUtama, { once: true });
  } else {
    inisialisasiUtama();
  }
})();
