document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. CONFIGURACIÓN GLOBAL & IDIOMA
    // ==========================================
    let currentLang = 'es';
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
    if(langToggle) {
        langToggle.addEventListener('click', (e) => {
            const target = e.target.closest('.lang-opt');
            if (!target || target.classList.contains('active')) return;

            langOptions.forEach(opt => opt.classList.remove('active'));
            target.classList.add('active');
            currentLang = target.getAttribute('data-value');

            // Actualizar textos estáticos del sitio
            document.querySelectorAll('[data-es]').forEach(el => {
                const text = el.getAttribute(`data-${currentLang}`);
                if (text) {
                    if (el.tagName === 'INPUT') el.placeholder = el.getAttribute(`data-${currentLang}-placeholder`);
                    else el.innerHTML = text;
                }
            });
            
            // Actualizar placeholder del chat
            if(chatInput) chatInput.placeholder = chatInput.getAttribute(`data-${currentLang}-placeholder`);
        });
    }

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
    // 3. CEREBRO IA (CONECTADO A GEMINI 1.5 FLASH)
    // ==========================================
    
    // TU API KEY REAL
    const API_KEY = "AIzaSyBIouGHm5eeMRxdefGqM7T28UK6Auzw4Qs"; 
    
    // Configuración de la IA
    const getSystemInstruction = (lang) => {
        return `
        Eres "BYN Bot", el asistente experto en ventas de BYNARY Solutions (Consultora de IA y Data).
        Tu objetivo: Responder dudas cortas, vender autoridad técnica y persuadir al usuario para agendar una llamada.
        
        INFORMACIÓN DE LA EMPRESA:
        - Servicios: Automatización de Procesos (Python), Agentes IA, Data Engineering (ETL, SQL), Dashboards (Looker Studio), Conciliación Bancaria Automática.
        - Diferencial: No usamos "low-code" frágil. Somos Cloud Native (AWS/GCP) y usamos Python robusto. Eliminamos el Excel manual.
        - Precios: 
          1. Plan Standard ($400 USD/mes): Mantenimiento, monitoreo 24/7 y estabilidad.
          2. Plan Premium (Desde $700 USD/mes): Desarrollo continuo, nuevos agentes a medida y escalabilidad.
          3. Prueba Gratis: Automatización de 1 semana sin costo (Gancho de venta).
        - Equipo: Santiago Paulin (Data Engineer), Tomas Gnarra (Data Scientist).
        
        REGLAS DE COMPORTAMIENTO:
        1. Sé breve (máximo 2-3 oraciones). Usa emojis tech (🚀, 🤖, ⚡).
        2. Si preguntan precios, explica la diferencia entre mantener vs escalar.
        3. Si preguntan "¿Qué es un agente?", véndelo como un "Empleado Digital 24/7".
        4. SIEMPRE intenta cerrar invitando a agendar: "https://calendly.com/santipaulin97/30min".
        5. IMPORTANTE: Responde SIEMPRE en el idioma: ${lang === 'es' ? 'ESPAÑOL' : 'INGLÉS'}.
        `;
    };

    // Función para llamar a Google Gemini
    async function getGeminiResponse(userMessage) {
        // Usamos la versión v1beta y el modelo flash que es más rápido/barato
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
        
        const requestBody = {
            contents: [{
                parts: [{ text: `Instrucciones del Sistema: ${getSystemInstruction(currentLang)}\n\nUsuario dice: ${userMessage}` }]
            }]
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            // Verificación de errores en la consola (Presiona F12 en tu navegador si falla)
            if (!response.ok) {
                console.error("Error de API Google:", data);
                throw new Error("Error en la respuesta de la API");
            }

            // Extraer texto de forma segura
            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                console.error("Respuesta vacía o bloqueada por seguridad:", data);
                return "Lo siento, no pude procesar eso. ¿Podemos hablar mejor en una llamada? 📅";
            }

        } catch (error) {
            console.error("Fallo crítico en fetch:", error);
            // Mensaje de Fallback amigable
            return currentLang === 'es' 
                ? "Mis circuitos están saturados 🔌. Pero me encantaría hablar contigo. ¿Agendamos? <a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Agendar</a>"
                : "My circuits are overloaded 🔌. But I'd love to chat. Book a call? <a href='https://calendly.com/santipaulin97/30min' target='_blank' style='color:#00E0FF; font-weight:bold;'>📅 Book Now</a>";
        }
    }

    // ==========================================
    // 4. LÓGICA DE INTERACCIÓN DEL CHAT
    // ==========================================

    // Abrir/Cerrar
    if(chatTrigger && chatWindow) {
        chatTrigger.addEventListener('click', () => {
            chatWindow.style.display = 'flex';
            chatTrigger.style.display = 'none';
        });

        closeBtn.addEventListener('click', () => {
            chatWindow.style.display = 'none';
            chatTrigger.style.display = 'flex';
        });
    }

    // Enviar mensaje
    if(sendBtn) {
        sendBtn.addEventListener('click', processUserMessage);
        chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') processUserMessage(); });
    }

    // Click en opciones (botones dentro del chat)
    if(chatBody) {
        chatBody.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-opt-btn')) {
                const text = e.target.innerText;
                
                // Procesar como si el usuario lo escribiera
                // No lo ponemos en el input para que sea más limpio, directo al chat
                addMessage(text, 'user');
                showTyping();
                
                // Llamar a la IA con el texto del botón
                getGeminiResponse(text).then(response => {
                    hideTyping();
                    const formattedResponse = formatResponse(response);
                    addMessage(formattedResponse, 'bot');
                    setTimeout(showChatMenu, 2500);
                });

                // Eliminar menú de opciones
                const menu = e.target.parentElement;
                if (menu.classList.contains('chat-options')) menu.remove();
            }
        });
    }

    // Lógica Principal de Procesamiento
    async function processUserMessage() {
        const rawText = chatInput.value.trim();
        if (!rawText) return;

        // 1. Mostrar mensaje usuario
        addMessage(rawText, 'user');
        chatInput.value = '';
        
        // 2. Mostrar "Escribiendo..."
        showTyping();

        // 3. Consultar a la IA
        const aiResponse = await getGeminiResponse(rawText);
        
        // 4. Ocultar typing y Mostrar respuesta
        hideTyping();
        
        const formattedResponse = formatResponse(aiResponse);
        addMessage(formattedResponse, 'bot');
        
        // Mostrar botones de nuevo
        setTimeout(showChatMenu, 2500);
    }

    // Función auxiliar para formatear texto (Negritas y saltos de línea)
    function formatResponse(text) {
        if (!text) return "";
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // Negritas Markdown a HTML
            .replace(/\n/g, '<br>'); // Saltos de línea
    }

    function addMessage(text, type) {
        const msg = document.createElement('div');
        msg.className = `message ${type}`;
        msg.innerHTML = text; 
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
        if(typingIndicator) {
            typingIndicator.style.display = 'flex';
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    }

    function hideTyping() {
        if(typingIndicator) typingIndicator.style.display = 'none';
    }

    // ==========================================
    // 5. ANIMACIONES Y SCROLL
    // ==========================================
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(targetId);
                if (target) target.scrollIntoView({ behavior: 'smooth' }); 
            }
        });
    });

});
