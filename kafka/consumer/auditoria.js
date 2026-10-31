const { Kafka } = require('kafkajs');
const fs = require('fs');

const kafka = new Kafka({
  clientId: 'app-auditoria',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-auditoria' });

const mensajesProcesados = new Set();

const iniciar = async () => {
  await consumer.connect();
  console.log("Consumidor de Auditoría conectado exitosamente a Kafka.");

  await consumer.subscribe({ topic: 'eventos', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const eventoBD = JSON.parse(message.value.toString());
      const messageId = eventoBD.message_id;

      if (mensajesProcesados.has(messageId)) {
        console.log(`[DUPLICADO] Mensaje ${messageId} ignorado.`);
        return; 
      }
      mensajesProcesados.add(messageId); 

      const fecha = new Date().toISOString();
      const lineaAuditoria = `[${fecha}] ACCIÓN: ${eventoBD.tipo_novedad} | RESPONSABLE_ID: ${eventoBD.usuario_responsable_id} | DATOS: ${eventoBD.payload}\n`;
      
      fs.appendFileSync('auditoria.log', lineaAuditoria);
      
      console.log(`[AUDITORÍA] Registro guardado correctamente para el mensaje: ${messageId}`);
    },
  });
};

iniciar().catch(console.error);