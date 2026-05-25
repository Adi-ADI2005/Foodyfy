import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiAlertCircle } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import '../Login/style.css';
import './style.css';

const getStrength = (pw) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABELS = ['', 'Weak', 'Weak', 'Medium', 'Strong', 'Very Strong'];
const STRENGTH_COLORS = ['', '#e74c3c', '#e67e22', '#f7931e', '#27ae60', '#1e8449'];

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  const strength = getStrength(passwordValue);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    const res = await dispatch(registerUser({ name: data.name, email: data.email, password: data.password }));
    if (registerUser.fulfilled.match(res)) {
      toast.success('Account created! Welcome to Foodyfy 🎉');
      navigate('/');
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg-circle auth-circle-1" />
        <div className="auth-bg-circle auth-circle-2" />
      </div>

      <motion.div
        className="auth-card"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <img src="/logo.png" alt="Foodyfy" className="auth-logo-img" />
            <span>Foodyfy</span>
          </Link>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join 10,000+ food lovers on Foodyfy</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="form-group">
            <label>Full Name</label>
            <div className="input-wrapper">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="Your full name"
                {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'At least 2 characters' } })}
                className={errors.name ? 'error' : ''}
              />
            </div>
            {errors.name && <span className="error-msg">⚠️ {errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <div className="input-wrapper">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="your@email.com"
                {...register('email', {
                  required: 'Email is required',
                  pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' }
                })}
                className={errors.email ? 'error' : ''}
              />
            </div>
            {errors.email && <span className="error-msg">⚠️ {errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Min. 8 characters"
                {...register('password', {
                  required: 'Password is required',
                  minLength: { value: 8, message: 'Minimum 8 characters' },
                  validate: {
                    uppercase: v => /[A-Z]/.test(v) || 'Need uppercase letter',
                    lowercase: v => /[a-z]/.test(v) || 'Need lowercase letter',
                    number: v => /[0-9]/.test(v) || 'Need a number',
                    special: v => /[^A-Za-z0-9]/.test(v) || 'Need special character',
                  }
                })}
                className={errors.password ? 'error' : ''}
                onChange={e => setPasswordValue(e.target.value)}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {passwordValue && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="strength-seg" style={{ background: i <= strength ? STRENGTH_COLORS[strength] : '#eee' }} />
                  ))}
                </div>
                <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>
                  {STRENGTH_LABELS[strength]}
                </span>
              </div>
            )}
            {errors.password && <span className="error-msg">⚠️ {errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="input-wrapper">
              <FiLock className="input-icon" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirm your password"
                {...register('confirmPassword', { required: 'Please confirm your password' })}
                className={errors.confirmPassword ? 'error' : ''}
              />
              <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <span className="error-msg">⚠️ {errors.confirmPassword.message}</span>}
          </div>

          <div className="password-rules">
            {[
              { rule: /[A-Z]/.test(passwordValue), label: 'Uppercase letter' },
              { rule: /[a-z]/.test(passwordValue), label: 'Lowercase letter' },
              { rule: /[0-9]/.test(passwordValue), label: 'Number' },
              { rule: /[^A-Za-z0-9]/.test(passwordValue), label: 'Special character' },
              { rule: passwordValue.length >= 8, label: '8+ characters' },
            ].map(({ rule, label }) => (
              <span key={label} className={`rule ${rule ? 'rule-pass' : 'rule-fail'}`}>
                {rule ? '✓' : '✗'} {label}
              </span>
            ))}
          </div>

          <motion.button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <span className="btn-spinner" /> : 'Create Account'}
          </motion.button>
        </form>

        <p className="auth-switch" style={{ marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" className="auth-switch-link">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
