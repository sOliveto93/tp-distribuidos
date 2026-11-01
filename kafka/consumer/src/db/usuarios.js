const pool = require('./db');

const buscarUsuarioPorEmail = async (email) => {
    const [rows] = await pool.execute(
        'SELECT id, email, rol FROM usuarios WHERE email = ? LIMIT 1',
        [email]
    );

    return rows[0] || null;
};

module.exports = {
    buscarUsuarioPorEmail
};