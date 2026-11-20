(() => {
  'use strict';

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

  window.clyKursor = { inisialisasiKursorKustom };
})();
