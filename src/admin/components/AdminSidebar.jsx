import { NavLink } from 'react-router-dom';

export default function AdminSidebar({ isDrawerOpen, onClose }) {
  const navItems = [
    ['Dashboard'],
    ['Products'],
    ['Orders'],
    ['Users'],
    ['Settings'],
    ['Categories'],
    ['Discounts'],
  ];
    
  return (
    <aside className={`admin-sidebar ${isDrawerOpen ? 'admin-sidebar--drawer-open' : ''}`}>
      <div className="admin-brand">
        <div className="admin-brand-mark">B</div>
        <div className="admin-brand-copy">
          <div className="admin-brand-title">Bayou Admin</div>
          <div className="admin-brand-subtitle">UI only</div>
        </div>
        <button aria-label="Close sidebar" className="admin-sidebar-close" onClick={onClose} type="button">
          ×
        </button>
      </div>

    <nav className="admin-nav" aria-label="Admin navigation">
      <div className="admin-nav-label">Workspace</div>
      {navItems.map(([label, count]) => (
        <NavLink
          to={`/admin/${label.toLowerCase()}`}
          key={label}
          onClick={onClose}
          className={({ isActive }) => 
            `admin-nav-link ${isActive ? 'is-active' : ''}`
          }
        >
          <span>{label}</span>
          
        </NavLink>
      ))}
    </nav>

      <div className="admin-sidebar-footer">
        <div className="admin-status-card">
          <div className="admin-status-kicker">Theme</div>
          <div className="admin-status-value">Gold</div>
          <div className="admin-status-text">
            Uses the shared Bayou palette with separate admin surface styling.
          </div>
        </div>
        <div className="admin-footer-note">No services. No hooks. UI template only.</div>
      </div>
    </aside>
  );
}