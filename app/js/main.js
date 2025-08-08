let searchBtn = document.querySelector('.search-form__btn');
let searchForm = document.querySelector('.search-form');

searchBtn.addEventListener('click', () => {
  searchForm.classList.toggle('_active');
});

let heroSlider = new Swiper(".hero__slider", {
  slidesPerView: 1,
  loop: true,
  speed: 800,
  observer: true,
  observeParents: true,
  fadeEffect: { crossFade: true },
  effect: "fade",
  pagination: {
    el: ".hero__slider-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".hero__slider-next",
    prevEl: ".hero__slider-prev",
  },
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

const featureSlider = new Swiper(".slider-feature", {
  loop: true,
  slidesPerView: 5,
  slidesPerGroup: 3,
  observer: true,
  observeParents: true,
  speed: 800,
  navigation: {
    nextEl: ".slider-feature-next",
    prevEl: ".slider-feature-prev",
  },
});

let filterBtns = document.querySelectorAll('.filter__btn');

if (filterBtns ) {
  filterBtns.forEach(filterBtn => {
    filterBtn.addEventListener('click', () => {
      filterBtn.classList.toggle('_close');
      filterTop = filterBtn.parentElement;
      filterTop.nextElementSibling.classList.toggle('_close');
    });
  });
}