import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import DashboardPage from './pages/DashboardPage';
import EcheancesPage from './pages/EcheancesPage';
import './styles/theme.css';

function Placeholder({ title }) {
  return (
    <div className="page-header">
      <h1>{title}</h1>
      <p>Cette page est en cours de développement.</p>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-layout">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/transactions" element={<Placeholder title="Transactions" />} />
            <Route path="/notes-de-frais" element={<Placeholder title="Notes de frais" />} />
            <Route path="/immobilisations" element={<Placeholder title="Immobilisations" />} />
            <Route path="/declarations-ventes" element={<Placeholder title="Déclarations de ventes" />} />
            <Route path="/echeances" element={<EcheancesPage />} />
            <Route path="/achats" element={<Placeholder title="Achats" />} />
            <Route path="/ventes" element={<Placeholder title="Ventes" />} />
            <Route path="/documents" element={<Placeholder title="Documents" />} />
            <Route path="/mon-comptable" element={<Placeholder title="Mon comptable" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
