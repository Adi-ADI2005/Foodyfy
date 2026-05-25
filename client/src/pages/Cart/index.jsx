import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingCart, FiArrowRight, FiTag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon } from '../../redux/slices/cartSlice';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './style.css';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, coupon, discount } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);
  const [couponCode, setCouponCode] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const subtotal = items.reduce((acc, item) => {
    const addonTotal = (item.addons || []).reduce((a, b) => a + b.price, 0);
    return acc + (item.price + addonTotal) * item.quantity;
  }, 0);

  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal - discount + deliveryFee + tax;

  const handleQuantity = (id, delta, current) => {
    const newQty = current + delta;
    if (newQty <= 0) {
      dispatch(removeFromCart(id));
      toast.success('Item removed from cart');
    } else {
      dispatch(updateQuantity({ id, quantity: newQty }));
    }
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    if (!user) { toast.error('Please sign in to apply coupon'); return; }
    setCouponLoading(true);
    try {
      const res = await orderAPI.verifyCoupon({ code: couponCode, orderAmount: subtotal });
      dispatch(applyCoupon({ coupon: res.data.coupon, discount: res.data.discount }));
      toast.success(`Coupon applied! You save ₹${res.data.discount}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    dispatch(removeCoupon());
    setCouponCode('');
    toast.success('Coupon removed');
  };

  const handleCheckout = () => {
    if (!user) {
      toast.error('Please sign in to proceed');
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
          >
            <span className="empty-cart-emoji">🛒</span>
          </motion.div>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything yet</p>
          <Link to="/menu" className="browse-btn">Browse Menu</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <motion.div
          className="cart-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1><FiShoppingCart /> Your Cart <span className="cart-count">({items.length} items)</span></h1>
        </motion.div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-section">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item._id}
                  className="cart-item"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  layout
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop'}
                    alt={item.name}
                    className="cart-item-img"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=80&h=80&fit=crop'}
                  />
                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    {item.addons?.length > 0 && (
                      <p className="cart-addons">{item.addons.map(a => a.name).join(', ')}</p>
                    )}
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>
                  <div className="cart-item-controls">
                    <div className="qty-control">
                      <button onClick={() => handleQuantity(item._id, -1, item.quantity)}>
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => handleQuantity(item._id, 1, item.quantity)}>
                        <FiPlus />
                      </button>
                    </div>
                    <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(0)}</p>
                    <button className="remove-btn" onClick={() => { dispatch(removeFromCart(item._id)); toast.success('Removed'); }}>
                      <FiTrash2 />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <button className="clear-cart-btn" onClick={() => { dispatch(clearCart()); toast.success('Cart cleared'); }}>
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2>Order Summary</h2>

            {/* Coupon */}
            <div className="coupon-section">
              {coupon ? (
                <div className="coupon-applied">
                  <FiTag />
                  <span>{coupon.code} applied! Saving ₹{discount}</span>
                  <button onClick={handleRemoveCoupon}>✕</button>
                </div>
              ) : (
                <div className="coupon-input">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                  />
                  <button onClick={handleApplyCoupon} disabled={couponLoading}>
                    {couponLoading ? '...' : 'Apply'}
                  </button>
                </div>
              )}
            </div>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount-row">
                  <span>Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}
              <div className="summary-row">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? <span className="free-delivery">FREE</span> : `₹${deliveryFee}`}</span>
              </div>
              <div className="summary-row">
                <span>Tax (5%)</span>
                <span>₹{tax}</span>
              </div>
              {subtotal < 500 && (
                <p className="free-delivery-hint">Add ₹{500 - subtotal} more for free delivery!</p>
              )}
            </div>

            <div className="summary-total">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <motion.button
              className="checkout-btn"
              onClick={handleCheckout}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.01 }}
            >
              Proceed to Checkout <FiArrowRight />
            </motion.button>

            <Link to="/menu" className="continue-shopping">← Continue Shopping</Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
