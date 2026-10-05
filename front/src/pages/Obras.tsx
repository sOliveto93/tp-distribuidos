import { useEffect, useState } from "react";
import type { FiltrosObra, Obra } from "../types/types";

const URL_BASE = import.meta.env.VITE_URL_BASE;
const PORT_GRAPHQL = import.meta.env.VITE_PORT;
const PATH_GRAPHQL = import.meta.env.VITE_GRAPHQL;

export default function Obras() {


    const [filtros, setFiltros] = useState<FiltrosObra>({});
    const [datos, setDatos] = useState<Obra[]>([]);

    const queryObras = `
    query Obras($filtros: FiltrosObra) {
        obras(filtros: $filtros) {
            id
            titulo
            descripcion
            anio_creacion
            epoca
            tecnica
            ubicacion
            disponible
            imagen_url
            dimensiones

            artista {
                nombre
                biografia
            }

            comentarios {
                id
                fecha
                texto
                usuario {
                    nombre
                }
            }
        }
    }
`;
    /*obra(id: ID!): Obra
        obras(filtros:FiltrosObra):[Obra!]! */
    useEffect(() => {

    }, []);

    const handleClick = async () => {
        const respuesta = await fetch(`${URL_BASE}${PORT_GRAPHQL}${PATH_GRAPHQL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                query: queryObras,
                variables: {
                    filtros: filtros
                }
            })
        });
        const data = await respuesta.json();
        console.log(data);
        setDatos(data.data.obras);


    }
    return (<div>
        <div>
            <input
                type="text"
                placeholder="Palabra clave"
                value={filtros.palabraClave ?? ""}
                onChange={(e) =>
                    setFiltros({
                        ...filtros,
                        palabraClave: e.target.value
                    })
                }
            />

            <input
                type="text"
                placeholder="Época"
                value={filtros.epoca ?? ""}
                onChange={(e) =>
                    setFiltros({
                        ...filtros,
                        epoca: e.target.value
                    })
                }
            />

            <input
                type="text"
                placeholder="Técnica"
                value={filtros.tecnica ?? ""}
                onChange={(e) =>
                    setFiltros({
                        ...filtros,
                        tecnica: e.target.value
                    })
                }
            />

            <input
                type="text"
                placeholder="Ubicación"
                value={filtros.ubicacion ?? ""}
                onChange={(e) =>
                    setFiltros({
                        ...filtros,
                        ubicacion: e.target.value
                    })
                }
            />
            <select
                value={
                    filtros.disponible === undefined
                        ? ""
                        : String(filtros.disponible)
                }
                onChange={(e) => {
                    const valor = e.target.value;

                    setFiltros({
                        ...filtros,
                        disponible:
                            valor === ""
                                ? undefined
                                : valor === "true"
                    });
                }}
            >
                <option value="">Todas</option>
                <option value="true">En exhibición</option>
                <option value="false">En depósito</option>
            </select>
            <button onClick={handleClick}>Buscar</button>
        </div>
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.5rem",
            padding: "2rem",
        }}>
            {datos.map((obra) => (
                <ObraItem key={obra.id} obra={obra} />
            ))}
        </div>
    </div>);
}

function ObraItem({ obra }: { obra: Obra }) {
    return (
        <section
            style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                backgroundColor: "white",
            }}
        >
            <img
                src={obra.imagen_url}
    alt={obra.titulo}
    style={{
        width: "100%",
        maxWidth: "100%",
        height: "250px",
        objectFit: "contain",
        display: "block",
    }}
            />

            <div style={{ padding: "1rem" }}>
                <h2>{obra.titulo}</h2>

                <p>{obra.descripcion}</p>

                <p>Año: {obra.anio_creacion}</p>
                <p>Época: {obra.epoca}</p>
                <p>Técnica: {obra.tecnica}</p>
                <p>Dimensiones: {obra.dimensiones}</p>
                <p>Ubicación: {obra.ubicacion}</p>

                <p>
                    Disponible:{" "}
                    {obra.disponible ? "Sí" : "No"}
                </p>

                <h3>Artista</h3>

                <p>
                    Nombre: {obra.artista?.nombre}
                </p>

                <p>
                    Biografía: {obra.artista?.biografia}
                </p>

                <h3>Comentarios</h3>

                {obra.comentarios.map((comentario) => (
                    <div
                        key={comentario.id}
                        style={{
                            padding: "0.75rem",
                            marginBottom: "0.5rem",
                            backgroundColor: "#f5f5f5",
                            borderRadius: "6px",
                        }}
                    >
                        <strong>
                            {comentario.usuario.nombre}
                        </strong>

                        <p>{comentario.texto}</p>

                        <small>{comentario.fecha}</small>
                    </div>
                ))}
            </div>
        </section>
    );
}