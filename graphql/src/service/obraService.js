import { findById } from "../repository/obraRepository.js";

export async function getObra(id) {
    return await findById(id);
}