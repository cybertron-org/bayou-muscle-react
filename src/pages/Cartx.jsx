import { useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

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

              {/* Upsell */}
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
              </div>
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
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    address: '', city: '', postcode: '', country: 'United Kingdom',
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    sameAsBilling: true,
  });
  const [placed, setPlaced] = useState(false);

  const total = 65.84;

  const handlePlace = e => {
    e.preventDefault();
    setPlaced(true);
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
              Thank you for your order. A confirmation has been sent to <strong>{form.email || 'your email'}</strong>.
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
          {/* Steps */}
          <div className="checkout-steps">
            {['Delivery', 'Payment', 'Review'].map((s, i) => (
              <div key={s} className={`checkout-step${step >= i + 1 ? ' active' : ''}${step > i + 1 ? ' done' : ''}`}>
                <div className="step-circle">{step > i + 1 ? '✓' : i + 1}</div>
                <span className="step-label">{s}</span>
                {i < 2 && <div className="step-line" />}
              </div>
            ))}
          </div>

          <div className="checkout-layout">
            <form className="checkout-form" onSubmit={handlePlace}>
              {step === 1 && (
                <div className="checkout-step-content">
                  <h2 className="checkout-step-title">Delivery Information</h2>
                  <div className="checkout-grid-2">
                    <div className="contact-field">
                      <label>First Name *</label>
                      <input type="text" required placeholder="John" value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>Last Name *</label>
                      <input type="text" required placeholder="Smith" value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>Email *</label>
                      <input type="email" required placeholder="john@example.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>Phone</label>
                      <input type="tel" placeholder="+44 7700 000000" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                  </div>
                  <div className="contact-field">
                    <label>Address *</label>
                    <input type="text" required placeholder="123 Main Street" value={form.address} onChange={e => setForm({...form, address: e.target.value})} />
                  </div>
                  <div className="checkout-grid-3">
                    <div className="contact-field">
                      <label>City *</label>
                      <input type="text" required placeholder="London" value={form.city} onChange={e => setForm({...form, city: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>Postcode *</label>
                      <input type="text" required placeholder="SW1A 1AA" value={form.postcode} onChange={e => setForm({...form, postcode: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>Country</label>
                      <input type="text" value={form.country} onChange={e => setForm({...form, country: e.target.value})} />
                    </div>
                  </div>
                  <div className="checkout-shipping-opts">
                    <h3 className="checkout-sub-title">Shipping Method</h3>
                    <div className="shipping-opt active">
                      <div className="shipping-radio active" />
                      <div>
                        <p className="shipping-opt-name">Standard Delivery (3–5 days)</p>
                        <p className="shipping-opt-sub">Free on orders over $100</p>
                      </div>
                      <span className="shipping-opt-price">FREE</span>
                    </div>
                    <div className="shipping-opt">
                      <div className="shipping-radio" />
                      <div>
                        <p className="shipping-opt-name">Express Delivery (1–2 days)</p>
                        <p className="shipping-opt-sub">Tracked & insured</p>
                      </div>
                      <span className="shipping-opt-price">$8.99</span>
                    </div>
                  </div>
                  <button type="button" className="checkout-next-btn" onClick={() => setStep(2)}>
                    Continue to Payment →
                  </button>
                </div>
              )}

              {step === 2 && (
                <div className="checkout-step-content">
                  <h2 className="checkout-step-title">Payment Details</h2>
                  <div className="checkout-payment-icons">
                    {['VISA', 'MC', 'AMEX', 'PayPal'].map(p => (
                      <span key={p} className="payment-badge">{p}</span>
                    ))}
                  </div>
                  <div className="contact-field">
                    <label>Cardholder Name *</label>
                    <input type="text" required placeholder="John Smith" value={form.cardName} onChange={e => setForm({...form, cardName: e.target.value})} />
                  </div>
                  <div className="contact-field">
                    <label>Card Number *</label>
                    <input type="text" required placeholder="1234 5678 9012 3456" maxLength={19} value={form.cardNumber} onChange={e => setForm({...form, cardNumber: e.target.value})} />
                  </div>
                  <div className="checkout-grid-2">
                    <div className="contact-field">
                      <label>Expiry Date *</label>
                      <input type="text" required placeholder="MM/YY" maxLength={5} value={form.expiry} onChange={e => setForm({...form, expiry: e.target.value})} />
                    </div>
                    <div className="contact-field">
                      <label>CVV *</label>
                      <input type="text" required placeholder="123" maxLength={4} value={form.cvv} onChange={e => setForm({...form, cvv: e.target.value})} />
                    </div>
                  </div>
                  <div className="checkout-secure-note">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                    Your payment info is SSL-encrypted and never stored.
                  </div>
                  <div className="checkout-btn-row">
                    <button type="button" className="checkout-back-btn" onClick={() => setStep(1)}>← Back</button>
                    <button type="button" className="checkout-next-btn" onClick={() => setStep(3)}>Review Order →</button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="checkout-step-content">
                  <h2 className="checkout-step-title">Review Your Order</h2>
                  <div className="review-section">
                    <h3 className="review-section-title">Delivery</h3>
                    <p className="review-detail">{form.firstName} {form.lastName}</p>
                    <p className="review-detail">{form.address}{form.city ? `, ${form.city}` : ''}{form.postcode ? ` ${form.postcode}` : ''}</p>
                    <p className="review-detail">{form.country}</p>
                  </div>
                  <div className="review-section">
                    <h3 className="review-section-title">Payment</h3>
                    <p className="review-detail">Card ending ····{form.cardNumber.slice(-4) || '****'}</p>
                  </div>
                  <div className="review-items">
                    <h3 className="review-section-title">Items</h3>
                    {initialCartItems.map(item => (
                      <div key={item.id} className="review-item-row">
                        <img src={item.img} alt={item.name} className="review-item-img" />
                        <div style={{flex: 1}}>
                          <p className="review-item-name">{item.name}</p>
                          <p className="review-item-variant">{item.variant} × {item.qty}</p>
                        </div>
                        <span className="review-item-price">${(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="checkout-btn-row">
                    <button type="button" className="checkout-back-btn" onClick={() => setStep(2)}>← Back</button>
                    <button type="submit" className="checkout-place-btn">
                      Place Order — ${total.toFixed(2)}
                    </button>
                  </div>
                </div>
              )}
            </form>

            {/* Order summary sidebar */}
            <div className="checkout-summary">
              <h3 className="checkout-summary-title">Your Order</h3>
              {initialCartItems.map(item => (
                <div key={item.id} className="checkout-summary-item">
                  <div className="checkout-summary-img">
                    <img src={item.img} alt={item.name} />
                    <span className="checkout-qty-badge">{item.qty}</span>
                  </div>
                  <div style={{flex: 1}}>
                    <p className="checkout-sum-name">{item.name}</p>
                    <p className="checkout-sum-variant">{item.variant}</p>
                  </div>
                  <span className="checkout-sum-price">${(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
              <div className="checkout-sum-divider" />
              <div className="checkout-sum-row"><span>Subtotal</span><span>$60.85</span></div>
              <div className="checkout-sum-row"><span>Shipping</span><span className="free-ship">FREE</span></div>
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
