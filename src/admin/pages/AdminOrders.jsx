import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../layouts/AdminLayout';
import useOrders from '../../hooks/useOrders';

/**
 * Format date string to readable format
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return 'N/A';
  }
};

/**
 * Format price to currency string
 * @param {number|string} price - Price value
 * @returns {string} - Formatted price
 */
const formatPrice = (price) => {
  const num = parseFloat(price) || 0;
  return `$${num.toFixed(2)}`;
};

/**
 * Get status badge class based on order/payment status
 * @param {string} status - Status value
 * @returns {string} - CSS class modifier
 */
const getStatusClass = (status) => {
  const statusLower = String(status || '').toLowerCase();
  if (statusLower === 'paid' || statusLower === 'completed') {
    return 'admin-status--success';
  } else if (statusLower === 'pending') {
    return 'admin-status--warning';
  } else if (statusLower === 'shipped' || statusLower === 'processing' || statusLower === 'delivered') {
    return 'admin-status--neutral';
  } else if (statusLower === 'cancelled' || statusLower === 'refunded') {
    return 'admin-status--danger';
  }
  return 'admin-status--warning';
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const { orders, isLoading, error, updateOrderStatus, updatingOrderId } = useOrders({ autoLoad: true });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const statusOptions = ['pending', 'shipped', 'delivered', 'cancelled'];

  // Filter orders based on search term
  const filteredOrders = useMemo(() => {
    if (!searchTerm.trim()) return orders;
    const term = searchTerm.toLowerCase();
    return orders.filter((order) =>
      String(order.id).includes(term) ||
      order.user.name.toLowerCase().includes(term) ||
      order.user.email.toLowerCase().includes(term)
    );
  }, [orders, searchTerm]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIdx = startIdx + ITEMS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, endIdx);

  // Calculate pending orders count
  const pendingOrdersCount = useMemo(() => {
    return orders.filter((order) => order.payment.status === 'pending').length;
  }, [orders]);

  // Calculate paid orders count
  const paidOrdersCount = useMemo(() => {
    return orders.filter((order) => order.payment.status === 'paid').length;
  }, [orders]);

  const handleViewOrder = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <AdminLayout title="Orders" subtitle="View and manage all customer orders.">
      <section className="admin-card">
        <div className="admin-card-head">
          <div>
            <div className="admin-card-kicker">Fulfillment</div>
            <div className="admin-card-title">Orders workspace</div>
            <div className="admin-card-subtitle">
              {isLoading
                ? 'Loading orders...'
                : error
                  ? `Error: ${error}`
                  : `Manage ${orders.length} total orders`}
            </div>
          </div>
          <div className="admin-chip">{orders.length} total orders</div>
        </div>

        {error && (
          <div style={{ padding: '20px', color: '#c41e3a', backgroundColor: '#ffe6e6' }}>
            <strong>Error loading orders:</strong> {error}
          </div>
        )}

        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#a8a8a8' }}>
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#a8a8a8' }}>
            No orders found
          </div>
        ) : (
          <>
            {/* Search Bar */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search by Order ID, Customer Name, or Email..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  fontSize: '0.95rem',
                  border: '1px solid #e9e9e9',
                  borderRadius: '4px',
                  fontFamily: 'Instrument Sans, sans-serif',
                  boxSizing: 'border-box',
                  backgroundColor: '#fff',
                  color: '#5b5b5b',
                }}
              />
            </div>

            {/* Order Summary - Before Table */}
            <div className="admin-grid admin-grid--two" style={{ marginBottom: '20px' }}>
              <div className="admin-list">
                <div className="admin-list-item">
                  <div className="admin-list-copy">
                    <div className="admin-list-title">Awaiting Payment</div>
                    <div className="admin-list-subtitle">
                      {pendingOrdersCount} {pendingOrdersCount === 1 ? 'order' : 'orders'} pending payment.
                    </div>
                  </div>
                  <span className="admin-status admin-status--warning">
                    {pendingOrdersCount > 0 ? 'Needs action' : 'None'}
                  </span>
                </div>
                <div className="admin-list-item">
                  <div className="admin-list-copy">
                    <div className="admin-list-title">Paid Orders</div>
                    <div className="admin-list-subtitle">
                      {paidOrdersCount} {paidOrdersCount === 1 ? 'order' : 'orders'} completed.
                    </div>
                  </div>
                  <span className="admin-status admin-status--success">Ready</span>
                </div>
              </div>

              <div className="admin-placeholder" style={{ minHeight: '180px' }}>
                <div>
                  <strong>Order Summary</strong>
                  <div style={{ marginTop: '10px', fontSize: '0.95rem', color: '#a8a8a8' }}>
                    <div>Total Orders: <strong>{orders.length}</strong></div>
                    <div>Filtered Results: <strong>{filteredOrders.length}</strong></div>
                    <div>Total Revenue: <strong>{formatPrice(
                      orders.reduce((sum, order) => sum + order.totalPrice, 0)
                    )}</strong></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Table */}
            {filteredOrders.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: '#a8a8a8' }}>
                No orders match your search
              </div>
            ) : (
              <>
                <div className="admin-table-wrap">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Items</th>
                        <th>Total</th>
                        <th>Payment Status</th>
                        <th>Order Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedOrders.map((order) => (
                        <tr key={order.id}>
                          <td>
                            <strong>#{order.id}</strong>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.95rem' }}>
                              <div style={{ fontWeight: 600, marginBottom: '2px' }}>
                                {order.user.name || 'N/A'}
                              </div>
                              <div style={{ fontSize: '0.85rem', color: '#a8a8a8' }}>
                                {order.user.email || 'N/A'}
                              </div>
                            </div>
                          </td>
                          <td>{formatDate(order.createdAt)}</td>
                          <td>
                            <strong>{order.items.length}</strong> {order.items.length === 1 ? 'item' : 'items'}
                          </td>
                          <td>
                            <strong>{formatPrice(order.totalPrice)}</strong>
                          </td>
                          <td>
                            <span
                              className={`admin-status ${getStatusClass(order.payment.status)}`}
                            >
                              {order.payment.status === 'paid' ? 'Paid' : 'Pending'}
                            </span>
                          </td>
                          <td>
                            <div className="admin-status-control">
                              <select
                                className={`admin-status ${getStatusClass(order.status)}`}
                                value={order.status}
                                onClick={(event) => event.stopPropagation()}
                                onChange={(event) => {
                                  event.stopPropagation();
                                  updateOrderStatus(order.id, event.target.value);
                                }}
                                disabled={updatingOrderId === order.id}
                                aria-label={`Update order ${order.id} status`}
                              >
                                {statusOptions.map((status) => (
                                  <option key={status} value={status}>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                  </option>
                                ))}
                              </select>
                            </div>
                          </td>
                          <td>
                            <button
                              className="admin-action-btn admin-action-btn--ghost"
                              type="button"
                              onClick={() => handleViewOrder(order.id)}
                              aria-label={`View order ${order.id}`}
                              title="View order details"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                            >
                              <svg
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                              >
                                <path
                                  d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                                <circle
                                  cx="12"
                                  cy="12"
                                  r="3"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                />
                              </svg>
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px solid #e9e9e9',
                    }}
                  >
                    <div style={{ fontSize: '0.9rem', color: '#a8a8a8' }}>
                      Showing {startIdx + 1} to {Math.min(endIdx, filteredOrders.length)} of {filteredOrders.length} orders
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                          padding: '8px 12px',
                          fontSize: '0.9rem',
                          border: '1px solid #e9e9e9',
                          backgroundColor: currentPage === 1 ? '#f5f5f5' : '#fff',
                          color: currentPage === 1 ? '#a8a8a8' : '#5b5b5b',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                          borderRadius: '4px',
                          fontFamily: 'Instrument Sans, sans-serif',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        ← Previous
                      </button>

                      <div style={{ display: 'flex', gap: '4px' }}>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            style={{
                              width: '32px',
                              height: '32px',
                              padding: '0',
                              fontSize: '0.85rem',
                              border: page === currentPage ? '2px solid #ddca8a' : '1px solid #e9e9e9',
                              backgroundColor: page === currentPage ? '#fff' : '#f9f9f9',
                              color: page === currentPage ? '#ddca8a' : '#5b5b5b',
                              cursor: 'pointer',
                              borderRadius: '4px',
                              fontFamily: 'Instrument Sans, sans-serif',
                              fontWeight: page === currentPage ? 700 : 600,
                              transition: 'all 0.2s ease',
                            }}
                          >
                            {page}
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '8px 12px',
                          fontSize: '0.9rem',
                          border: '1px solid #e9e9e9',
                          backgroundColor: currentPage === totalPages ? '#f5f5f5' : '#fff',
                          color: currentPage === totalPages ? '#a8a8a8' : '#5b5b5b',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                          borderRadius: '4px',
                          fontFamily: 'Instrument Sans, sans-serif',
                          fontWeight: 600,
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </section>
    </AdminLayout>
  );
}