// 1. CONFIGURACIÓN GLOBAL DE IDIOMA
let currentLang = 'es';
const langToggle = document.getElementById('lang-switch');
const langOptions = document.querySelectorAll('.lang-opt');

langToggle.addEventListener('click', (e) => {
    const target = e.target.closest('.lang-opt');
    if (!target || target.classList.contains('active')) return;
    langOptions.forEach(opt => opt.classList.remove('active'));
    target.classList.add('active');
    currentLang = target.getAttribute('data-value');

    document.querySelectorAll('[data-es]').forEach(el => {
        const text = el.getAttribute(`data-${currentLang}`);
        if (text) { el.innerHTML = text; }
    });

    phraseIndex = 0; charIndex = 0; isDeleting = false; // Reiniciar typing
    updateBotLanguage(); 
});

// 2. TYPING EFFECT (Más frases comerciales)
const typingText = document.getElementById('typing-text');
const phrases = {
    es: [
        "Dashboards en tiempo real.",
        "Reduzca costos operativos.",
        "Automatice tareas repetitivas.",
        "Integración de IA con GPT-4o.",
        "Ingeniería de datos escalable."
    ],
    en: [
        "Real-time dashboards.",
        "Reduce operational costs.",
        "Automate repetitive tasks.",
        "AI Integration with GPT-4o.",
        "Scalable data engineering."
    ]
};

let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

function typeEffect() {
    const currentPhrases = phrases[currentLang];
    const currentFullText = currentPhrases[phraseIndex];

    if (isDeleting) {
        typingText.textContent = currentFullText.substring(0, charIndex - 1);
        charIndex--; typingSpeed = 50;
    } else {
        typingText.textContent = currentFullText.substring(0, charIndex + 1);
        charIndex++; typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentFullText.length) {
        isDeleting = true; typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false; phraseIndex = (phraseIndex + 1) % currentPhrases.length; typingSpeed = 500;
    }
    setTimeout(typeEffect, typingSpeed);
}

// 3. CEREBRO DEL BOT (Respuestas a todo tipo de dudas)
const botResponses = {
    free: {
        es: "Nuestra **Automatización Gratis** es un proyecto real de 1-2 semanas para un proceso simple (ej. carga de facturas o reportes Excel). Sin costo, para que valides el ahorro real.",
        en: "Our **Free Automation** is a real 1-2 week project for a simple process (e.g., invoice loading or Excel reports). No cost, so you can validate the real savings."
    },
    price: {
        es: "Los packs Pro inician en **USD 300/mes**. Para soluciones de IA avanzada o Arquitectura de Datos completa, presupuestamos a medida según la complejidad.",
        en: "Pro packs start at **USD 300/mo**. For advanced AI solutions or complete Data Architecture, we provide custom quotes based on complexity."
    },
    payments: {
        es: "Aceptamos **Transferencia bancaria (ARS/USD)**, **Mercado Pago** (Argentina), y plataformas internacionales como **Deel o Payoneer**. Ofrecemos facturación y pagos por hitos.",
        en: "We accept **Bank Transfers (ARS/USD)**, **Mercado Pago** (Argentina), and international platforms like **Deel or Payoneer**. We offer invoicing and milestone-based payments."
    },
    time: {
        es: "Un proyecto promedio tarda de **2 a 4 semanas** en estar productivo. Las automatizaciones simples del pack gratuito se entregan en **7-10 días**.",
        en: "An average project takes **2 to 4 weeks** to go live. Simple automations from the free pack are delivered in **7-10 days**."
    },
    cases: {
        es: "Hemos desarrollado **Agentes de RRHH con IA**, conciliaciones bancarias automáticas y sistemas de validación de datos financieros con 100% de precisión.",
        en: "We have developed **AI HR Agents**, automated bank reconciliations, and financial data validation systems with 100% accuracy."
    },
    security: {
        es: "Priorizamos la seguridad. Aplicamos estándares de **Mercado Libre** para el manejo de datos, encriptación y entornos Cloud Native (AWS/GCP) seguros.",
        en: "We prioritize security. We apply **Mercado Libre** standards for data handling, encryption, and secure Cloud Native environments (AWS/GCP)."
    },
    tech: {
        es: "Nuestro stack: **GCP, Snowflake, Apache Airflow, n8n, Python y GPT-4o**. Integramos SAP, Salesforce, Excel y cualquier app con API.",
        en: "Our stack: **GCP, Snowflake, Apache Airflow, n8n, Python, and GPT-4o**. We integrate SAP, Salesforce, Excel, and any app with an API."
    },
    workflow: {
        es: "Metodología: 1. **Diagnóstico** (Gratis). 2. **MVP** (Funcional rápido). 3. **Escalabilidad** y Soporte continuo.",
        en: "Methodology: 1. **Diagnosis** (Free). 2. **MVP** (Fast functional). 3. **Scalability** and continuous Support."
    },
    human: {
        es: "¡Excelente! Te derivaré con un consultor. Agenda tu llamada de 30 min aquí: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Agendar Llamada</a>",
        en: "Excellent! I'll refer you to a consultant. Book your 30-min call here: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF'>📅 Book a Call</a>"
    }
};

