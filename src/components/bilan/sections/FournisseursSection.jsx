import { useState, useEffect } from 'react';
import { MoreVertical } from 'lucide-react';
import { api } from '../../../api/mock';

export default function FournisseursSection({ bilan, onClose }) {
  const [lignes, setLignes] = useState([]);

  useEffect(() => {
    api.getFournisseursCutoff().then(data =>
      setLignes(data.map(l => ({ ...l, _concerne_n: l.concerne_n ? 'oui' : '', _concerne_n1: l.concerne_n1 ? 'oui' : '', _pct: l.pct_realise || '' })))
    );
  }, []);

  const debutStr = bilan?.exercice?.debut
    ? new Date(bilan.exercice.debut).toLocaleDateString('fr-FR')
    : '';
  const finStr = bilan?.exercice?.fin
    ? new Date(bilan.exercice.fin).toLocaleDateString('fr-FR')
    : '';
  const finDate = bilan?.exercice?.fin ? new Date(bilan.exercice.fin) : null;
  const nextStart = finDate ? new Date(finDate.getTime() + 86400000) : null;
  const nextEnd = finDate
    ? new Date(new Date(finDate).setFullYear(finDate.getFullYear() + 1))
    : null;
  const nextStartStr = nextStart?.toLocaleDateString('fr-FR') || '';
  const nextEndStr = nextEnd?.toLocaleDateString('fr-FR') || '';

  const update = (id, field, value) =>
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 4 }}>Ces dépenses concernent quels exercices ?</p>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Indiquez pour chacune de ces transactions si elles ont été réalisées au cours de l'exercice ou si elles
          correspondent à une livraison de la période précédente ou suivante. Nous affichons ci-dessous les
          transactions de plus de 500€ effectuées au cours des 3 derniers mois de votre exercice. Vous pouvez
          afficher des transactions plus anciennes en cliquant sur "voir plus".
        </p>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant</th>
                <th>Concerne la période du {debutStr} au {finStr} ?</th>
                <th>Concerne la période du {nextStartStr} au {nextEndStr} ?</th>
                <th>% réalisé sur la période</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.nom}</td>
                  <td>{new Date(l.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {l.montant.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      value={l._concerne_n || ''}
                      onChange={e => update(l.id, '_concerne_n', e.target.value)}
                    >
                      <option value="">Sélection</option>
                      <option value="oui">oui</option>
                      <option value="non">non</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      value={l._concerne_n1 || ''}
                      onChange={e => update(l.id, '_concerne_n1', e.target.value)}
                    >
                      <option value="">Sélection</option>
                      <option value="oui">oui</option>
                      <option value="non">non</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        className="form-input"
                        placeholder="Avancement"
                        value={l._pct || ''}
                        onChange={e => update(l.id, '_pct', e.target.value)}
                        style={{ width: 90, fontSize: '0.85rem' }}
                      />
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>%</span>
                    </div>
                  </td>
                  <td>
                    <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
