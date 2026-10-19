/* ==========================================================
   script.js - CV / Portafolio de Dylan Ortuño
   Cada funcionalidad está en su propia función y todas se
   inician al final desde iniciarPagina().
   ========================================================== */

/* ---------- Datos y constantes ---------- */

// Usuario de GitHub que se muestra por defecto
const USUARIO_GITHUB = "soidilano-cmd";
const URL_API_GITHUB = "https://api.github.com/users";
const CLAVE_TEMA = "preferenciaTema";

// Datos originales de los cursos. Se congelan para no modificarlos nunca,
// el filtro siempre crea arrays nuevos.
const cursos = Object.freeze([
    { titulo: "Derechos Humanos para Servidoras y Servidores Públicos" },
    { titulo: "Roles y Funciones de la Defensoría del Pueblo" },
    { titulo: "Trabajo Infantil y Adolescente: Prevención y Protección de Derechos" },
    { titulo: "Elaboración de Podcasts: Taller en colaboración con ECID" },
    {
        titulo: "El acceso a la información como herramienta esencial del activismo",
        fecha: "2026-08-28",
        fechaTexto: "28 de agosto de 2026"
    },
    {
        titulo: "Empoderamiento de grupos prioritarios para la Defensa de las Libertades Fundamentales",
        fecha: "2026-08-27",
        fechaTexto: "27 de agosto de 2026"
    }
]);

// Mensajes de error del formulario según la regla de validación que falla
const mensajesFormulario = {
    nombre: {
        valueMissing: "Ingresa tu nombre.",
        tooShort: "El nombre debe tener al menos 3 caracteres."
    },
    correo: {
        valueMissing: "Ingresa tu correo electrónico.",
        typeMismatch: "El correo electrónico no es válido."
    },
    telefono: {
        patternMismatch: "El teléfono debe tener 7 u 8 dígitos."
    },
    mensaje: {
        valueMissing: "Escribe un mensaje.",
        tooShort: "El mensaje debe tener al menos 10 caracteres."
    },
    aceptacion: {
        valueMissing: "Debes aceptar el uso de tus datos."
    }
};

/* ==========================================================
   1. Conmutador de tema (claro / oscuro) con localStorage
   ========================================================== */

function guardarTema(tema) {
    const preferencia = { tema: tema };
    try {
        localStorage.setItem(CLAVE_TEMA, JSON.stringify(preferencia));
    } catch (error) {
        console.warn("No se pudo guardar el tema:", error);
    }
}

function leerTema() {
    try {
        const guardado = localStorage.getItem(CLAVE_TEMA);
        if (guardado === null) {
            return "claro";
        }
        const preferencia = JSON.parse(guardado);
        return preferencia.tema === "oscuro" ? "oscuro" : "claro";
    } catch (error) {
        // si el valor guardado está dañado se usa el tema claro
        return "claro";
    }
}

function aplicarTema(tema) {
    const btnTema = document.getElementById("btn-tema");
    const esOscuro = tema === "oscuro";

    document.body.classList.toggle("tema-oscuro", esOscuro);
    btnTema.textContent = esOscuro ? "Modo claro" : "Modo oscuro";
    btnTema.setAttribute("aria-pressed", esOscuro);
}

function iniciarTema() {
    const btnTema = document.getElementById("btn-tema");

    // se restaura lo que quedó guardado en la visita anterior
    aplicarTema(leerTema());

    btnTema.addEventListener("click", () => {
        const nuevoTema = document.body.classList.contains("tema-oscuro") ? "claro" : "oscuro";
        aplicarTema(nuevoTema);
        guardarTema(nuevoTema);
    });
}

/* ==========================================================
   2. Menú hamburguesa responsivo
   ========================================================== */

function iniciarMenu() {
    const btnMenu = document.getElementById("btn-menu");
    const listaNav = document.getElementById("lista-nav");
    const enlaces = listaNav.querySelectorAll("a");

    btnMenu.addEventListener("click", () => {
        const abierto = listaNav.classList.toggle("abierto");
        btnMenu.setAttribute("aria-expanded", abierto);
    });

    // al elegir una sección el menú se vuelve a cerrar
    enlaces.forEach((enlace) => {
        enlace.addEventListener("click", () => {
            listaNav.classList.remove("abierto");
            btnMenu.setAttribute("aria-expanded", false);
        });
    });
}

