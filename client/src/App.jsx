import { useState, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { store } from './redux/store';
import IntroAnimation from './components/IntroAnimation';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { PageLoader } from './components/Loader';
import './index.css';

const Home = lazy(() => import('./pages/Home'));
const Menu = lazy(() => import('./pages/Home/Menu'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Orders = lazy(() => import('./pages/Orders'));
const Profile = lazy(() => import('./pages/Profile'));
const FoodDetails = lazy(() => import('./pages/FoodDetails'));
const Support = lazy(() => import('./pages/Support'));
const AdminLayout = lazy(() => import('./pages/Admin'));
const Dashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminFoods = lazy(() => import('./pages/Admin/Foods'));
const AdminOrders = lazy(() => import('./pages/Admin/Orders'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminCoupons = lazy(() => import('./pages/Admin/Coupons'));
const AdminReports = lazy(() => import('./pages/Admin/Reports'));

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<><Navbar /><Home /><Footer /></>} />
      <Route path="/menu" element={<><Navbar /><Menu /><Footer /></>} />
      <Route path="/food/:id" element={<><Navbar /><FoodDetails /><Footer /></>} />
      <Route path="/cart" element={<><Navbar /><Cart /><Footer /></>} />
      <Route path="/checkout" element={<><Navbar /><Checkout /><Footer /></>} />
      <Route path="/orders" element={<><Navbar /><Orders /><Footer /></>} />
      <Route path="/orders/:id" element={<><Navbar /><Orders /><Footer /></>} />
      <Route path="/profile" element={<><Navbar /><Profile /><Footer /></>} />
      <Route path="/support" element={<><Navbar /><Support /><Footer /></>} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="foods" element={<AdminFoods />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="coupons" element={<AdminCoupons />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Suspense>
);

const App = () => {
  const [showIntro, setShowIntro] = useState(true);
  const [introComplete, setIntroComplete] = useState(false);

  const handleIntroComplete = () => {
    setShowIntro(false);
    setIntroComplete(true);
  };

  return (
    <Provider store={store}>
      <BrowserRouter>
        {showIntro && <IntroAnimation onComplete={handleIntroComplete} />}
        {introComplete && <AppRoutes />}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(17,17,17,0.96)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: '14px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,43,43,0.06)',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#ffffff',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#111' } },
            error: { iconTheme: { primary: '#FF2B2B', secondary: '#111' } },
          }}
        />
      </BrowserRouter>
    </Provider>
  );
};

export default App;
