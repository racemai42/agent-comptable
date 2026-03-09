// Real API client — talks to Railway backend
const API_BASE = import.meta.env.VITE_API_URL || 'https://agent-comptable-api-production.up.railway.app';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
  return res.json();
}

const COMPANY_ID = 'icobat-001';
const BILAN_ID = 'bilan-2024';

export const api = {
  // Company
  async getCompany() {
    return request(`/api/companies/${COMPANY_ID}`);
  },

  // Dashboard
  async getDashboard() {
    return request(`/api/companies/${COMPANY_ID}/dashboard`);
  },

  // Bilan
  async getBilan() {
    return request(`/api/bilans/${BILAN_ID}`);
  },

  async updateBilanSection(section, data) {
    return request(`/api/bilans/${BILAN_ID}/sections/${section}`, {
      method: 'PATCH',
      body: JSON.stringify({ responses: data }),
    });
  },

  async validateBilanSection(section) {
    return request(`/api/bilans/${BILAN_ID}/sections/${section}`, {
      method: 'PATCH',
      body: JSON.stringify({ status: 'complete' }),
    });
  },

  // Data endpoints
  async getComptesBancaires() { return request(`/api/companies/${COMPANY_ID}/comptes-bancaires`); },
  async getAssocies() { return request(`/api/companies/${COMPANY_ID}/associes`); },
  async getVehiculesPerso() { return request(`/api/companies/${COMPANY_ID}/vehicules-perso`); },
  async getVehiculesPro() { return request(`/api/companies/${COMPANY_ID}/vehicules-pro`); },
  async getEmprunts() { return request(`/api/companies/${COMPANY_ID}/emprunts`); },
  async getFournisseursCutoff() { return request(`/api/companies/${COMPANY_ID}/cutoff-fournisseurs`); },
  async getClientsCutoff() { return request(`/api/companies/${COMPANY_ID}/cutoff-clients`); },
  async getImmobilisations() { return request(`/api/companies/${COMPANY_ID}/immobilisations`); },
  async getCaisses() { return request(`/api/companies/${COMPANY_ID}/caisses`); },
  async getFiliales() { return request(`/api/companies/${COMPANY_ID}/filiales`); },
  async getCanauxVente() { return request(`/api/companies/${COMPANY_ID}/canaux-vente`); },
  async getPlacements() { return request(`/api/companies/${COMPANY_ID}/placements`); },
  async getLitiges() { return request(`/api/companies/${COMPANY_ID}/litiges`); },

  // Messages
  async getMessages(sectionKey) {
    return request(`/api/bilans/${BILAN_ID}/messages?section=${sectionKey}`);
  },

  async sendMessage(sectionKey, content, fromRole = 'client') {
    return request(`/api/bilans/${BILAN_ID}/messages`, {
      method: 'POST',
      body: JSON.stringify({ section_key: sectionKey, from_role: fromRole, content }),
    });
  },

  // OD
  async getOD() {
    return request(`/api/bilans/${BILAN_ID}/od`);
  },

  // Submit
  async submitBilan() {
    return request(`/api/bilans/${BILAN_ID}/submit`, { method: 'POST' });
  },
};
