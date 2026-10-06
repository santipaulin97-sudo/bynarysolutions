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


    // ==========================================
    // CAMBIO DE IDIOMA
    // ==========================================

    if (langToggle) {

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

                    if (el.tagName === 'INPUT') {

                        el.placeholder =
                            el.getAttribute(`data-${currentLang}-placeholder`);

                    } else {

                        el.innerHTML = text;

                    }

                }

            });

            // Placeholder del chat
            if (chatInput) {
                chatInput.placeholder =
                    chatInput.getAttribute(`data-${currentLang}-placeholder`);
            }

        });

    }


    // ==========================================
    // 2. EFECTO TYPING - HERO
    // ==========================================

    const typingText = document.getElementById('typing-text');

    const phrases = {

        es: [
            "Automatice procesos operativos.",
            "Conecte sus sistemas.",
            "Obtenga visibilidad en tiempo real.",
            "Reduzca trabajo manual.",
            "Convierta datos en decisiones."
        ],

        en: [
            "Automate operational workflows.",
            "Connect your existing systems.",
            "Gain real-time visibility.",
            "Reduce manual work.",
            "Turn data into decisions."
        ]

    };


    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;


    function typeEffect() {

        if (!typingText) return;

        const currentPhrases = phrases[currentLang];

        // Protección al cambiar de idioma
        if (phraseIndex >= currentPhrases.length) {
            phraseIndex = 0;
        }

        const currentFullText = currentPhrases[phraseIndex];


        if (isDeleting) {

            typingText.textContent =
                currentFullText.substring(0, charIndex - 1);

            charIndex--;
            typingSpeed = 50;

        } else {

            typingText.textContent =
                currentFullText.substring(0, charIndex + 1);

            charIndex++;
            typingSpeed = 100;

        }


        if (!isDeleting && charIndex === currentFullText.length) {

            isDeleting = true;
            typingSpeed = 1800;

        } else if (isDeleting && charIndex === 0) {

            isDeleting = false;

            phraseIndex =
                (phraseIndex + 1) % currentPhrases.length;

            typingSpeed = 400;

        }


        setTimeout(typeEffect, typingSpeed);

    }

    typeEffect();


    // ==========================================
    // 3. INTENCIONES DEL BOT
    // ==========================================

    const intents = {

        // Diagnóstico Operativo
        assessment: [
            'diagnostico',
            'assessment',
            'evaluacion',
            'evaluar',
            'analizar proceso',
            'proceso operativo',
            'oportunidad',
            'mejorar proceso'
        ],


        // Soluciones
        solutions: [
            'soluciones',
            'solution',
            'solutions',
            'automatizacion',
            'automation',
            'software',
            'integracion',
            'integraciones',
            'integration',
            'dashboard',
            'dashboards',
            'operaciones',
            'operations'
        ],


        // Casos de Uso
        cases: [
            'casos',
            'case',
            'cases',
            'ejemplos',
            'example',
            'examples',
            'proyectos',
            'portfolio',
            'reconciliation',
            'conciliacion',
            'report',
            'reporte',
            'inventario',
            'inventory',
            'erp',
            'wms'
        ],


        // Contacto
        human: [
            'humano',
            'persona',
            'contacto',
            'hablar',
            'llamada',
            'call',
            'meeting',
            'reunion',
            'zoom',
            'meet',
            'calendly',
            'agendar',
            'whatsapp',
            'phone',
            'telefono'
        ],


        // Tecnología
        tech: [
            'tech',
            'tecnologia',
            'stack',
            'tools',
            'herramientas',
            'python',
            'aws',
            'gcp',
            'cloud',
            'sql',
            'etl',
            'api',
            'apis',
            'codigo',
            'programacion'
        ],


        // Seguridad
        security: [
            'seguridad',
            'security',
            'privacy',
            'privacidad',
            'confidencial',
            'nda',
            'proteccion',
            'secure'
        ],


        // Tiempo / implementación
        time: [
            'tiempo',
            'time',
            'timing',
            'tarda',
            'demora',
            'plazo',
            'dias',
            'semanas',
            'meses',
            'how long',
            'cuando'
        ],


        // Precios
        price: [
            'precio',
            'precios',
            'price',
            'pricing',
            'cost',
            'costs',
            'costo',
            'cuanto sale',
            'cuanto cuesta',
            'tarifa',
            'fee',
            'usd'
        ],


        // Saludos
        greetings: [
            'hola',
            'hello',
            'hi',
            'hey',
            'buen dia',
            'buenos dias',
            'buenas',
            'inicio',
            'start',
            'info'
        ]

    };


    // ==========================================
    // 4. RESPUESTAS DEL BOT
    // ==========================================

    const botResponses = {

        greetings: {

            es: "¡Hola! Soy BYN Bot 🤖. Puedo ayudarte a conocer nuestras **soluciones**, explorar **casos de uso** o solicitar un **diagnóstico operativo**.",

            en: "Hi! I'm BYN Bot 🤖. I can help you explore our **solutions**, review **use cases**, or request an **operational assessment**."

        },


        assessment: {

            es: "Nuestro **Diagnóstico Operativo** comienza analizando un proceso concreto de su empresa. Identificamos tareas manuales, cuellos de botella, errores y oportunidades donde software, automatización o mejores datos pueden generar impacto. Si encontramos una oportunidad clara, diseñamos una propuesta de solución.",

            en: "Our **Operational Assessment** starts by reviewing one specific business workflow. We identify manual work, bottlenecks, errors and opportunities where software, automation or better data visibility can create impact. If we find a clear opportunity, we design a proposed solution."

        },


        solutions: {

            es: "Trabajamos principalmente en tres áreas:<br><br>⚙️ **Automatización Operativa:** procesos manuales, alertas y controles.<br>🔌 **Software e Integraciones:** conectamos ERP, WMS, CRM, APIs y herramientas internas.<br>📊 **Data & Analytics:** dashboards, pipelines y reporting operativo.",

            en: "We focus on three main areas:<br><br>⚙️ **Operational Automation:** manual workflows, alerts and controls.<br>🔌 **Software & Integrations:** connecting ERP, WMS, CRM, APIs and internal tools.<br>📊 **Data & Analytics:** dashboards, pipelines and operational reporting."

        },


        cases: {

            es: "Algunos ejemplos de soluciones que podemos desarrollar:<br><br>• Monitoreo de inventario y órdenes<br>• Automatización de reportes operativos<br>• Integraciones ERP / WMS / CRM<br>• Seguimiento de presupuesto vs. gasto real<br>• Dashboards de proyectos y operaciones<br>• Conciliaciones y controles automatizados",

            en: "Some examples of solutions we can build:<br><br>• Inventory and order monitoring<br>• Automated operational reporting<br>• ERP / WMS / CRM integrations<br>• Budget vs. actual tracking<br>• Project and operations dashboards<br>• Automated reconciliation and controls"

        },


        price: {

            es: "Cada solución tiene un **alcance a medida**. El costo depende de la complejidad del proceso, integraciones necesarias y nivel de desarrollo. Primero entendemos la operación y luego proponemos el alcance adecuado.",

            en: "Each solution has a **custom scope**. Pricing depends on workflow complexity, required integrations and development effort. We first understand the operation and then propose the right scope."

        },


        time: {

            es: "Los tiempos dependen del alcance. Una automatización o integración puntual puede resolverse rápidamente, mientras que una plataforma operativa completa requiere un desarrollo por etapas. Definimos tiempos y entregables después del diagnóstico inicial.",

            en: "Timelines depend on scope. A focused automation or integration can be delivered quickly, while a full operational platform is usually developed in stages. We define timing and deliverables after the initial assessment."

        },


        security: {

            es: "La seguridad y confidencialidad forman parte del diseño de cada solución. Podemos trabajar bajo **NDA**, definir accesos específicos e integrar la solución con la infraestructura existente de la empresa.",

            en: "Security and confidentiality are part of each solution's design. We can work under an **NDA**, define specific access controls and integrate with your company's existing infrastructure."

        },


        tech: {

            es: "Trabajamos con tecnologías modernas de **software, datos, cloud y automatización**. Utilizamos Python, SQL, APIs, infraestructura cloud y herramientas de IA cuando generan valor operativo real.",

            en: "We work with modern **software, data, cloud and automation technologies**. We use Python, SQL, APIs, cloud infrastructure and AI when it creates real operational value."

        },


        human: {

            es: "¡Claro! Hablemos.<br><br>📅 <a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>Agendar una llamada</a><br><br>💬 <a href='https://wa.me/5493515310485' target='_blank' style='color:#00ff88; font-weight:bold;'>Hablar por WhatsApp</a>",

            en: "Sure! Let's talk.<br><br>📅 <a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>Book a Call</a><br><br>💬 <a href='https://wa.me/5493515310485' target='_blank' style='color:#00ff88; font-weight:bold;'>WhatsApp Chat</a>"

        }

    };


    // ==========================================
    // 5. ABRIR / CERRAR CHAT
    // ==========================================

    if (chatTrigger && chatWindow) {

        chatTrigger.addEventListener('click', () => {

            chatWindow.style.display = 'flex';
            chatTrigger.style.display = 'none';

        });


        if (closeBtn) {

            closeBtn.addEventListener('click', () => {

                chatWindow.style.display = 'none';
                chatTrigger.style.display = 'flex';

            });

        }

    }

