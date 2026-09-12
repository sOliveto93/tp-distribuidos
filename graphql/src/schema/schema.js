import {buildSchema} from "graphql"
import { usuarioType } from "../types/types.js"

export const schema = buildSchema(`
    ${usuarioType}
    type Query{
        usuario(id:ID!): Usuario
        obra(id: ID!): Obra
    }
    
`);