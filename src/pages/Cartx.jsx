import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../components/Header';
import Footer from '../components/Footer';
import useProducts from '../hooks/useProducts';
import useCart from '../hooks/useCart';

const initialCartItems = [
  {
    id: 3,
    name: 'ISOCOOL Cold Filtered Protein Isolate',
    variant: 'Chocolate Fudge · 1kg',
    price: 29.00,
    qty: 2,
    img: 'https://images.unsplash.com/photo-1609016041736-0d4413fa1b63?w=200&q=80',
  },
  {
    id: 5,
    name: 'Ultra Ripped: A Thermogenic Fat Burner',
    variant: 'Original · 60 caps',
    price: 11.90,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80',
  },
  {
    id: 2,
    name: 'Denzour Micronised Creatine 100g',
    variant: 'Unflavoured · 500g',
    price: 9.95,
    qty: 1,
    img: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=200&q=80',
  },
];

const promoOptions = ['FIRST10', 'SAVE15', 'BAYOU20'];

function CartPage({ onNavigate }) {
  const [items, setItems] = useState(initialCartItems);
  const [promo, setPromo] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState('');

  const updateQty = (id, delta) => {
    setItems(prev => prev.map(item =>
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const removeItem = id => setItems(prev => prev.filter(item => item.id !== id));

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promoApplied ? subtotal * 0.1 : 0;
  const shipping = subtotal > 100 ? 0 : 5.99;
  const total = subtotal - discount + shipping;

  const applyPromo = () => {
    if (promoOptions.includes(promo.toUpperCase())) {
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code. Try FIRST10');
      setPromoApplied(false);
    }
  };

  return (
    <>
      <Header />

      {/* Breadcrumb */}
      <div className="pd-breadcrumb">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>Home</a>
        <span className="pd-bc-sep">›</span>
        <span>Cart</span>
      </div>

      <section className="cart-section">
        <div className="cart-inner">
          {/* Left — Cart Items */}
          <div className="cart-left">
            <div className="cart-header-row">
              <h1 className="cart-title">Shopping Cart</h1>
              <span className="cart-count">{items.length} items</span>
            </div>

            {items.length === 0 ? (
              <div className="cart-empty">
                <div className="cart-empty-icon">🛒</div>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added anything yet.</p>
                <button className="cart-shop-btn" onClick={() => onNavigate('shop')}>Browse Supplements</button>
              </div>
            ) : (
              <div className="cart-items-list">
                {/* Column headers */}
                <div className="cart-col-header">
                  <span style={{ flex: 3 }}>Product</span>
                  <span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
                  <span style={{ flex: 1, textAlign: 'right' }}>Total</span>
                  <span style={{ width: 32 }} />
                </div>

                {items.map(item => (
                  <div key={item.id} className="cart-item">
                    <div className="cart-item-img">
                      <img src={item.img} alt={item.name} />
                    </div>
                    <div className="cart-item-info">
                      <p className="cart-item-name">{item.name}</p>
                      <p className="cart-item-variant">{item.variant}</p>
                      <p className="cart-item-unit-price">${item.price.toFixed(2)} each</p>
                    </div>
                    <div className="cart-qty-ctrl">
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)}>−</button>
                      <span className="cart-qty-val">{item.qty}</span>
                      <button className="cart-qty-btn" onClick={() => updateQty(item.id, +1)}>+</button>
                    </div>
                    <div className="cart-item-total">${(item.price * item.qty).toFixed(2)}</div>
                    <button className="cart-remove-btn" onClick={() => removeItem(item.id)} aria-label="Remove">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Promo */}
            <div className="cart-promo">
              <p className="cart-promo-label">Have a promo code?</p>
              <div className="cart-promo-row">
                <input
                  type="text"
                  placeholder="Enter code (e.g. FIRST10)"
                  value={promo}
                  onChange={e => setPromo(e.target.value)}
                  className={`cart-promo-input${promoApplied ? ' success' : promoError ? ' error' : ''}`}
                />
                <button className="cart-promo-btn" onClick={applyPromo}>Apply</button>
              </div>
              {promoApplied && <p className="cart-promo-success">✓ 10% discount applied!</p>}
              {promoError && <p className="cart-promo-error">{promoError}</p>}
            </div>

            <div className="cart-continue">
              <button className="cart-back-btn" onClick={() => onNavigate('shop')}>
                ← Continue Shopping
              </button>
            </div>
          </div>

          {/* Right — Order Summary */}
          <div className="cart-right">
            <div className="cart-summary">
              <h2 className="cart-summary-title">Order Summary</h2>

              <div className="cart-summary-lines">
                <div className="summary-line">
                  <span>Subtotal ({items.reduce((s, i) => s + i.qty, 0)} items)</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                {promoApplied && (
                  <div className="summary-line discount">
                    <span>Promo discount (10%)</span>
                    <span>−${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="summary-line">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? <span className="free-ship">FREE</span> : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="free-ship-nudge">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
              </div>

              <div className="cart-summary-total">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button className="cart-checkout-btn" onClick={() => onNavigate('checkout')}>
                Proceed to Checkout
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
              </button>

              <div className="cart-secure">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
                Secure checkout — SSL encrypted
              </div>

              {/* Payment icons */}
              <div className="cart-payment-icons">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                  <span key={p} className="payment-badge">{p}</span>
                ))}
              </div>

              {/* Upsell
              <div className="cart-upsell">
                <p className="cart-upsell-label">You might also like</p>
                <div className="cart-upsell-item" onClick={() => onNavigate('product')}>
                  <img src="https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=80&q=80" alt="Creatine" />
                  <div>
                    <p className="upsell-name">Creatine Monohydrate Pure 500g</p>
                    <p className="upsell-price">$16.95</p>
                  </div>
                  <button className="upsell-add">+ Add</button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

// ── Checkout Page ──────────────────────────────────────────
function CheckoutPage({ onNavigate }) {
  const { checkoutProducts, isLoading: isCheckoutLoading } = useProducts({ autoLoad: false });
  const { cartItems, cartSummary, loadCartItems, isLoading: isCartLoading } = useCart();
  const [validationErrors, setValidationErrors] = useState({});
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    company_name: '',
    country: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    zip_code: '',
    phone: '',
    email: '',
    order_notes: '',

    ship_to_different_address: 0,
    shipping_first_name: '',
    shipping_last_name: '',
    shipping_country: '',
    shipping_address_line1: '',
    shipping_address_line2: '',
    shipping_city: '',
    shipping_state: '',
    shipping_zip_code: '',
    shipping_phone: '',

    payment_method: 'card',
    card_number: '',
    card_holder_name: '',
    card_expiry_month: '',
    card_expiry_year: '',
    card_cvv: '',
  });
  const [placed, setPlaced] = useState(false);
  const [placedMessage, setPlacedMessage] = useState('');

  useEffect(() => {
    loadCartItems().catch(() => {});
  }, [loadCartItems]);

  const checkoutItems = useMemo(() => cartItems.map((item) => ({
    id: item.id,
    name: item.productName,
    variant: item.productSlug ? `Product · ${item.productSlug}` : 'Product',
    qty: Number(item.quantity || 0),
    img: item.image || '/supplements/p1.png',
    unitPrice: Number(item.unitPrice || 0),
    discountedPrice: Number(item.discountedPrice || item.unitPrice || 0),
    lineTotal: Number(item.total || 0),
  })), [cartItems]);

  const subtotal = Number(cartSummary?.subtotal ?? 0);
  const couponDiscount = Number(cartSummary?.couponDiscount ?? 0);
  const total = Number(cartSummary?.total ?? Math.max(0, subtotal - couponDiscount));
  const totalQty = checkoutItems.reduce((sum, item) => sum + Number(item.qty || 0), 0);
  const zipCodeRegex = /^\d{5}(?:-\d{4})?$/;
  const cardNumberRegex = /^\d{13,19}$/;
  const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

  const updateField = (field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setValidationErrors((prev) => {
      if (!prev[field]) {
        return prev;
      }
      const { [field]: _removed, ...rest } = prev;
      return rest;
    });
  };

  const handleShipToggle = (e) => {
    const checked = e.target.checked;
    setForm((prev) => ({
      ...prev,
      ship_to_different_address: checked ? 1 : 0,
    }));
  };

  const handlePlace = async (e) => {
    e.preventDefault();

    const nextErrors = {};
    const normalizedCardNumber = (form.card_number || '').replace(/\s+/g, '').trim();
    const normalizedZipCode = (form.zip_code || '').trim();
    const normalizedShippingZipCode = (form.shipping_zip_code || '').trim();

    if (!zipCodeRegex.test(normalizedZipCode)) {
      nextErrors.zip_code = 'Zip code format is invalid. Use 5 digits or 5+4 format.';
    }

    if (!cardNumberRegex.test(normalizedCardNumber)) {
      nextErrors.card_number = 'Card number format is invalid. Use 13-19 digits only.';
    }

    if (Boolean(form.ship_to_different_address)) {
      if (!isNonEmptyString(form.shipping_first_name)) {
        nextErrors.shipping_first_name = 'Shipping first name must be a valid string.';
      }
      if (!isNonEmptyString(form.shipping_last_name)) {
        nextErrors.shipping_last_name = 'Shipping last name must be a valid string.';
      }
      if (!isNonEmptyString(form.shipping_country)) {
        nextErrors.shipping_country = 'Shipping country must be a valid string.';
      }
      if (!isNonEmptyString(form.shipping_address_line1)) {
        nextErrors.shipping_address_line1 = 'Shipping address line 1 must be a valid string.';
      }
      if (!isNonEmptyString(form.shipping_city)) {
        nextErrors.shipping_city = 'Shipping city must be a valid string.';
      }
      if (!isNonEmptyString(form.shipping_state)) {
        nextErrors.shipping_state = 'Shipping state must be a valid string.';
      }
      if (!zipCodeRegex.test(normalizedShippingZipCode)) {
        nextErrors.shipping_zip_code = 'Shipping zip code format is invalid. Use 5 digits or 5+4 format.';
      }
    }

    if (Object.keys(nextErrors).length > 0) {
      setValidationErrors(nextErrors);
      toast.error('Please fix the validation errors before placing order.');
      return;
    }

    setValidationErrors({});

    const payload = {
      ...form,
      zip_code: normalizedZipCode,
      shipping_zip_code: normalizedShippingZipCode,
      card_number: normalizedCardNumber,
      card_expiry_month: Number(form.card_expiry_month),
      card_expiry_year: Number(form.card_expiry_year),
      ship_to_different_address: Number(form.ship_to_different_address),
    };

    try {
      const response = await checkoutProducts(payload);
      setPlacedMessage(response?.message || 'Your order was placed successfully.');
      setPlaced(true);
      toast.success('Order placed successfully.');
    } catch (err) {
      if (err?.errors && typeof err.errors === 'object') {
        const mappedServerErrors = Object.entries(err.errors).reduce((acc, [field, messages]) => {
          if (Array.isArray(messages) && messages.length > 0) {
            acc[field] = messages[0];
          } else if (typeof messages === 'string') {
            acc[field] = messages;
          }
          return acc;
        }, {});
        setValidationErrors(mappedServerErrors);
      }
      toast.error(err?.message || 'Unable to place order.');
    }
  };

  if (placed) {
    return (
      <>
        <Header />
        <div className="order-success">
          <div className="order-success-inner">
            <div className="order-success-icon">✓</div>
            <h1 className="order-success-title">Order Confirmed!</h1>
            <p className="order-success-sub">
              {placedMessage || <>Thank you for your order. A confirmation has been sent to <strong>{form.email || 'your email'}</strong>.</>}
            </p>
            <p className="order-success-num">Order #BM-{Math.floor(Math.random() * 90000) + 10000}</p>
            <div className="order-success-actions">
              <button className="hero-btn" onClick={() => onNavigate('home')}>Continue Shopping</button>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="pd-breadcrumb">
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('home'); }}>Home</a>
        <span className="pd-bc-sep">›</span>
        <a href="#" onClick={e => { e.preventDefault(); onNavigate('cart'); }}>Cart</a>
        <span className="pd-bc-sep">›</span>
        <span>Checkout</span>
      </div>

      <section className="checkout-section">
        <div className="checkout-inner">
          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handlePlace}>
              <div className="checkout-step-content">
                <h2 className="checkout-step-title">Delivery Information</h2>
                <div className="checkout-grid-2">
                  <div className="contact-field">
                    <label>First Name *</label>
                    <input type="text" required value={form.first_name} onChange={updateField('first_name')} />
                  </div>
                  <div className="contact-field">
                    <label>Last Name *</label>
                    <input type="text" required value={form.last_name} onChange={updateField('last_name')} />
                  </div>
                  <div className="contact-field">
                    <label>Company Name</label>
                    <input type="text" value={form.company_name} onChange={updateField('company_name')} />
                  </div>
                  <div className="contact-field">
                    <label>Country *</label>
                    <input type="text" required value={form.country} onChange={updateField('country')} />
                  </div>
                </div>

                <div className="contact-field">
                  <label>Address Line 1 *</label>
                  <input type="text" required value={form.address_line1} onChange={updateField('address_line1')} />
                </div>
                <div className="contact-field">
                  <label>Address Line 2</label>
                  <input type="text" value={form.address_line2} onChange={updateField('address_line2')} />
                </div>

                <div className="checkout-grid-3">
                  <div className="contact-field">
                    <label>City *</label>
                    <input type="text" required value={form.city} onChange={updateField('city')} />
                  </div>
                  <div className="contact-field">
                    <label>State *</label>
                    <input type="text" required value={form.state} onChange={updateField('state')} />
                  </div>
                  <div className="contact-field">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      required
                      value={form.zip_code}
                      onChange={updateField('zip_code')}
                      className={validationErrors.zip_code ? 'input-error' : ''}
                    />
                    {validationErrors.zip_code ? <span className="checkout-field-error">{validationErrors.zip_code}</span> : null}
                  </div>
                </div>

                <div className="checkout-grid-2">
                  <div className="contact-field">
                    <label>Phone *</label>
                    <input type="text" required value={form.phone} onChange={updateField('phone')} />
                  </div>
                  <div className="contact-field">
                    <label>Email *</label>
                    <input type="email" required value={form.email} onChange={updateField('email')} />
                  </div>
                </div>

                <div className="contact-field">
                  <label>Order Notes</label>
                  <textarea rows="3" value={form.order_notes} onChange={updateField('order_notes')} />
                </div>

                <label className="checkout-ship-toggle">
                  <input
                    type="checkbox"
                    checked={Boolean(form.ship_to_different_address)}
                    onChange={handleShipToggle}
                  />
                  Deliver to different address
                </label>

                {Boolean(form.ship_to_different_address) && (
                  <div className="checkout-ship-block">
                    <h3 className="checkout-sub-title">Shipping Address</h3>
                    <div className="checkout-grid-2">
                      <div className="contact-field">
                        <label>Shipping First Name *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_first_name}
                          onChange={updateField('shipping_first_name')}
                          className={validationErrors.shipping_first_name ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_first_name ? <span className="checkout-field-error">{validationErrors.shipping_first_name}</span> : null}
                      </div>
                      <div className="contact-field">
                        <label>Shipping Last Name *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_last_name}
                          onChange={updateField('shipping_last_name')}
                          className={validationErrors.shipping_last_name ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_last_name ? <span className="checkout-field-error">{validationErrors.shipping_last_name}</span> : null}
                      </div>
                      <div className="contact-field">
                        <label>Shipping Country *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_country}
                          onChange={updateField('shipping_country')}
                          className={validationErrors.shipping_country ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_country ? <span className="checkout-field-error">{validationErrors.shipping_country}</span> : null}
                      </div>
                      <div className="contact-field">
                        <label>Shipping Phone *</label>
                        <input type="text" required value={form.shipping_phone} onChange={updateField('shipping_phone')} />
                      </div>
                    </div>
                    <div className="contact-field">
                      <label>Shipping Address Line 1 *</label>
                      <input
                        type="text"
                        required
                        value={form.shipping_address_line1}
                        onChange={updateField('shipping_address_line1')}
                        className={validationErrors.shipping_address_line1 ? 'input-error' : ''}
                      />
                      {validationErrors.shipping_address_line1 ? <span className="checkout-field-error">{validationErrors.shipping_address_line1}</span> : null}
                    </div>
                    <div className="contact-field">
                      <label>Shipping Address Line 2</label>
                      <input type="text" value={form.shipping_address_line2} onChange={updateField('shipping_address_line2')} />
                    </div>
                    <div className="checkout-grid-3">
                      <div className="contact-field">
                        <label>Shipping City *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_city}
                          onChange={updateField('shipping_city')}
                          className={validationErrors.shipping_city ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_city ? <span className="checkout-field-error">{validationErrors.shipping_city}</span> : null}
                      </div>
                      <div className="contact-field">
                        <label>Shipping State *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_state}
                          onChange={updateField('shipping_state')}
                          className={validationErrors.shipping_state ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_state ? <span className="checkout-field-error">{validationErrors.shipping_state}</span> : null}
                      </div>
                      <div className="contact-field">
                        <label>Shipping Zip Code *</label>
                        <input
                          type="text"
                          required
                          value={form.shipping_zip_code}
                          onChange={updateField('shipping_zip_code')}
                          className={validationErrors.shipping_zip_code ? 'input-error' : ''}
                        />
                        {validationErrors.shipping_zip_code ? <span className="checkout-field-error">{validationErrors.shipping_zip_code}</span> : null}
                      </div>
                    </div>
                  </div>
                )}

                <h2 className="checkout-step-title">Payment Information</h2>
                <div className="checkout-payment-icons">
                  {['VISA', 'MC', 'AMEX'].map(p => (
                    <span key={p} className="payment-badge">{p}</span>
                  ))}
                </div>
                <div className="contact-field">
                  <label>Card Number *</label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={form.card_number}
                    onChange={updateField('card_number')}
                    className={validationErrors.card_number ? 'input-error' : ''}
                  />
                  {validationErrors.card_number ? <span className="checkout-field-error">{validationErrors.card_number}</span> : null}
                </div>
                <div className="contact-field">
                  <label>Card Holder Name *</label>
                  <input type="text" required value={form.card_holder_name} onChange={updateField('card_holder_name')} />
                </div>
                <div className="checkout-grid-3">
                  <div className="contact-field">
                    <label>Expiry Month *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      max="12"
                      value={form.card_expiry_month}
                      onChange={updateField('card_expiry_month')}
                    />
                  </div>
                  <div className="contact-field">
                    <label>Expiry Year *</label>
                    <input
                      type="number"
                      required
                      min="2024"
                      max="2099"
                      value={form.card_expiry_year}
                      onChange={updateField('card_expiry_year')}
                    />
                  </div>
                  <div className="contact-field">
                    <label>CVV *</label>
                    <input
                      type="text"
                      required
                      maxLength={3}
                      value={form.card_cvv}
                      onChange={updateField('card_cvv')}
                    />
                  </div>
                </div>

                <div className="checkout-secure-note">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  Card payments only. Your payment info is SSL-encrypted.
                </div>

                <button type="submit" className="checkout-place-btn" disabled={isCheckoutLoading || isCartLoading || checkoutItems.length === 0}>
                  {isCheckoutLoading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
                </button>
              </div>
            </form>

            {/* Order summary sidebar */}
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Your Order</h3>
              {isCartLoading && checkoutItems.length === 0 ? (
                <p className="checkout-sum-variant">Loading cart items...</p>
              ) : checkoutItems.length === 0 ? (
                <p className="checkout-sum-variant">Your cart is empty.</p>
              ) : checkoutItems.map(item => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-summary-img">
                    <img src={item.img} alt={item.name} />
                    <span className="checkout-qty-badge">{item.qty}</span>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="checkout-sum-name">{item.name}</p>
                    <p className="checkout-sum-variant">{item.variant}</p>
                  </div>
                  <span className="checkout-sum-price">${(item.lineTotal || item.discountedPrice * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-sum-divider" />
              <div className="checkout-sum-row"><span>Subtotal ({totalQty} items)</span><span>${subtotal.toFixed(2)}</span></div>
              <div className="checkout-sum-row"><span>Coupon Discount</span><span>{couponDiscount > 0 ? `-$${couponDiscount.toFixed(2)}` : '$0.00'}</span></div>
              <div className="checkout-sum-total"><span>Total</span><span>${total.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

export default function CartCheckout({ onNavigate, initialView = 'cart' }) {
  const [view, setView] = useState(initialView);

  const nav = (page) => {
    if (page === 'checkout') { setView('checkout'); return; }
    if (page === 'cart') { setView('cart'); return; }
    onNavigate(page);
  };

  return view === 'checkout'
    ? <CheckoutPage onNavigate={nav} />
    : <CartPage onNavigate={nav} />;
}
