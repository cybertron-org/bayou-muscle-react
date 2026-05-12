import { useMemo } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import AdminStatCard from '../components/AdminStatCard';
import useDashboard from '../../hooks/useDashboard';

const formatDate = (value) => {
  if (!value) return '--';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '--';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

const formatPrice = (value) => {
  const amount = Number.parseFloat(value) || 0;
  return `$${amount.toFixed(2)}`;
};

const getOrderStatusClass = (status) => {
  const normalized = String(status || '').toLowerCase();
  if (normalized === 'paid' || normalized === 'completed') return 'admin-status--success';
  if (normalized === 'shipped') return 'admin-status--neutral';
  if (normalized === 'delivered') return 'admin-status--success';
  return 'admin-status--warning';
};

export default function AdminDashboard() {
  const { dashboardData, isLoading, error } = useDashboard({ autoLoad: true, scope: 'admin' });

  const stats = useMemo(() => ([
    {
      label: 'Revenue',
      value: formatPrice(dashboardData.total_revenue),
      note: 'Total revenue from all orders',
    },
    {
      label: 'Orders',
      value: dashboardData.total_orders_count ?? 0,
      note: 'All orders placed in the system',
    },
    {
      label: 'Customers',
      value: dashboardData.total_users_count ?? 0,
      note: 'Registered user accounts',
    },
    {
      label: 'Products',
      value: dashboardData.total_products_count ?? 0,
      note: 'Active catalog items',
    },
  ]), [dashboardData.total_orders_count, dashboardData.total_products_count, dashboardData.total_revenue, dashboardData.total_users_count]);

  const recentOrders = dashboardData.recent_five_orders || [];
  const recentCustomers = dashboardData.recent_five_customers || [];

  return (
    <AdminLayout
      title="Dashboard"
      subtitle="High-level overview for the admin area powered by live dashboard data."
    >
      <section className="admin-hero">
        <div className="admin-hero-copy">
          <div className="admin-hero-badge">Live admin dashboard</div>
          <div className="admin-hero-title">
            Store <span>control room</span>
          </div>
          <p>
            Monitor revenue, order volume, customer growth, and product count from a clean admin shell that keeps the
            existing theme and responsive flow intact.
          </p>
        </div>

        <div className="admin-hero-panel">
          <div className="admin-hero-panel-title">Quick snapshot</div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Revenue</div>
            <div className="admin-hero-panel-value">{formatPrice(dashboardData.total_revenue)}</div>
          </div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Orders</div>
            <div className="admin-hero-panel-value">{dashboardData.total_orders_count ?? 0}</div>
          </div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Customers</div>
            <div className="admin-hero-panel-value">{dashboardData.total_users_count ?? 0}</div>
          </div>
          <div className="admin-hero-panel-row">
            <div className="admin-hero-panel-label">Products</div>
            <div className="admin-hero-panel-value">{dashboardData.total_products_count ?? 0}</div>
          </div>
        </div>
      </section>

      <section className="admin-grid admin-grid--stats">
        {stats.map(({ label, value, note }) => (
          <AdminStatCard key={label} label={label} value={value} note={note} />
        ))}
      </section>

      <section className="admin-grid admin-grid--two">
        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Activity</div>
              <div className="admin-card-title">Recent orders</div>
              <div className="admin-card-subtitle">The five most recent orders from the live admin dashboard.</div>
            </div>
            <div className="admin-chip">Live data</div>
          </div>

          {isLoading ? (
            <div className="admin-table-wrap">
              <div className="admin-card-subtitle">Loading orders...</div>
            </div>
          ) : error ? (
            <div className="admin-table-wrap">
              <div className="admin-card-subtitle">{error}</div>
            </div>
          ) : (
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Placed</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id}>
                      <td>
                        <strong>#{order.id}</strong>
                      </td>
                      <td>
                        <div>{order.user?.name || 'N/A'}</div>
                        <div style={{ color: '#7c7c7c', fontSize: '12px' }}>{order.user?.email || 'N/A'}</div>
                      </td>
                      <td>
                        <span className={`admin-status ${getOrderStatusClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>{order.items_count ?? 0}</td>
                      <td>{formatPrice(order.total_price)}</td>
                      <td>{formatDate(order.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Customers</div>
              <div className="admin-card-title">Recent signups</div>
              <div className="admin-card-subtitle">The latest five customers created in the system.</div>
            </div>
          </div>

          <div className="admin-list">
            {recentCustomers.map((customer) => (
              <div key={customer.id} className="admin-list-item">
                <div className="admin-list-copy">
                  <div className="admin-list-title">{customer.name}</div>
                  <div className="admin-list-subtitle">{customer.email}</div>
                  <div className="admin-list-subtitle">{customer.phone || 'No phone on file'}</div>
                </div>
                <span className="admin-status admin-status--neutral">{formatDate(customer.created_at)}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}