import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import '../Profile/Profile.css';

const formatDate = (value) => {
	if (!value) return 'N/A';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return 'N/A';
	return date.toLocaleString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
		hour: 'numeric',
		minute: '2-digit',
	});
};

const formatPrice = (value) => {
	const amount = Number.parseFloat(value) || 0;
	return `$${amount.toFixed(2)}`;
};

const getStatusClass = (status) => {
	const normalized = String(status || '').toLowerCase();
	if (normalized === 'paid' || normalized === 'completed') return 'profile-order-status--delivered';
	if (normalized === 'shipped') return 'profile-order-status--shipped';
	if (normalized === 'delivered') return 'profile-order-status--delivered';
	if (normalized === 'cancelled') return 'profile-order-status--processing';
	return 'profile-order-status--processing';
};

const parseResponseData = (value) => {
	if (!value) return null;
	if (typeof value === 'object') return value;
	try {
		return JSON.parse(value);
	} catch (error) {
		return null;
	}
};

export default function OrderDetails() {
	const navigate = useNavigate();
	const { orderId } = useParams();
	const { user } = useAuth();
	const { order, isLoading, error, loadOrderById } = useOrders({ autoLoad: false, scope: 'user' });

	const displayName = user?.name || user?.full_name || 'Member';
	const email = user?.email || 'member@example.com';
	const gatewayResponse = useMemo(() => parseResponseData(order?.payment?.responseData), [order?.payment?.responseData]);

	useEffect(() => {
		if (orderId) {
			loadOrderById(orderId);
		}
	}, [loadOrderById, orderId]);

	return (
		<>
			<Header />
			<main className="profile-page">
				<section className="profile-hero">
					<div className="profile-hero__inner">
						<div>
							<p className="profile-eyebrow">Employee Orders</p>
							<h1 className="profile-title">Order Details</h1>
							<p className="profile-subtitle">
								A single order view with customer info, payment state, item list, and gateway response.
							</p>
						</div>
						<div className="profile-hero-card">
							<div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
							<div>
								<p className="profile-hero-name">{displayName}</p>
								<p className="profile-hero-meta">{email}</p>
							</div>
						</div>
					</div>
				</section>

				<section className="profile-shell">
					<div className="profile-content" style={{ gridColumn: '1 / -1' }}>
						<div className="profile-panel">
							<div className="profile-panel__head">
								<div>
									<p className="profile-panel__kicker">Order Preview</p>
									<h2 className="profile-panel__title">{order ? `Order #${order.id}` : 'Order Details'}</h2>
								</div>
								<button className="profile-action-btn" type="button" onClick={() => navigate('/orders')}>Back to Orders</button>
							</div>

							{isLoading ? (
								<div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
									<div>Loading order details...</div>
								</div>
							) : error ? (
								<div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
									<div>{error}</div>
								</div>
							) : order ? (
								<>
									<div className="profile-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
										<div className="profile-panel" style={{ padding: '20px' }}>
											<p className="profile-panel__kicker">Customer</p>
											<div className="profile-setting-box" style={{ padding: '18px' }}>
												<p className="profile-setting-label">Name</p>
												<p className="profile-setting-value">{order.user.name || 'N/A'}</p>
												<p className="profile-setting-label" style={{ marginTop: '14px' }}>Email</p>
												<p className="profile-setting-value">{order.user.email || 'N/A'}</p>
												<p className="profile-setting-label" style={{ marginTop: '14px' }}>Phone</p>
												<p className="profile-setting-value">{order.user.phone || 'N/A'}</p>
											</div>
										</div>

										<div className="profile-panel" style={{ padding: '20px' }}>
											<p className="profile-panel__kicker">Summary</p>
											<div className="profile-setting-box" style={{ padding: '18px' }}>
												<p className="profile-setting-label">Status</p>
												<div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
													<span className={`profile-order-status ${getStatusClass(order.status)}`}>{order.status}</span>
													<span className={`profile-order-status ${getStatusClass(order.payment.status)}`}>{order.payment.status}</span>
												</div>
												<p className="profile-setting-label">Created</p>
												<p className="profile-setting-value">{formatDate(order.createdAt)}</p>
												<p className="profile-setting-label" style={{ marginTop: '14px' }}>Updated</p>
												<p className="profile-setting-value">{formatDate(order.updatedAt)}</p>
											</div>
										</div>
									</div>

									<section className="profile-panel" style={{ marginTop: '24px' }}>
										<div className="profile-panel__head">
											<div>
												<p className="profile-panel__kicker">Totals</p>
												<h2 className="profile-panel__title">Order summary</h2>
											</div>
										</div>
										<div className="profile-orders">
											<div className="profile-order-row" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
												<div>
													<p className="profile-order-id">Subtotal</p>
													<p className="profile-order-product">{formatPrice(order.subtotal)}</p>
												</div>
												<div>
													<p className="profile-order-id">Coupon</p>
													<p className="profile-order-product">{order.couponCode || 'None'}</p>
												</div>
												<div>
													<p className="profile-order-id">Discount</p>
													<p className="profile-order-product">{formatPrice(order.couponDiscount)}</p>
												</div>
												<div>
													<p className="profile-order-id">Total</p>
													<p className="profile-order-product">{formatPrice(order.totalPrice)}</p>
												</div>
											</div>
										</div>
									</section>

									<section className="profile-panel" style={{ marginTop: '24px' }}>
										<div className="profile-panel__head">
											<div>
												<p className="profile-panel__kicker">Payment</p>
												<h2 className="profile-panel__title">Payment details</h2>
											</div>
										</div>
										<div className="profile-grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
											<div className="profile-setting-box" style={{ padding: '18px' }}>
												<p className="profile-setting-label">Method</p>
												<p className="profile-setting-value">{order.payment.paymentMethod || 'N/A'}</p>
												<p className="profile-setting-label" style={{ marginTop: '14px' }}>Transaction ID</p>
												<p className="profile-setting-value">{order.payment.transactionId || 'N/A'}</p>
											</div>
											<div className="profile-setting-box" style={{ padding: '18px' }}>
												<p className="profile-setting-label">Payment Status</p>
												<p className="profile-setting-value">{order.payment.status}</p>
												<p className="profile-setting-label" style={{ marginTop: '14px' }}>Payment Date</p>
												<p className="profile-setting-value">{formatDate(order.payment.createdAt)}</p>
											</div>
										</div>
									</section>

									<section className="profile-panel" style={{ marginTop: '24px' }}>
										<div className="profile-panel__head">
											<div>
												<p className="profile-panel__kicker">Items</p>
												<h2 className="profile-panel__title">Purchased products</h2>
											</div>
										</div>
										<div className="profile-orders">
											{order.items.map((item) => (
												<div key={item.id} className="profile-order-row" style={{ gridTemplateColumns: '1.5fr auto auto auto' }}>
													<div>
														<p className="profile-order-id">Product</p>
														<p className="profile-order-product">{item.productName || 'N/A'}</p>
													</div>
													<div>
														<p className="profile-order-id">Qty</p>
														<p className="profile-order-product">{item.quantity}</p>
													</div>
													<div>
														<p className="profile-order-id">Price</p>
														<p className="profile-order-product">{formatPrice(item.price)}</p>
													</div>
													<div>
														{item.productImage ? (
															<img
																src={item.productImage}
																alt={item.productName || 'Product'}
																style={{ width: '72px', height: '72px', objectFit: 'cover', borderRadius: '18px', border: '1px solid #e9e9e9' }}
															/>
														) : (
															<span style={{ color: '#a8a8a8' }}>No image</span>
														)}
													</div>
												</div>
											))}
										</div>
									</section>

									<section className="profile-panel" style={{ marginTop: '24px' }}>
										<div className="profile-panel__head">
											<div>
												<p className="profile-panel__kicker">Gateway</p>
												<h2 className="profile-panel__title">Response payload</h2>
											</div>
										</div>
										<div className="profile-setting-box" style={{ padding: '18px' }}>
											<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', fontSize: '13px', color: '#5b5b5b' }}>
												{gatewayResponse ? JSON.stringify(gatewayResponse, null, 2) : 'No gateway response available.'}
											</pre>
										</div>
									</section>
								</>
							) : (
								<div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
									<div>Order not found.</div>
								</div>
							)}
						</div>
					</div>
				</section>
			</main>
			<Footer />
		</>
	);
}
