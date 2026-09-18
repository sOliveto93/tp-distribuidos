import { usuarioResolver } from "./usuarioResolver.js";
import { obraResolver } from "./obraResolver.js";
import { reportesResolvers } from "./reportesResolver.js";

export const resolvers = {
    ...usuarioResolver,
    ...obraResolver,
    ...reportesResolvers
};