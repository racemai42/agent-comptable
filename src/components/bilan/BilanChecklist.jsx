import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, MessageSquare, Clock, X } from 'lucide-react';
import { BILAN_SECTIONS, STATUS_LABELS } from '../../data/bilanSections';

// Section drawer components
import BanquesSection from './sections/BanquesSection';
import CCASection from './sections/CCASection';
import VehiculePersoSection from './sections/VehiculePersoSection';
import EmpruntSection from './sections/EmpruntSection';
import FournisseursSection from './sections/FournisseursSection';
import ClientsSection from './sections/ClientsSection';
import ImmobilisationsSection from './sections/ImmobilisationsSection';
import StockSection from './sections/StockSection';
import CaisseSection from './sections/CaisseSection';
import LitigesSection from './sections/LitigesSection';
import DirigeantTNSSection from './sections/DirigeantTNSSection';
import AGOASection from './sections/AGOASection';
import GenericSection from './sections/GenericSection';

const SECTION_COMPONENTS = {
  banques: BanquesSection,
  cca: CCASection,
  vehicule_perso: VehiculePersoSection,
  emprunt: EmpruntSection,
  fournisseurs: FournisseursSection,
  clients: ClientsSection,
  immobilisations: ImmobilisationsSection,
  stock: StockSection,
  caisse: CaisseSection,
  litiges: LitigesSection,
  dirigeant_tns: DirigeantTNSSection,
  agoa: AGOASection,
};

function StatusIcon({ status }) {
  if (status === 'complete') return <CheckCircle2 size={24} color="var(--success)" />;
  if (status === 'to_modify') return <AlertCircle size={24} color="var(--warning)" />;
  return <Circle size={24} color="var(--text-muted)" />;
}

export default function BilanChecklist({ bilan }) {
  const [openSection, setOpenSection] = useState(null);

  if (!bilan) return null;

  const SectionComponent = openSection
    ? (SECTION_COMPONENTS[openSection] || GenericSection)
    : null;

  const sectionDef = openSection
    ? BILAN_SECTIONS.find(s => s.key === openSection)
    : null;

  const completedCount = Object.values(bilan.sections).filter(s => s.status === 'complete').length;
  const totalCount = Object.keys(bilan.sections).length;

  return (
    <>
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'var(--space-lg)' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
            Bilan {new Date(bilan.exercice.fin).getFullYear()}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            →| Date limite : <strong>{new Date(bilan.deadline).toLocaleDateString('fr-FR')}</strong>
          </p>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
            ↔ Période : du {new Date(bilan.exercice.debut).toLocaleDateString('fr-FR')} au {new Date(bilan.exercice.fin).toLocaleDateString('fr-FR')}
          </p>
        </div>

        <p style={{ fontWeight: 600, marginBottom: 'var(--space-xs)' }}>
          Faîtes ces actions pour que votre bilan soit réalisé <strong>dans les délais légaux</strong>.
        </p>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 'var(--space-md)' }}>
          {completedCount}/{totalCount} sections complétées
        </p>

        <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 'var(--space-lg)' }}>
          <div style={{ width: `${(completedCount / totalCount) * 100}%`, height: '100%', background: 'var(--success)', borderRadius: 3, transition: 'width 0.3s' }} />
        </div>
      </div>

      {BILAN_SECTIONS.map(section => {
        const state = bilan.sections[section.key] || { status: 'pending' };
        return (
          <div
            key={section.key}
            className="bilan-section-item"
            onClick={() => setOpenSection(section.key)}
          >
            <div className="section-icon">
              <StatusIcon status={state.status} />
            </div>
            <div className="section-name">
              {section.label}
              {state.has_message && (
                <span style={{ marginLeft: 8, display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: '0.75rem', color: 'var(--primary)', background: 'var(--primary-light)', padding: '2px 8px', borderRadius: 12 }}>
                  <MessageSquare size={12} /> Vous avez un message
                </span>
              )}
              {state.status === 'to_modify' && (
                <span className="status-badge status-to_modify" style={{ marginLeft: 8 }}>
                  À modifier
                </span>
              )}
            </div>
            <div className="section-time">
              <Clock size={14} style={{ marginRight: 4, verticalAlign: -2 }} />
              {section.time}
            </div>
          </div>
        );
      })}

      <div style={{ marginTop: 'var(--space-lg)', textAlign: 'center' }}>
        <button className="btn btn-primary" style={{ width: '100%', padding: 'var(--space-md)', fontSize: '1rem' }}>
          Envoyer mon questionnaire bilan
        </button>
      </div>

      {/* Drawer */}
      {openSection && (
        <>
          <div className="drawer-overlay" onClick={() => setOpenSection(null)} />
          <div className="drawer">
            <div className="drawer-header">
              <h2>{sectionDef?.label}</h2>
              <button className="drawer-close" onClick={() => setOpenSection(null)}>
                <X size={24} />
              </button>
            </div>
            <SectionComponent
              sectionKey={openSection}
              bilan={bilan}
              onClose={() => setOpenSection(null)}
            />
          </div>
        </>
      )}
    </>
  );
}
