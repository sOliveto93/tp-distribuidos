/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { fetchObras, fetchComparacion } from "../services/comparadorService";
import "./Comparador.css";
import type { Obra } from "../types/types";
export default function App() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [seleccionadas, setSeleccionadas] = useState<string[]>([]);
  const [comparacion, setComparacion] = useState<Obra[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>("");
  useEffect(() => {
    void fetchObras()
      .then(setObras)
      .catch((err) => {
        console.error("Error cargando obras:", err);
        setErrorMsg(`No se pudo cargar el catálogo. Error: ${err.message}.`);
      });
  }, []);

  const toggleObra = (id: string) => {
    setSeleccionadas((prev) =>{
      if (prev.includes(id)) return prev.filter((item) => item !== id);
      if (prev.length >= 4) return prev;
      return [...prev, id];
    }
    );
  };

  const comparar = () => {
    void fetchComparacion(seleccionadas)
      .then(setComparacion)
      .catch((err) => console.error("Error al comparar:", err));
  };

  return (
    <div className="comparador-container">
      <h2>Comparador de Obras</h2>
      <p>Seleccioná entre 2 y 4 obras para compararlas lado a lado:</p>

      <div style={{ marginBottom: "16px" }}>
        {obras.map((o) => (
          <label key={o.id} className="obra-item">
            <input
              type="checkbox"
              checked={seleccionadas.includes(o.id)}
              onChange={() => toggleObra(o.id)}
            />{" "}
            <strong>{o.titulo}</strong> — {o.artista.nombre} <em>({o.epoca})</em>
          </label>
        ))}
      </div>

      <button
        onClick={comparar}
        disabled={seleccionadas.length < 2 || seleccionadas.length > 4}
        className="btn-comparar"
      >
        Comparar seleccionadas ({seleccionadas.length})
      </button>
      {errorMsg && <div className="error-msg">{errorMsg}</div>}
      {comparacion.length >= 2 && (
        <table className="tabla-comparacion">
          <thead style={{ background: "#f4f4f4" }}>
            <tr>
              <th>Atributo</th>
              {comparacion.map((o) => (
                <th key={o.id}>{o.titulo}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Artista</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.artista}</td>)}
            </tr>
            <tr>
              <td><strong>Época</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.epoca}</td>)}
            </tr>
            <tr>
              <td><strong>Técnica</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.tecnica}</td>)}
            </tr>
            <tr>
              <td><strong>Año de creación</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.anioCreacion}</td>)}
            </tr>
            <tr>
              <td><strong>Dimensiones</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.dimensiones}</td>)}
            </tr>
            <tr>
              <td><strong>Ubicación</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.ubicacion}</td>)}
            </tr>
            <tr>
              <td><strong>Descripción</strong></td>
              {comparacion.map((o) => <td key={o.id}>{o.descripcion}</td>)}
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}