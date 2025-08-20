// поле поиска в шапке
const searchBtn = document.querySelector('.form-search__btn');
const searchForm = document.querySelector('.form-search');

if (searchBtn) {
  searchBtn.addEventListener('click',() => {
    searchForm.classList.toggle('_active');
  });
}

//меню бургер
const menuBtn = document.querySelector('.menu__btn');
const menuList = document.querySelector('.menu__list');

if(menuBtn) {
  menuBtn.addEventListener('click', () => {
    menuBtn.classList.toggle('_active');
    if (menuList) {
      menuList.classList.toggle('_active');
    }
  });
}