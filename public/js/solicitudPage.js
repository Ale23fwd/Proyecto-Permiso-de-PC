
import { getSesion } from "./nav.js";
import { postSolicitud } from "./services/solicitudesService.js";

const sesion = getSesion();
const $form = document.getElementById("solicitudForm");
const $msg  = document.getElementById("solicitudMsg");

// Campos

const $userId = document.getElementById("userId");
const $nombre = document.getElementById("nombre");
const $sede   = document.getElementById("sede");

// Prefill con datos del usuario logueado

if (sesion) {
  $userId.value = sesion.userId || "";
  $nombre.value = sesion.nombre || "";
  if (sesion.sede) {
    $sede.value = sesion.sede;
  }
}

$form.addEventListener("submit", async function (e) {
  e.preventDefault();
  $msg.textContent = "";

  const data = {
    userId: $userId.value.trim(),
    nombre: $nombre.value.trim(),
    sede: document.getElementById("sede").value,
    fechaSalida: document.getElementById("fechaSalida").value,
    fechaRegreso: document.getElementById("fechaRegreso").value,
    codigo: document.getElementById("codigo").value.trim(),
    aceptaCondiciones: document.getElementById("aceptaCondiciones").checked,
    firma: document.getElementById("firma").value.trim(),
    estado: "pendiente",
    creadaEl: new Date().toISOString()
  };

  if (!data.aceptaCondiciones) {
    $msg.textContent = "Debes aceptar las condiciones.";
    return;
  }

  try {
    await postSolicitud(data);
    $msg.textContent = "Solicitud enviada correctamente.";
    $form.reset();

    // Mantener userId/nombre/sede después del reset
    
    if (sesion) {
      $userId.value = sesion.userId || "";
      $nombre.value = sesion.nombre || "";
      if (sesion.sede) {
        $sede.value = sesion.sede;
      }
    }
  } catch (err) {
    console.error(err);
    $msg.textContent = "No se pudo enviar la solicitud. Verificá json-server (3001).";
  }
});
