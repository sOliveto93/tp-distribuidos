import type { DatosExploracion } from '../types/types';

const GATEWAY_URL = `${import.meta.env.VITE_URL_BASE}${import.meta.env.VITE_PORT_GATEWAY}`;

export const fetchExploracion = async (movimiento: string): Promise<DatosExploracion> => {
    const res = await fetch(`${GATEWAY_URL}/exploracion/${movimiento}`);
    const data = await res.json();
    
    if (!res.ok) {
        throw new Error(data.error || `Error HTTP ${res.status}`);
    }
    
    return data;
};