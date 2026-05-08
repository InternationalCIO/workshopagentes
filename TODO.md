# TODO — Workshop Agentes

## Pendientes de contenido

- [ ] **Recolectar fotos de los participantes**
  - Pedir al grupo una foto cuadrada (perfil profesional, idealmente 400×400 px o más).
  - Guardarlas en `images/participantes/` con el nombre normalizado (ver `images/participantes/COMO-ANADIR-FOTOS.txt`).
  - Sustituir en `index.html` el `<div class="avatar">X</div>` por `<div class="avatar"><img src="..."></div>` para los que tengan foto.

- [ ] **Recolectar LinkedIn de los participantes que faltan**
  - Ya añadidos: Agustín Angiolini, Diego Lucero, Fabián Noyola, Roberto Castro, Valeria Tubio.
  - Pendientes: Adrian Robles, Carlos Ruiz, Cecilia de la Paz, Fernando Cormenzana, Ivette Reina, José Tam, Marina Roca, Olga Calvo, Pablo Abinal, Raul Manso, Víctor Tortoriello.
  - Pedir solo a quienes quieran aparecer en LinkedIn — es opcional.

## Pendientes técnicos

- [ ] **Fase IV** — pendiente de empezar (ver `PROMPT FASE IV orquestador matematico y modelo y corpus.txt`).
- [ ] **Securizar la URL** (si se decide). Opciones evaluadas en sesión:
  - Cloudflare Pages + Cloudflare Access (login por email, gratis hasta 50 usuarios).
  - GitHub Pages privado (requiere repo privado + cuenta GH para cada participante).
  - Pantalla de contraseña con JS (rápido, baja seguridad).

## Mejoras visuales pendientes (idea suelta)

- [ ] Empaquetar el widget de chat como componente reutilizable (Web Component) para poder copiarlo a otra web sin tocar HTML/CSS de fondo.

## Criterio

- Trato igual para todos los participantes. Foto y LinkedIn son opcionales y se añaden a quienes los envíen.
- La inicial del nombre funciona como avatar de fallback — la página se ve coherente sin fotos.
