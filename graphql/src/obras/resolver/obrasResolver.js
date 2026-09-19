import { getObra ,getCatalogo} from "../service/obraService.js"

export const obrasResolver = {
    obra: async({id})=>{
        return await getObra(id);
    },
    obras:async({filtros})=>{
        return await getCatalogo(filtros);
    }
}
