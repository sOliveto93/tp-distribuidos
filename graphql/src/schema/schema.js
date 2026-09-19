import {buildSchema} from "graphql"
import { usuarioType } from "../types/usuarioType.js";
import { reporteType} from "../types/reporteType.js";
import { obraType} from "../types/obraType.js";
import { artistaType} from "../types/artistaType.js";
import { comentarioType} from "../types/comentarioType.js";
import {filtrosInputType} from "../types/input/filtrosInputType.js"
export const schema = buildSchema(`
    ${usuarioType}
    ${obraType}
    ${artistaType}
    ${comentarioType}
    
    ${reporteType}
    ${filtrosInputType}
    
    type Query{
        usuario(id:ID!): Usuario
        usuarios: [Usuario!]!
        obra(id: ID!): Obra
        obras(filtros:FiltrosObra):[Obra!]!
        reporteAsistencia(filtros: FiltrosReporte): [AgruparReporte!]!
        obtenerTiposEvento: [String] 
    }

`);