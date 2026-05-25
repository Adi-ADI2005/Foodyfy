import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiPackage, FiClock, FiCheck, FiTruck, FiX, FiEye } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { orderAPI } from '../../services/api';
import { PageLoader } from '../../components/Loader';
import toast from 'react-hot-toast';
import './style.css';

const STATUS_MAP = {
  placed: { label: 'Order Placed', icon: '📦', color: '#6c5ce7', step: 0 },
  confirmed: { label: 'Confirmed', icon: '✅', color: '#00b894', step: 1 },
  preparing: { label: 'Preparing', icon: '👨‍🍳', color: '#fdcb6e', step: 2 },
  on_the_way: { label: 'On The Way', icon: '🛵', color: '#0984e3', step: 3 },
  delivered: { label: 'Delivered', icon: '🎉', color: '#27ae60', step: 4 },
  cancelled: { label: 'Cancelled', icon: '❌', color: '#e74c3c', step: -1 },
};

const OrderDetail = ({ orderId }) => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getById(orderId)
      .then(r => setOrder(r.data.order))
      .catch(() => toast.error('Order not found'))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <PageLoader />;
  if (!order) return <div className="order-not-found">Order not found</div>;

  const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.placed;
  const STEPS = ['placed', 'confirmed', 'preparing', 'on_the_way', 'delivered'];

  return (
    <div className="order-detail">
      <div className="order-detail-header">
        <div>
          <h2>{order.orderId}</h2>
          <p className="order-date">{new Date(order.createdAt).toLocaleString()}</p>
        </div>
        <span className="order-status-badge" style={{ background: statusInfo.color + '15', color: statusInfo.color }}>
          {statusInfo.icon} {statusInfo.label}
        </span>
      </div>

      {order.status !== 'cancelled' && (
        <div className="order-tracking">
          <h3>Order Tracking</h3>
          <div className="tracking-steps">
            {STEPS.map((s, i) => {
              const info = STATUS_MAP[s];
              const isDone = STEPS.indexOf(order.status) >= i;
              const isCurrent = order.status === s;
              return (
                <div key={s} className={`tracking-step ${isDone ? 'done' : ''} ${isCurrent ? 'current' : ''}`}>
                  <div className="tracking-dot">
                    {isDone ? <FiCheck /> : <span>{i + 1}</span>}
                  </div>
                  <div className="tracking-info">
                    <p className="tracking-label">{info.label}</p>
                    {isCurrent && <p className="tracking-current-text">Current status</p>}
                  </div>
                  {i < STEPS.length - 1 && <div className={`tracking-line ${isDone ? 'done' : ''}`} />}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="order-items-list">
        <h3>Order Items</h3>
        {order.items.map((item, i) => (
          <div key={i} className="order-item">
            <img
              src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
              alt={item.name}
              onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
            />
            <div>
              <p className="oi-name">{item.name}</p>
              <p className="oi-qty">x{item.quantity}</p>
            </div>
            <p className="oi-price">₹{(item.price * item.quantity).toFixed(0)}</p>
          </div>
        ))}
      </div>

      <div className="order-breakdown">
        <div className="breakdown-row"><span>Subtotal</span><span>₹{order.subtotal}</span></div>
        {order.discount > 0 && <div className="breakdown-row green"><span>Discount</span><span>-₹{order.discount}</span></div>}
        <div className="breakdown-row"><span>Delivery</span><span>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</span></div>
        <div className="breakdown-row"><span>Tax</span><span>₹{order.tax}</span></div>
        <div className="breakdown-row total"><span>Total</span><span>₹{order.total}</span></div>
      </div>
    </div>
  );
};

const Orders = () => {
  const { id } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    orderAPI.getMyOrders()
      .then(r => setOrders(r.data.orders))
      .catch(() => toast.error('Failed to load orders'))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  if (id) return (
    <div className="orders-page">
      <div className="orders-container">
        <Link to="/orders" className="back-link">← Back to Orders</Link>
        <OrderDetail orderId={id} />
      </div>
    </div>
  );

  const filteredOrders = activeFilter === 'all'
    ? orders
    : orders.filter(o => o.status === activeFilter);

  if (loading) return <div className="orders-page"><PageLoader /></div>;

  return (
    <div className="orders-page">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>

        <div className="orders-filters">
          {['all', 'placed', 'preparing', 'delivered', 'cancelled'].map(f => (
            <button
              key={f}
              className={`filter-btn ${activeFilter === f ? 'active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {filteredOrders.length === 0 ? (
          <div className="no-orders">
            <span>📦</span>
            <h3>No orders found</h3>
            <p>You haven't placed any orders yet</p>
            <Link to="/menu" className="order-now-btn">Order Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {filteredOrders.map((order, i) => {
              const statusInfo = STATUS_MAP[order.status] || STATUS_MAP.placed;
              return (
                <motion.div
                  key={order._id}
                  className="order-card"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="order-card-header">
                    <div>
                      <p className="order-id">{order.orderId}</p>
                      <p className="order-card-date">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="order-status-chip" style={{ background: statusInfo.color + '18', color: statusInfo.color }}>
                      {statusInfo.icon} {statusInfo.label}
                    </span>
                  </div>

                  <div className="order-card-items">
                    {order.items.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="order-item-chip">{item.name}</span>
                    ))}
                    {order.items.length > 3 && <span className="order-item-more">+{order.items.length - 3} more</span>}
                  </div>

                  <div className="order-card-footer">
                    <span className="order-total">₹{order.total}</span>
                    <div className="order-card-actions">
                      <Link to={`/orders/${order._id}`} className="view-order-btn">
                        <FiEye /> Track Order
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
