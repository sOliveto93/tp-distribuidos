import {buildSchema} from "graphql"
import { usuarioType } from "../types/types.js"


export const schema = buildSchema(`
    ${usuarioType}
    ${artistaType}
    ${comentarioType}
    ${obraType}
    ${filtrosInputType}

    type Query {
        usuario(id: ID!): Usuario
        obra(id: ID!): Obra
        
        # El nuevo requerimiento: catálogo flexible y dinámico
        buscarObras(filtros: FiltrosObraInput): [Obra!]!
    }
`);
