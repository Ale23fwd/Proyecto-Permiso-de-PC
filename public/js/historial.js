
import { getSolicitudesByUser, deleteSolicitud } from "./services/solicitudesService.js";
import { getSesion } from "./nav.js";

// Referencias del DOM

const $buscar = document.getElementById("buscar");
const $lista  = document.getElementById("lista");
const $stats  = document.getElementById("stats");
const $msg    = document.getElementById("historialMsg");

// Variables de estado

const sesion = getSesion();
let TODAS = [];

// Cargar historial del usuario actual

async function cargar() {
  $msg.textContent = "";
  $lista.innerHTML = "Cargando...";

  try {
    const userId = sesion ? sesion.userId : "";
    const datos = await getSolicitudesByUser(userId);
    TODAS = datos;
    render(TODAS);
    renderStats(TODAS);
  } catch (error) {
    console.error(error);
    $msg.textContent = "No se pudo cargar el historial.";
    $lista.innerHTML = "";
  }
}

// Dibujar lista (usa map para la rúbrica)

function render(arr) {
  if (!arr || arr.length === 0) {
    $lista.innerHTML = "<p>No tenés solicitudes.</p>";
    return;
  }

  const html = arr.map(function (s) {
    const id = s.id || "";
    const salida = s.fechaSalida || "-";
    const regreso = s.fechaRegreso || "-";
    const codigo = s.codigo || "-";
    const estado = s.estado || "pendiente";

    return (
      '<div class="item">' +
        "<strong>#" + id + "</strong> — " + salida + " → " + regreso + " | " +
        "<b>" + codigo + "</b> | Estado: <em>" + estado + "</em>" +
        '<div>' +
          '<button class="btn-del" data-id="' + id + '">Eliminar</button>' +
        "</div>" +
      "</div>"
    );
  }).join("");

  $lista.innerHTML = html;

  const botonesEliminar = $lista.querySelectorAll(".btn-del");
  for (let i = 0; i < botonesEliminar.length; i++) {
    botonesEliminar[i].addEventListener("click", onClickEliminar);
  }
}

// Evento: eliminar una solicitud

async function onClickEliminar(e) {
  const btn = e.currentTarget;
  const id = btn.getAttribute("data-id");

  const ok = confirm("¿Eliminar solicitud #" + id + "?");
  if (!ok) return;

  try {
    await deleteSolicitud(id);
    $msg.textContent = "Solicitud eliminada.";
    await cargar();
  } catch (error) {
    console.error(error);
    $msg.textContent = "Error al eliminar.";
  }
}

// Estadísticas por estado (usa reduce)

function renderStats(arr) {
  const resumen = arr.reduce(function (acum, s) {
    const est = s.estado || "pendiente";
    if (!acum[est]) {
      acum[est] = 0;
    }
    acum[est] = acum[est] + 1;
    return acum;
  }, {});
  $stats.textContent = "Resumen por estado: " + JSON.stringify(resumen);
}

// Búsqueda en vivo (usa filter)

$buscar.addEventListener("input", function () {
  const q = $buscar.value.toLowerCase();

  const filtradas = TODAS.filter(function (s) {
    const codigo = (s.codigo || "").toLowerCase();
    const estado = (s.estado || "").toLowerCase();
    const f1 = (s.fechaSalida || "").toLowerCase();
    const f2 = (s.fechaRegreso || "").toLowerCase();

    return (
      codigo.indexOf(q) !== -1 ||
      estado.indexOf(q) !== -1 ||
      f1.indexOf(q) !== -1 ||
      f2.indexOf(q) !== -1
    );
  });

  render(filtradas);
  renderStats(filtradas);
});

// Inicio
cargar();
