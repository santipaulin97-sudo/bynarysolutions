const langBtn = document.getElementById('lang-switch');
let currentLang = 'es';

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    langBtn.innerText = currentLang === 'es' ? 'EN' : 'ES';

    document.querySelectorAll('[data-es]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
});

// Smooth scroll para los links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
