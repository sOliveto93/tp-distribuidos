const db = require('../db/db.js');

async function persistirNotificacion(evento, tipo_novedad) {

    const payload = evento.payload;
    const titulo = payload.titulo || payload.despues?.titulo;
    const rawFecha = payload.fechaHora || payload.despues?.fechaHora;
    const fechaEvento = rawFecha ? String(rawFecha).replace('T', ' ') : null;
    const notificacionesCreadas = [];
    let usuarios;
    if (tipo_novedad == 'EVENTO_CREADO') {
    [usuarios] = await db.execute(
        `SELECT id
         FROM usuarios
         WHERE rol = ?`,
        ['VISITANTE']
    );}
    else{
        [usuarios] = await db.execute(
            `SELECT DISTINCT id_usuario AS id 
             FROM evento_usuario 
             WHERE id_evento = ?`,
            [evento.evento_id]
        );
    }
    
    let accion="creó un nuevo";
    if(tipo_novedad=='EVENTO_MODIFICADO'){
        accion="modificó un";
    }
    else if(tipo_novedad=='EVENTO_CANCELADO'){
        accion="canceló un";
    }

    for (const usuario of usuarios) {
        //esta query maneja los mensajes duplicados con unique
        const [resultado] = await db.execute(
            `INSERT INTO notificaciones
                (message_id, usuario_id, evento_id, tipo_novedad, fecha_evento, titulo, mensaje)
             VALUES (?, ?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE message_id = message_id`,
            [
                evento.message_id,
                usuario.id,
                evento.evento_id,
                evento.tipo_novedad,
                fechaEvento,
                titulo,
                `Se ${accion} evento: ${titulo}`
            ]
        );
        //nos fijamos si realmente se inserto un registro porque ignoramos duplicados
        //asi evitamos duplicar notificaciones
        if (resultado.affectedRows === 1) {

            notificacionesCreadas.push({

                message_id: evento.message_id,
                usuario_id: usuario.id,
                evento_id: evento.evento_id,
                tipo_novedad: evento.tipo_novedad,
                fecha_evento: fechaEvento,
                titulo: titulo,
                mensaje: `Se ${accion} evento: ${titulo}`
                
            });
        }
    }

    console.log(`Notificaciones nuevas: ${notificacionesCreadas.length}`);

    return notificacionesCreadas;
}

module.exports = { persistirNotificacion };

/* ejemplo de mensaje
{
  id: 7,
  message_id: '023b20d1-d4a5-4278-8ce8-054f7cb230d2',
  tipo_novedad: 'EVENTO_CREADO',
  evento_id: 10,
  usuario_responsable_id: 1,
  payload: '{"id": 10, "tipo": "EXPOSICION", "titulo": "prueba10", "cupoMax": 12, "duracion": 45, "curadorId": 1, "fechaHora": "2021-06-28T03:14:00", "descripcion": "descripcion random"}',
  intentos: 0,
  disponible_en: '2026-10-31 01:19:03',
  bloqueado_hasta: null,
  creado_en: '2026-10-31 01:19:03',
  enviado_en: null,
  ultimo_error: null,
  estado: 'PENDIENTE'
}
*/