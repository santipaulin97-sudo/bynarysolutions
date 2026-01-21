const langBtn = document.getElementById('lang-switch');
let currentLang = 'es';

// 1. TRADUCCIÓN INTELIGENTE
langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    langBtn.innerText = currentLang === 'es' ? 'EN' : 'ES';

    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            // USAR innerHTML para que procese negritas y listas correctamente
            el.innerHTML = text; 
        }
    });
});

// 2. SCROLL REVEAL (Animación de entrada)
const revealOnScroll = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};

window.addEventListener('DOMContentLoaded', revealOnScroll);

// 3. SMOOTH SCROLL (Navegación fluida)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
