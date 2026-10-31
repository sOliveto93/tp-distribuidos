const BASE_URL = import.meta.env.VITE_URL_BASE_WS;
const PORT_WEBSOCKET = import.meta.env.VITE_PORT_WEBSOCKET;
import type {Notificacion}  from '../types/types.ts';

export const conectarNotificaciones = (id: number, onNotificacion: (notificacion: Notificacion) => void
): WebSocket => {
    const socket = new WebSocket(`${BASE_URL}${PORT_WEBSOCKET}`);

    socket.onopen = () => {
        socket.send(JSON.stringify({
            tipo: 'REGISTRAR_USUARIO',
            usuarioId: id
        }));

        console.log('Conexión WebSocket establecida');
    };

    socket.onmessage = (event) => {
        const notificacion: Notificacion = JSON.parse(event.data);
        onNotificacion(notificacion);
    };

    socket.onerror = (error) => {
        console.error('Error en WebSocket:', error);
    };

    return socket;
};