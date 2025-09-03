
import { API_URL } from "./api.js";

// GET: usuarios (con o sin filtros) 

export async function getUsuarios(queryParams) {
  let url = API_URL + "/usuarios";
  if (queryParams && queryParams.length > 0) {
    url = url + "?" + queryParams;
  }

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      console.error("Error al obtener usuarios (status:", res.status, ")");
      throw new Error("Error al obtener usuarios");
    }

    const datos = await res.json();
    return datos;
  } catch (error) {
    console.error("Error GET usuarios:", error);
    throw error;
  }
}

// POST: crear usuario 

export async function postUsuario(usuario) {
  try {
    const res = await fetch(API_URL + "/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!res.ok) {
      console.error("Error al crear usuario (status:", res.status, ")");
      throw new Error("Error al crear usuario");
    }

    const creado = await res.json();
    return creado;
  } catch (error) {
    console.error("Error POST usuario:", error);
    throw error;
  }
}

// PUT: actualizar usuario 

export async function putUsuario(id, usuario) {
  try {
    const res = await fetch(API_URL + "/usuarios/" + id, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(usuario)
    });

    if (!res.ok) {
      console.error("Error al actualizar usuario (status:", res.status, ")");
      throw new Error("Error al actualizar usuario");
    }

    const actualizado = await res.json();
    return actualizado;
  } catch (error) {
    console.error("Error PUT usuario:", error);
    throw error;
  }
}

// DELETE: eliminar usuario 

export async function deleteUsuario(id) {
  try {
    const res = await fetch(API_URL + "/usuarios/" + id, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!res.ok) {
      console.error("Error al eliminar usuario (status:", res.status, ")");
      throw new Error("Error al eliminar usuario");
    }

    const resp = await res.json(); // json-server devuelve {}
    return resp;
  } catch (error) {
    console.error("Error DELETE usuario:", error);
    throw error;
  }
}
