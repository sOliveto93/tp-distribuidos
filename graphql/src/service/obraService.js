import { findById } from "../repository/obraRepository.js";

export async function getObra(id,bd) {
    return await findById(id,bd);
}
export async function getCatalogo(filtros,db) {
    //return await findCatalogo(filtros,db);
}