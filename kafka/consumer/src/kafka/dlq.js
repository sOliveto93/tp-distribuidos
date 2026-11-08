const { Kafka } = require('kafkajs');
const { registrarLog } = require('../utils/logger.js');


const kafka = new Kafka({
  clientId: 'museo-notificaciones',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});
const producer = kafka.producer();

//revisar que no conecte varias veces solo 1 vez al comenzar el consumer
const conectarDLQ = async () => {
  await producer.connect();
};

const enviarADLQ = async (mensaje, motivo) => {

    const mensajeJson=crearMensaje(mensaje,motivo);
  await producer.send({
    topic: 'eventos-dlq',
    messages: [
      {
        value: mensajeJson
      }
    ]
  });
};

function crearMensaje(mensaje,motivo){
    return JSON.stringify({
          mensaje_original: mensaje.value.toString(),
          motivo: motivo,
          fecha_error: new Date().toISOString()
        })
}

module.exports = { conectarDLQ, enviarADLQ };

