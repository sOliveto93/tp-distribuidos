import mysql from "mysql2";

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if (error) {
        console.error("Error conectando a MySQL:", error.message);
        return;
    }

    console.log("Conectado a MySQL");
});

export default connection;