import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiPhone, FiEdit2, FiLock, FiHeart, FiMapPin } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { authAPI } from '../../services/api';
import { updateUserData } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './style.css';

const Profile = () => {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const { register: regProfile, handleSubmit: submitProfile } = useForm({
    defaultValues: { name: user?.name || '', phone: user?.phone || '' }
  });
  const { register: regPw, handleSubmit: submitPw, reset: resetPw, formState: { errors: pwErrors } } = useForm();

  const onUpdateProfile = async (data) => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(data);
      dispatch(updateUserData(res.data.user));
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const onChangePassword = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    setSaving(true);
    try {
      await authAPI.changePassword({ currentPassword: data.currentPassword, newPassword: data.newPassword });
      toast.success('Password changed successfully!');
      resetPw();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  const TABS = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'password', label: 'Password', icon: FiLock },
    { id: 'addresses', label: 'Addresses', icon: FiMapPin },
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        <motion.div
          className="profile-sidebar"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="profile-avatar-section">
            <div className="profile-avatar-big">
              {user?.avatar
                ? <img src={user.avatar} alt={user?.name} />
                : <span>{user?.name?.charAt(0).toUpperCase()}</span>
              }
            </div>
            <h2 className="profile-name">{user?.name}</h2>
            <p className="profile-email">{user?.email}</p>
            <span className={`profile-role-badge ${user?.role}`}>{user?.role}</span>
          </div>

          <nav className="profile-nav">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                className={`profile-nav-btn ${activeTab === id ? 'active' : ''}`}
                onClick={() => setActiveTab(id)}
              >
                <Icon /> {label}
              </button>
            ))}
          </nav>
        </motion.div>

        <motion.div
          className="profile-content"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          {activeTab === 'profile' && (
            <div className="profile-section">
              <h3><FiEdit2 /> Edit Profile</h3>
              <form onSubmit={submitProfile(onUpdateProfile)} className="profile-form">
                <div className="pf-group">
                  <label>Full Name</label>
                  <div className="pf-input-wrap">
                    <FiUser />
                    <input {...regProfile('name', { required: true })} placeholder="Your name" />
                  </div>
                </div>
                <div className="pf-group">
                  <label>Email Address</label>
                  <div className="pf-input-wrap disabled">
                    <FiMail />
                    <input value={user?.email || ''} disabled />
                  </div>
                  <span className="pf-hint">Email cannot be changed</span>
                </div>
                <div className="pf-group">
                  <label>Phone Number</label>
                  <div className="pf-input-wrap">
                    <FiPhone />
                    <input {...regProfile('phone')} placeholder="+91 98765 43210" />
                  </div>
                </div>
                <button type="submit" className="pf-save-btn" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="profile-section">
              <h3><FiLock /> Change Password</h3>
              <form onSubmit={submitPw(onChangePassword)} className="profile-form">
                <div className="pf-group">
                  <label>Current Password</label>
                  <div className="pf-input-wrap">
                    <FiLock />
                    <input type="password" {...regPw('currentPassword', { required: 'Required' })} placeholder="Enter current password" />
                  </div>
                  {pwErrors.currentPassword && <span className="pf-err">{pwErrors.currentPassword.message}</span>}
                </div>
                <div className="pf-group">
                  <label>New Password</label>
                  <div className="pf-input-wrap">
                    <FiLock />
                    <input type="password" {...regPw('newPassword', { required: 'Required', minLength: { value: 8, message: 'Min 8 chars' } })} placeholder="New password" />
                  </div>
                  {pwErrors.newPassword && <span className="pf-err">{pwErrors.newPassword.message}</span>}
                </div>
                <div className="pf-group">
                  <label>Confirm New Password</label>
                  <div className="pf-input-wrap">
                    <FiLock />
                    <input type="password" {...regPw('confirmPassword', { required: 'Required' })} placeholder="Confirm new password" />
                  </div>
                </div>
                <button type="submit" className="pf-save-btn" disabled={saving}>
                  {saving ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
          )}

          {activeTab === 'addresses' && (
            <div className="profile-section">
              <h3><FiMapPin /> Saved Addresses</h3>
              {user?.addresses?.length > 0 ? (
                <div className="addresses-list">
                  {user.addresses.map((addr, i) => (
                    <div key={i} className="address-card">
                      <div className="addr-label">{addr.label || 'Home'} {addr.isDefault && <span className="default-badge">Default</span>}</div>
                      <p>{addr.street}, {addr.city}, {addr.state} {addr.zip}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-addresses">
                  <span>📍</span>
                  <p>No saved addresses yet</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
