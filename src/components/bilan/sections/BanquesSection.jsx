import { useState, useEffect } from 'react';
import { Info, CloudUpload } from 'lucide-react';
import { api } from '../../../api/mock';

export default function BanquesSection({ bilan, onClose }) {
  const [comptes, setComptes] = useState([]);
  const [autresComptes, setAutresComptes] = useState(bilan?.responses?.banques?.autres_comptes ?? false);

  useEffect(() => {
    api.getComptesBancaires().then(setComptes);
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>Vous avez synchronisé <strong>{comptes.length} compte(s)</strong> sur LegalplacePro</div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous d'autres comptes bancaires liés à votre société ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="autres_comptes" checked={autresComptes} onChange={() => setAutresComptes(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="autres_comptes" checked={!autresComptes} onChange={() => setAutresComptes(false)} />
            Non
          </label>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Ajoutez les derniers relevés de chaque compte</p>

        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              La collecte de vos relevés bancaires nous permet de vérifier que nous avons l'ensemble de vos dépenses et
              de vos recettes. Voici la liste des comptes actifs que vous avez. Pour tous ceux dont vous avez les
              relevés bancaires, merci de les déposer en cliquant sur "Déposez vos relevés bancaires".
            </div>
          </div>
        </div>

        <p style={{ fontWeight: 600, marginBottom: 4, marginTop: 'var(--space-md)' }}>Relevés bancaires</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>Nom du compte</p>

        {comptes.map(c => (
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
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.banque}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{c.nom}</div>
            </div>
            <button
              className="btn btn-outline btn-sm"
              style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
            >
              <CloudUpload size={14} /> Déposer les relevés
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
