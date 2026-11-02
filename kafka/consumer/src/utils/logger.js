const fs = require('fs');

const registrarLog = (nivel, mensaje) => {
    const fecha = new Date().toISOString();

    const linea = `[${fecha}] ${nivel}: ${mensaje}\n`;

    fs.appendFileSync('./consumer.log', linea);
};
module.exports={registrarLog};