/* ==========================================================
   3. Filtro en tiempo real de cursos
   ========================================================== */

// Convierte un curso en el HTML de su <li>
function crearItemCurso(curso) {
    const fecha = curso.fecha
        ? ` (<time datetime="${curso.fecha}">${curso.fechaTexto}</time>)`
        : "";
    return `<li>${curso.titulo}${fecha}</li>`;
}

// Devuelve un array nuevo con el HTML de los cursos que coinciden.
// El array "cursos" no se modifica.
function filtrarCursos(texto) {
    const busqueda = texto.trim().toLowerCase();

    return cursos
        .filter((curso) => curso.titulo.toLowerCase().includes(busqueda))
        .map((curso) => crearItemCurso(curso));
}

function mostrarCursos(texto) {
    const lista = document.getElementById("lista-cursos");
    const resultado = document.getElementById("resultado-filtro");
    const itemsHtml = filtrarCursos(texto);

    lista.innerHTML = itemsHtml.join("");

    if (itemsHtml.length === 0) {
        resultado.textContent = "No se encontraron cursos con ese término.";
    } else {
        resultado.textContent = `Mostrando ${itemsHtml.length} de ${cursos.length} cursos.`;
    }
}

function iniciarFiltro() {
    const formBusqueda = document.getElementById("form-busqueda");
    const buscador = document.getElementById("buscador");

    // se muestran todos los cursos al cargar la página
    mostrarCursos("");

    buscador.addEventListener("input", () => {
        mostrarCursos(buscador.value);
    });

    // con Enter el formulario no debe recargar la página
    formBusqueda.addEventListener("submit", (evento) => {
        evento.preventDefault();
    });
}

/* ==========================================================
   4. Formulario de contacto con validación
   ========================================================== */

// Devuelve el texto del error de un campo, o "" si el campo es válido
function obtenerError(campo) {
    const mensajes = mensajesFormulario[campo.id];
    const validez = campo.validity;
    const soloEspacios = campo.type !== "checkbox" && campo.value.trim() === "";

    if (validez.valueMissing || (campo.required && soloEspacios)) {
        return mensajes.valueMissing;
    }
    if (validez.typeMismatch) {
        return mensajes.typeMismatch;
    }
    if (validez.tooShort) {
        return mensajes.tooShort;
    }
    if (validez.patternMismatch) {
        return mensajes.patternMismatch;
    }
    return "";
}

function limpiarCampo(campo) {
    const aviso = document.getElementById(`aviso-${campo.id}`);

    aviso.textContent = "";
    aviso.className = "aviso";
    campo.classList.remove("campo-valido", "campo-invalido");
    campo.removeAttribute("aria-invalid");
}

// Valida un campo y muestra el mensaje de error o de éxito. Devuelve true/false.
function validarCampo(campo) {
    const aviso = document.getElementById(`aviso-${campo.id}`);
    const mensajeError = obtenerError(campo);

    limpiarCampo(campo);

    if (mensajeError !== "") {
        aviso.textContent = mensajeError;
        aviso.classList.add("aviso-error");
        campo.classList.add("campo-invalido");
        campo.setAttribute("aria-invalid", "true");
        return false;
    }

    // el teléfono es opcional: si está vacío no se muestra nada
    if (campo.type === "tel" && campo.value.trim() === "") {
        return true;
    }

    aviso.textContent = "✔ Correcto";
    aviso.classList.add("aviso-exito");
    campo.classList.add("campo-valido");
    return true;
}

function iniciarFormulario() {
    const formulario = document.getElementById("form-contacto");
    const confirmacion = document.getElementById("confirmacion");
    const campos = formulario.querySelectorAll("input, textarea");

    // validación en tiempo real mientras el usuario escribe
    campos.forEach((campo) => {
        campo.addEventListener("input", () => {
            confirmacion.textContent = "";
            validarCampo(campo);
        });
    });

    formulario.addEventListener("submit", (evento) => {
        evento.preventDefault();
        confirmacion.textContent = "";

        let formularioValido = true;
        campos.forEach((campo) => {
            if (!validarCampo(campo)) {
                formularioValido = false;
            }
        });

        if (formularioValido) {
            formulario.reset();
            confirmacion.textContent = "Mensaje enviado correctamente. Gracias por escribir.";
        } else {
            // el foco va al primer campo con error
            formulario.querySelector(".campo-invalido").focus();
        }
    });

    formulario.addEventListener("reset", () => {
        campos.forEach((campo) => limpiarCampo(campo));
        confirmacion.textContent = "";
    });
}

