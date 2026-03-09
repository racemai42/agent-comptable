import { useState, useEffect } from 'react';
import { Info, Car, Truck, Tag, Paperclip } from 'lucide-react';
import { api } from '../../../api/mock';

export default function VehiculeProSection({ bilan, onClose }) {
  const [vehicules, setVehicules] = useState([]);
  const [infoConfirmee, setInfoConfirmee] = useState(bilan?.responses?.vehicule_pro?.info_confirmee ?? null);
  const [assures, setAssures] = useState(bilan?.responses?.vehicule_pro?.assures ?? true);
  const [usagePerso, setUsagePerso] = useState(bilan?.responses?.vehicule_pro?.usage_perso ?? true);
  const [methode, setMethode] = useState('forfait');
  const [tvaCompris, setTvaCompris] = useState(false);
  const [deductibilite, setDeductibilite] = useState({});

  useEffect(() => {
    api.getVehiculesPro().then(data => {
      setVehicules(data);
      const init = {};
      data.forEach(v => { init[v.id] = ''; });
      setDeductibilite(init);
    });
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Ces informations sont nécessaires pour calculer le montant de la TVS (Taxe Véhicules de Société) et
            la durée d'immobilisation de votre véhicule.
          </div>
        </div>
      </div>

      {/* Vehicle list */}
      <div style={{ marginBottom: 'var(--space-md)' }}>
        {vehicules.map(v => (
          <div
            key={v.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border)',
              gap: 'var(--space-md)',
            }}
          >
            <div style={{ color: 'var(--text-secondary)' }}>
              {v.type === 'Camionette' ? <Truck size={20} /> : <Car size={20} />}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{v.nom}</span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    padding: '2px 8px',
                    borderRadius: 12,
                    background: v.complet ? '#dcfce7' : '#fff7ed',
                    color: v.complet ? 'var(--success)' : '#c2410c',
                  }}
                >
                  {v.complet ? 'Informations complètes' : 'Informations incomplètes'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-md)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Car size={12} /> {v.type}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Tag size={12} /> {v.immatriculation}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
              <button className="btn btn-outline btn-sm">Détails</button>
              <button className="btn btn-outline btn-sm">Modifier</button>
            </div>
          </div>
        ))}
      </div>

      {/* Q1 */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Pouvez-vous nous confirmer les informations à propos de ce véhicule ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="info_confirmee" checked={infoConfirmee === true} onChange={() => setInfoConfirmee(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="info_confirmee" checked={infoConfirmee === false} onChange={() => setInfoConfirmee(false)} />
            Non
          </label>
        </div>
      </div>

      {/* Q2 */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Confirmez-vous que tous vos véhicules professionnels sont assurés ?
        </p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="assures" checked={assures} onChange={() => setAssures(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="assures" checked={!assures} onChange={() => setAssures(false)} />
            Non
          </label>
        </div>
      </div>

      {/* Q3 */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Utilisez-vous parfois ce ou ces véhicule(s) pour des déplacements personnels ?
        </p>
        <div className="radio-group" style={{ marginBottom: usagePerso ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="usage_perso" checked={usagePerso} onChange={() => setUsagePerso(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="usage_perso" checked={!usagePerso} onChange={() => setUsagePerso(false)} />
            Non
          </label>
        </div>

        {usagePerso && (
          <>
            <div className="info-box">
              <Info size={18} />
              <div>
                <strong>Information</strong>
                <div>
                  L'utilisation d'un véhicule de société pour des déplacements personnels est possible à condition de
                  payer des charges sociales sur cet "avantage en nature".<br /><br />
                  Il existe 2 méthode pour calculer le montant de cet avantage en nature :<br />
                  - Le "forfait" : 9% du prix d'achat (si véhicule acheté) ou 30% du montant de la location annuelle
                  (si leasing/LOA)<br />
                  - Les "dépenses réellement engagées" : vous évaluez les dépenses équivalentes à vos déplacements
                  personnels selon le barème de l'urssaf lien ici
                </div>
              </div>
            </div>
            <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)' }}>Quel méthode choisissez-vous ?</p>
            <div className="radio-group">
              <label className="radio-label">
                <input type="radio" name="methode" checked={methode === 'forfait'} onChange={() => setMethode('forfait')} />
                Le forfait
              </label>
              <label className="radio-label">
                <input type="radio" name="methode" checked={methode === 'reel'} onChange={() => setMethode('reel')} />
                Les "dépenses réellement engagées"
              </label>
            </div>
          </>
        )}
      </div>

      {/* TVA info + checkbox */}
      <div className="card">
        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              Il est interdit de déduire la TVA des dépenses liées à votre véhicule de société (achat, entretien,
              leasing). Cependant, vous avez :
              <br />- {vehicules.length} transactions catégorisées "Achat de véhicule" avec une TVA non nulle
              <br />- 1 transactions catégorisées "Entretien" avec une TVA non nulle
              <br />- 0 transactions catégorisées "Leasing" avec une TVA non nulle
              <br />La TVA sur ces transactions sera remise à 0 par votre comptable.
            </div>
          </div>
        </div>
        <label className="checkbox-label">
          <input type="checkbox" checked={tvaCompris} onChange={e => setTvaCompris(e.target.checked)} />
          J'ai compris et j'accepte la modification
        </label>
      </div>

      {/* Deductibilite fiscale */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          Pouvez-vous s'il vous plaît nous indiquer le montant maximum de déductibilité fiscale annuelle de votre
          véhicule, et nous transmettre l'attestation de déductibilité fiscale ?
        </p>
        {vehicules.map(v => (
          <div
            key={v.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-md)',
              marginBottom: 'var(--space-sm)',
            }}
          >
            <div style={{ width: 140, fontSize: '0.875rem', fontWeight: 500 }}>{v.nom}</div>
            <input
              className="form-input"
              placeholder="Déductibilité fiscale annuelle"
              value={deductibilite[v.id] || ''}
              onChange={e => setDeductibilite(prev => ({ ...prev, [v.id]: e.target.value }))}
              style={{ flex: 1 }}
            />
            <Paperclip size={16} color="var(--text-muted)" style={{ cursor: 'pointer', flexShrink: 0 }} />
          </div>
        ))}
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
