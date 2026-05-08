/* =============================================================
   MatematicasAgente — Fase III
   -------------------------------------------------------------
   Agente especializado en cuatro operaciones aritméticas más un
   comando de ayuda. Lo invoca el orquestador cuando detecta que
   el mensaje del usuario empieza por uno de los comandos.
   ============================================================= */

const matematicasAgente = {
  nombre: 'MatematicasAgente',

  comandos: ['/sumar', '/restar', '/multiplicar', '/dividir', '/ayuda'],

  // Sinónimos en lenguaje natural (todos en minúsculas, sin tildes).
  sinonimos: {
    sumar:       ['sumar', 'suma', 'sumame', 'sumalo', 'sumales', 'mas', '+'],
    restar:      ['restar', 'resta', 'restame', 'menos', 'quitar', 'quitale', '-'],
    multiplicar: ['multiplicar', 'multiplica', 'multiplicame', 'por', 'veces', '*', 'x'],
    dividir:     ['dividir', 'divide', 'dividame', 'entre', 'partido', '/', '÷', 'div']
  },

  esComando(texto) {
    const limpio = texto.trim().toLowerCase();
    return this.comandos.some(c => limpio === c || limpio.startsWith(c + ' '));
  },

  normalizar(texto) {
    return texto
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  },

  // Devuelve la operación si encuentra al menos un sinónimo y dos números,
  // o null si no parece una petición matemática.
  detectarIntencionNatural(texto) {
    const limpio = this.normalizar(texto);
    const numeros = limpio.match(/-?\d+(?:[.,]\d+)?/g);
    if (!numeros || numeros.length < 2) return null;

    let operacionDetectada = null;
    for (const [op, claves] of Object.entries(this.sinonimos)) {
      for (const clave of claves) {
        // Para palabras alfabéticas exigimos límite de palabra; para símbolos no.
        const esSimbolo = /^[^a-z0-9]+$/i.test(clave);
        const patron = esSimbolo
          ? clave.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
          : `(^|\\s)${clave}(\\s|$)`;
        const regex = new RegExp(patron);
        if (regex.test(limpio)) { operacionDetectada = op; break; }
      }
      if (operacionDetectada) break;
    }
    if (!operacionDetectada) return null;

    return {
      operacion: operacionDetectada,
      a: this.parsearNumero(numeros[0]),
      b: this.parsearNumero(numeros[1])
    };
  },

  esPeticionNatural(texto) {
    return this.detectarIntencionNatural(texto) !== null;
  },

  ayuda() {
    return 'Estos son los comandos que entiendo:\n' +
           '• <strong>/sumar</strong> A B — suma dos números\n' +
           '• <strong>/restar</strong> A B — resta el segundo del primero\n' +
           '• <strong>/multiplicar</strong> A B — multiplica dos números\n' +
           '• <strong>/dividir</strong> A B — divide el primero entre el segundo\n' +
           '• <strong>/ayuda</strong> — muestra esta ayuda\n\n' +
           'Ejemplo: <code>/sumar 5 3</code> → 8';
  },

  parsearNumero(s) {
    if (s === undefined || s === null || s === '') return null;
    const n = parseFloat(String(s).replace(',', '.'));
    return Number.isFinite(n) ? n : null;
  },

  formatearResultado(n) {
    return Number.isInteger(n) ? String(n) : String(parseFloat(n.toFixed(6)));
  },

  // Hace la cuenta una vez tenemos operación + dos números.
  calcular(operacion, a, b) {
    if (a === null || b === null) return null;
    let resultado;
    let simbolo;
    switch (operacion) {
      case 'sumar':       resultado = a + b; simbolo = '+'; break;
      case 'restar':      resultado = a - b; simbolo = '−'; break;
      case 'multiplicar': resultado = a * b; simbolo = '×'; break;
      case 'dividir':
        if (b === 0) return 'No puedo dividir entre cero. Prueba con otro segundo número.';
        resultado = a / b; simbolo = '÷'; break;
      default:
        return null;
    }
    return `${a} ${simbolo} ${b} = <strong>${this.formatearResultado(resultado)}</strong>`;
  },

  // Caso A: invocación por comando /xxx A B
  ejecutar(texto) {
    const partes = texto.trim().split(/\s+/);
    const cmd = partes[0].toLowerCase();

    if (cmd === '/ayuda') return this.ayuda();

    const operacion = cmd.replace(/^\//, ''); // /sumar -> sumar
    const a = this.parsearNumero(partes[1]);
    const b = this.parsearNumero(partes[2]);

    if (a === null || b === null) {
      return `El comando <code>${cmd}</code> necesita dos números. Ejemplo: <code>${cmd} 5 3</code>.`;
    }
    return this.calcular(operacion, a, b);
  },

  // Caso B: invocación en lenguaje natural ("quiero sumar 5 y 3", "5 por 6")
  ejecutarNatural(texto) {
    const intencion = this.detectarIntencionNatural(texto);
    if (!intencion) return null;
    if (intencion.a === null || intencion.b === null) {
      return `Entiendo que quieres ${intencion.operacion}, pero no he sabido leer los dos números. Prueba con algo como «${intencion.operacion} 5 y 3».`;
    }
    return this.calcular(intencion.operacion, intencion.a, intencion.b);
  }
};
