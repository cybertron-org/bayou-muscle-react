import AdminLayout from '../layouts/AdminLayout';

export default function AdminSettings() {
  return (
    <AdminLayout title="Settings" subtitle="Store and design settings template.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Configuration</div>
            <div className="admin-card-title">Settings workspace</div>
            <div className="admin-card-subtitle">Keep controls isolated from storefront styling and theme tokens.</div>
          </div>
          <div className="admin-chip">Saved draft</div>
        </div>

        <div className="admin-grid admin-grid--two">
          <div className="admin-list">
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Store name</div>
                <div className="admin-list-subtitle">Bayou Muscle</div>
              </div>
              <span className="admin-status admin-status--neutral">Editable</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Currency</div>
                <div className="admin-list-subtitle">USD ($)</div>
              </div>
              <span className="admin-status admin-status--neutral">Editable</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Notifications</div>
                <div className="admin-list-subtitle">Email alerts for orders and stock updates</div>
              </div>
              <span className="admin-status admin-status--success">On</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Theme mode</div>
                <div className="admin-list-subtitle">Gold / black / white admin palette</div>
              </div>
              <span className="admin-status admin-status--success">Active</span>
            </div>
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-card-kicker">Theme controls</div>
            <div className="admin-card-title">Visual tokens</div>
            <div className="admin-card-subtitle">Dummy controls for future customization.</div>

            <div className="admin-form-grid">
              <input className="admin-search" type="text" value="#ddca8a" readOnly />
              <input className="admin-search" type="text" value="#000000" readOnly />
              <input className="admin-search" type="text" value="#ffffff" readOnly />
              <input className="admin-search" type="text" value="#202020" readOnly />
            </div>

            <div className="admin-placeholder" style={{ minHeight: '140px', marginTop: '16px' }}>
              <div>
                <strong>Settings preview</strong>
                <div>Logo, footer, and spacing controls can be added later.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}