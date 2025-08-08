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

const rangeMin = document.getElementById("range-min");
const rangeMax = document.getElementById("range-max");
const minLabel = document.getElementById("min-price-label");
const maxLabel = document.getElementById("max-price-label");
const track = document.querySelector(".filter__range-track");

if (rangeMin && rangeMax && minLabel && maxLabel && track) {
  const minGap = 1; // минимальный зазор

  function updateTrack() {
    let minVal = parseInt(rangeMin.value);
    let maxVal = parseInt(rangeMax.value);

    if (maxVal - minVal < minGap) {
      if (this.id === "range-min") {
        rangeMin.value = maxVal - minGap;
      } else {
        rangeMax.value = minVal + minGap;
      }
      minVal = parseInt(rangeMin.value);
      maxVal = parseInt(rangeMax.value);
    }

    minLabel.textContent = `${minVal}.00 EUR`;
    maxLabel.textContent = `${maxVal}.00 EUR`;

    const range = parseInt(rangeMax.max) - parseInt(rangeMin.min);
    const left = ((minVal - rangeMin.min) / range) * 100;
    const right = 100 - ((maxVal - rangeMax.min) / range) * 100;

    track.style.background = `linear-gradient(
      to right,
      lightgray ${left}%,
      black ${left}%,
      black ${100 - right}%,
      lightgray ${100 - right}%
    )`;
  }

  rangeMin.addEventListener("input", updateTrack);
  rangeMax.addEventListener("input", updateTrack);

  // Отрисовка при загрузке с дефолтными значениями из HTML
  updateTrack();
}


