import { useState } from 'react';
import { Info, Upload } from 'lucide-react';

export default function GarantieDecennaleSection({ bilan, onClose }) {
  const saved = bilan?.responses?.garantie_decennale ?? {};
  const [sinistres, setSinistres] = useState(saved.sinistres ?? null);
  const [montantSinistre, setMontantSinistre] = useState(saved.montant_sinistre ?? '');
  const [descriptionSinistre, setDescriptionSinistre] = useState(saved.description_sinistre ?? '');

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          La garantie décennale est <strong>obligatoire</strong> pour toute entreprise du secteur BTP.
          Elle couvre les dommages compromettant la solidité de l'ouvrage pendant 10 ans après réception des travaux.
        </span>
      </div>

      {/* Q1 — Échéancier */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
          Joindre l'échéancier de garantie décennale
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Document fourni par votre assureur, détaillant les primes dues et les périodes couvertes.
        </p>
        <div className="upload-zone">
          <Upload size={18} style={{ marginRight: 8 }} />
          Déposer l'échéancier (PDF, JPEG, CSV, XLS)
        </div>
      </div>

      {/* Q2 — Sinistres */}
      <div className="card">
        <p className="form-label">Avez-vous eu des sinistres sur des chantiers durant l'exercice ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="sinistres" checked={sinistres === true} onChange={() => setSinistres(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="sinistres" checked={sinistres === false} onChange={() => setSinistres(false)} />
            Non
          </label>
        </div>

        {sinistres && (
          <>
            <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
              <label className="form-label">Montant à provisionner (€)</label>
              <input
                type="number"
                className="form-input"
                value={montantSinistre}
                onChange={e => setMontantSinistre(e.target.value)}
                placeholder="Ex : 5000"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Description du sinistre</label>
              <textarea
                className="form-textarea"
                value={descriptionSinistre}
                onChange={e => setDescriptionSinistre(e.target.value)}
                placeholder="Décrivez la nature et l'étendue du sinistre..."
              />
            </div>
          </>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={sinistres === null}>Valider</button>
      </div>
    </div>
  );
}
