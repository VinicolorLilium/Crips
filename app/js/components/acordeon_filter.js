//===================================================
//акардеон в фильтре
//===================================================
  const filterTitles = document.querySelectorAll('.filter__subtitle');

  if (filterTitles) {
    filterTitles.forEach(filterTitle => {
      filterTitle.addEventListener('click', () => {
        filterTitle.classList.toggle('_active');
      });
    });
  }

  const mq = window.matchMedia('(max-width: 899.98px)');
  // const form = document.querySelector('.filter__form');
  if (!form) return;

  const mobile = form.querySelector('.filter__mobile');
  const toggleBtn = mobile.querySelector('.filter__mobile-toggle');
  const menu = mobile.querySelector('.filter__mobile-menu');
  const label = mobile.querySelector('.filter__mobile-label');

  const groups = Array.from(form.querySelectorAll('.filter__group'));

  // получаем id из модификатора класса .filter__group--XXX
  const getGroupId = (group, i) => {
    const m = group.className.match(/filter__group--([^\s]+)/);
    return m ? m[1] : `group-${i + 1}`;
  };

  // подготовка меню
  const buildMenu = () => {
    if (!menu) return;
    menu.innerHTML = '';
    groups.forEach((group, i) => {
      const legend = group.querySelector('.filter__subtitle');
      const id = getGroupId(group, i);
      group.dataset.group = id;

      const item = document.createElement('li');
      item.className = 'filter__mobile-option';
      item.role = 'option';
      item.dataset.group = id;
      item.textContent = legend ? legend.textContent.trim() : id;
      menu.appendChild(item);
    });
  };

  // показать одну категорию, остальные скрыть (только на мобильном)
  const showGroup = (id) => {
    groups.forEach(g => g.classList.toggle('is-selected', g.dataset.group === id));
    // подпись на кнопке
    const activeItem = menu.querySelector(`.filter__mobile-option[data-group="${id}"]`);
    menu.querySelectorAll('.filter__mobile-option').forEach(li => li.setAttribute('aria-selected', 'false'));
    if (activeItem) activeItem.setAttribute('aria-selected', 'true');
    if (label && activeItem) label.textContent = activeItem.textContent;
  };

  // выбрать первую подходящую (где есть checked), иначе первую
  const chooseInitial = () => {
    const withChecked = groups.find(g => g.querySelector('input:checked'));
    const target = withChecked || groups[0];
    if (target) showGroup(target.dataset.group);
  };

  // открыть/закрыть меню
  const openMenu = () => {
    menu.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    mobile.classList.add('is-open');
  };
  const closeMenu = () => {
    menu.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    mobile.classList.remove('is-open');
  };

  // события
  if (toggleBtn && menu) {
    toggleBtn.addEventListener('click', () => {
      const expanded = toggleBtn.getAttribute('aria-expanded') === 'true';
      expanded ? closeMenu() : openMenu();
    });

    menu.addEventListener('click', (e) => {
      const li = e.target.closest('.filter__mobile-option');
      if (!li) return;
      showGroup(li.dataset.group);
      closeMenu();
    });

    document.addEventListener('click', (e) => {
      if (!mobile.contains(e.target)) closeMenu();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMenu();
    });
  }

  // применение адаптива
  const enableMobile = () => {
    if (!mobile) return;
    mobile.removeAttribute('aria-hidden');
    buildMenu();
    chooseInitial();
  };
  const disableMobile = () => {
    if (!mobile) return;
    mobile.setAttribute('aria-hidden', 'true');
    closeMenu();
    groups.forEach(g => g.classList.remove('is-selected')); // показать все
  };

  const apply = () => (mq.matches ? enableMobile() : disableMobile());
  apply();
  mq.addEventListener('change', apply);

