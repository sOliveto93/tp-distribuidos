const { Kafka } = require('kafkajs');
const db = require('./db/db.js');

const kafka = new Kafka({
  clientId: 'app-auditoria',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-auditoria' });

const iniciar = async () => {
  await consumer.connect();
  console.log("Consumidor de Auditoría conectado exitosamente a Kafka.");
  await consumer.subscribe({ topic: 'eventos', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventoBD = JSON.parse(message.value.toString());
      const messageId = eventoBD.message_id;

      try {
        await db.execute(
          'INSERT INTO auditoria (message_id, accion, responsable_id, payload) VALUES (?, ?, ?, ?)',
          [messageId, eventoBD.tipo_novedad, eventoBD.usuario_responsable_id, JSON.stringify(eventoBD.payload)]
        );
        console.log(`[AUDITORÍA] Registro guardado en BD para el mensaje: ${messageId}`);
        
      } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          console.log(`[DUPLICADO] Mensaje ${messageId} ignorado por la BD.`);
        } else {
          console.error(`Error guardando auditoría:`, error);
        }
      }
    },
  });
};

iniciar().catch(console.error);