export interface Filtros {
  agruparPor: 'MES' | 'TIPO' | 'AMBOS';
  estado: 'TODOS' | 'PASADOS' | 'FUTUROS';
  tipo: string;
}

export interface Evento {
  titulo: string;
  fecha_hora: string;
  cantidad_inscriptos: number;
}

export interface GrupoReporte {
  llave_agrupacion: string;
  cantidad_de_eventos: number;
  total_inscriptos_acumulados: number;
  promedio_de_asistencia: number;
  eventos: Evento[];
}

export interface GraphQLResponse {
  data?: {
    reporteAsistencia: GrupoReporte[];
  };
  errors?: { message: string }[];
}