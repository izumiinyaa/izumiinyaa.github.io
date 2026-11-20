(() => {
  'use strict';

  function pisahTeksAksesibel(elemenTeks) {
    const teksAsli = elemenTeks.textContent.trim();
    if (!teksAsli) return;

    if (!elemenTeks.getAttribute('aria-label')) {
      elemenTeks.setAttribute('aria-label', teksAsli);
    }

    const daftarKata = teksAsli.split(/\s+/);
    elemenTeks.textContent = '';

    const wadahFragment = document.createDocumentFragment();

    daftarKata.forEach((kataTunggal, indeksKata) => {
      const spanKata = document.createElement('span');
      spanKata.className = 'cly--split-word';
      spanKata.setAttribute('aria-hidden', 'true');
      spanKata.textContent = kataTunggal + (indeksKata < daftarKata.length - 1 ? ' ' : '');
      wadahFragment.appendChild(spanKata);
    });

    elemenTeks.appendChild(wadahFragment);
  }

  function inisialisasiSplitTeks() {
    const elemenDaftarTeks = document.querySelectorAll('[data-split-text]');
    elemenDaftarTeks.forEach((elemenTunggal) => {
      pisahTeksAksesibel(elemenTunggal);
    });
  }

  function muatDataProyek() {
    const kontainerCarousel = document.getElementById('cly--project-carousel');
    if (!kontainerCarousel) return;

    fetch('projects.json')
      .then((responData) => {
        if (!responData.ok) {
          throw new Error('Gagal mengambil data proyek');
        }
        return responData.json();
      })
      .then((daftarProyek) => {
        kontainerCarousel.innerHTML = '';

        daftarProyek.forEach((proyekTunggal) => {
          const kartuProyek = document.createElement('a');
          kartuProyek.className = 'cly--project-card';
          kartuProyek.href = proyekTunggal.link;
          kartuProyek.target = '_blank';
          kartuProyek.rel = 'noopener noreferrer';
          kartuProyek.setAttribute('aria-label', 'Lihat proyek ' + proyekTunggal.title + ' (' + proyekTunggal.tag + ')');

          kartuProyek.innerHTML =
            '<div class="cly--project-cover">' +
              '<img class="cly--project-image" src="' + proyekTunggal.image + '" alt="' + proyekTunggal.title + '" width="360" height="220" loading="lazy">' +
              '<span class="cly--project-tag">' + proyekTunggal.tag + '</span>' +
            '</div>' +
            '<div class="cly--project-info">' +
              '<div class="cly--project-header-row">' +
                '<h3 class="cly--project-title">' + proyekTunggal.title + '</h3>' +
                '<span class="cly--project-date">' + proyekTunggal.date + '</span>' +
              '</div>' +
              '<p class="cly--project-desc">' + proyekTunggal.description + '</p>' +
            '</div>';

          kontainerCarousel.appendChild(kartuProyek);
        });

        jalankanAnimasiKartuProyek();
      })
      .catch(() => {});
  }

  function jalankanAnimasiKartuProyek() {
    const preferensiGerakBerkurang = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (preferensiGerakBerkurang || typeof gsap === 'undefined') return;

    const daftarKartuProyek = document.querySelectorAll('.cly--project-card');
    if (!daftarKartuProyek.length) return;

    gsap.from(daftarKartuProyek, {
      opacity: 0,
      x: 24,
      duration: 0.6,
      stagger: 0.08,
      ease: 'power2.out',
      clearProps: 'all'
    });
  }

  function jalankanAnimasiGsap() {
    const preferensiGerakBerkurang = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (preferensiGerakBerkurang || typeof gsap === 'undefined') return;

    const elemenKataDaftar = document.querySelectorAll('.cly--split-word');
    if (elemenKataDaftar.length) {
      gsap.from(elemenKataDaftar, {
        opacity: 0,
        y: 12,
        duration: 0.55,
        stagger: 0.02,
        ease: 'power2.out',
        clearProps: 'opacity,transform'
      });
    }

    const daftarKartuTautan = document.querySelectorAll('.cly--link-card');
    if (daftarKartuTautan.length) {
      gsap.from(daftarKartuTautan, {
        opacity: 0,
        y: 16,
        duration: 0.5,
        stagger: 0.04,
        ease: 'power2.out',
        delay: 0.15,
        clearProps: 'opacity,transform'
      });
    }

    const daftarJudulGrup = document.querySelectorAll('.cly--group-label');
    if (daftarJudulGrup.length) {
      gsap.from(daftarJudulGrup, {
        opacity: 0,
        duration: 0.4,
        stagger: 0.05,
        ease: 'power1.out',
        delay: 0.1,
        clearProps: 'opacity'
      });
    }
  }

  function inisialisasiUtama() {
    inisialisasiSplitTeks();
    muatDataProyek();
    jalankanAnimasiGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiUtama, { once: true });
  } else {
    inisialisasiUtama();
  }
})();
