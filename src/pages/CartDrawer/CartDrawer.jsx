import { useEffect } from 'react';
import './CartDrawer.css';

const imgProduct = 'https://www.figma.com/api/mcp/asset/916e25ad-e298-490d-a8b0-1d34ce90e747';

const cartItems = [
  { id: 1, name: 'ATOM Creatine Monohydrate', qty: 1, price: 809.75, img: imgProduct },
];

export default function CartDrawer({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const subtotal = cartItems.reduce((s, i) => s + i.qty * i.price, 0);

  return (
    <>
      <div
        className={`cd-overlay${isOpen ? ' cd-overlay--open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={`cd-drawer${isOpen ? ' cd-drawer--open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        <div className="cd-header">
          <span className="cd-header__title">Shopping Cart</span>
          <button className="cd-header__close" onClick={onClose} aria-label="Close cart">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L17 17M17 1L1 17" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        <div className="cd-body">
          <div className="cd-items">
            {cartItems.map((item) => (
              <div className="cd-item" key={item.id}>
                <div className="cd-item__img-wrap">
                  <img src={item.img} alt={item.name} className="cd-item__img" />
                </div>
                <div className="cd-item__info">
                  <p className="cd-item__name">{item.name}</p>
                  <p className="cd-item__price">
                    <span className="cd-item__qty">{item.qty} ×&nbsp;</span>
                    <strong className="cd-item__amount">${item.price.toFixed(2)}</strong>
                  </p>
                </div>
                <button className="cd-item__remove" aria-label="Remove item">
                  <svg width="11.53" height="11.53" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L17 17M17 1L1 17" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="cd-footer">
          <div className="cd-subtotal">
            <span className="cd-subtotal__label">Subtotal:</span>
            <span className="cd-subtotal__value">${subtotal.toFixed(2)}</span>
          </div>
          <button className="cd-btn cd-btn--view">View Cart</button>
          <button className="cd-btn cd-btn--checkout">Checkout</button>
        </div>
      </div>
    </>
  );
}
