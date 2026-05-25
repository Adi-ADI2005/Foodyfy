import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGrid, FiPackage, FiUsers, FiShoppingBag, FiLogOut, FiMenu, FiX, FiBarChart2, FiTag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './style.css';

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/foods', label: 'Food Management', icon: FiShoppingBag },
  { to: '/admin/orders', label: 'Orders', icon: FiPackage },
  { to: '/admin/users', label: 'Customers', icon: FiUsers },
  { to: '/admin/coupons', label: 'Coupons', icon: FiTag },
  { to: '/admin/reports', label: 'Reports', icon: FiBarChart2 },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <motion.aside
        className={`admin-sidebar ${sidebarOpen ? 'open' : 'collapsed'}`}
        initial={false}
        animate={{ width: sidebarOpen ? 240 : 70 }}
        transition={{ duration: 0.25 }}
      >
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <img src="/logo.png" alt="Foodyfy" className="logo-emoji" />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  className="logo-text"
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                >
                  Foodyfy
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>

        <nav className="sidebar-nav">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon size={18} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: 'auto' }}
                    exit={{ opacity: 0, width: 0 }}
                    className="link-label"
                  >
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
            </NavLink>
          ))}
        </nav>

        <button className="sidebar-logout" onClick={handleLogout} title={!sidebarOpen ? 'Logout' : undefined}>
          <FiLogOut size={18} />
          <AnimatePresence>
            {sidebarOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Logout
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </motion.aside>

      {/* Main content */}
      <div className="admin-main">
        {/* Top bar */}
        <header className="admin-topbar">
          <div className="admin-page-title">Admin Panel</div>
          <div className="admin-user-info">
            <div className="admin-avatar">
              {user.avatar
                ? <img src={user.avatar} alt={user.name} />
                : user.name?.charAt(0).toUpperCase()
              }
            </div>
            <div>
              <p className="admin-name">{user.name}</p>
              <p className="admin-role">Administrator</p>
            </div>
          </div>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
