const db = require('./db/db.js');

async function probarConexion() {
    try {
        const [rows] = await db.query('SELECT DATABASE() AS base');

        console.log('Conexión exitosa:', rows[0].base);
    } catch (error) {
        console.error('Error de conexión:', error.message);
    } finally {
        await db.end();
    }
}

probarConexion();