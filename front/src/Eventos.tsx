import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Evento, FiltroFavorito } from './types';
import { 
  getEventos, eliminarEvento, inscribirseEvento, desinscribirseEvento,
  getFiltrosFavoritos, guardarFiltroFavorito, eliminarFiltroFavorito
} from './eventosService';
import './Eventos.css';

export default function Eventos() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [filtros, setFiltros] = useState({ fecha: '', tipo: '', idCurador: '' });
  const [favoritos, setFavoritos] = useState<FiltroFavorito[]>([]);
  const [nombreFavorito, setNombreFavorito] = useState('');

  const navigate = useNavigate();

  const rolUsuarioActual = localStorage.getItem('rol') || '';
  const idUsuarioActual = Number(localStorage.getItem('id')) || 0;
  const tienePermisosAdmin = rolUsuarioActual === 'ADMINISTRADOR' || rolUsuarioActual === 'CURADOR';
  
  const aplicarFiltros = (filtrosEspecificos?: { fecha: string; tipo: string; idCurador: string }) => {
    const filtrosAUso = filtrosEspecificos || filtros; 
    
    const filtrosProcesados = {
      fecha: filtrosAUso.fecha || undefined,
      tipo: filtrosAUso.tipo || undefined,
      idCurador: filtrosAUso.idCurador ? Number(filtrosAUso.idCurador) : undefined
    };
    getEventos(filtrosProcesados).then(setEventos).catch(console.error);
  };

  const cargarFavoritos = () => {
    getFiltrosFavoritos(idUsuarioActual).then(setFavoritos).catch(console.error);
  };

  useEffect(() => {
    aplicarFiltros();
    cargarFavoritos();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
  };

  const handleAplicarFavorito = (fav: FiltroFavorito) => {
    try {
      const config = typeof fav.configuracionFiltros === 'string' 
        ? JSON.parse(fav.configuracionFiltros) 
        : (fav.configuracionFiltros || {});
        
      const nuevosFiltros = {
        fecha: config.fecha || '',
        tipo: config.tipo || '',
        idCurador: config.idCurador ? String(config.idCurador) : ''
      };
      
      setFiltros(nuevosFiltros);
      aplicarFiltros(nuevosFiltros);
    } catch (e) {
      console.error("Error interno:", e);
      alert('Uy, parece que este filtro se guardó mal o está dañado. Te recomiendo borrarlo (X) y crearlo de nuevo.');
    }
  };

  const handleGuardarFavorito = async () => {
    if (!nombreFavorito.trim()) {
      alert('Ingresá un nombre para guardar el filtro');
      return;
    }
    try {
      await guardarFiltroFavorito(idUsuarioActual, {
        nombre: nombreFavorito,
        configuracionFiltros: {
          fecha: filtros.fecha,
          tipo: filtros.tipo,
          idCurador: filtros.idCurador
        },
        usuario: { id: idUsuarioActual } 
      });
      
      alert('Filtro guardado con éxito');
      setNombreFavorito('');
      cargarFavoritos();
    } catch (error) {
      console.error(error);
      alert('Error al guardar el filtro favorito.');
    }
  };

  const handleEliminarFavorito = async (idFiltro: number) => {
    if (window.confirm('¿Eliminar este filtro favorito?')) {
      try {
        await eliminarFiltroFavorito(idUsuarioActual, idFiltro);
        cargarFavoritos();
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el filtro');
      }
    }
  };

  const formatearFecha = (fecha: string | number[] | undefined) => {
    if (!fecha) return 'Sin fecha';
    if (Array.isArray(fecha)) {
      const [year, month, day, hour = 0, minute = 0] = fecha;
      return new Date(year, month - 1, day, hour, minute).toLocaleString();
    }
    const parsed = new Date(fecha);
    return isNaN(parsed.getTime()) ? 'Fecha inválida' : parsed.toLocaleString();
  };

  const formatearTipo = (tipo?: string) => {
    const diccionario: Record<string, string> = {
      'VISITA_GUIADA': 'Visita Guiada',
      'CHARLA': 'Charla',
      'EXPOSICION': 'Exposición'
    };
    return tipo ? diccionario[tipo] || tipo : 'No especificado';
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

      {/* Barra de Filtros */}
      <div className="filtros-container">
        <input 
          type="date" 
          name="fecha" 
          value={filtros.fecha} 
          onChange={handleFiltroChange} 
          className="filtro-input"
        />
        
        <select 
          name="tipo" 
          value={filtros.tipo} 
          onChange={handleFiltroChange}
          className="filtro-input"
        >
          <option value="">Todos los tipos</option>
          <option value="VISITA_GUIADA">Visita Guiada</option>
          <option value="CHARLA">Charla</option>
          <option value="EXPOSICION">Exposición</option>
        </select>

        <input 
          type="number" 
          name="idCurador" 
          placeholder="ID del Curador" 
          value={filtros.idCurador} 
          onChange={handleFiltroChange}
          className="filtro-input"
        />

        <button onClick={() => aplicarFiltros()} className="btn-filtrar">
          Filtrar
        </button>
        
        <button 
          onClick={() => { setFiltros({ fecha: '', tipo: '', idCurador: '' }); getEventos().then(setEventos); }} 
          className="btn-limpiar"
        >
          Limpiar
        </button>
      </div>

      {/* Sección de Filtros Favoritos */}
      <div className="favoritos-container">
        <div className="favoritos-input-group">
          <input 
            type="text" 
            placeholder="Nombre para guardar filtro actual" 
            value={nombreFavorito} 
            onChange={(e) => setNombreFavorito(e.target.value)}
            className="favorito-input"
          />
          <button onClick={handleGuardarFavorito} className="btn-guardar-favorito">
            Guardar Favorito
          </button>
        </div>

        {favoritos.length > 0 && (
          <div>
            <h4 className="favoritos-titulo">Mis Filtros Guardados:</h4>
            <div className="favoritos-lista">
              {favoritos.map(fav => (
                <div key={fav.id} className="favorito-item">
                  <span className="favorito-nombre" onClick={() => handleAplicarFavorito(fav)}>
                    {fav.nombre}
                  </span>
                  <button onClick={() => fav.id && handleEliminarFavorito(fav.id)} className="btn-eliminar-favorito">
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

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
                <p><strong>Tipo:</strong> {formatearTipo(e.tipo)}</p>
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