/* =============================================================
   orquestadorAgent — Fase II → IV
   -------------------------------------------------------------
   Agente que vive en el navegador. Decide quién responde:
     1. matematicasAgente (comando o lenguaje natural).
     2. Smalltalk propio (saludo, despedida, gracias, bienestar).
     3. modeloAgente en el backend (Anthropic Haiku 4.5 con corpus).
   No usa IA por su cuenta — solo enruta y orquesta.
   ============================================================= */

// URL del backend (Fase IV). En local: http://localhost:3000.
// En producción se inyecta desde index.html con window.AGENTE_WORKSHOP_BACKEND_URL.
const BACKEND_URL = (typeof window !== 'undefined' && window.AGENTE_WORKSHOP_BACKEND_URL)
  ? window.AGENTE_WORKSHOP_BACKEND_URL
  : (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:3000'
      : '');

const orquestadorAgent = {
  nombre: 'orquestadorAgent',

  bienvenida:
    '👋 ¡Hola! Soy <strong>orquestadorAgent</strong>, el agente de este workshop.\n\n' +
    'Sé conversar contigo (saludos, despedidas, agradecimientos, ¿cómo estás?), ' +
    'delego en <strong>MatematicasAgente</strong> si necesitas cuentas, y desde la ' +
    '<strong>Fase IV</strong> delego en <strong>modeloAgente</strong> (Claude Haiku 4.5) ' +
    'cuando me preguntas algo sobre el workshop o los participantes.\n\n' +
    'Puedes preguntarme cosas como:\n' +
    '• <em>«¿Quién es Cecilia de la Paz?»</em>\n' +
    '• <em>«¿Qué participantes vienen de Argentina?»</em>\n' +
    '• <code>/sumar 5 3</code> · <em>«multiplica 4 por 6»</em>\n\n' +
    'Hablo <strong>únicamente en español</strong>. ¿En qué te ayudo?',

  normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  },

  patrones: {
    saludo: [
      'hola', 'buenas', 'buenos dias', 'buen dia', 'buenas tardes',
      'buenas noches', 'saludos', 'hey', 'ola'
    ],
    despedida: [
      'adios', 'hasta luego', 'hasta pronto', 'hasta la proxima',
      'nos vemos', 'chao', 'chau', 'me voy', 'me despido', 'bye'
    ],
    gracias: [
      'gracias', 'muchas gracias', 'mil gracias', 'te agradezco',
      'agradecido', 'agradecida'
    ],
    bienestar: [
      'como estas', 'como te va', 'que tal tu dia', 'como va',
      'todo bien', 'como te encuentras', 'que tal estas', 'como andas'
    ]
  },

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
    ]
  },

  async manejar(texto) {
    // 1. Comando matemático (/sumar 5 3, /ayuda, ...)
    if (typeof matematicasAgente !== 'undefined' && matematicasAgente.esComando(texto)) {
      return { texto: matematicasAgente.ejecutar(texto), fuente: 'matematicas' };
    }
    // 2. Matemáticas en lenguaje natural
    if (typeof matematicasAgente !== 'undefined' && matematicasAgente.esPeticionNatural(texto)) {
      return { texto: matematicasAgente.ejecutarNatural(texto), fuente: 'matematicas' };
    }
    // 3. Smalltalk propio
    const intencion = this.detectarIntencion(texto);
    if (intencion !== 'desconocido') {
      const opciones = this.respuestas[intencion];
      return {
        texto: opciones[Math.floor(Math.random() * opciones.length)],
        fuente: 'smalltalk'
      };
    }
    // 4. Delegar en modeloAgente (backend) — Fase IV
    return await this.delegarEnModelo(texto);
  },

  async delegarEnModelo(texto) {
    if (!BACKEND_URL) {
      return {
        texto: 'El backend no está configurado todavía. Cuando se despliegue en Railway, podré contestar preguntas sobre el workshop y los participantes.',
        fuente: 'error'
      };
    }
    try {
      const r = await fetch(BACKEND_URL + '/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensaje: texto })
      });
      if (!r.ok) {
        const err = await r.json().catch(() => ({ error: r.statusText }));
        throw new Error(err.detalle || err.error || 'Error del servidor');
      }
      const data = await r.json();
      return {
        texto: data.texto,
        coste: data.coste,
        modelo: data.modelo,
        latenciaMs: data.latenciaMs,
        fuente: 'modelo'
      };
    } catch (e) {
      return {
        texto: 'No he podido conectar con modeloAgente (' + e.message + '). Si estás viendo esto en directo, comprueba que el backend esté desplegado en Railway.',
        fuente: 'error'
      };
    }
  }
};

/* =============================================================
   Widget de chat
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

  function añadirBurbuja(html, autor, opciones = {}) {
    const burbuja = document.createElement('div');
    burbuja.className = `chat-bubble chat-bubble-${autor}`;
    if (opciones.id) burbuja.id = opciones.id;
    burbuja.innerHTML = html.replace(/\n/g, '<br>');
    body.appendChild(burbuja);
    body.scrollTop = body.scrollHeight;
    return burbuja;
  }

  function añadirIndicadorTyping() {
    const burbuja = document.createElement('div');
    burbuja.className = 'chat-bubble chat-bubble-agente chat-bubble-typing';
    burbuja.id = 'chatTyping';
    burbuja.innerHTML = '<span></span><span></span><span></span>';
    body.appendChild(burbuja);
    body.scrollTop = body.scrollHeight;
  }

  function quitarIndicadorTyping() {
    const t = document.getElementById('chatTyping');
    if (t) t.remove();
  }

  function formatearCoste(coste) {
    if (!coste || !coste.usd) return '';
    const total = coste.usd.total;
    const fmt = (n) => '$' + n.toFixed(6).replace(/0+$/, '0');
    const tk = coste.tokens;
    let cacheInfo = '';
    if (tk.cacheRead > 0)  cacheInfo = ` · ${tk.cacheRead} cache hit`;
    if (tk.cacheWrite > 0) cacheInfo = ` · ${tk.cacheWrite} cache write`;
    return `<div class="chat-coste">Coste: ${fmt(total)} USD · ${tk.input} in / ${tk.output} out${cacheInfo}</div>`;
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

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const mensaje = input.value.trim();
    if (!mensaje) return;
    añadirBurbuja(mensaje, 'usuario');
    input.value = '';
    input.disabled = true;
    añadirIndicadorTyping();
    try {
      const resp = await orquestadorAgent.manejar(mensaje);
      quitarIndicadorTyping();
      let html = resp.texto;
      if (resp.fuente === 'modelo' && resp.coste) {
        html += formatearCoste(resp.coste);
      }
      añadirBurbuja(html, 'agente');
    } catch (err) {
      quitarIndicadorTyping();
      añadirBurbuja('Algo ha fallado: ' + err.message, 'agente');
    } finally {
      input.disabled = false;
      input.focus();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !windowEl.hidden) cerrarChat();
  });
})();
