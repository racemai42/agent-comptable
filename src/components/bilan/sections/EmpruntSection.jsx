import { useState, useEffect } from 'react';
import { Info, Paperclip } from 'lucide-react';
import { api } from '../../../api/mock';

export default function EmpruntSection({ bilan, onClose }) {
  const [emprunts, setEmprunts] = useState([]);
  const [capitals, setCapitals] = useState({});

  useEffect(() => {
    api.getEmprunts().then(data => {
      setEmprunts(data);
      const init = {};
      data.forEach(e => { init[e.id] = { debut: '', fin: '' }; });
      setCapitals(init);
    });
  }, []);

  const debutStr = bilan?.exercice?.debut
    ? new Date(bilan.exercice.debut).toLocaleDateString('fr-FR')
    : '';
  const finStr = bilan?.exercice?.fin
    ? new Date(bilan.exercice.fin).toLocaleDateString('fr-FR')
    : '';

  const total = emprunts.reduce((s, e) => s + (e.total_remboursement || 0), 0);

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 700, marginBottom: 'var(--space-md)' }}>
          Renseignez pour chaque emprunt le capital dû au début de l'exercice et le capital restant dû à la date de
          clôture
        </p>

        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              Vous avez catégorisé {emprunts.length} transactions en "Remboursement d'emprunt", pour un total de{' '}
              {total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€.<br />
              L'objectif de la question ci-dessous est de ventiler ces{' '}
              {total.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€ entre
              remboursement de capital et intérêts d'emprunt (et éventuelle assurance emprunteur).
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Total remboursement sur l'exercice</th>
                <th>Capital restant dû au {debutStr}</th>
                <th>Capital restant dû au {finStr}</th>
                <th>Échéancier</th>
              </tr>
            </thead>
            <tbody>
              {emprunts.map(e => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.nom}</td>
                  <td>
                    {e.total_remboursement != null
                      ? e.total_remboursement.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : ''}
                  </td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Montant"
                      value={capitals[e.id]?.debut || ''}
                      onChange={ev =>
                        setCapitals(prev => ({ ...prev, [e.id]: { ...prev[e.id], debut: ev.target.value } }))
                      }
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Montant"
                      value={capitals[e.id]?.fin || ''}
                      onChange={ev =>
                        setCapitals(prev => ({ ...prev, [e.id]: { ...prev[e.id], fin: ev.target.value } }))
                      }
                    />
                  </td>
                  <td>
                    <div
                      style={{
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '6px 10px',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        cursor: 'pointer',
                      }}
                    >
                      <Paperclip size={16} color="var(--text-muted)" />
                    </div>
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
