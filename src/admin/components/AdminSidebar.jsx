import { NavLink, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuth from '../../hooks/useAuth';

export default function AdminSidebar({ isDrawerOpen, onClose }) {
  const navigate = useNavigate();
  const { logout, isLoading } = useAuth();

  const navItems = [
    ['Dashboard'],
    ['Products'],
    ['Orders'],
    ['Customers'],
    ['Contacts'],
    ['Newsletter'],
    ['Settings'],
    ['Categories'],
    ['Discounts'],
    ['Reviews'],
    ['Blogs'],
  ];

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully.');
      onClose?.();
      navigate('/admin/login', { replace: true });
    } catch {
      toast.error('Unable to logout right now.');
      onClose?.();
      navigate('/admin/login', { replace: true });
    }
  };
    
  return (
    <aside className={`admin-sidebar ${isDrawerOpen ? 'admin-sidebar--drawer-open' : ''}`}>
      <div className="admin-brand">
        <div className="admin-brand-mark">B</div>
        <div className="admin-brand-copy">
          <div className="admin-brand-title">Bayou Admin</div>
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
        <button className="admin-sidebar-logout-btn" onClick={handleLogout} type="button" disabled={isLoading}>
          {isLoading ? 'Logging out...' : 'Logout'}
        </button>

        <div className="admin-footer-note"></div>
      </div>
    </aside>
  );
}