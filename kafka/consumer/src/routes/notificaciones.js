const { autenticarToken } = require('../auth/authService');
const db = require('../db/db');

const obtenerNotificaciones = async (req, res) => {
    try {
        const authorization = req.headers.authorization;

        if (!authorization || !authorization.startsWith('Bearer ')) {
            res.writeHead(401);
            return res.end(JSON.stringify({
                mensaje: 'Token no proporcionado'
            }));
        }

        const token = authorization.split(' ')[1];
        const usuario = await autenticarToken(token);

        const [notificaciones] = await db.execute(
            `SELECT id, evento_id, tipo_novedad, titulo, fecha_evento, mensaje, fecha_creacion
             FROM notificaciones
             WHERE usuario_id = ?
             ORDER BY fecha_creacion DESC`,
            [usuario.id]
        );

        res.writeHead(200, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify(notificaciones));

    } catch (error) {
        console.error('Error al obtener notificaciones:', error.message);

        res.writeHead(401, {
            'Content-Type': 'application/json'
        });

        res.end(JSON.stringify({
            mensaje: 'No autorizado'
        }));
    }
};

module.exports = { obtenerNotificaciones };