import { findById,findAll } from "../repository/obraRepository.js";

export async function getObra(id) {
    return await findById(id);
}
export async function getCatalogo(filtros) {
    return await findAll(filtros);
}