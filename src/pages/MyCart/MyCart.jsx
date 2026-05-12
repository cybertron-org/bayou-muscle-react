import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useCart from '../../hooks/useCart';

function formatMoney(value) {
	return `$${value.toFixed(2)}`;
}

export default function MyCart() {
	const { cartItems, cartSummary, isLoading, error, loadCartItems, updateItemQuantity, removeItemFromCart, clearCart, applyCoupon } = useCart({ autoLoad: false });
	const [items, setItems] = useState([]);
	const [updatingItemId, setUpdatingItemId] = useState('');
	const [removingItemId, setRemovingItemId] = useState('');
	const [isClearingCart, setIsClearingCart] = useState(false);
	const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
	const [promo, setPromo] = useState('');
	const [promoError, setPromoError] = useState('');

	useEffect(() => {
		loadCartItems().catch(() => {});
	}, [loadCartItems]);

	useEffect(() => {
		setItems(
			cartItems.map((item) => ({
				id: item.id,
				name: item.productName,
				variant: item.productSlug ? `Product · ${item.productSlug}` : 'Product',
				unitPrice: Number(item.unitPrice || 0),
				discountedPrice: Number(item.discountedPrice || item.unitPrice || 0),
				qty: Number(item.quantity || 0),
				img: item.image || '/supplements/p1.png',
				total: Number(item.total || 0),
				hasDiscount: Number(item.discountedPrice || item.unitPrice || 0) < Number(item.unitPrice || 0),
			})),
		);
	}, [cartItems]);

	const updateQty = async (id, delta) => {
		const target = items.find((item) => item.id === id);
		if (!target) {
			return;
		}

		const nextQuantity = Math.max(1, Number(target.qty || 1) + delta);
		if (nextQuantity === Number(target.qty || 1)) {
			return;
		}

		setUpdatingItemId(String(id));
		try {
			await updateItemQuantity(id, nextQuantity);
		} catch (err) {
			toast.error(err?.message || 'Unable to update item quantity.');
		} finally {
			setUpdatingItemId('');
		}
	};

	const removeItem = async (id) => {
		setRemovingItemId(String(id));
		try {
			await removeItemFromCart(id);
			toast.success('Item removed from cart.');
		} catch (err) {
			toast.error(err?.message || 'Unable to remove item from cart.');
		} finally {
			setRemovingItemId('');
		}
	};

	const handleClearCart = async () => {
		if (!items.length || isClearingCart) {
			return;
		}

		setIsClearingCart(true);
		try {
			await clearCart();
			toast.success('Cart cleared successfully.');
		} catch (err) {
			toast.error(err?.message || 'Unable to clear cart.');
		} finally {
			setIsClearingCart(false);
		}
	};

	const actualAmount = Number(cartSummary?.subtotal ?? 0);
	const couponDiscount = Number(cartSummary?.couponDiscount ?? 0);
	const totalAfterDiscount = Number(cartSummary?.total ?? actualAmount - couponDiscount);
	const hasCouponDiscount = couponDiscount > 0;
	const hasAppliedCoupon = Boolean(cartSummary?.appliedCoupon);
	const appliedCouponCode = cartSummary?.appliedCoupon?.coupon_code || '';
	const appliedCouponTitle = cartSummary?.appliedCoupon?.title || '';
	const appliedCouponType = cartSummary?.appliedCoupon?.type || '';
	const appliedCouponPercentage = Number(cartSummary?.appliedCoupon?.percentage ?? 0);
	const appliedCouponAmount = Number(cartSummary?.appliedCoupon?.amount ?? 0);

	const applyPromo = async () => {
		const couponCode = promo.trim();
		if (!couponCode) {
			setPromoError('Please enter a coupon code.');
			return;
		}

		setIsApplyingCoupon(true);
		setPromoError('');
		try {
			await applyCoupon(couponCode);
			toast.success('Coupon applied successfully.');
		} catch (err) {
			setPromoError(err?.message || 'Invalid coupon code.');
			toast.error(err?.message || 'Unable to apply coupon.');
		} finally {
			setIsApplyingCoupon(false);
		}
	};

	return (
		<>
			<Header />

			<div className="pd-breadcrumb">
				<a href="/home" onClick={(event) => { event.preventDefault(); window.__navigate && window.__navigate('home'); }}>Home</a>
				<span className="pd-bc-sep">›</span>
				<span>Cart</span>
			</div>

			<section className="cart-section">
				<div className="cart-inner">
					<div className="cart-left">
						<div className="cart-header-row">
							<h1 className="cart-title">Shopping Cart</h1>
							<span className="cart-count">{items.length} items</span>
						</div>

						{isLoading && items.length === 0 ? (
							<div className="cart-empty">
								<h3>Loading cart...</h3>
							</div>
						) : items.length === 0 ? (
							<div className="cart-empty">
								<div className="cart-empty-icon">🛒</div>
								<h3>Your cart is empty</h3>
								<p>Looks like you haven&apos;t added anything yet.</p>
								<button className="cart-shop-btn" onClick={() => window.__navigate && window.__navigate('shop')}>
									Browse Products
								</button>
							</div>
						) : (
							<div className="cart-items-list">
								<div className="cart-col-header">
									<span style={{ flex: 3 }}>Product</span>
									<span style={{ flex: 1, textAlign: 'center' }}>Qty</span>
									<span style={{ flex: 1, textAlign: 'right' }}>Total</span>
									<span style={{ width: 32 }} />
								</div>

								{items.map((item) => (
									<div key={item.id} className="cart-item">
										<div className="cart-item-img">
											<img src={item.img} alt={item.name} />
										</div>
										<div className="cart-item-info">
											<p className="cart-item-name">{item.name}</p>
											<p className="cart-item-variant">{item.variant}</p>
											<p className="cart-item-unit-price">
												{item.hasDiscount ? (
													<>
														<span className="cart-item-unit-price--old">{formatMoney(item.unitPrice)}</span>
														<span className="cart-item-unit-price--new">{formatMoney(item.discountedPrice)} each</span>
														<span className="cart-item-discount-pill">sale</span>
													</>
												) : (
													`${formatMoney(item.unitPrice)} each`
												)}
											</p>
										</div>
										<div className="cart-qty-ctrl">
											<button className="cart-qty-btn" onClick={() => updateQty(item.id, -1)} disabled={updatingItemId === String(item.id)}>−</button>
											<span className="cart-qty-val">{item.qty}</span>
											<button className="cart-qty-btn" onClick={() => updateQty(item.id, 1)} disabled={updatingItemId === String(item.id)}>+</button>
										</div>
										<div className="cart-item-total">
											{item.hasDiscount ? (
												<>
													<span className="cart-item-total--old">{formatMoney(item.unitPrice * item.qty)}</span>
													<span className="cart-item-total--new">{formatMoney(item.total || item.discountedPrice * item.qty)}</span>
												</>
											) : (
												formatMoney(item.total || item.unitPrice * item.qty)
											)}
										</div>
										<button className="cart-remove-btn" onClick={() => removeItem(item.id)} disabled={removingItemId === String(item.id)} aria-label="Remove">
											<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
												<line x1="18" y1="6" x2="6" y2="18" />
												<line x1="6" y1="6" x2="18" y2="18" />
											</svg>
										</button>
									</div>
								))}
							</div>
						)}

						<div className="cart-promo">
							<p className="cart-promo-label">Have a promo code?</p>
							<div className="cart-promo-row">
								<input
									type="text"
									placeholder="Enter code (e.g. FIRST10)"
									value={promo}
									onChange={(event) => setPromo(event.target.value)}
									className={`cart-promo-input${hasAppliedCoupon ? ' success' : promoError ? ' error' : ''}`}
								/>
								<button className="cart-promo-btn" onClick={applyPromo} disabled={isApplyingCoupon}>
									{isApplyingCoupon ? 'Applying...' : 'Apply'}
								</button>
							</div>
							{hasAppliedCoupon ? <p className="cart-promo-success">✓ Coupon applied: {appliedCouponCode || 'Discount active'}</p> : null}
							{promoError ? <p className="cart-promo-error">{promoError}</p> : null}
						</div>

						<div className="cart-continue">
							<button className="cart-back-btn" onClick={() => window.__navigate && window.__navigate('shop')}>
								← Continue Shopping
							</button>
							{items.length ? (
								<button className="cart-clear-btn" onClick={handleClearCart} disabled={isClearingCart}>
									{isClearingCart ? 'Clearing...' : 'Clear Cart'}
								</button>
							) : null}
						</div>
					</div>

					<div className="cart-right">
						<div className="cart-summary">
							<h2 className="cart-summary-title">Order Summary</h2>

							{hasAppliedCoupon ? (
								<div className="cart-coupon-card">
									<div className="cart-coupon-card__top">
										<span className="cart-coupon-card__label">Applied Coupon</span>
										<span className="cart-coupon-card__code">{appliedCouponCode}</span>
									</div>
									<p className="cart-coupon-card__title">{appliedCouponTitle || 'Coupon discount active'}</p>
									<p className="cart-coupon-card__meta">
										{appliedCouponType === 'percentage' && appliedCouponPercentage > 0
											? `${appliedCouponPercentage}% off`
											: appliedCouponType === 'absolute' && appliedCouponAmount > 0
												? `${formatMoney(appliedCouponAmount)} off`
												: 'Discount applied'}
									</p>
								</div>
							) : null}

							<div className="cart-summary-lines">
								<div className="summary-line">
									<span>Actual Amount ({items.reduce((sum, item) => sum + item.qty, 0)} items)</span>
									<span>{formatMoney(actualAmount)}</span>
								</div>
								{hasAppliedCoupon ? (
									<div className="summary-line discount">
										<span>Coupon Discount{appliedCouponCode ? ` (${appliedCouponCode})` : ''}</span>
										<span>−{formatMoney(couponDiscount)}</span>
									</div>
								) : null}
							</div>

							<div className="cart-summary-total">
								<span>Total After Discount</span>
								<span>{formatMoney(totalAfterDiscount)}</span>
							</div>

							<button className="cart-checkout-btn" onClick={() => window.__navigate && window.__navigate('checkout')}>
								Proceed to Checkout
								<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
									<line x1="5" y1="12" x2="19" y2="12" />
									<polyline points="12 5 19 12 12 19" />
								</svg>
							</button>

							<div className="cart-secure">
								<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
									<rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
									<path d="M7 11V7a5 5 0 0 1 10 0v4" />
								</svg>
								Secure checkout — SSL encrypted
							</div>

							<div className="cart-payment-icons">
								{['VISA', 'MC', 'AMEX', 'PayPal'].map((payment) => (
									<span key={payment} className="payment-badge">{payment}</span>
								))}
							</div>

							<div className="cart-upsell">
								<p className="cart-upsell-label">You might also like</p>
								<div className="cart-upsell-item" onClick={() => window.__navigate && window.__navigate('product')}>
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

			  {error ? <div className="cart-empty" style={{ marginTop: '20px' }}><h3>{error}</h3></div> : null}

			  <Footer />
		</>
	);
}
