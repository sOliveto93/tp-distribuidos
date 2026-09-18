import { usuarioResolver } from "./usuarioResolver.js";
import { obraResolver } from "./obraResolver.js";

export const resolvers = {
    ...usuarioResolver,
    ...obraResolver
};