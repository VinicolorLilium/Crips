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