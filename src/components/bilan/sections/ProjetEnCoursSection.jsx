import { useState } from 'react';
import { Info } from 'lucide-react';

export default function ProjetEnCoursSection({ bilan, onClose }) {
  const saved = bilan?.responses?.projet_en_cours ?? {};
  const [hasProjet, setHasProjet] = useState(saved.has_projet ?? true);
  const [description, setDescription] = useState(saved.description ?? 'Ceci est un test');
  const [montantPaye, setMontantPaye] = useState(saved.montant_paye ?? 1000);
  const [detailMateriel, setDetailMateriel] = useState(saved.detail_materiel ?? 200);
  const [detailSoustraitance, setDetailSoustraitance] = useState(saved.detail_soustraitance ?? 600);
  const [montantTotal, setMontantTotal] = useState(saved.montant_total ?? 3000);

  return (
    <div>
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous effectué au cours de l'exercice précédent des dépenses sur des projets toujours en cours de
          réalisation ?
        </p>

        <div className="info-box">
          <Info size={18} />
          <div>
            <strong>Information</strong>
            <div>
              Exemples de projets :<br />
              - développement de logiciel (dépense externalisée)<br />
              - construction / rénovation de bâtiments<br />
              - acquisition de machines ou d'équipements pas encore installés et opérationnels<br />
              - frais de recherche et développement<br />
              - acquisition de licences pas encore utilisables
            </div>
          </div>
        </div>

        <div className="radio-group" style={{ marginBottom: hasProjet ? 'var(--space-lg)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="has_projet" checked={hasProjet} onChange={() => setHasProjet(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_projet" checked={!hasProjet} onChange={() => setHasProjet(false)} />
            Non
          </label>
        </div>

        {hasProjet && (
          <>
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>
                Décrivez la dépense ?
              </p>
              <textarea
                className="form-textarea"
                value={description}
                onChange={e => setDescription(e.target.value)}
                style={{ minHeight: 80 }}
              />
            </div>

            <div style={{ marginBottom: 'var(--space-md)' }}>
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>
                Quel est le montant des dépenses liées à ces projets, payées durant l'exercice ?
              </p>
              <input
                className="form-input"
                value={`€${montantPaye}`}
                onChange={e => setMontantPaye(e.target.value.replace('€', ''))}
              />
            </div>

            <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem', textDecoration: 'underline' }}>
              Pouvez-vous nous détailler cette dépense ?
            </p>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-sm)', gap: 'var(--space-md)' }}>
              <div style={{ flex: 1, fontSize: '0.875rem' }}>
                Achat de matériel, marchandises ou autres petits outils ayant permis de réaliser ce projet
              </div>
              <input
                className="form-input"
                value={detailMateriel}
                onChange={e => setDetailMateriel(e.target.value)}
                style={{ width: 200 }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
              <div style={{ flex: 1, fontSize: '0.875rem' }}>
                Achat de prestations de sous-traitance
              </div>
              <input
                className="form-input"
                value={detailSoustraitance}
                onChange={e => setDetailSoustraitance(e.target.value)}
                style={{ width: 200 }}
              />
            </div>
          </>
        )}
      </div>

      <div className="drawer-footer" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {hasProjet && (
        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>
            Quel sera le montant total des dépenses liées à ces projets, lorsqu'ils seront terminés ?
          </p>
          <input
            className="form-input"
            value={`€${montantTotal}`}
            onChange={e => setMontantTotal(e.target.value.replace('€', ''))}
          />
        </div>
      )}
    </div>
  );
}
