import { useState, useEffect } from 'react';
import { Info, Plus, Trash2, Upload, AlertTriangle } from 'lucide-react';
import { api } from '../../../api/mock';

const EXERCICE_OPTIONS = [
  { value: 'n', label: 'Exercice N' },
  { value: 'n1', label: 'Exercice N+1' },
  { value: 'both', label: 'Les deux' },
];

function CutoffTable({ lignes, onChange, showDateFacture = false }) {
  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });
  const fmtDate = (d) => new Date(d).toLocaleDateString('fr-FR');

  if (lignes.length === 0) {
    return <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', padding: 'var(--space-md) 0' }}>Aucune transaction concernée</p>;
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Client</th>
            <th>Date encaissement</th>
            {showDateFacture && <th>Date facture</th>}
            <th>Montant TTC</th>
            <th>Exercice concerné</th>
            <th>% réalisé sur N</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map(l => (
            <tr key={l.id}>
              <td style={{ fontWeight: 500 }}>{l.nom}</td>
              <td>{fmtDate(l.date)}</td>
              {showDateFacture && (
                <td>
                  <input
                    type="date"
                    className="form-input"
                    style={{ width: 140 }}
                    value={l.date_facture || ''}
                    onChange={ev => onChange(l.id, 'date_facture', ev.target.value)}
                  />
                </td>
              )}
              <td>{fmt(l.montant)}</td>
              <td>
                <select
                  className="form-select"
                  style={{ width: 140 }}
                  value={l.concerne_n1 ? (l.concerne_n ? 'both' : 'n1') : 'n'}
                  onChange={ev => {
                    const v = ev.target.value;
                    onChange(l.id, 'concerne_n', v === 'n' || v === 'both');
                    onChange(l.id, 'concerne_n1', v === 'n1' || v === 'both');
                  }}
                >
                  {EXERCICE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </td>
              <td>
                {(l.concerne_n && l.concerne_n1) ? (
                  <input
                    type="number"
                    className="form-input"
                    style={{ width: 80 }}
                    min={0}
                    max={100}
                    value={l.pct_realise}
                    onChange={ev => onChange(l.id, 'pct_realise', parseInt(ev.target.value) || 0)}
                  />
                ) : (
                  <span style={{ color: 'var(--text-muted)' }}>—</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

let nextId = 100;

export default function ClientsSection({ bilan, onClose }) {
  const [lignesN, setLignesN] = useState([]);
  const [lignesApres, setLignesApres] = useState([]);
  const [autresCreances, setAutresCreances] = useState(bilan?.responses?.clients?.autres_creances ?? null);
  const [creancesManquantes, setCreancesManquantes] = useState([]);
  const [hasTravaux, setHasTravaux] = useState(bilan?.responses?.clients?.has_travaux ?? null);
  const [travaux, setTravaux] = useState([]);
  const [avoirs, setAvoirs] = useState([]);
  const [hasAvoirs, setHasAvoirs] = useState(null);
  const [clientsDouteux, setClientsDouteux] = useState([]);
  const [hasRetenuesGarantie, setHasRetenuesGarantie] = useState(null);
  const [retenuesGarantie, setRetenuesGarantie] = useState([]);
  const [attestationsTVA, setAttestationsTVA] = useState([]);
  const [logicielFacturation, setLogicielFacturation] = useState('');
  const [confirmCA, setConfirmCA] = useState(null);
  const [ecartCA, setEcartCA] = useState('');
  const [confirmUE, setConfirmUE] = useState(null);
  const [ecartUE, setEcartUE] = useState('');

  useEffect(() => {
    api.getClientsCutoff().then(data => setLignesN(data.map(l => ({ ...l }))));
  }, []);

  const handleChangeN = (id, field, value) => {
    setLignesN(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const handleChangeApres = (id, field, value) => {
    setLignesApres(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));
  };

  const addCreance = () => {
    setCreancesManquantes(prev => [...prev, {
      id: nextId++, nom: '', categorie: '', date_facture: '', montant: '', taux_tva: 20, montant_regle: 0
    }]);
  };

  const updateCreance = (id, field, value) => {
    setCreancesManquantes(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCreance = (id) => {
    setCreancesManquantes(prev => prev.filter(c => c.id !== id));
  };

  const addTravaux = () => {
    setTravaux(prev => [...prev, { id: nextId++, nom: '', montant_total: '', taux_tva: 20, pct_acheve: 0 }]);
  };

  const updateTravaux = (id, field, value) => {
    setTravaux(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const addAvoir = () => {
    setAvoirs(prev => [...prev, { id: nextId++, nom: '', categorie: '', montant: '', taux_tva: 20 }]);
  };

  const updateAvoir = (id, field, value) => {
    setAvoirs(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const fmt = (n) => Number(n).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' });

  const totalPCA = lignesN
    .filter(l => l.concerne_n1)
    .reduce((s, l) => s + l.montant * (1 - (l.pct_realise || 100) / 100), 0);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>
          Ces questions ont pour objectif de déterminer le «&nbsp;cut-off&nbsp;» de votre exercice :
          quels revenus doivent être affectés à l'exercice clôturé ou à l'exercice suivant ?
          Nous affichons les transactions de plus de <strong>1 000 €</strong> encaissées les
          <strong> 3 derniers mois</strong> avant la clôture.
        </span>
      </div>

      {/* Q1 — Encaissements avant clôture */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>
          1. Ces montants encaissés avant la clôture concernent quels exercices ?
        </p>
        <CutoffTable lignes={lignesN} onChange={handleChangeN} />
      </div>

      {/* Q2 — Encaissements après clôture */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-xs)' }}>
          2. Ces montants encaissés en début d'exercice suivant concernent quels exercices ?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Transactions &gt; 1 000 € encaissées les 3 premiers mois <em>après</em> la clôture.
        </p>
        <CutoffTable lignes={lignesApres} onChange={handleChangeApres} showDateFacture />
      </div>

      {/* Q3 — Autres créances non encaissées */}
      <div className="card">
        <p className="form-label">
          3. Avez-vous effectué d'autres prestations/ventes de plus de 1 000 € non encore encaissées ?
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="autres_creances" checked={autresCreances === true} onChange={() => setAutresCreances(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="autres_creances" checked={autresCreances === false} onChange={() => setAutresCreances(false)} />
            Non
          </label>
        </div>
        {autresCreances && (
          <>
            {creancesManquantes.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Catégorie</th>
                      <th>Date facture</th>
                      <th>Montant TTC (€)</th>
                      <th>TVA (%)</th>
                      <th>Réglé avant clôture (€)</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {creancesManquantes.map(c => (
                      <tr key={c.id}>
                        <td><input className="form-input" value={c.nom} onChange={e => updateCreance(c.id, 'nom', e.target.value)} placeholder="Nom client" /></td>
                        <td><input className="form-input" value={c.categorie} onChange={e => updateCreance(c.id, 'categorie', e.target.value)} placeholder="Catégorie" /></td>
                        <td><input type="date" className="form-input" value={c.date_facture} onChange={e => updateCreance(c.id, 'date_facture', e.target.value)} /></td>
                        <td><input type="number" className="form-input" value={c.montant} onChange={e => updateCreance(c.id, 'montant', e.target.value)} /></td>
                        <td>
                          <select className="form-select" value={c.taux_tva} onChange={e => updateCreance(c.id, 'taux_tva', e.target.value)}>
                            <option value={20}>20%</option>
                            <option value={10}>10%</option>
                            <option value={5.5}>5,5%</option>
                            <option value={0}>0%</option>
                          </select>
                        </td>
                        <td><input type="number" className="form-input" value={c.montant_regle} onChange={e => updateCreance(c.id, 'montant_regle', e.target.value)} /></td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => removeCreance(c.id)}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={addCreance}>
              <Plus size={13} /> Ajouter une créance
            </button>
          </>
        )}
      </div>

      {/* Q4 — Travaux en cours (BTP) */}
      <div className="card">
        <p className="form-label">
          4. Avez-vous des travaux démarrés durant l'exercice, non terminés à la clôture, et non encore facturés ?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          (Applicable principalement au secteur BTP)
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="has_travaux" checked={hasTravaux === true} onChange={() => setHasTravaux(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_travaux" checked={hasTravaux === false} onChange={() => setHasTravaux(false)} />
            Non
          </label>
        </div>
        {hasTravaux && (
          <>
            {travaux.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Client</th>
                      <th>Montant total TTC (€)</th>
                      <th>TVA (%)</th>
                      <th>% achevé à la clôture</th>
                    </tr>
                  </thead>
                  <tbody>
                    {travaux.map(t => (
                      <tr key={t.id}>
                        <td><input className="form-input" value={t.nom} onChange={e => updateTravaux(t.id, 'nom', e.target.value)} placeholder="Nom client" /></td>
                        <td><input type="number" className="form-input" value={t.montant_total} onChange={e => updateTravaux(t.id, 'montant_total', e.target.value)} /></td>
                        <td>
                          <select className="form-select" value={t.taux_tva} onChange={e => updateTravaux(t.id, 'taux_tva', e.target.value)}>
                            <option value={20}>20%</option>
                            <option value={10}>10%</option>
                            <option value={5.5}>5,5%</option>
                          </select>
                        </td>
                        <td>
                          <input type="number" className="form-input" style={{ width: 80 }} value={t.pct_acheve} min={0} max={100}
                            onChange={e => updateTravaux(t.id, 'pct_acheve', e.target.value)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={addTravaux}>
              <Plus size={13} /> Ajouter un chantier
            </button>
          </>
        )}
      </div>

      {/* Q5 — Avoirs */}
      <div className="card">
        <p className="form-label">
          5. Avez-vous émis après votre date de clôture des avoirs pour des marchandises ou prestations de services livrées avant cette date ?
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0 var(--space-md)' }}>
          <label className="radio-label">
            <input type="radio" name="has_avoirs" checked={hasAvoirs === true} onChange={() => setHasAvoirs(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_avoirs" checked={hasAvoirs === false} onChange={() => setHasAvoirs(false)} />
            Non
          </label>
        </div>
        {hasAvoirs && avoirs.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Catégorie</th>
                  <th>Montant TTC avoir (€)</th>
                  <th>TVA (%)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {avoirs.map(a => (
                  <tr key={a.id}>
                    <td><input className="form-input" value={a.nom} onChange={e => updateAvoir(a.id, 'nom', e.target.value)} placeholder="Nom client" /></td>
                    <td><input className="form-input" value={a.categorie} onChange={e => updateAvoir(a.id, 'categorie', e.target.value)} placeholder="Catégorie" /></td>
                    <td><input type="number" className="form-input" value={a.montant} onChange={e => updateAvoir(a.id, 'montant', e.target.value)} /></td>
                    <td>
                      <select className="form-select" value={a.taux_tva} onChange={e => updateAvoir(a.id, 'taux_tva', e.target.value)}>
                        <option value={20}>20%</option>
                        <option value={10}>10%</option>
                        <option value={5.5}>5,5%</option>
                        <option value={0}>0%</option>
                      </select>
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => setAvoirs(prev => prev.filter(x => x.id !== a.id))}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {hasAvoirs && (
          <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={addAvoir}>
            <Plus size={13} /> Ajouter un avoir
          </button>
        )}
      </div>

      {/* Q6 — Clients douteux */}
      <div className="card">
        <p className="form-label">
          6. Pensez-vous que certaines factures pourraient ne jamais être payées par vos clients ?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          Concerne les factures à encaisser de plus de 5 000 € renseignées ci-dessus.
        </p>
        {clientsDouteux.length > 0 && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Montant TTC (€)</th>
                  <th>TVA (%)</th>
                  <th>Risque impayé</th>
                  <th>% risque estimé</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {clientsDouteux.map(c => (
                  <tr key={c.id}>
                    <td><input className="form-input" value={c.nom} onChange={e => setClientsDouteux(prev => prev.map(x => x.id === c.id ? { ...x, nom: e.target.value } : x))} placeholder="Nom" /></td>
                    <td><input type="number" className="form-input" value={c.montant} onChange={e => setClientsDouteux(prev => prev.map(x => x.id === c.id ? { ...x, montant: e.target.value } : x))} /></td>
                    <td>
                      <select className="form-select" value={c.taux_tva} onChange={e => setClientsDouteux(prev => prev.map(x => x.id === c.id ? { ...x, taux_tva: e.target.value } : x))}>
                        <option value={20}>20%</option><option value={10}>10%</option><option value={5.5}>5,5%</option><option value={0}>0%</option>
                      </select>
                    </td>
                    <td>
                      <select className="form-select" value={c.risque ? 'oui' : 'non'} onChange={e => setClientsDouteux(prev => prev.map(x => x.id === c.id ? { ...x, risque: e.target.value === 'oui' } : x))}>
                        <option value="oui">Oui</option><option value="non">Non</option>
                      </select>
                    </td>
                    <td>
                      {c.risque ? (
                        <input type="number" className="form-input" style={{ width: 80 }} min={0} max={100} value={c.pct_risque}
                          onChange={e => setClientsDouteux(prev => prev.map(x => x.id === c.id ? { ...x, pct_risque: e.target.value } : x))} />
                      ) : <span style={{ color: 'var(--text-muted)' }}>—</span>}
                    </td>
                    <td>
                      <button className="btn btn-outline btn-sm" onClick={() => setClientsDouteux(prev => prev.filter(x => x.id !== c.id))}>
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={() => setClientsDouteux(prev => [...prev, { id: nextId++, nom: '', montant: '', taux_tva: 20, risque: false, pct_risque: 0 }])}>
          <Plus size={13} /> Ajouter un client douteux
        </button>
      </div>

      {/* Q7 — Retenues de garantie (BTP) */}
      <div className="card">
        <p className="form-label">
          7. Avez-vous facturé des retenues de garantie au cours de l'exercice ?
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-sm)' }}>
          (Secteur BTP uniquement)
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="retenues_garantie" checked={hasRetenuesGarantie === true} onChange={() => setHasRetenuesGarantie(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="retenues_garantie" checked={hasRetenuesGarantie === false} onChange={() => setHasRetenuesGarantie(false)} />
            Non
          </label>
        </div>
        {hasRetenuesGarantie && (
          <>
            {retenuesGarantie.length > 0 && (
              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>Date facture</th>
                      <th>Montant HT retenue de garantie (€)</th>
                      <th>Facture</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {retenuesGarantie.map(r => (
                      <tr key={r.id}>
                        <td><input type="date" className="form-input" value={r.date} onChange={e => setRetenuesGarantie(prev => prev.map(x => x.id === r.id ? { ...x, date: e.target.value } : x))} /></td>
                        <td><input type="number" className="form-input" value={r.montant} onChange={e => setRetenuesGarantie(prev => prev.map(x => x.id === r.id ? { ...x, montant: e.target.value } : x))} placeholder="Montant" /></td>
                        <td>
                          <div className="upload-zone" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                            <Upload size={14} /> Joindre
                          </div>
                        </td>
                        <td>
                          <button className="btn btn-outline btn-sm" onClick={() => setRetenuesGarantie(prev => prev.filter(x => x.id !== r.id))}>
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <button className="btn btn-outline btn-sm" style={{ marginTop: 'var(--space-sm)' }} onClick={() => setRetenuesGarantie(prev => [...prev, { id: nextId++, date: '', montant: '' }])}>
              <Plus size={13} /> Ajouter
            </button>
          </>
        )}
      </div>

      {/* Q8 — Attestations TVA réduite (BTP) */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-xs)' }}>
          8. Les montants suivants correspondent à des encaissements de plus de 10 000 € avec un taux de TVA réduit.
        </p>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          L'application d'un taux réduit suppose que vos clients vous aient remis une attestation concernant la destination des travaux. Pouvez-vous joindre les attestations correspondantes ?
        </p>
        {attestationsTVA.length > 0 ? (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Libellé</th>
                  <th>Date</th>
                  <th>Montant TTC</th>
                  <th>TVA</th>
                  <th>Attestation</th>
                </tr>
              </thead>
              <tbody>
                {attestationsTVA.map(a => (
                  <tr key={a.id}>
                    <td>{a.libelle}</td>
                    <td>{a.date}</td>
                    <td>{fmt(a.montant)}</td>
                    <td>{a.taux_tva}%</td>
                    <td>
                      <div className="upload-zone" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>
                        <Upload size={14} /> Joindre
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Aucune transaction concernée</p>
        )}
      </div>

      {/* Q9 — Logiciel de facturation */}
      <div className="card">
        <p className="form-label">
          9. Avec quel logiciel avez-vous émis vos factures ?
        </p>
        <input
          className="form-input"
          value={logicielFacturation}
          onChange={e => setLogicielFacturation(e.target.value)}
          placeholder="Ex: Henrri, Pennylane, Excel..."
        />
      </div>

      {/* Q10 — Confirmation CA */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
          10. D'après vos transactions et vos réponses, le chiffre d'affaires de votre exercice est estimé. Confirmez-vous ce montant ?
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="confirm_ca" checked={confirmCA === true} onChange={() => setConfirmCA(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="confirm_ca" checked={confirmCA === false} onChange={() => setConfirmCA(false)} />
            Non
          </label>
        </div>
        {confirmCA === false && (
          <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
            <label className="form-label">Indiquez le montant estimé et d'où provient l'écart :</label>
            <textarea
              className="form-textarea"
              value={ecartCA}
              onChange={e => setEcartCA(e.target.value)}
              placeholder="Montant estimé et explication de l'écart..."
            />
          </div>
        )}
      </div>

      {/* Q11 — CA UE / hors UE */}
      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>
          11. Confirmez-vous le montant de vos ventes en UE et hors UE ?
        </p>
        <div className="radio-group" style={{ margin: 'var(--space-sm) 0' }}>
          <label className="radio-label">
            <input type="radio" name="confirm_ue" checked={confirmUE === true} onChange={() => setConfirmUE(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="confirm_ue" checked={confirmUE === false} onChange={() => setConfirmUE(false)} />
            Non
          </label>
        </div>
        {confirmUE === false && (
          <div className="form-group" style={{ marginTop: 'var(--space-sm)' }}>
            <label className="form-label">Indiquez les montants CA UE et hors UE, et d'où provient l'écart :</label>
            <textarea
              className="form-textarea"
              value={ecartUE}
              onChange={e => setEcartUE(e.target.value)}
              placeholder="CA UE: ... / CA hors UE: ... / Explication..."
            />
          </div>
        )}
        <div className="info-box" style={{ marginTop: 'var(--space-md)' }}>
          <Info size={18} />
          <div style={{ fontSize: '0.8rem' }}>
            <strong>Déclaration Européenne de Services (DES)</strong>
            <p style={{ marginTop: 4 }}>
              Si vous facturez des services à des clients en UE, vous devez peut-être remplir une DES auprès des douanes.
              Les prestations non localisables (conseil, assurance, téléphonie...) doivent être déclarées.
              Vous facturez HT et votre client s'acquitte de la TVA dans son pays (autoliquidation).
            </p>
          </div>
        </div>
      </div>

      {totalPCA > 0 && (
        <div className="card" style={{ background: 'var(--bg)' }}>
          <p className="form-label" style={{ marginBottom: 'var(--space-sm)' }}>Impact comptable estimé</p>
          <div style={{ fontSize: '0.85rem' }}>
            <strong>PCA (Produits Constatés d'Avance) :</strong> {fmt(totalPCA)}
          </div>
        </div>
      )}

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
