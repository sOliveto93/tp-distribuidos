import {buildSchema} from "graphql"
import { usuarioType,reporteType,filtrosInputType } from "../types/types.js"

export const schema = buildSchema(`
    ${usuarioType}
    ${reporteType}
    ${filtrosInputType}
    type Query{
        usuario(id:ID!): Usuario
        obra(id: ID!): Obra
        reporteAsistencia(filtros: FiltrosReporte): [AgruparReporte!]!
        obtenerTiposEvento: [String] 
    }

`);