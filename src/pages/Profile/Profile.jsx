import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useAuth from '../../hooks/useAuth';
import useDashboard from '../../hooks/useDashboard';
import './Profile.css';

const formatDate = (value) => {
	if (!value) return 'N/A';
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return 'N/A';
	return date.toLocaleDateString('en-US', {
		month: 'short',
		day: 'numeric',
		year: 'numeric',
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

export default function Profile() {
	const { user, updateProfileInfo, isLoading: isAuthLoading } = useAuth();
	const navigate = useNavigate();
	const location = useLocation();
	const { dashboardData, isLoading, error } = useDashboard({ autoLoad: true });
	const [isEditing, setIsEditing] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [saveSuccess, setSaveSuccess] = useState('');
	const [profileForm, setProfileForm] = useState({
		full_name: '',
		phone: '',
		address: '',
		password: '',
		password_confirmation: '',
	});

	const dashboard = dashboardData || {};
	const userDetails = dashboard.user_details || {};
	const recentOrders = dashboard.last_three_orders || [];

	const displayName = userDetails.name || user?.name || user?.full_name || profileForm.full_name || 'Alex Morgan';
	const email = userDetails.email || user?.email || 'alex.morgan@example.com';
	const phone = userDetails.phone || user?.phone || profileForm.phone || 'N/A';
	const address = userDetails.address || user?.address || profileForm.address || 'No address on file';
	const memberStatus = userDetails.is_active ? 'Active' : 'Inactive';
	const avatarUrl = userDetails.image || '';

	useEffect(() => {
		if (isEditing) {
			return;
		}

		setProfileForm({
			full_name: userDetails.name || user?.name || user?.full_name || '',
			phone: userDetails.phone || user?.phone || '',
			address: userDetails.address || user?.address || '',
			password: '',
			password_confirmation: '',
		});
	}, [isEditing, user?.address, user?.full_name, user?.name, user?.phone, userDetails.address, userDetails.name, userDetails.phone]);

	const stats = useMemo(() => ([
		{
			label: 'Orders',
			value: dashboard.total_orders_count ?? 0,
			note: 'All orders placed by the account',
		},
		{
			label: 'Shipped',
			value: dashboard.shipped_orders_count ?? 0,
			note: 'Orders currently in transit',
		},
		{
			label: 'Delivered',
			value: dashboard.delivered_orders_count ?? 0,
			note: 'Completed and received orders',
		},
		{
			label: 'Wishlist',
			value: dashboard.wishlist_count ?? 0,
			note: 'Saved items ready for checkout',
		},
	]), [dashboard.delivered_orders_count, dashboard.shipped_orders_count, dashboard.total_orders_count, dashboard.wishlist_count]);

	const handleOpenOrder = (orderId) => {
		navigate(`/orders/${orderId}`);
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setProfileForm((current) => ({
			...current,
			[name]: value,
		}));
	};

	const handleCancelEdit = () => {
		setIsEditing(false);
		setSaveError('');
		setSaveSuccess('');
		setProfileForm({
			full_name: userDetails.name || user?.name || user?.full_name || '',
			phone: userDetails.phone || user?.phone || '',
			address: userDetails.address || user?.address || '',
			password: '',
			password_confirmation: '',
		});
	};

	const handleSubmit = async (event) => {
		event.preventDefault();
		setSaveError('');
		setSaveSuccess('');

		try {
			const response = await updateProfileInfo({
				full_name: profileForm.full_name,
				email,
				phone: profileForm.phone,
				address: profileForm.address,
				password: profileForm.password || undefined,
				password_confirmation: profileForm.password_confirmation || undefined,
			});

			const updatedUser = response?.data || response || {};
			setProfileForm((current) => ({
				...current,
				full_name: updatedUser?.name || updatedUser?.full_name || current.full_name,
				phone: updatedUser?.phone || current.phone,
				address: updatedUser?.address ?? current.address,
				password: '',
				password_confirmation: '',
			}));
			setSaveSuccess('Profile updated successfully.');
			setIsEditing(false);
		} catch (err) {
			setSaveError(err?.message || 'Unable to update profile.');
		}
	};

	return (
		<>
			<Header />

			<main className="profile-page">
				<section className="profile-hero">
					<div className="profile-hero__inner">
						<div>
							<p className="profile-eyebrow">Account Center</p>
							<h1 className="profile-title">My Profile</h1>

						</div>

						<div className="profile-hero-card">
							{avatarUrl ? (
								<img src={avatarUrl} alt={displayName} className="profile-avatar" style={{ objectFit: 'cover' }} />
							) : (
								<div className="profile-avatar">{displayName.slice(0, 1).toUpperCase()}</div>
							)}
							<div>
								<p className="profile-hero-name">{displayName}</p>
								<p className="profile-hero-meta">{email}</p>
							</div>
						</div>
					</div>
				</section>

				<section className="profile-shell">
					<aside className="profile-sidebar">
						<div className="profile-sidebar__card">
							<p className="profile-sidebar__kicker">Quick Nav</p>
							<nav className="profile-menu">
								<a href="/orders" className={`profile-menu__item ${location.pathname === '/orders' ? 'is-active' : ''}`} onClick={(event) => { event.preventDefault(); navigate('/orders'); }}>
										<span>Orders</span>
										<span className="profile-menu__arrow">›</span>
									</a>

								<a href="/my-wishlist" className={`profile-menu__item ${location.pathname === '/my-wishlist' ? 'is-active' : ''}`} onClick={(event) => { event.preventDefault(); navigate('/my-wishlist'); }}>
										<span>Wishlist</span>
										<span className="profile-menu__arrow">›</span>
									</a>
							</nav>
						</div>

						<div className="profile-sidebar__card profile-sidebar__card--accent">
							<p className="profile-sidebar__kicker">Member Status</p>
							<div className="profile-badge">{memberStatus}</div>
							<p className="profile-sidebar__text">
								Manage your account from a clean summary view built for quick access.
							</p>
						</div>
					</aside>

					<div className="profile-content">
						<section className="profile-stats" id="dashboard">
							{stats.map((stat) => (
								<article key={stat.label} className="profile-stat-card">
									<p className="profile-stat-label">{stat.label}</p>
									<h2 className="profile-stat-value">{stat.value}</h2>
									
								</article>
							))}
						</section>

						<section className="profile-grid">
							<article className="profile-panel profile-panel--orders" id="orders">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">User Info</p>
										<h2 className="profile-panel__title">Account details</h2>
									</div>
										{isEditing ? (
											<button className="profile-action-btn profile-action-btn--ghost" type="button" onClick={handleCancelEdit}>Cancel</button>
										) : (
											<button className="profile-action-btn" type="button" onClick={() => setIsEditing(true)}>Edit</button>
										)}
								</div>

								{isLoading ? (
									<div className="profile-setting-box" style={{ padding: '18px' }}>Loading dashboard data...</div>
								) : error ? (
									<div className="profile-setting-box" style={{ padding: '18px' }}>{error}</div>
									) : isEditing ? (
										<form className="profile-edit-form" onSubmit={handleSubmit}>
											<div className="profile-settings-grid profile-settings-grid--editor" style={{ marginTop: '18px' }}>
												<div className="profile-setting-box">
													<p className="profile-setting-label">Name</p>
													<input className="profile-input" name="full_name" value={profileForm.full_name} onChange={handleChange} placeholder="Your name" />
												</div>
												<div className="profile-setting-box">
													<p className="profile-setting-label">Email</p>
													<input className="profile-input" value={email} disabled readOnly />
												</div>
												<div className="profile-setting-box">
													<p className="profile-setting-label">Phone</p>
													<input className="profile-input" name="phone" value={profileForm.phone} onChange={handleChange} placeholder="Phone number" />
												</div>
												<div className="profile-setting-box">
													<p className="profile-setting-label">Address</p>
													<textarea className="profile-input profile-input--textarea" name="address" value={profileForm.address} onChange={handleChange} placeholder="Address" rows="3" />
												</div>
												<div className="profile-setting-box">
													<p className="profile-setting-label">New Password</p>
													<input className="profile-input" type="password" name="password" value={profileForm.password} onChange={handleChange} placeholder="Leave blank to keep current" />
												</div>
												<div className="profile-setting-box">
													<p className="profile-setting-label">Confirm Password</p>
													<input className="profile-input" type="password" name="password_confirmation" value={profileForm.password_confirmation} onChange={handleChange} placeholder="Repeat password" />
												</div>
											</div>

											<div className="profile-info-actions">
												<button className="profile-action-btn" type="submit" disabled={isAuthLoading}>Save changes</button>
												<button className="profile-action-btn profile-action-btn--ghost" type="button" onClick={handleCancelEdit}>Cancel</button>
											</div>

											{saveError ? <p className="profile-form-message profile-form-message--error">{saveError}</p> : null}
											{saveSuccess ? <p className="profile-form-message profile-form-message--success">{saveSuccess}</p> : null}
										</form>
									) : (
										<div className="profile-settings-grid" style={{ marginTop: '18px' }}>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Name</p>
												<p className="profile-setting-value">{displayName}</p>
											</div>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Email</p>
												<p className="profile-setting-value">{email}</p>
											</div>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Phone</p>
												<p className="profile-setting-value">{phone}</p>
											</div>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Address</p>
												<p className="profile-setting-value">{address || 'N/A'}</p>
											</div>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Role</p>
												<p className="profile-setting-value">{userDetails.role || user?.role || 'user'}</p>
											</div>
											<div className="profile-setting-box">
												<p className="profile-setting-label">Account Status</p>
												<p className="profile-setting-value">{memberStatus}</p>
											</div>
										</div>
								)}
							</article>

							<article className="profile-panel profile-panel--payments" id="payments">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">Recent Orders</p>
										<h2 className="profile-panel__title">Last three orders</h2>
									</div>
									<button className="profile-action-btn" type="button" onClick={() => navigate('/orders')}>View All Orders</button>
								</div>

								{recentOrders.length ? (
									<div className="profile-orders">
										{recentOrders.map((order) => {
											const firstItem = order.items?.[0];
											return (
												<div key={order.id} className="profile-order-row" style={{ cursor: 'pointer' }} onClick={() => handleOpenOrder(order.id)}>
													<div>
														<p className="profile-order-id">Order #{order.id}</p>
														<p className="profile-order-product">{firstItem?.product_name || firstItem?.productName || 'Order item'}</p>
														<p className="profile-order-meta" style={{ marginTop: '4px' }}>{formatDate(order.created_at || order.createdAt)}</p>
													</div>
													<div className="profile-order-meta">
														<span>Total</span>
														<strong>{formatPrice(order.total_price || order.totalPrice)}</strong>
													</div>
													<span className={`profile-order-status ${getStatusClass(order.status)}`}>
														{order.status}
													</span>

												</div>
											);
										})}
									</div>
								) : (
									<div className="profile-setting-box" style={{ padding: '18px' }}>No recent orders available.</div>
								)}

							</article>
						</section>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
