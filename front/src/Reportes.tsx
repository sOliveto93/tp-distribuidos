import { useState, useEffect } from 'react';
import './Reportes.css';
import type{ Filtros, GrupoReporte } from './types';
import { traerReporte, traerTiposEvento } from './reportesService';


export default function PanelReportes() {
  const [reporte, setReporte] = useState<GrupoReporte[]>([]);
  const [filtros, setFiltros] = useState<Filtros>({
    agruparPor: 'MES',
    estado: 'TODOS',
    tipo: '',
    fechaInicio:'',
    fechaFin:''
  });
  const [tiposDisponibles, setTiposDisponibles] = useState<string[]>([]);
  useEffect(() => {
    const cargarTipos = async () => {
      try {
        const tipos = await traerTiposEvento();
        setTiposDisponibles(tipos);
      } catch (error) {
        console.error("No se pudieron cargar los tipos de evento", error);
      }
    };

    cargarTipos();
  }, []);

  const [busquedaRealizada, setBusquedaRealizada] = useState(false);
  
  const generarReporte = async () => {
    try {
      const datos = await traerReporte(filtros);
      setReporte(datos);
      setBusquedaRealizada(true);
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
        <div>
          <label>Desde: </label>
          <input 
            type="date" 
            value={filtros.fechaInicio} 
            onChange={(e) => setFiltros({...filtros, fechaInicio: e.target.value})}
          />
        </div>

        <div>
          <label>Hasta: </label>
          <input 
            type="date" 
            value={filtros.fechaFin} 
            onChange={(e) => setFiltros({...filtros, fechaFin: e.target.value})}
          />
        </div>
        <div>
          <select 
            value={filtros.tipo} 
            onChange={(e) => setFiltros({...filtros, tipo: e.target.value})}
          >
            <option value="">Todos los tipos</option>
            {tiposDisponibles.map((tipoBD) => (
              <option key={tipoBD} value={tipoBD}>
                {tipoBD.replaceAll('_', ' ')}
              </option>
            ))}
          </select>
        </div>
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

      {busquedaRealizada && reporte.length == 0 ? <div className="grupo-card">No se encuentran resultados</div>:<div>
        {reporte.map((grupo) => (
          <div key={grupo.llave_agrupacion} className="grupo-card">
            <h3>{grupo.llave_agrupacion}</h3>
            <p><strong>Total Eventos:</strong> {grupo.cantidad_de_eventos}</p>
            <p><strong>Total Inscriptos:</strong> {grupo.total_inscriptos_acumulados}</p>
            <p><strong>Promedio Asistencia:</strong> {grupo.promedio_de_asistencia.toFixed(2)}</p>
            
            <h4>Detalle de eventos:</h4>
            <ul>
              {grupo.eventos.map((ev, index) => {
                  const fechaObj = new Date(Number(ev.fecha_hora));
                  const fechaFormat= fechaObj.toLocaleString('es-AR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  });
                  return(
                 <li key={`${ev.titulo}-${index}`}>
                  {fechaFormat} - {ev.titulo} - {ev.cantidad_inscriptos} inscriptos
                </li>
              );
              })}
               </ul>
          </div>
        ))}      
      </div> } 
    </div>
  );
}