import { useEffect, useState } from 'react';
import type { Evento } from './types';
import { getEventos } from './eventosService';

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);

  useEffect(() => {
    getEventos().then(setEventos).catch(console.error);
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', padding: '20px' }}>
      <h2>Catálogo de Eventos</h2>
      <div style={{ display: 'grid', gap: '15px' }}>
        {eventos.map(e => (
          <div key={e.id} style={{ border: '1px solid #555', padding: '15px', borderRadius: '5px' }}>
            <h3>{e.titulo}</h3>
            <p>{e.descripcion}</p>
            <p><strong>Fecha:</strong> {new Date(e.fecha_hora).toLocaleString()} | <strong>Duración:</strong> {e.duracion} min</p>
            <p><strong>Cupo:</strong> {e.cupo_maximo} | <strong>Curador:</strong> {e.curador_responsable?.nombre}</p>
          </div>
        ))}
        {eventos.length === 0 && <p>No hay eventos registrados.</p>}
      </div>
    </div>
  );
}