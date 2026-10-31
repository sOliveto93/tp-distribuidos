import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';
import type { Notificacion } from '../types/types';

export default function Notificaciones() {
    const { notificaciones } = useContext(NotificacionesContext);

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Notificaciones</h1>

            {notificaciones.length === 0 ? (
                <p className="text-gray-500">No tenés notificaciones.</p>
            ) : (
                <div className="flex flex-col gap-4">
                    {notificaciones.map((notificacion:Notificacion) => (
                        <div
                            key={notificacion.message_id}
                            className="border rounded-lg p-4 shadow-sm bg-white"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-semibold text-lg">
                                    {notificacion.titulo}
                                </h2>

                                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                    {notificacion.tipo_novedad}
                                </span>
                            </div>

                            <p className="text-gray-600">
                                {notificacion.mensaje}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}