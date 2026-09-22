import type { Evento } from './types';

const API_URL = 'http://localhost:8080/api/eventos';
const TOKEN = 'TOKEN';

export const getEventos = async (): Promise<Evento[]> => {
  const response = await fetch(API_URL, {
    headers: { 'Authorization': `Bearer ${TOKEN}` }
  });
  if (!response.ok) throw new Error('Error al obtener los eventos');
  return response.json();
};


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