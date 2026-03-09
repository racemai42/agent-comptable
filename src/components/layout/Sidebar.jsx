import { NavLink } from 'react-router-dom';
import { BarChart3, ArrowLeftRight, Receipt, HardDrive, FileText, Clock, ShoppingCart, Briefcase, FolderOpen, User } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', icon: BarChart3, label: 'Tableau de bord' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'Transactions', badge: 2 },
  { to: '/notes-de-frais', icon: Receipt, label: 'Notes de frais' },
  { to: '/immobilisations', icon: HardDrive, label: 'Immobilisations' },
  { to: '/declarations-ventes', icon: FileText, label: 'Déclarations de ventes' },
  { to: '/echeances', icon: Clock, label: 'Échéances', badge: 3 },
  { to: '/achats', icon: ShoppingCart, label: 'Achats' },
  { to: '/ventes', icon: Briefcase, label: 'Ventes' },
  { to: '/documents', icon: FolderOpen, label: 'Documents', badge: '9+' },
  { to: '/mon-comptable', icon: User, label: 'Mon comptable' },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span style={{ fontSize: '1.4rem' }}>📊</span>
        ComptaAgent
      </div>
      <nav className="sidebar-nav">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          >
            <item.icon size={18} />
            {item.label}
            {item.badge && <span className="sidebar-badge">{item.badge}</span>}
          </NavLink>
        ))}
      </nav>
      <div style={{ padding: '0 var(--space-lg)', marginTop: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontWeight: 600, fontSize: '0.75rem' }}>I</span>
          Icobat
        </div>
      </div>
    </aside>
  );
}
