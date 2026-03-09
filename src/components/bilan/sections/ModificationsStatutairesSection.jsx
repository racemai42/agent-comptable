import { useState } from 'react';
import { Info, Upload } from 'lucide-react';

const CHANGEMENTS_OPTIONS = [
  { value: 'siege_social', label: 'Changement de siège social' },
  { value: 'dirigeant', label: 'Changement de dirigeant(s)' },
  { value: 'vente_parts', label: 'Vente de parts sociales / actions' },
  { value: 'capital', label: 'Augmentation ou diminution de capital' },
  { value: 'objet_social', label: "Changement d'objet social (activité)" },
  { value: 'raison_sociale', label: 'Changement de raison sociale (nom)' },
  { value: 'aucun', label: 'Aucun des choix ci-dessus' },
];

const METHODE_OPTIONS = [
  { value: 'legalplace', label: 'Avec LegalPlace' },
  { value: 'seul', label: 'Seul' },
  { value: 'autre', label: 'Autre' },
];

export default function ModificationsStatutairesSection({ bilan, onClose }) {
  const saved = bilan?.responses?.modifications_statutaires ?? {};
  const [changements, setChangements] = useState(saved.changements ?? []);
  const [methode, setMethode] = useState(saved.methode ?? '');
  const [methodeDetail, setMethodeDetail] = useState('');

  const toggleChangement = (val) => {
    if (val === 'aucun') {
      setChangements(['aucun']);
      return;
    }
    setChangements(prev => {
      const without_aucun = prev.filter(c => c !== 'aucun');
      return without_aucun.includes(val)
        ? without_aucun.filter(c => c !== val)
        : [...without_aucun, val];
    });
  };

  const hasChangements = changements.length > 0 && !changements.includes('aucun');

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Toute modification statutaire doit être documentée et peut avoir des conséquences comptables
          (augmentation de capital, cession de parts, etc.).
        </span>
      </div>

      {/* Q1 — Type de changements */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
          Quelles opérations ont été effectuées durant l'exercice ?
        </p>
        <div className="checkbox-group vertical">
          {CHANGEMENTS_OPTIONS.map(o => (
            <label key={o.value} className="checkbox-label">
              <input
                type="checkbox"
                checked={changements.includes(o.value)}
                onChange={() => toggleChangement(o.value)}
              />
              {o.label}
            </label>
          ))}
        </div>
      </div>

      {/* Q2 — Comment réalisé */}
      {hasChangements && (
        <div className="card">
          <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
            Comment ces modifications ont-elles été réalisées ?
          </p>
          <div className="radio-group vertical">
            {METHODE_OPTIONS.map(m => (
              <label key={m.value} className="radio-label">
                <input
                  type="radio"
                  name="methode"
                  value={m.value}
                  checked={methode === m.value}
                  onChange={() => setMethode(m.value)}
                />
                {m.label}
              </label>
            ))}
          </div>
          {methode === 'autre' && (
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Précisez</label>
              <input
                className="form-input"
                value={methodeDetail}
                onChange={e => setMethodeDetail(e.target.value)}
                placeholder="Ex : Cabinet de notaire..."
              />
            </div>
          )}
        </div>
      )}

      {/* Q3 — PV d'AG ou actes */}
      {hasChangements && (
        <div className="card">
          <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
            Joindre le PV d'Assemblée Générale ou les actes de cession
          </p>
          <div className="upload-zone">
            <Upload size={18} style={{ marginRight: 8 }} />
            Déposer les documents (PDF, PNG, JPEG)
          </div>
        </div>
      )}

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
