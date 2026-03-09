import { useState } from 'react';
import { Info, Paperclip } from 'lucide-react';

function AmountRow({ label, value, onChange }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 'var(--space-sm)', gap: 'var(--space-md)' }}>
      <div style={{ flex: 1, fontSize: '0.875rem' }}>{label}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <input
          className="form-input"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: 120, textAlign: 'right' }}
        />
        <button
          style={{
            background: 'none',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 10px',
            cursor: 'pointer',
            color: 'var(--primary)',
            fontWeight: 600,
          }}
        >
          €
        </button>
      </div>
    </div>
  );
}

export default function StockSection({ bilan, onClose }) {
  const saved = bilan?.responses?.stock ?? {};
  const [hasStock, setHasStock] = useState(saved.has_stock ?? true);
  const [valeurTotale, setValeurTotale] = useState(saved.valeur_totale ?? 5001);
  const [marchandises, setMarchandises] = useState(saved.marchandises ?? 100);
  const [matierePremiere, setMatierePremiere] = useState(saved.matiere_premiere ?? 100);
  const [produitsEnCours, setProduitsEnCours] = useState(saved.produits_en_cours ?? 50);
  const [hasPerte, setHasPerte] = useState(saved.perte ?? true);
  const [perteTotale, setPerteTotale] = useState(saved.perte_totale ?? 300);
  const [perteMarchandises, setPerteMarchandises] = useState('');
  const [perteMatiere, setPerteMatiere] = useState('');
  const [perteProduitsFinis, setPerteProduitsFinis] = useState('');
  const [perteJustif, setPerteJustif] = useState('');

  const highStock = Number(valeurTotale) > 5000;

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Si votre activité est commerciale ou artisanale, votre société détient probablement un stock. Il existe
            plusieurs types de stock :<br />
            - de marchandises (acheté pour être revendu en l'état, par exemple, dans un restaurant)<br />
            - de matières premières (acheté pour être transformé, par exemple, du tissu pour un couturier)<br />
            - de produits finis (fabriqués par votre société, par exemple, des robes pour un couturier)<br />
            Le stock de marchandises ou de matières premières est valorisé au prix d'achat. Le stock de produits
            finis est valorisé au coût de production.
          </div>
        </div>
      </div>

      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
          Avez-vous à la date de clôture de votre exercice un stock de marchandises, matières premières, produits
          finis ou en cours ?
        </p>
        <div className="radio-group" style={{ marginBottom: hasStock ? 'var(--space-lg)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="has_stock" checked={hasStock} onChange={() => setHasStock(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_stock" checked={!hasStock} onChange={() => setHasStock(false)} />
            Non
          </label>
        </div>

        {hasStock && (
          <>
            <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
              Quelle était la valeur totale du stock à la date de clôture ?
            </p>
            <AmountRow label="Valeur totale du stock" value={valeurTotale} onChange={setValeurTotale} />
            <AmountRow label="Valeur stock de marchandises" value={marchandises} onChange={setMarchandises} />
            <AmountRow label="Valeur stock de matières premières" value={matierePremiere} onChange={setMatierePremiere} />
            <AmountRow label="Valeur stock de produits en cours" value={produitsEnCours} onChange={setProduitsEnCours} />
          </>
        )}
      </div>

      <div className="drawer-footer" style={{ marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {hasStock && highStock && (
        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
            La valeur de votre stock étant élevée, pouvez-vous nous joindre un inventaire de votre stock ?
          </p>
          <div
            className="upload-zone"
            style={{ textAlign: 'left', display: 'flex', alignItems: 'center', gap: 10 }}
          >
            <Paperclip size={16} color="var(--primary)" />
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: 500 }}>Ajouter une pièce</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>XLS, CSV, PDF, JPEG</div>
            </div>
          </div>
        </div>
      )}

      {hasStock && (
        <div className="card">
          <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)' }}>
            Estimez-vous qu'une partie de votre stock a perdu de la valeur ?
          </p>
          <div className="radio-group" style={{ marginBottom: hasPerte ? 'var(--space-lg)' : 0 }}>
            <label className="radio-label">
              <input type="radio" name="has_perte" checked={hasPerte} onChange={() => setHasPerte(true)} />
              Oui
            </label>
            <label className="radio-label">
              <input type="radio" name="has_perte" checked={!hasPerte} onChange={() => setHasPerte(false)} />
              Non
            </label>
          </div>

          {hasPerte && (
            <>
              <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
                Quelle est la valeur de la perte ?
              </p>
              <AmountRow label="Valeur totale perte stock" value={perteTotale} onChange={setPerteTotale} />
              <AmountRow label="Valeur perte stock de marchandises" value={perteMarchandises} onChange={setPerteMarchandises} />
              <AmountRow label="Valeur perte stock de matières premières" value={perteMatiere} onChange={setPerteMatiere} />
              <AmountRow label="Valeur perte stock de produits finis" value={perteProduitsFinis} onChange={setPerteProduitsFinis} />

              <p style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: 4, marginBottom: 'var(--space-md)' }}>
                Perte totale = perte marchandises + perte matières premières + perte produits finis
              </p>

              <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>
                Quelle est la justification de la perte ?
              </p>
              <input
                className="form-input"
                placeholder="Précisez"
                value={perteJustif}
                onChange={e => setPerteJustif(e.target.value)}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
