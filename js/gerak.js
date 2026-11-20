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

  function jalankanAnimasiBeranda() {
    if (!bolehAnimasiGsap()) return;

    const halamanBeranda = document.getElementById('cly--home-view');
    if (!halamanBeranda) return;

    document.body.classList.add('cly--is-entering');

    const linimasaMasuk = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('cly--is-entering');
      }
    });

    const mediaHero = halamanBeranda.querySelector('.cly--hero-media');
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

    const daftarKata = halamanBeranda.querySelectorAll('.cly--split-word');
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

    const daftarGrup = halamanBeranda.querySelectorAll('.cly--link-group');
    daftarGrup.forEach((elemenGrup, indeksGrup) => {
      const waktuMulai = 0.24 + indeksGrup * 0.08;
      const judulGrup = elemenGrup.querySelector('.cly--group-label');
      const paragrafTentang = elemenGrup.querySelector('.cly--about-text');
      const daftarPengalaman = elemenGrup.querySelectorAll('.cly--experience-item');
      const daftarKartu = elemenGrup.querySelectorAll('.cly--link-card');
      const daftarIkonAlat = elemenGrup.querySelectorAll('.cly--tool-item');
      const daftarSpandukProyek = elemenGrup.querySelectorAll('.cly--project-banner');

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

      if (daftarSpandukProyek.length) {
        linimasaMasuk.fromTo(
          daftarSpandukProyek,
          { opacity: 0, y: 18 },
          {
            opacity: 1,
            y: 0,
            duration: 0.58,
            stagger: 0.08,
            ease: 'back.out(1.35)',
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
              each: 0.03,
              grid: [4, 5],
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

  function jalankanAnimasiDetailProyek() {
    if (!bolehAnimasiGsap()) return;

    const halamanDetail = document.getElementById('cly--project-view');
    if (!halamanDetail) return;

    document.body.classList.add('cly--is-entering');

    const linimasaDetail = gsap.timeline({
      onComplete: () => {
        document.body.classList.remove('cly--is-entering');
      }
    });

    const elemenJudulDetail = halamanDetail.querySelector('.cly--detail-title');
    if (elemenJudulDetail) {
      linimasaDetail.fromTo(
        elemenJudulDetail,
        { opacity: 0, y: 56, scale: 0.84, transformOrigin: 'left top' },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.62,
          ease: 'back.out(1.35)',
          clearProps: 'opacity,transform'
        },
        0
      );
    }

    const elemenHeaderPendukung = halamanDetail.querySelectorAll(
      '.cly--back-button, .cly--detail-tag, .cly--detail-badge, .cly--detail-summary'
    );
    if (elemenHeaderPendukung.length) {
      linimasaDetail.fromTo(
        elemenHeaderPendukung,
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.04,
          ease: 'back.out(1.4)',
          clearProps: 'opacity,transform'
        },
        0.1
      );
    }

    const mediaDetail = halamanDetail.querySelector('.cly--detail-media');
    if (mediaDetail) {
      linimasaDetail.fromTo(
        mediaDetail,
        { opacity: 0, y: 24, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.58,
          ease: 'back.out(1.28)',
          clearProps: 'opacity,transform'
        },
        0.18
      );
    }

    const elemenIsiDetail = halamanDetail.querySelectorAll('.cly--detail-body > *');
    if (elemenIsiDetail.length) {
      linimasaDetail.fromTo(
        elemenIsiDetail,
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 0.48,
          stagger: 0.05,
          ease: 'back.out(1.35)',
          clearProps: 'opacity,transform'
        },
        0.26
      );
    }
  }

  function transisiKeluarKeHalaman(elemenUtama, tujuanUrl, elemenFokusJudul) {
    if (!bolehAnimasiGsap() || !elemenUtama) {
      window.location.href = tujuanUrl;
      return;
    }

    const linimasaKeluar = gsap.timeline({
      onComplete: () => {
        window.location.href = tujuanUrl;
      }
    });

    if (elemenFokusJudul) {
      linimasaKeluar.to(
        elemenFokusJudul,
        {
          y: -18,
          duration: 0.24,
          ease: 'back.in(1.4)'
        },
        0
      );
    }

    linimasaKeluar.to(
      elemenUtama,
      {
        opacity: 0,
        y: -16,
        duration: 0.24,
        ease: 'power2.in'
      },
      0.04
    );
  }

  window.clyGerak = {
    bolehAnimasiGsap,
    inisialisasiScrollHalus,
    inisialisasiSplitTeks,
    jalankanAnimasiBeranda,
    jalankanAnimasiDetailProyek,
    transisiKeluarKeHalaman
  };
})();
