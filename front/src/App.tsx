import React from 'react';
import Catalogo from './Catalogo';

function App() {
  return (
    // Cambiamos el color de fondo a un gris claro muy sutil (#f7fafc) y las letras del título a oscuro (#1a202c)
    <div style={{ backgroundColor: '#f7fafc', minHeight: '100vh', padding: '10px' }}>
      <header style={{ textAlign: 'center', margin: '30px 0', color: '#1a202c' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.5px' }}>🏛️ Sistema del Museo Virtual</h1>
      </header>
      
      <main>
        <Catalogo />
      </main>
    </div>
  );
}

export default App;

