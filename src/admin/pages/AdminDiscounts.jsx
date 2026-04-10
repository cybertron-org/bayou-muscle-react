import { useMemo, useState } from 'react';
import AdminLayout from '../layouts/AdminLayout';

const initialCoupons = [
  { code: 'BAYOU10', type: 'Coupon', value: '10%', scope: 'Entire store', status: 'Active' },
  { code: 'GOLD25', type: 'Coupon', value: '$25', scope: 'Orders above $100', status: 'Scheduled' },
  { code: 'FUEL15', type: 'Coupon', value: '15%', scope: 'Supplement category', status: 'Expired' },
];

const initialProductDiscounts = [
  { product: 'Hydro Whey', mode: 'Percentage', value: '20%', status: 'Active' },
  { product: 'Training Tee', mode: 'Absolute', value: '$8', status: 'Draft' },
  { product: 'Lifting Belt', mode: 'Percentage', value: '12%', status: 'Active' },
];

export default function AdminDiscounts() {
  const [discountType, setDiscountType] = useState('coupon');
  const [couponCode, setCouponCode] = useState('');
  const [couponAmount, setCouponAmount] = useState('');
  const [couponAmountType, setCouponAmountType] = useState('percentage');
  const [couponScope, setCouponScope] = useState('Entire store');
  const [productName, setProductName] = useState('Hydro Whey');
  const [productDiscountType, setProductDiscountType] = useState('percentage');
  const [productDiscountValue, setProductDiscountValue] = useState('');
  const [productScope, setProductScope] = useState('Supplement');

  const coupons = useMemo(() => initialCoupons, []);
  const productDiscounts = useMemo(() => initialProductDiscounts, []);

  const renderStatus = (status) => {
    if (status === 'Active') {
      return 'admin-status--success';
    }
    if (status === 'Scheduled') {
      return 'admin-status--warning';
    }
    return 'admin-status--neutral';
  };

  return (
    <AdminLayout
      title="Discounts"
      subtitle="Define coupon codes and product-level discounts in a clean UI-only workspace."
    >
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Promotions</div>
            <div className="admin-card-title">Discount manager</div>
            <div className="admin-card-subtitle">
              Create coupon-based discounts or assign a discount to a specific product.
            </div>
          </div>
          <div className="admin-chip">UI only</div>
        </div>

        <div className="admin-discount-switcher">
          <button
            className={`admin-category-card admin-discount-switch ${discountType === 'coupon' ? 'is-active' : ''}`}
            onClick={() => setDiscountType('coupon')}
            type="button"
          >
            <div className="admin-category-card-label">Discount type</div>
            <div className="admin-category-card-title">Coupon code</div>
            <div className="admin-category-card-copy">Admin defines a code and the discount it applies.</div>
          </button>

          <button
            className={`admin-category-card admin-discount-switch ${discountType === 'product' ? 'is-active' : ''}`}
            onClick={() => setDiscountType('product')}
            type="button"
          >
            <div className="admin-category-card-label">Discount type</div>
            <div className="admin-category-card-title">Product discount</div>
            <div className="admin-category-card-copy">Admin selects a product and defines an amount off.</div>
          </button>
        </div>

        <div className="admin-create-layout admin-discount-layout">
          <div className="admin-card" style={{ padding: '18px' }}>
            {discountType === 'coupon' ? (
              <>
                <div className="admin-form-section-title">Coupon setup</div>
                <div className="admin-form-grid">
                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="couponCode">Coupon code</label>
                    <input
                      className="admin-field"
                      id="couponCode"
                      placeholder="Ex: BAYOU10"
                      type="text"
                      value={couponCode}
                      onChange={(event) => setCouponCode(event.target.value.toUpperCase())}
                    />
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="couponScope">Scope</label>
                    <select
                      className="admin-field"
                      id="couponScope"
                      value={couponScope}
                      onChange={(event) => setCouponScope(event.target.value)}
                    >
                      <option>Entire store</option>
                      <option>Supplement category</option>
                      <option>Merchandise category</option>
                      <option>Orders above $100</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="couponAmountType">Discount type</label>
                    <select
                      className="admin-field"
                      id="couponAmountType"
                      value={couponAmountType}
                      onChange={(event) => setCouponAmountType(event.target.value)}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="absolute">Absolute</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="couponAmount">Discount value</label>
                    <input
                      className="admin-field"
                      id="couponAmount"
                      placeholder={couponAmountType === 'percentage' ? 'Ex: 15' : 'Ex: 25'}
                      type="text"
                      value={couponAmount}
                      onChange={(event) => setCouponAmount(event.target.value)}
                    />
                  </div>

                  <div className="admin-field-group admin-field-group--full">
                    <label className="admin-field-label" htmlFor="couponNotes">Coupon notes</label>
                    <textarea
                      className="admin-field admin-field--textarea admin-field--small"
                      id="couponNotes"
                      placeholder="Optional instructions, date limits, or usage notes..."
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="admin-form-section-title">Product discount</div>
                <div className="admin-form-grid">
                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="productName">Select product</label>
                    <select
                      className="admin-field"
                      id="productName"
                      value={productName}
                      onChange={(event) => setProductName(event.target.value)}
                    >
                      <option>Hydro Whey</option>
                      <option>Focus Pre-Workout</option>
                      <option>Training Tee</option>
                      <option>Lifting Belt</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="productScope">Product group</label>
                    <select
                      className="admin-field"
                      id="productScope"
                      value={productScope}
                      onChange={(event) => setProductScope(event.target.value)}
                    >
                      <option>Supplement</option>
                      <option>Merchandise</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="productDiscountType">Discount mode</label>
                    <select
                      className="admin-field"
                      id="productDiscountType"
                      value={productDiscountType}
                      onChange={(event) => setProductDiscountType(event.target.value)}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="absolute">Absolute</option>
                    </select>
                  </div>

                  <div className="admin-field-group">
                    <label className="admin-field-label" htmlFor="productDiscountValue">Discount value</label>
                    <input
                      className="admin-field"
                      id="productDiscountValue"
                      placeholder={productDiscountType === 'percentage' ? 'Ex: 20' : 'Ex: 8'}
                      type="text"
                      value={productDiscountValue}
                      onChange={(event) => setProductDiscountValue(event.target.value)}
                    />
                  </div>

                  <div className="admin-field-group admin-field-group--full">
                    <label className="admin-field-label" htmlFor="productDiscountNotes">Product discount notes</label>
                    <textarea
                      className="admin-field admin-field--textarea admin-field--small"
                      id="productDiscountNotes"
                      placeholder="Add a note for the discount rule..."
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="admin-card" style={{ padding: '18px' }}>
            <div className="admin-form-section-title">Live preview</div>

            <div className="admin-preview-stack">
              {discountType === 'coupon' ? (
                <>
                  <div className="admin-list-item">
                    <div className="admin-list-copy">
                      <div className="admin-list-title">{couponCode || 'Coupon code preview'}</div>
                      <div className="admin-list-subtitle">
                        {couponScope} · {couponAmountType === 'percentage' ? 'Percentage' : 'Absolute'}
                      </div>
                    </div>
                    <span className="admin-status admin-status--neutral">
                      {couponAmount ? `${couponAmountType === 'percentage' ? couponAmount + '%' : '$' + couponAmount}` : 'Draft'}
                    </span>
                  </div>

                  <div className="admin-placeholder admin-placeholder--compact">
                    <div>
                      <strong>Coupon preview</strong>
                      <div>
                        Code applies to: {couponScope}. Discount amount: {couponAmount || '0'}{' '}
                        {couponAmountType === 'percentage' ? '%' : 'absolute'}.
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-list-item">
                    <div className="admin-list-copy">
                      <div className="admin-list-title">{productName}</div>
                      <div className="admin-list-subtitle">{productScope} · {productDiscountType === 'percentage' ? 'Percentage' : 'Absolute'}</div>
                    </div>
                    <span className="admin-status admin-status--neutral">
                      {productDiscountValue ? `${productDiscountValue}${productDiscountType === 'percentage' ? '%' : ''}` : 'Draft'}
                    </span>
                  </div>

                  <div className="admin-placeholder admin-placeholder--compact">
                    <div>
                      <strong>Product discount</strong>
                      <div>
                        {productName} gets {productDiscountValue || '0'}{' '}
                        {productDiscountType === 'percentage' ? '% off' : 'off'}.
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="admin-actions-row" style={{ marginTop: '16px' }}>
              <button className="admin-action-btn" type="button">Save Discount</button>
              <button className="admin-action-btn admin-action-btn--ghost" type="button">Reset</button>
            </div>
          </div>
        </div>
      </section>

      <section className="admin-grid admin-grid--two">
        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Coupons</div>
              <div className="admin-card-title">Defined coupon codes</div>
              <div className="admin-card-subtitle">Quick view of saved coupon rules in this template.</div>
            </div>
          </div>

          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Type</th>
                <th>Discount</th>
                <th>Scope</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((item) => (
                <tr key={item.code}>
                  <td>
                    <strong>{item.code}</strong>
                  </td>
                  <td>{item.type}</td>
                  <td>{item.value}</td>
                  <td>{item.scope}</td>
                  <td>
                    <span className={`admin-status ${renderStatus(item.status)}`}>{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <article className="admin-card">
          <div className="admin-card-head">
            <div>
              <div className="admin-card-kicker">Products</div>
              <div className="admin-card-title">Product-level discounts</div>
              <div className="admin-card-subtitle">Discounts that apply to specific catalog items.</div>
            </div>
          </div>

          <div className="admin-list">
            {productDiscounts.map((item) => (
              <div className="admin-list-item" key={item.product}>
                <div className="admin-list-copy">
                  <div className="admin-list-title">{item.product}</div>
                  <div className="admin-list-subtitle">{item.mode} discount · value {item.value}</div>
                </div>
                <span className={`admin-status ${renderStatus(item.status)}`}>{item.status}</span>
              </div>
            ))}
          </div>
        </article>
      </section>
    </AdminLayout>
  );
}