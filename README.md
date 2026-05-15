# Workshop · IA Agéntica para la Transformación Empresarial — Frontend

Sitio web del workshop del programa **MIT Professional Education — IA Agéntica para la Transformación Empresarial**, construido fase a fase como ejercicio guiado de aprendizaje.

🌐 **URL pública (front):** [internationalcio.github.io/workshopagentes](https://internationalcio.github.io/workshopagentes/)
🔌 **URL pública (back / API):** [agenteworkshop-production.up.railway.app](https://agenteworkshop-production.up.railway.app/)

---

## Arquitectura: dos repositorios

A partir de la **Fase IV**, el workshop se reparte en dos repos GitHub independientes:

| Repo | Despliegue | Contenido |
|---|---|---|
| **`workshopagentes`** *(este)* | **GitHub Pages** | Frontend: HTML, CSS, JS del navegador. Galería, widget de chat, orquestadorAgent, matematicasAgente, página de guía y presentación. |
| **`agenteworkshop`** | **Railway** | Backend: `modeloAgente` (llama a Anthropic Haiku 4.5), `corpusAgente` (proporciona el corpus). La API Key vive aquí, **nunca** en el front. |

> **Por qué separados:** la API Key de Anthropic no puede viajar al navegador (sería visible para cualquiera). El backend la guarda como variable de entorno y el front se limita a hacer `fetch` a sus endpoints.

---

## Qué es

Una galería de los 16 participantes del workshop con un sistema **multiagente** embebido. El sistema **crece por fases**: cada fase añade capacidades nuevas. Las Fases I-III viven completas en el navegador (HTML, CSS, JS vanilla, sin frameworks). La Fase IV añade un backend ligero (Node + Express) para hablar con un modelo de IA real (Claude Haiku 4.5) sin exponer la API Key.

El objetivo del taller no es construir producción — es **entender los principios** y conseguir que cualquier persona (técnica o no) pueda reproducir el sistema completo.

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

### Fase III — Sistema multiagente (matemáticas)
- Nuevo `MatematicasAgente` con cuatro operaciones (`/sumar`, `/restar`, `/multiplicar`, `/dividir`) y `/ayuda`.
- El orquestador **delega** cuando detecta un comando matemático y vuelve al smalltalk para todo lo demás.
- **v3.1** — Detección en **lenguaje natural**: el agente reconoce sinónimos (`suma`, `más`, `por`, `entre`, `multiplica`, `partido`…) y extrae los números del mensaje. Ejemplos: *«quiero sumar 5 y 3»*, *«multiplica 4 por 6»*, *«10 entre 2»*.

### Fase IV — modeloAgente con corpus y Claude Haiku 4.5
- Tercer agente: **`modeloAgente`**, alojado en el **backend** (repo `agenteworkshop`, desplegado en Railway).
- Solo se invoca cuando el orquestador no puede resolver con smalltalk ni con matemáticas.
- Llama a **Claude Haiku 4.5** (Anthropic) con el **corpus del workshop** (CVs anonimizados de los 16 participantes + cómo se construyó la web) como `system` prompt.
- **Cacheo con `cache_control`**: la primera consulta paga "cache write" (~$0.01); las siguientes 5 minutos pagan "cache read" (~$0.001, **10× más barato**).
- **Cálculo de coste por consulta**: cada respuesta muestra tokens consumidos (input/output/cache) y coste en USD.
- Agente ayudante **`corpusAgente`**: única responsabilidad, proporcionar el corpus. Si no encuentra `corpus.md`, lanza un error `CORPUS_MISSING` que `modeloAgente` captura para responder con humor («estoy ocupado, vuelve más tarde»).
- **Seguridad**: la API Key de Anthropic vive solo en el backend como variable de entorno. Nunca llega al navegador.

## Páginas y recursos

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Portada con galería de participantes y widget de chat. |
| `explicacion.html` | Detrás del telón: cómo se construyó la web, fase a fase, en lenguaje no técnico. |
| `carlos-ruiz.html` | **Guía paso a paso para reproducir el workshop entero** (de cero a producción). Pensada para alguien sin conocimientos técnicos previos. |
| `presentacion-consejo-direccion.pptx` | Presentación ejecutiva (10 slides) para vender el patrón agéntico al Consejo de Dirección. Descargable desde el footer. |

## Estructura del proyecto

```
workshop agentes/
├── index.html                              # Portada + galería + widget de chat
├── explicacion.html                        # Detrás del telón, no técnico
├── carlos-ruiz.html                        # Guía completa para reproducirlo todo
├── presentacion-consejo-direccion.pptx     # 10 slides para el Consejo
├── README.md                               # Este archivo
├── TODO.md                                 # Pendientes
├── .gitignore                              # Excluye CORPUS/, PROMPT*.txt, agenteworkshop/, _pptx/, hola.txt
├── css/
│   └── styles.css                          # Estilos globales + chat + badge de fase
├── js/
│   ├── orquestador.js                      # orquestadorAgent: smalltalk, ruteo, llamada al backend
│   └── agente-matematicas.js               # MatematicasAgente: comandos y lenguaje natural
└── images/
    └── participantes/
        └── COMO-ANADIR-FOTOS.txt           # Cómo añadir fotos opcionales
```

> **Nota de privacidad:** los CVs originales (`CORPUS/`), los prompts del workshop (`PROMPT FASE *.txt`), el backend completo (`agenteworkshop/`) y la carpeta de generación de la presentación (`_pptx/`) se quedan fuera del repo (excluidos por `.gitignore`). En el repo público solo aparece información profesional pública.

## Configuración: URL del backend

El front detecta en qué entorno corre y elige automáticamente la URL del backend:

- En **GitHub Pages**: usa `window.AGENTE_WORKSHOP_BACKEND_URL` (configurada en `index.html`, apuntando a Railway).
- En **localhost**: usa `http://localhost:3000` (para pruebas con el backend corriendo local).

Para cambiar la URL del back en producción, edita el `<script>` que define `window.AGENTE_WORKSHOP_BACKEND_URL` cerca del final de `index.html`.

## Cómo ejecutarlo localmente

No necesita servidor:

1. Clona el repositorio.
2. Abre `index.html` haciendo doble clic. Listo.

Cualquier cambio que hagas se ve directamente al refrescar el navegador.

> Para que el chat hable con Claude desde localhost, también tendrías que arrancar el backend (`agenteworkshop/`) en local. Ver su README. En su defecto, el chat sigue funcionando para smalltalk y matemáticas, y muestra un mensaje claro si no encuentra al backend.

## Cómo se despliega

- **Frontend:** GitHub Pages (gratuito). Cada `git push` a la rama `main` actualiza la web en 1-3 minutos.
- **Backend:** Railway. Cada `git push` al repo `agenteworkshop` dispara redespliegue automático (~30 seg).

## Créditos

Workshop facilitado por **Miguel Ángel Sánchez Rodriguez** ([LinkedIn](https://www.linkedin.com/in/miguelangelsanchezrodriguez/)) para MIT Professional Education.

Construido en directo con [Claude Code](https://claude.com/claude-code) como ejercicio del taller.
