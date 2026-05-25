import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiUser, FiMapPin, FiPhone, FiMail, FiCreditCard, FiShoppingBag, FiClock } from 'react-icons/fi';
import { orderAPI } from '../../../services/api';
import { PageLoader } from '../../../components/Loader';
import toast from 'react-hot-toast';
import '../Dashboard/style.css';
import '../Foods/style.css';
import './orders.css';

const STATUSES = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered', 'cancelled'];

const STATUS_COLORS = {
  placed: { bg: 'rgba(108,61,232,0.1)', color: '#6c3de8' },
  confirmed: { bg: 'rgba(0,185,245,0.1)', color: '#00b9f5' },
  preparing: { bg: 'rgba(247,147,30,0.1)', color: '#f7931e' },
  on_the_way: { bg: 'rgba(108,61,232,0.15)', color: '#9b59b6' },
  delivered: { bg: 'rgba(0,201,167,0.1)', color: '#00c9a7' },
  cancelled: { bg: 'rgba(231,76,60,0.1)', color: '#e74c3c' },
};

const PAY_LABELS = {
  upi_phonepe: '📲 PhonePe',
  upi_googlepay: '💳 Google Pay',
  upi_paytm: '💰 Paytm',
  upi_navi: '🏦 Navi UPI',
  upi_other: '🔗 UPI',
  upi_qr: '⬛ QR Code',
  cod: '💵 Cash on Delivery',
  razorpay: '💳 Razorpay',
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    orderAPI.getAll({ status: statusFilter })
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const updateStatus = async (orderId, status) => {
    setUpdatingId(orderId);
    try {
      const res = await orderAPI.updateStatus(orderId, { status });
      setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status } : o));
      if (selectedOrder?._id === orderId) {
        setSelectedOrder(prev => ({ ...prev, status }));
      }
      toast.success('Order status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = orders.filter(o =>
    o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
    o.user?.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="admin-foods">
      <div className="admin-page-header">
        <h1>Orders Management</h1>
        <p>View customer orders and update their status</p>
      </div>

      <div className="orders-toolbar">
        <div className="admin-search-bar">
          <FiSearch />
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select
          className="status-filter-select"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="">All Status</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>{s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</option>
          ))}
        </select>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Phone</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => {
                const sc = STATUS_COLORS[order.status] || {};
                return (
                  <tr key={order._id}>
                    <td className="order-id-cell">{order.orderId}</td>
                    <td>
                      <div className="customer-cell">
                        <div className="cust-avatar">{order.user?.name?.charAt(0) || '?'}</div>
                        <div>
                          <div className="cust-name">{order.user?.name || '—'}</div>
                          <div className="cust-email">{order.user?.email || '—'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="phone-cell">{order.customerPhone || order.user?.phone || '—'}</td>
                    <td className="items-cell">{order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}</td>
                    <td className="amount-cell"><strong>₹{order.total}</strong></td>
                    <td className="pay-cell">{PAY_LABELS[order.paymentMethod] || order.paymentMethod}</td>
                    <td>
                      <span
                        className="ao-status-badge"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {order.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="date-cell">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                    <td>
                      <div className="actions-cell">
                        <button
                          className="view-details-btn"
                          onClick={() => setSelectedOrder(order)}
                        >
                          View Details
                        </button>
                        <select
                          value={order.status}
                          onChange={e => updateStatus(order._id, e.target.value)}
                          disabled={updatingId === order._id || order.status === 'cancelled'}
                          className="status-select"
                        >
                          {STATUSES.map(s => (
                            <option key={s} value={s}>{s.replace('_', ' ')}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan="9" className="no-data">No orders found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {selectedOrder && (
          <div className="order-modal-overlay" onClick={() => setSelectedOrder(null)}>
            <motion.div
              className="order-modal"
              onClick={e => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
            >
              <div className="om-header">
                <div>
                  <div className="om-order-id">{selectedOrder.orderId}</div>
                  <div className="om-date">
                    <FiClock size={12} />
                    {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                      day: '2-digit', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })}
                  </div>
                </div>
                <div className="om-header-right">
                  <span
                    className="ao-status-badge"
                    style={{
                      background: STATUS_COLORS[selectedOrder.status]?.bg,
                      color: STATUS_COLORS[selectedOrder.status]?.color,
                      fontSize: '0.82rem',
                      padding: '5px 14px'
                    }}
                  >
                    {selectedOrder.status.replace('_', ' ')}
                  </span>
                  <button className="om-close" onClick={() => setSelectedOrder(null)}>
                    <FiX size={18} />
                  </button>
                </div>
              </div>

              <div className="om-body">
                <div className="om-grid">
                  <div className="om-block">
                    <div className="om-block-title"><FiUser size={13} /> Customer Info</div>
                    <div className="om-row"><span>Name</span><strong>{selectedOrder.user?.name || '—'}</strong></div>
                    <div className="om-row"><span><FiMail size={11} /> Email</span><strong>{selectedOrder.user?.email || '—'}</strong></div>
                    <div className="om-row"><span><FiPhone size={11} /> Phone</span><strong>{selectedOrder.customerPhone || selectedOrder.user?.phone || '—'}</strong></div>
                  </div>

                  <div className="om-block">
                    <div className="om-block-title"><FiMapPin size={13} /> Delivery Address</div>
                    {selectedOrder.deliveryAddress ? (
                      <>
                        <div className="om-row"><span>Street</span><strong>{selectedOrder.deliveryAddress.street || '—'}</strong></div>
                        <div className="om-row"><span>City</span><strong>{selectedOrder.deliveryAddress.city || '—'}</strong></div>
                        <div className="om-row"><span>State</span><strong>{selectedOrder.deliveryAddress.state || '—'}</strong></div>
                        <div className="om-row"><span>PIN</span><strong>{selectedOrder.deliveryAddress.zip || '—'}</strong></div>
                      </>
                    ) : <p className="om-empty">No address on file</p>}
                  </div>

                  <div className="om-block">
                    <div className="om-block-title"><FiCreditCard size={13} /> Payment</div>
                    <div className="om-row"><span>Method</span><strong>{PAY_LABELS[selectedOrder.paymentMethod] || selectedOrder.paymentMethod}</strong></div>
                    <div className="om-row">
                      <span>Status</span>
                      <strong style={{ color: selectedOrder.paymentStatus === 'paid' ? '#00c9a7' : '#f7931e' }}>
                        {selectedOrder.paymentStatus?.toUpperCase()}
                      </strong>
                    </div>
                    {selectedOrder.couponCode && (
                      <div className="om-row"><span>Coupon</span><strong>{selectedOrder.couponCode}</strong></div>
                    )}
                  </div>
                </div>

                {selectedOrder.notes && (
                  <div className="om-notes">
                    <span>📝 Notes:</span> {selectedOrder.notes}
                  </div>
                )}

                <div className="om-items-section">
                  <div className="om-block-title" style={{ marginBottom: 12 }}><FiShoppingBag size={13} /> Order Items ({selectedOrder.items?.length})</div>
                  <div className="om-items-list">
                    {selectedOrder.items?.map((item, i) => (
                      <div key={i} className="om-item">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&h=50&fit=crop'}
                          alt={item.name}
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=50&h=50&fit=crop'}
                        />
                        <div className="om-item-info">
                          <span className="om-item-name">{item.name}</span>
                          {item.addons?.length > 0 && (
                            <span className="om-item-addons">{item.addons.map(a => `${a.name} (+₹${a.price})`).join(', ')}</span>
                          )}
                        </div>
                        <span className="om-item-qty">×{item.quantity}</span>
                        <span className="om-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="om-totals">
                  <div className="om-total-row"><span>Subtotal</span><span>₹{selectedOrder.subtotal}</span></div>
                  {selectedOrder.discount > 0 && (
                    <div className="om-total-row green"><span>Discount</span><span>−₹{selectedOrder.discount}</span></div>
                  )}
                  <div className="om-total-row"><span>Delivery Fee</span><span>{selectedOrder.deliveryFee === 0 ? 'FREE' : `₹${selectedOrder.deliveryFee}`}</span></div>
                  <div className="om-total-row"><span>Tax (GST 5%)</span><span>₹{selectedOrder.tax}</span></div>
                  <div className="om-total-divider" />
                  <div className="om-total-row om-grand-total"><span>Grand Total</span><span>₹{selectedOrder.total}</span></div>
                </div>

                <div className="om-update-status">
                  <label>Update Order Status:</label>
                  <select
                    value={selectedOrder.status}
                    onChange={e => updateStatus(selectedOrder._id, e.target.value)}
                    disabled={updatingId === selectedOrder._id || selectedOrder.status === 'cancelled'}
                    className="om-status-select"
                  >
                    {STATUSES.map(s => (
                      <option key={s} value={s}>{s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}</option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;
