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