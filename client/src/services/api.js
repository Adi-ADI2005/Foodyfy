import axios from 'axios';
import toast from 'react-hot-toast';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('foodyfy_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    const msg = err.response?.data?.message || 'Something went wrong';
    if (err.response?.status === 401) {
      localStorage.removeItem('foodyfy_token');
      localStorage.removeItem('foodyfy_user');
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
  changePassword: (data) => API.put('/auth/change-password', data),
  addAddress: (data) => API.post('/auth/address', data),
  deleteAddress: (id) => API.delete(`/auth/address/${id}`),
  toggleWishlist: (foodId) => API.put(`/auth/wishlist/${foodId}`),
};

export const foodAPI = {
  getAll: (params) => API.get('/foods', { params }),
  getById: (id) => API.get(`/foods/${id}`),
  search: (q) => API.get('/foods/search', { params: { q } }),
  create: (data) => API.post('/foods', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/foods/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/foods/${id}`),
  addReview: (id, data) => API.post(`/foods/${id}/review`, data),
};

export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id, data) => API.put(`/categories/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id) => API.delete(`/categories/${id}`),
};

export const orderAPI = {
  create: (data) => API.post('/orders', data),
  getMyOrders: () => API.get('/orders/my'),
  getById: (id) => API.get(`/orders/${id}`),
  cancel: (id) => API.put(`/orders/${id}/cancel`),
  getAll: (params) => API.get('/orders/all', { params }),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
  getStats: () => API.get('/orders/stats'),
  verifyCoupon: (data) => API.post('/orders/verify-coupon', data),
};

export const paymentAPI = {
  createOrder: (data) => API.post('/payments/create-order', data),
  verify: (data) => API.post('/payments/verify', data),
};

export const userAPI = {
  getAll: (params) => API.get('/users', { params }),
  getById: (id) => API.get(`/users/${id}`),
  updateStatus: (id, data) => API.put(`/users/${id}/status`, data),
  delete: (id) => API.delete(`/users/${id}`),
  getNotifications: () => API.get('/users/notifications'),
  markNotificationRead: (id) => API.put(`/users/notifications/${id}/read`),
};

export default API;
