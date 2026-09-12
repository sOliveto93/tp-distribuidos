import connection from "../config/database.js";

export async function findById(id) {
    const [rows] = await connection.execute(
        `SELECT *
        FROM obras
        WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}