// Автодонат JavaScript функціональність

class AutoDonate {
    constructor() {
        this.currentProduct = null;
        this.products = {};
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.setupTabs();
        this.setupProductCards();
        this.setupModals();
        this.setupForm();
    }    // Завантаження продуктів з сервера
    async loadProducts() {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success) {
                this.products = data.products;
                this.renderProducts();
            } else {
                console.error('Failed to load products:', data.message);
                this.showError('Не вдалося завантажити товари: ' + data.message);
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showError('Помилка завантаження товарів. Перевірте підключення до сервера.');
        }
    }// Рендеринг продуктів на сторінці
    renderProducts() {
        const subscriptionsGrid = document.querySelector('#subscriptions .products-grid');
        const coinsGrid = document.querySelector('#coins .products-grid');
        const cosmeticsGrid = document.querySelector('#cosmetics .products-grid');

        // Приховуємо індикатори завантаження
        document.querySelectorAll('.loading-indicator').forEach(indicator => {
            indicator.classList.add('hidden');
        });

        // Очищуємо існуючі продукти
        if (subscriptionsGrid) subscriptionsGrid.innerHTML = '';
        if (coinsGrid) coinsGrid.innerHTML = '';
        if (cosmeticsGrid) cosmeticsGrid.innerHTML = '';

        let hasSubscriptions = false;
        let hasCoins = false;
        let hasCosmetics = false;

        // Розподіляємо продукти по категоріях
        Object.entries(this.products).forEach(([productId, product]) => {
            const productCard = this.createProductCard(productId, product);
            
            if (productId.startsWith('vip') || productId.startsWith('premium') || productId.startsWith('elite')) {
                subscriptionsGrid?.appendChild(productCard);
                hasSubscriptions = true;
            } else if (productId.startsWith('coins-')) {
                coinsGrid?.appendChild(productCard);
                hasCoins = true;
            } else {
                cosmeticsGrid?.appendChild(productCard);
                hasCosmetics = true;
            }
        });

        // Показуємо порожній стан, якщо немає продуктів у категорії
        if (!hasSubscriptions && subscriptionsGrid) {
            subscriptionsGrid.innerHTML = this.createEmptyState('Підписки поки недоступні');
        }
        if (!hasCoins && coinsGrid) {
            coinsGrid.innerHTML = this.createEmptyState('Монети поки недоступні');
        }
        if (!hasCosmetics && cosmeticsGrid) {
            cosmeticsGrid.innerHTML = this.createEmptyState('Косметика поки недоступна');
        }

        // Переналаштовуємо обробники після рендерингу
        this.setupProductCards();
    }

    // Створення порожнього стану
    createEmptyState(message) {
        return `
            <div class="empty-state">
                <i class="fas fa-box-open"></i>
                <h3>Товари відсутні</h3>
                <p>${message}</p>
            </div>
        `;
    }

    // Створення картки продукту
    createProductCard(productId, product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product', productId);
        card.setAttribute('data-price', product.price);

        // Визначаємо, чи є продукт популярним
        const isPopular = productId === 'premium' || productId === 'coins-1000' || productId === 'cosmetics-bundle';
        if (isPopular) {
            card.classList.add('featured');
        }

        // Генеруємо HTML картки
        card.innerHTML = `
            ${isPopular ? '<div class="featured-badge">Популярний</div>' : ''}
            <div class="product-header">
                <h3>${product.name}</h3>
                <span class="price">${product.price} грн</span>
            </div>
            <div class="product-features">
                ${this.generateProductFeatures(productId, product)}
            </div>
            <button class="buy-button">Купити</button>
        `;

        return card;
    }

    // Генерація опису функцій продукту
    generateProductFeatures(productId, product) {
        // Базові описи для різних типів продуктів
        const descriptions = {
            'vip': `
                <ul>
                    <li><i class="fas fa-check"></i> Ексклюзивний prefix</li>
                    <li><i class="fas fa-check"></i> Доступ до VIP команд</li>
                    <li><i class="fas fa-check"></i> Збільшений ліміт друзів</li>
                    <li><i class="fas fa-check"></i> Пріоритет при підключенні</li>
                </ul>
            `,
            'premium': `
                <ul>
                    <li><i class="fas fa-check"></i> Усі можливості VIP</li>
                    <li><i class="fas fa-check"></i> Ексклюзивна косметика</li>
                    <li><i class="fas fa-check"></i> Доступ до бета-тестів</li>
                    <li><i class="fas fa-check"></i> Щомісячні бонуси</li>
                    <li><i class="fas fa-check"></i> Персональна підтримка</li>
                </ul>
            `,
            'elite': `
                <ul>
                    <li><i class="fas fa-check"></i> Усі можливості Premium</li>
                    <li><i class="fas fa-check"></i> Ексклюзивний статус</li>
                    <li><i class="fas fa-check"></i> Доступ до приватних ігор</li>
                    <li><i class="fas fa-check"></i> Персональні налаштування</li>
                    <li><i class="fas fa-check"></i> Подвійний досвід</li>
                </ul>
            `,
            'coins-100': '<p>Базовий пакет монет для початківців</p>',
            'coins-500': '<p>Популярний пакет з бонусом +50 монет</p>',
            'coins-1000': '<p>Найвигідніший пакет з бонусом +200 монет</p>',
            'coins-2500': '<p>Мега пакет з бонусом +500 монет</p>',
            'trails': `
                <ul>
                    <li><i class="fas fa-check"></i> 5 ексклюзивних слідів</li>
                    <li><i class="fas fa-check"></i> Анімовані ефекти</li>
                    <li><i class="fas fa-check"></i> Кольорові частинки</li>
                </ul>
            `,
            'cages': `
                <ul>
                    <li><i class="fas fa-check"></i> 3 унікальні клітки</li>
                    <li><i class="fas fa-check"></i> Тематичний дизайн</li>
                    <li><i class="fas fa-check"></i> Спеціальні ефекти</li>
                </ul>
            `,
            'kill-effects': `
                <ul>
                    <li><i class="fas fa-check"></i> 4 ефекти вбивства</li>
                    <li><i class="fas fa-check"></i> Звукові ефекти</li>
                    <li><i class="fas fa-check"></i> Візуальні анімації</li>
                </ul>
            `,
            'cosmetics-bundle': `
                <ul>
                    <li><i class="fas fa-check"></i> Усі пакети косметики</li>
                    <li><i class="fas fa-check"></i> Ексклюзивні бонуси</li>
                    <li><i class="fas fa-check"></i> Знижка 35%</li>
                </ul>
            `
        };

        return descriptions[productId] || '<p>Ексклюзивний товар для покращення ігрового досвіду</p>';
    }    // Показати помилку
    showError(message) {
        // Приховуємо індикатори завантаження
        document.querySelectorAll('.loading-indicator').forEach(indicator => {
            indicator.classList.add('hidden');
        });

        // Показуємо помилку в кожному контейнері продуктів
        const productGrids = document.querySelectorAll('.products-grid');
        productGrids.forEach(grid => {
            grid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>${message}</p>
                    <button onclick="location.reload()" class="btn" style="
                        background: var(--main-color);
                        color: var(--black-color);
                        border: none;
                        padding: 0.5rem 1rem;
                        border-radius: 6px;
                        margin-top: 1rem;
                        cursor: pointer;
                    ">Оновити сторінку</button>
                </div>
            `;
        });

        // Також показуємо toast повідомлення
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-toast';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--red-color);
            color: white;
            padding: 1rem;
            border-radius: 8px;
            z-index: 9999;
            max-width: 300px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        `;
        errorDiv.innerHTML = `
            <i class="fas fa-times-circle" style="margin-right: 0.5rem;"></i>
            ${message}
        `;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }

    // Налаштування вкладок
    setupTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');
                
                // Видаляємо активний клас з усіх кнопок та контенту
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabContents.forEach(content => content.classList.remove('active'));
                
                // Додаємо активний клас до поточної кнопки та контенту
                button.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    // Налаштування карток продуктів
    setupProductCards() {
        const buyButtons = document.querySelectorAll('.buy-button');
        
        buyButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productCard = e.target.closest('.product-card');
                const productName = productCard.querySelector('h3').textContent;
                const productPrice = productCard.querySelector('.price').textContent;
                const productId = productCard.getAttribute('data-product');
                
                this.currentProduct = {
                    id: productId,
                    name: productName,
                    price: productPrice
                };
                
                this.openPurchaseModal();
            });
        });
    }

    // Налаштування модальних вікон
    setupModals() {
        const modals = document.querySelectorAll('.modal');
        const closeButtons = document.querySelectorAll('.close, .close-button');
        
        // Закриття модальних вікон
        closeButtons.forEach(button => {
            button.addEventListener('click', () => {
                modals.forEach(modal => modal.style.display = 'none');
            });
        });
        
        // Закриття при кліку поза модальним вікном
        window.addEventListener('click', (e) => {
            modals.forEach(modal => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Налаштування форми
    setupForm() {
        const form = document.getElementById('purchase-form');
        
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.processPurchase();
        });
        
        // Валідація нікнейму
        const nicknameInput = document.getElementById('nickname');
        nicknameInput.addEventListener('input', (e) => {
            this.validateNickname(e.target);
        });
    }

    // Відкриття модального вікна покупки
    openPurchaseModal() {
        const modal = document.getElementById('purchase-modal');
        const productName = document.getElementById('modal-product-name');
        const productPrice = document.getElementById('modal-product-price');
        
        productName.textContent = this.currentProduct.name;
        productPrice.textContent = this.currentProduct.price;
        
        modal.style.display = 'block';
        
        // Очищуємо форму
        document.getElementById('purchase-form').reset();
    }

    // Валідація нікнейму Minecraft
    validateNickname(input) {
        const nickname = input.value;
        const isValid = /^[a-zA-Z0-9_]{3,16}$/.test(nickname);
        
        if (nickname && !isValid) {
            input.style.borderColor = 'var(--red-color)';
            this.showValidationError(input, 'Нікнейм повинен містити від 3 до 16 символів (латинські літери, цифри, підкреслення)');
        } else {
            input.style.borderColor = 'var(--description-color)';
            this.hideValidationError(input);
        }
        
        return isValid;
    }

    // Показати помилку валідації
    showValidationError(input, message) {
        let errorDiv = input.parentNode.querySelector('.validation-error');
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.className = 'validation-error';
            errorDiv.style.color = 'var(--red-color)';
            errorDiv.style.fontSize = '0.8rem';
            errorDiv.style.marginTop = '0.3rem';
            input.parentNode.appendChild(errorDiv);
        }
        errorDiv.textContent = message;
    }

    // Сховати помилку валідації
    hideValidationError(input) {
        const errorDiv = input.parentNode.querySelector('.validation-error');
        if (errorDiv) {
            errorDiv.remove();
        }
    }

    // Обробка покупки
    async processPurchase() {
        const formData = new FormData(document.getElementById('purchase-form'));
        const nickname = formData.get('nickname');
        const email = formData.get('email');
        const terms = formData.get('terms');
        
        // Валідація
        if (!this.validateNickname(document.getElementById('nickname'))) {
            return;
        }
        
        if (!terms) {
            alert('Ви повинні погодитися з умовами використання');
            return;
        }
        
        // Підготовка даних для відправки
        const purchaseData = {
            product: this.currentProduct.id,
            nickname: nickname,
            email: email,
            amount: this.extractPrice(this.currentProduct.price),
            timestamp: new Date().toISOString()
        };
        
        try {
            // Показуємо індикатор завантаження
            this.showLoading();
            
            // Симуляція API запиту (замініть на реальний endpoint)
            const response = await this.sendPurchaseRequest(purchaseData);
            
            if (response.success) {
                // Закриваємо модальне вікно покупки
                document.getElementById('purchase-modal').style.display = 'none';
                
                // Показуємо модальне вікно успіху
                this.showSuccessModal();
                
                // Відправляємо команду на сервер Minecraft
                await this.sendToMinecraftServer(purchaseData);
            } else {
                throw new Error(response.message || 'Помилка обробки платежу');
            }
        } catch (error) {
            console.error('Помилка покупки:', error);
            alert('Виникла помилка при обробці платежу. Спробуйте пізніше.');
        } finally {
            this.hideLoading();
        }
    }

    // Показати індикатор завантаження
    showLoading() {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Обробка...';
    }

    // Сховати індикатор завантаження
    hideLoading() {
        const submitButton = document.querySelector('.submit-button');
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-credit-card"></i> Перейти до оплати';
    }

    // Витягнути ціну з рядка
    extractPrice(priceString) {
        return parseInt(priceString.replace(/\D/g, ''));
    }    // Відправка запиту на покупку
    async sendPurchaseRequest(data) {
        try {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Network error:', error);
            return { 
                success: false, 
                message: 'Помилка мережі. Перевірте підключення до інтернету.' 
            };
        }
    }    // Відправка команди на сервер Minecraft
    async sendToMinecraftServer(data) {
        // Команди вже виконуються автоматично на backend через RCON
        console.log('Продукт видано гравцю:', data.nickname);
        
        // Опціонально: можна перевірити статус сервера
        try {
            const statusResponse = await fetch('/api/status');
            const status = await statusResponse.json();
            console.log('Server status:', status);
        } catch (error) {
            console.warn('Could not check server status:', error);
        }
    }

    // Показати модальне вікно успіху
    showSuccessModal() {
        document.getElementById('success-modal').style.display = 'block';
    }
}

// Ініціалізація після завантаження DOM
document.addEventListener('DOMContentLoaded', () => {
    new AutoDonate();
});

// Експорт для використання в інших файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AutoDonate;
}
