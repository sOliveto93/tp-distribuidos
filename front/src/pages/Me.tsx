import { useEffect, useState } from "react";
const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_REST = import.meta.env.VITE_PORT_REST;
interface datos {
    email: string,
    id: number,
    nombre: string,
    rol: string
}
export default function Me() {

    const [data, setData] = useState<datos>({
        email: "",
        id: 0,
        nombre: "",
        rol: ""
    })
    useEffect(() => {

        const peticion = async () => {
            const response = await fetch(`${URL_BASE}${PORT_REST}/api/auth/me`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
            });
            const data: datos = await response.json();
            setData(data)
            console.log(data)
        }

        peticion();

    }, []);
    return (<>
        {(data.id != 0) ? <Datos data={data} /> : <p>Ocurrio un problema al recuperar sus datos</p>}
    </>);
}

function Datos({ data }: { data: datos }) {
    return (
        <div >
            <p>{data.email}</p>
            <p>{data.nombre}</p>
            <p>{data.rol}</p>

        </div>
    )
}