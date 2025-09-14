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