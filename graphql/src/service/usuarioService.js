import { findById ,findAll} from "../repository/usuarioRepository.js";

export async function getUsuario(id) {
    return await findById(id);
}
export async function getAll(){
    return await findAll();
}