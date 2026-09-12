import React, { useState, useEffect } from 'react';

interface Usuario { nombre: string; }
interface Comentario { texto: string; fecha: string; usuario: Usuario; }
interface Artista { nombre: string; biografia: string; }
interface Obra {
  id: string;
  titulo: string;
  descripcion: string;
  epoca: string;
  tecnica: string;
  imagen_url: string;
  dimensiones: string;
  ubicacion: string;
  artista: Artista;
  comentarios: Comentario[];
}

export default function Catalogo() {
  const [obras, setObras] = useState<Obra[]>([]);
  const [palabraClave, setPalabraClave] = useState('');
  const [epoca, setEpoca] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchObras = async () => {
    setLoading(true);
    try {
      const queryJson = {
        query: `
          query ExplorarCatalogo($filtros: FiltrosObraInput) {
            buscarObras(filtros: $filtros) {
              id
              titulo
              descripcion
              epoca
              tecnica
              imagen_url
              dimensiones
              ubicacion
              artista { nombre biografia }
              comentarios { texto fecha usuario { nombre } }
            }
          }
        `,
        variables: {
          filtros: {
            palabraClave: palabraClave || null,
            epoca: epoca || null
          }
        }
      };

      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(queryJson)
      });

      const result = await response.json();
      if (result.data && result.data.buscarObras) {
        setObras(result.data.buscarObras);
      }
    } catch (error) {
      console.error("Error cargando el catálogo:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchObras();
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: '"Segoe UI", Roboto, sans-serif', color: '#2d3748', maxWidth: '1200px', margin: '0 auto' }}>
      
      {/* Sección de Filtros Estilizada */}
      <div style={{ 
        backgroundColor: '#ffffff', 
        padding: '20px', 
        borderRadius: '12px', 
        boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
        marginBottom: '30px', 
        display: 'flex', 
        flexWrap: 'wrap',
        gap: '15px',
        alignItems: 'center'
      }}>
        <div style={{ flex: '1', minWidth: '250px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Buscar por palabra clave</label>
          <input 
            type="text" 
            placeholder="Título, descripción o artista..." 
            value={palabraClave}
            onChange={(e) => setPalabraClave(e.target.value)}
            style={{ padding: '10px 14px', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', boxSizing: 'border-box' }}
          />
        </div>
        
        <div style={{ minWidth: '200px' }}>
          <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '5px', color: '#4a5568' }}>Filtrar por Época</label>
          <select 
            value={epoca} 
            onChange={(e) => setEpoca(e.target.value)} 
            style={{ padding: '10px 14px', width: '100%', borderRadius: '6px', border: '1px solid #cbd5e0', fontSize: '15px', backgroundColor: '#fff' }}
          >
            <option value="">Todas las épocas</option>
            <option value="Renacimiento">Renacimiento</option>
            <option value="Postimpresionismo">Postimpresionismo</option>
            <option value="Cubismo">Cubismo</option>
            <option value="Impresionismo">Impresionismo</option>
          </select>
        </div>

        <button 
          onClick={fetchObras} 
          style={{ 
            padding: '11px 24px', 
            marginTop: '22px',
            backgroundColor: '#3182ce', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: '600',
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            boxShadow: '0 2px 4px rgba(49,130,206,0.3)'
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#2b6cb0')}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#3182ce')}
        >
          Aplicar Filtros
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '40px', fontSize: '18px', color: '#718096' }}>
          ⏳ Consultando las galerías del museo...
        </div>
      )}

      {/* Grid de Obras Estilo Tarjeta de Galería */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '25px' }}>
        {obras.map((obra) => (
          <div key={obra.id} style={{ 
            backgroundColor: '#ffffff', 
            borderRadius: '12px', 
            overflow: 'hidden',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05), 0 4px 6px -2px rgba(0,0,0,0.05)',
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Imagen de la Obra */}
            <div style={{ position: 'relative', overflow: 'hidden', height: '240px', backgroundColor: '#edf2f7' }}>
              <img 
                src={obra.imagen_url} 
                alt={obra.titulo} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                onError={(e) => {
                  // Si el enlace de prueba no funciona, muestra un marcador de posición de arte elegante
                  e.currentTarget.src = "https://unsplash.com";
                }}
              />
              <span style={{ 
                position: 'absolute', 
                bottom: '12px', 
                right: '12px', 
                backgroundColor: 'rgba(26, 32, 44, 0.85)', 
                color: '#fff', 
                padding: '4px 10px', 
                borderRadius: '20px', 
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {obra.ubicacion}
              </span>
            </div>

            {/* Detalles */}
            <div style={{ padding: '20px', flex: '1', display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', color: '#1a202c', fontWeight: '700' }}>{obra.titulo}</h3>
              <p style={{ margin: '0 0 12px 0', fontStyle: 'italic', color: '#4a5568', fontSize: '15px' }}>
                Por <strong>{obra.artista?.nombre || 'Artista Desconocido'}</strong>
              </p>
              
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{ backgroundColor: '#e2e8f0', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>{obra.epoca}</span>
                <span style={{ backgroundColor: '#edf2f7', padding: '3px 8px', borderRadius: '4px', fontSize: '12px', color: '#4a5568' }}>{obra.tecnica}</span>
              </div>

              <p style={{ margin: '0 0 20px 0', color: '#718096', fontSize: '14px', lineHeight: '1.5', flex: '1' }}>{obra.descripcion}</p>
              
              {/* Contenedor de Comentarios */}
              <div style={{ borderTop: '1px solid #edf2f7', paddingTop: '15px', marginTop: 'auto' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#4a5568', fontWeight: '600' }}>
                  💬 Reseñas y Comentarios ({obra.comentarios?.length || 0})
                </h4>
                <div style={{ maxHeight: '120px', overflowY: 'auto', paddingRight: '5px' }}>
                  {obra.comentarios && obra.comentarios.length > 0 ? (
                    obra.comentarios.map((c, i) => (
                      <div key={i} style={{ padding: '8px', backgroundColor: '#f7fafc', borderRadius: '6px', marginBottom: '6px', fontSize: '13px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#4a5568', fontWeight: '600', marginBottom: '2px' }}>
                          <span>{c.usuario?.nombre}</span>
                          <span style={{ fontWeight: '400', color: '#a0aec0', fontSize: '11px' }}>{c.fecha}</span>
                        </div>
                        <p style={{ margin: 0, color: '#4a5568', fontStyle: 'italic' }}>"{c.texto}"</p>
                      </div>
                    ))
                  ) : (
                    <p style={{ margin: 0, fontSize: '13px', color: '#a0aec0', fontStyle: 'italic' }}>Sin comentarios de visitantes todavía.</p>
                  )}
                </div>
              </div>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}
