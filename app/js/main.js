// поиск в шапке
let searchBtn = document.querySelector('.search-form__btn');
let searchForm = document.querySelector('.search-form');

searchBtn.addEventListener('click', () => {
  searchForm.classList.toggle('_active');
});
// слайдер в секции hero
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
// слайдер в секции slider-feature
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
// сворачивание секций в фильтре
let filterTitles = document.querySelectorAll('.filter-form__title');

if (filterTitles) {
  filterTitles.forEach(filterTitle => {
    filterTitle.addEventListener('click', () => {
      filterTitle.nextElementSibling.classList.toggle('_close');
    });
  });
}
// слайдер выбора цены
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
// итоговый фильтр со всеми выборами, изначально не виден, появляется только при нажатии на кнопу в конце фильтров
const filterChoiceBtn = document.querySelector('#filterChoiceBtn');

if (filterChoiceBtn) {
  filterChoiceBtn.addEventListener('click', () => {
    const filterChoice = document.querySelector('.filter-choice');
    filterChoice.classList.add('_close');
  });
}

const filterFormBtn = document.querySelector('#filterFormBtn');

if (filterFormBtn) {
  filterFormBtn.addEventListener('click', () => {
    const filterChoice = document.querySelector('.filter-choice');
    filterChoice.classList.remove('_close');
  });
}
// слайдер просмотра товара в карточке продукта
const productSlidersVertical = new Swiper('.product-sliders__vertical', {
  observer: true,
  observeParents: true,
  speed: 800,
});

const productSlidersHorizontal = new Swiper('.product-sliders__horizontal', {
  observer: true,
  observeParents: true,
  speed: 800,
  thumbs: {
    swiper: productSlidersVertical,
  },
});

let productsNone = document.querySelectorAll('.product-details__form-checkbox--none');

if (productsNone) {
  productsNone.forEach(productNone => {
    productNone.previousElementSibling.setAttribute("disabled", "");
  });
}
// счетчик количества товара в карточке товара
const productBox = document.querySelector(".product-details__form-quantity");

if (productBox) {
  const pricePerUnit = parseFloat(productBox.dataset.price); // цена из HTML
  const qtyInput = productBox.querySelector("#quantity");
  const totalPrice = productBox.querySelector(".quantity__total-price");
  const btnMinus = productBox.querySelector(".minus");
  const btnPlus = productBox.querySelector(".plus");

  function formatPrice(value) {
    return value.toLocaleString("de-DE", { minimumFractionDigits: 2 }) + " EUR";
  }

  function updateTotal() {
    const qty = parseInt(qtyInput.value);
    const total = qty * pricePerUnit;
    totalPrice.textContent = formatPrice(total);
  }

  btnPlus.addEventListener("click", () => {
    qtyInput.value = parseInt(qtyInput.value) + 1;
    updateTotal();
  });

  btnMinus.addEventListener("click", () => {
    if (parseInt(qtyInput.value) > 1) {
      qtyInput.value = parseInt(qtyInput.value) - 1;
      updateTotal();
    }
  });

  updateTotal();
}