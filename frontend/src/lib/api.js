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
 * Register a new user
 */
export async function registerUser(userData) {
  try {
    const response = await apiClient.post('/api/auth/register', userData);
    
    if (response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userToken', response.data.data.token);
        localStorage.setItem('userId', response.data.data._id);
      }
      return {
        success: true,
        data: response.data.data
      };
    } else {
      return {
        success: false,
        error: response.data.error || 'Registration failed'
      };
    }
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.response?.status === 400) {
      return {
        success: false,
        error: error.response.data?.error || 'Registration failed - email may already be registered'
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
      error: error.message || 'Registration failed. Please try again.'
    };
  }
}

/**
 * Login a user
 */
export async function loginUser(credentials) {
  try {
    const { email, password } = credentials;

    if (!email || !password) {
      return {
        success: false,
        error: 'Email and password are required'
      };
    }

    const response = await apiClient.post('/api/auth/login', {
      email: email.toLowerCase().trim(),
      password
    });

    if (response.data.success) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('userToken', response.data.data.token);
        localStorage.setItem('userId', response.data.data._id);
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
    console.error('Login error:', error.message);
    
    if (error.response?.status === 401) {
      return {
        success: false,
        error: error.response.data?.error || 'Invalid email or password'
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
 * Forgot password - send reset link
 */
export async function forgotPassword(payload) {
  try {
    const response = await apiClient.post('/api/auth/forgot-password', payload);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error sending reset link:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Reset password with token
 */
export async function resetPassword(token, payload) {
  try {
    const response = await apiClient.put(`/api/auth/reset-password/${token}`, payload);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error resetting password:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
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

/**
 * Update custom request status (admin)
 */
export async function updateCustomRequestStatus(id, status) {
  try {
    const response = await apiClient.put(`/api/custom-requests/admin/${id}/status`, { status });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Error updating custom request status:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete custom request (admin)
 */
export async function deleteAdminCustomRequest(id) {
  try {
    const response = await apiClient.delete(`/api/custom-requests/admin/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error("Error deleting custom request:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}


/**
 * Get admin order by ID
 */
export async function getAdminOrderById(id) {
  try {
    const response = await apiClient.get(`/api/orders/admin/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching order:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update order status (admin)
 */
export async function updateOrderStatus(id, status) {
  try {
    const response = await apiClient.put(`/api/orders/admin/${id}/status`, { status });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating order status:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete admin order
 */
export async function deleteAdminOrder(id) {
  try {
    const response = await apiClient.delete(`/api/orders/admin/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error deleting order:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}


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

/**
 * Create a new category
 */
export async function createCategory(formData) {
  try {
    const response = await apiClient.post('/api/categories', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error creating category:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Get category by ID
 */
export async function getCategoryById(id) {
  try {
    const response = await apiClient.get(`/api/categories/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update category
 */
export async function updateCategory(id, formData) {
  try {
    const response = await apiClient.put(`/api/categories/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating category:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update category SEO
 */
export async function updateCategorySeo(id, seoData) {
  try {
    const response = await apiClient.put(`/api/categories/${id}/seo`, seoData);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating category SEO:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete category
 */
export async function deleteCategory(id) {
  try {
    const response = await apiClient.delete(`/api/categories/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error deleting category:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}



/**
 * Get blog by ID
 */
export async function getBlogById(id) {
  try {
    const response = await apiClient.get(`/api/blog/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Bulk upload products (Excel import)
 */
export async function bulkUploadProducts(formData) {
  try {
    const response = await apiClient.post('/api/products/bulk-upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error bulk uploading products:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}



/**
 * Submit contact enquiry
 */
export async function submitContactEnquiry(data) {
  try {
    const response = await apiClient.post('/api/contact/submit', data);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error submitting contact enquiry:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update contact enquiry status (admin)
 */
export async function updateContactEnquiryStatus(id, status) {
  try {
    const response = await apiClient.put(`/api/contact/admin/${id}/status`, { status });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating contact status:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete contact enquiry (admin)
 */
export async function deleteAdminContactEnquiry(id) {
  try {
    const response = await apiClient.delete(`/api/contact/admin/${id}`);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error deleting contact enquiry:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Submit custom request
 */
export async function submitCustomRequest(data) {
  try {
    const response = await apiClient.post('/api/custom-requests/submit', data, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error submitting custom request:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update custom request status (admin)
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

/**
 * Get all blogs (public)
 */
export async function getBlogs() {
  try {
    const response = await apiClient.get('/api/blogs');
    return {
      success: true,
      data: response.data.data || response.data.blogs || []
    };
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Get a blog by slug (public)
 */
export async function getBlogBySlug(slug) {
  try {
    const response = await apiClient.get(`/api/blogs/slug/${slug}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Create a new blog (admin)
 */
export async function createBlog(formData) {
  try {
    const response = await apiClient.post('/api/blogs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error creating blog:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update a blog (admin)
 */
export async function updateBlog(id, formData) {
  try {
    const response = await apiClient.put(`/api/blogs/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error updating blog:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete a blog (admin)
 */
export async function deleteBlog(id) {
  try {
    const response = await apiClient.delete(`/api/blogs/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error deleting blog:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Get all insta posts (public)
 */
export async function getInstaPosts() {
  try {
    const response = await apiClient.get('/api/insta');
    return {
      success: true,
      data: response.data.data || response.data.posts || []
    };
  } catch (error) {
    console.error('Error fetching insta posts:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: []
    };
  }
}

/**
 * Add an insta post (admin)
 */
export async function addInstaPost(formData) {
  try {
    const response = await apiClient.post('/api/insta', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error adding insta post:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Delete an insta post (admin)
 */
export async function deleteInstaPost(id) {
  try {
    const response = await apiClient.delete(`/api/insta/${id}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error deleting insta post:', error);
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










/**
 * Get user profile by ID
 */
export async function getUserProfile(userId) {
  try {
    const response = await apiClient.get(`/api/auth/me/${userId}`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Get user's active cart (Admin)
 */
export async function getAdminUserCart(userId) {
  try {
    const response = await apiClient.get(`/api/auth/admin/users/${userId}/cart`);
    return {
      success: true,
      data: response.data.data
    };
  } catch (error) {
    console.error('Error fetching user cart:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}



/**
 * Get user's cart
 */
export async function getCart(params) {
  try {
    const response = await apiClient.post('/api/cart/view', params);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error fetching cart:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Add item to cart
 */
export async function addToCart(params) {
  try {
    const response = await apiClient.post('/api/cart/add', params);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error adding to cart:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Update cart item
 */
export async function updateCartItem(params) {
  try {
    const response = await apiClient.put('/api/cart/update', params);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error updating cart:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(params) {
  try {
    const response = await apiClient.post('/api/cart/remove', params);
    return {
      success: true,
      data: response.data.data || response.data
    };
  } catch (error) {
    console.error('Error removing from cart:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}




/**
 * Submit order/price request
 */
export async function submitOrderRequest(payload) {
  try {
    const response = await apiClient.post('/api/orders/submit', payload);
    return {
      success: true,
      data: response.data.data || response.data,
      message: response.data.message
    };
  } catch (error) {
    console.error('Error submitting order request:', error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
      data: null
    };
  }
}


