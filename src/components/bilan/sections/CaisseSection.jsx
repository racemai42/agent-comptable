import { useState, useEffect } from 'react';
import { Paperclip, MoreVertical } from 'lucide-react';
import { api } from '../../../api/mock';

const CATEGORIES_ACHAT = [
  'Vente de marchandises non transformées',
  'Droit au bail',
  'Subventions d\'exploitation',
  'Fournitures de bureau',
  'Repas / restaurant',
  'Carburant',
  'Petit matériel',
  'Autre',
];

const TVA_OPTIONS = [
  { value: '20', label: '20% - France' },
  { value: '10', label: '10% - France' },
  { value: '5.5', label: '5,5% - France' },
  { value: '0', label: '0% - France' },
];

let nextId = 200;

export default function CaisseSection({ bilan, onClose }) {
  const [hasCaisse, setHasCaisse] = useState(bilan?.responses?.caisse?.has_caisse ?? true);
  const [caisses, setCaisses] = useState([]);
  const [achats, setAchats] = useState([
    { id: nextId++, date: '10/08/2024', categorie: CATEGORIES_ACHAT[0], montant: '154,00', tva: '10' },
    { id: nextId++, date: '1/8/2026', categorie: 'Droit au bail', montant: '300,00', tva: '20' },
    { id: nextId++, date: '1/14/2026', categorie: CATEGORIES_ACHAT[2], montant: '300,00', tva: '10' },
    { id: nextId++, date: '', categorie: '', montant: '', tva: '20' },
  ]);

  useEffect(() => {
    api.getCaisses().then(data =>
      setCaisses(data.map(c => ({ ...c, soldeInput: c.solde ? String(c.solde) : '' })))
    );
  }, []);

  const todayStr = new Date().toLocaleDateString('fr-FR');

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous utilisé une caisse pour recevoir les paiements de vos clients ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="has_caisse" checked={hasCaisse} onChange={() => setHasCaisse(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_caisse" checked={!hasCaisse} onChange={() => setHasCaisse(false)} />
            Non
          </label>
        </div>
      </div>

      {hasCaisse && (
        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 4 }}>
            Pouvez-vous nous transmettre votre Z de caisse annuel et votre inventaire de caisse ?
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
            Le Z de caisse correspond au récapitulatif annuel de votre outil de caisse, qui fait apparaître le total
            des ventes par nature (ou par taux de TVA) et par moyen d'encaissement (espèces, carte de crédit, etc.).
            L'inventaire de caisse détaille le solde de votre caisse en nombre de pièces et de billets
          </p>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Solde à la date de clôture (montant en €)</th>
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
                        className="form-input"
                        placeholder="Montant"
                        value={c.soldeInput || (c.solde ? String(c.solde) : '')}
                        onChange={e =>
                          setCaisses(prev =>
                            prev.map(x => x.id === c.id ? { ...x, soldeInput: e.target.value } : x)
                          )
                        }
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                      >
                        <Paperclip size={14} /> Ajouter le Z de caisse
                      </button>
                    </td>
                    <td>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}
                      >
                        <Paperclip size={14} /> Ajouter l'inventaire de caisse
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous réalisé des achats avec les espèces présentes en caisse ?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-md)' }}>
          <button className="btn btn-primary" onClick={onClose}>Valider</button>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Date de l'achat</th>
                <th>Catégorie</th>
                <th>Montant TTC</th>
                <th>TVA</th>
                <th>Facture</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {achats.map(a => (
                <tr key={a.id}>
                  <td>
                    <input
                      className="form-input"
                      value={a.date || todayStr}
                      onChange={e => setAchats(prev => prev.map(x => x.id === a.id ? { ...x, date: e.target.value } : x))}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={a.categorie}
                      onChange={e => setAchats(prev => prev.map(x => x.id === a.id ? { ...x, categorie: e.target.value } : x))}
                    >
                      <option value="">Type</option>
                      {CATEGORIES_ACHAT.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Montant"
                      value={a.montant}
                      onChange={e => setAchats(prev => prev.map(x => x.id === a.id ? { ...x, montant: e.target.value } : x))}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={a.tva}
                      onChange={e => setAchats(prev => prev.map(x => x.id === a.id ? { ...x, tva: e.target.value } : x))}
                    >
                      {TVA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </td>
                  <td>
                    <Paperclip size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </td>
                  <td>
                    <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
          <button
            className="btn btn-primary btn-sm"
            onClick={() =>
              setAchats(prev => [...prev, { id: nextId++, date: '', categorie: '', montant: '', tva: '20' }])
            }
          >
            Ajouter
          </button>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
