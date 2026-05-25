import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FiTrendingUp, FiDollarSign, FiPackage, FiUsers } from 'react-icons/fi';
import { orderAPI } from '../../../services/api';
import { PageLoader } from '../../../components/Loader';
import '../Dashboard/style.css';

const AdminReports = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getStats()
      .then(r => setStats(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div>
      <div className="admin-page-header" style={{ marginBottom: '28px' }}>
        <h1>Reports & Analytics</h1>
        <p>Detailed business insights and metrics</p>
      </div>

      <div className="stats-grid" style={{ marginBottom: '28px' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#ff6b3515', color: '#ff6b35' }}><FiDollarSign /></div>
          <div className="stat-info">
            <p className="stat-label">Total Revenue</p>
            <h3 className="stat-value">₹{(stats?.stats?.totalRevenue || 0).toLocaleString()}</h3>
            <span className="stat-change positive">↑ 8.5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#27ae6015', color: '#27ae60' }}><FiPackage /></div>
          <div className="stat-info">
            <p className="stat-label">Total Orders</p>
            <h3 className="stat-value">{stats?.stats?.totalOrders || 0}</h3>
            <span className="stat-change positive">↑ 12%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#0984e315', color: '#0984e3' }}><FiTrendingUp /></div>
          <div className="stat-info">
            <p className="stat-label">Avg Order Value</p>
            <h3 className="stat-value">₹{stats?.stats?.totalOrders > 0 ? Math.round(stats.stats.totalRevenue / stats.stats.totalOrders) : 0}</h3>
            <span className="stat-change positive">↑ 6.8%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#6c5ce715', color: '#6c5ce7' }}><FiUsers /></div>
          <div className="stat-info">
            <p className="stat-label">New Customers</p>
            <h3 className="stat-value">145</h3>
            <span className="stat-change positive">↑ 11%</span>
          </div>
        </div>
      </div>

      <div className="chart-card" style={{ marginBottom: '20px' }}>
        <h3><FiTrendingUp /> Revenue Over Time</h3>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={stats?.salesData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={v => v?.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `₹${v}`} />
            <Tooltip formatter={v => [`₹${v}`, 'Revenue']} />
            <Line type="monotone" dataKey="revenue" stroke="#ff6b35" strokeWidth={2.5} dot={{ fill: '#ff6b35', r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-card">
        <h3>Orders Per Day</h3>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={stats?.salesData || []}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={v => v?.slice(5)} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={v => [v, 'Orders']} />
            <Bar dataKey="count" fill="#ff6b35" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminReports;