// ==========================================
// ENVIAR MENSAJE
// ==========================================

if (sendBtn && chatInput) {

    sendBtn.addEventListener('click', processUserMessage);

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            processUserMessage();
        }
    });

}


// ==========================================
// CLICK EN OPCIONES DEL CHAT
// ==========================================

if (chatBody) {

    chatBody.addEventListener('click', (e) => {

        if (e.target.classList.contains('chat-opt-btn')) {

            const action = e.target.getAttribute('data-action');
            const text = e.target.innerText;

            // Mostrar opción seleccionada como mensaje del usuario
            addMessage(text, 'user');

            // Eliminar el menú usado
            const menu = e.target.parentElement;

            if (menu && menu.classList.contains('chat-options')) {
                menu.remove();
            }

            // Responder según acción
            botReply(action);

        }

    });

}


// ==========================================
// PROCESAR MENSAJE ESCRITO
// ==========================================

function processUserMessage() {

    if (!chatInput) return;

    const rawText = chatInput.value.trim();

    if (!rawText) return;

    addMessage(rawText, 'user');

    chatInput.value = '';

    showTyping();


    setTimeout(() => {

        hideTyping();

        const normalizedText = rawText
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "");


        // ======================================
        // CONFIRMACIONES
        // ======================================

        if (
            ['si', 'yes', 'ok', 'dale', 'sure', 'claro', 'perfecto'].includes(normalizedText)
        ) {

            if (
                lastIntent === 'assessment' ||
                lastIntent === 'solutions' ||
                lastIntent === 'cases' ||
                lastIntent === 'price'
            ) {

                addMessage(botResponses.human[currentLang], 'bot');

                lastIntent = null;

                return;

            }

        }


        // ======================================
        // DETECTAR INTENCIÓN
        // ======================================

        const match = Object.entries(intents).find(([_, keywords]) =>
            keywords.some(keyword =>
                normalizedText.includes(
                    keyword
                        .toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                )
            )
        );


        const detectedIntent = match ? match[0] : null;


        // ======================================
        // RESPUESTA
        // ======================================

        if (detectedIntent && botResponses[detectedIntent]) {

            lastIntent = detectedIntent;

            addMessage(
                botResponses[detectedIntent][currentLang],
                'bot'
            );


            // No mostrar menú si ya pidió contacto
            if (detectedIntent !== 'human') {

                setTimeout(showChatMenu, 700);

            }

        } else {

            const fallbackMsg =
                currentLang === 'es'

                    ? "No estoy seguro de haber entendido 🤔. Puedo ayudarte con nuestro **Diagnóstico Operativo**, nuestras **Soluciones**, **Casos de Uso** o puedes **hablar con nosotros**."

                    : "I'm not sure I understood 🤔. I can help you with our **Operational Assessment**, **Solutions**, **Use Cases**, or you can **talk to us**.";


            addMessage(fallbackMsg, 'bot');

            setTimeout(showChatMenu, 500);

        }

    }, 700);

}


