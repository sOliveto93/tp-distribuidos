const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_REST=import.meta.env.VITE_PORT_REST;

export interface Respuestatoken {
  token: string;
}

export interface RespuestaUsuario {
  email: string;
  rol: string;
}

export const login = async (email: string, password:string): Promise<Respuestatoken> => {
  const respuesta = await fetch(`${URL_BASE}${PORT_REST}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
       email:email,
    password:password
    })
  });

if (!respuesta.ok) throw new Error("Credenciales inválidas");

const token: Respuestatoken = await respuesta.json();
 return token;
} 


export const me = async():Promise<unknown>=>{
 const respuesta = await fetch(`${URL_BASE}${PORT_REST}/api/auth/me`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  })   

if (!respuesta.ok) throw new Error("Token inválido o expirado");

const usuario = await respuesta.json();
 return usuario;
}