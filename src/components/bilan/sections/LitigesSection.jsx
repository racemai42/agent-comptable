import { useState } from 'react';
import { Info } from 'lucide-react';

let nextId = 300;

export default function LitigesSection({ bilan, onClose }) {
  const saved = bilan?.responses?.litiges ?? {};
  const [hasLitiges, setHasLitiges] = useState(saved.has_litiges ?? true);
  const [litiges, setLitiges] = useState(
    (saved.litiges ?? [{ raison: 'eyeyte', montant: 300 }, { raison: 'Test', montant: 100 }]).map((l, i) => ({
      ...l,
      id: i,
    }))
  );
  const [newRaison, setNewRaison] = useState('');
  const [newMontant, setNewMontant] = useState('');

  const handleSave = () => {
    if (newRaison) {
      setLitiges(prev => [...prev, { id: nextId++, raison: newRaison, montant: newMontant }]);
      setNewRaison('');
      setNewMontant('');
    }
  };

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Exemples de litiges : erreur de commande livrée, prestation client non payée, problèmes avec un salarié,
            litige avec un fournisseur ou un concurrent, procès, mise en cause de votre responsabilité, ...
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous des litiges en cours (avec un client, fournisseur ou salarié), pour lesquels vous souhaiteriez
          provisionner le risque ?
        </p>
        <div className="radio-group" style={{ marginBottom: hasLitiges ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="has_litiges" checked={hasLitiges} onChange={() => setHasLitiges(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_litiges" checked={!hasLitiges} onChange={() => setHasLitiges(false)} />
            Non
          </label>
        </div>

        {hasLitiges && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Raison du litige</th>
                  <th>Montant à provisionner</th>
                </tr>
              </thead>
              <tbody>
                {litiges.map(l => (
                  <tr key={l.id}>
                    <td>
                      <input
                        className="form-input"
                        value={l.raison}
                        onChange={e =>
                          setLitiges(prev => prev.map(x => x.id === l.id ? { ...x, raison: e.target.value } : x))
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="form-input"
                        value={l.montant ? `€${l.montant}` : ''}
                        onChange={e =>
                          setLitiges(prev => prev.map(x => x.id === l.id ? { ...x, montant: e.target.value.replace('€', '') } : x))
                        }
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Raison"
                      value={newRaison}
                      onChange={e => setNewRaison(e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="€"
                      value={newMontant}
                      onChange={e => setNewMontant(e.target.value)}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <button className="btn btn-primary btn-sm" onClick={handleSave}>
                Enregistrer
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
