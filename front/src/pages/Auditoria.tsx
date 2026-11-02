import React, { useEffect, useState } from 'react';
import { getAuditorias } from '../services/auditoriaService';
import type { Auditoria } from '../types/types';
import './Auditoria.css';

const AuditoriaPage: React.FC = () => {
  const [auditorias, setAuditorias] = useState<Auditoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuditoria = async () => {
      try {
        const data = await getAuditorias();
        setAuditorias(data);
      } catch (err) {
        console.error(err);
        setError('No se pudo cargar la auditoría. Verifique tener permisos de ADMIN o CURADOR.');
      } finally {
        setLoading(false);
      }
    };

    fetchAuditoria();
  }, []);

  const auditoriasOrdenadas = [...auditorias].sort((a, b) =>
    new Date(b.fecha_registro).getTime() - new Date(a.fecha_registro).getTime()
  );

  // FORMATEAR EL JSON
  const renderPayload = (payloadString: string) => {
    try {
      let obj = JSON.parse(payloadString);
      if (typeof obj === 'string') {
        obj = JSON.parse(obj);
      }

      const formatObj = (o: Record<string, unknown>) => (
        <ul className="payload-list">
          {Object.entries(o).map(([key, val]) => (
            <li key={key}>
              <span className="payload-key">{key}:</span> {String(val)}
            </li>
          ))}
        </ul>
      );

      if (obj.antes && obj.despues) {
        return (
          <div className="payload-modificado">
            <div className="payload-box antes">
              <span className="box-title">Valores Anteriores</span>
              {formatObj(obj.antes)}
            </div>
            <div className="payload-box despues">
              <span className="box-title">Valores Nuevos</span>
              {formatObj(obj.despues)}
            </div>
          </div>
        );
      }

      return (
        <div className="payload-box normal">
          {formatObj(obj)}
        </div>
      );
    } catch {
      return <pre className="payload-raw">{payloadString}</pre>;
    }
  };

  if (loading) return <div className="auditoria-msg">Cargando historial...</div>;
  if (error) return <div className="auditoria-msg error">{error}</div>;

  return (
    <div className="auditoria-container">
      <h2 className="auditoria-titulo">Historial de Auditoría de Eventos</h2>
      <div className="table-responsive">
        <table className="auditoria-table">
          <thead>
            <tr>
              <th>Fecha y Hora</th>
              <th>Acción</th>
              <th>Resp. ID</th>
              <th>Detalle del Evento</th>
            </tr>
          </thead>
          <tbody>
            {auditoriasOrdenadas.map((registro) => (
              <tr key={registro.id}>
                <td className="col-fecha">{new Date(registro.fecha_registro).toLocaleString('es-AR')}</td>
                <td className="col-accion">
                  <span className={`badge ${registro.accion.toLowerCase()}`}>
                    {registro.accion.replace('_', ' ')}
                  </span>
                </td>
                <td className="col-resp">{registro.responsableId}</td>
                <td className="col-payload">
                  {renderPayload(registro.payload)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AuditoriaPage;