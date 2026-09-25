import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { crearEvento } from './eventosService';
import type { Evento } from './types';
import './CrearEvento.css';

export default function CrearEvento() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaHora: '',
    duracion: 0,
    cupoMax: 0,
    tipo: 'VISITA_GUIADA'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idUsuarioActual = Number(localStorage.getItem('id')) || 0;

      const dataAEnviar: Partial<Evento> = {
        ...formData,
        fechaHora: new Date(formData.fechaHora).toISOString(),
        curador: { 
          id: idUsuarioActual, 
          nombre: 'Curador' 
        } 
      };
      
      await crearEvento(dataAEnviar);
      alert('Evento creado con éxito');
      navigate('/eventos');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al crear el evento');
    }
  };

  return (
    <div className="crear-evento-container">
      <h2>Crear Nuevo Evento</h2>
      <form onSubmit={handleSubmit} className="crear-evento-form">
        
        <label>Título:</label>
        <input name="titulo" type="text" required onChange={handleChange} />

        <label>Descripción:</label>
        <textarea name="descripcion" required onChange={handleChange} rows={4} />

        <label>Tipo de Evento:</label>
        <select name="tipo" onChange={handleChange} value={formData.tipo}>
          <option value="VISITA_GUIADA">Visita Guiada</option>
          <option value="CHARLA">Charla</option>
          <option value="EXPOSICION">Exposición</option>
        </select>

        <label>Fecha y Hora:</label>
        <input name="fechaHora" type="datetime-local" required onChange={handleChange} />

        <label>Duración (minutos):</label>
        <input name="duracion" type="number" required onChange={handleChange} />

        <label>Cupo Máximo:</label>
        <input name="cupoMax" type="number" required onChange={handleChange} />

        <button type="submit" className="submit-btn">
          Guardar Evento
        </button>
      </form>
    </div>
  );
}