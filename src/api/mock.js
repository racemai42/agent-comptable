// Mock API — will be replaced by real Node.js backend
// Simulates the data structure from LPPro staging (client Icobat)

const MOCK_COMPANY = {
  id: 'icobat-001',
  name: 'Icobat',
  siren: '123456789',
  forme: 'SARL',
  regime_tva: 'réel simplifié',
  activite: 'BTP',
  date_creation: '2020-03-15',
  exercice: { debut: '2024-01-01', fin: '2024-06-30' },
  deadline_bilan: '2024-10-30',
  dirigeant: { nom: 'Dupont', prenom: 'Jean', statut: 'TNS' },
};

const MOCK_ASSOCIES = [
  { id: 1, nom: 'Nadia', solde_cca: 411645.26, apport: 200000 },
  { id: 2, nom: 'Manu', solde_cca: 20205.71, apport: 18000 },
  { id: 3, nom: 'Yannis Azouz', solde_cca: 0, apport: 0 },
  { id: 4, nom: 'Jean Miche', solde_cca: 0, apport: 0 },
];

const MOCK_COMPTES_BANCAIRES = [
  { id: 1, banque: 'Qonto', nom: 'Compte principal', solde: 4200.50, synced: true },
  { id: 2, banque: 'Banque Populaire', nom: 'Compte courant', solde: 1414.32, synced: true },
];

const MOCK_VEHICULES_PERSO = [
  { id: 1, immatriculation: 'AB-123-CD', nom: 'Renault Clio', km: 8500, montant_ik: 3825 },
];

const MOCK_VEHICULES_PRO = [
  { id: 1, type: 'Voiture', immatriculation: 'EF-456-GH', nom: 'Peugeot Partner', complet: true, assure: true, usage_perso: false },
];

const MOCK_EMPRUNTS = [
  { id: 1, nom: 'Emprunt CIC', total_remboursement: 166.47, capital_debut: 12000, capital_fin: 10500, echeancier: null },
];

const MOCK_FOURNISSEURS_CUTOFF = [
  { id: 1, nom: 'Fournisseur A', date: '2024-05-15', montant: 2500, concerne_n: true, concerne_n1: false, pct_realise: 100, statut: 'validé' },
  { id: 2, nom: 'Fournisseur B', date: '2024-06-20', montant: 3200, concerne_n: true, concerne_n1: true, pct_realise: 60, statut: 'en_attente' },
];

const MOCK_CLIENTS_CUTOFF = [
  { id: 1, nom: 'ACME Corp', date: '2024-05-10', montant: 2302.20, concerne_n: true, concerne_n1: false, pct_realise: 50, statut: 'en_attente' },
];

const MOCK_IMMOBILISATIONS = [
  { id: 1, nom: 'MacBook Pro', categorie: 'Matériel informatique', duree: 3, prix: 2499, date_achat: '2023-01-15' },
  { id: 2, nom: 'Camionnette', categorie: 'Véhicule', duree: 5, prix: 25000, date_achat: '2022-06-01' },
];

const MOCK_CAISSES = [
  { id: 1, nom: 'Boutique principale', solde: 400 },
  { id: 2, nom: 'Caisse secondaire', solde: 300 },
];

const MOCK_FILIALES = [
  { id: 1, nom: 'Icobat Services', pct_detention: 80, siren: '987654321', regime_fiscal: 'IS' },
];

const MOCK_CANAUX_VENTE = [
  { id: 1, nom: 'Shopify', type: 'e-commerce' },
  { id: 2, nom: 'Boutique physique', type: 'physique' },
];

