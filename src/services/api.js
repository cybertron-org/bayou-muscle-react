import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.VITE_APP_URL ;

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token') || sessionStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // If data is FormData, remove Content-Type header to let axios set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors consistently
apiClient.interceptors.response.use(
  (response) => response.data, // Return just the data portion
  (error) => {
    // Handle network errors
    if (!error.response) {
      return Promise.reject({
        status: 0,
        message: 'Network error. Please check your connection.',
        errors: {},
      });
    }

    // Handle API errors
    const { status, data } = error.response;
    
    // Log the full response for debugging
    console.log('API Error Response:', {
      status,
      data,
      fullResponse: error.response
    });
    
    return Promise.reject({
      status,
      message: data?.message || 'An error occurred',
      errors: data?.errors || data?.error || {},
      rawData: data, // Include raw data for debugging
    });
  }
);

/**
 * Generic API request handler (kept for backward compatibility)
 * @param {string} endpoint - API endpoint
 * @param {object} options - Axios options
 * @returns {Promise} - API response
 */
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await apiClient({
      url: endpoint,
      ...options,
    });
    return response; // response is already response.data from interceptor
  } catch (error) {
    throw error; // error is already formatted from interceptor
  }
};

export default apiRequest;
export { apiClient };