const { Kafka } = require('kafkajs');
const { persistirNotificacion } = require('../notificaciones/notificaciones.js');
const { enviarNotificacion } = require('../websocket/socket.js');
const { registrarLog } = require('../utils/logger.js');
 const { conectarDLQ, enviarADLQ }=require('./dlq.js');


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
// Confirma el offset del mensaje procesado.
const confirmarOffset = async (topic, partition, message) => {
  await consumer.commitOffsets([{
    topic,
    partition,
    offset: (BigInt(message.offset) + 1n).toString()
  }]);
};

// confirmamos su offset para no bloquear la partición.
const descartarMensaje = async (topic, partition, message, motivo) => {
  registrarLog('ERROR', motivo);
  await enviarADLQ(message, motivo);
  await confirmarOffset(topic, partition, message);
};



const iniciarConsumer = async () => {
  await conectarDLQ(); 
  await consumer.connect();
  registrarLog('INFO', 'Consumidor conectado exitosamente a Kafka');
  //console.log('Consumidor conectado exitosamente a Kafka.');

  await consumer.subscribe({
    topic: 'eventos',
    fromBeginning: true
  });

  await consumer.run({
    autoCommit:false,
    eachMessage: async ({ topic,partition,message }) => {
    //eachMessage: async ({ message }) => {


      const mensaje = parsearJSON(message.value.toString());


      //evitamos json validos pero de la forma [],null,123
      if (!mensaje || typeof mensaje !== 'object' || Array.isArray(mensaje)) {
        registrarLog('ERROR', 'Mensaje descartado: formato JSON incorrecto');
        await descartarMensaje(topic,partition,message,'Mensaje descartado: formato JSON incorrecto');
        return;
      }

      //validamos ademas los campos necesarios
      if (!mensaje.message_id || !mensaje.tipo_novedad || !mensaje.payload) {
        registrarLog('ERROR', `Message_ID: ${mensaje.message_id ?? 'desconocido'}: faltan campos obligatorios`);
        await descartarMensaje(topic,partition,message,`Message_ID: ${mensaje.message_id ?? 'desconocido'}: faltan campos obligatorios`);
        return;
      }
      const tiposPermitidos = [
        'EVENTO_CREADO',
        'EVENTO_MODIFICADO',
        'EVENTO_CANCELADO'
      ];

      if (!tiposPermitidos.includes(mensaje.tipo_novedad)) {
        registrarLog('ERROR', `message_ID: ${mensaje.message_id} Tipo de evento desconocido : ${mensaje.tipo_novedad}`);
        await descartarMensaje(topic, partition, message,`message_ID: ${mensaje.message_id} Tipo de evento desconocido : ${mensaje.tipo_novedad}`);
        return;
      }


      const payload = parsearJSON(mensaje.payload);

      if (!payload) {
        registrarLog('ERROR', `Message_ID: ${mensaje.message_id}: payload inválido`);
        await descartarMensaje(topic, partition, message,`Message_ID: ${mensaje.message_id}: payload inválido`);
        return;
      }
      //parseamos porque lo tenemos dentro de mensaje para estandarizar un poco sin tocar el producer
      const evento = {
        ...mensaje,
        payload: payload
      };

      try {
        
        await procesarConReintentos(evento)
       // await procesarEvento(evento); ya lo incluye dentro del nuevo metodo
        //si todo salio bien confirmamos

        await confirmarOffset(topic,partition,message);


        //mover aca el envio de notificaciones por ws para independizar sus procesos

      } catch (error) {
        registrarLog('ERROR', `Error al procesar mensaje ${evento.message_id} Kafka: ${error.message}`);
         await descartarMensaje(topic, partition, message,`Se agotaron los intentos de procesar el mensaje: ${evento.message_id} Kafka: ${error.message}`);
        
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


const esperar = (milisegundos) => {
  return new Promise(resolve => setTimeout(resolve, milisegundos));
};

const procesarConReintentos = async (evento) => {
  const maxIntentos = 4;

  for (let intento = 1; intento <= maxIntentos; intento++) {
    try {
      await procesarEvento(evento);
      return; // Procesamiento exitoso: salimos 

    } catch (error) {
      registrarLog(
        'ERROR',
        `Error en intento ${intento}/${maxIntentos} para mensaje ${evento.message_id}: ${error.message}`
      );

      if (intento === maxIntentos) {
        throw error;
      }
      // espera incremental
      const demora = 1000 * Math.pow(2, intento - 1);

      registrarLog(
        'INFO',
        `Reintentando mensaje ${evento.message_id} en ${demora / 1000} segundos`
      );

      await esperar(demora);
    }
  }
};



module.exports = { iniciarConsumer };

