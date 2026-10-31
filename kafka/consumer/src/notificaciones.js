const db = require('./db/db.js');

async function persistirNotificacion(evento) {

    const payload = JSON.parse(evento.payload);


    const [usuarios] = await db.execute(
        `SELECT id
         FROM usuarios
         WHERE rol = ?`,
        ['VISITANTE']
    );

    for (const usuario of usuarios) {
//esta query maneja los mensajes duplicados con unique
        await db.execute(
            `INSERT INTO notificaciones
                (message_id, usuario_id, evento_id, tipo_novedad, titulo, mensaje)
             VALUES (?, ?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE message_id = message_id`,
            [
                evento.message_id,
                usuario.id,
                evento.evento_id,
                evento.tipo_novedad,
                payload.titulo,
                `Se creó un nuevo evento: ${payload.titulo}`
            ]
        );
    }

    console.log(`Notificaciones procesadas: ${usuarios.length}`);
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