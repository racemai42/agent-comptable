import { CheckCircle2 } from 'lucide-react';

export default function AGOASection({ bilan, onClose }) {
  return (
    <div>
      <div style={{ textAlign: 'center', padding: 'var(--space-2xl) var(--space-lg)' }}>
        <CheckCircle2 size={48} color="var(--success)" style={{ marginBottom: 'var(--space-md)' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 'var(--space-sm)' }}>
          AGOA mensualisée
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: 400, margin: '0 auto' }}>
          Vous avez mensualisé la prestation AGOA. Votre comptable s'en occupera à la clôture.
          Aucune action n'est requise de votre part.
        </p>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
