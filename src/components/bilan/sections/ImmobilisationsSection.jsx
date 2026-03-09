import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { api } from '../../../api/mock';

const MOCK_SUBVENTIONS = [
  { id: 1, nom: 'NDF Achats divers du 22/01/26', date: '22/01/2026', montant: '12€' },
  { id: 2, nom: 'To John Doe', date: '16/10/2025', montant: '-5€' },
  { id: 3, nom: 'Vir Sepa Doe John', date: '11/07/2025', montant: '66,09€' },
];

export default function ImmobilisationsSection({ bilan, onClose }) {
  const [immos, setImmos] = useState([]);
  const [listeValidee, setListeValidee] = useState(bilan?.responses?.immobilisations?.liste_validee ?? true);
  const [subventions, setSubventions] = useState(
    MOCK_SUBVENTIONS.map(s => ({ ...s, immo: '' }))
  );

  useEffect(() => {
    api.getImmobilisations().then(setImmos);
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            <strong>NOUVEAU</strong> : Vous pouvez désormais voir toutes vos immobilisations dans l'onglet
            "Immobilisation" de LegalPlace Pro !<br /><br />
            Rappel : En comptabilité, une immobilisation est un bien de plus de 500€ HT destiné à servir de façon
            durable à l'activité d'une entreprise (exemple : voiture, ordinateur, matériel industriel, agencement
            d'une boutique, etc.).<br /><br />
            Voici la liste actuelle de vos immobilisations, vous pouvez la modifier dans l'onglet "Immobilisation"
            de LegalPlace Pro.
          </div>
        </div>
      </div>

      {/* List of immobilisations */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        {immos.map(i => (
          <div
            key={i.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: 'var(--space-md)',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border)',
              alignItems: 'start',
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{i.nom}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.875rem' }}>{i.duree} ans</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Durée d'immobilisation</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {i.prix.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Prix d'achat</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--primary)', marginTop: 2 }}>{i.categorie}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Validez-vous cette liste d'immobilisations ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="liste_validee" checked={listeValidee} onChange={() => setListeValidee(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="liste_validee" checked={!listeValidee} onChange={() => setListeValidee(false)} />
            Non
          </label>
        </div>
      </div>

      <div className="drawer-footer" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {/* Subventions d'investissement */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          Pour chacune des transactions ci-dessous catégorisées "Subvention d'investissement", pouvez-vous nous
          indiquer quelle immobilisation a-t-elle permis d'acheter ?
        </p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Immobilisation concernée</th>
              </tr>
            </thead>
            <tbody>
              {subventions.map(s => (
                <tr key={s.id}>
                  <td>{s.nom}</td>
                  <td>{s.date}</td>
                  <td>{s.montant}</td>
                  <td>
                    <select
                      className="form-select"
                      value={s.immo}
                      onChange={e =>
                        setSubventions(prev =>
                          prev.map(x => x.id === s.id ? { ...x, immo: e.target.value } : x)
                        )
                      }
                    >
                      <option value="">Sélection</option>
                      {immos.map(i => (
                        <option key={i.id} value={i.nom}>{i.nom}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
