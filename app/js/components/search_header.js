// поле поиска в шапке
//===================================================

const searchBtn = document.querySelector('.form-search__btn');
const searchForm = document.querySelector('.form-search');

if (searchBtn) {
  searchBtn.addEventListener('click', () => {
    searchForm.classList.toggle('_active');
  });
}