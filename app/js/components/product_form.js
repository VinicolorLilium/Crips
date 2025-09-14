//========================================================
//форма в карточке товара
//========================================================
const product = document.querySelector('.product-form');

if (product) {
  const productForm = document.getElementById('productForm');
  const qtyInput = productForm.querySelector('.quantity__input');
  const minusBtn = productForm.querySelector('.quantity__btn--minus');
  const plusBtn = productForm.querySelector('.quantity__btn--plus');

  // Блок, где теперь хранится атрибут data-price
  const priceTotalBox = productForm.querySelector('.price__total');
  const priceEl = document.getElementById('priceTotal');

  const unitPrice = Number(priceTotalBox?.dataset.price ?? 0); // читаем цену отсюда
  const min = Number(qtyInput.min || 1);
  const max = Number(qtyInput.max || 99);

  const formatPrice = (value) =>
    `${value.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} EUR`;

  const updatePrice = () => {
    const qty = Number(qtyInput.value || 1);
    priceEl.textContent = formatPrice(unitPrice * qty);
    minusBtn.disabled = qty <= min;
    plusBtn.disabled = qty >= max;
  };

  minusBtn.addEventListener('click', () => {
    const current = Math.max(min, Number(qtyInput.value) - 1);
    qtyInput.value = current;
    updatePrice();
  });

  plusBtn.addEventListener('click', () => {
    const current = Math.min(max, Number(qtyInput.value) + 1);
    qtyInput.value = current;
    updatePrice();
  });

  qtyInput.addEventListener('input', () => {
    let v = parseInt((qtyInput.value || '').replace(/[^\d]/g, ''), 10);
    if (Number.isNaN(v)) v = min;
    v = Math.min(max, Math.max(min, v));
    qtyInput.value = v;
    updatePrice();
  });

  updatePrice();
}

const infoTitle = document.querySelector('.product-info__title');
if (infoTitle) {
  const infoContent = document.querySelector('.product-info__content');
  const pageWidth = document.documentElement.scrollWidth;
  if (pageWidth >= 1100) {
    infoTitle.classList.add('_active');
    infoContent.removeAttribute("hidden");
  }
}