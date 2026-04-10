import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

export default function AdminUsers() {
  const users = [
    {
      name: 'Ava Thompson',
      email: 'ava@bayoumuscle.com',
      role: 'Customer',
      status: 'Active',
      orders: 12,
      spend: '$1,240',
      lastLogin: 'Today, 9:12 AM',
      note: 'Frequent repeat buyer with strong supplement engagement.',
    },
    {
      name: 'Marcus Lee',
      email: 'marcus@bayoumuscle.com',
      role: 'Customer',
      status: 'Active',
      orders: 8,
      spend: '$860',
      lastLogin: 'Yesterday, 5:20 PM',
      note: 'Mainly buys apparel and performance products.',
    },
    {
      name: 'Jordan Reed',
      email: 'jordan@bayoumuscle.com',
      role: 'Admin',
      status: 'Invited',
      orders: 0,
      spend: '$0',
      lastLogin: 'Not logged in yet',
      note: 'Team account pending onboarding and role confirmation.',
    },
    {
      name: 'Nia Brooks',
      email: 'nia@bayoumuscle.com',
      role: 'Support',
      status: 'Suspended',
      orders: 3,
      spend: '$420',
      lastLogin: '3 days ago',
      note: 'Requires review due to account activity flag.',
    },
  ];

  const [selectedUser, setSelectedUser] = useState(users[0]);

  const getStatusClass = (status) => {
    if (status === 'Active') {
      return 'admin-status--success';
    }

    if (status === 'Invited') {
      return 'admin-status--neutral';
    }

    return 'admin-status--warning';
  };

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
            {users.map((user) => (
              <button
                className={`admin-list-item admin-list-item--button ${selectedUser.email === user.email ? 'is-active' : ''}`}
                key={user.email}
                onClick={() => setSelectedUser(user)}
                type="button"
              >
                <div className="admin-list-copy">
                  <div className="admin-list-title">{user.name}</div>
                  <div className="admin-list-subtitle">
                    {user.email} · {user.role}
                  </div>
                </div>
                <span className={`admin-status ${getStatusClass(user.status)}`}>
                  {user.status}
                </span>
              </button>
            ))}
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-card-kicker">Profile summary</div>
            <div className="admin-card-title">{selectedUser.name}</div>
            <div className="admin-card-subtitle">Dummy profile preview for future detail drawers.</div>

            <div className="admin-placeholder" style={{ minHeight: '180px', marginTop: '16px' }}>
              <div>
                <strong>{selectedUser.name}</strong>
                <div>{selectedUser.email}</div>
                <div>Role: {selectedUser.role}</div>
                <div>Status: {selectedUser.status}</div>
                <div>Orders: {selectedUser.orders}</div>
                <div>Lifetime spend: {selectedUser.spend}</div>
                <div>Last login: {selectedUser.lastLogin}</div>
                <div style={{ marginTop: '10px' }}>{selectedUser.note}</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}