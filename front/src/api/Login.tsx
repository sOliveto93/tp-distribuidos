import { useState} from 'react';
import { login, me } from '../authServ';
import { useNavigate } from 'react-router-dom';
interface LoginProps {
  onLogin: (rol: string) => void;
}
export default function Login({onLogin}:LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error,setError]=useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    console.log("Enviando credenciales:", { email, password });
    setError('');

    try {
      const dataLogin = await login(email,password);

      localStorage.setItem('token', dataLogin.token);

      
      const perfil = await me() as {id: number; rol:string};
      localStorage.setItem('id', perfil.id.toString());
      onLogin(perfil.rol);
    
        navigate('/eventos');

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