//====================================================================
//зум изображения в главном слайдере в карточке товара
//====================================================================
const mainGallery = document.querySelector('.product-gallery__main');
if (mainGallery) {



  // Создаём кнопку "2× zoom", если её нет в разметке
  let zoomBtn = mainGallery.querySelector('.product-gallery__zoom');
  if (!zoomBtn) {
    zoomBtn = document.createElement('button');
    zoomBtn.type = 'button';
    zoomBtn.className = 'product-gallery__zoom';
    zoomBtn.setAttribute('aria-label', 'Увеличить изображение');
    zoomBtn.textContent = '2× zoom';
    mainGallery.appendChild(zoomBtn);

    // Базовые инлайн-стили, чтобы кнопка была видна без правок SCSS
    Object.assign(zoomBtn.style, {
      position: 'absolute',
      right: '8px',
      bottom: '8px',
      zIndex: '3',
      padding: '6px 10px',
      fontSize: '12px',
      lineHeight: '1',
      color: '#111',
      background: 'rgba(255,255,255,.92)',
      border: '1px solid rgba(0,0,0,.12)',
      borderRadius: '12px',
      cursor: 'pointer',
      boxShadow: '0 1px 2px rgba(0,0,0,.08)'
    });
  }

  const defaults = {
    startScale: 2,
    minScale: 1.4,
    maxScale: 3,
    step: 0.16
  };

  let scale = defaults.startScale;
  let zoomOn = false;
  let lastTap = 0;

  // Состояние пинчи-зум на тачах
  const pinch = {
    active: false,
    startDist: 0,
    startScale: defaults.startScale
  };

  function clamp(v, min, max) {
    return Math.min(max, Math.max(min, v));
  }

  function getActiveSlide() {
    return mainGallery.querySelector('.swiper-slide-active') || mainGallery.querySelector('.product-gallery__slide');
  }

  function getActiveImg() {
    const slide = getActiveSlide();
    return slide ? slide.querySelector('.product-gallery__image img') : null;
  }

  function prepareImg(img) {
    if (!img) return;
    // Гарантируем корректную анимацию трансформаций
    if (!img.style.transition) img.style.transition = 'transform 180ms ease-out';
    img.style.willChange = 'transform';
    // Базовое состояние
    if (!zoomOn) {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = '50% 50%';
    }
  }

  function setOriginFromPoint(point) {
    const slide = getActiveSlide();
    const img = getActiveImg();
    if (!slide || !img) return;

    const rect = slide.getBoundingClientRect();
    const x = ((point.x - rect.left) / rect.width) * 100;
    const y = ((point.y - rect.top) / rect.height) * 100;

    img.style.transformOrigin = `${x}% ${y}%`;
  }

  function setOriginFromEvent(e) {
    const slide = getActiveSlide();
    if (!slide) return;

    const rect = slide.getBoundingClientRect();

    // Мышь / одиночный тап
    if (e && e.touches && e.touches.length === 1) {
      setOriginFromPoint({ x: e.touches[0].clientX, y: e.touches[0].clientY });
      return;
    }
    if (e && e.clientX != null) {
      setOriginFromPoint({ x: e.clientX, y: e.clientY });
      return;
    }

    // Центр по умолчанию
    setOriginFromPoint({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
  }

  function applyScale() {
    const img = getActiveImg();
    if (!img) return;
    img.style.transform = `scale(${scale})`;
  }

  function enableZoom(e) {
    const slide = getActiveSlide();
    const img = getActiveImg();
    if (!slide || !img) return;

    prepareImg(img);

    zoomOn = true;
    mainGallery.dataset.zoom = 'on';

    slide.style.overflow = 'hidden';
    slide.style.cursor = 'zoom-out';
    slide.style.touchAction = 'none'; // разрешаем панорамирование на тачах

    setOriginFromEvent(e);
    scale = clamp(scale || defaults.startScale, defaults.minScale, defaults.maxScale);
    applyScale();

    if (zoomBtn) {
      zoomBtn.style.opacity = '0';
      zoomBtn.style.pointerEvents = 'none';
    }
  }

  function disableZoom() {
    const slide = getActiveSlide();
    const img = getActiveImg();

    zoomOn = false;
    mainGallery.dataset.zoom = 'off';

    if (img) {
      img.style.transform = 'scale(1)';
      img.style.transformOrigin = '50% 50%';
    }
    if (slide) {
      slide.style.cursor = 'zoom-in';
      slide.style.touchAction = '';
    }

    scale = defaults.startScale;

    if (zoomBtn) {
      zoomBtn.style.opacity = '';
      zoomBtn.style.pointerEvents = '';
    }
  }

  function toggleZoom(e) {
    zoomOn ? disableZoom() : enableZoom(e);
  }

  function onMove(e) {
    if (!zoomOn) return;

    // Пинч-режим обрабатывается отдельно
    if (pinch.active && e.touches && e.touches.length === 2) return;

    setOriginFromEvent(e);
    if (e.cancelable) e.preventDefault();
  }

  function onWheel(e) {
    if (!zoomOn) return;
    e.preventDefault();
    scale = clamp(
      parseFloat((scale + (e.deltaY < 0 ? defaults.step : -defaults.step)).toFixed(2)),
      defaults.minScale,
      defaults.maxScale
    );
    applyScale();
  }

  function onKey(e) {
    if (e.key === 'Escape') disableZoom();
  }

  function initCursors() {
    const slide = getActiveSlide();
    if (slide && !zoomOn) {
      slide.style.cursor = 'zoom-in';
    }
    const img = getActiveImg();
    if (img) prepareImg(img);
  }

  function attachSwiperHandler(swiperInstance) {
    if (!swiperInstance || attachSwiperHandler._attached) return;
    swiperInstance.on('slideChange', () => {
      disableZoom();
      // подготовить курсор/стили для нового слайда
      setTimeout(initCursors, 0);
    });
    attachSwiperHandler._attached = true;
  }

  // Инициализация начальных стилей
  initCursors();

  // Клики
  mainGallery.addEventListener('click', function (e) {
    const target = e.target;
    if (!(target instanceof Element)) return;

    if (target.closest('.product-gallery__zoom')) {
      e.preventDefault();
      toggleZoom(e);
      return;
    }

    if (target.closest('.product-gallery__slide')) {
      toggleZoom(e);
    }
  });

  // Панорамирование
  mainGallery.addEventListener('mousemove', onMove);
  mainGallery.addEventListener('touchmove', onMove, { passive: false });

  // Масштаб колесом
  mainGallery.addEventListener('wheel', onWheel, { passive: false });

  // Esc для выхода
  document.addEventListener('keydown', onKey);

  // Двойной тап — переключить зум
  mainGallery.addEventListener('touchstart', function (e) {
    const now = Date.now();

    // Пинч старт
    if (e.touches && e.touches.length === 2) {
      const [t1, t2] = e.touches;
      pinch.active = true;
      pinch.startDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      pinch.startScale = zoomOn ? scale : defaults.startScale;

      // Точка между пальцами как origin
      const mid = {
        x: (t1.clientX + t2.clientX) / 2,
        y: (t1.clientY + t2.clientY) / 2
      };
      if (!zoomOn) enableZoom({ clientX: mid.x, clientY: mid.y });
      setOriginFromPoint(mid);
      return;
    }

    // Двойной тап
    if (now - lastTap < 320) {
      toggleZoom(e);
      if (e.cancelable) e.preventDefault();
    }
    lastTap = now;
  }, { passive: true });

  // Пинч-обновление масштаба
  mainGallery.addEventListener('touchmove', function (e) {
    if (!pinch.active || !e.touches || e.touches.length !== 2) return;

    const [t1, t2] = e.touches;
    const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
    const factor = dist / (pinch.startDist || dist);
    scale = clamp(parseFloat((pinch.startScale * factor).toFixed(2)), defaults.minScale, defaults.maxScale);

    const mid = { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
    setOriginFromPoint(mid);
    applyScale();

    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  mainGallery.addEventListener('touchend', function () {
    if (pinch.active) {
      pinch.active = false;
    }
  });

  mainGallery.addEventListener('touchcancel', function () {
    if (pinch.active) {
      pinch.active = false;
    }
  });

  // Привязка к Swiper (когда он появится)
  if (mainGallery.swiper) {
    attachSwiperHandler(mainGallery.swiper);
  } else {
    const checkSwiper = setInterval(() => {
      if (mainGallery.swiper) {
        attachSwiperHandler(mainGallery.swiper);
        clearInterval(checkSwiper);
      }
    }, 120);
    setTimeout(() => clearInterval(checkSwiper), 10000); // страховка, чтобы не крутилось бесконечно
  }

  // На ресайз — освежить стили и курсоры
  window.addEventListener('resize', () => {
    initCursors();
    if (zoomOn) applyScale();
  });

}