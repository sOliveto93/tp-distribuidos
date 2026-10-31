const http = require('http');
const { iniciarConsumer } = require('./kafka/consumer');
const { configurarWebSocket } = require('./websocket/socket');
const { obtenerNotificaciones } = require('./routes/notificaciones');


const PORT = 3100;

const server = http.createServer(async(req,res)=>{

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }
    
    if(req.method === 'GET' && req.url === '/api/notificaciones'){

        return obtenerNotificaciones(req,res);
    }
    res.writeHead(404);
    res.end('Ruta no encontrada');
});

configurarWebSocket(server);

const iniciar = async () => {
    server.listen(PORT, () => {
        console.log(`Servidor WebSocket escuchando en puerto ${PORT}`);
    });

    await iniciarConsumer();
};

iniciar().catch(console.error);