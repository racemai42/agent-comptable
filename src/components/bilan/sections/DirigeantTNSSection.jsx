import { useState } from 'react';
import { Info } from 'lucide-react';

export default function DirigeantTNSSection({ bilan, onClose }) {
  const saved = bilan?.responses?.dirigeant_tns ?? {};
  const [acre, setAcre] = useState(saved.acre ?? null);
  const [remuneration, setRemuneration] = useState(saved.remuneration ?? null);
  const [precisions, setPrecisions] = useState('');

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          En tant que dirigeant TNS (travailleur non salarié), vos cotisations sociales sont calculées
          sur la base de votre rémunération. Ces informations permettent de valider le traitement
          comptable de votre statut sur l'exercice.
        </span>
      </div>

      {/* Q1 — ACRE */}
      <div className="card">
        <p className="form-label">Bénéficiez-vous de l'ACRE ?</p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          L'ACRE (Aide à la Création ou Reprise d'Entreprise) permet une exonération partielle de
          cotisations sociales pendant la première année d'activité.
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="acre" checked={acre === true} onChange={() => setAcre(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="acre" checked={acre === false} onChange={() => setAcre(false)} />
            Non
          </label>
        </div>
        {acre && (
          <div className="info-box" style={{ marginTop: 'var(--space-md)' }}>
            <Info size={16} />
            <span>
              L'ACRE sera prise en compte dans le calcul de vos cotisations TNS pour l'exercice.
            </span>
          </div>
        )}
      </div>

      {/* Q2 — Rémunération */}
      <div className="card">
        <p className="form-label">
          Confirmez-vous que le gérant n'a pas perçu de rémunération durant l'exercice ?
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="remuneration" checked={remuneration === false} onChange={() => setRemuneration(false)} />
            Oui, aucune rémunération perçue
          </label>
          <label className="radio-label">
            <input type="radio" name="remuneration" checked={remuneration === true} onChange={() => setRemuneration(true)} />
            Non, une rémunération a été perçue
          </label>
        </div>
        {remuneration === true && (
          <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
            <label className="form-label">Précisez</label>
            <textarea
              className="form-textarea"
              value={precisions}
              onChange={e => setPrecisions(e.target.value)}
              placeholder="Indiquez le montant et la nature de la rémunération perçue..."
            />
          </div>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={acre === null || remuneration === null}>Valider</button>
      </div>
    </div>
  );
}
