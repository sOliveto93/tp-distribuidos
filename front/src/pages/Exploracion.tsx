import { useState } from 'react';
import type { DatosExploracion } from '../types/types';
import { fetchExploracion } from '../services/ExploracionService';
import './Exploracion.css';

export default function Exploracion() {
    const [movimiento, setMovimiento] = useState('');
    const [datos, setDatos] = useState<DatosExploracion | null>(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const buscarExploracion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!movimiento.trim()) return;

        setCargando(true);
        setError('');
        
        try {
            const data = await fetchExploracion(movimiento);
            setDatos(data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error al conectar con el servidor');
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="exploracion-container">
            <h2>Exploración Avanzada del Museo</h2>
            
            <form onSubmit={buscarExploracion} className="exploracion-form">
                <input 
                    type="text" 
                    placeholder="Ej: Renacimiento, Cubismo..."
                    value={movimiento}
                    onChange={(e) => setMovimiento(e.target.value)}
                    className="exploracion-input"
                />
                <button type="submit" className="exploracion-btn">
                    Explorar
                </button>
            </form>

            {cargando && <p>Buscando en los servicios...</p>}
            {error && <p className="exploracion-error">{error}</p>}

            {datos && (
                <div className="exploracion-resultados">
                    <h3>Resultados para: {datos.movimiento_explorado}</h3>
                    
                    <div className="exploracion-columnas">
                        <div className="exploracion-columna">
                            <h4>Obras ({datos.obras_pertenecientes.length})</h4>
                            <ul>
                                {datos.obras_pertenecientes.map((obra) => (
                                    <li key={obra.id}>{obra.titulo} - {obra.tecnica}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="exploracion-columna">
                            <h4>Artistas Asociados</h4>
                            <ul>
                                {datos.artistas_asociados.map((artista, index) => (
                                    <li key={index}>{artista}</li>
                                ))}
                            </ul>
                        </div>

                        <div className="exploracion-columna">
                            <h4>Eventos Vinculados ({datos.eventos_vinculados.length})</h4>
                            <ul>
                                {datos.eventos_vinculados.map((evento) => (
                                    <li key={evento.id}>{evento.nombre} ({evento.tipo})</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};