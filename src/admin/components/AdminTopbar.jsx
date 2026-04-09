export default function AdminTopbar({ title, subtitle }) {
  return (
    <header className="admin-topbar">
      <div className="admin-topbar-left">
        <div className="admin-eyebrow">Admin panel</div>
        <div className="admin-page-title">{title}</div>
        {subtitle ? <div className="admin-page-subtitle">{subtitle}</div> : null}
      </div>

      <div className="admin-topbar-actions">
        <input className="admin-search" type="search" placeholder="Search orders, products, users..." />
        <button className="admin-icon-btn" type="button" aria-label="Notifications">
          <span>●</span>
        </button>
        <div className="admin-avatar">A</div>
      </div>
    </header>
  );
}