
import { API_URL } from "./api.js";

// GET todas (admin) soporta query opcional estado=pendiente 

export async function getSolicitudes(query) {
  let url = API_URL + "/solicitudes";
  if (query && query.length > 0) {
    url = url + "?" + query;
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      console.error("No se pudieron obtener las solicitudes (status:", response.status, ")");
      throw new Error("No se pudieron obtener las solicitudes");
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    throw error;
  }
}

// GEt por usuario (historial) 

export async function getSolicitudesByUser(userId) {
  const url = API_URL + "/solicitudes?userId=" + encodeURIComponent(userId);

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      console.error("No se pudo obtener el historial del usuario (status:", response.status, ")");
      throw new Error("No se pudo obtener el historial del usuario");
    }

    const datos = await response.json();
    return datos;
  } catch (error) {
    console.error("Error al obtener historial por usuario:", error);
    throw error;
  }
}

// POST crear solicitud (alumno) 

export async function postSolicitud(solicitud) {
  try {
    const response = await fetch(API_URL + "/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(solicitud)
    });

    if (!response.ok) {
      console.error("No se pudo crear la solicitud (status:", response.status, ")");
      throw new Error("No se pudo crear la solicitud");
    }

    const creada = await response.json();
    return creada;
  } catch (error) {
    console.error("Error al crear solicitud:", error);
    throw error;
  }
}

// PUT: actualizar SOLO el estado (admin) 

export async function putSolicitudEstado(id, nuevoEstado) {
  try {

    // Paso 1: obtener actual

    const getRes = await fetch(API_URL + "/solicitudes/" + encodeURIComponent(id), {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!getRes.ok) {
      console.error("Solicitud no encontrada (status:", getRes.status, ")");
      throw new Error("Solicitud no encontrada");
    }

    const actual = await getRes.json();

    // Paso 2: enviar objeto completo con el nuevo estado

    const actualizado = {
      id: actual.id,
      userId: actual.userId,
      nombre: actual.nombre,
      sede: actual.sede,
      fechaSalida: actual.fechaSalida,
      fechaRegreso: actual.fechaRegreso,
      codigo: actual.codigo,
      aceptaCondiciones: actual.aceptaCondiciones,
      firma: actual.firma,
      estado: nuevoEstado,
      creadaEl: actual.creadaEl,
      actualizadoEn: new Date().toISOString()
    };

    const putRes = await fetch(API_URL + "/solicitudes/" + encodeURIComponent(id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(actualizado)
    });

    if (!putRes.ok) {
      console.error("No se pudo actualizar la solicitud (status:", putRes.status, ")");
      throw new Error("No se pudo actualizar la solicitud");
    }

    const guardada = await putRes.json();
    return guardada;
  } catch (error) {
    console.error("Error al actualizar estado:", error);
    throw error;
  }
}

// DELETE: eliminar solicitud (historial/admin) 

export async function deleteSolicitud(id) {
  try {
    const response = await fetch(API_URL + "/solicitudes/" + encodeURIComponent(id), {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      console.error("No se pudo eliminar la solicitud (status:", response.status, ")");
      throw new Error("No se pudo eliminar la solicitud");
    }

    return true; // json-server devuelve {}
  } catch (error) {
    console.error("Error al eliminar solicitud:", error);
    throw error;
  }
}
