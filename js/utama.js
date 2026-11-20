(() => {
  'use strict';

  function inisialisasiAplikasiUtama() {
    if (window.clyGerak) {
      window.clyGerak.inisialisasiScrollHalus();
      window.clyGerak.inisialisasiSplitTeks();
    }

    if (window.clyKursor) {
      window.clyKursor.inisialisasiKursorKustom();
    }

    if (window.clyProyek) {
      window.clyProyek.inisialisasiNavigasiProyek();
    }

    if (window.clyGerak) {
      if (document.getElementById('cly--home-view')) {
        window.clyGerak.jalankanAnimasiBeranda();
      } else if (document.getElementById('cly--project-view')) {
        window.clyGerak.jalankanAnimasiDetailProyek();
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiAplikasiUtama, { once: true });
  } else {
    inisialisasiAplikasiUtama();
  }
})();
