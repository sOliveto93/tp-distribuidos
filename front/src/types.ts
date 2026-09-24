export interface Filtros {
  agruparPor: 'MES' | 'TIPO' | 'AMBOS';
  estado: 'TODOS' | 'PASADOS' | 'FUTUROS';
  tipo: string;
  fechaInicio:string;
  fechaFin:string;
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
  email?: string; 
  rol?: string;   
}

export interface Evento {
  id?: number;
  titulo: string;
  descripcion?: string;
  tipo?: string;
  duracion?: number;
  fechaHora?: string;
  cupoMax?: number;
  curador?: UsuarioCurador;
  fecha_hora?: string;
  cupo_maximo?: number;
  curador_responsable?: UsuarioCurador;
  cantidad_inscriptos?: number;
  usuarios?: { id: number; nombre?: string }[];
}

export interface FiltroFavorito {
  id?: number;
  nombre: string;
  descripcion?: string;
  configuracionFiltros?: { fecha?: string; tipo?: string; idCurador?: string | number };
  fecha?: string;
  tipo?: string;
  idCurador?: number | null;
  usuario?: { id: number };
}