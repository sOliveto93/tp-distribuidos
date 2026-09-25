import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './api/Login';
import Reportes from './Reportes';
import Eventos from './Eventos';
import CrearEvento from './CrearEvento';
import EditarEvento from './EditarEvento';

export default function App() {
  const [rol, setRol] = useState(localStorage.getItem('rol'));
  const iniciarSesion = (nuevoRol: string) => {
    localStorage.setItem('rol', nuevoRol);
    setRol(nuevoRol);
  };

  return (
    <BrowserRouter>
      <Navbar rol={rol} setRol={setRol} />
      
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login onLogin={iniciarSesion} />} />
          
          <Route path="/eventos" element={<Eventos />} />

          <Route 
            path="/reportes" 
            element={
              (rol === 'CURADOR' || rol === 'ADMINISTRADOR') 
                ? <Reportes /> 
                : <Navigate to="/eventos" replace />
            } 
          />
          <Route 
            path="/crear-evento" 
            element={
              (rol === 'CURADOR' || rol === 'ADMINISTRADOR') 
                ? <CrearEvento /> 
                : <Navigate to="/eventos" replace />
            } 
          />
          <Route 
            path="/editar-evento/:id" 
            element={
              (rol === 'CURADOR' || rol === 'ADMINISTRADOR') 
                ? <EditarEvento /> 
                : <Navigate to="/eventos" replace />
            } 
          />
        </Routes>
    </BrowserRouter>
  );
}