(() => {
  'use strict';

  function muatRingkasanProyek(pathJson) {
    const kontainerSpanduk = document.getElementById('cly--project-banners');
    if (!kontainerSpanduk) return;

    fetch(pathJson)
      .then((responData) => {
        if (!responData.ok) return null;
        return responData.json();
      })
      .then((daftarProyek) => {
        if (!Array.isArray(daftarProyek) || !daftarProyek.length) return;

        daftarProyek.forEach((proyekTunggal) => {
          const tautanSpanduk = kontainerSpanduk.querySelector(
            '[data-project-id="' + proyekTunggal.id + '"]'
          );
          if (!tautanSpanduk) return;

          const elemenJudul = tautanSpanduk.querySelector('.cly--banner-title');
          const elemenGambar = tautanSpanduk.querySelector('.cly--banner-bg');
          if (elemenJudul && proyekTunggal.title) {
            elemenJudul.textContent = proyekTunggal.title;
          }
          if (elemenGambar && proyekTunggal.image) {
            elemenGambar.setAttribute('src', proyekTunggal.image);
          }
        });
      })
      .catch(() => {});
  }

  function inisialisasiNavigasiProyek() {
    const halamanBeranda = document.getElementById('cly--home-view');
    const halamanDetail = document.getElementById('cly--project-view');
    const wadahUtama = halamanBeranda || halamanDetail;

    if (halamanBeranda) {
      const pathJson = halamanBeranda.getAttribute('data-projects-json') || 'data/projects.json';
      muatRingkasanProyek(pathJson);
    }

    document.querySelectorAll('.cly--project-banner, .cly--back-button').forEach((tautanNavigasi) => {
      tautanNavigasi.addEventListener('click', (peristiwaKlik) => {
        if (
          peristiwaKlik.metaKey ||
          peristiwaKlik.ctrlKey ||
          peristiwaKlik.shiftKey ||
          peristiwaKlik.altKey
        ) {
          return;
        }

        const tujuanHref = tautanNavigasi.getAttribute('href');
        if (!tujuanHref) return;

        peristiwaKlik.preventDefault();
        const elemenJudul = tautanNavigasi.querySelector('.cly--banner-title');
        if (window.clyGerak && window.clyGerak.transisiKeluarKeHalaman) {
          window.clyGerak.transisiKeluarKeHalaman(wadahUtama, tujuanHref, elemenJudul);
        } else {
          window.location.href = tujuanHref;
        }
      });
    });
  }

  window.clyProyek = { inisialisasiNavigasiProyek };
})();
