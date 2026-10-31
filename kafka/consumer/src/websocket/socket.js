
const WebSocket = require('ws');
const { autenticarToken } = require('../auth/authService');

const conexiones = new Map();

const configurarWebSocket = (server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (socket) => {
        //console.log('Nueva conexion WebSocket');

        socket.autenticado = false;

        socket.on('message', async (mensaje) => {
            try {
                const datos = JSON.parse(mensaje.toString());

                if (socket.autenticado) return;

                if (datos.tipo !== 'REGISTRAR_USUARIO') {
                    //1008 = violacion de politica en el protocolo websocket
                    socket.close(1008, 'Debe autenticarse primero');
                    return;
                }

                const usuario = await autenticarToken(datos.token);
                //console.log('Usuario autenticado:', usuario.id);
                conexiones.set(usuario.id, socket);
                socket.autenticado = true;
                //console.log('Conexiones registradas:', [...conexiones.keys()]);
                //console.log(`Usuario ${usuario.id} conectado`);

            } catch (error) {
                console.error('Error de autenticación:', error.message);
                socket.close(1008, 'Autenticación inválida');
            }
        });

        socket.on('close', () => {
            for (const [usuarioId, conexion] of conexiones.entries()) {
                if (conexion === socket) {
                    conexiones.delete(usuarioId);
                    console.log(`Usuario ${usuarioId} desconectado`);
                    break;
                }
            }
        });
    });

    return wss;
};

const enviarNotificacion = (usuarioId, notificacion) => {
    const socket = conexiones.get(usuarioId);
    console.log('Intentando enviar:', usuarioId);
    console.log('Socket encontrado:', !!socket);
    console.log('Estado:', socket?.readyState);
    if (socket && socket.autenticado &&
        socket.readyState === WebSocket.OPEN) {

        socket.send(JSON.stringify(notificacion));
        return true;
    }

    return false;
};

module.exports = {
    configurarWebSocket,
    enviarNotificacion
};
