import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiPackage, FiDollarSign, FiUsers, FiClock, FiTrendingUp } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { orderAPI } from '../../../services/api';
import { PageLoader } from '../../../components/Loader';
import { Link } from 'react-router-dom';
import './style.css';

const COLORS = ['#ff6b35', '#27ae60', '#0984e3', '#e74c3c'];

const StatCard = ({ icon: Icon, label, value, change, color }) => (
  <motion.div
    className="stat-card"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
  >
    <div className="stat-icon" style={{ background: color + '15', color }}>
      <Icon size={22} />
    </div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
      {change && (
        <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
          {change > 0 ? '↑' : '↓'} {Math.abs(change)}%
        </span>
      )}
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  const pieData = stats?.ordersByStatus?.map(s => ({
    name: s._id.replace('_', ' '),
    value: s.count,
  })) || [];

  return (
    <div className="admin-dashboard">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, Admin! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        <StatCard icon={FiPackage} label="Total Orders" value={stats?.stats?.totalOrders || 0} change={12} color="#ff6b35" />
        <StatCard icon={FiDollarSign} label="Total Revenue" value={`₹${(stats?.stats?.totalRevenue || 0).toLocaleString()}`} change={8} color="#27ae60" />
        <StatCard icon={FiUsers} label="Customers" value="1,245" change={10} color="#0984e3" />
        <StatCard icon={FiClock} label="Pending Orders" value={stats?.stats?.pendingOrders || 0} change={-5} color="#e74c3c" />
      </div>

      <div className="charts-grid">
        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3><FiTrendingUp /> Sales Overview</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={stats?.salesData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={v => v?.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
              <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
              <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#ff6b35' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="chart-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3>Orders by Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        className="recent-orders-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="card-header">
          <h3>Recent Orders</h3>
          <Link to="/admin/orders" className="view-all-link">View All</Link>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {(stats?.recentOrders || []).map(order => (
                <tr key={order._id}>
                  <td className="order-id-cell">{order.orderId}</td>
                  <td>{order.user?.name}</td>
                  <td>₹{order.total}</td>
                  <td>
                    <span className={`status-badge status-${order.status}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
              {(!stats?.recentOrders || stats.recentOrders.length === 0) && (
                <tr><td colSpan="5" className="no-data">No orders yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
