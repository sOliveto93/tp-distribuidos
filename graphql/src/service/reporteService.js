import { obtenerEventosPorFiltros ,obtenerTiposEvento } from '../repository/eventoRepository.js';

export const listarTiposEvento = async (db) => {
  return await obtenerTiposEvento(db);
};

export const generarReporteAsistencia = async (filtros, db) => {

  const eventosObtenidos = await obtenerEventosPorFiltros(filtros, db);

  const tiposAgrupacion = {
    'MES': (evento) => evento.mes,
    'TIPO': (evento) => evento.tipo.replaceAll('_', ' '),
    'AMBOS': (evento) => `${evento.mes} - ${evento.tipo.replaceAll('_', ' ')}`
  };

  const gruposMapa = {};
  const agrupacionKey = tiposAgrupacion[filtros?.agruparPor] || tiposAgrupacion['MES'];

  eventosObtenidos.forEach(evento => {
    let llave = agrupacionKey(evento);
    
    if (!gruposMapa[llave]) {
      gruposMapa[llave] = {
        llave_agrupacion: llave,
        eventos: [],
        total_inscriptos_acumulados: 0
      };
    }

    gruposMapa[llave].eventos.push(evento);
    gruposMapa[llave].total_inscriptos_acumulados += evento.cantidad_inscriptos;
  });


  const reporteFinal = Object.values(gruposMapa).map(grupo => {
    const cantidad_de_eventos = grupo.eventos.length;
    return {
      ...grupo,
      cantidad_de_eventos,
      promedio_de_asistencia: cantidad_de_eventos === 0 ? 0 : (grupo.total_inscriptos_acumulados / cantidad_de_eventos),
    };
  });

  return reporteFinal.sort((a, b) => b.total_inscriptos_acumulados - a.total_inscriptos_acumulados);
};