const db = require('./db');

// Seed demo data (Icobat)
db.exec(`DELETE FROM bilan_sections; DELETE FROM bilans; DELETE FROM associes; DELETE FROM comptes_bancaires; DELETE FROM vehicules_perso; DELETE FROM vehicules_pro; DELETE FROM emprunts; DELETE FROM immobilisations; DELETE FROM caisses; DELETE FROM filiales; DELETE FROM canaux_vente; DELETE FROM litiges; DELETE FROM companies;`);

// Company
db.prepare(`INSERT INTO companies (id, name, siren, forme, regime_tva, activite, secteur, date_creation, exercice_debut, exercice_fin, deadline_bilan, dirigeant_nom, dirigeant_prenom, dirigeant_statut) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(
  'icobat-001', 'Icobat', '123456789', 'SARL', 'réel simplifié', 'BTP', 'btp', '2020-03-15', '2024-01-01', '2024-06-30', '2024-10-30', 'Dupont', 'Jean', 'TNS'
);

// Bank accounts
const insertBank = db.prepare(`INSERT INTO comptes_bancaires (company_id, banque, nom, solde, synced) VALUES (?, ?, ?, ?, ?)`);
insertBank.run('icobat-001', 'Qonto', 'Compte principal', 4200.50, 1);
insertBank.run('icobat-001', 'Banque Populaire', 'Compte courant', 1414.32, 1);

// Associés
const insertAssoc = db.prepare(`INSERT INTO associes (company_id, nom, solde_cca, apport) VALUES (?, ?, ?, ?)`);
insertAssoc.run('icobat-001', 'Nadia', 411645.26, 200000);
insertAssoc.run('icobat-001', 'Manu', 20205.71, 18000);
insertAssoc.run('icobat-001', 'Yannis Azouz', 0, 0);
insertAssoc.run('icobat-001', 'Jean Miche', 0, 0);

// Véhicules
db.prepare(`INSERT INTO vehicules_perso (company_id, immatriculation, nom, puissance_fiscale, km, montant_ik) VALUES (?, ?, ?, ?, ?, ?)`).run('icobat-001', 'AB-123-CD', 'Renault Clio', 5, 8500, 3825);
db.prepare(`INSERT INTO vehicules_pro (company_id, type, immatriculation, nom, assure, usage_perso) VALUES (?, ?, ?, ?, ?, ?)`).run('icobat-001', 'Voiture', 'EF-456-GH', 'Peugeot Partner', 1, 0);

// Emprunts
db.prepare(`INSERT INTO emprunts (company_id, nom, organisme, total_remboursement, capital_debut, capital_fin) VALUES (?, ?, ?, ?, ?, ?)`).run('icobat-001', 'Emprunt CIC', 'CIC', 166.47, 12000, 10500);

// Immobilisations
const insertImmo = db.prepare(`INSERT INTO immobilisations (company_id, nom, categorie, duree_amortissement, prix, date_achat) VALUES (?, ?, ?, ?, ?, ?)`);
insertImmo.run('icobat-001', 'MacBook Pro', 'Matériel informatique', 3, 2499, '2023-01-15');
insertImmo.run('icobat-001', 'Camionnette', 'Véhicule', 5, 25000, '2022-06-01');

// Caisses
db.prepare(`INSERT INTO caisses (company_id, nom, solde) VALUES (?, ?, ?)`).run('icobat-001', 'Boutique principale', 400);
db.prepare(`INSERT INTO caisses (company_id, nom, solde) VALUES (?, ?, ?)`).run('icobat-001', 'Caisse secondaire', 300);

// Filiales
db.prepare(`INSERT INTO filiales (company_id, nom, pct_detention, siren, regime_fiscal) VALUES (?, ?, ?, ?, ?)`).run('icobat-001', 'Icobat Services', 80, '987654321', 'IS');

// Canaux de vente
db.prepare(`INSERT INTO canaux_vente (company_id, nom, type) VALUES (?, ?, ?)`).run('icobat-001', 'Boutique physique', 'physique');

// Litiges
db.prepare(`INSERT INTO litiges (company_id, description, montant_provision) VALUES (?, ?, ?)`).run('icobat-001', 'Litige fournisseur matériel', 300);

// Bilan
db.prepare(`INSERT INTO bilans (id, company_id, exercice_debut, exercice_fin, deadline) VALUES (?, ?, ?, ?, ?)`).run('bilan-2024', 'icobat-001', '2024-01-01', '2024-06-30', '2024-10-30');

// Bilan sections
const SECTIONS = [
  ['banques', 'complete', 1], ['cca', 'complete', 0], ['vehicule_perso', 'to_modify', 1],
  ['vehicule_pro', 'complete', 0], ['emprunt', 'pending', 0], ['fournisseurs', 'complete', 0],
  ['clients', 'pending', 0], ['immobilisations', 'complete', 0], ['projet_en_cours', 'complete', 0],
  ['stock', 'pending', 0], ['caisse', 'complete', 0], ['filiales', 'complete', 0],
  ['litiges', 'complete', 0], ['dirigeant_tns', 'complete', 0], ['canaux_vente', 'pending', 0],
  ['garantie_decennale', 'pending', 0], ['modifications_statutaires', 'pending', 0], ['agoa', 'complete', 0],
];

const insertSection = db.prepare(`INSERT INTO bilan_sections (bilan_id, section_key, status, has_message, responses) VALUES (?, ?, ?, ?, ?)`);
for (const [key, status, msg] of SECTIONS) {
  insertSection.run('bilan-2024', key, status, msg, '{}');
}

console.log('✅ Seed complete');
