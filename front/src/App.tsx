import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Reportes from './Reportes';
import Eventos from './Eventos';


function App() {
  return (
    <BrowserRouter>
      <nav style={{ padding: '1rem', background: '#333', marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '15px', color: 'white' }}>Reportes</Link>
        <Link to="/eventos" style={{ color: 'white' }}>Eventos</Link>
      </nav>
      <main style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<Reportes />} />
          <Route path="/eventos" element={<Eventos />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;