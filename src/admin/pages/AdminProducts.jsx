import { useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';
import { useNavigate } from 'react-router-dom';

export default function AdminProducts() {
  const navigate = useNavigate();
  const products = [
    {
      name: 'Hydro Whey',
      category: 'Supplements',
      status: 'In stock',
      price: '$42.00',
      stock: '128',
      summary: 'A high-protein recovery formula designed for clean post-workout nutrition.',
      subcategories: ['Protein', 'Recovery', 'Whey'],
      sku: 'BM-SUP-001',
      note: 'Top seller with stable repeat orders.',
    },
    {
      name: 'Focus Pre-Workout',
      category: 'Supplements',
      status: 'Low stock',
      price: '$36.00',
      stock: '24',
      summary: 'Fast energy support with a sharp focus profile for training sessions.',
      subcategories: ['Pre-Workout', 'Energy', 'Pump'],
      sku: 'BM-SUP-014',
      note: 'Low stock warning should be visible in future inventory flow.',
    },
    {
      name: 'Training Tee',
      category: 'Merchandise',
      status: 'In stock',
      price: '$28.00',
      stock: '84',
      summary: 'Lightweight training tee built for everyday gym wear and brand visibility.',
      subcategories: ['Apparel', 'T-Shirts', 'Gym Wear'],
      sku: 'BM-MER-004',
      note: 'Good candidate for upsell blocks and bundle offers.',
    },
    {
      name: 'Lifting Belt',
      category: 'Merchandise',
      status: 'Draft',
      price: '$58.00',
      stock: '12',
      summary: 'Support accessory for heavy lifting and progression-focused training.',
      subcategories: ['Gear', 'Accessories', 'Support'],
      sku: 'BM-MER-019',
      note: 'Still in draft state pending content completion.',
    },
  ];

  const [selectedProduct, setSelectedProduct] = useState(products[0]);

  const getStatusClass = (status) => {
    if (status === 'In stock') {
      return 'admin-status--success';
    }

    if (status === 'Low stock') {
      return 'admin-status--warning';
    }

    return 'admin-status--neutral';
  };

  return (
    <AdminLayout title="Products" subtitle="Product catalog overview and management template.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Catalog</div>
            <div className="admin-card-title">Products workspace</div>
            <div className="admin-card-subtitle">Use this route for product cards, filters, pricing, and inventory views.</div>
          </div>
          <div className="admin-actions-row" style={{ marginLeft: 'auto' }}>
            <button className="admin-action-btn" onClick={() => navigate('/admin/products/add')} type="button">
              + Add Product
            </button>
            <button className="admin-action-btn admin-action-btn--ghost" onClick={() => navigate('/admin/categories')} type="button">
              Manage Categories
            </button>
            <div className="admin-chip">4 products shown</div>
          </div>
        </div>

        <div className="admin-grid admin-grid--two">
          <div className="admin-list">
            {products.map((product) => (
              <button
                className={`admin-list-item admin-list-item--button ${selectedProduct.name === product.name ? 'is-active' : ''}`}
                key={product.name}
                onClick={() => setSelectedProduct(product)}
                type="button"
              >
                <div className="admin-list-copy">
                  <div className="admin-list-title">{product.name}</div>
                  <div className="admin-list-subtitle">
                    {product.category} · {product.price} · {product.stock} units
                  </div>
                </div>
                <span className={`admin-status ${getStatusClass(product.status)}`}>
                  {product.status}
                </span>
              </button>
            ))}
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-card-kicker">Product summary</div>
            <div className="admin-card-title">{selectedProduct.name}</div>
            <div className="admin-card-subtitle">Click any product to view its dummy summary on the right.</div>

            <div className="admin-placeholder admin-placeholder--compact" style={{ marginTop: '16px' }}>
              <div>
                <strong>{selectedProduct.name}</strong>
                <div>{selectedProduct.category}</div>
                <div>Price: {selectedProduct.price}</div>
                <div>Stock: {selectedProduct.stock}</div>
                <div>SKU: {selectedProduct.sku}</div>
                <div>Status: {selectedProduct.status}</div>
                <div style={{ marginTop: '10px' }}>{selectedProduct.summary}</div>
                <div style={{ marginTop: '10px' }}>{selectedProduct.note}</div>
              </div>
            </div>

            <div className="admin-tags-wrap admin-tags-wrap--space">
              {selectedProduct.subcategories.map((item) => (
                <span className="admin-tag" key={item}>
                  {item}
                </span>
              ))}
            </div>

          </div>


        </div>
      </section>
    </AdminLayout>
  );
}