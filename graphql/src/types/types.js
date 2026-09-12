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

// Agregá esto al final de tu archivo types.js (y acordate de exportarlos)
export const artistaType = `
  type Artista {
    id: ID!
    nombre: String!
    biografia: String
  }
`;

export const comentarioType = `
  type Comentario {
    id: ID!
    fecha: String!
    texto: String!
    usuario: Usuario!
  }
`;

export const obraType = `
  type Obra {
    id: ID!
    titulo: String!
    descripcion: String
    anio_creacion: String
    epoca: String
    tecnica: String
    ubicacion: String
    disponible: Boolean!
    imagen_url: String
    dimensiones: String
    artista: Artista!
    comentarios: [Comentario!]!
  }
`;

export const filtrosInputType = `
  input FiltrosObraInput {
    palabraClave: String
    epoca: String
    tecnica: String
    ubicacion: String
    disponible: Boolean
  }
`;
