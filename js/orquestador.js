/* =============================================================
   orquestadorAgent — Fase II del workshop
   -------------------------------------------------------------
   Agente conversacional muy sencillo que vive en el navegador.
   No usa ningún modelo de IA: detecta la INTENCIÓN del mensaje
   buscando palabras clave en una versión normalizada del texto
   (sin tildes, en minúsculas) y devuelve una respuesta predefinida.

   Es el primer escalón. En las siguientes fases este mismo
   orquestador delegará en agentes especializados.
   ============================================================= */

const orquestadorAgent = {
  nombre: 'orquestadorAgent',

  bienvenida:
    '👋 ¡Hola! Soy <strong>orquestadorAgent</strong>, el agente de este workshop.\n\n' +
    'En esta fase mi misión es darte la bienvenida y conversar contigo cuando me saludes, ' +
    'te despidas o me preguntes cómo estoy. Todavía no sé hablar de otros temas — eso llegará ' +
    'en las siguientes fases.\n\n' +
    'Hablo <strong>únicamente en español</strong>. Cuéntame, ¿cómo te encuentras hoy?',

  // Quita tildes, pasa a minúsculas y limpia signos.
  normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Diccionario de intenciones → palabras/expresiones clave.
  patrones: {
    saludo: [
      'hola', 'buenas', 'buenos dias', 'buen dia', 'buenas tardes',
      'buenas noches', 'que tal', 'saludos', 'hey', 'ola'
    ],
    despedida: [
      'adios', 'hasta luego', 'hasta pronto', 'hasta la proxima',
      'nos vemos', 'chao', 'chau', 'me voy', 'me despido', 'bye'
    ],
    gracias: [
      'gracias', 'muchas gracias', 'mil gracias', 'te agradezco',
      'agradecido', 'agradecida', 'genial', 'perfecto', 'muy bien',
      'excelente', 'estupendo'
    ],
    bienestar: [
      'como estas', 'como te va', 'que tal tu dia', 'como va',
      'todo bien', 'como te encuentras', 'que tal estas', 'como andas'
    ]
  },

  // Heurística para detectar mensajes sin sentido.
  esBasura(textoNormalizado) {
    const t = textoNormalizado.replace(/\s/g, '');
    if (t.length < 2) return false;
    const sinVocales = !/[aeiou]/.test(t) && t.length >= 4;
    const muchasConsonantesSeguidas = /[bcdfghjklmnpqrstvwxyz]{6,}/.test(t);
    const letraRepetida = /(.)\1{4,}/.test(t);
    const palabraLargaSinVocales =
      t.length >= 8 && !/[aeiou]/.test(t.slice(0, 8));
    return sinVocales || muchasConsonantesSeguidas || letraRepetida || palabraLargaSinVocales;
  },

  detectarIntencion(texto) {
    const limpio = this.normalizar(texto);
    if (!limpio) return 'vacio';
    if (this.esBasura(limpio)) return 'basura';
    for (const intencion of Object.keys(this.patrones)) {
      for (const patron of this.patrones[intencion]) {
        const regex = new RegExp(`(^|\\s)${patron}(\\s|$)`);
        if (regex.test(limpio)) return intencion;
      }
    }
    return 'desconocido';
  },

  // Banco de respuestas (varias por intención para que no suene robótico).
  respuestas: {
    saludo: [
      '¡Hola! Encantado de saludarte.',
      '¡Buenas! ¿Qué tal todo?',
      '¡Hola! Espero que estés teniendo un buen día.'
    ],
    despedida: [
      '¡Hasta pronto!',
      '¡Que tengas un buen día! Nos vemos.',
      '¡Adiós! Vuelve cuando quieras.'
    ],
    gracias: [
      '¡De nada!',
      'Es un placer.',
      'Para eso estoy. ¡Gracias a ti!'
    ],
    bienestar: [
      'Soy un agente sencillo, así que mi día depende del tuyo. ¿Y tú cómo estás?',
      'Por aquí, atento y con ganas de conversar. ¿Qué tal tú?',
      'Todo correcto por mi parte. ¿Y tú cómo te encuentras?'
    ],
    basura: [
      'He recibido un mensaje que no parece tener sentido. ¿Puedes reformularlo en español, por favor?'
    ],
    vacio: [
      'No me has escrito nada todavía. ¡Anímate y dime algo!'
    ],
    desconocido: [
      'En esta fase del workshop solo sé responder a saludos, despedidas, agradecimientos y preguntas sobre cómo estoy. Para el resto, tendrás que esperar a las próximas fases del taller.'
    ]
  },

  responder(texto) {
    const intencion = this.detectarIntencion(texto);
    const opciones = this.respuestas[intencion];
    return opciones[Math.floor(Math.random() * opciones.length)];
  }
};

/* =============================================================
   Widget de chat — control del DOM
   ============================================================= */

(function initChatWidget() {
  const toggle = document.getElementById('chatToggle');
  const windowEl = document.getElementById('chatWindow');
  const closeBtn = document.getElementById('chatClose');
  const body = document.getElementById('chatBody');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  if (!toggle || !windowEl || !body || !form || !input) return;

  let bienvenidaMostrada = false;

  function añadirBurbuja(texto, autor) {
    const burbuja = document.createElement('div');
    burbuja.className = `chat-bubble chat-bubble-${autor}`;
    burbuja.innerHTML = texto.replace(/\n/g, '<br>');
    body.appendChild(burbuja);
    body.scrollTop = body.scrollHeight;
  }

  function abrirChat() {
    windowEl.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (!bienvenidaMostrada) {
      añadirBurbuja(orquestadorAgent.bienvenida, 'agente');
      bienvenidaMostrada = true;
    }
    setTimeout(() => input.focus(), 50);
  }

  function cerrarChat() {
    windowEl.hidden = true;
    toggle.setAttribute('aria-expanded', 'false');
  }

  toggle.addEventListener('click', () => {
    windowEl.hidden ? abrirChat() : cerrarChat();
  });

  closeBtn.addEventListener('click', cerrarChat);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = input.value.trim();
    if (!mensaje) return;
    añadirBurbuja(mensaje, 'usuario');
    input.value = '';
    setTimeout(() => {
      const respuesta = orquestadorAgent.responder(mensaje);
      añadirBurbuja(respuesta, 'agente');
    }, 350);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !windowEl.hidden) cerrarChat();
  });
})();
