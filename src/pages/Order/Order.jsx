import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import useAuth from '../../hooks/useAuth';
import useOrders from '../../hooks/useOrders';
import '../Profile/Profile.css';

const pageSize = 8;

const formatDate = (value) => {
    if (!value) return '--';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '--';
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

export default function Order() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { orders, isLoading, error } = useOrders({ autoLoad: true, scope: 'user' });
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const displayName = user?.name || user?.full_name || 'Member';
    const email = user?.email || 'member@example.com';

    const filteredOrders = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();
        if (!query) {
            return orders;
        }

        return orders.filter((order) => {
            const searchable = [
                order.id,
                order.status,
                order.payment.status,
                order.user.name,
                order.user.email,
                ...order.items.map((item) => item.productName),
            ];

            return searchable.some((value) => String(value || '').toLowerCase().includes(query));
        });
    }, [orders, searchTerm]);

    const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));
    const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const totals = useMemo(() => ({
        pending: orders.filter((order) => order.payment.status === 'pending').length,
        shipped: orders.filter((order) => order.status === 'shipped').length,
        delivered: orders.filter((order) => order.status === 'delivered').length,
        totalRevenue: orders.reduce((sum, order) => sum + order.totalPrice, 0),
    }), [orders]);

    const handleViewOrder = (orderId) => {
        navigate(`/orders/${orderId}`);
    };

    return (
        <>
            <Header />
            <main className="profile-page">
                <section className="profile-hero">
                    <div className="profile-hero__inner">
                        <div>
                            <p className="profile-eyebrow">Employee Orders</p>
                            <h1 className="profile-title">Order Center</h1>

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

                                <a href={`/profile`} className={`profile-menu__item ${window.location.pathname === '/profile' ? 'is-active' : ''}`} onClick={(event) => { event.preventDefault(); navigate('/profile'); }}>
                                    <span>Profile</span>
                                    <span className="profile-menu__arrow">›</span>
                                </a>

                                <a href={`/my-wishlist`} className={`profile-menu__item ${window.location.pathname === '/my-wishlist' ? 'is-active' : ''}`} onClick={(event) => { event.preventDefault(); navigate('/my-wishlist'); }}>
                                    <span>Wishlist</span>
                                    <span className="profile-menu__arrow">›</span>
                                </a>  


                            </nav>
                        </div>

                    </aside>

                    <div className="profile-content">


                        <section className="profile-panel" id="order-table">
                            <div className="profile-panel__head">
                                <div>
                                    <p className="profile-panel__kicker">Order History</p>
                                    <h2 className="profile-panel__title">Orders</h2>
                                </div>
                                <div style={{ minWidth: '320px', width: '42%' }}>
                                    <input
                                        type="search"
                                        value={searchTerm}
                                        onChange={(event) => {
                                            setSearchTerm(event.target.value);
                                            setCurrentPage(1);
                                        }}
                                        placeholder="Search orders"
                                        style={{
                                            width: '100%',
                                            padding: '13px 16px',
                                            borderRadius: '16px',
                                            border: '1px solid #e9e9e9',
                                            fontFamily: 'Instrument Sans, sans-serif',
                                            fontSize: '14px',
                                        }}
                                    />
                                </div>
                            </div>

                            {isLoading ? (
                                <div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
                                    <div>Loading orders...</div>
                                </div>
                            ) : error ? (
                                <div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
                                    <div>{error}</div>
                                </div>
                            ) : paginatedOrders.length ? (
                                <>
                                    <div className="profile-orders">
                                        {paginatedOrders.map((order) => (
                                            <div key={order.id} className="profile-order-row" style={{ gridTemplateColumns: '1.1fr 0.9fr 0.7fr auto auto' }}>
                                                <div>
                                                    <p className="profile-order-id">Order #{order.id}</p>
                                                    <p className="profile-order-product">{order.user.name || 'N/A'}</p>
                                                    <p className="profile-order-meta" style={{ marginTop: '4px' }}>{order.user.email || 'N/A'}</p>
                                                </div>
                                                <div className="profile-order-meta">
                                                    <span>{formatDate(order.createdAt)}</span>
                                                    <strong>{order.items.length} {order.items.length === 1 ? 'item' : 'items'}</strong>
                                                </div>
                                                <div className="profile-order-meta">
                                                    <span>Total</span>
                                                    <strong>{formatPrice(order.totalPrice)}</strong>
                                                </div>
                                                <span className={`profile-order-status ${getStatusClass(order.status)}`}>
                                                    {order.status}
                                                </span>
                                                <button
                                                    className="profile-action-btn"
                                                    type="button"
                                                    onClick={() => handleViewOrder(order.id)}
                                                    aria-label={`View order ${order.id}`}
                                                >
                                                    View
                                                </button>
                                            </div>
                                        ))}
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginTop: '18px', flexWrap: 'wrap' }}>
                                        <p style={{ color: '#636363', fontSize: '14px' }}>
                                            Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, filteredOrders.length)} of {filteredOrders.length}
                                        </p>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                            <button className="profile-action-btn" type="button" onClick={() => setCurrentPage((value) => Math.max(1, value - 1))} disabled={currentPage === 1}>Prev</button>
                                            <span className="profile-badge">Page {currentPage} / {totalPages}</span>
                                            <button className="profile-action-btn" type="button" onClick={() => setCurrentPage((value) => Math.min(totalPages, value + 1))} disabled={currentPage >= totalPages}>Next</button>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="profile-order-row" style={{ gridTemplateColumns: '1fr', textAlign: 'center' }}>
                                    <div>No orders matched your search.</div>
                                </div>
                            )}
                        </section>
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
