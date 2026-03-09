import { useState, useEffect } from 'react';
import { Info, Paperclip, CloudUpload } from 'lucide-react';
import { api } from '../../../api/mock';

function UploadZone({ label = 'Ajouter une pièce', hint = 'PDF, PNG, JPEG' }) {
  return (
    <div
      className="upload-zone"
      style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
    >
      <Paperclip size={16} color="var(--primary)" />
      <div>
        <div style={{ color: 'var(--primary)', fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{hint}</div>
      </div>
    </div>
  );
}

export default function CCASection({ bilan, onClose }) {
  const [associes, setAssocies] = useState([]);

  useEffect(() => { api.getAssocies().then(setAssocies); }, []);

  const highApportAssocies = associes.filter(a => a.apport > 15000);
  const hasHighApport = highApportAssocies.length > 0;
  const hasHighSolde = associes.some(a => a.solde_cca > 30000);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Les comptes courants d'associés correspondent à la somme d'argent que la société doit aux associés.
            Ils sont impactés par les virements entre la société et les associés, ainsi que par les notes de frais.
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>Vos comptes courants d'associés</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)' }}>
          {associes.map(a => (
            <div
              key={a.id}
              style={{
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
              }}
            >
              <div style={{ fontSize: '0.875rem', marginBottom: 'var(--space-md)' }}>{a.nom}</div>
              <div style={{ fontWeight: 700 }}>
                {a.solde_cca.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}€
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="drawer-footer" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {hasHighApport && (
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div className="info-box">
            <Info size={18} />
            <div>
              <strong>Information</strong>
              <div>
                {highApportAssocies.map(a => a.nom).join(' et ')} ont des apports des associés supérieurs à 15 000 €
              </div>
            </div>
          </div>
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
            Pouvez-vous s'il vous plaît nous expliquer la provenance des fonds et nous fournir un justificatif
            attestant de l'origine des fonds ?
          </p>
          <UploadZone />
        </div>
      )}

      {hasHighSolde && (
        <div
          style={{
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-lg)',
            marginBottom: 'var(--space-md)',
          }}
        >
          <div className="info-box">
            <Info size={18} />
            <div>
              <strong>Information</strong>
              <div>Nous avons constaté des solde de compte courant des associés de plus de 30 000€ à la clôture</div>
            </div>
          </div>
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
            Les soldes des comptes courant d'associé étant élevés, pourriez-vous s'il vous plaît nous transmettre une
            attestation signée par tous les associés, suivant le modèle ci-dessous.
          </p>
          <UploadZone style={{ marginBottom: 'var(--space-md)' }} />
          <button className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-md)' }}>
            <CloudUpload size={16} /> Télécharger le modèle
          </button>
        </div>
      )}
    </div>
  );
}
