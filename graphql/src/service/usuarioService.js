import { findById } from "../repository/usuarioRepository.js";

export async function getUsuario(id) {
    return await findById(id);
}