// Обработчик отправки формы записи
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointment-form');

    // Обработчик клика по карте
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function () {
            alert('Открывается карта с местоположением массажного салона. Адрес: г. Солнечногорск, ул. Красноармейская, д. 8');

            window.open('https://yandex.ru/maps/10755/solnechnogorsk/house/krasnoarmeyskaya_ulitsa_8/Z08Yfw5jQEYCQFtsfX15cnhiZw==/?ll=36.994085%2C56.183406&z=18.92', '_blank');
        });
    }

    // Плавная прокрутка для якорных ссылок
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });

                // Ждем завершения скролла и подсвечиваем контакты
                setTimeout(() => {
                    if (targetId === '#contact') {
                        highlightContactButtons();
                    }
                }, 800); // Время должно совпадать с длительностью скролла
            }
        });
    });

    // Добавляем небольшой визуальный эффект при наведении на карточки цен
    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

    // Анимация появления элементов при прокрутке
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Наблюдаем за секциями
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Инициализация галереи
    initHorizontalGallery();
});

// Горизонтальная галерея
function initHorizontalGallery() {
    const carousel = document.getElementById('horizontal-carousel');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const modal = document.getElementById('image-modal');
    const modalImage = document.getElementById('modal-image');
    const modalPrevBtn = document.querySelector('.modal-prev');
    const modalNextBtn = document.querySelector('.modal-next');
    const modalClose = document.querySelector('.modal-close');
    const currentImgSpan = document.getElementById('current-img');
    const totalImgSpan = document.getElementById('total-img');

    // Массив изображений для галереи
    const images = [
        'images/1.jpg',
        'images/2.jpg',
        'images/3.jpg',
        'images/4.jpg',
        'images/5.jpg',
        'images/6.jpg',
        'images/7.jpg',
        'images/8.jpg',
        'images/9.jpg',
        'images/10.jpg'
    ];

    const totalImages = images.length;
    let currentIndex = 0;
    let autoSlideInterval;
    let isHovering = false;

    // Инициализация галереи
    function init() {
        // Очищаем карусель и точки
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        // Создаем элементы карусели
        images.forEach((imgSrc, index) => {
            // Проверяем существование файла
            const img = new Image();
            img.onerror = function () {
                console.log(`Изображение не найдено: ${imgSrc}`);
            };
            img.src = imgSrc;

            // Создаем элемент карусели
            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) carouselItem.classList.add('active');

            const carouselImg = document.createElement('img');
            carouselImg.src = imgSrc;
            carouselImg.alt = `Интерьер массажного салона ${index + 1}`;
            carouselImg.dataset.index = index;
            carouselImg.loading = 'lazy'; // Ленивая загрузка

            carouselImg.addEventListener('click', () => openModal(index));
            carouselItem.appendChild(carouselImg);
            carousel.appendChild(carouselItem);

            // Создаем точку навигации
            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        // Обновляем счетчик
        totalImgSpan.textContent = totalImages;

        // Запускаем автопрокрутку
        startAutoSlide();
    }

    // Функция перехода к слайду
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    // Функция обновления горизонтальной карусели
    function updateCarousel() {
        // Обновляем позицию карусели (горизонтальная прокрутка)
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        // Обновляем активный слайд
        document.querySelectorAll('.carousel-item').forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        // Обновляем активную точку
        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        // Обновляем счетчик в модальном окне
        currentImgSpan.textContent = currentIndex + 1;
    }

    // Следующий слайд (вправо)
    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    // Предыдущий слайд (влево)
    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    // Открытие модального окна
    function openModal(index) {
        currentIndex = index;
        modalImage.src = images[currentIndex];
        currentImgSpan.textContent = currentIndex + 1;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Останавливаем автопрокрутку
        stopAutoSlide();
    }

    // Закрытие модального окна
    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Возобновляем автопрокрутку если не наводим на галерею
        if (!isHovering) {
            startAutoSlide();
        }
    }

    // Навигация в модальном окне
    function nextModalSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        modalImage.src = images[currentIndex];
        currentImgSpan.textContent = currentIndex + 1;
    }

    function prevModalSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        modalImage.src = images[currentIndex];
        currentImgSpan.textContent = currentIndex + 1;
    }

    // Автопрокрутка
    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 1500); // секунды между слайдами
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    // Обработчики событий
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    modalPrevBtn.addEventListener('click', prevModalSlide);
    modalNextBtn.addEventListener('click', nextModalSlide);
    modalClose.addEventListener('click', closeModal);

    // Закрытие модального окна при клике на оверлей
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Свайп для мобильных устройств в модальном окне
    let touchStartX = 0;
    let touchEndX = 0;

    modalImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modalImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;

        if (touchEndX < touchStartX - swipeThreshold) {
            nextModalSlide();
        }

        if (touchEndX > touchStartX + swipeThreshold) {
            prevModalSlide();
        }
    }

    // Свайп для самой карусели на мобильных
    let carouselTouchStartX = 0;
    let carouselTouchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
        carouselTouchStartX = e.changedTouches[0].screenX;
    });

    carousel.addEventListener('touchend', (e) => {
        carouselTouchEndX = e.changedTouches[0].screenX;
        handleCarouselSwipe();
    });

    function handleCarouselSwipe() {
        const swipeThreshold = 50;

        if (carouselTouchEndX < carouselTouchStartX - swipeThreshold) {
            nextSlide();
        }

        if (carouselTouchEndX > carouselTouchStartX + swipeThreshold) {
            prevSlide();
        }
    }

    // Управление автопрокруткой при наведении
    const galleryContainer = document.querySelector('.gallery-container');

    galleryContainer.addEventListener('mouseenter', () => {
        isHovering = true;
        stopAutoSlide();
    });

    galleryContainer.addEventListener('mouseleave', () => {
        isHovering = false;
        if (!modal.classList.contains('active')) {
            startAutoSlide();
        }
    });

    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (modal.classList.contains('active')) {
            if (e.key === 'Escape') {
                closeModal();
            }
            if (e.key === 'ArrowLeft') {
                prevModalSlide();
            }
            if (e.key === 'ArrowRight') {
                nextModalSlide();
            }
        } else if (document.querySelector('.gallery-container:hover')) {
            // Управление каруселью с клавиатуры при наведении
            if (e.key === 'ArrowLeft') {
                prevSlide();
            }
            if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    // Инициализация
    init();
}

