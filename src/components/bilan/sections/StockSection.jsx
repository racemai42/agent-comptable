import { useState } from 'react';
import { Info, Upload } from 'lucide-react';

export default function StockSection({ bilan, onClose }) {
  const saved = bilan?.responses?.stock ?? {};
  const [hasStock, setHasStock] = useState(saved.has_stock ?? null);
  const [valeurTotale, setValeurTotale] = useState(saved.valeur_totale ?? '');
  const [marchandises, setMarchandises] = useState(saved.marchandises ?? '');
  const [matierePremiere, setMatierePremiere] = useState(saved.matiere_premiere ?? '');
  const [produitsEnCours, setProduitsEnCours] = useState(saved.produits_en_cours ?? '');
  const [hasPerte, setHasPerte] = useState(saved.perte ?? null);
  const [perteTotale, setPerteTotale] = useState(saved.perte_totale ?? '');
  const [perteJustif, setPerteJustif] = useState(saved.perte_justif ?? '');

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const highStock = Number(valeurTotale) > 5000;

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <p>Le stock est évalué selon sa nature :</p>
          <ul style={{ paddingLeft: 16, marginTop: 4, lineHeight: 1.8 }}>
            <li><strong>Marchandises & matières premières</strong> → prix d'achat</li>
            <li><strong>Produits finis & en cours</strong> → prix de revient</li>
          </ul>
          <p style={{ marginTop: 4 }}>Une dépréciation peut être constatée si le stock a perdu de la valeur.</p>
        </div>
      </div>

      {/* Q1 */}
      <div className="card">
        <p className="form-label">Avez-vous du stock à la date de clôture ?</p>
        <div className="radio-group" style={{ marginTop: 'var(--space-sm)' }}>
          <label className="radio-label">
            <input type="radio" name="has_stock" checked={hasStock === true} onChange={() => setHasStock(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_stock" checked={hasStock === false} onChange={() => setHasStock(false)} />
            Non
          </label>
        </div>
      </div>

      {hasStock && (
        <>
          {/* Q2 — Valeur + ventilation */}
          <div className="card">
            <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Valeur totale du stock</p>
            <div className="form-group">
              <label className="form-label">Valeur totale (€)</label>
              <input
                type="number"
                className="form-input"
                value={valeurTotale}
                onChange={e => setValeurTotale(e.target.value)}
                placeholder="Ex : 5000"
              />
            </div>
            <p className="form-label" style={{ marginTop: 'var(--space-md)', marginBottom: 'var(--space-sm)' }}>
              Ventilation par type
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 'var(--space-md)' }}>
              <div className="form-group">
                <label className="form-label">Marchandises (€)</label>
                <input type="number" className="form-input" value={marchandises} onChange={e => setMarchandises(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Matière première (€)</label>
                <input type="number" className="form-input" value={matierePremiere} onChange={e => setMatierePremiere(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Produits en cours (€)</label>
                <input type="number" className="form-input" value={produitsEnCours} onChange={e => setProduitsEnCours(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Q3 — Inventaire si stock élevé */}
          {highStock && (
            <div className="alert-box warning">
              <Info size={18} />
              <div>
                <strong>Stock &gt; 5 000 € — Inventaire requis</strong>
                <p style={{ marginTop: 4, fontSize: '0.85rem' }}>
                  Merci de joindre votre inventaire de clôture (liste détaillée des articles, quantités et valeurs).
                </p>
                <div className="upload-zone" style={{ marginTop: 'var(--space-sm)' }}>
                  <Upload size={18} style={{ marginRight: 8 }} />
                  Déposer l'inventaire (XLS, CSV, PDF, JPEG)
                </div>
              </div>
            </div>
          )}

          {/* Q4 — Dépréciation */}
          <div className="card">
            <p className="form-label">Le stock a-t-il perdu de la valeur (obsolescence, détérioration…) ?</p>
            <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
              <label className="radio-label">
                <input type="radio" name="has_perte" checked={hasPerte === true} onChange={() => setHasPerte(true)} />
                Oui
              </label>
              <label className="radio-label">
                <input type="radio" name="has_perte" checked={hasPerte === false} onChange={() => setHasPerte(false)} />
                Non
              </label>
            </div>

            {hasPerte && (
              <>
                <div className="form-group" style={{ marginTop: 'var(--space-md)' }}>
                  <label className="form-label">Valeur totale de la perte (€)</label>
                  <input
                    type="number"
                    className="form-input"
                    value={perteTotale}
                    onChange={e => setPerteTotale(e.target.value)}
                    placeholder="Ex : 300"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Justification de la perte</label>
                  <textarea
                    className="form-textarea"
                    value={perteJustif}
                    onChange={e => setPerteJustif(e.target.value)}
                    placeholder="Décrivez la raison de la dépréciation..."
                  />
                </div>
              </>
            )}
          </div>
        </>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose} disabled={hasStock === null}>Valider</button>
      </div>
    </div>
  );
}
