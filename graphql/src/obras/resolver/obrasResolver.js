import { getObra ,getCatalogo} from "../service/obraService.js"

export const obrasResolver = {
    obra: async({id},context)=>{
        //console.log("CONTEXT:", context);
       
        return await getObra(id);
    },
    obras:async({filtros},context)=>{
       
        return await getCatalogo(filtros);
    }
}
