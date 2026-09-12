import { getUsuario } from "../service/usuarioService.js"
export const usuarioResolver = {
    usuario: async({id})=>{
        return await getUsuario(id);
    }
}