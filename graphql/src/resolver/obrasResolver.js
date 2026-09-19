import { getObra ,getCatalogo} from "../service/obraService.js"

export const obrasResolver = {
    obra: async({id},context)=>{
        return await getObra(id,context.db);
    },
    obras:async({filtros},context)=>{
        return await getCatalogo(filtros,context.db);
    }
}
