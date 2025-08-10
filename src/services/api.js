import axios from 'axios';

const API_BASE_URL = 'https://whatsapp-vendor.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: false
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resendOTP: (email) => api.post('/auth/resend-otp', { email }),
  getMe: () => api.get('/auth/me')
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

export default api;