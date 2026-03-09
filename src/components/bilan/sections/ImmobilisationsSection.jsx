import { useState, useEffect } from 'react';
import { Info, AlertTriangle } from 'lucide-react';
import { api } from '../../../api/client';

const CATEGORIES = [
  'Matériel informatique',
  'Véhicule',
  'Bien immobilier',
  'Logiciel',
  'Droit au bail',
  'Mobilier & agencement',
  'Matériel de bureau',
  'Autre',
];

export default function ImmobilisationsSection({ bilan, onClose }) {
  const [immos, setImmos] = useState([]);
  const [listeValidee, setListeValidee] = useState(bilan?.responses?.immobilisations?.liste_validee ?? null);

  useEffect(() => {
    api.getImmobilisations().then(data => setImmos(data.map(i => ({ ...i }))));
  }, []);

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR');

  const handleChange = (id, field, value) => {
    setImmos(prev => prev.map(i => i.id === id ? { ...i, [field]: value } : i));
  };

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Une immobilisation est un bien dont la valeur est supérieure à <strong>500 € HT</strong> et
          destiné à servir durablement à l'activité (plus d'un exercice). Les biens inférieurs à 500 € HT
          sont comptabilisés directement en charges.
        </span>
      </div>

      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Liste des immobilisations</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Catégorie</th>
                <th>Date d'achat</th>
                <th>Prix HT (€)</th>
                <th>Durée amort. (ans)</th>
              </tr>
            </thead>
            <tbody>
              {immos.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucune immobilisation</td>
                </tr>
              )}
              {immos.map(i => (
                <tr key={i.id}>
                  <td style={{ fontWeight: 500 }}>{i.nom}</td>
                  <td>
                    <select
                      className="form-select"
                      style={{ width: 180 }}
                      value={i.categorie}
                      onChange={e => handleChange(i.id, 'categorie', e.target.value)}
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td>{fmtDate(i.date_achat)}</td>
                  <td>{fmt(i.prix)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 80 }}
                      value={i.duree}
                      min={1}
                      max={40}
                      onChange={e => handleChange(i.id, 'duree', parseInt(e.target.value) || 1)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <p className="form-label">Validez-vous cette liste d'immobilisations ?</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          Si vous avez acheté un bien &gt; 500 € HT durant l'exercice qui n'apparaît pas ici, contactez votre comptable.
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="liste_validee" checked={listeValidee === true} onChange={() => setListeValidee(true)} />
            Oui, la liste est complète et correcte
          </label>
          <label className="radio-label">
            <input type="radio" name="liste_validee" checked={listeValidee === false} onChange={() => setListeValidee(false)} />
            Non, il manque des éléments
          </label>
        </div>
        {listeValidee === false && (
          <div className="alert-box warning" style={{ marginTop: 'var(--space-md)' }}>
            <AlertTriangle size={18} />
            <span>Veuillez contacter votre comptable pour compléter la liste d'immobilisations.</span>
          </div>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={listeValidee === null}>Valider</button>
      </div>
    </div>
  );
}
