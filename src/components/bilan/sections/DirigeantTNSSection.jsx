import { useState } from 'react';

export default function DirigeantTNSSection({ bilan, onClose }) {
  const saved = bilan?.responses?.dirigeant_tns ?? {};
  const [acre, setAcre] = useState(saved.acre ?? true);
  // remuneration: false = "Non" (a reçu rémunération, confirme que la question est fausse)
  const [confirmeNoRemun, setConfirmeNoRemun] = useState(saved.remuneration === false ? false : null);
  const [precisions, setPrecisions] = useState('');

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Bénéficiez-vous de l'ACRE (aide à la création d'entreprise) ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="acre" checked={acre} onChange={() => setAcre(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="acre" checked={!acre} onChange={() => setAcre(false)} />
            Non
          </label>
        </div>
      </div>

      <div className="card">
        <p style={{ marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          Vous n'avez eu aucunes dépenses catégorisées en "Rémunération du dirigeant" au cours de l'exercice
          précédent.<br />
          Confirmez-vous que le(s) gérant(s) de votre société n'a pas perçu de rémunération ?
        </p>
        <div className="radio-group" style={{ marginBottom: confirmeNoRemun === false ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input
              type="radio"
              name="confirme_no_remun"
              checked={confirmeNoRemun === true}
              onChange={() => setConfirmeNoRemun(true)}
            />
            Oui
          </label>
          <label className="radio-label">
            <input
              type="radio"
              name="confirme_no_remun"
              checked={confirmeNoRemun === false}
              onChange={() => setConfirmeNoRemun(false)}
            />
            Non
          </label>
        </div>
        {confirmeNoRemun === false && (
          <textarea
            className="form-textarea"
            placeholder="Précisez"
            value={precisions}
            onChange={e => setPrecisions(e.target.value)}
          />
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
