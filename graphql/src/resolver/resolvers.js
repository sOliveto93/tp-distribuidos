import { obrasResolver } from "../obras/resolver/obrasResolver.js";
import { reportesResolvers } from "../reportes/resolver/reportesResolver.js";

export const resolvers = {
    
    ...obrasResolver,
    ...reportesResolvers
};