import { useState, useEffect } from 'react';
import { Info, Upload } from 'lucide-react';
import { api } from '../../../api/mock';

const REGIMES_FISCAUX = ['IS', 'IR', 'SAS', 'SARL', 'Autre'];

export default function FilialesSection({ bilan, onClose }) {
  const [filiales, setFiliales] = useState([]);
  const [conventionTresorerie, setConventionTresorerie] = useState(bilan?.responses?.filiales?.convention_tresorerie ?? null);

  useEffect(() => {
    api.getFiliales().then(data => setFiliales(data.map(f => ({ ...f, convention: false, taux_interet: '' }))));
  }, []);

  const handleChange = (id, field, value) => {
    setFiliales(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));
  };

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Une filiale est une société dans laquelle votre entreprise détient <strong>au moins 5%</strong> du
          capital ou exerce un contrôle. Les relations financières avec les filiales doivent être documentées.
        </span>
      </div>

      {/* Q1 — Liste filiales */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Liste des filiales</p>
        {filiales.length === 0 && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucune filiale enregistrée</p>
        )}
        <div className="table-wrapper">
          {filiales.length > 0 && (
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>% de détention</th>
                  <th>SIRET</th>
                  <th>Régime fiscal</th>
                  <th>Liasse fiscale</th>
                </tr>
              </thead>
              <tbody>
                {filiales.map(f => (
                  <tr key={f.id}>
                    <td style={{ fontWeight: 500 }}>{f.nom}</td>
                    <td>{f.pct_detention}%</td>
                    <td><code style={{ fontSize: '0.8rem' }}>{f.siren}</code></td>
                    <td>
                      <select
                        className="form-select"
                        style={{ width: 100 }}
                        value={f.regime_fiscal}
                        onChange={e => handleChange(f.id, 'regime_fiscal', e.target.value)}
                      >
                        {REGIMES_FISCAUX.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm">
                        <Upload size={13} /> Déposer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Q2 — Convention de trésorerie */}
      <div className="card">
        <p className="form-label">Avez-vous une convention de trésorerie avec vos filiales ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="convention" checked={conventionTresorerie === true} onChange={() => setConventionTresorerie(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="convention" checked={conventionTresorerie === false} onChange={() => setConventionTresorerie(false)} />
            Non
          </label>
        </div>

        {conventionTresorerie && filiales.length > 0 && (
          <div className="table-wrapper" style={{ marginTop: 'var(--space-md)' }}>
            <table>
              <thead>
                <tr>
                  <th>Filiale</th>
                  <th>Convention</th>
                  <th>Taux d'intérêt (%)</th>
                </tr>
              </thead>
              <tbody>
                {filiales.map(f => (
                  <tr key={f.id}>
                    <td>{f.nom}</td>
                    <td>
                      <label className="radio-label">
                        <input
                          type="checkbox"
                          checked={f.convention}
                          onChange={e => handleChange(f.id, 'convention', e.target.checked)}
                        />
                        Oui
                      </label>
                    </td>
                    <td>
                      {f.convention && (
                        <input
                          type="number"
                          className="form-input"
                          style={{ width: 100 }}
                          value={f.taux_interet}
                          onChange={e => handleChange(f.id, 'taux_interet', e.target.value)}
                          placeholder="Ex: 3.5"
                          step="0.1"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={conventionTresorerie === null}>Valider</button>
      </div>
    </div>
  );
}
