import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import useOrders from '../../hooks/useOrders';

const formatDate = (value) => {
	if (!value) {
		return 'N/A';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return 'N/A';
	}

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

	if (normalized === 'paid' || normalized === 'completed') {
		return 'admin-status--success';
	}

	if (normalized === 'pending') {
		return 'admin-status--warning';
	}

	if (normalized === 'shipped' || normalized === 'processing' || normalized === 'delivered') {
		return 'admin-status--neutral';
	}

	if (normalized === 'cancelled' || normalized === 'refunded') {
		return 'admin-status--danger';
	}

	return 'admin-status--neutral';
};

const parseResponseData = (value) => {
	if (!value) {
		return null;
	}

	if (typeof value === 'object') {
		return value;
	}

	try {
		return JSON.parse(value);
	} catch (error) {
		return null;
	}
};

export default function AdminOrderDetails() {
	const navigate = useNavigate();
	const { orderId } = useParams();
	const { orders, isLoading, error } = useOrders({ autoLoad: true });

	const order = useMemo(
		() => orders.find((item) => item.id === String(orderId || '')) || null,
		[orders, orderId],
	);

	const parsedPaymentResponse = useMemo(
		() => parseResponseData(order?.payment?.responseData),
		[order?.payment?.responseData],
	);

	useEffect(() => {
		if (typeof document !== 'undefined') {
			document.title = order ? `Order #${order.id} | Admin` : 'Order Details | Admin';
		}
	}, [order]);

	if (isLoading) {
		return (
			<AdminLayout title="Order Details" subtitle="Loading order details...">
				<section className="admin-card">
					<div className="admin-form-section-title">Order Details</div>
					<div className="admin-preview-copy">Loading order information...</div>
				</section>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout title="Order Details" subtitle="Unable to load the selected order.">
				<section className="admin-card">
					<div className="admin-form-section-title">Order Details</div>
					<div className="admin-preview-copy">{error}</div>
					<div style={{ marginTop: '16px' }}>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/orders')}>
							Back to Orders
						</button>
					</div>
				</section>
			</AdminLayout>
		);
	}

	if (!order) {
		return (
			<AdminLayout title="Order Details" subtitle="Order not found.">
				<section className="admin-card">
					<div className="admin-form-section-title">Order Details</div>
					<div className="admin-preview-copy">We could not find the selected order.</div>
					<div style={{ marginTop: '16px' }}>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/orders')}>
							Back to Orders
						</button>
					</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Order Details" subtitle={`Detailed view for order #${order.id}.`}>
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Fulfillment</div>
						<div className="admin-card-title">Order #{order.id}</div>
						<div className="admin-card-subtitle">
							Customer, payment, shipping, and item-level breakdown for the selected order.
						</div>
					</div>
					<div className="admin-category-toolbar-actions">
						<span className={`admin-status ${getStatusClass(order.payment.status)}`}>
							Payment: {String(order.payment.status || '').charAt(0).toUpperCase() + String(order.payment.status || '').slice(1)}
						</span>
						<span className={`admin-status ${getStatusClass(order.status)}`}>
							Order: {String(order.status || '').charAt(0).toUpperCase() + String(order.status || '').slice(1)}
						</span>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/orders')}>
							Back to Orders
						</button>
					</div>
				</div>

				<div className="admin-grid admin-grid--two" style={{ marginTop: '20px' }}>
					<div className="admin-list">
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Customer</div>
								<div className="admin-list-subtitle">{order.user.name || 'N/A'}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Email</div>
								<div className="admin-list-subtitle">{order.user.email || 'N/A'}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Phone</div>
								<div className="admin-list-subtitle">{order.user.phone || 'N/A'}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Created At</div>
								<div className="admin-list-subtitle">{formatDate(order.createdAt)}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Updated At</div>
								<div className="admin-list-subtitle">{formatDate(order.updatedAt)}</div>
							</div>
						</div>
					</div>

					<div className="admin-placeholder" style={{ minHeight: '280px' }}>
						<div>
							<strong>Order Summary</strong>
							<div style={{ marginTop: '10px', fontSize: '0.95rem', color: '#a8a8a8' }}>
								<div>Subtotal: <strong>{formatPrice(order.subtotal)}</strong></div>
								<div>Coupon Discount: <strong>{formatPrice(order.couponDiscount)}</strong></div>
								<div>Total Price: <strong>{formatPrice(order.totalPrice)}</strong></div>
								<div>Coupon Code: <strong>{order.couponCode || 'None'}</strong></div>
								<div>Items: <strong>{order.items.length}</strong></div>
							</div>
						</div>
					</div>
				</div>

				<div style={{ marginTop: '24px' }}>
					<div className="admin-card-kicker">Payment</div>
					<div className="admin-table-wrap" style={{ marginTop: '12px' }}>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Method</th>
									<th>Transaction ID</th>
									<th>Payment Status</th>
									<th>Payment Date</th>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>{order.payment.paymentMethod || 'N/A'}</td>
									<td>{order.payment.transactionId || 'N/A'}</td>
									<td>
										<span className={`admin-status ${getStatusClass(order.payment.status)}`}>
											{String(order.payment.status || '').charAt(0).toUpperCase() + String(order.payment.status || '').slice(1)}
										</span>
									</td>
									<td>{formatDate(order.payment.createdAt)}</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>

				<div style={{ marginTop: '24px' }}>
					<div className="admin-card-kicker">Items</div>
					<div className="admin-table-wrap" style={{ marginTop: '12px' }}>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Product</th>
									<th>Image</th>
									<th>Qty</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody>
								{order.items.map((item) => (
									<tr key={item.id}>
										<td>
											<div style={{ fontWeight: 600 }}>{item.productName || 'N/A'}</div>
											<div style={{ fontSize: '0.85rem', color: '#a8a8a8' }}>Product ID: {item.productId || 'N/A'}</div>
										</td>
										<td>
											{item.productImage ? (
												<img
													src={item.productImage}
													alt={item.productName || 'Product'}
													style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid #e9e9e9' }}
												/>
											) : (
												<span style={{ color: '#a8a8a8' }}>No image</span>
											)}
										</td>
										<td>{item.quantity}</td>
										<td>{formatPrice(item.price)}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>

				<div style={{ marginTop: '24px' }}>
					<div className="admin-card-kicker">Gateway Response</div>
					<div className="admin-placeholder" style={{ marginTop: '12px', minHeight: '180px' }}>
						<pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontFamily: 'inherit', fontSize: '0.9rem', color: '#5b5b5b' }}>
							{parsedPaymentResponse ? JSON.stringify(parsedPaymentResponse, null, 2) : 'No gateway response available.'}
						</pre>
					</div>
				</div>
			</section>
		</AdminLayout>
	);
}
