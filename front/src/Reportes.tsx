import { useState } from 'react';
import './Reportes.css';
import type{ Filtros, GrupoReporte } from './types';
import { traerReporte } from './reportesService';


export default function PanelReportes() {
  const [reporte, setReporte] = useState<GrupoReporte[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    agruparPor: 'MES',
    estado: 'TODOS',
    tipo: ''
  });


  const generarReporte = async () => {
    try {
      const datos = await traerReporte(filtros);
      setReporte(datos);
    } catch (error) {
      if (error instanceof Error) {
        console.error("Error al traer el reporte:", error.message);
      } else {
        console.error("Error desconocido:", error);
      }
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