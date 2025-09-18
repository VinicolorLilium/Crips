/**
 * Функционал управления количеством товаров в корзине
 * Обрабатывает увеличение/уменьшение количества и пересчет итоговой стоимости
 */

class CartTable {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        // Обработка кликов по кнопкам изменения количества
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quantity__btn')) {
                this.handleQuantityChange(e.target);
            }
            
            // Обработка кликов по кнопкам удаления товара
            if (e.target.classList.contains('cart-item__action--remove') ||
                e.target.closest('.cart-item__action--remove')) {
                this.handleRemoveItem(e.target);
            }

            // Обработка кликов по кнопке очистки корзины
            if (e.target.classList.contains('cart-controls__btn--clear')) {
                this.handleClearCart();
            }
        });
    }

    handleQuantityChange(button) {
        const quantityElement = button.closest('.quantity').querySelector('.quantity__value');
        const cartItem = button.closest('.cart-item');
        const priceElement = cartItem.querySelector('.cart-item__price');
        const totalElement = cartItem.querySelector('.cart-item__total');

        let quantity = parseInt(quantityElement.textContent);
        const price = this.parsePrice(priceElement.textContent);

        if (button.textContent === '+') {
            quantity++;
        } else if (button.textContent === '−' && quantity > 1) {
            quantity--;
        }

        quantityElement.textContent = quantity;
        this.updateTotalPrice(totalElement, price, quantity);
    }

    parsePrice(priceString) {
        // Извлекаем числовое значение из строки формата "120,00 EUR"
        const numericPart = priceString.replace(/[^\d,]/g, '').replace(',', '.');
        return parseFloat(numericPart);
    }

    formatPrice(price) {
        // Форматируем цену обратно в формат "120,00 EUR"
        return price.toFixed(2).replace('.', ',') + ' EUR';
    }

    updateTotalPrice(totalElement, unitPrice, quantity) {
        const totalPrice = unitPrice * quantity;
        totalElement.textContent = this.formatPrice(totalPrice);
    }

    handleRemoveItem(removeButton) {
        const cartItem = removeButton.closest('.cart-item');
        if (cartItem) {
            // Добавляем анимацию исчезновения
            cartItem.style.transition = 'all 0.3s ease';
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-100px)';
            
            // Удаляем элемент после завершения анимации
            setTimeout(() => {
                cartItem.remove();
                this.updateCartSummary();
            }, 300);
        }
    }

    updateCartSummary() {
        // Здесь можно добавить логику обновления общей суммы корзины
        // если в проекте есть элемент для отображения общей суммы
        console.log('Корзина обновлена - товар удален');
        
        // Проверяем, пуста ли корзина
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) {
            this.showEmptyCartMessage();
        }
    }

    showEmptyCartMessage() {
        // Создаем сообщение о пустой корзине
        const emptyCartMessage = document.createElement('div');
        emptyCartMessage.className = 'empty-cart-message';
        emptyCartMessage.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <h3>Корзина пуста</h3>
                <p>Добавьте товары, чтобы продолжить покупки</p>
            </div>
        `;
        
        const cartTable = document.querySelector('.cart-table');
        if (cartTable) {
            cartTable.insertAdjacentElement('afterend', emptyCartMessage);
        }
    }

    handleClearCart() {
        const cartItems = document.querySelectorAll('.cart-item');
        if (cartItems.length === 0) return;

        // Подтверждение действия
        if (!confirm('Вы уверены, что хотите очистить корзину?')) {
            return;
        }

        // Анимация последовательного удаления всех товаров
        cartItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.3s ease';
                item.style.opacity = '0';
                item.style.transform = 'translateX(-100px)';
                
                setTimeout(() => {
                    item.remove();
                    // После удаления последнего товара обновляем корзину
                    if (index === cartItems.length - 1) {
                        this.updateCartSummary();
                    }
                }, 300);
            }, index * 100); // Задержка для последовательной анимации
        });
    }
}

new CartTable();
