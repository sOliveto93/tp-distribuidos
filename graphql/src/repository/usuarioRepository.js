import connection from "../config/database.js";

export async function findById(id) {
    const [rows] = await connection.execute(
        `SELECT id, nombre, email
        FROM usuarios
        WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}