import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useAuth from '../../hooks/useAuth';
import './Profile.css';

const profileMenu = [
	'Dashboard',
	'Orders',
	'Payments',
	'Addresses',
	'Wishlist',
	'Settings',
];

const orderItems = [
	{
		id: 'BM-24081',
		product: 'ISOCOOL Cold Filtered Protein Isolate',
		date: 'Apr 18, 2026',
		total: '$89.00',
		status: 'Delivered',
	},
	{
		id: 'BM-24057',
		product: 'Denzour Micronised Creatine',
		date: 'Apr 12, 2026',
		total: '$42.00',
		status: 'Shipped',
	},
	{
		id: 'BM-23994',
		product: 'L-Carnitine Performance Stack',
		date: 'Apr 04, 2026',
		total: '$61.00',
		status: 'Processing',
	},
];

const paymentCards = [
	{
		label: 'Visa ending 4242',
		meta: 'Primary card',
		state: 'Active',
	},
	{
		label: 'Mastercard ending 8831',
		meta: 'Backup card',
		state: 'Saved',
	},
];

const addresses = [
	{
		label: 'Home address',
		value: '7409 Mayfield Rd. Woodhaven, NY 11421',
	},
	{
		label: 'Billing address',
		value: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
	},
];

const timeline = [
	'Order BM-24081 delivered to your address.',
	'Payment for BM-24057 successfully captured.',
	'Wishlist item ISOCOOL moved to cart.',
];

export default function Profile() {
	const { user } = useAuth();
	const displayName = user?.name || user?.full_name || 'Alex Morgan';
	const email = user?.email || 'alex.morgan@example.com';

	return (
		<>
			<Header />

			<main className="profile-page">
				<section className="profile-hero">
					<div className="profile-hero__inner">
						<div>
							<p className="profile-eyebrow">Account Center</p>
							<h1 className="profile-title">My Profile</h1>
							<p className="profile-subtitle">
								Manage your orders, saved payments, shipping addresses, and account preferences in one place.
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
					<aside className="profile-sidebar">
						<div className="profile-sidebar__card">
							<p className="profile-sidebar__kicker">Quick Nav</p>
							<nav className="profile-menu">
								{profileMenu.map((item) => (
									<a key={item} href={`#${item.toLowerCase()}`} className={`profile-menu__item ${item === 'Dashboard' ? 'is-active' : ''}`}>
										<span>{item}</span>
										<span className="profile-menu__arrow">›</span>
									</a>
								))}
							</nav>
						</div>

						<div className="profile-sidebar__card profile-sidebar__card--accent">
							<p className="profile-sidebar__kicker">Member Status</p>
							<div className="profile-badge">Gold Tier</div>
							<p className="profile-sidebar__text">
								You are eligible for faster support, early product drops, and exclusive offers.
							</p>
						</div>
					</aside>

					<div className="profile-content">
						<section className="profile-stats" id="dashboard">
							<article className="profile-stat-card">
								<p className="profile-stat-label">Orders</p>
								<h2 className="profile-stat-value">14</h2>
								<p className="profile-stat-note">3 pending, 11 completed</p>
							</article>
							<article className="profile-stat-card">
								<p className="profile-stat-label">Spent</p>
								<h2 className="profile-stat-value">$1,248</h2>
								<p className="profile-stat-note">Across supplements and accessories</p>
							</article>
							<article className="profile-stat-card">
								<p className="profile-stat-label">Saved Cards</p>
								<h2 className="profile-stat-value">2</h2>
								<p className="profile-stat-note">1 primary, 1 backup payment method</p>
							</article>
							<article className="profile-stat-card">
								<p className="profile-stat-label">Wishlist</p>
								<h2 className="profile-stat-value">7</h2>
								<p className="profile-stat-note">Ready to convert when you are</p>
							</article>
						</section>

						<section className="profile-grid">
							<article className="profile-panel profile-panel--orders" id="orders">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">Recent Orders</p>
										<h2 className="profile-panel__title">Order history</h2>
									</div>
									<a className="profile-panel__link" href="#">View all</a>
								</div>

								<div className="profile-orders">
									{orderItems.map((order) => (
										<div key={order.id} className="profile-order-row">
											<div>
												<p className="profile-order-id">{order.id}</p>
												<p className="profile-order-product">{order.product}</p>
											</div>
											<div className="profile-order-meta">
												<span>{order.date}</span>
												<strong>{order.total}</strong>
											</div>
											<span className={`profile-order-status profile-order-status--${order.status.toLowerCase()}`}>
												{order.status}
											</span>
										</div>
									))}
								</div>
							</article>

							<article className="profile-panel profile-panel--payments" id="payments">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">Payments</p>
										<h2 className="profile-panel__title">Saved methods</h2>
									</div>
								</div>

								<div className="profile-card-list">
									{paymentCards.map((card) => (
										<div key={card.label} className="profile-card-item">
											<div className="profile-card-icon">$</div>
											<div>
												<p className="profile-card-label">{card.label}</p>
												<p className="profile-card-meta">{card.meta}</p>
											</div>
											<span className="profile-chip">{card.state}</span>
										</div>
									))}
								</div>

								<div className="profile-panel__footnote">All cards are stored securely and can be used at checkout.</div>
							</article>

							<article className="profile-panel profile-panel--addresses" id="addresses">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">Addresses</p>
										<h2 className="profile-panel__title">Shipping and billing</h2>
									</div>
								</div>

								<div className="profile-addresses">
									{addresses.map((address) => (
										<div key={address.label} className="profile-address-item">
											<p className="profile-address-label">{address.label}</p>
											<p className="profile-address-value">{address.value}</p>
										</div>
									))}
								</div>
							</article>

							<article className="profile-panel profile-panel--timeline" id="wishlist">
								<div className="profile-panel__head">
									<div>
										<p className="profile-panel__kicker">Activity</p>
										<h2 className="profile-panel__title">Recent updates</h2>
									</div>
								</div>

								<div className="profile-timeline">
									{timeline.map((item, index) => (
										<div key={item} className="profile-timeline__item">
											<span className="profile-timeline__dot">{index + 1}</span>
											<p>{item}</p>
										</div>
									))}
								</div>
							</article>
						</section>

						<section className="profile-panel profile-panel--settings" id="settings">
							<div className="profile-panel__head">
								<div>
									<p className="profile-panel__kicker">Account Settings</p>
									<h2 className="profile-panel__title">Profile details</h2>
								</div>
								<button className="profile-action-btn" type="button">Edit profile</button>
							</div>

							<div className="profile-settings-grid">
								<div className="profile-setting-box">
									<p className="profile-setting-label">Full name</p>
									<p className="profile-setting-value">{displayName}</p>
								</div>
								<div className="profile-setting-box">
									<p className="profile-setting-label">Email</p>
									<p className="profile-setting-value">{email}</p>
								</div>
								<div className="profile-setting-box">
									<p className="profile-setting-label">Phone</p>
									<p className="profile-setting-value">(000) 123 - 456 78</p>
								</div>
								<div className="profile-setting-box">
									<p className="profile-setting-label">Password</p>
									<p className="profile-setting-value">Last updated 21 days ago</p>
								</div>
							</div>
						</section>
					</div>
				</section>
			</main>

			<Footer />
		</>
	);
}
