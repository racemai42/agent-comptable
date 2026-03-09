const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = process.env.DB_PATH || path.join(__dirname, 'data.db');
const db = new Database(DB_PATH);

// WAL mode for better concurrent reads
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Schema
db.exec(`
  -- Companies
  CREATE TABLE IF NOT EXISTS companies (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    siren TEXT,
    forme TEXT,
    regime_tva TEXT,
    activite TEXT,
    secteur TEXT,
    date_creation TEXT,
    exercice_debut TEXT,
    exercice_fin TEXT,
    deadline_bilan TEXT,
    dirigeant_nom TEXT,
    dirigeant_prenom TEXT,
    dirigeant_statut TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
  );

  -- Bank accounts
  CREATE TABLE IF NOT EXISTS comptes_bancaires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    banque TEXT,
    nom TEXT,
    solde REAL DEFAULT 0,
    synced INTEGER DEFAULT 1,
    last_sync TEXT
  );

  -- Associés (CCA)
  CREATE TABLE IF NOT EXISTS associes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT NOT NULL,
    solde_cca REAL DEFAULT 0,
    apport REAL DEFAULT 0
  );

  -- Véhicules personnels
  CREATE TABLE IF NOT EXISTS vehicules_perso (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    immatriculation TEXT,
    nom TEXT,
    puissance_fiscale INTEGER,
    km INTEGER DEFAULT 0,
    montant_ik REAL DEFAULT 0
  );

  -- Véhicules professionnels
  CREATE TABLE IF NOT EXISTS vehicules_pro (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    type TEXT,
    immatriculation TEXT,
    nom TEXT,
    assure INTEGER DEFAULT 1,
    usage_perso INTEGER DEFAULT 0,
    methode_avantage TEXT -- 'forfait' or 'reel'
  );

  -- Emprunts
  CREATE TABLE IF NOT EXISTS emprunts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT,
    organisme TEXT,
    total_remboursement REAL,
    capital_debut REAL,
    capital_fin REAL,
    echeancier_file TEXT
  );

  -- Transactions (simplified)
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    date TEXT,
    libelle TEXT,
    montant REAL,
    categorie TEXT,
    taux_tva REAL,
    compte_bancaire_id INTEGER REFERENCES comptes_bancaires(id)
  );

  -- Cut-off fournisseurs
  CREATE TABLE IF NOT EXISTS cutoff_fournisseurs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    bilan_id TEXT,
    nom TEXT,
    date_facture TEXT,
    montant_ttc REAL,
    taux_tva REAL DEFAULT 20,
    concerne_n INTEGER DEFAULT 1,
    concerne_n1 INTEGER DEFAULT 0,
    pct_exercice_suivant REAL DEFAULT 0,
    statut TEXT DEFAULT 'pending'
  );

  -- Cut-off clients
  CREATE TABLE IF NOT EXISTS cutoff_clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    bilan_id TEXT,
    nom TEXT,
    date_facture TEXT,
    montant_ttc REAL,
    taux_tva REAL DEFAULT 20,
    concerne_n INTEGER DEFAULT 1,
    concerne_n1 INTEGER DEFAULT 0,
    pct_exercice_suivant REAL DEFAULT 0,
    statut TEXT DEFAULT 'pending'
  );

  -- Immobilisations
  CREATE TABLE IF NOT EXISTS immobilisations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT,
    categorie TEXT,
    duree_amortissement INTEGER,
    prix REAL,
    date_achat TEXT
  );

  -- Caisses
  CREATE TABLE IF NOT EXISTS caisses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT,
    solde REAL DEFAULT 0
  );

  -- Filiales
  CREATE TABLE IF NOT EXISTS filiales (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT,
    pct_detention REAL,
    siren TEXT,
    regime_fiscal TEXT
  );

  -- Canaux de vente
  CREATE TABLE IF NOT EXISTS canaux_vente (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    nom TEXT,
    type TEXT -- 'e-commerce', 'physique', 'marketplace', etc.
  );

  -- Placements financiers
  CREATE TABLE IF NOT EXISTS placements (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    type TEXT, -- 'obligations', 'compte_terme', 'crypto', 'actions_cotees', 'actions_non_cotees'
    nom TEXT,
    nb_actions REAL,
    prix_achat REAL,
    valeur_cloture REAL
  );

  -- Bilan questionnaire
  CREATE TABLE IF NOT EXISTS bilans (
    id TEXT PRIMARY KEY,
    company_id TEXT REFERENCES companies(id),
    exercice_debut TEXT,
    exercice_fin TEXT,
    deadline TEXT,
    status TEXT DEFAULT 'draft', -- draft, submitted, in_review, completed
    created_at TEXT DEFAULT (datetime('now')),
    submitted_at TEXT
  );

  -- Bilan section responses
  CREATE TABLE IF NOT EXISTS bilan_sections (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bilan_id TEXT REFERENCES bilans(id),
    section_key TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, complete, to_modify
    has_message INTEGER DEFAULT 0,
    responses TEXT DEFAULT '{}', -- JSON
    updated_at TEXT DEFAULT (datetime('now')),
    UNIQUE(bilan_id, section_key)
  );

  -- Messages (aller-retour client <-> comptable)
  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bilan_id TEXT REFERENCES bilans(id),
    section_key TEXT,
    from_role TEXT NOT NULL, -- 'client' or 'comptable'
    content TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  -- OD générées (opérations diverses)
  CREATE TABLE IF NOT EXISTS od_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bilan_id TEXT REFERENCES bilans(id),
    section_key TEXT,
    date_od TEXT,
    compte TEXT,
    nom_compte TEXT,
    debit REAL DEFAULT 0,
    credit REAL DEFAULT 0,
    extourne INTEGER DEFAULT 0,
    auto_generated INTEGER DEFAULT 1
  );

  -- Litiges
  CREATE TABLE IF NOT EXISTS litiges (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    company_id TEXT REFERENCES companies(id),
    description TEXT,
    montant_provision REAL
  );
`);

module.exports = db;
