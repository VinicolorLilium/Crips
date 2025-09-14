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
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});