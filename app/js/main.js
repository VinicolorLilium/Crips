"use strict";

document.addEventListener('DOMContentLoaded', () => {
  // поле поиска в шапке
  //===================================================
  const searchBtn = document.querySelector('.form-search__btn');
  const searchForm = document.querySelector('.form-search');

  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      searchForm.classList.toggle('_active');
    });
  }

  //меню бургер
  const menuBtn = document.querySelector('.menu__btn');
  const menuList = document.querySelector('.menu');

  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      menuBtn.classList.toggle('_active');
      if (menuList) {
        menuList.classList.toggle('_active');
      }
    });
  }
  //===================================================
  //динамический адаптив
  //===================================================
  function DynamicAdapt(type) {
    this.type = type;
  }
  DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");
    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }
    this.arraySort(this.оbjects);
    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(this.оbjects, function (item) {
      return '(' + this.type + "-width: " + item.breakpoint + "px)," + item.breakpoint;
    }, this);
    this.mediaQueries = Array.prototype.filter.call(this.mediaQueries, function (item, index, self) {
      return Array.prototype.indexOf.call(self, item) === index;
    });
    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ',');
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];
      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(this.оbjects, function (item) {
        return item.breakpoint === mediaBreakpoint;
      });
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };
  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
    } else {
      //for (let i = 0; i < оbjects.length; i++) {
      for (let i = оbjects.length - 1; i >= 0; i--) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname)) {
          this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
      }
    }
  };
  // Функция перемещения
  DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === 'last' || place >= destination.children.length) {
      destination.insertAdjacentElement('beforeend', element);
      return;
    }
    if (place === 'first') {
      destination.insertAdjacentElement('afterbegin', element);
      return;
    }
    destination.children[place].insertAdjacentElement('beforebegin', element);
  }
  // Функция возврата
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement('beforebegin', element);
    } else {
      parent.insertAdjacentElement('beforeend', element);
    }
  }
  // Функция получения индекса внутри родителя
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };
  // Функция сортировки массива по breakpoint и place 
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return -1;
          }

          if (a.place === "last" || b.place === "first") {
            return 1;
          }

          return a.place - b.place;
        }

        return a.breakpoint - b.breakpoint;
      });
    } else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return 1;
          }

          if (a.place === "last" || b.place === "first") {
            return -1;
          }

          return b.place - a.place;
        }

        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };
  const da = new DynamicAdapt("max");
  da.init();
  //===================================================
  //SPOLLERS
  //==========================================================================
  const spollersArray = document.querySelectorAll('[data-spollers]');
  if (spollersArray.length > 0) {
    //Получаем обычные спойлеры
    const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
      return !item.dataset.spollers.split(",")[0];
    });
    //Инициализация обычных спойлеров
    if (spollersRegular.length > 0) {
      initSpollers(spollersRegular);
    }

    //Получение спойлеров с медиа запросами
    const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
      return item.dataset.spollers.split(",")[0];
    });

    //Инициализация спойлеров с медиа запросами
    if (spollersMedia.length > 0) {
      const breakpointsArray = [];
      spollersMedia.forEach(item => {
        const params = item.dataset.spollers;
        const breakpoint = {};
        const paramsArray = params.split(",");
        breakpoint.value = paramsArray[0];
        breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
        breakpoint.item = item;
        breakpointsArray.push(breakpoint);
      });

      //Получаем уникальные брейкпоинты
      let mediaQueries = breakpointsArray.map(function (item) {
        return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
      });
      mediaQueries = mediaQueries.filter(function (item, index, self) {
        return self.indexOf(item) === index;
      });

      //Работаем с каждым брэйкпоинтом
      mediaQueries.forEach(breakpoint => {
        const paramsArray = breakpoint.split(",");
        const mediaBreakpoint = paramsArray[1];
        const mediaType = paramsArray[2];
        const matchMedia = window.matchMedia(paramsArray[0]);

        //Объекты с нужными условиями
        const spollersArray = breakpointsArray.filter(function (item) {
          if (item.value === mediaBreakpoint && item.type === mediaType) {
            return true;
          }
        });
        //Событие
        matchMedia.addListener(function () {
          initSpollers(spollersArray, matchMedia);
        });
        initSpollers(spollersArray, matchMedia);
      });
    }
    //Инициализация 
    function initSpollers(spollersArray, matchMedia = false) {
      spollersArray.forEach(spollersBlock => {
        spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
        if (matchMedia.matches || !matchMedia) {
          spollersBlock.classList.add('_init');
          initSpollerBody(spollersBlock);
          spollersBlock.addEventListener("click", setSpollerAction);
        } else {
          spollersBlock.classList.remove('_init');
          initSpollerBody(spollersBlock, false);
          spollersBlock.removeEventListener('click', setSpollerAction);
        }
      });
    }

    //Работа с контентом
    function initSpollerBody(spollersBlock, hideSpollerBody = true) {
      const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
      if (spollerTitles.length > 0) {
        spollerTitles.forEach(spollerTitle => {
          if (hideSpollerBody) {
            spollerTitle.removeAttribute('tabindex');
            if (!spollerTitle.classList.contains('_active')) {
              spollerTitle.nextElementSibling.hidden = true;
            }
          } else {
            spollerTitle.setAttribute('tabindex', '-1');
            spollerTitle.nextElementSibling.hidden = false;
          }
        });
      }
    }

    function setSpollerAction(e) {
      const el = e.target;
      if (el.closest('[data-spoller]')) {
        const spollerTitle = el.closest('[data-spoller]');
        const spollersBlock = spollerTitle.closest('[data-spollers]');
        const oneSpoller = spollersBlock.hasAttribute('data-one-spoller');
        if (!spollersBlock.querySelectorAll('._slide').length) {
          if (oneSpoller && !spollerTitle.classList.contains('_active')) {
            hideSpollersBody(spollersBlock);
          }
          spollerTitle.classList.toggle('_active');
          _slideToggle(spollerTitle.nextElementSibling, 500);
        }
        e.preventDefault();
      }
    }

    function hideSpollersBody(spollersBlock) {
      const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
      if (spollerActiveTitle && !spollersBlock.querySelectorAll('._slide').length) {
        spollerActiveTitle.classList.remove('_active');
        _slideUp(spollerActiveTitle.nextElementSibling, 500);
      }
    }
  }
  //==========================================================
  //SlideToggle
  let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.style.transitionProperty = 'height, margin, padding';
      target.style.transitionDuration = duration + 'ms';
      target.style.boxSizing = 'border-box';
      target.style.height = target.offsetHeight + 'px';
      target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      window.setTimeout(() => {
        target.style.display = 'none';
        target.style.removeProperty('height');
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
    }
  }
  let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
      target.style.removeProperty('display');
      let display = window.getComputedStyle(target).display;
      if (display === 'none') display = 'block';
      target.style.display = display;
      let height = target.offsetHeight;
      target.style.overflow = 'hidden';
      target.style.height = 0;
      target.style.paddingTop = 0;
      target.style.paddingBottom = 0;
      target.style.marginTop = 0;
      target.style.marginBottom = 0;
      target.offsetHeight;
      target.style.boxSizing = 'border-box';
      target.style.transitionProperty = "height, margin, padding";
      target.style.transitionDuration = duration + 'ms';
      target.style.height = height + 'px';
      target.style.removeProperty('padding-top');
      target.style.removeProperty('padding-bottom');
      target.style.removeProperty('margin-top');
      target.style.removeProperty('margin-bottom');
      window.setTimeout(() => {
        target.style.removeProperty('height');
        target.style.removeProperty('overflow');
        target.style.removeProperty('transition-duration');
        target.style.removeProperty('transition-property');
      }, duration);
    }
  }

  let _slideToggle = (target, duration = 500) => {
    if (window.getComputedStyle(target).display === 'none') {
      return _slideDown(target, duration);
    } else {
      return _slideUp(target, duration);
    }
  }
  //===================================================
  //слайдер в секции hero
  //===================================================

  const heroSlider = new Swiper('.hero-slider', {
    slidesPerView: 1,
    loop: true,
    speed: 800,
    observer: true,
    observeParents: true,
    fadeEffect: { crossFade: true },
    effect: "fade",
    navigation: {
      nextEl: '.hero-slider__next',
      prevEl: '.hero-slider__prev',
    },
    pagination: {
      el: '.hero-slider__pagination',
    },
    // autoplay: {
    //   delay: 3000,
    //   disableOnInteraction: false,
    // },
  });
  //===================================================
  //кнопка "показать еще" в блоке с товарами на главной странице
  //===================================================
  const showMore = document.querySelector('.show-more');
  const productsLength = document.querySelectorAll('.product-card--carousel').length;
  let items = 8;

  if (showMore) {
    showMore.addEventListener('click', () => {
      items += 4;
      const array = Array.from(document.querySelector('.some-wear__content').children);
      const visItems = array.slice(0, items);

      visItems.forEach(el => el.classList.add('_is-visible'));

      if (visItems.length === productsLength) {
        showMore.style.display = 'none';
      }
    });
  }
  //===================================================
  // слайдер карусели товаров случайно категории
  //===================================================

  const productSlider = new Swiper('.slider-products__content', {

    watchOverflow: true,
    observer: true,
    observeParents: true,
    loop: true,
    centeredSlides: false,
    freeMode: false,
    speed: 800,
    navigation: {
      nextEl: '.slider-products__next',
      prevEl: '.slider-products__prev'
    },
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 14,
      },
      768: {
        slidesPerView: 4,
        spaceBetween: 30,
      },
      1200: {
        slidesPerView: 5,
        slidesPerGroup: 1,
        spaceBetween: 30,
      },
    }
  });
  //===================================================
  //фильтр в каталоге
  //===================================================
  const form = document.querySelector(".filter__form");

  if (form) {
    const activeBlock = document.querySelector(".filter__active");
    const filterResult = document.querySelector(".filter__result");
    const resetBtn = document.querySelector(".filter__reset");
    const applyBtn = document.querySelector(".filter__apply");

    const rangeInputs = document.querySelectorAll(".price-range__input");
    const progress = document.querySelector(".price-range__progress");
    const minLabel = document.querySelector(".price-range__min-label");
    const maxLabel = document.querySelector(".price-range__max-label");
    if (!rangeInputs.length) {
      return;
    }
    const maxRange = rangeInputs[0].max
    const defaultMinValue = parseInt(rangeInputs[0].value, 10);
    const defaultMaxValue = parseInt(rangeInputs[1].value, 10);

    const labelsMap = {
      brand: "Бренд",
      size: "Размер",
      length: "Длина платья",
      color: "Цвет",
      "price-range__min-label": "Цена",
    };

    // -------- Цена --------
    const fmt = (num) => `${Number(num).toFixed(2)} EUR`;

    function updateSlider() {
      let minVal = parseInt(rangeInputs[0].value, 10);
      let maxVal = parseInt(rangeInputs[1].value, 10);

      if (minVal > maxVal) {
        [minVal, maxVal] = [maxVal, minVal];
        rangeInputs[0].value = minVal;
        rangeInputs[1].value = maxVal;
      }

      const minPercent = (minVal / maxRange) * 100;
      const maxPercent = (maxVal / maxRange) * 100;

      progress.style.left = `${minPercent}%`;
      progress.style.width = `${maxPercent - minPercent}%`;

      minLabel.textContent = fmt(minVal);
      maxLabel.textContent = fmt(maxVal);
    }

    rangeInputs.forEach((input) => {
      input.addEventListener("input", updateSlider);
    });

    updateSlider();

    // -------- Активные фильтры --------
    function updateActiveFilters() {
      activeBlock.innerHTML = "";

      const formData = new FormData(form);
      const grouped = {};

      formData.forEach((value, key) => {
        if (key === "price-range__min-label" || key === "price-range__max-label") return;
        if (!grouped[key]) grouped[key] = [];
        grouped[key].push(value);
      });

      const currentMin = parseInt(rangeInputs[0].value, 10);
      const currentMax = parseInt(rangeInputs[1].value, 10);

      grouped["price-range__min-label"] = [`${fmt(currentMin)} – ${fmt(currentMax)}`];

      Object.keys(grouped).forEach((groupKey) => {
        const wrapper = document.createElement("div");
        wrapper.className = "filter__active-group";

        const groupTitle = document.createElement("div");
        groupTitle.className = "filter__active-title";
        groupTitle.textContent = (labelsMap[groupKey] || groupKey) + ":";
        wrapper.appendChild(groupTitle);

        const valuesContainer = document.createElement("div");
        valuesContainer.className = "filter__active-values";

        grouped[groupKey].forEach((val) => {
          const item = document.createElement("span");
          item.className = "filter__active-item";

          if (groupKey === "color") {
            item.innerHTML = `
          <span class="filter__color" style="background-color: #${val};"></span>
          <button type="button" class="filter__remove" data-key="${groupKey}" data-value="${val}"></button>
        `;
          } else {
            item.innerHTML = `
          <span class="filter__active-name">${val}</span>
          <button type="button" class="filter__remove" data-key="${groupKey}" data-value="${val}"></button>
        `;
          }
          valuesContainer.appendChild(item);
        });

        wrapper.appendChild(valuesContainer);
        activeBlock.appendChild(wrapper);
      });
    }

    // -------- Удаление --------
    activeBlock.addEventListener("click", (e) => {
      if (e.target.classList.contains("filter__remove")) {
        const key = e.target.dataset.key;
        const value = e.target.dataset.value;

        if (key === "price-range__min-label" || key === "price-range__max-label") {
          rangeInputs[0].value = defaultMinValue;
          rangeInputs[1].value = defaultMaxValue;
          updateSlider();
        } else {
          const inputs = form.querySelectorAll(`[name="${key}"]`);
          inputs.forEach((input) => {
            if (input.type === "checkbox" && input.value === value) {
              input.checked = false;
            }
          });
        }
        updateActiveFilters();
      }
    });

    // -------- Кнопка "Применить" --------
    applyBtn.addEventListener("click", (e) => {
      e.preventDefault();
      updateActiveFilters();
      filterResult.classList.add("filter__result--visible"); // показываем блок
    });

    // -------- Слушатели --------
    form.addEventListener("input", (e) => {
      if (e.target.classList && e.target.classList.contains("price-range__input")) {
        updateSlider();
      }
    });

    resetBtn.addEventListener("click", () => {
      form.reset();
      updateSlider();
      activeBlock.innerHTML = "";
      filterResult.classList.remove("filter__result--visible");
    });

    //===================================================
    //акардеон в фильтре
    //===================================================

    const filterTitles = document.querySelectorAll('.filter__subtitle');

    if (filterTitles) {
      filterTitles.forEach(filterTitle => {
        filterTitle.addEventListener('click', () => {
          filterTitle.classList.toggle('_active');
        });
      });
    }

    const mq = window.matchMedia('(max-width: 899.98px)');
    // const form = document.querySelector('.filter__form');
    if (!form) return;

    const mobile = form.querySelector('.filter__mobile');
    const toggleBtn = mobile.querySelector('.filter__mobile-toggle');
    const menu = mobile.querySelector('.filter__mobile-menu');
    const label = mobile.querySelector('.filter__mobile-label');

    const groups = Array.from(form.querySelectorAll('.filter__group'));

    // получаем id из модификатора класса .filter__group--XXX
    const getGroupId = (group, i) => {
      const m = group.className.match(/filter__group--([^\s]+)/);
      return m ? m[1] : `group-${i + 1}`;
    };

    // подготовка меню
    const buildMenu = () => {
      if (!menu) return;
      menu.innerHTML = '';
      groups.forEach((group, i) => {
        const legend = group.querySelector('.filter__subtitle');
        const id = getGroupId(group, i);
        group.dataset.group = id;

        const item = document.createElement('li');
        item.className = 'filter__mobile-option';
        item.role = 'option';
        item.dataset.group = id;
        item.textContent = legend ? legend.textContent.trim() : id;
        menu.appendChild(item);
      });
    };

    // показать одну категорию, остальные скрыть (только на мобильном)
    const showGroup = (id) => {
      groups.forEach(g => g.classList.toggle('is-selected', g.dataset.group === id));
      // подпись на кнопке
      const activeItem = menu.querySelector(`.filter__mobile-option[data-group="${id}"]`);
      menu.querySelectorAll('.filter__mobile-option').forEach(li => li.setAttribute('aria-selected', 'false'));
      if (activeItem) activeItem.setAttribute('aria-selected', 'true');
      if (label && activeItem) label.textContent = activeItem.textContent;
    };

    // выбрать первую подходящую (где есть checked), иначе первую
    const chooseInitial = () => {
      const withChecked = groups.find(g => g.querySelector('input:checked'));
      const target = withChecked || groups[0];
      if (target) showGroup(target.dataset.group);
    };

    // открыть/закрыть меню
    const openMenu = () => {
      menu.hidden = false;
      toggleBtn.setAttribute('aria-expanded', 'true');
      mobile.classList.add('is-open');
    };
    const closeMenu = () => {
      menu.hidden = true;
      toggleBtn.setAttribute('aria-expanded', 'false');
      mobile.classList.remove('is-open');
    };

    // события
    if (toggleBtn && menu) {
      toggleBtn.addEventListener('click', () => {
        const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
        expanded ? closeMenu() : openMenu();
      });

      menu.addEventListener('click', (e) => {
        const li = e.target.closest('.filter__mobile-option');
        if (!li) return;
        showGroup(li.dataset.group);
        closeMenu();
      });

      document.addEventListener('click', (e) => {
        if (!mobile.contains(e.target)) closeMenu();
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
      });
    }

    // применение адаптива
    const enableMobile = () => {
      if (!mobile) return;
      mobile.removeAttribute('aria-hidden');
      buildMenu();
      chooseInitial();
    };
    const disableMobile = () => {
      if (!mobile) return;
      mobile.setAttribute('aria-hidden', 'true');
      closeMenu();
      groups.forEach(g => g.classList.remove('is-selected')); // показать все
    };

    const apply = () => (mq.matches ? enableMobile() : disableMobile());
    apply();
    mq.addEventListener('change', apply);
  }

  //========================================
  // галерея товара на странице товара
  //========================================
  const thumbs = document.querySelector('.product-gallery__thumbs');
  const main = document.querySelector('.product-gallery__main');

  // Превью
  if (thumbs && main) {
    const thumbsSlider = new Swiper(thumbs, {
      freeMode: true,
      watchSlidesProgress: true,
      watchSlidesVisibility: true,
    });
    // Основной
    const mainSlider = new Swiper(main, {
      speed: 500,
      effect: 'slide',
      allowTouchMove: true,
      pagination: {
        el: ".swiper-pagination",
      },
      thumbs: { swiper: thumbsSlider }
    });
  }

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
  //========================================================
  //форма в карточке товара
  //========================================================
  const product = document.querySelector('.product-form');

  if (product) {
    const productForm = document.getElementById('productForm');
    const qtyInput = productForm.querySelector('.quantity__input');
    const minusBtn = productForm.querySelector('.quantity__btn--minus');
    const plusBtn = productForm.querySelector('.quantity__btn--plus');

    // Блок, где теперь хранится атрибут data-price
    const priceTotalBox = productForm.querySelector('.price__total');
    const priceEl = document.getElementById('priceTotal');

    const unitPrice = Number(priceTotalBox?.dataset.price ?? 0); // читаем цену отсюда
    const min = Number(qtyInput.min || 1);
    const max = Number(qtyInput.max || 99);

    const formatPrice = (value) =>
      `${value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

    const updatePrice = () => {
      const qty = Number(qtyInput.value || 1);
      priceEl.textContent = formatPrice(unitPrice * qty);
      minusBtn.disabled = qty <= min;
      plusBtn.disabled = qty >= max;
    };

    minusBtn.addEventListener('click', () => {
      const current = Math.max(min, Number(qtyInput.value) - 1);
      qtyInput.value = current;
      updatePrice();
    });

    plusBtn.addEventListener('click', () => {
      const current = Math.min(max, Number(qtyInput.value) + 1);
      qtyInput.value = current;
      updatePrice();
    });

    qtyInput.addEventListener('input', () => {
      let v = parseInt((qtyInput.value || '').replace(/[^\d]/g, ''), 10);
      if (Number.isNaN(v)) v = min;
      v = Math.min(max, Math.max(min, v));
      qtyInput.value = v;
      updatePrice();
    });

    updatePrice();
  }

  const infoTitle = document.querySelector('.product-info__title');
  if (infoTitle) {
    const infoContent = document.querySelector('.product-info__content');
    const pageWidth = document.documentElement.scrollWidth;
    if (pageWidth >= 1100) {
      infoTitle.classList.add('_active');
      infoContent.removeAttribute("hidden");
    }
  }



  //==================================================================
  //преобразование сетки размеров в выпадающий список на тачпаде
  //===============================================================
  const groupSizes = document.querySelector('.product-form__group--sizes');
  if (groupSizes) {

    const listSize = groupSizes.querySelector('.product-form__sizes');
    const radiosSizeInput = Array.from(groupSizes.querySelectorAll('.sizes__input'));
    if (!listSize || !radiosSizeInput.length) return;

    // Сохраняем исходные disabled-состояния, чтобы корректно восстанавливать на десктопе
    const originalDisabled = new WeakMap();
    radiosSizeInput.forEach(r => originalDisabled.set(r, r.disabled));

    // Линкуем select с заголовком
    const heading = groupSizes.querySelector('.product-form__label-row .product-form__label, .product-form__label');
    if (heading && !heading.id) heading.id = 'sizeHeading';

    // Строим select из радио
    const wrap = document.createElement('div');
    wrap.className = 'sizes__select-wrap';

    const select = document.createElement('select');
    select.className = 'sizes__select';
    if (heading) select.setAttribute('aria-labelledby', heading.id);
    select.setAttribute('aria-label', 'Выбор размера');

    radiosSizeInput.forEach(input => {
      const option = document.createElement('option');
      option.value = input.value;

      const label = groupSizes.querySelector(`label[for="${input.id}"]`);
      option.textContent = label ? label.textContent.trim() : input.value;

      if (input.disabled) {
        option.disabled = true;
        option.textContent += ' — нет в наличии';
      }
      if (input.checked) option.selected = true;

      select.appendChild(option);
    });

    wrap.appendChild(select);
    listSize.insertAdjacentElement('afterend', wrap);

    // Синхронизация select -> radios
    select.addEventListener('change', () => {
      const val = select.value;
      const target = radiosSizeInput.find(r => r.value === val);
      if (!target) return;

      // временно включаем, чтобы корректно сработали возможные слушатели
      const wasDisabled = target.disabled;
      const originallyDisabled = originalDisabled.get(target);

      if (wasDisabled && !originallyDisabled) target.disabled = false;
      target.checked = true;
      target.dispatchEvent(new Event('change', { bubbles: true }));
      // возвращаем управление disabled состоянием
      const mql = window.matchMedia('(max-width: 600px)');
      if (mql.matches && !originallyDisabled) target.disabled = true;
      if (!mql.matches) target.disabled = originallyDisabled;
    });

    // Синхронизация radios -> select (на десктопе)
    radiosSizeInput.forEach(r => {
      r.addEventListener('change', () => {
        const checked = radiosSizeInput.find(i => i.checked);
        if (checked) select.value = checked.value;
      });
    });

    // Переключение режимов по брейкпоинту
    const mql = window.matchMedia('(max-width: 600px)');

    function enableMobile() {
      groupSizes.classList.add('js-has-select');
      // избегаем дубля формы: отключаем все радио
      radiosSizeInput.forEach(r => r.disabled = true);
      // submit идёт из select под тем же именем
      select.name = 'size';
    }

    function disableMobile() {
      groupSizes.classList.remove('js-has-select');
      // возвращаем исходные disabled-состояния
      radiosSizeInput.forEach(r => r.disabled = originalDisabled.get(r));
      // name убираем, чтобы не дублировать поле, но select оставляем синхронизированным
      select.removeAttribute('name');

      // на всякий случай синхронизируем текущее значение обратно в радио
      const current = radiosSizeInput.find(r => r.value === select.value);
      if (current && !current.disabled) {
        current.checked = true;
        current.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }

    function apply() {
      if (mql.matches) enableMobile();
      else disableMobile();
    }

    if (mql.addEventListener) mql.addEventListener('change', apply);
    else mql.addListener(apply); // поддержка старых браузеров
    apply();
  }

  //===================================================================
  //валидация формы создания аккаунта
  //===================================================================
  const accountForm = document.getElementById('createAccount');
  console.log(accountForm);
  if (accountForm) {

    const passwordField__inputNode = accountForm.querySelector('#password');
    const passwordField__hintNode = accountForm.querySelector('#passwordHint');
    const passwordField__strengthNode = passwordField__hintNode?.querySelector('.password-strength');

    if (!passwordField__inputNode || !passwordField__hintNode || !passwordField__strengthNode) return;

    // Защита от двойной инициализации
    if (passwordField__inputNode.dataset.jsPasswordHintBound === 'true') return;
    passwordField__inputNode.dataset.jsPasswordHintBound = 'true';

    // Делаем подсказку "живой" для скринридеров
    if (!passwordField__hintNode.hasAttribute('aria-live')) {
      passwordField__hintNode.setAttribute('aria-live', 'polite');
    }

    const passwordStrength__labelsRU = {
      0: 'нет пароля',
      1: 'очень слабый',
      2: 'слабый',
      3: 'средний',
      4: 'хороший',
      5: 'отличный'
    };

    function passwordStrength__computeLevel(pwd) {
      const v = (pwd || '').trim();
      if (!v) return 0;

      let score = 0;

      // Длина (до +3)
      if (v.length >= 8) score += 1;
      if (v.length >= 10) score += 1;
      if (v.length >= 12) score += 1;

      // Разнообразие (до +3)
      const hasLower = /[a-zа-яё]/.test(v);
      const hasUpper = /[A-ZА-ЯЁ]/.test(v);
      const hasDigit = /\d/.test(v);
      const hasSymbol = /[^A-Za-zА-Яа-яЁё0-9]/.test(v);
      const diversity = [hasLower, hasUpper, hasDigit, hasSymbol].filter(Boolean).length;
      if (diversity >= 2) score += 1;
      if (diversity >= 3) score += 1;
      if (diversity === 4) score += 1;

      // Штрафы
      let penalty = 0;
      const lower = v.toLowerCase();
      if (/^(.)\1+$/.test(v)) penalty += 3;           // один и тот же символ
      if (/(.)\1{2,}/.test(v)) penalty += 1;          // тройные повторы
      if (/0123|1234|2345|3456|4567|5678|6789|7890|9876|8765|7654|6543|5432|4321|3210|abcd|bcde|cdef|defg|efgh|fghi|ghij|hijk|ijkl|jklm|klmn|lmno|mnop|nopq|opqr|pqrs|qrst|rstu|stuv|tuvw|uvwx|vwxy|wxyz|qwer|wert|erty|rtyu|tyui|yuio|uiop|asdf|sdfg|dfgh|fghj|ghjk|hjkl|zxcv|xcvb|cvbn|vbnm/i.test(lower)) {
        penalty += 1;                                  // последовательности
      }
      const commonPwds = ['123456', 'qwerty', 'password', '111111', '123123', 'qwertyuiop', 'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'football', 'iloveyou', '000000', '1q2w3e4r', 'zaq12wsx'];
      if (commonPwds.includes(lower)) penalty += 2;    // частые пароли
      if (/^\d+$/.test(v) || /^[A-Za-zА-Яа-яЁё]+$/.test(v)) penalty += 1; // только цифры или только буквы

      const level = Math.max(0, Math.min(5, score - penalty));
      return level;
    }

    function passwordStrength__renderToHint(pwd) {
      const level = passwordStrength__computeLevel(pwd);
      passwordField__strengthNode.dataset.level = String(level);
      passwordField__strengthNode.textContent = passwordStrength__labelsRU[level];
    }

    // Инициализация и live-обновление
    passwordStrength__renderToHint(passwordField__inputNode.value || '');
    passwordField__inputNode.addEventListener('input', (ev) => {
      passwordStrength__renderToHint(ev.currentTarget.value);
    });
  }
});