const jwt = require('jsonwebtoken');
const { buscarUsuarioPorEmail } = require('../db/usuarios');

const autenticarToken = async (token) => {
    const payload = jwt.verify(
        token,
        process.env.JWT_SECRET,
        { algorithms: ['HS256'] }
    );

    const email = payload.sub;

    if (!email) {
        throw new Error('Token sin email');
    }

    const usuario = await buscarUsuarioPorEmail(email);

    if (!usuario || usuario.rol !== 'VISITANTE') {
        throw new Error('Usuario no autorizado');
    }

    return usuario;
};

module.exports = { autenticarToken };