import { useState, useEffect } from 'react';
import { Info, AlertTriangle, Upload } from 'lucide-react';
import { api } from '../../../api/client';

export default function CCASection({ bilan, onClose }) {
  const [associes, setAssocies] = useState([]);
  useEffect(() => { api.getAssocies().then(setAssocies); }, []);

  const hasHighApport = associes.some(a => a.apport > 15000);
  const hasHighSolde = associes.some(a => a.solde_cca > 30000);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>Les comptes courants d'associé (CCA) correspondent à la somme d'argent que la société doit aux associés.</span>
      </div>

      <div className="table-wrapper">
        <table>
          <thead><tr><th>Associé</th><th>Solde CCA</th></tr></thead>
          <tbody>
            {associes.map(a => (
              <tr key={a.id}>
                <td>{a.nom}</td>
                <td style={{ fontWeight: a.solde_cca > 0 ? 600 : 400 }}>
                  {a.solde_cca.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {hasHighApport && (
        <div className="alert-box warning">
          <AlertTriangle size={18} />
          <div>
            <strong>Apports {'>'} 15 000 €</strong>
            <p style={{ marginTop: 4, fontSize: '0.85rem' }}>Expliquez la provenance des fonds et joignez un justificatif attestant l'origine.</p>
            <div className="upload-zone" style={{ marginTop: 8 }}>
              <Upload size={18} style={{ marginRight: 8 }} />
              Ajouter une pièce (PDF, PNG, JPEG)
            </div>
          </div>
        </div>
      )}

      {hasHighSolde && (
        <div className="alert-box warning">
          <AlertTriangle size={18} />
          <div>
            <strong>Solde CCA {'>'} 30 000 € à la clôture</strong>
            <p style={{ marginTop: 4, fontSize: '0.85rem' }}>Une attestation signée par tous les associés est requise.</p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }}>Télécharger le modèle</button>
            <div className="upload-zone" style={{ marginTop: 8 }}>
              <Upload size={18} style={{ marginRight: 8 }} />
              Déposer l'attestation signée
            </div>
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
