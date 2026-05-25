import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiFacebook, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi';
import './style.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletter = (e) => {
    e.preventDefault();
    setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-glow" />
      <div className="footer-container">
        <div className="footer-brand">
          <div className="footer-logo">
            <img src="/logo.png" alt="Foodyfy" className="footer-logo-icon" />
            <span className="footer-logo-text">Foodyfy</span>
          </div>
          <p className="footer-desc">
            Delivering happiness to your door. Fresh, hot, and delicious food from your favorite restaurants — 24/7.
          </p>
          <div className="footer-socials">
            <a href="#" className="social-btn" aria-label="Facebook"><FiFacebook /></a>
            <a href="#" className="social-btn" aria-label="Twitter"><FiTwitter /></a>
            <a href="#" className="social-btn" aria-label="Instagram"><FiInstagram /></a>
            <a href="#" className="social-btn" aria-label="YouTube"><FiYoutube /></a>
          </div>
        </div>

        <div className="footer-links-group">
          <h4>Company</h4>
          <Link to="/">About Us</Link>
          <Link to="/">Careers</Link>
          <Link to="/">Blog</Link>
          <Link to="/">Press</Link>
        </div>

        <div className="footer-links-group">
          <h4>For Customers</h4>
          <Link to="/menu">Browse Menu</Link>
          <Link to="/orders">Track Orders</Link>
          <Link to="/support">Support</Link>
          <Link to="/">Offers &amp; Deals</Link>
        </div>

        <div className="footer-newsletter">
          <h4>Stay in the loop</h4>
          <p>Get exclusive deals and new menu updates straight to your inbox.</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <div className="newsletter-input-row">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="newsletter-btn">Subscribe</button>
            </div>
          </form>
          <div className="footer-links-group" style={{ marginTop: '18px' }}>
            <h4>Contact</h4>
            <p>📍 123 Food Street, Odisha</p>
            <p>📞 +91 82801400085</p>
            <p>✉️ hello@foodyfy.com</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 Foodyfy. All rights reserved.</p>
        <div className="footer-bottom-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Cookie Policy</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
