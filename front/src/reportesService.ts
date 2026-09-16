import type{ Filtros, GraphQLResponse, GrupoReporte } from './types';

// Definimos la query de GraphQL
const QUERY_REPORTE = `
  query ObtenerReporte($filtros: FiltrosReporte) {
    reporteAsistencia(filtros: $filtros) {
      llave_agrupacion
      cantidad_de_eventos
      total_inscriptos_acumulados
      promedio_de_asistencia
      eventos {
        titulo
        fecha_hora
        cantidad_inscriptos
      }
    }
  }
`;

export const traerReporte = async (filtros: Filtros): Promise<GrupoReporte[]> => {
  const respuesta = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}` // Descomentar cuando uses JWT
    },
    body: JSON.stringify({
      query: QUERY_REPORTE,
      variables: { filtros }
    })
  });

  const datos: GraphQLResponse = await respuesta.json();

  // Si el backend (tu resolver) tira un error de "No autorizado" u otro, lo atrapamos acá
  if (datos.errors) {
    throw new Error(datos.errors[0].message);
  }

  // Devolvemos la data lista para usar. Si viene vacía, devolvemos un array vacío.
  return datos.data?.reporteAsistencia || [];
};