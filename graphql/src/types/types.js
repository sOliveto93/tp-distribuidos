export const usuarioType = `
    type Usuario {
        id:ID!
        nombre: String!
        email: String! 
    }
    type Artista {
        id: ID!
        nombre: String!
        biografia: String
    }
    type Obra {
        id: ID!
        titulo: String!
        descripcion: String
    }
`;
export const reporteType=`
    type EventoReporte {
        id: ID!
        titulo: String!
        fecha_hora: String!
        tipo: String!
        cantidad_inscriptos: Int!
    }
    type AgruparReporte {
        llave_agrupacion: String!
        cantidad_de_eventos: Int!
        total_inscriptos_acumulados: Int!
        promedio_de_asistencia: Float!
        eventos: [EventoReporte!]!
    }
`;
export const filtrosInputType=`
    input FiltrosReporte {
        fechaInicio: String
        fechaFin: String
        tipo: String
        estado: String
        agruparPor: String
    }
`;