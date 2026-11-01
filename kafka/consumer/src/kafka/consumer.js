const { Kafka } = require('kafkajs');
const { persistirNotificacion } = require('../notificaciones/notificaciones.js');
const { enviarNotificacion } = require('../websocket/socket.js');


const kafka = new Kafka({
  clientId: 'museo-notificaciones',
  brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-notificaciones' });

const procesarEvento = async(evento) => {
  let notificaciones=[];

  switch (evento.tipo_novedad) {
    case 'EVENTO_CREADO':
      notificaciones = await persistirNotificacion(evento, evento.tipo_novedad);
      break;

    case 'EVENTO_MODIFICADO':
     notificaciones = await persistirNotificacion(evento, evento.tipo_novedad);
      break;

    case 'EVENTO_CANCELADO':
      notificaciones = await persistirNotificacion(evento, evento.tipo_novedad);
      break;

    default:
      throw new Error(`Tipo de evento desconocido: ${evento.tipo_novedad}`);
  }

  for (const notificacion of notificaciones) {
        enviarNotificacion(notificacion.usuario_id, notificacion);
    }

}

const iniciarConsumer = async () => {
  await consumer.connect();

  console.log('Consumidor conectado exitosamente a Kafka.');

  await consumer.subscribe({
    topic: 'eventos',
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const mensaje = JSON.parse(message.value.toString());
      console.log('MENSAJE ORIGINAL:', mensaje);
      //parseamos porque lo tenemos dentro de mensaje para estandarizar un poco sin tocar el producer
      const evento = {
    ...mensaje,
    payload: JSON.parse(mensaje.payload)
};
console.log('TIPO DEL EVENTO:', evento.tipo_novedad);
      await procesarEvento(evento);

      console.log(
        `Notificaciones procesadas para ${evento.tipo_novedad}`
      );
    }
  });
}

module.exports = { iniciarConsumer };