/* ==========================================================
   5. Módulo asíncrono: API REST de GitHub (Fetch)
   ========================================================== */

// Estados de la petición: cargando, exito, error
function mostrarEstado(tipo, texto) {
    const estado = document.getElementById("estado-github");
    estado.className = `estado estado-${tipo}`;
    estado.textContent = texto;
}

// Texto para el usuario según el código HTTP de la respuesta
function obtenerMensajeHttp(codigo) {
    switch (codigo) {
        case 400:
            return "Solicitud incorrecta (400). Revisa el nombre de usuario.";
        case 403:
            return "Acceso denegado (403). Probablemente se superó el límite de peticiones de la API, intenta más tarde.";
        case 404:
            return "No se encontró ese usuario de GitHub (404).";
        case 500:
            return "Error interno del servidor de GitHub (500). Intenta más tarde.";
        default:
            return `La API respondió con el código ${codigo}.`;
    }
}

// Crea un <li> para un repositorio usando textContent (los datos vienen de afuera)
function crearTarjetaRepo(repo) {
    const item = document.createElement("li");

    const titulo = document.createElement("h3");
    const enlace = document.createElement("a");
    enlace.href = repo.html_url;
    enlace.textContent = repo.name;
    enlace.target = "_blank";
    enlace.rel = "noopener noreferrer";
    titulo.appendChild(enlace);

    const descripcion = document.createElement("p");
    descripcion.textContent = repo.description || "Sin descripción.";

    const datos = document.createElement("p");
    datos.className = "datos-repo";
    datos.textContent = `${repo.language || "Lenguaje no indicado"} · ★ ${repo.stargazers_count}`;

    item.append(titulo, descripcion, datos);
    return item;
}

function mostrarRepositorios(repos) {
    const lista = document.getElementById("lista-repos");

    lista.innerHTML = "";
    repos.forEach((repo) => {
        lista.appendChild(crearTarjetaRepo(repo));
    });
}

async function cargarRepositorios(usuario) {
    const lista = document.getElementById("lista-repos");
    const boton = document.getElementById("btn-github");

    if (usuario.trim() === "") {
        mostrarEstado("error", "Escribe un nombre de usuario de GitHub.");
        return;
    }

    // estado: cargando
    mostrarEstado("cargando", `Cargando repositorios de ${usuario}...`);
    lista.innerHTML = "";
    lista.setAttribute("aria-busy", "true");
    boton.disabled = true;

    try {
        const url = `${URL_API_GITHUB}/${encodeURIComponent(usuario.trim())}/repos?sort=updated&per_page=6`;
        const respuesta = await fetch(url);

        if (!respuesta.ok) {
            throw new Error(obtenerMensajeHttp(respuesta.status));
        }

        const repos = await respuesta.json();

        // estado: éxito (código 200)
        if (repos.length === 0) {
            mostrarEstado("exito", `${usuario} no tiene repositorios públicos (200 OK).`);
        } else {
            mostrarRepositorios(repos);
            mostrarEstado("exito", `Se cargaron ${repos.length} repositorios de ${usuario} (200 OK).`);
        }
    } catch (error) {
        // estado: error
        if (error.name === "TypeError") {
            // fetch falla con TypeError cuando no hay conexión
            mostrarEstado("error", "No se pudo conectar con la API de GitHub. Revisa tu conexión a internet.");
        } else {
            mostrarEstado("error", error.message);
        }
    } finally {
        lista.setAttribute("aria-busy", "false");
        boton.disabled = false;
    }
}

function iniciarGithub() {
    const formGithub = document.getElementById("form-github");
    const inputUsuario = document.getElementById("usuario-github");

    inputUsuario.value = USUARIO_GITHUB;

    formGithub.addEventListener("submit", (evento) => {
        evento.preventDefault();
        cargarRepositorios(inputUsuario.value);
    });

    cargarRepositorios(USUARIO_GITHUB);
}

/* ---------- Inicio de la página ---------- */

function iniciarPagina() {
    iniciarTema();
    iniciarMenu();
    iniciarFiltro();
    iniciarFormulario();
    iniciarGithub();
}

document.addEventListener("DOMContentLoaded", iniciarPagina);
