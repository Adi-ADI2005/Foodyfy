import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMapPin, FiCreditCard, FiCheck, FiAlertCircle, FiPhone, FiUser, FiShoppingBag } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { clearCart } from '../../redux/slices/cartSlice';
import { orderAPI } from '../../services/api';
import toast from 'react-hot-toast';
import './style.css';

const STEPS = ['Delivery', 'Payment', 'Confirm'];

const UPI_METHODS = [
  {
    id: 'upi_phonepe',
    name: 'PhonePe',
    desc: 'Pay via PhonePe UPI',
    color: '#5f259f',
    bg: 'rgba(95,37,159,0.08)',
    logo: '📲',
    emoji: true,
    brand: 'phonepe',
  },
  {
    id: 'upi_googlepay',
    name: 'Google Pay',
    desc: 'Pay via Google Pay UPI',
    color: '#1a73e8',
    bg: 'rgba(26,115,232,0.08)',
    logo: '💳',
    emoji: true,
    brand: 'gpay',
  },
  {
    id: 'upi_paytm',
    name: 'Paytm',
    desc: 'Pay via Paytm UPI',
    color: '#00b9f5',
    bg: 'rgba(0,185,245,0.08)',
    logo: '💰',
    emoji: true,
    brand: 'paytm',
  },
  {
    id: 'upi_navi',
    name: 'Navi UPI',
    desc: 'Pay via Navi UPI',
    color: '#00c9a7',
    bg: 'rgba(0,201,167,0.08)',
    logo: '🏦',
    emoji: true,
    brand: 'navi',
  },
  {
    id: 'upi_other',
    name: 'Other UPI Apps',
    desc: 'BHIM, iMobile, Axis Pay & more',
    color: '#ff6b35',
    bg: 'rgba(255,107,53,0.08)',
    logo: '🔗',
    emoji: true,
    brand: 'other',
  },
  {
    id: 'upi_qr',
    name: 'Scan QR Code',
    desc: 'Scan with any UPI app',
    color: '#6c3de8',
    bg: 'rgba(108,61,232,0.08)',
    logo: '⬛',
    emoji: true,
    brand: 'qr',
  },
];

const MERCHANT_UPI = 'foodyfy@ybl';
const MERCHANT_NAME = 'Foodyfy';

const getPaymentLabel = (id) => {
  if (id === 'cod') return '💵 Cash on Delivery';
  const m = UPI_METHODS.find(u => u.id === id);
  return m ? m.name : id;
};

