import {Op} from "sequelize";
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
export async function findAll(filtros={}){
    const  {palabraClave, epoca,tecnica, ubicacion, disponible} = filtros;

    const condiciones=[];

     if (palabraClave) {
        condiciones.push({
            [Op.or]: [
                {
                    titulo: {
                        [Op.like]: `%${palabraClave}%`
                    }
                },
                {
                    descripcion: {
                        [Op.like]: `%${palabraClave}%`
                    }
                },
                {
                    "$artista.nombre$": {
                        [Op.like]: `%${palabraClave}%`
                    }
                }
            ]
        });
    }
    if (epoca) {
        condiciones.push({
            epoca: {
                [Op.like]: `%${epoca}%`
            }
        });
    }
    if (tecnica) {
        condiciones.push({
            tecnica: {
                [Op.like]: `%${tecnica}%`
            }
        });
    }

    if (ubicacion) {
        condiciones.push({
            ubicacion: {
                [Op.like]: `%${ubicacion}%`
            }
        });
    }

    if (disponible !== undefined) {
        condiciones.push({
            disponible
        });
    }
    return await Obra.findAll({
        where: {
            [Op.and]: condiciones
        },

        attributes: [
            "id",
            "titulo",
            "descripcion",
            "anio_creacion",
            "epoca",
            "tecnica",
            "ubicacion",
            "disponible",
            "imagen_url",
            "dimensiones"
        ],

        include: [
            {
                model: Artista,
                as: "artista",
                attributes: [
                    "id",
                    "nombre",
                    "biografia"
                ]
            },
            {
                model: Comentario,
                as: "comentarios",
                attributes: [
                    "id",
                    "fecha",
                    "texto"
                ],
                include: [
                    {
                        model: Usuario,
                        as: "usuario",
                        attributes: [
                            "id",
                            "nombre",
                            "email"
                        ]
                    }
                ]
            }
        ]
    });

}