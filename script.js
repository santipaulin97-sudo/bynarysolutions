const langBtn = document.getElementById('lang-switch');
let currentLang = 'es';

langBtn.addEventListener('click', () => {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    langBtn.innerText = currentLang === 'es' ? 'EN' : 'ES';

    document.querySelectorAll('[data-es]').forEach(el => {
        el.innerText = el.getAttribute(`data-${currentLang}`);
    });
});
