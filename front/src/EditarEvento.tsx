import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getEventoById, actualizarEvento } from './eventosService';
import type { Evento } from './types';
import './CrearEvento.css'; 

export default function EditarEvento() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fechaHora: '',
    duracion: 0,
    cupoMax: 0,
    tipo: 'VISITA_GUIADA'
  });


  useEffect(() => {
    if (id) {
      getEventoById(id)
        .then(evento => {
          setFormData({
            titulo: evento.titulo,
            descripcion: evento.descripcion || '',
            fechaHora: evento.fechaHora ? evento.fechaHora.slice(0, 16) : '',
            duracion: evento.duracion || 0,
            cupoMax: evento.cupoMax || 0,
            tipo: evento.tipo || 'VISITA_GUIADA'
          });
        })
        .catch(error => {
          console.error(error);
          alert('No se pudo cargar el evento para editar');
          navigate('/eventos');
        });
    }
  }, [id, navigate]);

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
      
      if (id) await actualizarEvento(id, dataAEnviar);
      alert('Evento actualizado con éxito');
      navigate('/eventos');
    } catch (error) {
      console.error(error);
      alert('Hubo un error al actualizar el evento');
    }
  };

  return (
    <div className="crear-evento-container">
      <h2>Editar Evento</h2>
      <form onSubmit={handleSubmit} className="crear-evento-form">
        
        <label>Título:</label>
        <input name="titulo" value={formData.titulo} type="text" required onChange={handleChange} />

        <label>Descripción:</label>
        <textarea name="descripcion" value={formData.descripcion} required onChange={handleChange} rows={4} />

        <label>Tipo de Evento:</label>
        <select name="tipo" value={formData.tipo} onChange={handleChange}>
          <option value="VISITA_GUIADA">Visita Guiada</option>
          <option value="CHARLA">Charla</option>
          <option value="EXPOSICION">Exposición</option>
        </select>

        <label>Fecha y Hora:</label>
        <input name="fechaHora" value={formData.fechaHora} type="datetime-local" required onChange={handleChange} />

        <label>Duración (minutos):</label>
        <input name="duracion" value={formData.duracion} type="number" required onChange={handleChange} />

        <label>Cupo Máximo:</label>
        <input name="cupoMax" value={formData.cupoMax} type="number" required onChange={handleChange} />

        <button type="submit" className="submit-btn" style={{ backgroundColor: '#ffc107', color: 'black' }}>
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}