import type { Auditoria } from '../types/types';

const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_REST = import.meta.env.VITE_PORT_REST || ':8080'; 
const API_URL = `${URL_BASE}${PORT_REST}/api/auditoria`;

export const getAuditorias = async (): Promise<Auditoria[]> => {
  const token = localStorage.getItem('token');

  const response = await fetch(API_URL, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    }
  });

  if (!response.ok) {
    throw new Error('Error al obtener el historial de auditoría');
  }

  return response.json();
};