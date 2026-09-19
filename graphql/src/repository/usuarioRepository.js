import Usuario from "../models/usuario.js"

export async function findById(id){
    return await Usuario.findByPk(id,{
        attributes:["id","nombre","email"]
    });
}
export async function findAll(){
    return await Usuario.findAll();
}



/*
export async function findById(id,db) {
    const [rows] = await db.execute(
        `SELECT id, nombre, email
        FROM usuarios
        WHERE id = ?`,
        [id]
    );

    return rows[0] ?? null;
}*/