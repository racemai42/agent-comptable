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

// ─── Cut-off clients ───
app.get('/api/companies/:id/cutoff-clients', (req, res) => {
  res.json(db.prepare('SELECT * FROM cutoff_clients WHERE company_id = ?').all(req.params.id));
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
