// Bilan section definitions — maps to the 18 sections from LPPro questionnaire
export const BILAN_SECTIONS = [
  { key: 'banques', label: 'Banques', icon: '🏦', time: '5 min', category: 'finance' },
  { key: 'cca', label: 'Compte courant d\'associé', icon: '👥', time: '5 min', category: 'finance' },
  { key: 'vehicule_perso', label: 'Véhicule personnel', icon: '🚗', time: '5 min', category: 'vehicules' },
  { key: 'vehicule_pro', label: 'Véhicule professionnel', icon: '🚛', time: '5 min', category: 'vehicules' },
  { key: 'emprunt', label: 'Emprunt', icon: '🏦', time: '5 min', category: 'finance' },
  { key: 'fournisseurs', label: 'Fournisseurs', icon: '📦', time: '5 min', category: 'cutoff' },
  { key: 'clients', label: 'Clients', icon: '🧾', time: '5 min', category: 'cutoff' },
  { key: 'immobilisations', label: 'Immobilisations', icon: '🏗️', time: '5 min', category: 'actifs' },
  { key: 'projet_en_cours', label: 'Projet en cours', icon: '🔧', time: '5 min', category: 'actifs' },
  { key: 'stock', label: 'Stock', icon: '📦', time: '5 min', category: 'actifs' },
  { key: 'caisse', label: 'Caisse', icon: '💰', time: '5 min', category: 'tresorerie' },
  { key: 'filiales', label: 'Filiales', icon: '🏢', time: '5 min', category: 'juridique' },
  { key: 'litiges', label: 'Litiges', icon: '⚖️', time: '5 min', category: 'juridique' },
  { key: 'dirigeant_tns', label: 'Dirigeant TNS (travailleur non salarié)', icon: '👔', time: '5 min', category: 'social' },
  { key: 'canaux_vente', label: 'Canaux de vente', icon: '🛒', time: '5 min', category: 'ventes' },
  { key: 'garantie_decennale', label: 'Garantie décennale', icon: '🏠', time: '5 min', category: 'btp' },
  { key: 'modifications_statutaires', label: 'Modifications statutaires', icon: '📋', time: '5 min', category: 'juridique' },
  { key: 'agoa', label: 'AGOA', icon: '📄', time: '5 min', category: 'juridique' },
];

export const STATUS_LABELS = {
  complete: { label: 'Complété', color: 'success' },
  pending: { label: 'À compléter', color: 'pending' },
  to_modify: { label: 'À modifier', color: 'warning' },
};
