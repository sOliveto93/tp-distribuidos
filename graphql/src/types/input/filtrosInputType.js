export const filtrosInputType = `
    input FiltrosReporte {
        fechaInicio: String
        fechaFin: String
        tipo: String
        estado: String
        agruparPor: String
    }
    input FiltrosObra {
        palabraClave: String
        epoca: String
        tecnica: String
        ubicacion: String
        disponible: Boolean
    }
`;