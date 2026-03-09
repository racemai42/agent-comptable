import { useState, useEffect } from 'react';
import { Info, Paperclip, MoreVertical, FileText } from 'lucide-react';
import { api } from '../../../api/mock';

const REGIMES_FISCAUX = ['Régime fiscal', 'IS', 'IR', 'BNC', 'BIC', 'Autre'];

export default function FilialesSection({ bilan, onClose }) {
  const [filiales, setFiliales] = useState([]);
  const [conventionTresorerie, setConventionTresorerie] = useState(
    bilan?.responses?.filiales?.convention_tresorerie ?? true
  );

  useEffect(() => {
    api.getFiliales().then(data =>
      setFiliales(data.map(f => ({ ...f, _pct: f.pct_detention || '', _siret: f.siren || '', _regime: f.regime_fiscal || '', _convention: 'Oui / non', _taux: '' })))
    );
  }, []);

  const update = (id, field, value) =>
    setFiliales(prev => prev.map(f => f.id === id ? { ...f, [field]: value } : f));

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Pour ces filiales indiquez quel est le pourcentage de détention par votre société :
        </p>

        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              Vous avez {filiales.length} filiale(s) enregistrée(s) sur LegalPlace Pro.<br />
              Pour être considéré comme une filiale, votre société doit détenir au moins 5% du capital ou exercer un
              contrôle sur celle-ci.
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>% de détention</th>
                <th>Siret</th>
                <th>Régime fiscal</th>
                <th>Liasse fiscale</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filiales.map(f => (
                <tr key={f.id}>
                  <td style={{ fontWeight: 500 }}>{f.nom}</td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="%"
                      value={f._pct}
                      onChange={e => update(f.id, '_pct', e.target.value)}
                      style={{ width: 70 }}
                    />
                  </td>
                  <td>
                    <input
                      className="form-input"
                      placeholder="Siret"
                      value={f._siret}
                      onChange={e => update(f.id, '_siret', e.target.value)}
                    />
                  </td>
                  <td>
                    <select
                      className="form-select"
                      value={f._regime}
                      onChange={e => update(f.id, '_regime', e.target.value)}
                    >
                      {REGIMES_FISCAUX.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </td>
                  <td>
                    {f._regime && f._regime !== 'Régime fiscal' ? (
                      <FileText size={18} color="var(--primary)" style={{ cursor: 'pointer' }} />
                    ) : (
                      <Paperclip size={18} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                    )}
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

      <div className="drawer-footer" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {/* Convention de trésorerie */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous signé une convention de trésorerie entre votre société et votre / vos filiale(s) ?
        </p>
        <div className="radio-group" style={{ marginBottom: conventionTresorerie ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input
              type="radio"
              name="convention_tresorerie"
              checked={conventionTresorerie}
              onChange={() => setConventionTresorerie(true)}
            />
            Oui
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="convention_tresorerie"
              checked={!conventionTresorerie}
              onChange={() => setConventionTresorerie(false)}
            />
            Non
          </label>
        </div>

        {conventionTresorerie && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Convention</th>
                  <th>Taux d'intérêt</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filiales.map(f => (
                  <tr key={f.id}>
                    <td>{f.nom}</td>
                    <td>
                      <select
                        className="form-select"
                        value={f._convention}
                        onChange={e => update(f.id, '_convention', e.target.value)}
                      >
                        <option value="Oui / non">Oui / non</option>
                        <option value="Oui">Oui</option>
                        <option value="Non">Non</option>
                      </select>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <input
                          className="form-input"
                          placeholder="%"
                          value={f._taux}
                          onChange={e => update(f.id, '_taux', e.target.value)}
                          style={{ width: 80 }}
                        />
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>%</span>
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
        )}
      </div>
    </div>
  );
}
