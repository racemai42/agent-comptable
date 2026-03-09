import { useState } from 'react';
import { Info } from 'lucide-react';

export default function ProjetEnCoursSection({ bilan, onClose }) {
  const saved = bilan?.responses?.projet_en_cours ?? {};
  const [hasProjet, setHasProjet] = useState(saved.has_projet ?? null);
  const [description, setDescription] = useState(saved.description ?? '');
  const [montantPaye, setMontantPaye] = useState(saved.montant_paye ?? '');
  const [detailMateriel, setDetailMateriel] = useState(saved.detail_materiel ?? '');
  const [detailSoustraitance, setDetailSoustraitance] = useState(saved.detail_soustraitance ?? '');
  const [montantTotal, setMontantTotal] = useState(saved.montant_total ?? '');

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <p>Un projet en cours de réalisation peut être :</p>
          <ul style={{ paddingLeft: 16, marginTop: 4, lineHeight: 1.8 }}>
            <li>Développement logiciel externalisé</li>
            <li>Construction ou rénovation en cours</li>
            <li>Acquisition de machines non encore installées</li>
            <li>Recherche & développement (R&D)</li>
            <li>Licences achetées mais non encore utilisables</li>
          </ul>
        </div>
      </div>

      {/* Q1 */}
      <div className="card">
        <p className="form-label">Avez-vous des dépenses sur des projets en cours de réalisation ?</p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="has_projet" checked={hasProjet === true} onChange={() => setHasProjet(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_projet" checked={hasProjet === false} onChange={() => setHasProjet(false)} />
            Non
          </label>
        </div>
      </div>

      {hasProjet && (
        <>
          {/* Q2 — Description */}
          <div className="card">
            <div className="form-group">
              <label className="form-label">Décrivez le projet</label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Ex : Développement d'une application mobile externalisée à un prestataire..."
              />
            </div>
          </div>

          {/* Q3 — Montants */}
          <div className="card">
            <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
              Montant des dépenses payées durant l'exercice
            </p>
            <div className="form-group">
              <label className="form-label">Total dépenses payées (€)</label>
              <input
                type="number"
                className="form-input"
                value={montantPaye}
                onChange={e => setMontantPaye(e.target.value)}
                placeholder="Ex : 1000"
              />
            </div>
            <p className="form-label" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
              Détail par nature
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Achat matériel / marchandises (€)</label>
                <input
                  type="number"
                  className="form-input"
                  value={detailMateriel}
                  onChange={e => setDetailMateriel(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Achat prestations / sous-traitance (€)</label>
                <input
                  type="number"
                  className="form-input"
                  value={detailSoustraitance}
                  onChange={e => setDetailSoustraitance(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Q4 — Montant total à terme */}
          <div className="card">
            <div className="form-group">
              <label className="form-label">Montant total estimé du projet une fois terminé (€)</label>
              <input
                type="number"
                className="form-input"
                value={montantTotal}
                onChange={e => setMontantTotal(e.target.value)}
                placeholder="Ex : 3000"
              />
            </div>
            {montantPaye && montantTotal && (
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: 'var(--space-sm)' }}>
                Avancement estimé : {Math.round((parseFloat(montantPaye) / parseFloat(montantTotal)) * 100)}%
              </div>
            )}
          </div>
        </>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={hasProjet === null}>Valider</button>
      </div>
    </div>
  );
}
