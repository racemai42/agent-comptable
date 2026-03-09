import { Info } from 'lucide-react';

export default function GenericSection({ sectionKey, onClose }) {
  return (
    <div>
      <div className="info-box">
        <Info size={18} />
        <span>Cette section est en cours de développement.</span>
      </div>
      <div className="drawer-footer">
        <button className="btn btn-primary" onClick={onClose}>Valider</button>
      </div>
    </div>
  );
}
