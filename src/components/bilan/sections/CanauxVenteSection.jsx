import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { api } from '../../../api/mock';

export default function CanauxVenteSection({ bilan, onClose }) {
  const [canaux, setCanaux] = useState([]);

  useEffect(() => {
    api.getCanauxVente().then(setCanaux);
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Il existe différents types de canaux de ventes : les sites e-commerce (Shopify...), les marketplaces
            (Amazon...), les plateformes de location (Airbnb), les plateformes VTC (Uber), les boutiques
            physiques...<br />
            La récupération des rapports de vente permet de distinguer le chiffre d'affaires des commissions
            prélevées par les plateformes et d'ajuster la TVA.
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Pour chaque canal de vente ajoutez votre rapport du mois de clôture :
        </p>

        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              Vos rapports de ventes peuvent être téléchargés depuis le canal de ventes que vous utilisez (Stripe,
              Amazon etc...). Ils garantissent l'exactitude de vos informations bancaires.
            </div>
          </div>
        </div>

        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)', fontWeight: 500 }}>
          Nom du compte
        </p>

        {canaux.map(c => (
          <div
            key={c.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border)',
            }}
          >
            <div style={{ fontSize: '0.875rem', fontWeight: 500 }}>{c.nom}</div>
            <button className="btn btn-outline btn-sm">
              Déposez votre rapport
            </button>
          </div>
        ))}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
