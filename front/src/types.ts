export interface Filtros {
  agruparPor: 'MES' | 'TIPO' | 'AMBOS';
  estado: 'TODOS' | 'PASADOS' | 'FUTUROS';
  tipo: string;
  fechaInicio:string;
  fechaFin:string;
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

export interface UsuarioCurador {
  id: number;
  nombre: string;
}

export interface Evento {
  id?: number;
  titulo: string;
  descripcion: string;
  fecha_hora: string;
  duracion: number;
  cupo_maximo: number;
  curador_responsable: UsuarioCurador;
}