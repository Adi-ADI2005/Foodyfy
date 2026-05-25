import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPlus, FiTag } from 'react-icons/fi';
import toast from 'react-hot-toast';
import '../Dashboard/style.css';
import '../Foods/style.css';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([
    { _id: '1', code: 'WELCOME50', discountType: 'fixed', discountValue: 50, minOrderAmount: 200, usageLimit: 100, usedCount: 23, expiryDate: '2026-12-31', isActive: true },
    { _id: '2', code: 'SAVE20', discountType: 'percentage', discountValue: 20, minOrderAmount: 300, maxDiscount: 100, usageLimit: 50, usedCount: 12, expiryDate: '2026-10-31', isActive: true },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiryDate: '', isActive: true });

  const handleSave = (e) => {
    e.preventDefault();
    const newCoupon = { ...form, _id: Date.now().toString(), usedCount: 0 };
    setCoupons(prev => [...prev, newCoupon]);
    setShowModal(false);
    toast.success('Coupon created!');
    setForm({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', maxDiscount: '', usageLimit: '', expiryDate: '', isActive: true });
  };

  return (
    <div className="admin-foods">
      <div className="admin-page-header-row">
        <div className="admin-page-header">
          <h1>Coupons</h1>
          <p>Manage discount coupons and offers</p>
        </div>
        <button className="add-btn" onClick={() => setShowModal(true)}>
          <FiPlus /> Create Coupon
        </button>
      </div>

      <div className="admin-table-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Discount</th>
                <th>Min. Order</th>
                <th>Usage</th>
                <th>Expiry</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map(c => (
                <tr key={c._id}>
                  <td className="order-id-cell"><FiTag className="coupon-icon" /> {c.code}</td>
                  <td>{c.discountType === 'percentage' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                  <td>₹{c.minOrderAmount}</td>
                  <td>{c.usedCount}/{c.usageLimit}</td>
                  <td>{new Date(c.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`status-badge ${c.isActive ? 'status-delivered' : 'status-cancelled'}`}>
                      {c.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <motion.div className="modal-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} onClick={e => e.stopPropagation()}>
            <h2>Create Coupon</h2>
            <form onSubmit={handleSave} className="modal-form">
              <div className="form-row two-col">
                <div className="pf-group">
                  <label>Coupon Code</label>
                  <input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required placeholder="SAVE20" />
                </div>
                <div className="pf-group">
                  <label>Discount Type</label>
                  <select value={form.discountType} onChange={e => setForm(f => ({ ...f, discountType: e.target.value }))}>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed Amount</option>
                  </select>
                </div>
              </div>
              <div className="form-row two-col">
                <div className="pf-group">
                  <label>Discount Value</label>
                  <input type="number" value={form.discountValue} onChange={e => setForm(f => ({ ...f, discountValue: e.target.value }))} required placeholder={form.discountType === 'percentage' ? '20' : '50'} />
                </div>
                <div className="pf-group">
                  <label>Max Discount (₹)</label>
                  <input type="number" value={form.maxDiscount} onChange={e => setForm(f => ({ ...f, maxDiscount: e.target.value }))} placeholder="100" />
                </div>
              </div>
              <div className="form-row two-col">
                <div className="pf-group">
                  <label>Min. Order (₹)</label>
                  <input type="number" value={form.minOrderAmount} onChange={e => setForm(f => ({ ...f, minOrderAmount: e.target.value }))} placeholder="0" />
                </div>
                <div className="pf-group">
                  <label>Usage Limit</label>
                  <input type="number" value={form.usageLimit} onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value }))} required placeholder="100" />
                </div>
              </div>
              <div className="pf-group">
                <label>Expiry Date</label>
                <input type="date" value={form.expiryDate} onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))} required />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Create Coupon</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminCoupons;
