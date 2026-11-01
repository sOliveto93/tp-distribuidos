import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';
import type { Notificacion } from '../types/types';
import './Notificaciones.css';

export default function Notificaciones() {
    const { notificaciones } = useContext(NotificacionesContext);

    const formatearFecha = (fecha?: string) => {
        if (!fecha) return 'Sin fecha';
        const limpia = String(fecha).replace('T', ' ').slice(0, 16);
        const [parteFecha, parteHora] = limpia.split(' ');
        if (!parteFecha || !parteHora) return String(fecha);

        const [anio, mes, dia] = parteFecha.split('-');
        return `${dia}/${mes}/${anio} ${parteHora}`;
    };
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
                            <div className="notificacion-detalles">
                                <p><strong>Fecha del evento:</strong> {formatearFecha(notificacion.fecha_evento)}</p>
                                <p><strong>Fecha de operación:</strong> {formatearFecha(notificacion.fecha_creacion)}</p>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}