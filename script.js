// Fungsi untuk mengecek apakah elemen ada di viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top < (window.innerHeight || document.documentElement.clientHeight) - 100
    );
}


// Fungsi untuk menangani animasi scroll
function handleScrollAnimation() {
    const animatedElements = document.querySelectorAll('.animate__animated');
    
    animatedElements.forEach(el => {
        if (isElementInViewport(el)) {
            const animationName = el.getAttribute('data-animation');

            // PENTING: pastikan visible SELALU ditambahkan
            el.classList.add('visible');

            if (animationName) {
                el.classList.add(`animate__${animationName}`);
                el.removeAttribute('data-animation');
            }
        }
    });
}


// Animasi interaktif untuk card click
document.addEventListener('DOMContentLoaded', function() {
    handleScrollAnimation();
    
    // Tambahkan efek bounce saat card diklik
    const cards = document.querySelectorAll('.education-card, .experience-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = 'animate__animated animate__bounce';
            }, 10);
            
            setTimeout(() => {
                this.style.animation = '';
            }, 1000);
        });
    });
});

window.addEventListener('scroll', handleScrollAnimation);

// Smooth scroll untuk navigasi
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});