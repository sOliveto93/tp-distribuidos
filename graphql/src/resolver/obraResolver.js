import { getObra } from "../service/obraService.js"


export const rootResolvers = {
    // 1. Tus funciones viejas que ya tenías escritas:
    usuario: async ({ id }, context) => {
        // ... tu código existente para traer un usuario
    },
    obra: async ({ id }, context) => {
        // ... tu código existente para traer una obra individual
    },

    // 2. PEGÁ EL NUEVO CÓDIGO ACÁ ABAJO (dentro del mismo objeto principal):
    buscarObras: async ({ filtros }, context) => {
        const db = context.db; 

        let querySql = `
          SELECT o.* FROM obras o
          LEFT JOIN artistas a ON o.id_artista = a.id
          WHERE 1=1
        `;
        const queryParams = [];

        if (filtros) {
          if (filtros.palabraClave) {
            querySql += ` AND (o.titulo LIKE ? OR o.descripcion LIKE ? OR a.nombre LIKE ?)`;
            const termino = `%${filtros.palabraClave}%`;
            queryParams.push(termino, termino, termino);
          }
          if (filtros.epoca) {
            querySql += ` AND o.epoca = ?`;
            queryParams.push(filtros.epoca);
          }
          if (filtros.tecnica) {
            querySql += ` AND o.tecnica = ?`;
            queryParams.push(filtros.tecnica);
          }
          if (filtros.ubicacion) {
            querySql += ` AND o.ubicacion = ?`;
            queryParams.push(filtros.ubicacion);
          }
          if (filtros.disponible !== undefined) {
            querySql += ` AND o.disponible = ?`;
            queryParams.push(filtros.disponible ? 1 : 0);
          }
        }

        const [rows] = await db.query(querySql, queryParams);
        
        return rows.map(async (obra) => {
          const [artistas] = await db.query('SELECT * FROM artistas WHERE id = ?', [obra.id_artista]);
          const [comentarios] = await db.query('SELECT * FROM comentarios WHERE id_obra = ?', [obra.id]);
          
          const comentariosConUsuario = comentarios.map(async (comentario) => {
            const [usuarios] = await db.query('SELECT id, nombre, email FROM usuarios WHERE id = ?', [comentario.id_usuario]);
            return {
              ...comentario,
              usuario: usuarios[0] || null
            };
          });

          return {
            ...obra,
            disponible: obra.disponible === 1,
            artista: artistas[0] || null,
            comentarios: await Promise.all(comentariosConUsuario)
          };
        });
    }
};
