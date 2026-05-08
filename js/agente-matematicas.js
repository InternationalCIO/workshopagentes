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

  esComando(texto) {
    const limpio = texto.trim().toLowerCase();
    return this.comandos.some(c => limpio === c || limpio.startsWith(c + ' '));
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

  ejecutar(texto) {
    const partes = texto.trim().split(/\s+/);
    const cmd = partes[0].toLowerCase();

    if (cmd === '/ayuda') return this.ayuda();

    const a = this.parsearNumero(partes[1]);
    const b = this.parsearNumero(partes[2]);

    if (a === null || b === null) {
      return `El comando <code>${cmd}</code> necesita dos números. Ejemplo: <code>${cmd} 5 3</code>.`;
    }

    let resultado;
    let simbolo;
    switch (cmd) {
      case '/sumar':       resultado = a + b; simbolo = '+'; break;
      case '/restar':      resultado = a - b; simbolo = '−'; break;
      case '/multiplicar': resultado = a * b; simbolo = '×'; break;
      case '/dividir':
        if (b === 0) return 'No puedo dividir entre cero. Prueba con otro segundo número.';
        resultado = a / b; simbolo = '÷'; break;
      default:
        return null;
    }
    return `${a} ${simbolo} ${b} = <strong>${this.formatearResultado(resultado)}</strong>`;
  }
};