// Bilan questionnaire state
const MOCK_BILAN = {
  id: 'bilan-2024',
  exercice: { debut: '2024-01-01', fin: '2024-06-30' },
  deadline: '2024-10-30',
  sections: {
    banques: { status: 'complete', has_message: true },
    cca: { status: 'complete', has_message: false },
    vehicule_perso: { status: 'to_modify', has_message: true },
    vehicule_pro: { status: 'complete', has_message: false },
    emprunt: { status: 'pending', has_message: false },
    fournisseurs: { status: 'complete', has_message: false },
    clients: { status: 'pending', has_message: false },
    immobilisations: { status: 'complete', has_message: false },
    projet_en_cours: { status: 'complete', has_message: false },
    stock: { status: 'pending', has_message: false },
    caisse: { status: 'complete', has_message: false },
    filiales: { status: 'complete', has_message: false },
    litiges: { status: 'complete', has_message: false },
    dirigeant_tns: { status: 'complete', has_message: false },
    canaux_vente: { status: 'pending', has_message: false },
    garantie_decennale: { status: 'pending', has_message: false },
    modifications_statutaires: { status: 'pending', has_message: false },
    agoa: { status: 'complete', has_message: false },
  },
  responses: {
    banques: { autres_comptes: false },
    cca: {},
    vehicule_perso: { ik_correct: true },
    vehicule_pro: { assures: true, usage_perso: false },
    emprunt: {},
    fournisseurs: {},
    clients: {},
    immobilisations: { liste_validee: true },
    projet_en_cours: { has_projet: true, description: 'Développement logiciel', montant_paye: 1000, detail_materiel: 200, detail_soustraitance: 600, montant_total: 3000 },
    stock: { has_stock: true, valeur_totale: 5001, marchandises: 100, matiere_premiere: 100, produits_en_cours: 50, perte: true, perte_totale: 300 },
    caisse: { has_caisse: true },
    filiales: { convention_tresorerie: true },
    litiges: { has_litiges: true, litiges: [{ raison: 'Litige fournisseur', montant: 300 }] },
    dirigeant_tns: { acre: true, remuneration: false },
    canaux_vente: {},
    garantie_decennale: { sinistres: false },
    modifications_statutaires: { changements: ['raison_sociale'], methode: 'autre' },
    agoa: { mensualise: true },
  },
};

// Simulated API delay
const delay = (ms = 300) => new Promise(r => setTimeout(r, ms));

export const api = {
  // Company
  async getCompany() {
    await delay();
    return MOCK_COMPANY;
  },

  // Bilan
  async getBilan() {
    await delay();
    return MOCK_BILAN;
  },

  async updateBilanSection(section, data) {
    await delay();
    MOCK_BILAN.responses[section] = { ...MOCK_BILAN.responses[section], ...data };
    return { ok: true };
  },

  async validateBilanSection(section) {
    await delay();
    MOCK_BILAN.sections[section].status = 'complete';
    return { ok: true };
  },

  // Data endpoints
  async getComptesBancaires() { await delay(); return MOCK_COMPTES_BANCAIRES; },
  async getAssocies() { await delay(); return MOCK_ASSOCIES; },
  async getVehiculesPerso() { await delay(); return MOCK_VEHICULES_PERSO; },
  async getVehiculesPro() { await delay(); return MOCK_VEHICULES_PRO; },
  async getEmprunts() { await delay(); return MOCK_EMPRUNTS; },
  async getFournisseursCutoff() { await delay(); return MOCK_FOURNISSEURS_CUTOFF; },
  async getClientsCutoff() { await delay(); return MOCK_CLIENTS_CUTOFF; },
  async getImmobilisations() { await delay(); return MOCK_IMMOBILISATIONS; },
  async getCaisses() { await delay(); return MOCK_CAISSES; },
  async getFiliales() { await delay(); return MOCK_FILIALES; },
  async getCanauxVente() { await delay(); return MOCK_CANAUX_VENTE; },

  // Dashboard
  async getDashboard() {
    await delay();
    return {
      solde_total: 5614.82,
      ca: 1033,
      charges: -13090,
      resultat: -12056,
      comptes_desynchro: 2,
      transactions_non_cat: 2,
      documents_count: 9,
    };
  },
};
