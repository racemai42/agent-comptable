import { useState, useEffect } from 'react';
import { Info, Upload, AlertTriangle } from 'lucide-react';
import { api } from '../../../api/client';

export default function EmpruntSection({ bilan, onClose }) {
  const [emprunts, setEmprunts] = useState([]);

  useEffect(() => {
    api.getEmprunts().then(data => setEmprunts(data.map(e => ({ ...e }))));
  }, []);

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const handleChange = (id, field, value) => {
    setEmprunts(prev => prev.map(e => e.id === id ? { ...e, [field]: parseFloat(value) || 0 } : e));
  };

  const totalRemboursement = emprunts.reduce((s, e) => s + (e.total_remboursement || 0), 0);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Vous avez catégorisé des transactions «&nbsp;Remboursement d'emprunt&nbsp;» pour un total
          de <strong>{fmt(totalRemboursement)}</strong>. L'objectif est de ventiler chaque remboursement
          entre la part capital et la part intérêts (+ assurance emprunteur).
        </span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Emprunt</th>
              <th>Total remboursé</th>
              <th>Capital début exercice (€)</th>
              <th>Capital fin exercice (€)</th>
              <th>Échéancier</th>
            </tr>
          </thead>
          <tbody>
            {emprunts.length === 0 && (
              <tr><td colSpan={5} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucun emprunt</td></tr>
            )}
            {emprunts.map(e => {
              const capital = e.capital_debut - e.capital_fin;
              const interets = e.total_remboursement - capital;
              const invalid = interets < 0;
              return (
                <tr key={e.id} style={invalid ? { background: 'var(--warning-light)' } : {}}>
                  <td style={{ fontWeight: 500 }}>{e.nom}</td>
                  <td>{fmt(e.total_remboursement)}</td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 130 }}
                      value={e.capital_debut}
                      onChange={ev => handleChange(e.id, 'capital_debut', ev.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-input"
                      style={{ width: 130 }}
                      value={e.capital_fin}
                      onChange={ev => handleChange(e.id, 'capital_fin', ev.target.value)}
                    />
                  </td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      <Upload size={13} /> Déposer
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {emprunts.map(e => {
        const capital = e.capital_debut - e.capital_fin;
        const interets = e.total_remboursement - capital;
        return interets < 0 ? (
          <div key={e.id} className="alert-box warning">
            <AlertTriangle size={18} />
            <span>
              <strong>{e.nom} :</strong> la différence de capital ({fmt(capital)}) est supérieure
              au total remboursé ({fmt(e.total_remboursement)}). Vérifiez les montants.
            </span>
          </div>
        ) : null;
      })}

      {emprunts.length > 0 && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Récapitulatif ventilation</p>
          {emprunts.map(e => {
            const capital = Math.max(0, e.capital_debut - e.capital_fin);
            const interets = Math.max(0, e.total_remboursement - capital);
            return (
              <div key={e.id} style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                <strong>{e.nom}</strong> — Capital remboursé : {fmt(capital)} · Intérêts : {fmt(interets)}
              </div>
            );
          })}
        </div>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
