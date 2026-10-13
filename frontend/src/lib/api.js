/**
 * API Client for Puramente Admin Dashboard
 */

import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' 
      ? localStorage.getItem('adminToken') || localStorage.getItem('token')
      : null;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('token');
        window.location.href = '/adminlogin';
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Login admin user with cookie-based authentication
 */
export async function loginAdminUser(credentials) {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    const loginClient = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001',
      timeout: 10000,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const response = await loginClient.post('/api/auth/admin-login', {
      email: email.toLowerCase().trim(),
      password
    });

    if (response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('adminToken', response.data.data.token);
        // Set cookie - simple approach
        const token = response.data.data.token;
        const date = new Date();
        date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
        document.cookie = "adminToken=" + token + "; expires=" + date.toUTCString() + "; path=/";
      }
      
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Login failed'
      };
    }
  } catch (error) {
    console.error('Admin login error:', error.message);
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: error.response.data?.error || 'Invalid admin credentials'
      };
    }
    
    if (error.code === 'ECONNABORTED') {
      return {
        success: false,
        error: 'Request timeout - backend may not be running'
      };
    }

    return {
      success: false,
      error: error.message || 'Login failed. Please try again.'
    };
  }
}

/**
 * Get all admin orders
 */
export async function getAdminOrders() {
  try {
    const response = await apiClient.get('/api/orders/admin/all');
    return {
      success: true,
      data: response.data.data || response.data.orders || []
    };
  } catch (error) {
    console.error('Error fetching orders:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get all admin custom requests
 */
export async function getAdminCustomRequests() {
  try {
    const response = await apiClient.get('/api/custom-requests/admin/all');
    return {
      success: true,
      data: response.data.data || response.data.customRequests || []
    };
  } catch (error) {
    console.error('Error fetching custom requests:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get all admin contact enquiries
 */
export async function getAdminContactEnquiries() {
  try {
    const response = await apiClient.get('/api/contact/admin/all');
    return {
      success: true,
      data: response.data.data || response.data.contacts || []
    };
  } catch (error) {
    console.error('Error fetching contact enquiries:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get all products
 */
export async function getProducts(limit = null) {
  try {
    let url = '/api/products';
    if (limit) {
      url += `?limit=${limit}`;
    }
    const response = await apiClient.get(url);
    return {
      success: true,
      data: response.data.data || response.data.products || []
    };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get all admin users
 */
export async function getAdminUsers() {
  try {
    const response = await apiClient.get('/api/auth/admin/users');
    return {
      success: true,
      data: response.data.data || response.data.users || []
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get all categories
 */
export async function getCategories() {
  try {
    const response = await apiClient.get('/api/categories');
    return {
      success: true,
      data: response.data.data || response.data.categories || []
    };
  } catch (error) {
    console.error('Error fetching categories:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Create a new product
 */
export async function createProduct(formData) {
  try {
    const response = await apiClient.post('/api/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error creating product:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update a product
 */
export async function updateProduct(id, formData) {
  try {
    const response = await apiClient.put(`/api/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error updating product:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete a product
 */
export async function deleteProduct(id) {
  try {
    const response = await apiClient.delete(`/api/products/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error deleting product:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Get a product by ID
 */
export async function getProductById(id) {
  try {
    const response = await apiClient.get(`/api/products/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Bulk edit multiple products
 */
export async function bulkEditProducts(productIds, updateFields) {
  try {
    if (!Array.isArray(productIds) || productIds.length === 0) {
      return {
        success: false,
        error: 'productIds must be a non-empty array',
        data: null
      };
    }

    if (typeof updateFields !== 'object' || updateFields === null || Object.keys(updateFields).length === 0) {
      return {
        success: false,
        error: 'updateFields must be a non-empty object',
        data: null
      };
    }

    const response = await apiClient.post('/api/products/bulk-edit', {
      productIds,
      updateFields
    });

    return {
      success: response.data.success,
      data: response.data.data,
      message: response.data.message,
      updatedCount: response.data.data?.updatedCount || 0
    };
  } catch (error) {
    console.error('Error in bulk edit:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

// Export apiClient as both default and named export
export { apiClient as api };
export default apiClient;
