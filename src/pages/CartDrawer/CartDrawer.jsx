import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import './CartDrawer.css';
import useCart from '../../hooks/useCart';

export default function CartDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { cartItems, isLoading, loadCartItems, removeItemFromCart, clearCart } = useCart({ autoLoad: false });

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      loadCartItems().catch(() => {});
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, loadCartItems]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + (Number(item.total) || Number(item.unitPrice) * Number(item.quantity)),
    0,
  );

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeItemFromCart(cartItemId);
      toast.success('Item removed from cart.');
    } catch (err) {
      toast.error(err?.message || 'Unable to remove item from cart.');
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success('Cart cleared successfully.');
    } catch (err) {
      toast.error(err?.message || 'Unable to clear cart.');
    }
  };

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
            {isLoading ? (
              <div className="cd-item">
                <div className="cd-item__info">
                  <p className="cd-item__name">Loading cart items...</p>
                </div>
              </div>
            ) : cartItems.length ? (
              cartItems.map((item) => (
                (() => {
                  const unitPrice = Number(item.unitPrice || 0);
                  const discountedPrice = Number(item.discountedPrice || unitPrice);
                  const hasDiscount = discountedPrice > 0 && discountedPrice < unitPrice;
                  const displayPrice = hasDiscount ? discountedPrice : unitPrice;

                  return (
                <div className="cd-item" key={item.id}>
                  <div className="cd-item__img-wrap">
                    <img src={item.image || '/images/cartp.png'} alt={item.productName} className="" />
                  </div>
                  <div className="cd-item__info">
                    <p className="cd-item__name">{item.productName}</p>
                    <p className="cd-item__price">
                      <span className="cd-item__qty">{item.quantity} ×&nbsp;</span>
                      {hasDiscount ? (
                        <span className="cd-item__amount cd-item__amount--old">${unitPrice.toFixed(2)}</span>
                      ) : null}
                      <strong className="cd-item__amount">${displayPrice.toFixed(2)}</strong>
                      {hasDiscount ? <span className="cd-item__discount-pill">sale</span> : null}
                    </p>
                  </div>
                  <button className="cd-item__remove" onClick={() => handleRemoveItem(item.id)} aria-label="Remove item">
                    <svg width="11.53" height="11.53" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1 1L17 17M17 1L1 17" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                  );
                })()
              ))
            ) : (
              <div className="cd-item">
                <div className="cd-item__info">
                  <p className="cd-item__name">Your cart is empty.</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cd-footer">
          <div className="cd-subtotal">
            <span className="cd-subtotal__label">Subtotal:</span>
            <span className="cd-subtotal__value">${subtotal.toFixed(2)}</span>
          </div>
          {cartItems.length ? (
            <button className="cd-clear-btn" onClick={handleClearCart}>Clear Cart</button>
          ) : null}
          <button className="cd-btn cd-btn--view" onClick={() => { onClose(); navigate('/cart'); }}>View Cart</button>
          <button className="cd-btn cd-btn--checkout" onClick={() => { onClose(); navigate('/checkout'); }}>Checkout</button>
        </div>
      </div>
    </>
  );
}
