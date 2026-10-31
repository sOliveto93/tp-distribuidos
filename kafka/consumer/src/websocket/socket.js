const WebSocket = require('ws')

const conexiones= new Map();


const configurarWebSocket=(server)=>{
    const wss= new WebSocket.Server({server});

    wss.on('connection',(socket)=>{
        console.log('Nueva conexion webSocket');

        socket.on('message',(mensaje)=>{
            const datos = JSON.parse(mensaje.toString());

            if(datos.tipo === 'REGISTRAR_USUARIO'){
                const usuarioId = datos.usuarioId;
                conexiones.set(usuarioId,socket);

                console.log(`usuario ${usuarioId} conectado`);
            }
        });

        socket.on('close',()=>{
            for(const [usuarioId,conexion] of conexiones.entries()){

                if(conexion === socket){
                    conexiones.delete(usuarioId);

                    console.log(`Usuario ${usuarioId} desconectado`);

                    break;
                }

            }
        });
       
    });
    return wss;
};


const enviarNotificacion= (usuarioId, notificaion)=>{
    const socket = conexiones.get(usuarioId);

    if(socket && socket.readyState === WebSocket.OPEN){

        socket.send(JSON.stringify(notificaion));
        return true;
    }

    return false;
}



module.exports={
    configurarWebSocket,
    enviarNotificacion
}