import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import { getAllCustomers } from '../../services/orderService';

const formatDate = (value) => {
	if (!value) {
		return '--';
	}

	const date = new Date(value);
	if (Number.isNaN(date.getTime())) {
		return '--';
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

	if (normalized === 'delivered' || normalized === 'completed') {
		return 'admin-status--success';
	}

	if (normalized === 'shipped' || normalized === 'processing') {
		return 'admin-status--neutral';
	}

	if (normalized === 'cancelled' || normalized === 'refunded') {
		return 'admin-status--danger';
	}

	return 'admin-status--warning';
};

const normalizeCustomer = (customer) => ({
	id: String(customer?.id || ''),
	name: customer?.name || 'Unnamed customer',
	email: customer?.email || '--',
	phone: customer?.phone || '--',
	image: customer?.image || null,
	createdAt: customer?.created_at || '',
	ordersCount: Number(customer?.orders_count || 0),
	orders: Array.isArray(customer?.orders)
		? customer.orders.map((order) => ({
				id: String(order?.id || ''),
				status: order?.status || 'pending',
				totalPrice: Number.parseFloat(order?.total_price || 0),
				createdAt: order?.created_at || '',
			}))
		: [],
});

export default function AdminCustomerDetails() {
	const navigate = useNavigate();
	const { customerId } = useParams();
	const [customers, setCustomers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let isMounted = true;

		const loadCustomers = async () => {
			setIsLoading(true);
			setError('');

			try {
				const response = await getAllCustomers();
				const normalizedCustomers = Array.isArray(response)
					? response.map(normalizeCustomer)
					: [];

				if (isMounted) {
					setCustomers(normalizedCustomers);
				}
			} catch (err) {
				if (isMounted) {
					setError(err?.message || 'Unable to fetch customer details.');
					setCustomers([]);
				}
			} finally {
				if (isMounted) {
					setIsLoading(false);
				}
			}
		};

		loadCustomers();

		return () => {
			isMounted = false;
		};
	}, []);

	const customer = useMemo(
		() => customers.find((item) => item.id === String(customerId || '')) || null,
		[customers, customerId],
	);

	const sortedOrders = useMemo(() => {
		if (!customer?.orders?.length) {
			return [];
		}

		return [...customer.orders].sort((left, right) => new Date(right.createdAt) - new Date(left.createdAt));
	}, [customer]);

	if (isLoading) {
		return (
			<AdminLayout title="Customer Details" subtitle="Loading customer information...">
				<section className="admin-card">
					<div className="admin-card-kicker">Customer profile</div>
					<div className="admin-preview-copy">Loading customer details...</div>
				</section>
			</AdminLayout>
		);
	}

	if (error) {
		return (
			<AdminLayout title="Customer Details" subtitle="Unable to load the selected customer.">
				<section className="admin-card">
					<div className="admin-card-kicker">Customer profile</div>
					<div className="admin-preview-copy">{error}</div>
					<div style={{ marginTop: '16px' }}>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/customers')}>
							Back to Customers
						</button>
					</div>
				</section>
			</AdminLayout>
		);
	}

	if (!customer) {
		return (
			<AdminLayout title="Customer Details" subtitle="Customer not found.">
				<section className="admin-card">
					<div className="admin-card-kicker">Customer profile</div>
					<div className="admin-preview-copy">We could not find the selected customer.</div>
					<div style={{ marginTop: '16px' }}>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/customers')}>
							Back to Customers
						</button>
					</div>
				</section>
			</AdminLayout>
		);
	}

	return (
		<AdminLayout title="Customer Details" subtitle={`Detailed view for ${customer.name}.`}>
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Customer profile</div>
						<div className="admin-card-title">{customer.name}</div>
						<div className="admin-card-subtitle">
							All available profile information and the full order history for this customer.
						</div>
					</div>
					<div className="admin-category-toolbar-actions">
						<span className="admin-status admin-status--neutral">{customer.ordersCount} total orders</span>
						<button className="admin-action-btn admin-action-btn--ghost" type="button" onClick={() => navigate('/admin/customers')}>
							Back to Customers
						</button>
					</div>
				</div>

				<div className="admin-grid admin-grid--two" style={{ marginTop: '20px' }}>
					<div className="admin-list">
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Email</div>
								<div className="admin-list-subtitle">{customer.email}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Phone</div>
								<div className="admin-list-subtitle">{customer.phone}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Joined</div>
								<div className="admin-list-subtitle">{formatDate(customer.createdAt)}</div>
							</div>
						</div>
						<div className="admin-list-item">
							<div className="admin-list-copy">
								<div className="admin-list-title">Orders Count</div>
								<div className="admin-list-subtitle">{customer.ordersCount}</div>
							</div>
						</div>
					</div>

					<div className="admin-placeholder" style={{ minHeight: '240px' }}>
						<div>
							<strong>Customer summary</strong>
							<div style={{ marginTop: '10px', fontSize: '1rem', color: '#a8a8a8' }}>
								<div>Name: {customer.name}</div>
								<div>Email: {customer.email}</div>
								<div>Phone: {customer.phone}</div>
								<div>Orders: {customer.ordersCount}</div>
							</div>
						</div>
					</div>
				</div>

				<div style={{ marginTop: '24px' }}>
					<div className="admin-card-kicker">Orders</div>
					<div className="admin-table-wrap" style={{ marginTop: '12px' }}>
						<table className="admin-table">
							<thead>
								<tr>
									<th>Order ID</th>
									<th>Status</th>
									<th>Total</th>
									<th>Placed</th>
								</tr>
							</thead>
							<tbody>
								{sortedOrders.length > 0 ? (
									sortedOrders.map((order) => (
										<tr key={order.id}>
											<td>
												<strong>#{order.id}</strong>
											</td>
											<td>
												<span className={`admin-status ${getStatusClass(order.status)}`}>
													{String(order.status || '').charAt(0).toUpperCase() + String(order.status || '').slice(1)}
												</span>
											</td>
											<td>{formatPrice(order.totalPrice)}</td>
											<td>{formatDate(order.createdAt)}</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan={4}>
											<div className="admin-preview-copy">This customer has no orders yet.</div>
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</AdminLayout>
	);
}
