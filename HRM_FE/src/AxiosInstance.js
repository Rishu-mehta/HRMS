import axios from 'axios';
import { baseURL } from './Config';

const instance = axios.create({
  baseURL: baseURL,
  timeout: 60000,
});

// Request Interceptor
instance.interceptors.request.use(
  async (config) => {
    try {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      console.error('Request interceptor error:', error);
      return config;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);


instance.interceptors.response.use(
  (response) => {
    
    return response;
  },
  (error) => {
    if (error.response) {
    
      if (error.response.status === 401) {
        console.warn('Unauthorized! Redirecting or clearing storage...');
        localStorage.removeItem('access_token');
       
        window.location.href = '/login';
      }
    } else if (error.request) {
      console.error('No response from server:', error.request);
    } else {
      console.error('Axios error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default instance;
