
import { getUsuarios, postUsuario } from "./services/usuarios.js";

const $registroForm = document.getElementById("registroForm");
const $loginForm    = document.getElementById("loginForm");
const $registroMsg  = document.getElementById("registroMsg");
const $loginMsg     = document.getElementById("loginMsg");

// REGISTRO 

if ($registroForm) {
  $registroForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    $registroMsg.textContent = "";

    const userId    = document.getElementById("r_userId").value.trim();
    const nombre    = document.getElementById("r_nombre").value.trim();
    const sede      = document.getElementById("r_sede").value;
    const password  = document.getElementById("r_password").value;
    const password2 = document.getElementById("r_password2").value;

    if (!userId || !nombre || !sede || !password || !password2) {
      $registroMsg.textContent = "Completa todos los campos.";
      return;
    }
    if (password !== password2) {
      $registroMsg.textContent = "Las contraseñas no coinciden.";
      return;
    }

    try {
      const repetidos = await getUsuarios("userId=" + encodeURIComponent(userId));
      if (repetidos.length > 0) {
        $registroMsg.textContent = "Ese ID de usuario ya existe.";
        return;
      }

      const nuevo = { userId: userId, nombre: nombre, sede: sede, password: password, rol: "alumno" };
      await postUsuario(nuevo);

      $registroMsg.textContent = "Cuenta creada. Ahora podés iniciar sesión.";
      $registroForm.reset();
    } catch (err) {
      console.error(err);
      $registroMsg.textContent = "Error registrando usuario.";
    }
  });
}

// LOGIN 
if ($loginForm) {
  $loginForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    $loginMsg.textContent = "";

    const userId   = document.getElementById("l_userId").value.trim();
    const password = document.getElementById("l_password").value.trim();

    if (!userId || !password) {
      $loginMsg.textContent = "Ingresá tu ID y contraseña.";
      return;
    }

    try {
      const q = "userId=" + encodeURIComponent(userId) + "&password=" + encodeURIComponent(password);
      const encontrados = await getUsuarios(q);

      if (encontrados.length === 1) {
        localStorage.setItem("sesionUsuario", JSON.stringify(encontrados[0]));
        window.location.href = "/page/solicitud.html";
      } else {
        $loginMsg.textContent = "Credenciales incorrectas.";
      }
    } catch (err) {
      console.error(err);
      $loginMsg.textContent = "Error al iniciar sesión.";
    }
  });
}
