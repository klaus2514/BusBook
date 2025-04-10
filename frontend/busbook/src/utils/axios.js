import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000', // Ensure this matches your backend
});

// Add this interceptor to attach the token
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; // "Bearer " prefix is REQUIRED
  }
  return config;
});

export default instance;