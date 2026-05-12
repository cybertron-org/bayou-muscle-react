import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
	});
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

export default function AdminCustomers() {
	const navigate = useNavigate();
	const [customers, setCustomers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');
	const [searchTerm, setSearchTerm] = useState('');

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
					setError(err?.message || 'Unable to fetch customers.');
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

	const filteredCustomers = useMemo(() => {
		const query = searchTerm.trim().toLowerCase();
		if (!query) {
			return customers;
		}

		return customers.filter((customer) => (
			[customer.name, customer.email, customer.phone, String(customer.ordersCount)]
				.some((value) => String(value || '').toLowerCase().includes(query))
		));
	}, [customers, searchTerm]);

	const handleViewCustomer = (customerId) => {
		navigate(`/admin/customers/${customerId}`);
	};

	return (
		<AdminLayout title="Customers" subtitle="Browse registered customers and open their order history.">
			<section className="admin-card">
				<div className="admin-card-head admin-card-head--categories">
					<div>
						<div className="admin-card-kicker">Customer base</div>
						<div className="admin-card-title">Customers</div>
						<div className="admin-card-subtitle">
							Live API data grouped into a clean table with a direct details view for each customer.
						</div>
					</div>
					<div className="admin-category-toolbar">
						<input
							className="admin-field admin-category-search"
							type="search"
							value={searchTerm}
							onChange={(event) => setSearchTerm(event.target.value)}
							placeholder="Search by name, email, phone, or orders"
						/>
						<div className="admin-category-toolbar-actions">
							<div className="admin-chip">{filteredCustomers.length} customers</div>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="admin-preview-copy" style={{ padding: '24px 0' }}>Loading customers...</div>
				) : error ? (
					<div className="admin-preview-copy" style={{ padding: '24px 0', color: '#c41e3a' }}>
						{error}
					</div>
				) : filteredCustomers.length === 0 ? (
					<div className="admin-preview-copy" style={{ padding: '24px 0' }}>
						No customers matched your search.
					</div>
				) : (
					<div className="admin-table-wrap">
						<table className="admin-table">
							<thead>
								<tr>
									<th>Name</th>
									<th>Email</th>
									<th>Phone</th>
									<th>Orders</th>
									<th>Joined</th>
									<th>Actions</th>
								</tr>
							</thead>
							<tbody>
								{filteredCustomers.map((customer) => (
									<tr key={customer.id}>
										<td>
											<strong>{customer.name}</strong>
										</td>
										<td>{customer.email}</td>
										<td>{customer.phone}</td>
										<td>
											<span className="admin-status admin-status--neutral">
												{customer.ordersCount} {customer.ordersCount === 1 ? 'order' : 'orders'}
											</span>
										</td>
										<td>{formatDate(customer.createdAt)}</td>
										<td>
											<button
												className="admin-action-btn admin-action-btn--ghost"
												type="button"
												onClick={() => handleViewCustomer(customer.id)}
												aria-label={`View customer ${customer.name}`}
											>
												View details
											</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				)}
			</section>
		</AdminLayout>
	);
}
