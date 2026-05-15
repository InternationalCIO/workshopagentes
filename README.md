# Workshop · IA Agéntica para la Transformación Empresarial — Frontend

Sitio web del workshop del programa **MIT Professional Education — IA Agéntica para la Transformación Empresarial**, construido fase a fase como ejercicio guiado de aprendizaje.

🌐 **URL pública:** [internationalcio.github.io/workshopagentes](https://internationalcio.github.io/workshopagentes/)

## Arquitectura: dos repositorios

A partir de la **Fase IV**, el workshop se reparte en dos repos GitHub independientes:

| Repo | Despliegue | Contenido |
|---|---|---|
| **`workshopagentes`** *(este)* | GitHub Pages | Frontend: HTML, CSS, JS del navegador. Galería, widget de chat, orquestadorAgent, matematicasAgente. |
| **`agenteworkshop`** | Railway | Backend: `modeloAgente` (llama a Anthropic Haiku 4.5), `corpusAgente` (genera el corpus una vez). La API Key vive aquí, **nunca** en el front. |

> **Por qué separados:** la API Key de Anthropic no puede viajar al navegador (sería visible para cualquiera). El backend la guarda como variable de entorno y el front se limita a hacer `fetch` a sus endpoints.

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

### Fase IV — modeloAgente con corpus y Claude Haiku 4.5
- Tercer agente: `modeloAgente`, alojado en el **backend** (repo `agenteworkshop`, desplegado en Railway).
- Solo se invoca cuando el orquestador no puede resolver con smalltalk ni con matemáticas.
- Llama a **Claude Haiku 4.5** (Anthropic) con el **corpus del workshop** (CVs anonimizados de los 16 participantes + explicación + cómo se construyó la web) como `system` prompt.
- **Cacheo con `cache_control`**: la primera consulta paga "cache write"; las siguientes 5 minutos pagan "cache read" (10× más barato).
- **Cálculo de coste por consulta**: cada respuesta muestra tokens consumidos (input/output/cache) y coste en USD.
- Agente ayudante `corpusAgente`: única responsabilidad, generar el corpus si no existe.
- **Seguridad**: la API Key de Anthropic vive solo en el backend como variable de entorno. Nunca llega al navegador.

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
