import React, { useState } from 'react';
import { generarRecorrido } from '../services/recorridoService.ts';
import type { Obra } from '../types/types';
import './Recorridos.css';

const RecorridosPage: React.FC = () => {
    const [epoca, setEpoca] = useState('');
    const [tecnica, setTecnica] = useState('');
    const [cantidad, setCantidad] = useState(5);
    
    const [recorrido, setRecorrido] = useState<Obra[]>([]);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setCargando(true);
        setError('');

        try {
            const data = await generarRecorrido({ epoca, tecnica, cantidad_obras: cantidad });
            setRecorrido(data.obrasList || []);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Ocurrió un error inesperado');
            }
        } finally {
            setCargando(false);
        }
    };

    return (
        <div className="recorridos-container">
            <h2>Generar Recorrido Personalizado</h2>
            
            <form onSubmit={handleSubmit} className="recorridos-form">
                <div className="form-group">
                    <label>Época o Movimiento:</label>
                    <input 
                        type="text" 
                        value={epoca} 
                        onChange={(e) => setEpoca(e.target.value)} 
                        placeholder="Ej: Renacimiento"
                    />
                </div>
                <div className="form-group">
                    <label>Técnica:</label>
                    <input 
                        type="text" 
                        value={tecnica} 
                        onChange={(e) => setTecnica(e.target.value)} 
                        placeholder="Ej: Óleo"
                    />
                </div>
                <div className="form-group">
                    <label>Cantidad de obras (aprox):</label>
                    <input 
                        type="number" 
                        value={cantidad} 
                        onChange={(e) => setCantidad(Number(e.target.value))} 
                        min="1"
                    />
                </div>
                <button type="submit" disabled={cargando}>
                    {cargando ? 'Generando...' : 'Generar Recorrido'}
                </button>
            </form>

            {error && <p className="error-msg">{error}</p>}

            <div className="recorridos-resultados">
                {recorrido.length > 0 ? (
                    <div>
                        <h3>Tu recorrido sugerido:</h3>
                        <div className="cards-grid">
                            {recorrido.map((obra, index) => (
                                <div key={obra.id} className="obra-card">
                                    <h4>Parada {index + 1}: {obra.titulo}</h4>
                                    <p><strong>Artista:</strong> {obra.artista.nombre}</p>
                                    <p><strong>Época:</strong> {obra.epoca}</p>
                                    <p><strong>Técnica:</strong> {obra.tecnica}</p>
                                    <p className="ubicacion-texto">📍 Ubicación: {obra.ubicacion}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p>Completá los filtros para generar tu recorrido.</p>
                )}
            </div>
        </div>
    );
};

export default RecorridosPage;