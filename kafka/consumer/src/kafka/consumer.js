const { Kafka } = require('kafkajs');
const { persistirNotificacion } = require('../notificaciones/notificaciones.js');
const { enviarNotificacion } = require('../websocket/socket.js');
const { registrarLog } = require('../utils/logger.js');

const kafka = new Kafka({
  clientId: 'museo-notificaciones',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'grupo-notificaciones' });

const procesarEvento = async (evento) => {
  let notificaciones = [];
  try {

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
    registrarLog('INFO', `Message_ID${evento.message_id} ${evento.tipo_novedad} procesado. Notificaciones generadas: ${notificaciones.length}`
    );
  } catch (error) {
    registrarLog('ERROR', `Error procesando mensaje ${evento.message_id} (${evento.tipo_novedad}): ${error.message}`);

    throw error;
  }

}

const iniciarConsumer = async () => {
  await consumer.connect();
  registrarLog('INFO', 'Consumidor conectado exitosamente a Kafka');
  //console.log('Consumidor conectado exitosamente a Kafka.');

  await consumer.subscribe({
    topic: 'eventos',
    fromBeginning: true
  });

  await consumer.run({
    eachMessage: async ({ message }) => {


      const mensaje = parsearJSON(message.value.toString());


      //evitamos json validos pero de la forma [],null,123
      if (!mensaje || typeof mensaje !== 'object' || Array.isArray(mensaje)) {
        registrarLog('ERROR', 'Mensaje descartado: formato JSON incorrecto');
        return;
      }

      //validamos ademas los campos necesarios
      if (!mensaje.message_id || !mensaje.tipo_novedad || !mensaje.payload) {
        registrarLog('ERROR', `Message_ID: ${mensaje.message_id ?? 'desconocido'}: faltan campos obligatorios`);
        return;
      }
      const tiposPermitidos = [
        'EVENTO_CREADO',
        'EVENTO_MODIFICADO',
        'EVENTO_CANCELADO'
      ];

      if (!tiposPermitidos.includes(mensaje.tipo_novedad)) {
        registrarLog('ERROR', `message_ID: ${mensaje.message_id} Tipo de evento desconocido : ${mensaje.tipo_novedad}`);
        return;
      }


      const payload = parsearJSON(mensaje.payload);

      if (!payload) {
        registrarLog('ERROR', `Message_ID: ${mensaje.message_id}: payload inválido`);
        return;
      }
      //parseamos porque lo tenemos dentro de mensaje para estandarizar un poco sin tocar el producer
      const evento = {
        ...mensaje,
        payload: payload
      };

      try {

        await procesarEvento(evento);

      } catch (error) {
        registrarLog('ERROR', `Error al procesar mensaje ${evento.message_id} Kafka: ${error.message}`);
        //necesario para avisarle a kafka que algo salio mal
        throw error;
      }
    }
  });
}

const parsearJSON = (contenido) => {
  try {
    return JSON.parse(contenido);
  } catch (error) {
    registrarLog('ERROR', `Error al parsear JSON: ${error.message}`);
    return null;
  }
}

module.exports = { iniciarConsumer };

