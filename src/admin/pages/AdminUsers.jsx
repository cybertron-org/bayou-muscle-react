import AdminLayout from '../layouts/AdminLayout';

export default function AdminUsers() {
  const users = [
    ['Ava Thompson', 'ava@bayoumuscle.com', 'Customer', 'Active'],
    ['Marcus Lee', 'marcus@bayoumuscle.com', 'Customer', 'Active'],
    ['Jordan Reed', 'jordan@bayoumuscle.com', 'Admin', 'Invited'],
    ['Nia Brooks', 'nia@bayoumuscle.com', 'Support', 'Suspended'],
  ];

  return (
    <AdminLayout title="Users" subtitle="Customer and staff records template.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">People</div>
            <div className="admin-card-title">Users workspace</div>
            <div className="admin-card-subtitle">Structure this page for profiles, roles, permissions, and support actions.</div>
          </div>
          <div className="admin-chip">4 accounts</div>
        </div>

        <div className="admin-grid admin-grid--two">
          <div className="admin-list">
            {users.map(([name, email, role, status]) => (
              <div className="admin-list-item" key={email}>
                <div className="admin-list-copy">
                  <div className="admin-list-title">{name}</div>
                  <div className="admin-list-subtitle">{email} · {role}</div>
                </div>
                <span
                  className={`admin-status ${
                    status === 'Active'
                      ? 'admin-status--success'
                      : status === 'Invited'
                        ? 'admin-status--neutral'
                        : 'admin-status--warning'
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-card-kicker">Profile summary</div>
            <div className="admin-card-title">Selected user</div>
            <div className="admin-card-subtitle">Dummy profile preview for future detail drawers.</div>

            <div className="admin-placeholder" style={{ minHeight: '180px', marginTop: '16px' }}>
              <div>
                <strong>Ava Thompson</strong>
                <div>Orders: 12</div>
                <div>Lifetime spend: $1,240</div>
                <div>Last login: Today, 9:12 AM</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}