import { useState, useEffect } from 'react';
import { api } from '../api/client';
import { TrendingUp, TrendingDown, Wallet, AlertCircle } from 'lucide-react';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    api.getDashboard().then(setData);
    api.getCompany().then(setCompany);
  }, []);

  if (!data) return <p>Chargement...</p>;

  return (
    <div>
      <div className="page-header">
        <h1>Tableau de bord</h1>
        <p>Bienvenue, {company?.name}</p>
      </div>

      {/* KPI cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Wallet size={20} color="var(--primary)" />
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 4px' }}>
            {data.solde_total.toLocaleString('fr-FR')} €
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Solde total</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingUp size={20} color="var(--success)" />
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--success)' }}>
            {data.ca.toLocaleString('fr-FR')} €
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Chiffre d'affaires</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingDown size={20} color="var(--danger)" />
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 4px', color: 'var(--danger)' }}>
            {data.charges.toLocaleString('fr-FR')} €
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Charges</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <TrendingDown size={20} color={data.resultat >= 0 ? 'var(--success)' : 'var(--danger)'} />
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: '8px 0 4px', color: data.resultat >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {data.resultat.toLocaleString('fr-FR')} €
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Résultat</p>
        </div>
      </div>

      {/* Alerts */}
      {data.comptes_desynchro > 0 && (
        <div className="alert-box warning">
          <AlertCircle size={18} />
          <span><strong>{data.comptes_desynchro} comptes désynchronisés</strong> — Reconnectez vos comptes bancaires.</span>
        </div>
      )}

      {data.transactions_non_cat > 0 && (
        <div className="alert-box danger">
          <AlertCircle size={18} />
          <span><strong>{data.transactions_non_cat} transactions non catégorisées</strong> — Catégorisez-les pour avancer sur votre comptabilité.</span>
        </div>
      )}
    </div>
  );
}
