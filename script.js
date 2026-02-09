document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONFIGURACIÓN GLOBAL & IDIOMA
    // ==========================================
    let currentLang = 'es';
    let lastIntent = null;
    const langToggle = document.getElementById('lang-switch');
    const langOptions = document.querySelectorAll('.lang-opt');

    // Elementos del Chat
    const chatWindow = document.getElementById('chat-window');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-chat');
    const closeBtn = document.getElementById('close-chat');
    const chatTrigger = document.getElementById('chat-trigger');
    const typingIndicator = document.getElementById('typing-indicator');

    // Lógica de Cambio de Idioma
    langToggle.addEventListener('click', (e) => {
        const target = e.target.closest('.lang-opt');
        if (!target || target.classList.contains('active')) return;

        langOptions.forEach(opt => opt.classList.remove('active'));
        target.classList.add('active');
        currentLang = target.getAttribute('data-value');

        // Actualizar textos estáticos
        document.querySelectorAll('[data-es]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`);
            if (text) {
                if (el.tagName === 'INPUT') el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
                else el.innerHTML = text;
            }
        });
        
        // Actualizar placeholder del chat si existe
        if(chatInput) chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
    });

    // ==========================================
    // 2. EFECTO TYPING (HERO SECTION)
    // ==========================================
    const typingText = document.getElementById('typing-text');
    const phrases = {
        es: ["Dashboards en tiempo real.", "Reduzca costos operativos.", "Automatice tareas repetitivas.", "Integración de IA con GPT-4o.", "Ingeniería de datos escalable."],
        en: ["Real-time dashboards.", "Reduce operational costs.", "Automate repetitive tasks.", "AI Integration with GPT-4o.", "Scalable data engineering."]
    };

    let phraseIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

    function typeEffect() {
        if (!typingText) return;
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
    typeEffect();

    // ==========================================
    // 3. CEREBRO DEL BOT (COREGIIDO)
    // ==========================================
    
    // Palabras clave para detectar intención
    const intents = {
       greetings: ['hola','hello','hi','hey','buen dia','buenos dias','buenas','start','inicio','arrancar','empezar','info','hey bot'],
       payments: ['pago','pagos','pagar','payment','payments','pay','formas de pago','metodo','metodos','transferencia','factura','invoice','usdt','crypto','payoneer','deel','mercado pago'],
       price: ['precio','precios','price','prices','cost','costs','costo','costos','cuanto sale','cuanto cuesta','rate','rates','tarifa','tarifas','planes','plan','valor','fee','fees','$$','$','usd'],
       time: ['tiempo','time','timing','tarda','tardan','demora','demoran','plazo','dias','semanas','meses','how long','when','cuando'],
       free: ['gratis','free','free trial','trial','prueba','demo','test','sin costo','regalo','probar','sample'],
       security: ['seguridad','security','datos','data','privacy','privacidad','confidencial','nda','legal','contrato','proteccion','safe','secure'],
       tech: ['tech','tecnologia','tecnologías','stack','tools','herramientas','python','aws','gcp','google','cloud','sql','etl','lenguaje','codigo','programacion'],
       agent: ['agente','agentes','agent','agents','bot','bots','ia','inteligencia','artificial','gpt','llm','que es un agente','what is an agent'],
       human: ['humano','persona','alguien','contacto','hablar','llamada','call','reunion','meeting','zoom','meet','calendly','agendar','charlar'],
       cases: ['casos','case','cases','ejemplos','example','examples','experiencia','clientes','exito','resultados','portfolio','proyectos']
    };

    // Respuestas del Bot
    const botResponses = {
        greetings: {
            es: "¡Hola! Soy BYN Bot 🤖. Estoy aquí para ayudarte a automatizar tu negocio. Pregúntame sobre **precios**, **tiempos** o nuestra **prueba gratis**.",
            en: "Hi! I'm BYN Bot 🤖. I'm here to help you automate your business. Ask me about **pricing**, **timelines**, or our **free trial**."
        },
        free: {
            es: "Nuestra **Automatización Gratis** es un proyecto real de 1 semana (ej. leer facturas, enviar emails). Sin costo, para que pruebes nuestra calidad. ¿Te interesa?",
            en: "Our **Free Automation** is a real 1-week project (e.g., reading invoices, sending emails). No cost, just to prove our quality. Interested?"
        },
        price: {
            es: "Manejamos dos niveles principales: <br>1. **Standard ($400 USD/mes):** Incluye mantenimiento, monitoreo 24/7 de tus bots y ajustes menores. Ideal para mantener la estabilidad.<br>2. **Premium (Desde $700 USD/mes):** Desarrollo continuo, nuevos Agentes de IA a medida y Data Engineering complejo.<br>¿Buscas mantener o escalar?",
            en: "We offer two main tiers: <br>1. **Standard ($400 USD/mo):** Includes maintenance, 24/7 bot monitoring, and minor tweaks. Ideal for stability.<br>2. **Premium (From $700 USD/mo):** Continuous development, new custom AI Agents, and complex Data Engineering.<br>Are you looking to maintain or scale?"
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
            es: "Somos **Cloud Native**. Usamos **Python** como motor principal, orquestado en **AWS/GCP**. Integramos modelos LLM (GPT-4o/Claude) con tus datos vía **RAG** (Retrieval-Augmented Generation) para precisión total. Nada de 'low-code' frágil.",
            en: "We are **Cloud Native**. We use **Python** as our main engine, orchestrated on **AWS/GCP**. We integrate LLM models (GPT-4o/Claude) with your data via **RAG** for total precision. No fragile 'low-code' tools."
        },
        agent: {
            es: "Un **Agente IA** no es un simple chatbot. Es un 'empleado digital' capaz de razonar, usar herramientas (Excel, Email, CRMs) y ejecutar tareas complejas 24/7 sin descanso. ¿Te imaginas tener uno trabajando para ti?",
            en: "An **AI Agent** is not just a chatbot. It's a 'digital employee' capable of reasoning, using tools (Excel, Email, CRMs), and executing complex tasks 24/7 without rest. Imagine having one working for you?"
        },
        human: {
            es: "¡Claro! A veces es mejor hablar. Agenda 30 min con Santiago o Tomás aquí: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Agendar Llamada</a>",
            en: "Sure! Sometimes talking is better. Book 30 mins with Santiago or Tomás here: <br><a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Book a Call</a>"
        }
    };

    // ==========================================
    // 4. LÓGICA DE INTERACCIÓN DEL CHAT
    // ==========================================

    // Abrir/Cerrar
    chatTrigger.addEventListener('click', () => {
        chatWindow.style.display = 'flex';
        chatTrigger.style.display = 'none';
    });

    closeBtn.addEventListener('click', () => {
        chatWindow.style.display = 'none';
        chatTrigger.style.display = 'flex';
    });

    // Enviar mensaje
    sendBtn.addEventListener('click', processUserMessage);
    chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processUserMessage(); });

    // Click en opciones (botones dentro del chat)
    chatBody.addEventListener('click', (e) => {
        if (e.target.classList.contains('chat-opt-btn')) {
            const action = e.target.getAttribute('data-action');
            const text = e.target.innerText;
            
            // Simular mensaje usuario
            addMessage(text, 'user');
            
            // Eliminar menú de opciones tras click
            const menu = e.target.parentElement;
            if (menu.classList.contains('chat-options')) menu.remove();

            // Responder
            botReply(action);
        }
    });

    function processUserMessage() {
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        addMessage(rawText, 'user');
        chatInput.value = '';
        
        showTyping();

        setTimeout(() => {
            hideTyping();
            
            const normalizedText = rawText.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

             // 🔹 CONFIRMACIONES
        if (['si','yes','ok','dale','sure'].includes(normalizedText)) {
            if (lastIntent === 'price' || lastIntent === 'free') {
                addMessage(botResponses.human[currentLang], 'bot');
                lastIntent = null;
                setTimeout(showChatMenu, 800);
                return;
            }
        }
            // Buscar coincidencia
            const match = Object.entries(intents).find(([_, keywords]) => 
                keywords.some(k => normalizedText.includes(k))
            );

            const detectedIntent = match ? match[0] : null;

            
        if (detectedIntent && botResponses[detectedIntent]) {
            lastIntent = detectedIntent; // 🔹 GUARDAR CONTEXTO
            addMessage(botResponses[detectedIntent][currentLang], 'bot');

            if (detectedIntent !== 'human') {
                setTimeout(showChatMenu, 800);
            }
        } else {
            const fallbackMsg = currentLang === 'es' 
                ? "No estoy seguro de haber entendido 🤔. Pero puedo ayudarte con **Precios**, **Tecnología** o agendar una **Llamada**."
                : "I'm not sure I got that 🤔. But I can help you with **Pricing**, **Tech**, or booking a **Call**.";

            addMessage(fallbackMsg, 'bot');
            setTimeout(showChatMenu, 500);
        }
    }, 800);
}

    function botReply(action) {
        showTyping();
        setTimeout(() => {
            hideTyping();
            if (botResponses[action]) {
                addMessage(botResponses[action][currentLang], 'bot');
                if (action !== 'human') setTimeout(showChatMenu, 600);
            }
        }, 600);
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        
        // ESTA ES LA MAGIA: Reemplaza **texto** por <strong>texto</strong>
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        msg.innerHTML = formattedText; 
        chatBody.insertBefore(msg, typingIndicator); 
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showChatMenu() {
        if(document.querySelector('.chat-options-dynamic')) return; // Evitar duplicados

        const menuDiv = document.createElement('div');
        menuDiv.className = 'chat-options chat-options-dynamic';
        menuDiv.innerHTML = `
            <button class="chat-opt-btn" data-action="free">🎁 ${currentLang === 'es' ? 'Prueba Gratis' : 'Free Trial'}</button>
            <button class="chat-opt-btn" data-action="price">💰 ${currentLang === 'es' ? 'Precios' : 'Pricing'}</button>
            <button class="chat-opt-btn" data-action="tech">🚀 ${currentLang === 'es' ? 'Tecnología' : 'Tech'}</button>
            <button class="chat-opt-btn" data-action="human">👤 ${currentLang === 'es' ? 'Agendar' : 'Book Call'}</button>
        `;
        chatBody.insertBefore(menuDiv, typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping() {
        typingIndicator.style.display = 'flex';
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function hideTyping() {
        typingIndicator.style.display = 'none';
    }

    // ==========================================
  // 5. ANIMACIONES AL SCROLLEAR Y NAVEGACIÓN
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
// --- LÓGICA DE NAVEGACIÓN MEJORADA (LOGO + SECCIONES) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        // CASO 1: Si es el Logo (href="#") -> Ir arriba de todo
        if (targetId === '#') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } 
        // CASO 2: Si es una sección (href="#packs") -> Ir a la sección
        else {
            const target = document.querySelector(targetId);
            if (target) { 
                target.scrollIntoView({ behavior: 'smooth' }); 
            }
        }
    });
  });
});
