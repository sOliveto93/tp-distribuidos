const { Kafka } = require('kafkajs');
const { persistirNotificacion } = require('./notificaciones.js');


const kafka = new Kafka({
  clientId: 'mi-app-prueba',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-prueba' });

const iniciar = async () => {
  await consumer.connect();
  console.log("Consumidor conectado exitosamente a Kafka.");

  await consumer.subscribe({ topic: 'eventos', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const evento = JSON.parse(message.value.toString());

      await persistirNotificacion(evento)
      console.log(`Notificaciones persistidas para el evento ${evento.evento_id}`);
      
    },
  });
};

iniciar().catch(console.error);