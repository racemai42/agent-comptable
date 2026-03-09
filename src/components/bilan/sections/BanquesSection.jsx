import { useState, useEffect } from 'react';
import { Info, Upload } from 'lucide-react';
import { api } from '../../../api/mock';

export default function BanquesSection({ bilan, onClose }) {
  const [comptes, setComptes] = useState([]);
  const [autresComptes, setAutresComptes] = useState(bilan?.responses?.banques?.autres_comptes ?? false);

  useEffect(() => {
    api.getComptesBancaires().then(setComptes);
  }, []);

  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>Vous avez synchronisé <strong>{comptes.length} compte(s)</strong> sur ComptaAgent.</span>
      </div>

      <div className="card">
        <p className="form-label">Avez-vous d'autres comptes bancaires liés à votre société ?</p>
        <div className="radio-group">
          <label className="radio-label">
            <input type="radio" name="autres_comptes" checked={autresComptes} onChange={() => setAutresComptes(true)} />
            Oui
          </label>
          <label className="radio-label">
            <input type="radio" name="autres_comptes" checked={!autresComptes} onChange={() => setAutresComptes(false)} />
            Non
          </label>
        </div>
      </div>

      <div className="card">
        <p className="form-label" style={{ marginBottom: 'var(--space-md)' }}>Relevés bancaires</p>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Banque</th>
                <th>Compte</th>
                <th>Solde</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {comptes.map(c => (
                <tr key={c.id}>
                  <td>{c.banque}</td>
                  <td>{c.nom}</td>
                  <td>{c.solde.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</td>
                  <td>
                    <button className="btn btn-outline btn-sm">
                      <Upload size={14} /> Déposer les relevés
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="drawer-footer">
        <button className="btn btn-outline" onClick={onClose}>Annuler</button>
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
