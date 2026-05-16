import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_URL });

// --- NEW: Request Interceptor for Authentication ---
// This automatically injects the JWT token into every API request
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            // Prioritize the adminToken if it exists, otherwise fall back to the userToken
            const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken") || localStorage.getItem("token");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || { error: "Server error" });
    }
);

// --- Products & Categories ---
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const getCategoryById = (id) => api.get(`/categories/${id}`);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);

export const getProducts = () => api.get('/products');
export const getProductById = (id) => api.get(`/products/${id}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => api.put(`/products/${id}`, data);
export const bulkUploadProducts = (data) => api.post('/products/bulk-upload', data);

// --- Cart ---
export const getCart = (data) => api.post('/cart/view', data);
export const addToCart = (data) => api.post('/cart/add', data);
export const updateCartItem = (data) => api.put('/cart/update', data);
export const removeFromCart = (data) => api.post('/cart/remove', data);

// --- Auth ---
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);
export const getAdminUserCart = (id) => api.get(`/auth/admin/users/${id}/cart`);
export const loginAdminUser = (data) => api.post('/auth/admin-login', data); // Admin login
// --- NEW: Password Reset ---
export const forgotPassword = (data) => api.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => api.put(`/auth/reset-password/${token}`, data);

// --- User Profile ---
export const getUserProfile = (id) => api.get(`/auth/me/${id}`);

// --- Orders ---
export const submitOrderRequest = (data) => api.post('/orders/submit', data);

// --- ADMIN ROUTES ---
export const getAdminOrders = () => api.get('/orders/admin/all');
export const getAdminOrderById = (id) => api.get(`/orders/admin/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/admin/${id}/status`, { status });
export const getAdminUsers = () => api.get('/auth/admin/users');

// --- Custom Requests ---
export const submitCustomRequest = (formData) => api.post('/custom-requests/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAdminCustomRequests = () => api.get('/custom-requests/admin/all');
export const updateCustomRequestStatus = (id, status) => api.put(`/custom-requests/admin/${id}/status`, { status });

// --- Contact Enquiries ---
export const submitContactEnquiry = (data) => api.post('/contact/submit', data);
export const getAdminContactEnquiries = () => api.get('/contact/admin/all');
export const updateContactEnquiryStatus = (id, status) => api.put(`/contact/admin/${id}/status`, { status });

// --- Blogs ---
export const getBlogs = () => api.get('/blogs');
export const getBlogBySlug = (slug) => api.get(`/blogs/slug/${slug}`);
export const getBlogById = (id) => api.get(`/blogs/${id}`); 
export const createBlog = (data) => api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }); 
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);