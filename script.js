(() => {
  'use strict';

  let instansLenisGlobal = null;
  let daftarProyekGlobal = [];
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

  function amankanHtml(teksMentah) {
    return teksMentah
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function konversiIsiMarkdown(teksIsi) {
    const daftarParagraf = teksIsi.trim().split(/\r?\n\s*\r?\n/);

    return daftarParagraf
      .map((potonganTeks) => {
        const barisBersih = potonganTeks.trim();
        if (!barisBersih) return '';

        if (barisBersih.startsWith('### ')) {
          return '<h3 class="cly--detail-h3">' + amankanHtml(barisBersih.slice(4).trim()) + '</h3>';
        }
        if (barisBersih.startsWith('## ')) {
          return '<h2 class="cly--detail-h2">' + amankanHtml(barisBersih.slice(3).trim()) + '</h2>';
        }
        if (barisBersih.startsWith('> ')) {
          return '<blockquote class="cly--detail-quote">' + amankanHtml(barisBersih.slice(2).trim()) + '</blockquote>';
        }
        return '<p class="cly--detail-p">' + amankanHtml(barisBersih.replace(/\r?\n/g, ' ')) + '</p>';
      })
      .join('');
  }

  function parseMarkdownProyek(teksMarkdown) {
    const daftarBlok = teksMarkdown.split(/\r?\n===\r?\n/);
    const hasilProyek = [];

    daftarBlok.forEach((blokMentah) => {
      const pencocokan = blokMentah
        .trim()
        .match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
      if (!pencocokan) return;

      const metaProyek = {};
      pencocokan[1].split(/\r?\n/).forEach((barisMeta) => {
        const indeksTitikDua = barisMeta.indexOf(':');
        if (indeksTitikDua === -1) return;
        const kunciMeta = barisMeta.slice(0, indeksTitikDua).trim();
        const nilaiMeta = barisMeta.slice(indeksTitikDua + 1).trim();
        metaProyek[kunciMeta] = nilaiMeta;
      });

      if (!metaProyek.id || !metaProyek.title) return;

      hasilProyek.push({
        id: metaProyek.id,
        title: metaProyek.title,
        tag: metaProyek.tag || '',
        badge: metaProyek.badge || 'none',
        image: metaProyek.image || '',
        isiHtml: konversiIsiMarkdown(pencocokan[2] || '')
      });
    });

    return hasilProyek;
  }

  function buatHtmlLencana(jenisLencana, namaKelas) {
    if (jenisLencana === 'partnership') {
      return (
        '<img class="' +
        namaKelas +
        '" src="assets/shake-hands-fill.svg" alt="Official Partner" width="18" height="18">'
      );
    }
    if (jenisLencana === 'verified') {
      return (
        '<img class="' +
        namaKelas +
        '" src="assets/verified-badge-fill.svg" alt="Terverifikasi" width="18" height="18">'
      );
    }
    return '';
  }

  function buatLabelLencana(jenisLencana) {
    if (jenisLencana === 'partnership') return ' mitra resmi';
    if (jenisLencana === 'verified') return ' terverifikasi';
    return '';
  }

  function bukaHalamanProyek(proyekDipilih, elemenJudulAsal, perbaruiRiwayat) {
    if (sedangTransisi || !proyekDipilih) return;

    const halamanBeranda = document.getElementById('cly--home-view');
    const halamanProyek = document.getElementById('cly--project-view');
    if (!halamanBeranda || !halamanProyek) return;

    const koordinatJudulAsal = elemenJudulAsal
      ? elemenJudulAsal.getBoundingClientRect()
      : null;

    if (!halamanBeranda.hidden) {
      posisiScrollBeranda = window.scrollY;
    }

    const htmlLencana = buatHtmlLencana(proyekDipilih.badge, 'cly--detail-badge');
    const htmlGambar = proyekDipilih.image
      ? '<div class="cly--detail-media">' +
          '<img class="cly--detail-image" src="' + amankanHtml(proyekDipilih.image) + '" alt="' + amankanHtml(proyekDipilih.title) + '" width="960" height="600">' +
        '</div>'
      : '';

    function tampilkanDetail() {
      halamanBeranda.hidden = true;
      halamanProyek.hidden = false;
      halamanProyek.style.opacity = '1';

      halamanProyek.innerHTML =
        '<button type="button" class="cly--back-button" aria-label="Kembali ke halaman utama">' +
          '<i class="ri-arrow-left-line" aria-hidden="true"></i>' +
          '<span>Back</span>' +
        '</button>' +
        '<header class="cly--detail-header">' +
          '<span class="cly--detail-tag">' + amankanHtml(proyekDipilih.tag) + '</span>' +
          '<div class="cly--detail-title-row">' +
            '<h1 id="cly--detail-title" class="cly--detail-title">' + amankanHtml(proyekDipilih.title) + '</h1>' +
            htmlLencana +
          '</div>' +
        '</header>' +
        htmlGambar +
        '<div class="cly--detail-body">' +
          proyekDipilih.isiHtml +
        '</div>';

      aturPosisiScroll(0);

      const tombolKembali = halamanProyek.querySelector('.cly--back-button');
      if (tombolKembali) {
        tombolKembali.addEventListener('click', () => {
          tutupHalamanProyek(true);
        });
      }

      if (perbaruiRiwayat) {
        try {
          history.pushState({ proyek: proyekDipilih.id }, '', '?project=' + encodeURIComponent(proyekDipilih.id));
        } catch {}
      }

      if (!bolehAnimasiGsap()) {
        sedangTransisi = false;
        return;
      }

      const elemenJudulTujuan = document.getElementById('cly--detail-title');
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

      const elemenPendukung = halamanProyek.querySelectorAll('.cly--back-button, .cly--detail-tag, .cly--detail-badge');
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

      const mediaDetail = halamanProyek.querySelector('.cly--detail-media');
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

      const elemenIsi = halamanProyek.querySelectorAll('.cly--detail-body > *');
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
      halamanProyek.innerHTML = '';
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

  function bacaParameterProyekUrl() {
    return new URLSearchParams(window.location.search).get('project');
  }

  function muatDataProyek() {
    const kontainerDaftar = document.getElementById('cly--project-list');
    if (!kontainerDaftar) return;

    fetch('projects.md')
      .then((responData) => {
        if (!responData.ok) {
          throw new Error('Gagal mengambil data proyek');
        }
        return responData.text();
      })
      .then((teksMarkdown) => {
        daftarProyekGlobal = parseMarkdownProyek(teksMarkdown);
        const wadahDaftar = document.createDocumentFragment();

        daftarProyekGlobal.forEach((proyekTunggal) => {
          const tautanProyek = document.createElement('a');
          const htmlLencana = buatHtmlLencana(proyekTunggal.badge, 'cly--title-badge');
          const labelStatus = buatLabelLencana(proyekTunggal.badge);

          tautanProyek.className = 'cly--link-card cly--project-item';
          tautanProyek.href = '?project=' + encodeURIComponent(proyekTunggal.id);
          tautanProyek.setAttribute('role', 'listitem');
          tautanProyek.setAttribute(
            'aria-label',
            'Buka detail proyek ' + proyekTunggal.title + labelStatus
          );

          tautanProyek.innerHTML =
            '<div class="cly--card-main">' +
              '<span class="cly--card-text">' +
                '<span class="cly--card-title-row">' +
                  '<span class="cly--card-title cly--project-item-title">' + amankanHtml(proyekTunggal.title) + '</span>' +
                  htmlLencana +
                '</span>' +
                '<span class="cly--card-handle">' + amankanHtml(proyekTunggal.tag) + '</span>' +
              '</span>' +
            '</div>' +
            '<i class="ri-arrow-right-line cly--card-arrow" aria-hidden="true"></i>';

          tautanProyek.addEventListener('click', (peristiwaKlik) => {
            peristiwaKlik.preventDefault();
            const elemenJudul = tautanProyek.querySelector('.cly--project-item-title');
            bukaHalamanProyek(proyekTunggal, elemenJudul, true);
          });

          wadahDaftar.appendChild(tautanProyek);
        });

        kontainerDaftar.replaceChildren(wadahDaftar);

        const idProyekAwal = bacaParameterProyekUrl();
        if (idProyekAwal) {
          const proyekAwal = daftarProyekGlobal.find((item) => item.id === idProyekAwal);
          if (proyekAwal) {
            bukaHalamanProyek(proyekAwal, null, false);
          }
        }
      })
      .catch(() => {});
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

  function inisialisasiNavigasiRiwayat() {
    window.addEventListener('popstate', () => {
      const idProyekUrl = bacaParameterProyekUrl();
      if (idProyekUrl) {
        const proyekCocok = daftarProyekGlobal.find((item) => item.id === idProyekUrl);
        if (proyekCocok) {
          bukaHalamanProyek(proyekCocok, null, false);
          return;
        }
      }
      tutupHalamanProyek(false);
    });
  }

  function inisialisasiUtama() {
    inisialisasiScrollHalus();
    inisialisasiKursorKustom();
    inisialisasiSplitTeks();
    muatDataProyek();
    inisialisasiNavigasiRiwayat();
    jalankanAnimasiGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiUtama, { once: true });
  } else {
    inisialisasiUtama();
  }
})();
