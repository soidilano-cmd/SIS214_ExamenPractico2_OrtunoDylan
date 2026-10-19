# CV / Portafolio Profesional - Dylan Ortuño

Landing page interactiva con mi hoja de vida y portafolio. Es el Examen Práctico 2 (Unidad II: Desarrollo de Interfaces Dinámicas con JavaScript) de **Tecnologías Web I (SIS-214)**, Universidad Católica Boliviana "San Pablo", gestión 2026.

## Enlaces

- Repositorio: https://github.com/soidilano-cmd/SIS214_ExamenPractico2_OrtunoDylan
- Producción (GitHub Pages): https://soidilano-cmd.github.io/SIS214_ExamenPractico2_OrtunoDylan/

## Tecnologías utilizadas

- HTML5 semántico con atributos WAI-ARIA
- CSS3 (custom properties, Flexbox, CSS Grid y media queries)
- JavaScript ES6+ (const/let, arrow functions, template literals, async/await)
- Fetch API contra la API pública de GitHub
- localStorage para guardar el tema
- Git y GitHub Pages

## Estructura del proyecto

```
SIS214_ExamenPractico2_OrtunoDylan/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── assets/
│   ├── images/
│   │   └── foto.jpeg
│   └── audio/
│       └── audioPD.mp4
├── .gitignore
└── README.md
```

## Arquitectura de la solución

### HTML (`index.html`)

- Estructura con `header`, `nav`, `main`, `section`, `article`, `aside` y `footer`.
- Se evitó el uso de `div`: las tablas van dentro de `figure`, los campos del formulario en `p` y el audio en `figure` con `figcaption`.
- Accesibilidad: enlace "saltar al contenido", `aria-label`, `aria-labelledby`, `aria-expanded` y `aria-controls` en el menú, `aria-pressed` en el botón de tema, `aria-live` y `role="status"` en los mensajes dinámicos, `aria-invalid` y `aria-describedby` en el formulario y `role="search"` en el buscador.

### CSS (`css/styles.css`)

- Los tokens de diseño (colores, tipografía y espaciado) están en `:root` y el modo oscuro solo los redefine desde la clase `tema-oscuro` del `body`.
- Incluye el reset universal (`box-sizing`, `margin` y `padding`).
- Enfoque mobile-first. Los estilos base son de móvil (< 768px) y se agregan dos media queries:
  - Tablet: desde 768px (hasta 1024px).
  - Escritorio: desde 1025px.
- Flexbox: botones, buscadores, menú de navegación y campos del formulario.
- CSS Grid: el header (con `grid-template-areas`), las secciones con tarjetas, la lista de repositorios y el diseño general de escritorio (columna de contenido + columna del `aside`).

### JavaScript (`js/script.js`)

El código está dividido en funciones, una por funcionalidad, que se inician juntas desde `iniciarPagina()`:

| Funcionalidad | Funciones principales | Detalle |
|---|---|---|
| Tema claro/oscuro | `iniciarTema`, `aplicarTema`, `guardarTema`, `leerTema` | Alterna la clase `tema-oscuro` en el `body`. La preferencia se guarda con `JSON.stringify()` y se recupera con `JSON.parse()` desde `localStorage`. |
| Menú hamburguesa | `iniciarMenu` | El evento `click` alterna la clase `abierto` y cambia `aria-expanded` entre `true` y `false`. |
| Filtro de cursos | `iniciarFiltro`, `filtrarCursos`, `mostrarCursos` | Con el evento `input` se filtra el arreglo de cursos usando `.filter()` y `.map()`. El arreglo original está congelado con `Object.freeze` y nunca se modifica. |
| Formulario de contacto | `iniciarFormulario`, `validarCampo`, `obtenerError` | Intercepta `submit` con `event.preventDefault()`, usa la validación nativa de HTML5 (`validity`) y valida en tiempo real con el evento `input`, mostrando mensajes de error o éxito en cada campo. |
| Fetch a la API de GitHub | `cargarRepositorios`, `obtenerMensajeHttp`, `mostrarEstado` | `async/await` dentro de `try...catch...finally`. Revisa `response.ok`, traduce los códigos 400, 403, 404 y 500 a mensajes y muestra los estados cargando, éxito y error. |

## API utilizada

[API REST de GitHub](https://docs.github.com/es/rest), endpoint `GET https://api.github.com/users/{usuario}/repos`. No necesita autenticación (tiene un límite de peticiones por hora). El usuario que se muestra por defecto se cambia en la constante `USUARIO_GITHUB` al inicio de `js/script.js`; además la página permite consultar otro usuario desde el formulario.

## Cómo ejecutarlo localmente

1. Clonar el repositorio:
   ```
   git clone https://github.com/soidilano-cmd/SIS214_ExamenPractico2_OrtunoDylan.git
   ```
2. Entrar a la carpeta del proyecto.
3. Abrir `index.html` en el navegador (o usar la extensión Live Server de VS Code). No necesita instalar dependencias.
4. Para que cargue la sección de GitHub se necesita conexión a internet.

## Despliegue

Se publica con GitHub Pages desde la rama `main` (Settings > Pages > Deploy from a branch > `main` / `root`).

## Autor

Dylan Carlos Ortuño Coaquira - Ingeniería de Sistemas, UCB "San Pablo", La Paz, Bolivia.
