import {buildSchema} from "graphql"
import { usuarioType } from "../types/types.js"

export const schema = buildSchema(`
    ${usuarioType}
    type Query{
        usuario(id:ID!): Usuario
        obra(id: ID!): Obra
        reporteAsistencia(filtros: FiltrosReporte): [AgruparReporte!]!
        obtenerTiposEvento: [String] #Obtener tipos evento de la BD
    }

    input FiltrosReporte {
        fechaInicio: String
        fechaFin: String
        tipo: String
        estado: String
        agruparPor: String
    }
    type EventoReporte {
        id: ID!
        titulo: String!
        fecha_hora: String!
        tipo: String!
        cantidad_inscriptos: Int!
    }

    type AgruparReporte {
        llave_agrupacion: String!
        cantidad_de_eventos: Int!
        total_inscriptos_acumulados: Int!
        promedio_de_asistencia: Float!
        eventos: [EventoReporte!]!
    }
`);