

// Leer la sesión guardada (localStorage)

function getSesion() {
  const raw = localStorage.getItem("sesionUsuario");
  if (!raw) {
    return null;
  }
  try {
    const data = JSON.parse(raw);
    return data;
  } catch (e) {
    console.error("Error leyendo la sesión:", e);
    return null;
  }
}


function protegerRuta(arg) {
  let requiereAdmin = false;

  if (typeof arg === "boolean") {
    requiereAdmin = arg;
  } else if (arg && typeof arg === "object" && arg.requiereAdmin === true) {
    requiereAdmin = true;
  }

  const sesion = getSesion();

  if (!sesion) {
    window.location.href = "/page/index.html";
    return;
  }

  if (requiereAdmin === true && sesion.rol !== "admin") {
    window.location.href = "/page/historial.html";
  }
}


function renderNavbar() {
  const cont = document.getElementById("appHeader");
  if (!cont) {
    return;
  }

  const sesion = getSesion();
  let rol = "visitante";
  if (sesion && sesion.rol) {
    rol = sesion.rol;
  }

  let html = "";
  html += '<header class="appbar">';
  html += '  <div class="brand">Sistema de Permisos</div>';
  html += '  <nav class="navlinks">';

  if (rol !== "visitante") {
    html += '    <a href="/page/solicitud.html">Nueva solicitud</a>';
    html += '    <a href="/page/historial.html">Mi historial</a>';
  }

  if (rol === "admin") {
    html += '    <a href="/page/admi.html">Panel Admin</a>';
  }

  html += '    <a href="/page/index.html">Inicio</a>';

  if (rol !== "visitante") {
    html += '    <button id="btnLogout">Cerrar sesión</button>';
  }

  html += '  </nav>';
  html += '</header>';

  cont.innerHTML = html;

  const btnLogout = document.getElementById("btnLogout");
  if (btnLogout) {
    btnLogout.addEventListener("click", function () {
      localStorage.removeItem("sesionUsuario");
      window.location.href = "/page/index.html";
    });
  }
}

export { getSesion, protegerRuta, renderNavbar };