const Checkout = () => {
  const [step, setStep] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('upi_phonepe');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors }, getValues, watch } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, discount, coupon } = useSelector(s => s.cart);
  const { user } = useSelector(s => s.auth);

  const subtotal = items.reduce((acc, item) => {
    const addonTotal = (item.addons || []).reduce((a, b) => a + b.price, 0);
    return acc + (item.price + addonTotal) * item.quantity;
  }, 0);
  const deliveryFee = subtotal >= 500 ? 0 : 30;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal - discount + deliveryFee + tax;

  const hasPhone = user?.phone && user.phone.trim().length >= 10;
  const upiString = `upi://pay?pa=${MERCHANT_UPI}&pn=${encodeURIComponent(MERCHANT_NAME)}&am=${total}&cu=INR&tn=Order+by+${encodeURIComponent(user?.name || 'Customer')}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(upiString)}`;

  const handleDeliveryNext = (data) => {
    if (!hasPhone) {
      toast.error('Please add your mobile number in Profile first!');
      return;
    }
    setStep(1);
  };

  const handlePaymentNext = () => {
    setStep(2);
  };

  const placeOrder = async () => {
    setLoading(true);
    try {
      const formData = getValues();
      const orderData = {
        items: items.map(i => ({
          food: i._id,
          name: i.name,
          image: i.image,
          price: i.price,
          quantity: i.quantity,
          addons: i.addons || [],
        })),
        deliveryAddress: {
          label: 'Home',
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
        },
        customerPhone: user?.phone || '',
        paymentMethod,
        couponCode: coupon?.code || '',
        notes: formData.notes || '',
      };

      const res = await orderAPI.create(orderData);
      const order = res.data.order;
      dispatch(clearCart());
      toast.success('Order placed successfully! 🎉');
      navigate(`/orders/${order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const formValues = watch();

  if (!hasPhone) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-blocked">
            <div className="blocked-icon">📱</div>
            <h2>Mobile Number Required</h2>
            <p>Please add your mobile number to your profile before placing an order. This is needed for order updates and delivery coordination.</p>
            <Link to="/profile" className="blocked-btn">Go to Profile →</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-sub">{items.length} item{items.length !== 1 ? 's' : ''} in your order</p>
        </div>

        <div className="steps-indicator">
          {STEPS.map((s, i) => (
            <div key={s} className={`step-item ${i <= step ? 'active' : ''} ${i < step ? 'done' : ''}`}>
              <div className="step-circle">
                {i < step ? <FiCheck size={14} /> : i + 1}
              </div>
              <span className="step-label">{s}</span>
              {i < STEPS.length - 1 && <div className={`step-line ${i < step ? 'done' : ''}`} />}
            </div>
          ))}
        </div>

        <div className="checkout-layout">
          <div className="checkout-main">
            <AnimatePresence mode="wait">

              {step === 0 && (
                <motion.div
                  key="step0"
                  className="checkout-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <div className="section-head">
                    <div className="section-icon-box" style={{ background: 'rgba(108,61,232,0.1)', color: '#6c3de8' }}>
                      <FiMapPin size={18} />
                    </div>
                    <div>
                      <h2>Delivery Address</h2>
                      <p>Where should we deliver your order?</p>
                    </div>
                  </div>

                  <div className="profile-info-bar">
                    <FiUser size={14} />
                    <span><strong>{user?.name}</strong></span>
                    <span className="pib-sep">•</span>
                    <FiPhone size={14} />
                    <span>{user?.phone}</span>
                  </div>

                  <form onSubmit={handleSubmit(handleDeliveryNext)} className="address-form">
                    <div className="form-group">
                      <label>Street Address *</label>
                      <input
                        {...register('street', { required: 'Street address is required' })}
                        placeholder="House No, Street, Area"
                      />
                      {errors.street && <span className="err"><FiAlertCircle size={12} /> {errors.street.message}</span>}
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label>City *</label>
                        <input {...register('city', { required: 'City is required' })} placeholder="Mumbai" />
                        {errors.city && <span className="err"><FiAlertCircle size={12} /> {errors.city.message}</span>}
                      </div>
                      <div className="form-group">
                        <label>State *</label>
                        <input {...register('state', { required: 'State is required' })} placeholder="Maharashtra" />
                        {errors.state && <span className="err"><FiAlertCircle size={12} /> {errors.state.message}</span>}
                      </div>
                    </div>
                    <div className="form-row two-col">
                      <div className="form-group">
                        <label>PIN Code *</label>
                        <input
                          {...register('zip', {
                            required: 'PIN code is required',
                            pattern: { value: /^\d{6}$/, message: '6-digit PIN code' }
                          })}
                          placeholder="400001"
                          maxLength={6}
                        />
                        {errors.zip && <span className="err"><FiAlertCircle size={12} /> {errors.zip.message}</span>}
                      </div>
                      <div className="form-group">
                        <label>Delivery Time</label>
                        <select>
                          <option>ASAP (20–30 min)</option>
                          <option>Schedule for later</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Special Instructions (Optional)</label>
                      <textarea {...register('notes')} placeholder="Landmark, gate code, allergies..." rows={3} />
                    </div>
                    <button type="submit" className="next-btn">
                      Continue to Payment →
                    </button>
                  </form>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div
                  key="step1"
                  className="checkout-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <div className="section-head">
                    <div className="section-icon-box" style={{ background: 'rgba(108,61,232,0.1)', color: '#6c3de8' }}>
                      <FiCreditCard size={18} />
                    </div>
                    <div>
                      <h2>Payment Method</h2>
                      <p>All UPI payments are 100% secure</p>
                    </div>
                  </div>

                  <div className="payment-section-label">
                    <span className="psl-dot" style={{ background: '#6c3de8' }} />
                    UPI / Digital Payments
                  </div>
                  <div className="payment-grid">
                    {UPI_METHODS.map(method => (
                      <button
                        key={method.id}
                        className={`payment-card ${paymentMethod === method.id ? 'selected' : ''}`}
                        onClick={() => setPaymentMethod(method.id)}
                        style={paymentMethod === method.id ? {
                          borderColor: method.color,
                          background: method.bg,
                          boxShadow: `0 4px 20px ${method.color}22`
                        } : {}}
                      >
                        <div className="pc-radio" style={paymentMethod === method.id ? { borderColor: method.color, background: method.color } : {}} />
                        <div className="pc-logo">{method.logo}</div>
                        <div className="pc-info">
                          <span className="pc-name" style={paymentMethod === method.id ? { color: method.color } : {}}>{method.name}</span>
                          <span className="pc-desc">{method.desc}</span>
                        </div>
                        {method.id === 'upi_phonepe' && <span className="pc-badge popular">Popular</span>}
                        {method.id === 'upi_qr' && <span className="pc-badge scan">Scan</span>}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === 'upi_qr' && (
                    <motion.div
                      className="qr-box"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <div className="qr-header">
                        <span className="qr-title">🔲 Scan to Pay ₹{total}</span>
                        <span className="qr-sub">Use any UPI app to scan this code</span>
                      </div>
                      <div className="qr-image-wrap">
                        <img src={qrUrl} alt="UPI QR Code" className="qr-image" />
                        <div className="qr-upi-id">
                          <span>UPI ID:</span>
                          <strong>{MERCHANT_UPI}</strong>
                        </div>
                      </div>
                      <div className="qr-apps">
                        <span>Works with:</span>
                        <div className="qr-app-list">
                          <span>📲 PhonePe</span>
                          <span>💳 GPay</span>
                          <span>💰 Paytm</span>
                          <span>🏦 Navi</span>
                          <span>🔗 BHIM</span>
                        </div>
                      </div>
                      <p className="qr-confirm-note">⚡ After scanning and paying, click <strong>"Review Order"</strong> to confirm your order.</p>
                    </motion.div>
                  )}

                  <div className="payment-section-label" style={{ marginTop: 20 }}>
                    <span className="psl-dot" style={{ background: '#888' }} />
                    Pay on Delivery
                  </div>
                  <button
                    className={`payment-card cod-card ${paymentMethod === 'cod' ? 'selected' : ''}`}
                    onClick={() => setPaymentMethod('cod')}
                    style={paymentMethod === 'cod' ? {
                      borderColor: '#f7931e',
                      background: 'rgba(247,147,30,0.06)',
                    } : {}}
                  >
                    <div className="pc-radio" style={paymentMethod === 'cod' ? { borderColor: '#f7931e', background: '#f7931e' } : {}} />
                    <div className="pc-logo">💵</div>
                    <div className="pc-info">
                      <span className="pc-name" style={paymentMethod === 'cod' ? { color: '#f7931e' } : {}}>Cash on Delivery</span>
                      <span className="pc-desc">Pay when your order arrives at your doorstep</span>
                    </div>
                  </button>

                  <div className="checkout-btns" style={{ marginTop: 24 }}>
                    <button className="back-btn" onClick={() => setStep(0)}>← Back</button>
                    <button className="next-btn" onClick={handlePaymentNext}>Review Order →</button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step2"
                  className="checkout-section"
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                >
                  <div className="section-head">
                    <div className="section-icon-box" style={{ background: 'rgba(0,201,167,0.1)', color: '#00c9a7' }}>
                      <FiShoppingBag size={18} />
                    </div>
                    <div>
                      <h2>Review & Confirm</h2>
                      <p>Please verify all details before placing your order</p>
                    </div>
                  </div>

                  <div className="confirm-grid">
                    <div className="confirm-block">
                      <div className="cb-title"><FiUser size={13} /> Customer Details</div>
                      <div className="cb-row"><span>Name</span><strong>{user?.name}</strong></div>
                      <div className="cb-row"><span>Phone</span><strong>{user?.phone}</strong></div>
                      <div className="cb-row"><span>Email</span><strong>{user?.email}</strong></div>
                    </div>

                    <div className="confirm-block">
                      <div className="cb-title"><FiMapPin size={13} /> Delivery Address</div>
                      <div className="cb-row"><span>Street</span><strong>{formValues.street || '—'}</strong></div>
                      <div className="cb-row"><span>City</span><strong>{formValues.city || '—'}</strong></div>
                      <div className="cb-row"><span>State</span><strong>{formValues.state || '—'}</strong></div>
                      <div className="cb-row"><span>PIN</span><strong>{formValues.zip || '—'}</strong></div>
                      {formValues.notes && <div className="cb-row"><span>Notes</span><strong>{formValues.notes}</strong></div>}
                    </div>

                    <div className="confirm-block">
                      <div className="cb-title"><FiCreditCard size={13} /> Payment Method</div>
                      <div className="cb-row payment-row">
                        <span className="payment-chosen">{getPaymentLabel(paymentMethod)}</span>
                        {paymentMethod !== 'cod' && <span className="paid-badge">✓ Paid via UPI</span>}
                        {paymentMethod === 'cod' && <span className="cod-badge">Pay on Delivery</span>}
                      </div>
                    </div>
                  </div>

                  <div className="order-items-confirm">
                    <div className="oic-title">Order Items ({items.length})</div>
                    {items.map(item => (
                      <div key={item._id} className="oic-item">
                        <img
                          src={item.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
                          alt={item.name}
                          onError={e => e.target.src = 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=60&h=60&fit=crop'}
                        />
                        <div className="oic-info">
                          <span className="oic-name">{item.name}</span>
                          {item.addons?.length > 0 && (
                            <span className="oic-addons">{item.addons.map(a => a.name).join(', ')}</span>
                          )}
                        </div>
                        <span className="oic-qty">×{item.quantity}</span>
                        <span className="oic-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="confirm-total-breakdown">
                    <div className="ctb-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
                    {discount > 0 && <div className="ctb-row green"><span>Discount ({coupon?.code})</span><span>−₹{discount}</span></div>}
                    <div className="ctb-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span></div>
                    <div className="ctb-row"><span>GST (5%)</span><span>₹{tax}</span></div>
                    <div className="ctb-divider" />
                    <div className="ctb-row total"><span>Total Amount</span><span>₹{total}</span></div>
                  </div>

                  <div className="checkout-btns">
                    <button className="back-btn" onClick={() => setStep(1)}>← Back</button>
                    <motion.button
                      className="place-order-btn"
                      onClick={placeOrder}
                      disabled={loading}
                      whileTap={{ scale: 0.97 }}
                    >
                      {loading ? (
                        <span className="btn-loading">⏳ Placing Order...</span>
                      ) : (
                        <span>✅ Confirm & Place Order · ₹{total}</span>
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="checkout-summary">
            <div className="cs-header">
              <h3>Order Summary</h3>
              <span className="cs-count">{items.length} items</span>
            </div>
            <div className="cs-items">
              {items.map(item => (
                <div key={item._id} className="cs-item">
                  <div className="cs-item-info">
                    <span className="cs-item-name">{item.name}</span>
                    <span className="cs-item-qty">×{item.quantity}</span>
                  </div>
                  <span className="cs-item-price">₹{(item.price * item.quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>
            <div className="cs-divider" />
            <div className="cs-row"><span>Subtotal</span><span>₹{subtotal}</span></div>
            {discount > 0 && <div className="cs-row green"><span>Discount</span><span>−₹{discount}</span></div>}
            <div className="cs-row"><span>Delivery</span><span>{deliveryFee === 0 ? <span className="free-tag">FREE</span> : `₹${deliveryFee}`}</span></div>
            <div className="cs-row"><span>Tax (5%)</span><span>₹{tax}</span></div>
            <div className="cs-divider" />
            <div className="cs-row cs-total"><span>Total</span><span>₹{total}</span></div>
            {subtotal < 500 && (
              <div className="free-delivery-hint">
                Add ₹{500 - subtotal} more for <strong>FREE delivery</strong>!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
