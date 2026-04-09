import AdminLayout from '../layouts/AdminLayout';

export default function AdminProducts() {
  const products = [
    ['Hydro Whey', 'Protein', 'In stock', '$42.00', '128'],
    ['Focus Pre-Workout', 'Supplements', 'Low stock', '$36.00', '24'],
    ['Training Tee', 'Apparel', 'In stock', '$28.00', '84'],
    ['Lifting Belt', 'Gear', 'Draft', '$58.00', '12'],
  ];

  return (
    <AdminLayout title="Products" subtitle="Product catalog overview and management template.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Catalog</div>
            <div className="admin-card-title">Products workspace</div>
            <div className="admin-card-subtitle">Use this route for product cards, filters, pricing, and inventory views.</div>
          </div>
          <div className="admin-chip">4 products shown</div>
        </div>

        <div className="admin-grid admin-grid--two">
          <div className="admin-list">
            {products.map(([name, category, status, price, stock]) => (
              <div className="admin-list-item" key={name}>
                <div className="admin-list-copy">
                  <div className="admin-list-title">{name}</div>
                  <div className="admin-list-subtitle">
                    {category} · {price} · {stock} units
                  </div>
                </div>
                <span
                  className={`admin-status ${
                    status === 'In stock'
                      ? 'admin-status--success'
                      : status === 'Low stock'
                        ? 'admin-status--warning'
                        : 'admin-status--neutral'
                  }`}
                >
                  {status}
                </span>
              </div>
            ))}
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-card-kicker">Quick edit</div>
            <div className="admin-card-title">Add new product</div>
            <div className="admin-card-subtitle">Static template form for later use.</div>

            <div className="admin-form-grid">
              <input className="admin-search" type="text" placeholder="Product name" />
              <input className="admin-search" type="text" placeholder="Category" />
              <input className="admin-search" type="text" placeholder="Price" />
              <input className="admin-search" type="text" placeholder="Stock" />
            </div>

            <div className="admin-placeholder" style={{ minHeight: '120px', marginTop: '16px' }}>
              <div>
                <strong>Product preview</strong>
                <div>Images, variants, and tags can live here later.</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AdminLayout>
  );
}