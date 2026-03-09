import { useState, useEffect } from 'react';
import { Info, Paperclip, MoreVertical } from 'lucide-react';
import { api } from '../../../api/mock';

let nextId = 100;

const TVA_OPTIONS = [
  { value: '20', label: '20% - France' },
  { value: '10', label: '10% - France' },
  { value: '5.5', label: '5,5% - France' },
  { value: '0', label: '0% - France' },
];

export default function ClientsSection({ bilan, onClose }) {
  const [lignes, setLignes] = useState([]);
  const [hasNonEncaisses, setHasNonEncaisses] = useState(true);
  const [facturesNE, setFacturesNE] = useState([
    { id: nextId++, nom: '', categorie: '', montant: '', tva: '20', montantPaye: '' },
  ]);
  const [hasAvoirs, setHasAvoirs] = useState(true);
  const [avoirs, setAvoirs] = useState([
    { id: nextId++, nom: '', categorie: '', montant: '', tva: '20' },
  ]);
  const [hasRetenues, setHasRetenues] = useState(true);
  const [retenues, setRetenues] = useState([
    { id: nextId++, montant: '' },
  ]);
  const [attestations] = useState([
    { id: 1, libelle: 'Prestations de services', date: '', montant: '12000€', tva: '10%' },
  ]);

  useEffect(() => {
    api.getClientsCutoff().then(data =>
      setLignes(
        data.map(l => ({
          ...l,
          _concerne_n: l.concerne_n ? 'oui' : '',
          _concerne_n1: l.concerne_n1 ? 'oui' : '',
          _pct: l.pct_realise || '',
        }))
      )
    );
  }, []);

  const debutStr = bilan?.exercice?.debut
    ? new Date(bilan.exercice.debut).toLocaleDateString('fr-FR')
    : '';
  const finStr = bilan?.exercice?.fin
    ? new Date(bilan.exercice.fin).toLocaleDateString('fr-FR')
    : '';
  const finDate = bilan?.exercice?.fin ? new Date(bilan.exercice.fin) : null;
  const nextStart = finDate ? new Date(finDate.getTime() + 86400000) : null;
  const nextEnd = finDate
    ? new Date(new Date(finDate).setFullYear(finDate.getFullYear() + 1))
    : null;
  const nextStartStr = nextStart?.toLocaleDateString('fr-FR') || '';
  const nextEndStr = nextEnd?.toLocaleDateString('fr-FR') || '';
  const todayStr = new Date().toLocaleDateString('fr-FR');

  const updateLigne = (id, field, value) =>
    setLignes(prev => prev.map(l => l.id === id ? { ...l, [field]: value } : l));

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <div>
          <strong>Information</strong>
          <div>
            Les questions ci-dessous ont pour objectif de déterminer le "cut-off" de votre exercice,
            c'est-à-dire déterminer quels revenus doivent être affectés à l'exercice clôturé ou à l'exercice suivant.
          </div>
        </div>
      </div>

      {/* Cut-off table */}
      <div className="card">
        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
          Ces montants élevés concernent quels exercices ?<br />
          Indiquez pour chacune de ces transactions si elles ont été liées à une prestation effectuée au cours de
          l'exercice précédent, ou du nouvel exercice (actuellement en cours), ou des 2. Vous pouvez afficher des
          transactions plus anciennes en cliquant sur "voir plus".
        </p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Date</th>
                <th>Montant TTC</th>
                <th>Concerne la période du {debutStr} au {finStr} ?</th>
                <th>Concerne la période du {nextStartStr} au {nextEndStr} ?</th>
                <th>% réalisé sur la période</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {lignes.map(l => (
                <tr key={l.id}>
                  <td style={{ fontWeight: 500 }}>{l.nom}</td>
                  <td>{new Date(l.date).toLocaleDateString('fr-FR')}</td>
                  <td>
                    {l.montant?.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      value={l._concerne_n || ''}
                      onChange={e => updateLigne(l.id, '_concerne_n', e.target.value)}
                    >
                      <option value="">Sélection</option>
                      <option value="oui">oui</option>
                      <option value="non">non</option>
                    </select>
                  </td>
                  <td>
                    <select
                      className="form-select"
                      style={{ padding: '4px 8px', fontSize: '0.85rem' }}
                      value={l._concerne_n1 || ''}
                      onChange={e => updateLigne(l.id, '_concerne_n1', e.target.value)}
                    >
                      <option value="">Sélection</option>
                      <option value="oui">oui</option>
                      <option value="non">non</option>
                    </select>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <input
                        className="form-input"
                        placeholder="Avancement"
                        value={l._pct || ''}
                        onChange={e => updateLigne(l.id, '_pct', e.target.value)}
                        style={{ width: 90, fontSize: '0.85rem' }}
                      />
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>%</span>
                    </div>
                  </td>
                  <td>
                    <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-lg)' }}>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>

      {/* Q3 - Prestations non encaissées */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          En plus des transactions affichées ci-dessus, avez-vous effectué au cours de l'exercice précédent d'autres
          prestations/ventes actuellement toujours non encaissés (ou encaissés plus de 3 mois après la date de
          clôture) ?
        </p>
        <div className="radio-group" style={{ marginBottom: hasNonEncaisses ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="non_encaisses" checked={hasNonEncaisses} onChange={() => setHasNonEncaisses(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="non_encaisses" checked={!hasNonEncaisses} onChange={() => setHasNonEncaisses(false)} />
            Non
          </label>
        </div>
        {hasNonEncaisses && (
          <>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>
              Ajoutez les factures concernées
            </p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom du client</th>
                    <th>Catégorie</th>
                    <th>Date de la facture</th>
                    <th>Montant TTC de la facture</th>
                    <th>TVA</th>
                    <th>Montant déjà réglé</th>
                    <th>Facture</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {facturesNE.map(f => (
                    <tr key={f.id}>
                      <td>
                        <input className="form-input" placeholder="Nom" value={f.nom}
                          onChange={e => setFacturesNE(prev => prev.map(x => x.id === f.id ? { ...x, nom: e.target.value } : x))} />
                      </td>
                      <td>
                        <select className="form-select" value={f.categorie}
                          onChange={e => setFacturesNE(prev => prev.map(x => x.id === f.id ? { ...x, categorie: e.target.value } : x))}>
                          <option value="">Type</option>
                          <option value="prestations">Prestations de services</option>
                          <option value="ventes">Ventes de marchandises</option>
                        </select>
                      </td>
                      <td>
                        <input className="form-input" value={todayStr} readOnly />
                      </td>
                      <td>
                        <input className="form-input" placeholder="Montant" value={f.montant}
                          onChange={e => setFacturesNE(prev => prev.map(x => x.id === f.id ? { ...x, montant: e.target.value } : x))} />
                      </td>
                      <td>
                        <select className="form-select" value={f.tva}
                          onChange={e => setFacturesNE(prev => prev.map(x => x.id === f.id ? { ...x, tva: e.target.value } : x))}>
                          {TVA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                      <td>
                        <input className="form-input" placeholder="Montant payé" value={f.montantPaye}
                          onChange={e => setFacturesNE(prev => prev.map(x => x.id === f.id ? { ...x, montantPaye: e.target.value } : x))} />
                      </td>
                      <td>
                        <Paperclip size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </td>
                      <td>
                        <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setFacturesNE(prev => [
                    ...prev,
                    { id: nextId++, nom: '', categorie: '', montant: '', tva: '20', montantPaye: '' },
                  ])
                }
              >
                Ajouter
              </button>
            </div>
          </>
        )}
      </div>

      {/* Q5 - Avoirs */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          Avez-vous émis après votre date de cloture des avoirs pour des marchandises ou des prestations de services
          livrées avant cette date ?
        </p>
        <div className="radio-group" style={{ marginBottom: hasAvoirs ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="has_avoirs" checked={hasAvoirs} onChange={() => setHasAvoirs(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_avoirs" checked={!hasAvoirs} onChange={() => setHasAvoirs(false)} />
            Non
          </label>
        </div>
        {hasAvoirs && (
          <>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>
              Ajoutez les factures concernées
            </p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Nom du client</th>
                    <th>Catégorie</th>
                    <th>Montant TTC de la facture</th>
                    <th>TVA</th>
                    <th>Avoir</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {avoirs.map(a => (
                    <tr key={a.id}>
                      <td>
                        <input className="form-input" placeholder="Nom" value={a.nom}
                          onChange={e => setAvoirs(prev => prev.map(x => x.id === a.id ? { ...x, nom: e.target.value } : x))} />
                      </td>
                      <td>
                        <select className="form-select" value={a.categorie}
                          onChange={e => setAvoirs(prev => prev.map(x => x.id === a.id ? { ...x, categorie: e.target.value } : x))}>
                          <option value="">Type</option>
                          <option value="prestations">Prestations de services</option>
                          <option value="ventes">Ventes de marchandises</option>
                        </select>
                      </td>
                      <td>
                        <input className="form-input" placeholder="Montant" value={a.montant}
                          onChange={e => setAvoirs(prev => prev.map(x => x.id === a.id ? { ...x, montant: e.target.value } : x))} />
                      </td>
                      <td>
                        <select className="form-select" value={a.tva}
                          onChange={e => setAvoirs(prev => prev.map(x => x.id === a.id ? { ...x, tva: e.target.value } : x))}>
                          {TVA_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                      <td>
                        <Paperclip size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </td>
                      <td>
                        <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() =>
                  setAvoirs(prev => [...prev, { id: nextId++, nom: '', categorie: '', montant: '', tva: '20' }])
                }
              >
                Ajouter
              </button>
            </div>
          </>
        )}
      </div>

      {/* Q7 - Retenues de garantie */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-md)', fontSize: '0.875rem' }}>
          Avez-vous facturé des retenues de garantie au cours de l'exercice ?
        </p>
        <div className="radio-group" style={{ marginBottom: hasRetenues ? 'var(--space-md)' : 0 }}>
          <label className="radio-label">
            <input type="radio" name="has_retenues" checked={hasRetenues} onChange={() => setHasRetenues(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="has_retenues" checked={!hasRetenues} onChange={() => setHasRetenues(false)} />
            Non
          </label>
        </div>
        {hasRetenues && (
          <>
            <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>
              Ajoutez les factures concernées
            </p>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Date de la facture</th>
                    <th>Montant HT de la retenue de garantie</th>
                    <th>Facture</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {retenues.map(r => (
                    <tr key={r.id}>
                      <td><input className="form-input" value={todayStr} readOnly /></td>
                      <td>
                        <input className="form-input" placeholder="Montant" value={r.montant}
                          onChange={e => setRetenues(prev => prev.map(x => x.id === r.id ? { ...x, montant: e.target.value } : x))} />
                      </td>
                      <td>
                        <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 10px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                          <Paperclip size={16} color="var(--text-muted)" />
                        </div>
                      </td>
                      <td>
                        <MoreVertical size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={() => setRetenues(prev => [...prev, { id: nextId++, montant: '' }])}
              >
                Ajouter
              </button>
            </div>
          </>
        )}
      </div>

      {/* Q8 - TVA réduite */}
      <div className="card">
        <p style={{ fontWeight: 600, marginBottom: 'var(--space-sm)', fontSize: '0.875rem' }}>
          Les montants suivants correspondent à des encaissements de plus de 10,000€ avec un taux de TVA réduit.
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--space-md)' }}>
          <button className="btn btn-primary" onClick={onClose}>Valider</button>
        </div>
        <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: 'var(--space-sm)' }}>
          Completez les attestations concernées
        </p>
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
              {attestations.map(a => (
                <tr key={a.id}>
                  <td>{a.libelle}</td>
                  <td>{a.date}</td>
                  <td>{a.montant}</td>
                  <td>{a.tva}</td>
                  <td>
                    <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '6px 10px', display: 'flex', justifyContent: 'flex-end', cursor: 'pointer' }}>
                      <Paperclip size={16} color="var(--text-muted)" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
