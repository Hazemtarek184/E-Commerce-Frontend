/**
 * Centralized Axios client instance
 * All API calls should use this single instance
 */
import axios from 'axios';
import { API_CONFIG } from '../config/constants';

/**
 * Pre-configured axios instance for the E-Commerce API
 * - Base URL is set from constants
 * - Can be extended with interceptors for auth, logging, etc.
 */
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  // Note: Do NOT set Content-Type header here.
  // - For JSON requests, axios sets it automatically
  // - For FormData (file uploads), axios must set multipart/form-data with boundary
});

// Optional: Add request/response interceptors for global error handling
// apiClient.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error('API Error:', error.response?.data || error.message);
//     return Promise.reject(error);
//   }
// );

export default apiClient;