// ==========================================
// RESPUESTA A BOTONES
// ==========================================

function botReply(action) {

    showTyping();

    setTimeout(() => {

        hideTyping();

        if (botResponses[action]) {

            lastIntent = action;

            addMessage(
                botResponses[action][currentLang],
                'bot'
            );


            if (action !== 'human') {

                setTimeout(showChatMenu, 600);

            }

        }

    }, 600);

}


// ==========================================
// AGREGAR MENSAJE AL CHAT
// ==========================================

function addMessage(text, type) {

    if (!chatBody) return;

    const msg = document.createElement('div');

    msg.className = `message ${type}`;


    // Convierte **texto** en negrita
    const formattedText = text.replace(
        /\*\*(.*?)\*\*/g,
        '<strong>$1</strong>'
    );


    msg.innerHTML = formattedText;


    if (typingIndicator) {

        chatBody.insertBefore(msg, typingIndicator);

    } else {

        chatBody.appendChild(msg);

    }


    chatBody.scrollTop = chatBody.scrollHeight;

}


// ==========================================
// MENÚ DINÁMICO
// ==========================================

function showChatMenu() {

    if (!chatBody) return;

    // Evitar menús duplicados
    if (document.querySelector('.chat-options-dynamic')) return;


    const menuDiv = document.createElement('div');

    menuDiv.className =
        'chat-options chat-options-dynamic';


    menuDiv.innerHTML = `

        <button
            class="chat-opt-btn"
            data-action="assessment">
            ⚙️ ${
                currentLang === 'es'
                    ? 'Diagnóstico Operativo'
                    : 'Operational Assessment'
            }
        </button>

        <button
            class="chat-opt-btn"
            data-action="solutions">
            🚀 ${
                currentLang === 'es'
                    ? 'Ver Soluciones'
                    : 'Explore Solutions'
            }
        </button>

        <button
            class="chat-opt-btn"
            data-action="cases">
            📊 ${
                currentLang === 'es'
                    ? 'Casos de Uso'
                    : 'Use Cases'
            }
        </button>

        <button
            class="chat-opt-btn"
            data-action="human">
            👤 ${
                currentLang === 'es'
                    ? 'Hablar con Nosotros'
                    : 'Talk to Us'
            }
        </button>

    `;


    if (typingIndicator) {

        chatBody.insertBefore(
            menuDiv,
            typingIndicator
        );

    } else {

        chatBody.appendChild(menuDiv);

    }


    chatBody.scrollTop =
        chatBody.scrollHeight;

}


