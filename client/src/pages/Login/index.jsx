import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';
import './style.css';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector(s => s.auth);

  useEffect(() => {
    if (user) navigate('/');
    return () => dispatch(clearError());
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));
    if (loginUser.fulfilled.match(res)) {
      toast.success('Welcome back! 🎉');
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
          <h1 className="auth-title">Welcome Back!</h1>
          <p className="auth-subtitle">Sign in to order your favorite food</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
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
                placeholder="Enter your password"
                {...register('password', { required: 'Password is required' })}
                className={errors.password ? 'error' : ''}
              />
              <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <span className="error-msg">⚠️ {errors.password.message}</span>}
          </div>

          <div className="auth-options">
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
          </div>

          <motion.button
            type="submit"
            className="auth-submit-btn"
            disabled={loading}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? <span className="btn-spinner" /> : 'Sign In'}
          </motion.button>
        </form>

        <div className="auth-divider"><span>or</span></div>

        <p className="auth-switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-switch-link">Create Account</Link>
        </p>

        <div className="demo-credentials">
          <p className="demo-title">Demo Credentials</p>
          <p className="demo-text">Admin: admin@foodyfy.com / admin123</p>
          <p className="demo-text">User: user@foodyfy.com / user1234</p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
