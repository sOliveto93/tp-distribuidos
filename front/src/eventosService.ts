import type { Evento } from './types';

const API_URL = 'http://localhost:8080/api/eventos';
const TOKEN = 'TOKEN';

//Obtener Eventos
export const getEventos = async (): Promise<Evento[]> => {
  const response = await fetch(API_URL, {
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