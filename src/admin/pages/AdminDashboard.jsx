import AdminLayout from '../layouts/AdminLayout';
import AdminStatCard from '../components/AdminStatCard';

export default function AdminDashboard() {
  const stats = [
    ['Revenue', '$48.2K', 'Compared with last week: +12.4%'],
    ['Orders', '1,284', 'New and processing orders together'],
    ['Customers', '8,916', 'Returning audience keeps growing'],
    ['Products', '136', 'Ready for merchandising updates'],
  ];

  const recentOrders = [
    ['#A-1208', 'Protein Stack', 'Paid', 'Today'],
    ['#A-1209', 'Training Tee', 'Pending', 'Today'],
    ['#A-1210', 'Pre-Workout', 'Shipped', 'Yesterday'],
    ['#A-1211', 'Resistance Set', 'Refunded', 'Yesterday'],
  ];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="High-level overview for the admin area. This is a template layout only."
    >
      <section className="admin-hero">
        <div className="admin-hero-copy">
          <div className="admin-hero-badge">Gold / Black / White theme</div>
          <div className="admin-hero-title">
            Build the <span>control room</span> here
          </div>
          <p>
            Keep this area fully separated from storefront styles. The panel is designed as a clean shell for future
            pages like products, orders, and customers without introducing services or hooks yet.
          </p>
        </div>

        <div className="admin-hero-panel">
          <div className="admin-hero-panel-title">Quick snapshot</div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Store status</div>
            <div className="admin-hero-panel-value">Live</div>
          </div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Theme token</div>
            <div className="admin-hero-panel-value">#ddca8a</div>
          </div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">UI scope</div>
            <div className="admin-hero-panel-value">Admin only</div>
          </div>
        </div>
      </section>

      <section className="admin-grid admin-grid--stats">
        {stats.map(([label, value, note]) => (
          <AdminStatCard key={label} label={label} value={value} note={note} />
        ))}
      </section>

      <section className="admin-grid admin-grid--two">
        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Activity</div>
              <div className="admin-card-title">Recent orders</div>
              <div className="admin-card-subtitle">Template table for the orders route.</div>
            </div>
            <div className="admin-chip">Preview only</div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Order</th>
                <th>Product</th>
                <th>Status</th>
                <th>Placed</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(([order, product, status, placed]) => (
                <tr key={order}>
                  <td>
                    <strong>{order}</strong>
                  </td>
                  <td>{product}</td>
                  <td>
                    <span
                      className={`admin-status ${
                        status === 'Paid'
                          ? 'admin-status--success'
                          : status === 'Pending'
                            ? 'admin-status--warning'
                            : status === 'Shipped'
                              ? 'admin-status--neutral'
                              : 'admin-status--warning'
                      }`}
                    >
                      {status}
                    </span>
                  </td>
                  <td>{placed}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Side panel</div>
              <div className="admin-card-title">Template blocks</div>
              <div className="admin-card-subtitle">Use this side area for cards, promos, or filters later.</div>
            </div>
          </div>

          <div className="admin-list">
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Products route</div>
                <div className="admin-list-subtitle">Grid, inventory, pricing, and category management.</div>
              </div>
              <span className="admin-status admin-status--neutral">Ready</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Users route</div>
                <div className="admin-list-subtitle">Customer profiles, roles, and admin permissions later.</div>
              </div>
              <span className="admin-status admin-status--neutral">Ready</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Settings route</div>
                <div className="admin-list-subtitle">Store preferences, theme tokens, and general options.</div>
              </div>
              <span className="admin-status admin-status--neutral">Ready</span>
            </div>
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}