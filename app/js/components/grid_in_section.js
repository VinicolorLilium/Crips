//==================================================================
//преобразование сетки размеров в выпадающий список на тачпаде
//===============================================================
const groupSizes = document.querySelector('.product-form__group--sizes');
if (groupSizes) {

  const listSize = groupSizes.querySelector('.product-form__sizes');
  const radiosSizeInput = Array.from(groupSizes.querySelectorAll('.sizes__input'));
  if (!listSize || !radiosSizeInput.length) return;

  // Сохраняем исходные disabled-состояния, чтобы корректно восстанавливать на десктопе
  const originalDisabled = new WeakMap();
  radiosSizeInput.forEach(r => originalDisabled.set(r, r.disabled));

  // Линкуем select с заголовком
  const heading = groupSizes.querySelector('.product-form__label-row .product-form__label, .product-form__label');
  if (heading && !heading.id) heading.id = 'sizeHeading';

  // Строим select из радио
  const wrap = document.createElement('div');
  wrap.className = 'sizes__select-wrap';

  const select = document.createElement('select');
  select.className = 'sizes__select';
  if (heading) select.setAttribute('aria-labelledby', heading.id);
  select.setAttribute('aria-label', 'Выбор размера');

  radiosSizeInput.forEach(input => {
    const option = document.createElement('option');
    option.value = input.value;

    const label = groupSizes.querySelector(`label[for="${input.id}"]`);
    option.textContent = label ? label.textContent.trim() : input.value;

    if (input.disabled) {
      option.disabled = true;
      option.textContent += ' — нет в наличии';
    }
    if (input.checked) option.selected = true;

    select.appendChild(option);
  });

  wrap.appendChild(select);
  listSize.insertAdjacentElement('afterend', wrap);

  // Синхронизация select -> radios
  select.addEventListener('change', () => {
    const val = select.value;
    const target = radiosSizeInput.find(r => r.value === val);
    if (!target) return;

    // временно включаем, чтобы корректно сработали возможные слушатели
    const wasDisabled = target.disabled;
    const originallyDisabled = originalDisabled.get(target);

    if (wasDisabled && !originallyDisabled) target.disabled = false;
    target.checked = true;
    target.dispatchEvent(new Event('change', { bubbles: true }));
    // возвращаем управление disabled состоянием
    const mql = window.matchMedia('(max-width: 600px)');
    if (mql.matches && !originallyDisabled) target.disabled = true;
    if (!mql.matches) target.disabled = originallyDisabled;
  });

  // Синхронизация radios -> select (на десктопе)
  radiosSizeInput.forEach(r => {
    r.addEventListener('change', () => {
      const checked = radiosSizeInput.find(i => i.checked);
      if (checked) select.value = checked.value;
    });
  });

  // Переключение режимов по брейкпоинту
  const mql = window.matchMedia('(max-width: 600px)');

  function enableMobile() {
    groupSizes.classList.add('js-has-select');
    // избегаем дубля формы: отключаем все радио
    radiosSizeInput.forEach(r => r.disabled = true);
    // submit идёт из select под тем же именем
    select.name = 'size';
  }

  function disableMobile() {
    groupSizes.classList.remove('js-has-select');
    // возвращаем исходные disabled-состояния
    radiosSizeInput.forEach(r => r.disabled = originalDisabled.get(r));
    // name убираем, чтобы не дублировать поле, но select оставляем синхронизированным
    select.removeAttribute('name');

    // на всякий случай синхронизируем текущее значение обратно в радио
    const current = radiosSizeInput.find(r => r.value === select.value);
    if (current && !current.disabled) {
      current.checked = true;
      current.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  function apply() {
    if (mql.matches) enableMobile();
    else disableMobile();
  }

  if (mql.addEventListener) mql.addEventListener('change', apply);
  else mql.addListener(apply); // поддержка старых браузеров
  apply();
}