// 1. SELECTOR DE IDIOMAS (Lógica de Pastilla)
const langToggle = document.getElementById('lang-switch');
const langOptions = document.querySelectorAll('.lang-opt');
let currentLang = 'es';

langToggle.addEventListener('click', (e) => {
    const target = e.target.closest('.lang-opt');
    if (!target || target.classList.contains('active')) return;

    // Actualización Visual
    langOptions.forEach(opt => opt.classList.remove('active'));
    target.classList.add('active');

    // Actualización de Idioma
    currentLang = target.getAttribute('data-value');

    // Traducción de elementos con innerHTML para procesar tags
    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            el.innerHTML = text; 
        }
    });
});

// 2. REVELACIÓN AL HACER SCROLL (Animaciones)
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

// 3. SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
