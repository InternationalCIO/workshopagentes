# Workshop · IA Agéntica para la Transformación Empresarial

Sitio web del workshop del programa **MIT Professional Education — IA Agéntica para la Transformación Empresarial**, construido fase a fase como ejercicio guiado de aprendizaje.

🌐 **URL pública:** [internationalcio.github.io/workshopagentes](https://internationalcio.github.io/workshopagentes/)

---

## Qué es

Una galería de los 16 participantes del workshop con un agente conversacional embebido en el navegador. El sistema **crece por fases**: cada fase añade capacidades nuevas, siempre con HTML, CSS y JavaScript vanilla — sin frameworks ni servidores. Es deliberadamente sencillo: el objetivo del taller es **entender los principios**, no construir producción.

## Fases desplegadas

### Fase I — Web estática (galería de participantes)
- `index.html` con 16 fichas profesionales (avatar de inicial, perfil corto, LinkedIn opcional).
- `explicacion.html`: cómo se construyó la web, en lenguaje no técnico.
- Estilo MIT (rojo `#A31F34`, tipografía Segoe UI, responsive).
- Privacidad: solo perfil profesional, sin emails ni teléfonos.

### Fase II — orquestadorAgent (smalltalk)
- Widget flotante de chat (botón rojo abajo a la derecha).
- Detección de intenciones por **palabras clave normalizadas**: saludo, despedida, agradecimiento, bienestar, basura.
- Heurística para detectar mensajes sin sentido (sin vocales, letras repetidas, etc.).
- Mensaje de bienvenida que presenta nombre, objetivo e idioma.

### Fase III — Sistema multiagente
- Nuevo `MatematicasAgente` con cuatro operaciones (`/sumar`, `/restar`, `/multiplicar`, `/dividir`) y `/ayuda`.
- El orquestador **delega** cuando detecta un comando matemático y vuelve al smalltalk para todo lo demás.
- **v3.1** — Detección en **lenguaje natural**: el agente reconoce sinónimos (`suma`, `más`, `por`, `entre`, `multiplica`, `partido`…) y extrae los números del mensaje. Ejemplos: *«quiero sumar 5 y 3»*, *«multiplica 4 por 6»*, *«10 entre 2»*.

## Estructura del proyecto

```
workshop agentes/
├── index.html              # Portada: hero, badge de versión, galería, widget de chat
├── explicacion.html        # Detrás del telón, en lenguaje no técnico
├── README.md               # Este archivo
├── TODO.md                 # Pendientes (fotos, LinkedIn de participantes…)
├── .gitignore              # Excluye CORPUS/, PROMPT*.txt y otros archivos privados
├── css/
│   └── styles.css          # Estilos globales + chat + badge de fase
├── js/
│   ├── orquestador.js      # orquestadorAgent (smalltalk + ruteo) y widget de chat
│   └── agente-matematicas.js  # MatematicasAgente (comandos + lenguaje natural)
└── images/
    └── participantes/
        └── COMO-ANADIR-FOTOS.txt   # Cómo añadir fotos opcionales
```

> **Nota de privacidad:** los CVs originales (`CORPUS/`) y los prompts del workshop (`PROMPT FASE *.txt`) se quedan fuera del repo (excluidos por `.gitignore`). En el repo público solo aparece información profesional pública.

## Cómo ejecutarlo localmente

No necesita servidor:

1. Clona el repositorio.
2. Abre `index.html` haciendo doble clic. Listo.

Cualquier cambio que hagas se ve directamente al refrescar el navegador.

## Cómo se despliega

- Hosting: **GitHub Pages** (gratuito).
- Cada `git push` a la rama `main` actualiza la web en uno o dos minutos.

## Créditos

Workshop facilitado por **Miguel Ángel Sánchez Rodriguez** para MIT Professional Education.
Construido en directo con [Claude Code](https://claude.com/claude-code) como ejercicio del taller.
