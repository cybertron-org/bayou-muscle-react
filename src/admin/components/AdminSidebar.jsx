import { useNavigate,NavLink} from "react-router-dom";

export default function AdminSidebar() {
  const navItems = [
    ['Dashboard', '08'],
    ['Products', '24'],
    ['Orders', '19'],
    ['Users', '12'],
    ['Settings', '04'],
  ];
    
  const navigate = useNavigate();

  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <div className="admin-brand-mark">B</div>
        <div className="admin-brand-copy">
          <div className="admin-brand-title">Bayou Admin</div>
          <div className="admin-brand-subtitle">UI only</div>
        </div>
      </div>

    <nav className="admin-nav" aria-label="Admin navigation">
      <div className="admin-nav-label">Workspace</div>
      {navItems.map(([label, count]) => (
        <NavLink
          to={`/admin/${label.toLowerCase()}`}
          key={label}
          className={({ isActive }) => 
            `admin-nav-link ${isActive ? 'is-active' : ''}`
          }
        >
          <span>{label}</span>
          <span className="admin-nav-pill">{count}</span>
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