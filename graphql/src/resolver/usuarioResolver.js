import { getUsuario,getAll } from "../service/usuarioService.js"

export const usuarioResolver = {
    usuario: async({id})=>{
        return await getUsuario(id);
    },
    usuarios: async()=>{
        return await getAll();
    }
}