// ==========================================
// INDICADOR DE ESCRITURA
// ==========================================

function showTyping() {

    if (typingIndicator) {

        typingIndicator.style.display = 'flex';

        if (chatBody) {
            chatBody.scrollTop =
                chatBody.scrollHeight;
        }

    }

}


function hideTyping() {

    if (typingIndicator) {

        typingIndicator.style.display = 'none';

    }

}
// ==========================================
// 6. ANIMACIONES REVEAL
// ==========================================

const observer = new IntersectionObserver(
    (entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add('active');

            }

        });

    },
    {
        threshold: 0.08
    }
);


// Activar elementos reveal
document.querySelectorAll('.reveal').forEach(el => {

    observer.observe(el);

});


// ==========================================
// 7. SMOOTH SCROLL
// ==========================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener('click', function (e) {

        const targetId = this.getAttribute('href');

        if (!targetId) return;

        e.preventDefault();


        if (targetId === '#') {

            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });

            return;

        }


        const target = document.querySelector(targetId);

        if (target) {

            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

        }

    });

});


// ==========================================
// 8. ACTIVACIÓN INICIAL DE SEGURIDAD
// ==========================================

// Evita que la web quede invisible si IntersectionObserver tarda
setTimeout(() => {

    document.querySelectorAll('.reveal').forEach(el => {

        const rect = el.getBoundingClientRect();

        if (rect.top < window.innerHeight) {

            el.classList.add('active');

        }

    });

}, 100);


// ==========================================
// CIERRE DOMContentLoaded
// ==========================================

});
