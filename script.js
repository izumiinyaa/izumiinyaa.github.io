(() => {
  'use strict';

  let instansLenisGlobal = null;
  let posisiScrollBeranda = 0;
  let sedangTransisi = false;

  function bolehAnimasiGsap() {
    return (
      typeof gsap !== 'undefined' &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
  }

  function aturPosisiScroll(nilaiY) {
    if (instansLenisGlobal) {
      instansLenisGlobal.scrollTo(nilaiY, { immediate: true });
    }
    window.scrollTo(0, nilaiY);
  }

  function inisialisasiScrollHalus() {
    if (typeof Lenis === 'undefined') return;

    instansLenisGlobal = new Lenis({
      duration: 1.85,
      easing: (faktorTransisi) => Math.min(1, 1.001 - Math.pow(2, -10 * faktorTransisi)),
      wheelMultiplier: 0.82,
      smoothWheel: true,
      smoothTouch: false
    });

    function langkahAnimasiFrame(waktuFrame) {
      instansLenisGlobal.raf(waktuFrame);
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
    const selektorInteraktif = 'a, button, .cly--tool-item';

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

  function bacaParameterProyekUrl() {
    return new URLSearchParams(window.location.search).get('project');
  }

  function bukaHalamanProyek(idProyek, elemenJudulAsal, perbaruiRiwayat) {
    if (sedangTransisi || !idProyek) return;

    const halamanBeranda = document.getElementById('cly--home-view');
    const halamanProyek = document.getElementById('cly--project-view');
    if (!halamanBeranda || !halamanProyek) return;

    const daftarArtikel = halamanProyek.querySelectorAll('.cly--project-detail');
    const artikelDipilih = halamanProyek.querySelector('[data-project-detail="' + idProyek + '"]');
    if (!artikelDipilih) return;

    const koordinatJudulAsal = elemenJudulAsal
      ? elemenJudulAsal.getBoundingClientRect()
      : null;

    if (!halamanBeranda.hidden) {
      posisiScrollBeranda = window.scrollY;
    }

    function tampilkanDetail() {
      halamanBeranda.hidden = true;
      halamanProyek.hidden = false;
      halamanProyek.style.opacity = '1';

      daftarArtikel.forEach((artikelItem) => {
        artikelItem.hidden = artikelItem !== artikelDipilih;
      });

      aturPosisiScroll(0);

      if (perbaruiRiwayat) {
        try {
          history.pushState({ proyek: idProyek }, '', '?project=' + encodeURIComponent(idProyek));
        } catch {}
      }

      if (!bolehAnimasiGsap()) {
        sedangTransisi = false;
        return;
      }

      const elemenJudulTujuan = artikelDipilih.querySelector('.cly--detail-title');
      const linimasaDetail = gsap.timeline({
        onComplete: () => {
          sedangTransisi = false;
        }
      });

      if (elemenJudulTujuan && koordinatJudulAsal) {
        const koordinatJudulTujuan = elemenJudulTujuan.getBoundingClientRect();
        const selisihX = koordinatJudulAsal.left - koordinatJudulTujuan.left;
        const selisihY = koordinatJudulAsal.top - koordinatJudulTujuan.top;
        const rasioSkala = Math.max(
          0.42,
          Math.min(1, koordinatJudulAsal.height / Math.max(1, koordinatJudulTujuan.height))
        );

        linimasaDetail.fromTo(
          elemenJudulTujuan,
          {
            x: selisihX,
            y: selisihY,
            scale: rasioSkala,
            transformOrigin: 'left top',
            opacity: 0.9
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 0.62,
            ease: 'back.out(1.22)',
            clearProps: 'transform,opacity'
          },
          0
        );
      } else if (elemenJudulTujuan) {
        linimasaDetail.fromTo(
          elemenJudulTujuan,
          { opacity: 0, y: 24 },
          {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'back.out(1.3)',
            clearProps: 'transform,opacity'
          },
          0
        );
      }

      const tombolKembali = document.getElementById('cly--back-button');
      const lencanaDetail = artikelDipilih.querySelector('.cly--detail-badge');
      const tagDetail = artikelDipilih.querySelector('.cly--detail-tag');
      const elemenPendukung = [tombolKembali, tagDetail, lencanaDetail].filter(Boolean);

      if (elemenPendukung.length) {
        linimasaDetail.fromTo(
          elemenPendukung,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.42,
            stagger: 0.04,
            ease: 'power3.out',
            clearProps: 'transform,opacity'
          },
          0.1
        );
      }

      const mediaDetail = artikelDipilih.querySelector('.cly--detail-media');
      if (mediaDetail) {
        linimasaDetail.fromTo(
          mediaDetail,
          { opacity: 0, y: 26, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(1.25)',
            clearProps: 'transform,opacity'
          },
          0.18
        );
      }

      const elemenIsi = artikelDipilih.querySelectorAll('.cly--detail-body > *');
      if (elemenIsi.length) {
        linimasaDetail.fromTo(
          elemenIsi,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.48,
            stagger: 0.05,
            ease: 'back.out(1.35)',
            clearProps: 'transform,opacity'
          },
          0.26
        );
      }
    }

    if (elemenJudulAsal && bolehAnimasiGsap() && !halamanBeranda.hidden) {
      sedangTransisi = true;
      gsap.to(halamanBeranda, {
        opacity: 0,
        y: -14,
        duration: 0.2,
        ease: 'power2.in',
        clearProps: 'transform',
        onComplete: tampilkanDetail
      });
    } else {
      tampilkanDetail();
    }
  }

  function tutupHalamanProyek(perbaruiRiwayat) {
    if (sedangTransisi) return;

    const halamanBeranda = document.getElementById('cly--home-view');
    const halamanProyek = document.getElementById('cly--project-view');
    if (!halamanBeranda || !halamanProyek || halamanProyek.hidden) return;

    function tampilkanBeranda() {
      halamanProyek.hidden = true;
      halamanProyek.querySelectorAll('.cly--project-detail').forEach((artikelItem) => {
        artikelItem.hidden = true;
      });
      halamanBeranda.hidden = false;
      aturPosisiScroll(posisiScrollBeranda);

      if (perbaruiRiwayat) {
        try {
          history.pushState({}, '', window.location.pathname);
        } catch {}
      }

      if (bolehAnimasiGsap()) {
        gsap.fromTo(
          halamanBeranda,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            ease: 'back.out(1.25)',
            clearProps: 'transform,opacity',
            onComplete: () => {
              sedangTransisi = false;
            }
          }
        );
      } else {
        halamanBeranda.style.opacity = '1';
        sedangTransisi = false;
      }
    }

    if (bolehAnimasiGsap()) {
      sedangTransisi = true;
      gsap.to(halamanProyek, {
        opacity: 0,
        y: 18,
        duration: 0.22,
        ease: 'power2.in',
        clearProps: 'transform',
        onComplete: tampilkanBeranda
      });
    } else {
      tampilkanBeranda();
    }
  }

  function inisialisasiProyekNavigasi() {
    const daftarTautanProyek = document.querySelectorAll('.cly--project-item');
    const tombolKembali = document.getElementById('cly--back-button');

    daftarTautanProyek.forEach((tautanProyek) => {
      tautanProyek.addEventListener('click', (peristiwaKlik) => {
        peristiwaKlik.preventDefault();
        const idProyek = tautanProyek.getAttribute('data-project-id');
        const elemenJudul = tautanProyek.querySelector('.cly--project-item-title');
        bukaHalamanProyek(idProyek, elemenJudul, true);
      });
    });

    if (tombolKembali) {
      tombolKembali.addEventListener('click', () => {
        tutupHalamanProyek(true);
      });
    }

    window.addEventListener('popstate', () => {
      const idProyekUrl = bacaParameterProyekUrl();
      if (idProyekUrl) {
        bukaHalamanProyek(idProyekUrl, null, false);
        return;
      }
      tutupHalamanProyek(false);
    });

    const idProyekAwal = bacaParameterProyekUrl();
    if (idProyekAwal) {
      bukaHalamanProyek(idProyekAwal, null, false);
    }
  }

  function jalankanAnimasiGsap() {
    if (!bolehAnimasiGsap() || bacaParameterProyekUrl()) return;

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

  function inisialisasiUtama() {
    inisialisasiScrollHalus();
    inisialisasiKursorKustom();
    inisialisasiSplitTeks();
    inisialisasiProyekNavigasi();
    jalankanAnimasiGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiUtama, { once: true });
  } else {
    inisialisasiUtama();
  }
})();
