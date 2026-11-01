import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';
import type { Notificacion } from '../types/types';
import './Notificaciones.css';

export default function Notificaciones() {
    const { notificaciones } = useContext(NotificacionesContext);

    return (
        <div className="notificaciones-container">
            <h1>Mis notificaciones</h1>

            {notificaciones.length === 0 ? (
                <p>No tenés notificaciones.</p>
            ) : (
                <div className="notificaciones-lista">
                    {notificaciones.map((notificacion: Notificacion) => (
                        <article
                            key={notificacion.message_id}
                            className="notificacion-card"
                        >
                            <span className="notificacion-tipo">
                                {notificacion.tipo_novedad.replaceAll('_', ' ')}
                            </span>

                            <h2>{notificacion.titulo}</h2>

                            <p>{notificacion.mensaje}</p>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}