document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('appointment-form');

    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
        mapPlaceholder.addEventListener('click', function () {
            alert('Открывается карта с местоположением массажного салона. Адрес: г. Солнечногорск, ул. Красноармейская, д. 8');

            window.open('https://yandex.ru/maps/10755/solnechnogorsk/house/krasnoarmeyskaya_ulitsa_8/Z08Yfw5jQEYCQFtsfX15cnhiZw==/?ll=36.994085%2C56.183406&z=18.92', '_blank');
        });
    }

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

                setTimeout(() => {
                    if (targetId === '#contact') {
                        highlightContactButtons();
                    }
                }, 800);
            }
        });
    });

    const priceCards = document.querySelectorAll('.price-card');
    priceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-8px)';
        });

        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0)';
        });
    });

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

    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        observer.observe(section);
    });

    initHorizontalGallery();
});

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

    function init() {
        carousel.innerHTML = '';
        dotsContainer.innerHTML = '';

        images.forEach((imgSrc, index) => {
            const img = new Image();
            img.onerror = function () {
                console.log(`Изображение не найдено: ${imgSrc}`);
            };
            img.src = imgSrc;

            const carouselItem = document.createElement('div');
            carouselItem.className = 'carousel-item';
            if (index === 0) carouselItem.classList.add('active');

            const carouselImg = document.createElement('img');
            carouselImg.src = imgSrc;
            carouselImg.alt = `Интерьер массажного салона ${index + 1}`;
            carouselImg.dataset.index = index;
            carouselImg.loading = 'lazy';

            carouselImg.addEventListener('click', () => openModal(index));
            carouselItem.appendChild(carouselImg);
            carousel.appendChild(carouselItem);

            const dot = document.createElement('button');
            dot.className = 'carousel-dot';
            if (index === 0) dot.classList.add('active');
            dot.dataset.index = index;
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });

        totalImgSpan.textContent = totalImages;

        startAutoSlide();
    }
    function goToSlide(index) {
        currentIndex = index;
        updateCarousel();
    }

    function updateCarousel() {
        carousel.style.transform = `translateX(-${currentIndex * 100}%)`;

        document.querySelectorAll('.carousel-item').forEach((item, index) => {
            item.classList.toggle('active', index === currentIndex);
        });

        document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });

        currentImgSpan.textContent = currentIndex + 1;
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % totalImages;
        updateCarousel();
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + totalImages) % totalImages;
        updateCarousel();
    }

    function openModal(index) {
        currentIndex = index;
        modalImage.src = images[currentIndex];
        currentImgSpan.textContent = currentIndex + 1;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        stopAutoSlide();
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        if (!isHovering) {
            startAutoSlide();
        }
    }

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

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 1500); // секунды между слайдами возможно увеличить?
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    modalPrevBtn.addEventListener('click', prevModalSlide);
    modalNextBtn.addEventListener('click', nextModalSlide);
    modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

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
            if (e.key === 'ArrowLeft') {
                prevSlide();
            }
            if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });

    init();
}
document.addEventListener('DOMContentLoaded', function () {

    initHorizontalGallery();
});
function highlightContactButtons() {
    const contactButtons = document.querySelectorAll('.contact-button');
    const contactHint = document.getElementById('contactHint');

    if (contactHint) {
        contactHint.classList.add('show');
    }

    contactButtons.forEach(btn => {
        btn.classList.add('highlighted');
    });

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
            contactButtons.forEach(btn => {
                btn.style.transform = '';
                btn.classList.remove('highlighted');
            });
            if (contactHint) {
                contactHint.classList.remove('show');
            }
        }
    }, 500);
}
// Яндекс рейтинг - мобильная версия
document.addEventListener('DOMContentLoaded', function () {
    const ratingWidget = document.querySelector('.yandex-rating-widget');

    if (!ratingWidget) return;

    // Для мобильных устройств
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        let isRatingExpanded = false;
        let tapTimer;

        ratingWidget.addEventListener('touchstart', function (e) {
            e.stopPropagation();
            tapTimer = setTimeout(() => {
                if (!isRatingExpanded) {
                    this.classList.add('active');
                    this.style.right = '0';
                    isRatingExpanded = true;
                } else {
                    this.classList.remove('active');
                    this.style.right = '-115px';
                    isRatingExpanded = false;
                }
            }, 150);
        }, { passive: true });

        ratingWidget.addEventListener('touchend', function () {
            clearTimeout(tapTimer);
        }, { passive: true });

        ratingWidget.addEventListener('touchmove', function () {
            clearTimeout(tapTimer);
        }, { passive: true });

        document.addEventListener('touchstart', function (e) {
            if (isRatingExpanded && !ratingWidget.contains(e.target)) {
                ratingWidget.classList.remove('active');
                ratingWidget.style.right = '-115px';
                isRatingExpanded = false;
            }
        }, { passive: true });
    }

    // Плавное появление
    setTimeout(() => {
        ratingWidget.style.opacity = '1';
    }, 2000);
});