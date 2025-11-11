// src/api/axiosClient.js
import axios from 'axios';
import { BASE_URL } from '../data/url';
import AsyncStorage from '@react-native-async-storage/async-storage';

const axiosClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10s
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor request: tự động thêm token nếu có
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('Axios Request Error:', error);
    return Promise.reject(error);
  },
);

// Interceptor response: log chi tiết
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Server responded với status code khác 2xx
      console.log('Axios Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request đã gửi nhưng không nhận được phản hồi
      console.log('Axios No Response:', error.request);
    } else {
      // Lỗi cấu hình hoặc khác
      console.log('Axios Error Message:', error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
