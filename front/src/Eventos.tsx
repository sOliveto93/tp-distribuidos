import { useEffect, useState } from 'react';
import type { Evento } from './types';
import { getEventos } from './eventosService';
import './Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    getEventos().then(setEventos).catch(console.error);
  }, []);

  const formatearFecha = (fecha: string | number[] | undefined) => {
    if (!fecha) return 'Sin fecha';
    if (Array.isArray(fecha)) {
      const [year, month, day, hour = 0, minute = 0] = fecha;
      return new Date(year, month - 1, day, hour, minute).toLocaleString();
    }
    const parsed = new Date(fecha);
    return isNaN(parsed.getTime()) ? 'Fecha inválida' : parsed.toLocaleString();
  };

  return (
    <div className="eventos-container">
      <h2>Catálogo de Eventos</h2>
      <div className="eventos-grid">
        {eventos.map(e => {
          console.log("Datos del evento:", e);
          const fechaReal = e.fechaHora;
          const curadorReal = e.curador;
          const cupoReal = e.cupoMax;

          return (
            <div key={e.id} className="evento-card">
              <h3>{e.titulo}</h3>
              <p className="evento-desc">{e.descripcion}</p>
              <div className="evento-details">
                <p><strong>Fecha:</strong> {formatearFecha(fechaReal)}</p>
                <p><strong>Duración:</strong> {e.duracion} min</p>
                <p><strong>Cupo:</strong> {cupoReal}</p>
                <p><strong>Curador:</strong> {curadorReal?.nombre || 'No asignado'}</p>
              </div>
            </div>
          );
        })}
        {eventos.length === 0 && <p className="no-eventos">No hay eventos registrados.</p>}
      </div>
    </div>
  );
}