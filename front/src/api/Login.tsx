import { useState } from 'react';
import { login, me, obtenerNotificacionesPersistidas } from '../services/authServ';
import { useNavigate } from 'react-router-dom';
import { conectarNotificaciones } from '../services/webSocketService.ts';
import { useContext } from 'react';
import { NotificacionesContext } from '../context/NotificacionesContext';
import Notificaciones from '../pages/Notificaciones.tsx';

interface LoginProps {
  onLogin: (rol: string) => void;
}
export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { agregarNotificacion ,cargarNotificaciones} = useContext(NotificacionesContext);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    //console.log("Enviando credenciales:", { email, password });

    setError('');

    try {
      const dataLogin = await login(email, password);

      localStorage.setItem('token', dataLogin.token);


      const perfil = await me() as { id: number; rol: string };

      localStorage.setItem('id', perfil.id.toString());



      onLogin(perfil.rol);

      navigate('/eventos');
      if (perfil.rol === 'VISITANTE') {
        try {
          const notificaciones=await obtenerNotificacionesPersistidas(dataLogin.token);
          cargarNotificaciones(notificaciones);
          conectarNotificaciones(dataLogin.token, agregarNotificacion);

        } catch (error) {
          console.error('No se pudieron iniciar las notificaciones:', error);
        }
      }

    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes('fetch') || err.message.includes('Network')) {
          setError('Error de conexión');
        } else {
          setError('Email o contraseña incorrectos.');
        }
      } else {
        setError('Ocurrió un error inesperado al iniciar sesión.');
      }
    }
  };


  return (
    <div style={{ maxWidth: '300px', margin: '0 auto', padding: '2rem' }}>
      <h2>Iniciar Sesión</h2>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <input
          type="email"
          placeholder="Usuario o Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Ingresar</button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
    </div>
  );
};