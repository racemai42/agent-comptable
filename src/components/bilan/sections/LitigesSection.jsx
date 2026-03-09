import { useState } from 'react';
import { Info, Plus, Trash2 } from 'lucide-react';

let nextId = 300;

export default function LitigesSection({ bilan, onClose }) {
  const saved = bilan?.responses?.litiges ?? {};
  const [hasLitiges, setHasLitiges] = useState(saved.has_litiges ?? null);
  const [litiges, setLitiges] = useState(
    (saved.litiges ?? []).map((l, i) => ({ ...l, id: i }))
  );

  const addLitige = () => {
    setLitiges(prev => [...prev, { id: nextId++, raison: '', montant: '' }]);
  };

  const updateLitige = (id, field, value) => {
    setLitiges(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const removeLitige = (id) => {
    setLitiges(prev => prev.filter(l => l.id !== id));
  };

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const totalProvision = litiges.reduce((s, l) => s + (parseFloat(l.montant) || 0), 0);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <p>Un litige peut être :</p>
          <ul style={{ paddingLeft: 16, marginTop: 4, lineHeight: 1.8 }}>
            <li>Erreur de commande ou prestation non payée</li>
            <li>Problème avec un salarié (prud'hommes)</li>
            <li>Litige fournisseur ou concurrent</li>
            <li>Procès en cours</li>
          </ul>
          <p style={{ marginTop: 4 }}>
            Si une issue défavorable est probable, une provision pour risque doit être comptabilisée.
          </p>
        </div>
      </div>

      <div className="card">
        <p className="form-label">Avez-vous des litiges en cours à provisionner ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="has_litiges" checked={hasLitiges === true} onChange={() => setHasLitiges(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_litiges" checked={hasLitiges === false} onChange={() => setHasLitiges(false)} />
            Non
          </label>
        </div>

        {hasLitiges && (
          <>
            {litiges.length > 0 && (
              <div className="table-wrapper" style={{ marginTop: 'var(--space-md)' }}>
                <table>
                  <thead>
                    <tr>
                      <th style={{ width: '60%' }}>Raison du litige</th>
                      <th>Montant à provisionner (€)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {litiges.map(l => (
                      <tr key={l.id}>
                        <td>
                          <input
                            className="form-input"
                            value={l.raison}
                            onChange={e => updateLitige(l.id, 'raison', e.target.value)}
                            placeholder="Ex : Litige fournisseur X - facture impayée"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            className="form-input"
                            value={l.montant}
                            onChange={e => updateLitige(l.id, 'montant', e.target.value)}
                            placeholder="0"
                          />
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => removeLitige(l.id)}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-md)' }} onClick={addLitige}>
              <Plus size={13} /> Ajouter un litige
            </button>

            {totalProvision > 0 && (
              <div style={{ marginTop: 'var(--space-md)', padding: 'var(--space-md)', background: 'var(--bg)', borderRadius: 'var(--radius-md)', fontSize: '0.85rem' }}>
                <strong>Total à provisionner :</strong> {fmt(totalProvision)}
              </div>
            )}
          </>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={hasLitiges === null}>Enregistrer</button>
      </div>
    </div>
  );
}
