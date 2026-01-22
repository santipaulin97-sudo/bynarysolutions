// 1. CONFIGURACIÓN GLOBAL DE IDIOMA
const langToggle = document.getElementById('lang-switch');
const langOptions = document.querySelectorAll('.lang-opt');
let currentLang = 'es';

// 2. LÓGICA DEL SELECTOR DE IDIOMAS (Pastilla)
langToggle.addEventListener('click', (e) => {
    const target = e.target.closest('.lang-opt');
    if (!target || target.classList.contains('active')) return;

    // Actualización Visual de la pastilla
    langOptions.forEach(opt => opt.classList.remove('active'));
    target.classList.add('active');

    // Cambio de idioma global
    currentLang = target.getAttribute('data-value');

    // Traducir elementos de la página
    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) { el.innerHTML = text; }
    });

    // Actualizar el Bot al nuevo idioma
    updateBotLanguage();
});

// 3. LÓGICA DEL P&G BOT
const chatTrigger = document.getElementById('chat-trigger');
const chatWindow = document.getElementById('chat-window');
const chatBody = document.getElementById('chat-body');
const chatInput = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-chat');

// Base de datos de respuestas del Bot
const botResponses = {
    free: {
        es: "Nuestra **Automatización Gratis** consiste en identificar un proceso repetitivo (como facturas o reportes) y automatizarlo en 1-2 semanas para que veas el ahorro real antes de contratar un pack.",
        en: "Our **Free Automation** consists of identifying a repetitive process (like invoices or reports) and automating it in 1-2 weeks so you can see real savings before hiring a pack."
    },
    price: {
        es: "Nuestros packs Pro comienzan en **USD 300/mes** e incluyen mantenimiento, soporte prioritario y automatización de múltiples flujos críticos.",
        en: "Our Pro packs start at **USD 300/mo** and include maintenance, priority support, and automation of multiple critical workflows."
    },
    tech: {
        es: "Somos expertos en **IA (GPT-4o)**, flujos de trabajo en **n8n**, desarrollo en **Python** y arquitecturas en la nube (Cloud Native).",
        en: "We are experts in **AI (GPT-4o)**, **n8n** workflows, **Python** development, and Cloud Native architectures."
    },
    human: {
        es: "¡Perfecto! Un consultor humano revisará tu caso. También puedes agendar directo aquí: [Calendly Santiago](https://calendly.com/santipaulin97/30min)",
        en: "Perfect! A human consultant will review your case. You can also book directly here: [Santiago's Calendly](https://calendly.com/santipaulin97/30min)"
    }
};

// Abrir y Cerrar Chat
chatTrigger.addEventListener('click', () => {
    chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-chat').addEventListener('click', () => {
    chatWindow.style.display = 'none';
});

// Función para añadir burbujas de mensaje
function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerHTML = text;
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight; // Auto-scroll al final
}

// Escuchar clics en los botones de opciones del Bot
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-opt-btn')) {
        const action = e.target.getAttribute('data-action');
        const userText = e.target.innerText;

        addMessage(userText, 'user'); // El usuario pregunta

        setTimeout(() => {
            addMessage(botResponses[action][currentLang], 'bot'); // El bot responde
        }, 600);
    }
});

// Enviar mensaje manual (Input)
sendBtn.addEventListener('click', () => {
    const text = chatInput.value.trim();
    if (text) {
        addMessage(text, 'user');
        chatInput.value = '';
        setTimeout(() => {
            const botMsg = currentLang === 'es' ? 
                "Entiendo. Un especialista de P&G revisará tu duda y te responderá pronto." : 
                "I understand. A P&G specialist will review your question and respond shortly.";
            addMessage(botMsg, 'bot');
        }, 800);
    }
});

// Actualizar textos dinámicos del Bot al cambiar idioma
function updateBotLanguage() {
    const welcomeMsg = chatBody.querySelector('.message.bot'); // Primer mensaje
    if (welcomeMsg) {
        welcomeMsg.innerHTML = welcomeMsg.getAttribute(`data-${currentLang}`);
    }
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
}

// 4. ANIMACIONES (REVELACIÓN AL SCROLL)
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

// 5. SMOOTH SCROLL & INICIALIZACIÓN
window.addEventListener('DOMContentLoaded', () => {
    revealOnScroll();
    updateBotLanguage(); // Asegura el idioma correcto al cargar
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
});
