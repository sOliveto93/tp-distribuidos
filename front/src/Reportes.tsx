import { useState } from 'react';
import './Reportes.css';

interface Filtros {
  agruparPor: 'MES' | 'TIPO' | 'AMBOS';
  estado: 'TODOS' | 'PASADOS' | 'FUTUROS';
  tipo: string;
}

interface Evento {
  titulo: string;
  fecha_hora: string;
  cantidad_inscriptos: number;
}

interface GrupoReporte {
  llave_agrupacion: string;
  cantidad_de_eventos: number;
  total_inscriptos_acumulados: number;
  promedio_de_asistencia: number;
  eventos: Evento[];
}

interface GraphQLResponse {
  data?: {
    reporteAsistencia: GrupoReporte[];
  };
  errors?: { message: string }[];
}


export default function PanelReportes() {
  const [reporte, setReporte] = useState<GrupoReporte[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    agruparPor: 'MES',
    estado: 'TODOS',
    tipo: ''
  });

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

  const generarReporte = async () => {
    try {
      const respuesta = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          //'Authorization': `Bearer ${localStorage.getItem('token')}`         
        },
        body: JSON.stringify({
          query: QUERY_REPORTE,
          variables: { filtros }
        })
      });

      const datos: GraphQLResponse = await respuesta.json();

      if (datos.errors) {
        alert(datos.errors[0].message);
        return;
      }

      if (datos.data) {
        setReporte(datos.data.reporteAsistencia);
      }
    } catch (error) {
      console.error("Error al traer el reporte", error);
    }
  };

  return (
    <div className="panel-container">
      <h2>Reporte de estadisticas de eventos</h2>
      
      <div className="filtros-container">
        <select 
          value={filtros.agruparPor} 
          onChange={(e) => setFiltros({...filtros, agruparPor: e.target.value as Filtros['agruparPor']})}
        >
          <option value="MES">Agrupar por Mes</option>
          <option value="TIPO">Agrupar por Tipo</option>
          <option value="AMBOS">Mes y Tipo</option>
        </select>

        <select 
          value={filtros.estado} 
          onChange={(e) => setFiltros({...filtros, estado: e.target.value as Filtros['estado']})}
        >
          <option value="TODOS">Cualquier estado</option>
          <option value="PASADOS">Ya ocurrieron</option>
          <option value="FUTUROS">Por ocurrir</option>
        </select>

        <button onClick={generarReporte}>Generar Reporte</button>
      </div>

      <div>
        {reporte.map((grupo) => (
          <div key={grupo.llave_agrupacion} className="grupo-card">
            <h3>{grupo.llave_agrupacion}</h3>
            <p><strong>Total Eventos:</strong> {grupo.cantidad_de_eventos}</p>
            <p><strong>Total Inscriptos:</strong> {grupo.total_inscriptos_acumulados}</p>
            <p><strong>Promedio Asistencia:</strong> {grupo.promedio_de_asistencia.toFixed(2)}</p>
            
            <h4>Detalle de eventos:</h4>
            <ul>
              {grupo.eventos.map((ev, index) => (
                <li key={`${ev.titulo}-${index}`}>
                  {ev.titulo} - {ev.cantidad_inscriptos} inscriptos
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}