import { useEffect, useState } from 'react';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { userAPI } from '../../../services/api';
import { PageLoader } from '../../../components/Loader';
import toast from 'react-hot-toast';
import '../Dashboard/style.css';
import '../Foods/style.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    userAPI.getAll()
      .then(r => setUsers(r.data.users))
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this user?')) return;
    try {
      await userAPI.delete(id);
      setUsers(prev => prev.filter(u => u._id !== id));
      toast.success('User deleted');
    } catch { toast.error('Failed to delete'); }
  };

  const filtered = users.filter(u =>
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <PageLoader />;

  return (
    <div className="admin-foods">
      <div className="admin-page-header">
        <h1>Customers</h1>
        <p>Manage your customer accounts</p>
      </div>

      <div className="admin-search-bar">
        <FiSearch />
        <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Total Orders</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(user => (
                <tr key={user._id}>
                  <td className="order-id-cell">{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone || '-'}</td>
                  <td>{user.totalOrders || '-'}</td>
                  <td>
                    <span className={`status-badge ${user.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="action-btns">
                      <button className="action-btn delete" onClick={() => handleDelete(user._id)}>
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan="6" className="no-data">No customers found</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
