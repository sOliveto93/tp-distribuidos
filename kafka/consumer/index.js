const { Kafka } = require('kafkajs');

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
      const valor = JSON.parse(message.value.toString());

      console.log("Mensaje recibido desde Python:");
      console.log(valor);
    },
  });
};

iniciar().catch(console.error);