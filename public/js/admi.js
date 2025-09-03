
import { getSolicitudes, putSolicitudEstado, deleteSolicitud } from "./services/solicitudesService.js";

const $tbody  = document.getElementById("tabla-rows");
const $filtro = document.getElementById("filtro-estado");
const $msg    = document.getElementById("adminMsg");

// Cargar la tabla

async function cargarTabla() {
  try {
    $msg.textContent = "";

    const estado = $filtro ? $filtro.value : "";
    const query = estado ? ("estado=" + encodeURIComponent(estado)) : "";

    const lista = await getSolicitudes(query);

    $tbody.innerHTML = "";

    for (let i = 0; i < lista.length; i++) {
      const s = lista[i];

      const id = s.id || "";
      const user = s.userId || "-";
      const sede = s.sede || "-";
      const salida = s.fechaSalida || "-";
      const regreso = s.fechaRegreso || "-";
      const codigo = s.codigo || "-";
      const estadoFila = s.estado || "pendiente";

      const tr = document.createElement("tr");
      tr.innerHTML =
        "<td>" + id + "</td>" +
        "<td>" + user + "</td>" +
        "<td>" + sede + "</td>" +
        "<td>" + salida + "</td>" +
        "<td>" + regreso + "</td>" +
        "<td>" + codigo + "</td>" +
        "<td>" + estadoFila + "</td>" +
        '<td>' +
          '<button class="btn-aprobar" data-id="' + id + '">Aprobar</button> ' +
          '<button class="btn-rechazar" data-id="' + id + '">Rechazar</button> ' +
          '<button class="btn-eliminar" data-id="' + id + '">Eliminar</button>' +
        "</td>";

      $tbody.appendChild(tr);
    }

    // Eventos por botón (sin delegación)
    
    const btnsAprobar  = $tbody.querySelectorAll(".btn-aprobar");
    const btnsRechazar = $tbody.querySelectorAll(".btn-rechazar");
    const btnsEliminar = $tbody.querySelectorAll(".btn-eliminar");

    for (let a = 0; a < btnsAprobar.length; a++) {
      btnsAprobar[a].addEventListener("click", onClickAprobar);
    }
    for (let r = 0; r < btnsRechazar.length; r++) {
      btnsRechazar[r].addEventListener("click", onClickRechazar);
    }
    for (let d = 0; d < btnsEliminar.length; d++) {
      btnsEliminar[d].addEventListener("click", onClickEliminar);
    }

  } catch (error) {
    console.error(error);
    $msg.textContent = "Error al cargar la tabla.";
  }
}

async function onClickAprobar(e) {
  const id = e.currentTarget.getAttribute("data-id");
  try {
    await putSolicitudEstado(id, "aprobada");
    $msg.textContent = "Solicitud #" + id + " aprobada.";
    await cargarTabla();
  } catch (error) {
    console.error(error);
    $msg.textContent = "No se pudo aprobar. Verificá json-server (3001) y el ID.";
  }
}

async function onClickRechazar(e) {
  const id = e.currentTarget.getAttribute("data-id");
  try {
    await putSolicitudEstado(id, "rechazada");
    $msg.textContent = "Solicitud #" + id + " rechazada.";
    await cargarTabla();
  } catch (error) {
    console.error(error);
    $msg.textContent = "No se pudo rechazar. Verificá json-server (3001) y el ID.";
  }
}

async function onClickEliminar(e) {
  const id = e.currentTarget.getAttribute("data-id");
  const ok = confirm("¿Eliminar solicitud #" + id + "?");
  if (!ok) return;

  try {
    await deleteSolicitud(id);
    $msg.textContent = "Solicitud #" + id + " eliminada.";
    await cargarTabla();
  } catch (error) {
    console.error(error);
    $msg.textContent = "No se pudo eliminar. Verificá json-server (3001) y el ID.";
  }
}

$filtro.addEventListener("change", function () {
  cargarTabla();
});

// Carga inicial
cargarTabla();
