// src/services/apiService.js
import { config } from '@/config/env';
import axios from 'axios';

const apiService = {
  _instance: null,
  
  // Initialize axios instance
  _getAxiosInstance() {
    if (!this._instance) {
      this._instance = axios.create({
        baseURL: config.apiBaseUrl,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
      
      // Add request interceptor to include token in headers
      this._instance.interceptors.request.use(
        (config) => {
          const token = localStorage.getItem('auth-token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => Promise.reject(error)
      );
      
      // Add response interceptor for consistent response handling
      this._instance.interceptors.response.use(
        (response) => response.data,
        (error) => {
          console.error('API Error:', error.response || error);
          return Promise.reject(error);
        }
      );
    }
    return this._instance;
  },

  // HTTP methods
  async get(url, params = {}) {
    return this._getAxiosInstance().get(url, { params });
  },

  async post(url, data = {}, headers = {}) {
    return this._getAxiosInstance().post(url, data, { headers });
  },

  async put(url, data = {}) {
    return this._getAxiosInstance().put(url, data);
  },

  async delete(url) {
    return this._getAxiosInstance().delete(url);
  },
  
  // Token management
  setToken(token) {
    localStorage.setItem('auth-token', token);
  },
  
  removeToken() {
    localStorage.removeItem('auth-token');
  },
  
  getToken() {
    return localStorage.getItem('auth-token');
  }
};

export default apiService;