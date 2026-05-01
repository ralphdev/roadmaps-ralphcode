# NestJS Roadmap - Explicación Técnica

Guía sobre HTML, CSS y JavaScript de la aplicación roadmap interactiva.

---

## HTML (`index.html`)

### Estructura base
- `<!DOCTYPE html>` con `lang="es"` para documentos españoles
- Meta viewport para responsive design
- Importa fuentes Google: **Syne** (sans-serif, títulos) y **JetBrains Mono** (monospace, código/labels)

### Elementos principales

```html
<header>
  <!-- Logo y barra de progreso -->
  <div class="logo">
    <div class="logo-icon">N</div>
    <h1><span>Nest</span>JS Roadmap</h1>
  </div>
  <div class="progress-bar-wrap">
    <span id="pct">0%</span>  <!-- % actualizado por JS -->
    <div class="progress-fill" id="fill"></div>
  </div>
</header>

<main id="roadmap"></main>  <!-- Aquí JS genera las secciones -->

<button class="reset-btn" onclick="resetAll()">↺ Reiniciar</button>
```

Flujo: header sticky en top → main con contenido dinámico → botón flotante de reset.

---

## CSS (`styles.css`)

### Tema de colores (`:root`)
```css
--bg: #0a0a0f;          /* Fondo oscuro principal */
--accent: #e8392a;      /* Rojo NestJS */
--accent2: #ff6b35;     /* Naranja complementario */
--text: #e8e8f0;        /* Texto claro */
--done: #22c55e;        /* Verde para items completados */
```

### Componentes principales

| Componente | Propósito |
|---|---|
| `.header` | Sticky, display flex, divide logo y progreso |
| `.section` | Contenedor de cada fase del roadmap |
| `.item` | Checkbox + label, toggleable, visual feedback en hover |
| `.item.done` | Aplicado al togglear, color verde, text-decoration strikethrough |
| `.progress-fill` | Barra animada (width 0→100% con ease) |
| `.reset-btn` | Botón flotante inferior-derecho |

### Estrategias de diseño
- **Flexbox**: header, items, logo
- **CSS variables**: reutilización de colores/fuentes
- **Transiciones suaves**: `transition: all 0.2s`
- **Responsive**: `@media (max-width: 600px)` ajusta padding y flex-wrap

---

## JavaScript (`script.js`)

### Estructura de datos

```javascript
const roadmap = [
  {
    title: "Bases necesarias...",
    items: [
      { label: "Node.js..." },
      { sub: "Subsección" },  // No es un item clickeable
      { label: "TypeScript..." }
    ]
  },
  // ... 20 secciones más
]
```

Nota: `sub` items son etiquetas visuales, no se marcan como "hecho".

### Persistencia: localStorage

```javascript
const STORAGE_KEY = 'nestjs-roadmap-v1';

function loadState()    // lee JSON de localStorage
function saveState()    // escribe JSON a localStorage
```

State es un objeto plano: `{ "0-Node.js...": true, "1-TypeScript...": false }`

### Funciones principales

| Función | Qué hace |
|---|---|
| `buildRoadmap()` | Genera HTML para todas las secciones e items desde `roadmap[]` |
| `toggle(key, el, si)` | Alterna estado de un item, actualiza UI y localStorage |
| `updateProgress()` | Calcula % de items marcados, anima progress bar |
| `updateSectionCount(si)` | Actualiza "X/Y" completados en header de sección |
| `resetAll()` | Confirma y borra todo state |

### Flujo de ejecución

1. **Load**: `loadState()` trae datos de localStorage (o `{}` si vacío)
2. **Build**: `buildRoadmap()` crea estructura HTML dinamicamente
3. **Click**: usuario clickea item → `toggle()` actualiza state → `saveState()`
4. **Render**: CSS transiciones visuales automáticas (clase `done` existe, CSS la estiliza)

### Detalles técnicos

- **Cálculo total**: `roadmap.reduce()` sobre todas las secciones, excluda items con `sub`
- **DOM queries**: `document.getElementById()`, `.querySelector()` (búsquedas específicas)
- **Event handling**: `el.onclick = () => toggle(...)` para cada item
- **Animación**: CSS maneja transiciones, JS solo actualiza `width` del progress fill

---

## Flujo completo

```
Usuario abre página
  ↓
JS carga state desde localStorage
  ↓
buildRoadmap() genera HTML de secciones + items
  ↓
Usuario clickea item
  ↓
toggle() actualiza state[key], aplica clase .done a DOM
  ↓
updateProgress() recalcula %
  ↓
saveState() persiste a localStorage
  ↓
Próxima vez que abre: misma state restaurada
```

---

## Notas de diseño

- **Sin frameworks**: vanilla JS, sin React/Vue
- **Performance**: data-driven (`roadmap[]` → HTML), local storage es sincrónico pero rápido
- **Accesibilidad**: limited (sin ARIA labels, color-only feedback); mejoras: añadir `role="checkbox"`, labels `for`
- **Escalabilidad**: Agregar secciones = añadir items a `roadmap[]`, sin cambiar JS