// LÓGICA DE DETECCIÓN INTELIGENTE
const sendBtn = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');
const typingIndicator = document.getElementById('typing-indicator');

const intents = {
    payments: ['pago','pagos','formas de pago','metodo de pago','transferencia','mercado pago','deel','payoneer','tarjeta','paypal'],
    price: ['precio','cuanto sale','cuanto cuesta','valor','mensual','mes'],
    time: ['tiempo','tarda','plazo','entrega','dias'],
    free: ['gratis','free','prueba'],
    cases: ['caso','ejemplo','experiencia','exito'],
    security: ['seguridad','datos','confidencial','seguro'],
    tech: ['gcp','snowflake','python','airflow','herramienta','tech'],
    workflow: ['metodo','workflow','proceso','pasos','como trabajan'],
    human: ['consultor','hablar','persona','reunion','llamada']
};

sendBtn.addEventListener('click', () => {
    const rawText = chatInput.value;

    const normalizedText = rawText
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

   if (!normalizedText) return;

    addMessage(rawText, 'user');
    chatInput.value = '';
    typingIndicator.style.display = 'flex';

    setTimeout(() => {
        typingIndicator.style.display = 'none';

        const detectedIntent = Object.entries(intents)
            .find(([_, keywords]) => keywords.some(k => normalizedText.includes(k)))
            ?. [0];

        if (detectedIntent) {
            botReply(detectedIntent);
        } else {
           console.warn('Fallback:', normalizedText);

            addMessage(
                currentLang === 'es'
                    ? "Gracias por tu consulta. Puedo ayudarte con precios, formas de pago, tiempos, casos reales o agendar una llamada. ¿Qué te gustaría ver?"
                    : "Thanks for your message. I can help with pricing, payment methods, timelines, real use cases, or booking a call. What would you like to check?",
                'bot'
            );
            showChatMenu();
        }

    }, 1000);
});



function addMessage(text, type) {
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    chatBody.appendChild(msg);
    chatBody.scrollTop = chatBody.scrollHeight;
}

function botReply(action) {
    addMessage(botResponses[action][currentLang], 'bot');
    setTimeout(showChatMenu, 500);
}

function showChatMenu() {
    const existingMenu = document.querySelector('.chat-options');
    if (existingMenu) existingMenu.remove();
    const menuDiv = document.createElement('div');
    menuDiv.className = 'chat-options';
    menuDiv.innerHTML = `
        <button class="chat-opt-btn" data-action="price">${currentLang === 'es' ? '💰 Planes' : '💰 Plans'}</button>
        <button class="chat-opt-btn" data-action="time">${currentLang === 'es' ? '⏱️ Tiempos' : '⏱️ Times'}</button>
        <button class="chat-opt-btn" data-action="human">${currentLang === 'es' ? '👤 Agendar reunion' : '👤 Book Call'}</button>
    `;
    chatBody.appendChild(menuDiv);
    chatBody.scrollTop = chatBody.scrollHeight;
}

document.addEventListener('click', (e) => {
    if (e.target.classList.contains('chat-opt-btn')) {
        const action = e.target.getAttribute('data-action');
        addMessage(e.target.innerText, 'user');
        e.target.parentElement.remove();
        botReply(action);
    }
});

// 4. ANIMACIONES Y CARGA
window.addEventListener('DOMContentLoaded', () => {
    typeEffect();
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    updateBotLanguage();
});

function updateBotLanguage() {
    chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
}

document.getElementById('chat-trigger').addEventListener('click', () => {
    document.getElementById('chat-window').style.display = document.getElementById('chat-window').style.display === 'flex' ? 'none' : 'flex';
});

document.getElementById('close-chat').addEventListener('click', () => {
    document.getElementById('chat-window').style.display = 'none';
});

chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendBtn.click(); });

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) { target.scrollIntoView({ behavior: 'smooth' }); }
    });
});
