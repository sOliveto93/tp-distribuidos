const { Kafka } = require('kafkajs');
const { persistirNotificacion } = require('../notificaciones/notificaciones.js');
const { enviarNotificacion } = require('../websocket/socket.js');


const kafka = new Kafka({
  clientId: 'museo-notificaciones',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-notificaciones' });

const iniciarConsumer = async () => {
  await consumer.connect();
  console.log("Consumidor Notificaciones conectado exitosamente a Kafka.");

  await consumer.subscribe({ topic: 'eventos', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const evento = JSON.parse(message.value.toString());

      const notificaciones=await persistirNotificacion(evento);

      for(const notificacion of notificaciones){
        enviarNotificacion(notificacion.usuario_id,notificacion);
      }

      console.log(`Notificaciones persistidas para el evento ${evento.evento_id}`);
      
    },
  });
};

module.exports={iniciarConsumer};

