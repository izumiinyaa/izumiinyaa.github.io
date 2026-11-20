(() => {
  'use strict';

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
    const elemenKursor = document.getElementById('cly--custom-cursor');
    if (!elemenKursor) return;

    const kueriDesktop = window.matchMedia('(pointer: fine) and (hover: hover)');
    if (!kueriDesktop.matches) return;

    document.body.classList.add('cly--has-custom-cursor');

    let koordinatX = -100;
    let koordinatY = -100;
    let animasiAktif = false;

    function perbaruiPosisiKursor() {
      elemenKursor.style.transform =
        'translate3d(' + (koordinatX - 5) + 'px, ' + (koordinatY - 13) + 'px, 0)';
      animasiAktif = false;
    }

    window.addEventListener('mousemove', (peristiwaMouse) => {
      koordinatX = peristiwaMouse.clientX;
      koordinatY = peristiwaMouse.clientY;

      if (!elemenKursor.classList.contains('cly--is-active')) {
        elemenKursor.classList.add('cly--is-active');
      }

      if (!animasiAktif) {
        animasiAktif = true;
        requestAnimationFrame(perbaruiPosisiKursor);
      }
    });

    document.addEventListener('mouseleave', () => {
      elemenKursor.classList.remove('cly--is-active');
    });

    document.addEventListener('mouseenter', () => {
      elemenKursor.classList.add('cly--is-active');
    });

    window.addEventListener('mousedown', () => {
      elemenKursor.classList.add('cly--is-pressed');
    });

    window.addEventListener('mouseup', () => {
      elemenKursor.classList.remove('cly--is-pressed');
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
          const kartuProyek = document.createElement('div');
          kartuProyek.className = 'cly--project-card';
          kartuProyek.setAttribute('role', 'group');
          kartuProyek.setAttribute('aria-label', proyekTunggal.title + ' - ' + proyekTunggal.tag);

          kartuProyek.innerHTML =
            '<div class="cly--project-cover">' +
              '<img class="cly--project-image" src="' + proyekTunggal.image + '" alt="' + proyekTunggal.title + '" width="420" height="520" loading="lazy">' +
              '<div class="cly--project-overlay">' +
                '<span class="cly--project-tag">' + proyekTunggal.tag + '</span>' +
                '<h3 class="cly--project-title">' + proyekTunggal.title + '</h3>' +
              '</div>' +
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
      x: 32,
      duration: 0.65,
      stagger: 0.09,
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

  function inisialisasiGeserDesktop() {
    const kontainerCarousel = document.getElementById('cly--project-carousel');
    if (!kontainerCarousel) return;

    let sedangMenggeser = false;
    let posisiXAwal = 0;
    let posisiScrollAwal = 0;
    let kecepatanScroll = 0;
    let posisiXSebelumnya = 0;
    let waktuFrameSebelumnya = 0;

    kontainerCarousel.addEventListener('mousedown', (peristiwaMouse) => {
      sedangMenggeser = true;
      kontainerCarousel.classList.add('cly--is-dragging');
      posisiXAwal = peristiwaMouse.clientX;
      posisiScrollAwal = kontainerCarousel.scrollLeft;
      posisiXSebelumnya = peristiwaMouse.clientX;
      waktuFrameSebelumnya = performance.now();
      kecepatanScroll = 0;
    });

    window.addEventListener('mousemove', (peristiwaMouse) => {
      if (!sedangMenggeser) return;
      peristiwaMouse.preventDefault();

      const posisiXSaatIni = peristiwaMouse.clientX;
      const waktuSekarang = performance.now();
      const selisihWaktu = Math.max(1, waktuSekarang - waktuFrameSebelumnya);
      const selisihX = posisiXSaatIni - posisiXSebelumnya;

      kecepatanScroll = selisihX / selisihWaktu;
      posisiXSebelumnya = posisiXSaatIni;
      waktuFrameSebelumnya = waktuSekarang;

      const jarakGeser = posisiXSaatIni - posisiXAwal;
      kontainerCarousel.scrollLeft = posisiScrollAwal - jarakGeser;
    });

    function selesaiMenggeser() {
      if (!sedangMenggeser) return;
      sedangMenggeser = false;
      kontainerCarousel.classList.remove('cly--is-dragging');

      if (Math.abs(kecepatanScroll) > 0.15) {
        let inersiaKecepatan = kecepatanScroll * -18;
        function jalankanInersiaScroll() {
          if (Math.abs(inersiaKecepatan) < 0.5 || sedangMenggeser) return;
          kontainerCarousel.scrollLeft += inersiaKecepatan;
          inersiaKecepatan *= 0.92;
          requestAnimationFrame(jalankanInersiaScroll);
        }
        requestAnimationFrame(jalankanInersiaScroll);
      }
    }

    window.addEventListener('mouseup', selesaiMenggeser);
  }

  function inisialisasiUtama() {
    inisialisasiScrollHalus();
    inisialisasiKursorKustom();
    inisialisasiSplitTeks();
    muatDataProyek();
    inisialisasiGeserDesktop();
    jalankanAnimasiGsap();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inisialisasiUtama, { once: true });
  } else {
    inisialisasiUtama();
  }
})();
