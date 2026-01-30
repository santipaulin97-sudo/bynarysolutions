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
    free: {
        es: "Nuestra **Automatización Gratis** es un proyecto real de 1 semana (ej. leer facturas, enviar emails). Sin costo, para que pruebes nuestra calidad. ¿Te interesa?",
        en: "Our **Free Automation** is a real 1-week project (e.g., reading invoices, sending emails). No cost, just to prove our quality. Interested?"
    },
    price: {
        es: "Tenemos 2 modelos: <br>1. **Proyecto Puntual:** Desde $300 USD.<br>2. **Mantenimiento Mensual:** Para soporte continuo.<br>¿Te gustaría agendar una llamada para cotizar?",
        en: "We have 2 models: <br>1. **One-off Project:** Starts at $300 USD.<br>2. **Monthly Retainer:** For continuous support.<br>Would you like to book a call for a quote?"
    },
    payments: {
        es: "Aceptamos **Transferencia bancaria (ARS/USD)**, **Mercado Pago**, Crypto (USDT) y plataformas como **Deel o Payoneer**. Emitimos factura internacional.",
        en: "We accept **Bank Transfers (ARS/USD)**, **Mercado Pago**, Crypto (USDT), and platforms like **Deel or Payoneer**. International invoicing available."
    },
    time: {
        es: "Somos rápidos. La automatización gratuita toma **3-5 días**. Proyectos complejos de Data Engineering toman de **2 a 4 semanas**.",
        en: "We are fast. The free automation takes **3-5 days**. Complex Data Engineering projects take **2-4 weeks**."
    },
    cases: {
        es: "Hemos creado **Agentes de RRHH**, conciliaciones bancarias automáticas y validación de datos financieros. Ahorramos +40hs semanales a nuestros clientes.",
        en: "We've built **HR Agents**, automated bank reconciliations, and financial data validation. We save our clients +40hs per week."
    },
    security: {
        es: "Tu seguridad es prioridad. Firmamos **NDA (Acuerdo de Confidencialidad)**. Usamos infraestructura encriptada en AWS/GCP. Tus datos nunca se comparten.",
        en: "Security is priority. We sign an **NDA**. We use encrypted infrastructure on AWS/GCP. Your data is never shared."
    },
    tech: {
        es: "Stack Cloud Native: **Python, AWS/GCP, Snowflake, Airflow y GPT-4o**. Código robusto y escalable, nada de soluciones 'low-code' frágiles.",
        en: "Cloud Native Stack: **Python, AWS/GCP, Snowflake, Airflow, and GPT-4o**. Robust and scalable code, no fragile 'low-code' solutions."
    },
    human: {
        es: "¡Claro! A veces es mejor hablar. Agenda 30 min con Santiago o Tomás aquí: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Agendar Llamada</a>",
        en: "Sure! Sometimes talking is better. Book 30 mins with Santiago or Tomás here: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Book a Call</a>"
    }
};

// LÓGICA DE DETECCIÓN INTELIGENTE
const sendBtn = document.getElementById('send-chat');
const chatInput = document.getElementById('chat-input');
const chatBody = document.getElementById('chat-body');
const typingIndicator = document.getElementById('typing-indicator');

const intents = {
    greetings: ['hola', 'buen dia', 'buenas', 'hello', 'hi', 'hey', 'start'],
    payments: ['pago', 'pagos', 'formas de pago', 'metodo', 'transferencia', 'factura', 'usdt', 'crypto', 'payoneer'],
    price: ['precio', 'costo', 'cuanto sale', 'valor', 'tarifas', 'price', 'cost', 'rates'],
    time: ['tiempo', 'tarda', 'plazo', 'demora', 'dias', 'time', 'how long'],
    free: ['gratis', 'free', 'prueba', 'regalo', 'trial'],
    security: ['seguridad', 'datos', 'confidencial', 'nda', 'proteccion', 'security', 'privacy'],
    tech: ['tecnologia', 'stack', 'python', 'aws', 'google', 'cloud', 'tech', 'tools'],
    human: ['persona', 'humano', 'contacto', 'reunion', 'llamada', 'zoom', 'meet', 'calendly'],
    cases: ['casos', 'ejemplos', 'experiencia', 'exito', 'cases', 'examples']
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

       const match = Object.entries(intents)
            .find(([_, keywords]) => keywords.some(k => normalizedText.includes(k)));

        const detectedIntent = match ? match[0] : null;

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
