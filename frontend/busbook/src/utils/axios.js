import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // use env variable
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
