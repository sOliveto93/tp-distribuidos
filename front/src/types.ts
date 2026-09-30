export interface Filtros {
  agruparPor: 'MES' | 'TIPO' | 'AMBOS';
  estado: 'TODOS' | 'PASADOS' | 'FUTUROS';
  tipo: string;
  fechaInicio:string;
  fechaFin:string;
}

export interface FiltrosObra  {
        palabraClave?: string
        epoca?: string
        tecnica?: string
        ubicacion?: string
        disponible?: boolean
    
};
export interface Obra {
    id: string;
    titulo: string;
    descripcion: string;
    anio_creacion: string;
    epoca: string;
    tecnica: string;
    ubicacion: string;
    disponible: boolean;
    imagen_url: string;
    dimensiones: string;
    artista: Artista;
    comentarios: Comentario[];
}

export interface Artista {
    nombre: string;
    biografia: string;
}

export interface Comentario {
    id: string;
    fecha: string;
    texto: string;
    usuario: Usuario;
}

export interface Usuario {
    nombre: string;
}

/*export interface GrupoReporte {
  llave_agrupacion: string;
  cantidad_de_eventos: number;
  total_inscriptos_acumulados: number;
  promedio_de_asistencia: number;
  eventos: Evento[];
}*/

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

export interface ReporteExcelRequest {
    fecha: string;
    titulo: string;
    curador: string;
    inscriptos: number;
    cupoMax: number;
    tipo: string;
}
export interface EventoReporte {
  titulo: string;
  fecha_hora: string;
  cantidad_inscriptos: number;
  curador: string;
  cupo_max: number;
  tipo: string;
}
export interface GrupoReporte {
  llave_agrupacion: string;
  cantidad_de_eventos: number;
  total_inscriptos_acumulados: number;
  promedio_de_asistencia: number;
  eventos: EventoReporte[];
}