import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './api/Login';
import Reportes from './Reportes'


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
        <Route 
          path="/reportes" 
          element={
            (rol === 'CURADOR' || rol === 'ADMINISTRADOR') 
              ? <Reportes /> 
              : <Navigate to="/eventos" replace />
          } 
        />
        </Routes>
    
      </BrowserRouter>
  )
}

