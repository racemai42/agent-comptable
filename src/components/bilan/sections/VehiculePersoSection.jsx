import { useState, useEffect } from 'react';
import { api } from '../../../api/mock';

export default function VehiculePersoSection({ bilan, onClose }) {
  const [vehicules, setVehicules] = useState([]);
  const [ikCorrect, setIkCorrect] = useState(bilan?.responses?.vehicule_perso?.ik_correct ?? true);

  useEffect(() => { api.getVehiculesPerso().then(setVehicules); }, []);

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Vos véhicules personnels et les kilomètres parcourus cette année
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
          {vehicules.map(v => (
            <div
              key={v.id}
              style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)' }}
            >
              <div style={{ fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>{v.nom}</div>
              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                {v.km.toLocaleString('fr-FR')} km pour {v.montant_ik.toLocaleString('fr-FR')}€
              </div>
            </div>
          ))}
        </div>
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
          Confirmez-vous que le ou les montant(s) des indemnités kilométriques indiqué(s) sont corrects ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="ik_correct" checked={ikCorrect} onChange={() => setIkCorrect(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="ik_correct" checked={!ikCorrect} onChange={() => setIkCorrect(false)} />
            Non
          </label>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
