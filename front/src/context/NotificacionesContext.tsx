import { createContext, useState } from 'react';
import type { Notificacion } from '../types/types';

export const NotificacionesContext = createContext<any>(null);

export function NotificacionesProvider({ children }: { children: React.ReactNode }) {
    const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]);

    const agregarNotificacion = (notificacion: Notificacion) => {
        setNotificaciones((anteriores) => [...anteriores, notificacion]);
    };

    const cargarNotificaciones = (notificaciones: Notificacion[]) => {
    setNotificaciones(notificaciones);
};

    return (
        <NotificacionesContext.Provider value={{ notificaciones, agregarNotificacion ,cargarNotificaciones}}>
            {children}
        </NotificacionesContext.Provider>
    );
}