const http = require('http');
const { iniciarConsumer } = require('./kafka/consumer');
const { configurarWebSocket } = require('./websocket/socket');
const { iniciarAuditoria } = require('./auditoria/auditoria');

const PORT = 3100;

const server = http.createServer();

configurarWebSocket(server);

const iniciar = async () => {
    server.listen(PORT, () => {
        console.log(`Servidor WebSocket escuchando en puerto ${PORT}`);
    });

    await iniciarConsumer();
    await iniciarAuditoria();
};

iniciar().catch(console.error);