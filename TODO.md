# TODO — Workshop Agentes

## ✅ Hecho

### Fases desplegadas
- [x] **Fase I** — galería estática de 16 participantes, GitHub Pages.
- [x] **Fase II** — orquestadorAgent con smalltalk (palabras clave + anti-basura).
- [x] **Fase III** — MatematicasAgente con comandos y lenguaje natural.
- [x] **Fase IV** — modeloAgente con corpus y Claude Haiku 4.5 en Railway.
  - Backend en repo separado `agenteworkshop` (Node + Express + SDK Anthropic).
  - Corpus de 16 participantes + workshop, cacheado con `cache_control` ephemeral.
  - Cálculo de coste por consulta (input/output/cache write/cache read).
  - Respuesta humorística cuando falta el corpus (`corpusAgente` lanza `CORPUS_MISSING`).
  - Front conectado al backend con `window.AGENTE_WORKSHOP_BACKEND_URL`.

### Documentación y materiales
- [x] **README** completo del front con arquitectura de dos repos.
- [x] **README** del backend (`agenteworkshop/README.md`) con endpoints y despliegue.
- [x] **`carlos-ruiz.html`** — guía paso a paso para reproducir el workshop de cero (8 secciones, inventario, conceptos, las 4 fases, seguridad).
- [x] **`presentacion-consejo-direccion.pptx`** — 10 slides ejecutivos para el Consejo de Dirección (descargable desde el footer).

## 📋 Pendientes de contenido

- [ ] **Recolectar fotos de los participantes**
  - Pedir al grupo una foto cuadrada (perfil profesional, idealmente 400×400 px o más).
  - Guardarlas en `images/participantes/` con el nombre normalizado (ver `images/participantes/COMO-ANADIR-FOTOS.txt`).
  - Sustituir en `index.html` el `<div class="avatar">X</div>` por `<div class="avatar"><img src="..."></div>` para los que tengan foto.

- [ ] **Recolectar LinkedIn de los participantes que faltan**
  - Ya añadidos: Agustín Angiolini, Diego Lucero, Fabián Noyola, Roberto Castro, Valeria Tubio.
  - Pendientes: Adrian Robles, Carlos Ruiz, Cecilia de la Paz, Fernando Cormenzana, Ivette Reina, José Tam, Marina Roca, Olga Calvo, Pablo Abinal, Raul Manso, Víctor Tortoriello.
  - Pedir solo a quienes quieran aparecer en LinkedIn — es opcional.

## 🔒 Decisiones pendientes

- [ ] **Securizar la URL** (si se decide). Opciones evaluadas:
  - Cloudflare Pages + Cloudflare Access (login por email, gratis hasta 50 usuarios).
  - GitHub Pages privado (requiere repo privado + cuenta GH para cada participante).
  - Pantalla de contraseña con JS (rápido, baja seguridad).

## 💡 Ideas para fases siguientes

- [ ] **Empaquetar el widget de chat como Web Component** reutilizable, para poder copiarlo a otra web sin tocar HTML/CSS de fondo.
- [ ] **Multi-modelo**: añadir routing por tipo de pregunta (Haiku para chitchat, Sonnet para razonamiento complejo, Opus para tareas críticas).
- [ ] **Memoria persistente**: guardar la conversación en una base de datos para que el agente recuerde entre sesiones.
- [ ] **Tools / function calling**: permitir que el modelo llame a APIs externas durante la conversación.
- [ ] **MCP**: integrar herramientas estándar (calendario, drive, correo) sin escribir integraciones a medida.
- [ ] **Alertas de gasto en Railway**: configurar límite mensual de coste de Anthropic.

## 📚 Criterio

- Trato igual para todos los participantes. Foto y LinkedIn son opcionales y se añaden a quienes los envíen.
- La inicial del nombre funciona como avatar de fallback — la página se ve coherente sin fotos.
- Privacidad por defecto: CVs originales nunca al repo, API Keys nunca al front.
