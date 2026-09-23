import type { Evento } from './types';

const API_URL = 'http://localhost:8080/api/eventos';
const TOKEN = 'TOKEN';

//Obtener Eventos
export const getEventos = async (filtros?: { fecha?: string; tipo?: string; idCurador?: number }): Promise<Evento[]> => {
  let url = API_URL;
  
  if (filtros) {
    const params = new URLSearchParams();
    if (filtros.fecha) params.append('fecha', filtros.fecha);
    if (filtros.tipo) params.append('tipo', filtros.tipo);
    if (filtros.idCurador) params.append('idCurador', filtros.idCurador.toString());
    
    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;
  }

  const response = await fetch(url, {
    headers: { 'Authorization': `Bearer ${TOKEN}` } 
  });
  
  if (!response.ok) throw new Error('Error al obtener los eventos');
  return response.json();
};

// Crear Evento
export const crearEvento = async (eventoData: Partial<Evento>): Promise<Evento> => {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}` 
    },
    body: JSON.stringify(eventoData)
  });
  if (!response.ok) throw new Error('Error al crear el evento');
  return response.json();
};

// Eliminar un evento
export const eliminarEvento = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error('Error al eliminar el evento');
};

// Inscribirse a un evento 
export const inscribirseEvento = async (idEvento: number, idUsuario: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${idEvento}/inscribir/${idUsuario}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error('Error al inscribirse');
};

// Desinscribirse de un evento
export const desinscribirseEvento = async (idEvento: number, idUsuario: number): Promise<void> => {
  const response = await fetch(`${API_URL}/${idEvento}/desinscribir/${idUsuario}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error('Error al cancelar inscripción');
};

// Traer un evento por ID para llenar el formulario
export const getEventoById = async (id: string): Promise<Evento> => {
  const response = await fetch(`${API_URL}/${id}`, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error('Error al obtener el evento');
  return response.json();
};

// Actualizar un evento existente
export const actualizarEvento = async (id: string, eventoData: Partial<Evento>): Promise<Evento> => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${TOKEN}` 
    },
    body: JSON.stringify(eventoData)
  });
  if (!response.ok) throw new Error('Error al actualizar el evento');
  return response.json();
};