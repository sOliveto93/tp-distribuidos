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