// Инициализация галереи при загрузке страницы
// Вместо initVerticalGallery() вызываем initHorizontalGallery()
document.addEventListener('DOMContentLoaded', function () {
    // ... существующий код ...

    // Добавляем инициализацию горизонтальной галереи
    initHorizontalGallery();
});
// Обновите функцию highlightContactButtons:
function highlightContactButtons() {
    const contactButtons = document.querySelectorAll('.contact-button');
    const contactHint = document.getElementById('contactHint');

    // Показываем подсказку
    if (contactHint) {
        contactHint.classList.add('show');
    }

    // Подсвечиваем кнопки
    contactButtons.forEach(btn => {
        btn.classList.add('highlighted');
    });

    // Мигающий эффект
    let blinkCount = 0;
    const blinkInterval = setInterval(() => {
        contactButtons.forEach(btn => {
            btn.style.transform = btn.style.transform.includes('scale')
                ? 'translateY(-5px) scale(1)'
                : 'translateY(-5px) scale(1.05)';
        });

        blinkCount++;
        if (blinkCount >= 6) {
            clearInterval(blinkInterval);
            // Возвращаем нормальный вид
            contactButtons.forEach(btn => {
                btn.style.transform = '';
                btn.classList.remove('highlighted');
            });

            // Скрываем подсказку
            if (contactHint) {
                contactHint.classList.remove('show');
            }
        }
    }, 500);
}