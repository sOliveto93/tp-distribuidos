export const reportesResolvers = {
  reporteAsistencia: async ({ filtros }, context) => {
    //if (context.usuario.rol !== 'CURADOR' && context.usuario.rol !== 'ADMINISTRADOR') throw new Error("No autorizado");

    const db = context.db;

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
  
    const tiposAgrupacion={
      'MES':(evento)=>evento.mes,
      'TIPO':(evento)=>evento.tipo.replaceAll('_', ' '),
      'AMBOS':(evento)=>`${evento.mes} - ${evento.tipo.replaceAll('_', ' ')}`
    }
    const gruposMapa = {};
    const agrupacionKey = tiposAgrupacion[filtros?.agruparPor] || tiposAgrupacion['MES'];//Agrupar por mes (por defecto)
    eventosObtenidos.forEach(evento => {
      let llave = agrupacionKey(evento)
      //Si no existe el grupo de mes, tipo o ambos, lo crea
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

    //Formatear para que coincida con el schema
      return {
        ...grupo,
        cantidad_de_eventos,
        promedio_de_asistencia: cantidad_de_eventos === 0 ? 0 : (grupo.total_inscriptos_acumulados / cantidad_de_eventos),
      };
    });

    // Ordena los grupos para que el mes o tipo con más inscriptos aparezca primero
    return reporteFinal.sort((a, b) => b.total_inscriptos_acumulados - a.total_inscriptos_acumulados);
  }
};