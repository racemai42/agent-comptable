import { useState, useEffect } from 'react';
import { Info, Car } from 'lucide-react';
import { api } from '../../../api/client';

export default function VehiculePersoSection({ bilan, onClose }) {
  const [vehicules, setVehicules] = useState([]);
  const [ikCorrect, setIkCorrect] = useState(bilan?.responses?.vehicule_perso?.ik_correct ?? null);

  useEffect(() => {
    api.getVehiculesPerso().then(setVehicules);
  }, []);

  const fmt = (n) => n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Les indemnités kilométriques (IK) sont calculées d'après le barème fiscal selon le nombre de km parcourus
          avec votre véhicule personnel à des fins professionnelles.
        </span>
      </div>

      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
          Véhicules personnels utilisés à des fins professionnelles
        </p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Véhicule</th>
                <th>Immatriculation</th>
                <th>Km parcourus</th>
                <th>Montant IK</th>
              </tr>
            </thead>
            <tbody>
              {vehicules.length === 0 && (
                <tr><td colSpan={4} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucun véhicule</td></tr>
              )}
              {vehicules.map(v => (
                <tr key={v.id}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Car size={14} />
                      {v.nom}
                    </span>
                  </td>
                  <td><code style={{ fontSize: '0.8rem' }}>{v.immatriculation}</code></td>
                  <td>{v.km.toLocaleString('fr-FR')} km</td>
                  <td style={{ fontWeight: 600 }}>{fmt(v.montant_ik)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card">
        <p className="form-label">
          Confirmez-vous que le(s) montant(s) des indemnités kilométriques sont corrects ?
        </p>
        <div className="radio-group" style={{ marginTop: 'var(--space-sm)' }}>
          <label className="radio-label">
            <input type="radio" name="ik_correct" checked={ikCorrect === true} onChange={() => setIkCorrect(true)} />
            Oui, je confirme
          </label>
          <label className="radio-label">
            <input type="radio" name="ik_correct" checked={ikCorrect === false} onChange={() => setIkCorrect(false)} />
            Non, les montants sont incorrects
          </label>
        </div>
        {ikCorrect === false && (
          <div className="alert-box warning" style={{ marginTop: 'var(--space-md)' }}>
            <Info size={18} />
            <span>Veuillez contacter votre comptable pour corriger les montants des IK.</span>
          </div>
        )}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={ikCorrect === null}>Valider</button>
      </div>
    </div>
  );
}
