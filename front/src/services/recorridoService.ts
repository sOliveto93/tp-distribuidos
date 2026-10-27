import type { GenerarRecorridoRequest, RecorridoResponse } from '../types/types';

const API_GATEWAY_URL = `${import.meta.env.VITE_URL_BASE}${import.meta.env.VITE_PORT_GATEWAY}/obras`;

export const generarRecorrido = async (filtros: GenerarRecorridoRequest): Promise<RecorridoResponse> => {
    const response = await fetch(`${API_GATEWAY_URL}/recorridos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(filtros),
    });

    if (!response.ok) {
        throw new Error('Error al generar el recorrido desde el servidor');
    }

    return response.json();
};