import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { FiShoppingCart, FiSearch, FiBell, FiChevronDown, FiUser, FiPackage, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './style.css';
const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector(s => s.auth);
  const { items } = useSelector(s => s.cart);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdownOpen(false);
  }, [location]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    navigate('/');
    setDropdownOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/menu?search=${searchQuery}`);
      setSearchOpen(false);
    }
  };

  const cartCount = items.reduce((acc, i) => acc + i.quantity, 0);

  return (
    <motion.nav
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src="/logo.png" alt="Foodyfy" className="logo-img" />
        </Link>

        <div className="navbar-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Home</Link>
          <Link to="/menu" className={`nav-link ${location.pathname === '/menu' ? 'active' : ''}`}>Menu</Link>
          <Link to="/orders" className={`nav-link ${location.pathname === '/orders' ? 'active' : ''}`}>Orders</Link>
          <Link to="/support" className={`nav-link ${location.pathname === '/support' ? 'active' : ''}`}>Support</Link>
        </div>

        <div className="navbar-actions">
          <button className="nav-icon-btn" onClick={() => setSearchOpen(!searchOpen)}>
            <FiSearch size={20} />
          </button>

          <Link to="/cart" className="nav-icon-btn cart-btn">
            <FiShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>

          {user ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <div className="user-avatar">
                  {user.avatar ? <img src={user.avatar} alt={user.name} /> : user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="user-name">{user.name?.split(' ')[0]}</span>
                <FiChevronDown className={`chevron ${dropdownOpen ? 'rotated' : ''}`} />
              </button>

              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div
                    className="dropdown-menu"
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                  >
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <div className="dropdown-divider" />
                    <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiUser /> Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                      <FiPackage /> My Orders
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="dropdown-item admin-item" onClick={() => setDropdownOpen(false)}>
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <div className="dropdown-divider" />
                    <button className="dropdown-item logout-item" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="signin-btn">Sign In</Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <FiX size={22} /> : <FiMenu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            className="search-bar-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <form onSubmit={handleSearch} className="search-form">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search for food, restaurants..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button type="submit" className="search-submit">Search</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Link to="/" className="mobile-link">Home</Link>
            <Link to="/menu" className="mobile-link">Menu</Link>
            <Link to="/orders" className="mobile-link">Orders</Link>
            <Link to="/support" className="mobile-link">Support</Link>
            {user ? (
              <>
                <Link to="/profile" className="mobile-link">Profile</Link>
                {user.role === 'admin' && <Link to="/admin" className="mobile-link">Admin Panel</Link>}
                <button className="mobile-link mobile-logout" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login" className="mobile-link mobile-signin">Sign In</Link>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
