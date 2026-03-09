import { useState, useEffect } from 'react';
import { Info } from 'lucide-react';
import { api } from '../../../api/mock';

const EXERCICE_OPTIONS = [
  { value: 'n', label: 'Exercice N' },
  { value: 'n1', label: 'Exercice N+1' },
  { value: 'both', label: 'Les deux' },
];

export default function FournisseursSection({ bilan, onClose }) {
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    api.getFournisseursCutoff().then(data =>
      setLignes(data.map(l => ({ ...l })))
    );
  }, []);

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR');

  const handleChange = (id, field, value) => {
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const totalCCA = lignes
    .filter(l => l.concerne_n1)
    .reduce((s, l) => s + l.montant * (1 - (l.pct_realise || 100) / 100), 0);

  const totalFNP = lignes
    .filter(l => l.concerne_n && !l.date_facture_recue)
    .reduce((s, l) => s + l.montant * ((l.pct_realise || 100) / 100), 0);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Ces dépenses concernent quels exercices ? Nous affichons par défaut toutes les transactions
          de plus de <strong>500 €</strong> des <strong>3 derniers mois</strong> avant la clôture.
          Les réponses permettent de calculer les <em>Charges Constatées d'Avance</em> (CCA) et
          les <em>Factures Non Parvenues</em> (FNP).
        </span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Fournisseur</th>
              <th>Date</th>
              <th>Montant TTC</th>
              <th>Exercice concerné</th>
              <th>% réalisé sur N</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {lignes.length === 0 && (
              <tr>
                <td colSpan={6} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>
                  Aucune transaction concernée
                </td>
              </tr>
            )}
            {lignes.map(l => (
              <tr key={l.id}>
                <td style={{ fontWeight: 500 }}>{l.nom}</td>
                <td>{fmtDate(l.date)}</td>
                <td>{fmt(l.montant)}</td>
                <td>
                  <select
                    className="form-select"
                    style={{ width: 140 }}
                    value={l.concerne_n1 ? (l.concerne_n ? 'both' : 'n1') : 'n'}
                    onChange={ev => {
                      const v = ev.target.value;
                      handleChange(l.id, 'concerne_n', v === 'n' || v === 'both');
                      handleChange(l.id, 'concerne_n1', v === 'n1' || v === 'both');
                    }}
                  >
                    {EXERCICE_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </td>
                <td>
                  {(l.concerne_n && l.concerne_n1) ? (
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 80 }}
                      min={0}
                      max={100}
                      value={l.pct_realise}
                      onChange={ev => handleChange(l.id, 'pct_realise', parseInt(ev.target.value) || 0)}
                    />
                  ) : (
                    <span style={{ color: 'var(--text-muted)' }}>—</span>
                  )}
                </td>
                <td>
                  <span className={`status-badge status-${l.statut === 'validé' ? 'complete' : 'pending'}`}>
                    {l.statut === 'validé' ? 'Validé' : 'En attente'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(totalCCA > 0 || totalFNP > 0) && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Impact comptable estimé</p>
          {totalCCA > 0 && (
            <div style={{ fontSize: '0.85rem', marginBottom: 4 }}>
              <strong>CCA (Charges Constatées d'Avance) :</strong> {fmt(totalCCA)}
            </div>
          )}
          {totalFNP > 0 && (
            <div style={{ fontSize: '0.85rem' }}>
              <strong>FNP (Factures Non Parvenues) :</strong> {fmt(totalFNP)}
            </div>
          )}
        </div>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
