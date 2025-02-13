import axios from 'axios';
import { API_URL } from '@env';

const url = API_URL
console.log(
  url
);

const api = axios.create({
  baseURL: url, 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export default api;

