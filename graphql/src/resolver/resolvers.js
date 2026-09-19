import { usuarioResolver } from "./usuarioResolver.js";
import { obrasResolver } from "./obrasResolver.js";
import { reportesResolvers } from "./reportesResolver.js";

export const resolvers = {
    ...usuarioResolver,
    ...obrasResolver,
    ...reportesResolvers
};