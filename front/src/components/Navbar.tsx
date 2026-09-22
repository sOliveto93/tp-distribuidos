
import { Link, useNavigate } from 'react-router-dom';
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
    <nav>
      <Link to="/obras">Obras</Link>
      <Link to="/eventos">Eventos</Link>
      
      {(rol === 'CURADOR' || rol === 'ADMINISTRADOR') && (
        <Link to="/reportes">Reportes</Link>
      )}

      <button onClick={cerrarSesion}>Salir</button>
    </nav>
  );
}