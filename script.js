const langBtn = document.getElementById('lang-switch');
let currentLang = 'es';

langBtn.addEventListener('click', () => {
    // Cambiar idioma
    currentLang = currentLang === 'es' ? 'en' : 'es';
    
    // Cambiar texto del botón
    langBtn.innerText = currentLang === 'es' ? 'EN' : 'ES';

    // Traducir todos los elementos con atributos data-es/data-en
    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) {
            el.innerHTML = text; // Usamos innerHTML para soportar etiquetas <li> y <br>
        }
    });
});

// Smooth scroll para navegación fluida
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});
