(() => {
  'use strict';

  function bolehAnimasiGsap() {
    return (
      typeof gsap !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function inisialisasiScrollHalus() {
    if (typeof Lenis === 'undefined') return;

    const instansLenis = new Lenis({
      duration: 1.85,
      easing: (faktorTransisi) => Math.min(1, 1.001 - Math.pow(2, -10 * faktorTransisi)),
      wheelMultiplier: 0.82,
      smoothWheel: true,
      smoothTouch: false
    });

    function langkahAnimasiFrame(waktuFrame) {
      instansLenis.raf(waktuFrame);
      requestAnimationFrame(langkahAnimasiFrame);
    }

    requestAnimationFrame(langkahAnimasiFrame);
  }

  function inisialisasiKursorKustom() {
    const elemenPenunjuk = document.getElementById('cly--cursor-pointer');
    const elemenPendamping = document.getElementById('cly--cursor-companion');
    if (!elemenPenunjuk || !elemenPendamping) return;

    const kueriDesktop = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!kueriDesktop.matches) return;

    document.body.classList.add('cly--has-custom-cursor');

    const jarakSumbuX = 22;
    const jarakSumbuY = 18;
    const kekakuanPegas = 0.14;
    const redamanPegas = 0.72;
    const selektorInteraktif = 'a, .cly--tool-item';

    let targetX = -120;
    let targetY = -120;
    let posisiX = -120;
    let posisiY = -120;
    let kecepatanX = 0;
    let kecepatanY = 0;
    let sudahMuncul = false;
    let pegasBerjalan = false;

    function perbaruiPegasPendamping() {
      const tujuanX = targetX + jarakSumbuX;
      const tujuanY = targetY + jarakSumbuY;

      kecepatanX = (kecepatanX + (tujuanX - posisiX) * kekakuanPegas) * redamanPegas;
      kecepatanY = (kecepatanY + (tujuanY - posisiY) * kekakuanPegas) * redamanPegas;

      posisiX += kecepatanX;
      posisiY += kecepatanY;

      const sudutMiring = Math.max(-16, Math.min(16, kecepatanX * 1.15));
      elemenPendamping.style.transform =
        'translate3d(' +
        posisiX.toFixed(2) +
        'px, ' +
        posisiY.toFixed(2) +
        'px, 0) rotate(' +
        sudutMiring.toFixed(2) +
        'deg)';

      const sisaJarak = Math.abs(tujuanX - posisiX) + Math.abs(tujuanY - posisiY);
      const sisaKecepatan = Math.abs(kecepatanX) + Math.abs(kecepatanY);

      if (sisaJarak > 0.15 || sisaKecepatan > 0.15) {
        requestAnimationFrame(perbaruiPegasPendamping);
      } else {
        pegasBerjalan = false;
      }
    }

    function hidupkanPegas() {
      if (!pegasBerjalan) {
        pegasBerjalan = true;
        requestAnimationFrame(perbaruiPegasPendamping);
      }
    }

    function aturStatusKelas(namaKelas, aktif) {
      elemenPenunjuk.classList.toggle(namaKelas, aktif);
      elemenPendamping.classList.toggle(namaKelas, aktif);
    }

    window.addEventListener('mousemove', (peristiwaMouse) => {
      targetX = peristiwaMouse.clientX;
      targetY = peristiwaMouse.clientY;

      elemenPenunjuk.style.transform =
        'translate3d(' + (targetX - 4) + 'px, ' + (targetY - 2.5) + 'px, 0)';

      if (!sudahMuncul) {
        sudahMuncul = true;
        posisiX = targetX + jarakSumbuX;
        posisiY = targetY + jarakSumbuY;
        elemenPendamping.style.transform =
          'translate3d(' + posisiX + 'px, ' + posisiY + 'px, 0)';
        aturStatusKelas('cly--is-active', true);
      }

      const targetInteraktif = peristiwaMouse.target instanceof Element
        ? peristiwaMouse.target.closest(selektorInteraktif)
        : null;
      aturStatusKelas('cly--is-hover', Boolean(targetInteraktif));

      hidupkanPegas();
    });

    document.addEventListener('mouseleave', () => {
      aturStatusKelas('cly--is-active', false);
    });

    document.addEventListener('mouseenter', () => {
      if (sudahMuncul) {
        aturStatusKelas('cly--is-active', true);
      }
    });

    window.addEventListener('mousedown', () => {
      aturStatusKelas('cly--is-pressed', true);
    });

    window.addEventListener('mouseup', () => {
      aturStatusKelas('cly--is-pressed', false);
    });
  }

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
    document.querySelectorAll('[data-split-text]').forEach(pisahTeksAksesibel);
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
        const wadahKartu = document.createDocumentFragment();

        daftarProyek.forEach((proyekTunggal) => {
          const kartuProyek = document.createElement('div');
          const labelStatus = proyekTunggal.verified ? ' terverifikasi' : '';
          const lencanaTerverifikasi = proyekTunggal.verified
            ? '<img class="cly--verified-badge" src="assets/verified-badge-fill.svg" alt="Terverifikasi" width="18" height="18">'
            : '';

          kartuProyek.className = 'cly--project-card cly--is-entering-card';
          kartuProyek.setAttribute('role', 'group');
          kartuProyek.setAttribute(
            'aria-label',
            proyekTunggal.title + labelStatus + ' - ' + proyekTunggal.tag
          );

          kartuProyek.innerHTML =
            '<div class="cly--project-cover">' +
              '<img class="cly--project-image" src="' + proyekTunggal.image + '" alt="' + proyekTunggal.title + '" width="420" height="520" loading="lazy">' +
              '<div class="cly--project-overlay">' +
                '<span class="cly--project-tag">' + proyekTunggal.tag + '</span>' +
                '<div class="cly--project-title-row">' +
                  '<h3 class="cly--project-title">' + proyekTunggal.title + '</h3>' +
                  lencanaTerverifikasi +
                '</div>' +
              '</div>' +
            '</div>';

          wadahKartu.appendChild(kartuProyek);
        });

        kontainerCarousel.replaceChildren(wadahKartu);
        jalankanAnimasiKartuProyek();
      })
      .catch(() => {});
  }

  function jalankanAnimasiKartuProyek() {
    const daftarKartuProyek = document.querySelectorAll('.cly--project-card');
    if (!daftarKartuProyek.length) return;

    if (!bolehAnimasiGsap()) {
      daftarKartuProyek.forEach((kartuTunggal) => {
        kartuTunggal.classList.remove('cly--is-entering-card');
      });
      return;
    }

    gsap.fromTo(
      daftarKartuProyek,
      {
        opacity: 0,
        x: 36
      },
      {
        opacity: 1,
        x: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: 'back.out(1.4)',
        clearProps: 'opacity,transform',
        onComplete: () => {
          daftarKartuProyek.forEach((kartuTunggal) => {
            kartuTunggal.classList.remove('cly--is-entering-card');
          });
        }
      }
    );
  }

  function jalankanAnimasiGsap() {
    if (!bolehAnimasiGsap()) return;

    document.body.classList.add('cly--is-entering');

    const linimasaMasuk = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('cly--is-entering');
      }
    });

    const mediaHero = document.querySelector('.cly--hero-media');
    if (mediaHero) {
      linimasaMasuk.fromTo(
        mediaHero,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.65,
          ease: 'back.out(1.3)',
          clearProps: 'opacity,transform'
        },
        0
      );
    }

    const judulHero = document.getElementById('cly--hero-title');
    if (judulHero) {
      linimasaMasuk.fromTo(
        judulHero,
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'back.out(1.8)',
          clearProps: 'opacity,transform'
        },
        0.08
      );
    }

    const daftarKata = document.querySelectorAll('.cly--split-word');
    if (daftarKata.length) {
      linimasaMasuk.fromTo(
        daftarKata,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.018,
          ease: 'back.out(1.6)',
          clearProps: 'opacity,transform'
        },
        0.12
      );
    }

    const daftarGrup = document.querySelectorAll('.cly--link-group');
    daftarGrup.forEach((elemenGrup, indeksGrup) => {
      const waktuMulai = 0.24 + indeksGrup * 0.08;
      const judulGrup = elemenGrup.querySelector('.cly--group-label');
      const paragrafTentang = elemenGrup.querySelector('.cly--about-text');
      const daftarPengalaman = elemenGrup.querySelectorAll('.cly--experience-item');
      const daftarKartu = elemenGrup.querySelectorAll('.cly--link-card');
      const daftarIkonAlat = elemenGrup.querySelectorAll('.cly--tool-item');

      if (judulGrup) {
        linimasaMasuk.fromTo(
          judulGrup,
          { opacity: 0, y: 10 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: 'power3.out',
            clearProps: 'opacity,transform'
          },
          waktuMulai
        );
      }

      if (paragrafTentang) {
        linimasaMasuk.fromTo(
          paragrafTentang,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'back.out(1.4)',
            clearProps: 'opacity,transform'
          },
          waktuMulai + 0.05
        );
      }

      if (daftarPengalaman.length) {
        linimasaMasuk.fromTo(
          daftarPengalaman,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.055,
            ease: 'back.out(1.5)',
            clearProps: 'opacity,transform'
          },
          waktuMulai + 0.05
        );
      }

      if (daftarKartu.length) {
        linimasaMasuk.fromTo(
          daftarKartu,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.52,
            stagger: 0.055,
            ease: 'back.out(1.6)',
            clearProps: 'opacity,transform'
          },
          waktuMulai + 0.05
        );
      }

      if (daftarIkonAlat.length) {
        linimasaMasuk.fromTo(
          daftarIkonAlat,
          { opacity: 0, y: 14 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: {
              each: 0.035,
              grid: [3, 5],
              from: 'start'
            },
            ease: 'back.out(1.85)',
            clearProps: 'opacity,transform'
          },
          waktuMulai + 0.05
        );
      }
    });
  }

  function inisialisasiUtama() {
    inisialisasiScrollHalus();
    inisialisasiKursorKustom();
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
