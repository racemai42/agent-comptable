const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Auto-seed if DB is empty
try {
  const companyCount = db.prepare('SELECT COUNT(*) as c FROM companies').get().c;
  if (companyCount === 0) {
    console.log('📦 Empty DB detected, running seed...');
    require('./seed');
  }
} catch (e) {
  console.log('📦 Seed error, re-running...', e.message);
  require('./seed');
}

// Health check
app.get('/api/health', (req, res) => {
  const count = db.prepare('SELECT COUNT(*) as c FROM companies').get().c;
  res.json({ status: 'ok', time: new Date().toISOString(), companies: count });
});

// Force seed (dev only)
app.post('/api/seed', (req, res) => {
  require('./seed');
  res.json({ ok: true, message: 'Seeded' });
});

// ─── Company ───
app.get('/api/companies/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM companies WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Not found' });
  res.json(row);
});

// ─── Dashboard ───
app.get('/api/companies/:id/dashboard', (req, res) => {
  const cid = req.params.id;
  const banks = db.prepare('SELECT COALESCE(SUM(solde), 0) as total FROM comptes_bancaires WHERE company_id = ?').get(cid);
  const txCa = db.prepare("SELECT COALESCE(SUM(montant), 0) as total FROM transactions WHERE company_id = ? AND montant > 0").get(cid);
  const txCharges = db.prepare("SELECT COALESCE(SUM(montant), 0) as total FROM transactions WHERE company_id = ? AND montant < 0").get(cid);
  const uncat = db.prepare("SELECT COUNT(*) as count FROM transactions WHERE company_id = ? AND categorie IS NULL").get(cid);
  const desynchro = db.prepare("SELECT COUNT(*) as count FROM comptes_bancaires WHERE company_id = ? AND synced = 0").get(cid);

  res.json({
    solde_total: banks.total,
    ca: txCa.total,
    charges: txCharges.total,
    resultat: txCa.total + txCharges.total,
    transactions_non_cat: uncat.count,
    comptes_desynchro: desynchro.count,
  });
});

// ─── Comptes bancaires ───
app.get('/api/companies/:id/comptes-bancaires', (req, res) => {
  res.json(db.prepare('SELECT * FROM comptes_bancaires WHERE company_id = ?').all(req.params.id));
});

// ─── Associés ───
app.get('/api/companies/:id/associes', (req, res) => {
  res.json(db.prepare('SELECT * FROM associes WHERE company_id = ?').all(req.params.id));
});

// ─── Véhicules ───
app.get('/api/companies/:id/vehicules-perso', (req, res) => {
  res.json(db.prepare('SELECT * FROM vehicules_perso WHERE company_id = ?').all(req.params.id));
});

app.get('/api/companies/:id/vehicules-pro', (req, res) => {
  res.json(db.prepare('SELECT * FROM vehicules_pro WHERE company_id = ?').all(req.params.id));
});

// ─── Emprunts ───
app.get('/api/companies/:id/emprunts', (req, res) => {
  res.json(db.prepare('SELECT * FROM emprunts WHERE company_id = ?').all(req.params.id));
});

// ─── Immobilisations ───
app.get('/api/companies/:id/immobilisations', (req, res) => {
  res.json(db.prepare('SELECT * FROM immobilisations WHERE company_id = ?').all(req.params.id));
});

// ─── Caisses ───
app.get('/api/companies/:id/caisses', (req, res) => {
  res.json(db.prepare('SELECT * FROM caisses WHERE company_id = ?').all(req.params.id));
});

// ─── Filiales ───
app.get('/api/companies/:id/filiales', (req, res) => {
  res.json(db.prepare('SELECT * FROM filiales WHERE company_id = ?').all(req.params.id));
});

// ─── Canaux de vente ───
app.get('/api/companies/:id/canaux-vente', (req, res) => {
  res.json(db.prepare('SELECT * FROM canaux_vente WHERE company_id = ?').all(req.params.id));
});

// ─── Litiges ───
app.get('/api/companies/:id/litiges', (req, res) => {
  res.json(db.prepare('SELECT * FROM litiges WHERE company_id = ?').all(req.params.id));
});

// ─── Cut-off fournisseurs ───
app.get('/api/companies/:id/cutoff-fournisseurs', (req, res) => {
  res.json(db.prepare('SELECT * FROM cutoff_fournisseurs WHERE company_id = ?').all(req.params.id));
});

