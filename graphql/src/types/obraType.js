export const obraType=`
    type Obra {
        id: ID!
        titulo: String!
        descripcion: String
        anio_creacion: String
        epoca: String
        tecnica: String
        ubicacion: String
        disponible: Boolean
        imagen_url: String
        dimensiones: String
        artista: Artista
        comentarios: [Comentario!]!
    }`;