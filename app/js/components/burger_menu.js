//меню бургер
//===================================================

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