app.post('/api/companies/:id/cutoff-fournisseurs', (req, res) => {
  const { nom, date_facture, montant_ttc, taux_tva, concerne_n, concerne_n1, pct_exercice_suivant } = req.body;
  const r = db.prepare('INSERT INTO cutoff_fournisseurs (company_id, bilan_id, nom, date_facture, montant_ttc, taux_tva, concerne_n, concerne_n1, pct_exercice_suivant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(req.params.id, 'bilan-2024', nom, date_facture, montant_ttc, taux_tva || 20, concerne_n ? 1 : 0, concerne_n1 ? 1 : 0, pct_exercice_suivant || 0);
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/cutoff-fournisseurs/:id', (req, res) => {
  const fields = req.body;
  const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE cutoff_fournisseurs SET ${sets} WHERE id = ?`).run(...Object.values(fields), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/cutoff-fournisseurs/:id', (req, res) => {
  db.prepare('DELETE FROM cutoff_fournisseurs WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── Cut-off clients ───
app.get('/api/companies/:id/cutoff-clients', (req, res) => {
  res.json(db.prepare('SELECT * FROM cutoff_clients WHERE company_id = ?').all(req.params.id));
});

app.post('/api/companies/:id/cutoff-clients', (req, res) => {
  const { nom, date_facture, montant_ttc, taux_tva, concerne_n, concerne_n1, pct_exercice_suivant } = req.body;
  const r = db.prepare('INSERT INTO cutoff_clients (company_id, bilan_id, nom, date_facture, montant_ttc, taux_tva, concerne_n, concerne_n1, pct_exercice_suivant) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)')
    .run(req.params.id, 'bilan-2024', nom, date_facture, montant_ttc, taux_tva || 20, concerne_n ? 1 : 0, concerne_n1 ? 1 : 0, pct_exercice_suivant || 0);
  res.json({ id: r.lastInsertRowid });
});

app.put('/api/cutoff-clients/:id', (req, res) => {
  const fields = req.body;
  const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
  db.prepare(`UPDATE cutoff_clients SET ${sets} WHERE id = ?`).run(...Object.values(fields), req.params.id);
  res.json({ ok: true });
});

app.delete('/api/cutoff-clients/:id', (req, res) => {
  db.prepare('DELETE FROM cutoff_clients WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── Generic CRUD for all entity tables ───
const CRUD_TABLES = {
  'immobilisations': { table: 'immobilisations', fields: ['nom', 'categorie', 'duree_amortissement', 'prix', 'date_achat'] },
  'emprunts': { table: 'emprunts', fields: ['nom', 'organisme', 'total_remboursement', 'capital_debut', 'capital_fin'] },
  'caisses': { table: 'caisses', fields: ['nom', 'solde'] },
  'filiales': { table: 'filiales', fields: ['nom', 'pct_detention', 'siren', 'regime_fiscal'] },
  'litiges': { table: 'litiges', fields: ['description', 'montant_provision'] },
  'canaux-vente': { table: 'canaux_vente', fields: ['nom', 'type'] },
  'vehicules-perso': { table: 'vehicules_perso', fields: ['immatriculation', 'nom', 'puissance_fiscale', 'km', 'montant_ik'] },
  'vehicules-pro': { table: 'vehicules_pro', fields: ['type', 'immatriculation', 'nom', 'assure', 'usage_perso', 'methode_avantage'] },
  'associes': { table: 'associes', fields: ['nom', 'solde_cca', 'apport'] },
  'placements': { table: 'placements', fields: ['type', 'nom', 'nb_actions', 'prix_achat', 'valeur_cloture'] },
};

for (const [route, cfg] of Object.entries(CRUD_TABLES)) {
  // POST - create
  app.post(`/api/companies/:id/${route}`, (req, res) => {
    const cols = cfg.fields.filter(f => req.body[f] !== undefined);
    const vals = cols.map(f => req.body[f]);
    const placeholders = cols.map(() => '?').join(', ');
    const r = db.prepare(`INSERT INTO ${cfg.table} (company_id, ${cols.join(', ')}) VALUES (?, ${placeholders})`).run(req.params.id, ...vals);
    res.json({ id: r.lastInsertRowid });
  });

  // PUT - update
  app.put(`/api/${route}/:itemId`, (req, res) => {
    const fields = req.body;
    const sets = Object.keys(fields).map(k => `${k} = ?`).join(', ');
    db.prepare(`UPDATE ${cfg.table} SET ${sets} WHERE id = ?`).run(...Object.values(fields), req.params.itemId);
    res.json({ ok: true });
  });

  // DELETE
  app.delete(`/api/${route}/:itemId`, (req, res) => {
    db.prepare(`DELETE FROM ${cfg.table} WHERE id = ?`).run(req.params.itemId);
    res.json({ ok: true });
  });
}

// ─── OD Generation ───
app.post('/api/bilans/:bilanId/sections/:key/generate-od', (req, res) => {
  const { bilanId, key } = req.params;

  // Get bilan info
  const bilan = db.prepare('SELECT * FROM bilans WHERE id = ?').get(bilanId);
  if (!bilan) return res.status(404).json({ error: 'Bilan not found' });

  const dateCloture = bilan.exercice_fin;

  // Delete old auto-generated ODs for this section
  db.prepare('DELETE FROM od_entries WHERE bilan_id = ? AND section_key = ? AND auto_generated = 1').run(bilanId, key);

  const insertOD = db.prepare('INSERT INTO od_entries (bilan_id, section_key, date_od, compte, nom_compte, debit, credit, extourne, auto_generated) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)');

  let odCount = 0;

  if (key === 'clients' || key === 'fournisseurs') {
    // Cut-off ODs
    const table = key === 'clients' ? 'cutoff_clients' : 'cutoff_fournisseurs';
    const rows = db.prepare(`SELECT * FROM ${table} WHERE bilan_id = ?`).all(bilanId);

    for (const row of rows) {
      if (!row.concerne_n1 || !row.pct_exercice_suivant) continue;

      const tva = (row.taux_tva || 20) / 100;
      const montantHT = row.montant_ttc / (1 + tva);
      const pct = row.pct_exercice_suivant / 100;

      if (key === 'clients') {
        // PCA: Produits Constatés d'Avance
        const z = montantHT * pct;
        insertOD.run(bilanId, key, dateCloture, '487000', 'Produits constatés d\'avance', 0, z, 1);
        insertOD.run(bilanId, key, dateCloture, '706000', 'Prestations de services', z, 0, 1);
        odCount += 2;
      } else {
        // CCA/FNP: Charges Constatées d'Avance
        const z = montantHT * pct;
        insertOD.run(bilanId, key, dateCloture, '486000', 'Charges constatées d\'avance', z, 0, 1);
        insertOD.run(bilanId, key, dateCloture, '606000', 'Achats non stockés', 0, z, 1);
        odCount += 2;
      }
    }
  }

  // Mark section as complete
  db.prepare('UPDATE bilan_sections SET status = "complete", updated_at = datetime("now") WHERE bilan_id = ? AND section_key = ?')
    .run(bilanId, key);

  res.json({ ok: true, od_count: odCount });
});

// ─── Placements ───
app.get('/api/companies/:id/placements', (req, res) => {
  res.json(db.prepare('SELECT * FROM placements WHERE company_id = ?').all(req.params.id));
});

// ─── Bilan ───
app.get('/api/bilans/:id', (req, res) => {
  const bilan = db.prepare('SELECT * FROM bilans WHERE id = ?').get(req.params.id);
  if (!bilan) return res.status(404).json({ error: 'Not found' });

  const sections = db.prepare('SELECT * FROM bilan_sections WHERE bilan_id = ?').all(req.params.id);
  const sectionsMap = {};
  for (const s of sections) {
    sectionsMap[s.section_key] = {
      status: s.status,
      has_message: !!s.has_message,
      responses: JSON.parse(s.responses || '{}'),
    };
  }
  res.json({ ...bilan, sections: sectionsMap });
});

app.get('/api/companies/:id/bilans', (req, res) => {
  res.json(db.prepare('SELECT * FROM bilans WHERE company_id = ? ORDER BY exercice_fin DESC').all(req.params.id));
});

// Update bilan section
app.patch('/api/bilans/:bilanId/sections/:key', (req, res) => {
  const { bilanId, key } = req.params;
  const { status, responses } = req.body;

  const existing = db.prepare('SELECT * FROM bilan_sections WHERE bilan_id = ? AND section_key = ?').get(bilanId, key);
  if (!existing) return res.status(404).json({ error: 'Section not found' });

  const newResponses = responses ? JSON.stringify({ ...JSON.parse(existing.responses || '{}'), ...responses }) : existing.responses;
  const newStatus = status || existing.status;

  db.prepare('UPDATE bilan_sections SET status = ?, responses = ?, updated_at = datetime("now") WHERE bilan_id = ? AND section_key = ?')
    .run(newStatus, newResponses, bilanId, key);

  res.json({ ok: true });
});

// Submit bilan
app.post('/api/bilans/:id/submit', (req, res) => {
  db.prepare('UPDATE bilans SET status = "submitted", submitted_at = datetime("now") WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ─── Messages ───
app.get('/api/bilans/:bilanId/messages', (req, res) => {
  const { section } = req.query;
  let query = 'SELECT * FROM messages WHERE bilan_id = ?';
  const params = [req.params.bilanId];
  if (section) { query += ' AND section_key = ?'; params.push(section); }
  query += ' ORDER BY created_at ASC';
  res.json(db.prepare(query).all(...params));
});

app.post('/api/bilans/:bilanId/messages', (req, res) => {
  const { section_key, from_role, content } = req.body;
  const result = db.prepare('INSERT INTO messages (bilan_id, section_key, from_role, content) VALUES (?, ?, ?, ?)')
    .run(req.params.bilanId, section_key, from_role, content);

  // Mark section as having a message
  db.prepare('UPDATE bilan_sections SET has_message = 1 WHERE bilan_id = ? AND section_key = ?')
    .run(req.params.bilanId, section_key);

  res.json({ id: result.lastInsertRowid });
});

// ─── OD ───
app.get('/api/bilans/:bilanId/od', (req, res) => {
  res.json(db.prepare('SELECT * FROM od_entries WHERE bilan_id = ? ORDER BY section_key, id').all(req.params.bilanId));
});

app.listen(PORT, () => {
  console.log(`🚀 Agent Comptable API running on port ${PORT}`);
});
