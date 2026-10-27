import { useEffect, useState } from "react";
import { fetchRecomendaciones } from "../services/Recomendaciones";
import {
  guardarFiltroFavorito,
  getFiltrosFavoritos,
  eliminarFiltroFavorito
} from "../services/eventosService";
import type { FiltroFavorito } from "../types/types";

interface ObraRecomendada {
  id: number;
  titulo: string;
  artista: string;
  motivo: string;
}

const opcionesEpocas = [
  "Cubismo",
  "Impresionismo",
  "Postimpresionismo",
  "Renacimiento"
];

const opcionesTecnicas = [
  "Óleo sobre lienzo",
  "Óleo sobre tabla",
  "Temple y óleo sobre yeso"
];

export default function Recomendaciones() {
  const [recomendadas, setRecomendadas] = useState<ObraRecomendada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [epocas, setEpocas] = useState<string[]>([]);
  const [tecnicas, setTecnicas] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const cargarRecomendaciones = async (idUsuario: number) => {
    const data = await fetchRecomendaciones(idUsuario);
    setRecomendadas(data.recomendadasList || []);
  };

  const obtenerIdUsuario = (): number | null => {
    const usuarioGuardado = localStorage.getItem("id");

    if (!usuarioGuardado) {
      setMensaje("Debes iniciar sesión.");
      return null;
    }

    const idUsuario = Number.parseInt(usuarioGuardado, 10);

    if (Number.isNaN(idUsuario)) {
      setMensaje("El ID del usuario no es válido.");
      return null;
    }

    return idUsuario;
  };

  const esPreferenciaRecomendacion = (filtro: FiltroFavorito) => {
    const configuracion = filtro.configuracionFiltros;

    return (
      configuracion != null &&
      "tipoConfiguracion" in configuracion &&
      configuracion.tipoConfiguracion === "RECOMENDACIONES"
    );
  };

  const eliminarPreferenciasAnteriores = async (idUsuario: number) => {
    const filtros = await getFiltrosFavoritos(idUsuario);
    const filtrosRecomendaciones = filtros.filter(esPreferenciaRecomendacion);

    for (const filtro of filtrosRecomendaciones) {
      if (filtro.id !== undefined) {
        await eliminarFiltroFavorito(idUsuario, filtro.id);
      }
    }
  };

  const guardarPreferencias = async () => {
    const idUsuario = obtenerIdUsuario();

    if (idUsuario === null) return;

    if (epocas.length === 0 && tecnicas.length === 0) {
      setMensaje("Seleccioná al menos una época o técnica.");
      return;
    }

    setGuardando(true);
    setMensaje("");

    try {
      await eliminarPreferenciasAnteriores(idUsuario);

      const configuraciones: {
        epoca: string;
        tecnica: string;
        artista: string;
      }[] = [];

      for (const epoca of epocas) {
        configuraciones.push({
          epoca,
          tecnica: "",
          artista: ""
        });
      }

      for (const tecnica of tecnicas) {
        configuraciones.push({
          epoca: "",
          tecnica,
          artista: ""
        });
      }

      for (const configuracion of configuraciones) {
        const filtro: FiltroFavorito = {
          nombre: "Preferencias de recomendaciones",
          descripcion: "Preferencias para recomendar obras",
          usuario: { id: idUsuario },
          configuracionFiltros: {
            tipoConfiguracion: "RECOMENDACIONES",
            ...configuracion
          }
        };

        await guardarFiltroFavorito(idUsuario, filtro);
      }

      await cargarRecomendaciones(idUsuario);
      setMensaje("Preferencias actualizadas correctamente.");
    } catch (error) {
      console.error("Error al guardar preferencias:", error);
      setMensaje("No se pudieron actualizar las preferencias.");
    } finally {
      setGuardando(false);
    }
  };

  const eliminarPreferencias = async () => {
    const idUsuario = obtenerIdUsuario();

    if (idUsuario === null) return;

    setGuardando(true);
    setMensaje("");

    try {
      await eliminarPreferenciasAnteriores(idUsuario);

      setEpocas([]);
      setTecnicas([]);

      await cargarRecomendaciones(idUsuario);
      setMensaje("Preferencias eliminadas correctamente.");
    } catch (error) {
      console.error("Error al eliminar preferencias:", error);
      setMensaje("No se pudieron eliminar las preferencias.");
    } finally {
      setGuardando(false);
    }
  };

  useEffect(() => {
    const obtenerRecomendaciones = async () => {
      try {
        const usuarioGuardado = localStorage.getItem("id");

        if (!usuarioGuardado) {
          setError("Debes iniciar sesión para ver tus recomendaciones.");
          return;
        }

        const idUsuario = Number.parseInt(usuarioGuardado, 10);

        if (Number.isNaN(idUsuario)) {
          setError("No se pudo obtener un ID de usuario válido.");
          return;
        }

        await cargarRecomendaciones(idUsuario);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudieron cargar las recomendaciones."
        );
      } finally {
        setLoading(false);
      }
    };

    obtenerRecomendaciones();
  }, []);

  if (loading) return <p>Cargando recomendaciones...</p>;

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h2>Recomendaciones para vos</h2>

      <section
        style={{
          border: "1px solid #ccc",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem"
        }}
      >
        <h3>Tus preferencias artísticas</h3>

        <p>
          Seleccioná tus intereses para personalizar las recomendaciones de obras.
        </p>

        <div style={{ marginBottom: "1rem" }}>
          <h4>Épocas</h4>

          {opcionesEpocas.map((epoca) => (
            <label
              key={epoca}
              style={{ display: "block", marginBottom: "0.4rem" }}
            >
              <input
                type="checkbox"
                checked={epocas.includes(epoca)}
                disabled={guardando}
                onChange={(e) =>
                  setEpocas((actuales) =>
                    e.target.checked
                      ? [...actuales, epoca]
                      : actuales.filter((item) => item !== epoca)
                  )
                }
              />
              {" "}{epoca}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <h4>Técnicas</h4>

          {opcionesTecnicas.map((tecnica) => (
            <label
              key={tecnica}
              style={{ display: "block", marginBottom: "0.4rem" }}
            >
              <input
                type="checkbox"
                checked={tecnicas.includes(tecnica)}
                disabled={guardando}
                onChange={(e) =>
                  setTecnicas((actuales) =>
                    e.target.checked
                      ? [...actuales, tecnica]
                      : actuales.filter((item) => item !== tecnica)
                  )
                }
              />
              {" "}{tecnica}
            </label>
          ))}
        </div>

        <button
          type="button"
          onClick={guardarPreferencias}
          disabled={guardando}
        >
          {guardando ? "Procesando..." : "Guardar preferencias"}
        </button>

        <button
          type="button"
          onClick={eliminarPreferencias}
          disabled={guardando}
          style={{ marginLeft: "0.5rem" }}
        >
          Eliminar preferencias
        </button>

        {mensaje && <p>{mensaje}</p>}
      </section>

      <section>
        <h3>Obras recomendadas</h3>

        {recomendadas.length === 0 ? (
          <p>No hay recomendaciones para este usuario.</p>
        ) : (
          <div style={{ display: "grid", gap: "1rem" }}>
            {recomendadas.map((obra) => (
              <div
                key={obra.id}
                style={{
                  border: "1px solid #ccc",
                  padding: "1rem",
                  borderRadius: "8px"
                }}
              >
                <h3>{obra.titulo}</h3>

                <p>
                  <strong>Artista:</strong> {obra.artista}
                </p>

                <p>
                  <em>{obra.motivo}</em>
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
