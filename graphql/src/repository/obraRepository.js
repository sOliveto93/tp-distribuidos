import Obra from "../models/obra.js";
import Artista from "../models/artista.js";
import Comentario from "../models/comentario.js";
import Usuario from "../models/usuario.js";

export async function findById(id) {

    return await Obra.findByPk(id, {
        include: [
            {
                model: Artista,
                as: "artista",
                attributes: ["id", "nombre", "biografia"]
            },
            {
                model: Comentario,
                as: "comentarios",
                attributes: ["id", "fecha", "texto"],
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: ["id", "nombre", "email"]
                    }
                ]
            }
        ]
    });
}