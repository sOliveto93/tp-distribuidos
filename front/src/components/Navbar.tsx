
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'

interface NavbarProps {
  rol: string | null;
  setRol: (rol: string | null) => void;
}
export default function Navbar({ rol, setRol }: NavbarProps) {
  const navigate = useNavigate();

  if (!rol) return null;

  const cerrarSesion = () => {
    localStorage.clear();
    setRol(null);
    navigate('/login');
  };

  return (
    <nav className="navbar-container">
      <div className="navbar-links">
        <Link to="/obras" className="nav-link">Obras</Link>
        <Link to="/eventos" className="nav-link">Eventos</Link>
        
        {(rol === 'CURADOR' || rol === 'ADMINISTRADOR') && (
          <>
            <Link to="/reportes" className="nav-link">Reportes</Link>
            <Link to="/crear-evento" className="nav-link nav-action">
              + Crear Evento
            </Link>
          </>
        )}
      </div>

      <button onClick={cerrarSesion} className="nav-logout-btn">
        Salir
      </button>
    </nav>
  );
}