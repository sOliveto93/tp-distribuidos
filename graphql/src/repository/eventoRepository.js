
export const obtenerEventosPorFiltros = async (filtros, db) => {
  let querySql = `
    SELECT 
      e.id, 
      e.titulo, 
      e.fecha_hora, 
      e.tipo, 
      DATE_FORMAT(e.fecha_hora, '%Y-%m') AS mes,
      COUNT(eu.id) AS cantidad_inscriptos
    FROM eventos e
    LEFT JOIN evento_usuario eu ON e.id = eu.id_evento
    WHERE 1=1
  `;
  
  const queryParams = [];

  if (filtros) {
    if (filtros.fechaInicio) {
      querySql += ` AND e.fecha_hora >= ?`;
      queryParams.push(filtros.fechaInicio);
    }
    if (filtros.fechaFin) {
      querySql += ` AND e.fecha_hora <= ?`;
      queryParams.push(filtros.fechaFin);
    }
    if (filtros.tipo) {
      querySql += ` AND e.tipo = ?`;
      queryParams.push(filtros.tipo);
    }
    if (filtros.estado === 'PASADOS') {
      querySql += ` AND e.fecha_hora < NOW()`;
    } else if (filtros.estado === 'FUTUROS') {
      querySql += ` AND e.fecha_hora >= NOW()`;
    }
  }

  querySql += ` GROUP BY e.id`;

  const [eventosObtenidos] = await db.query(querySql, queryParams);
  
  return eventosObtenidos;
};