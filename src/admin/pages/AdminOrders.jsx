import AdminLayout from '../layouts/AdminLayout';

export default function AdminOrders() {
  const orders = [
    ['#A-1208', 'Paid', 'Hydro Whey', '$42.00', '1 item'],
    ['#A-1209', 'Pending', 'Training Tee', '$28.00', '2 items'],
    ['#A-1210', 'Shipped', 'Focus Pre-Workout', '$36.00', '3 items'],
    ['#A-1211', 'Refunded', 'Lifting Belt', '$58.00', '1 item'],
  ];

  return (
    <AdminLayout title="Orders" subtitle="Order workflow template with a dashboard-style layout.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Fulfillment</div>
            <div className="admin-card-title">Orders workspace</div>
            <div className="admin-card-subtitle">This is a visual scaffold for tables, statuses, and detail drawers.</div>
          </div>
          <div className="admin-chip">4 recent orders</div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Status</th>
              <th>Item</th>
              <th>Total</th>
              <th>Qty</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(([order, status, item, total, qty]) => (
              <tr key={order}>
                <td>
                  <strong>{order}</strong>
                </td>
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
                <td>{item}</td>
                <td>{total}</td>
                <td>{qty}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="admin-grid admin-grid--two" style={{ marginTop: '20px' }}>
          <div className="admin-list">
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Packing queue</div>
                <div className="admin-list-subtitle">3 orders waiting for warehouse processing.</div>
              </div>
              <span className="admin-status admin-status--warning">Needs action</span>
            </div>
            <div className="admin-list-item">
              <div className="admin-list-copy">
                <div className="admin-list-title">Shipping labels</div>
                <div className="admin-list-subtitle">2 labels ready to print for today's orders.</div>
              </div>
              <span className="admin-status admin-status--success">Ready</span>
            </div>
          </div>

          <div className="admin-placeholder" style={{ minHeight: '180px' }}>
            <div>
              <strong>Order details</strong>
              <div>Use this panel later for receipts, customer notes, and tracking info.</div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}