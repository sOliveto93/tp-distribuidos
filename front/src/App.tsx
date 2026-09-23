import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Reportes from './Reportes';
import Eventos from './Eventos';
import CrearEvento from './CrearEvento';
import EditarEvento from './EditarEvento';


function App() {
  const rolUsuarioActual: string = 'CURADOR';
  const tienePermisos = rolUsuarioActual === 'ADMINISTRADOR' || rolUsuarioActual === 'CURADOR';
  return (
    <BrowserRouter>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '20px', padding: '1rem', background: '#333', 
        marginBottom: '20px' 
      }}>
        <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Reportes</Link>
        <Link to="/eventos" style={{ color: 'white', textDecoration: 'none' }}>Eventos</Link>
        {tienePermisos && (
          <Link to="/crear-evento" style={{ color: '#4da6ff', fontWeight: 'bold', textDecoration: 'none' }}>+ Crear Evento</Link>
        )}
      </nav>
      
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Reportes />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/crear-evento" element={<CrearEvento />} />
          <Route path="/editar-evento/:id" element={<EditarEvento />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;