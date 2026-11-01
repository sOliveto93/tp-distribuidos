import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './api/Login';
import Reportes from './pages/Reportes';
import Eventos from './pages/Eventos';
import Obras from './pages/Obras';
import CrearEvento from './pages/CrearEvento';
import EditarEvento from './pages/EditarEvento';
import Comparador from './pages/Comparador';
import Me from './pages/Me';
import Exploracion from './pages/Exploracion';
import Recorridos from './pages/Recorridos';
import Recomendaciones from './pages/Recomendaciones';
import { NotificacionesProvider } from './context/NotificacionesContext';
import Notificaciones from './pages/Notificaciones';
import Auditoria from './pages/Auditoria';

const RutaProtegida = ({ isAllowed, redirectTo = "/login" }: { isAllowed: boolean, redirectTo?: string }) => {
  if (!isAllowed) {
    return <Navigate to={redirectTo} replace />;
  }
  return <Outlet />;
};

export default function App() {
  const [rol, setRol] = useState(localStorage.getItem('rol'));

  const iniciarSesion = (nuevoRol: string) => {
    localStorage.setItem('rol', nuevoRol);
    setRol(nuevoRol);
  };

  return (
    <NotificacionesProvider>
      <BrowserRouter>
        <Navbar rol={rol} setRol={setRol} />

        <Routes>
          {/* --- RUTAS PÚBLICAS --- */}
          <Route path="/" element={rol ? <Navigate to="/eventos" replace /> : <Navigate to="/login" replace />} />
          <Route path="/login" element={!rol ? <Login onLogin={iniciarSesion} /> : <Navigate to="/eventos" replace />} />

          {/* --- RUTAS PRIVADAS --- */}
          <Route element={<RutaProtegida isAllowed={!!rol} />}>
            <Route path="/me" element={<Me />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/explorar" element={<Exploracion />} />
            <Route path="/obras" element={<Obras />} />
            <Route path="/recorridos" element={<Recorridos />} />
            <Route path="/recomendaciones" element={<Recomendaciones />} />
            <Route path="/notificaciones" element={<Notificaciones />} />
            <Route path="/comparador" element={<Comparador />} />

            {/* --- RUTAS PRIVADAS Curador o Admin --- */}
            <Route element={<RutaProtegida isAllowed={rol === 'CURADOR' || rol === 'ADMINISTRADOR'} redirectTo="/eventos" />}>
              <Route path="/reportes" element={<Reportes />} />
              <Route path="/auditoria" element={<Auditoria />} />
              <Route path="/crear-evento" element={<CrearEvento />} />
              <Route path="/editar-evento/:id" element={<EditarEvento />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </NotificacionesProvider>
  );
}