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

const QUERY_TIPOS = `
  query {
    obtenerTiposEvento
  }
`;
export const traerReporte = async (filtros: Filtros): Promise<GrupoReporte[]> => {
  const respuesta = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: QUERY_REPORTE,
      variables: { filtros }
    })
  });

  const datos: GraphQLResponse = await respuesta.json();

  if (datos.errors) {
    throw new Error(datos.errors[0].message);
  }

  return datos.data?.reporteAsistencia || [];
};

export const traerTiposEvento = async (): Promise<string[]> => {
  const respuesta = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      query: QUERY_TIPOS
    })
  });

  const datos = await respuesta.json();

  if (datos.errors) {
    throw new Error(datos.errors[0].message);
  }

  return datos.data?.obtenerTiposEvento || [];
};