import { useState, useEffect } from 'react';
import { Info, Upload, ShoppingCart } from 'lucide-react';
import { api } from '../../../api/client';

const TYPE_LABELS = {
  'e-commerce': 'E-commerce',
  'marketplace': 'Marketplace',
  'location': 'Plateforme de location',
  'vtc': 'VTC',
  'physique': 'Boutique physique',
};

export default function CanauxVenteSection({ bilan, onClose }) {
  const [canaux, setCanaux] = useState([]);

  useEffect(() => {
    api.getCanauxVente().then(data => setCanaux(data.map(c => ({ ...c }))));
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <p>Les rapports de vente permettent de distinguer le chiffre d'affaires des commissions et d'ajuster la TVA :</p>
          <ul style={{ paddingLeft: 16, marginTop: 4, lineHeight: 1.8 }}>
            <li><strong>E-commerce</strong> (Shopify, WooCommerce…)</li>
            <li><strong>Marketplaces</strong> (Amazon, Etsy…)</li>
            <li><strong>Plateformes de location</strong> (Airbnb…)</li>
            <li><strong>VTC</strong> (Uber, Bolt…)</li>
            <li><strong>Boutiques physiques</strong></li>
          </ul>
        </div>
      </div>

      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
          Pour chaque canal, ajoutez le rapport du mois de clôture
        </p>

        {canaux.length === 0 && (
          <div style={{ color: 'var(--text-muted)', textAlign: 'center', padding: 'var(--space-lg)' }}>
            <ShoppingCart size={32} style={{ marginBottom: 'var(--space-sm)', opacity: 0.4 }} />
            <p>Aucun canal de vente configuré</p>
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
          {canaux.map(c => (
            <div
              key={c.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 'var(--space-md)',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>{c.nom}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {TYPE_LABELS[c.type] ?? c.type}
                </p>
              </div>
              <button className="btn btn-outline btn-sm">
                <Upload size={13} /> Déposez votre rapport
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
