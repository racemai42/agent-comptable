import { useState, useEffect } from 'react';
import { api } from '../api/mock';
import BilanChecklist from '../components/bilan/BilanChecklist';

export default function EcheancesPage() {
  const [bilan, setBilan] = useState(null);
  const [view, setView] = useState('list'); // 'list' | 'bilan'

  useEffect(() => {
    api.getBilan().then(setBilan);
  }, []);

  if (view === 'bilan' && bilan) {
    return (
      <div>
        <button className="btn btn-outline" onClick={() => setView('list')} style={{ marginBottom: 'var(--space-lg)' }}>
          ← Retour aux échéances
        </button>
        <BilanChecklist bilan={bilan} />
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <h1>Échéances</h1>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-md)' }}>
        À compléter <span className="sidebar-badge">3</span>
      </h2>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-lg)' }}>
        Réalisez vos échéances en temps et en heure pour que votre comptable puisse faire la déclaration.
      </p>

      {/* TVA annuelle */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>TVA annuelle 2024</h3>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="status-badge status-pending">À compléter</span>
            <span>⏱ 15 min</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: 4 }}>📅 30 septembre · 524 jours de retard</p>
        </div>
        <button className="btn btn-primary">Commencer</button>
      </div>

      {/* Acompte TVA */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Acompte de TVA Juillet 2024</h3>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="status-badge status-pending">À compléter</span>
            <span>⏱ 15 min</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: 4 }}>📅 20 juillet · 596 jours de retard</p>
        </div>
        <button className="btn btn-primary">Commencer</button>
      </div>

      {/* Bilan */}
      <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>Bilan 2025</h3>
          <div style={{ display: 'flex', gap: 'var(--space-md)', marginTop: 4, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <span className="status-badge status-pending">À compléter</span>
            <span>⏱ 45 min</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--warning)', marginTop: 4 }}>📅 30 avril · 312 jours de retard</p>
        </div>
        <button className="btn btn-primary" onClick={() => setView('bilan')}>Reprendre</button>
      </div>

      <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 'var(--space-xl)', marginBottom: 'var(--space-md)' }}>
        En cours de déclaration
      </h2>
      <div className="card">
        <h3 style={{ fontSize: '1rem', fontWeight: 600 }}>AGOA (assemblée générale ordinaire annuelle)</h3>
        <span className="status-badge status-complete" style={{ marginTop: 4 }}>En cours de déclaration</span>
      </div>
    </div>
  );
}
