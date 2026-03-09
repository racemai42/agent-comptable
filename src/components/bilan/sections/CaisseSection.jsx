import { useState, useEffect } from 'react';
import { Info, Upload, Plus, Trash2 } from 'lucide-react';
import { api } from '../../../api/client';

const TVA_OPTIONS = ['20%', '10%', '5,5%', '0%'];
const CATEGORIES_ACHAT = [
  'Fournitures de bureau',
  'Repas / restaurant',
  'Carburant',
  'Petit matériel',
  'Autre',
];

let nextId = 200;

export default function CaisseSection({ bilan, onClose }) {
  const [hasCaisse, setHasCaisse] = useState(bilan?.responses?.caisse?.has_caisse ?? null);
  const [caisses, setCaisses] = useState([]);
  const [achats, setAchats] = useState([]);

  useEffect(() => {
    api.getCaisses().then(data => setCaisses(data.map(c => ({ ...c }))));
  }, []);

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const handleSoldeChange = (id, value) => {
    setCaisses(prev => prev.map(c => c.id === id ? { ...c, solde: parseFloat(value) || 0 } : c));
  };

  const addAchat = () => {
    setAchats(prev => [...prev, {
      id: nextId++, date: '', categorie: CATEGORIES_ACHAT[0], montant: '', tva: '20%'
    }]);
  };

  const updateAchat = (id, field, value) => {
    setAchats(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAchat = (id) => {
    setAchats(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Si vous utilisez une caisse enregistreuse ou une caisse physique, indiquez le solde
          à la date de clôture et joignez le Z de caisse et l'inventaire correspondants.
        </span>
      </div>

      {/* Q1 */}
      <div className="card">
        <p className="form-label">Utilisez-vous une caisse ?</p>
        <div className="radio-group" style={{ marginTop: 'var(--space-sm)' }}>
          <label className="radio-label">
            <input type="radio" name="has_caisse" checked={hasCaisse === true} onChange={() => setHasCaisse(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_caisse" checked={hasCaisse === false} onChange={() => setHasCaisse(false)} />
            Non
          </label>
        </div>
      </div>

      {hasCaisse && (
        <>
          {/* Q2 — Tableau caisses */}
          <div className="card">
            <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Caisses à la clôture</p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom de la caisse</th>
                    <th>Solde à la clôture (€)</th>
                    <th>Z de caisse</th>
                    <th>Inventaire de caisse</th>
                  </tr>
                </thead>
                <tbody>
                  {caisses.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 500 }}>{c.nom}</td>
                      <td>
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: 120 }}
                          value={c.solde}
                          onChange={e => handleSoldeChange(c.id, e.target.value)}
                        />
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm">
                          <Upload size={13} /> Z de caisse
                        </button>
                      </td>
                      <td>
                        <button className="btn btn-outline btn-sm">
                          <Upload size={13} /> Inventaire
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Q3 — Achats en espèces */}
          <div className="card">
            <p className="form-label" style={{ marginBottom: 'var(--space-xs)' }}>
              Achats réglés en espèces depuis la caisse
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
              Renseignez les achats payés directement depuis la caisse (hors virement/carte).
            </p>
            {achats.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Catégorie</th>
                      <th>Montant TTC (€)</th>
                      <th>TVA</th>
                      <th>Facture</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {achats.map(a => (
                      <tr key={a.id}>
                        <td>
                          <input type="date" className="form-input" value={a.date} onChange={e => updateAchat(a.id, 'date', e.target.value)} />
                        </td>
                        <td>
                          <select className="form-select" value={a.categorie} onChange={e => updateAchat(a.id, 'categorie', e.target.value)}>
                            {CATEGORIES_ACHAT.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </td>
                        <td>
                          <input type="number" className="form-input" value={a.montant} onChange={e => updateAchat(a.id, 'montant', e.target.value)} />
                        </td>
                        <td>
                          <select className="form-select" style={{ width: 80 }} value={a.tva} onChange={e => updateAchat(a.id, 'tva', e.target.value)}>
                            {TVA_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm"><Upload size={13} /></button>
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => removeAchat(a.id)}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={addAchat}>
              <Plus size={13} /> Ajouter un achat
            </button>
          </div>
        </>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={hasCaisse === null}>Valider</button>
      </div>
    </div>
  );
}
