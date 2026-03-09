import { useState, useEffect } from 'react';
import { Info, Truck } from 'lucide-react';
import { api } from '../../../api/client';

const AVANTAGE_METHODES = [
  { value: 'forfait', label: 'Forfait 8% du coût d\'acquisition' },
  { value: 'reel', label: 'Dépenses réellement engagées' },
];

export default function VehiculeProSection({ bilan, onClose }) {
  const [vehicules, setVehicules] = useState([]);
  const [infoConfirmee, setInfoConfirmee] = useState(bilan?.responses?.vehicule_pro?.info_confirmee ?? null);
  const [assures, setAssures] = useState(bilan?.responses?.vehicule_pro?.assures ?? null);
  const [usagePerso, setUsagePerso] = useState(bilan?.responses?.vehicule_pro?.usage_perso ?? null);
  const [methodeAEN, setMethodeAEN] = useState(bilan?.responses?.vehicule_pro?.methode_aen ?? 'forfait');
  const [tvaCompris, setTvaCompris] = useState(false);

  useEffect(() => {
    api.getVehiculesPro().then(data => setVehicules(data.map(v => ({ ...v }))));
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Ces informations sont nécessaires pour calculer la <strong>TVS (Taxe sur les Véhicules de Société)</strong> et
          la durée d'immobilisation de chaque véhicule professionnel.
        </span>
      </div>

      {/* Liste véhicules */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Véhicules professionnels</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Type</th>
                <th>Immatriculation</th>
                <th>Véhicule</th>
                <th>Informations</th>
              </tr>
            </thead>
            <tbody>
              {vehicules.length === 0 && (
                <tr><td colSpan={4} style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Aucun véhicule pro</td></tr>
              )}
              {vehicules.map(v => (
                <tr key={v.id}>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Truck size={14} />
                      {v.type}
                    </span>
                  </td>
                  <td><code style={{ fontSize: '0.8rem' }}>{v.immatriculation}</code></td>
                  <td>{v.nom}</td>
                  <td>
                    <span className={`status-badge status-${v.complet ? 'complete' : 'error'}`}>
                      {v.complet ? 'Complet' : 'Incomplet'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Q1 — Confirmation infos */}
      <div className="card">
        <p className="form-label">Confirmez-vous les informations des véhicules ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="info_confirmee" checked={infoConfirmee === true} onChange={() => setInfoConfirmee(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="info_confirmee" checked={infoConfirmee === false} onChange={() => setInfoConfirmee(false)} />
            Non, il y a des erreurs
          </label>
        </div>
      </div>

      {/* Q2 — Assurance */}
      <div className="card">
        <p className="form-label">Tous vos véhicules professionnels sont-ils assurés ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="assures" checked={assures === true} onChange={() => setAssures(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="assures" checked={assures === false} onChange={() => setAssures(false)} />
            Non
          </label>
        </div>
      </div>

      {/* Q3 — Usage personnel */}
      <div className="card">
        <p className="form-label">Utilisez-vous parfois ce(s) véhicule(s) pour des déplacements personnels ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="usage_perso" checked={usagePerso === true} onChange={() => setUsagePerso(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="usage_perso" checked={usagePerso === false} onChange={() => setUsagePerso(false)} />
            Non
          </label>
        </div>
        {usagePerso && (
          <div style={{ marginTop: 'var(--space-md)' }}>
            <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
              Méthode de calcul de l'avantage en nature
            </p>
            {AVANTAGE_METHODES.map(m => (
              <label key={m.value} className="radio-label" style={{ marginBottom: 'var(--space-sm)', display: 'block' }}>
                <input
                  type="radio"
                  name="methode_aen"
                  value={m.value}
                  checked={methodeAEN === m.value}
                  onChange={() => setMethodeAEN(m.value)}
                />
                {m.label}
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Info TVA */}
      <div className="alert-box warning">
        <Info size={18} />
        <div>
          <strong>Rappel TVA véhicules</strong>
          <p style={{ marginTop: 4, fontSize: '0.85rem' }}>
            Il est interdit de déduire la TVA sur l'achat, l'entretien ou le leasing d'un véhicule de société
            destiné au transport de personnes.
          </p>
          <label className="checkbox-label" style={{ marginTop: 'var(--space-sm)' }}>
            <input type="checkbox" checked={tvaCompris} onChange={e => setTvaCompris(e.target.checked)} />
            J'ai compris
          </label>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button
          className="btn btn-primary"
          onClick={onClose}
          disabled={infoConfirmee === null || assures === null || usagePerso === null || !tvaCompris}
        >
          Valider
        </button>
      </div>
    </div>
  );
}
