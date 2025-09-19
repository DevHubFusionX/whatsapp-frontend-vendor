import axios from 'axios';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://whatsapp-vendor.onrender.com/api'
  : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !error.config.url.includes('/auth/')) {
      localStorage.removeItem('token');
      localStorage.removeItem('loginTime');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/vendor/register', userData),
  login: (credentials) => api.post('/auth/vendor/login', credentials),
  verifyOTP: (email, otp) => api.post('/auth/vendor/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/vendor/resend-otp', { email }),
  getMe: () => api.get('/auth/me'),
  vendorForgotPassword: (data) => api.post('/auth/vendor/forgot-password', data),
  vendorVerifyOTP: (data) => api.post('/auth/vendor/verify-reset-otp', data),
  vendorResetPassword: (data) => api.post('/auth/vendor/reset-password', data)
};

export const productsAPI = {
  getProducts: () => api.get('/products'),
  addProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`)
};

export const vendorsAPI = {
  getVendorCatalog: (catalogId) => api.get(`/vendors/${catalogId}`),
  updateProfile: (profileData) => api.put('/vendors/profile', profileData)
};

export const automationAPI = {
  trackInterest: (data) => api.post('/automation/track-interest', data),
  getFollowUpCustomers: () => api.get('/automation/follow-up-customers'),
  setupAutoPost: (settings) => api.post('/automation/auto-post/setup', settings),
  getAutoPostSettings: () => api.get('/automation/auto-post/settings'),
  generateProductCard: (productId) => api.post(`/automation/generate-card/${productId}`)
};

export const ordersAPI = {
  getRecentOrders: () => api.get('/orders/recent'),
  getOrders: () => api.get('/orders'),
  updateOrderStatus: (orderId, status) => api.put(`/orders/${orderId}/status`, { status }),
  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`)
};

export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getAnalytics: (period = '7d') => api.get(`/dashboard/analytics?period=${period}`),
  getAlerts: () => api.get('/dashboard/alerts')
};

export default api;