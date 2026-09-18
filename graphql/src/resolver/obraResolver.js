import { getObra } from "../service/obraService.js"
export const obraResolver = {
    obra: async({id})=>{
        return await getObra(id);
    }
}