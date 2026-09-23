import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Evento } from './types';
import { getEventos, eliminarEvento, inscribirseEvento, desinscribirseEvento } from './eventosService';
import './Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const navigate = useNavigate();


  const rolUsuarioActual: string = 'CURADOR';
  const idUsuarioActual = 7;
  const tienePermisosAdmin = rolUsuarioActual === 'ADMINISTRADOR' || rolUsuarioActual === 'CURADOR';

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

  // --- Lógica de Manejadores (Handlers) ---

  const handleEliminar = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseás eliminar este evento? Esta acción no se puede deshacer.')) {
      try {
        await eliminarEvento(id);
        setEventos(eventos.filter(e => e.id !== id));
        alert('Evento eliminado correctamente.');
      } catch (error) {
        console.error(error);
        alert('Hubo un error al eliminar el evento.');
      }
    }
  };

const handleInscribirse = async (idEvento: number) => {
    try {
      await inscribirseEvento(idEvento, idUsuarioActual);
      
      setEventos(eventos.map(e => 
        e.id === idEvento ? { 
          ...e, 
          cupoMax: (e.cupoMax || 1) - 1,
          usuarios: [...(e.usuarios || []), { id: idUsuarioActual }] 
        } : e
      ));
      alert('¡Inscripción exitosa!');
    } catch (error) {
      console.error(error);
      alert('Error al inscribirse.');
    }
  };

  const handleDesinscribirse = async (idEvento: number) => {
    if (window.confirm('¿Estás seguro de que querés cancelar tu inscripción a este evento?')) {
      try {
        await desinscribirseEvento(idEvento, idUsuarioActual);
        
        setEventos(eventos.map(e => 
          e.id === idEvento ? { 
            ...e, 
            cupoMax: (e.cupoMax || 0) + 1,
            usuarios: (e.usuarios || []).filter(u => u.id !== idUsuarioActual)
          } : e
        ));
        alert('Inscripción cancelada.');
      } catch (error) {
        console.error(error);
        alert('Hubo un error al cancelar la inscripción.');
      }
    }
  };

  return (
    <div className="eventos-container">
      <h2>Catálogo de Eventos</h2>
      <div className="eventos-grid">
        {eventos.map(e => {
          const fechaReal = e.fechaHora;
          const curadorReal = e.curador;
          const cupoReal = e.cupoMax;

          const estaInscripto = e.usuarios?.some(u => u.id === idUsuarioActual);

          return (
            <div key={e.id} className="evento-card">
              <h3>{e.titulo}</h3>
              <p className="evento-desc">{e.descripcion}</p>
              <div className="evento-details">
                <p><strong>Fecha:</strong> {formatearFecha(fechaReal)}</p>
                <p><strong>Duración:</strong> {e.duracion} min</p>
                <p><strong>Cupos disponibles:</strong> {cupoReal}</p>
                <p><strong>Curador:</strong> {curadorReal?.nombre || 'No asignado'}</p>
              </div>

              {/* Contenedor de Botones */}
              <div className="evento-acciones">
                <div className="acciones-publicas">
                  {!estaInscripto ? (
                    <button className="btn-inscribir" onClick={() => e.id && handleInscribirse(e.id)}>
                      Inscribirse
                    </button>
                    ) : (
                    <button className="btn-desinscribir" onClick={() => e.id && handleDesinscribirse(e.id)}>
                      Desinscribirse
                    </button>
                  )}
                </div>

                {/* Botones protegidos solo para Admin/Curador */}
                {tienePermisosAdmin && (
                  <div className="acciones-privadas">
                    <button className="btn-editar" onClick={() => navigate(`/editar-evento/${e.id}`)}>Editar</button>
                    <button className="btn-eliminar" onClick={() => e.id && handleEliminar(e.id)}>Eliminar</button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {eventos.length === 0 && <p className="no-eventos">No hay eventos registrados.</p>}
      </div>
    </div>
  );
}