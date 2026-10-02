import axios from 'axios';

// Write operations (create/update/delete) → local backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
// Read operations (products/categories/blogs) → production (has real data)
const PROD_URL = process.env.NEXT_PUBLIC_PROD_API_URL || 'https://puramentejewel.com/api';

export const api = axios.create({ baseURL: API_URL });
export const prodApi = axios.create({ baseURL: PROD_URL });

// Auth token interceptor for local api
api.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken") || localStorage.getItem("token");
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Auth token interceptor for prodApi (admin reads need auth too)
prodApi.interceptors.request.use(
    (config) => {
        if (typeof window !== "undefined") {
            const token = localStorage.getItem("adminToken") || localStorage.getItem("userToken") || localStorage.getItem("token");
            if (token) config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        console.error("API Error:", error.response?.data || error.message);
        return Promise.reject(error.response?.data || { error: "Server error" });
    }
);

prodApi.interceptors.response.use(
    (response) => response.data,
    (error) => Promise.reject(error.response?.data || { error: "Server error" })
);

// --- Products & Categories ---
// READ → production (real data), WRITE → local backend
export const getCategories = () => prodApi.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const getCategoryById = (id) => prodApi.get(`/categories/${id}`);
export const updateCategory = (id, data) => prodApi.put(`/categories/${id}`, data);
export const updateCategorySeo = (id, seoData) => prodApi.put(`/categories/${id}/seo`, seoData);

export const getProducts = () => prodApi.get('/products');
export const getProductById = (id) => prodApi.get(`/products/${id}`);
export const getProductBySlug = (slug) => prodApi.get(`/products/slug/${slug}`);
export const createProduct = (data) => api.post('/products', data);
export const updateProduct = (id, data) => prodApi.put(`/products/${id}`, data);
export const updateProductSeo = (id, seoData) => prodApi.put(`/products/${id}/seo`, seoData);
export const bulkUploadProducts = (data) => api.post('/products/bulk-upload', data);

// --- Cart ---
export const getCart = (data) => prodApi.post('/cart/view', data);
export const addToCart = (data) => prodApi.post('/cart/add', data);
export const updateCartItem = (data) => prodApi.put('/cart/update', data);
export const removeFromCart = (data) => prodApi.post('/cart/remove', data);

// --- Auth ---
export const registerUser = (data) => prodApi.post('/auth/register', data);
export const loginUser = (data) => prodApi.post('/auth/login', data);
export const getAdminUserCart = (id) => api.get(`/auth/admin/users/${id}/cart`);
export const loginAdminUser = (data) => prodApi.post('/auth/admin-login', data);
export const forgotPassword = (data) => prodApi.post('/auth/forgot-password', data);
export const resetPassword = (token, data) => prodApi.put(`/auth/reset-password/${token}`, data);

// --- User Profile ---
export const getUserProfile = (id) => api.get(`/auth/me/${id}`);

// --- Orders ---
export const submitOrderRequest = (data) => prodApi.post('/orders/submit', data);

// --- ADMIN ROUTES (all on local backend) ---
export const getAdminOrders = () => api.get('/orders/admin/all');
export const getAdminOrderById = (id) => api.get(`/orders/admin/${id}`);
export const updateOrderStatus = (id, status) => api.put(`/orders/admin/${id}/status`, { status });
export const deleteAdminOrder = (id) => prodApi.delete(`/orders/admin/${id}`);
export const getAdminUsers = () => api.get('/auth/admin/users');

// --- Custom Requests ---
export const submitCustomRequest = (formData) => prodApi.post('/custom-requests/submit', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const getAdminCustomRequests = () => api.get('/custom-requests/admin/all');
export const updateCustomRequestStatus = (id, status) => api.put(`/custom-requests/admin/${id}/status`, { status });
export const deleteAdminCustomRequest = (id) => api.delete(`/custom-requests/admin/${id}`);

// --- Contact Enquiries ---
export const submitContactEnquiry = (data) => prodApi.post('/contact/submit', data);
export const getAdminContactEnquiries = () => api.get('/contact/admin/all');
export const updateContactEnquiryStatus = (id, status) => api.put(`/contact/admin/${id}/status`, { status });
export const deleteAdminContactEnquiry = (id) => api.delete(`/contact/admin/${id}`);

// --- Blogs ---
export const getBlogs = () => prodApi.get('/blogs');
export const getBlogBySlug = (slug) => prodApi.get(`/blogs/slug/${slug}`);
export const getBlogById = (id) => prodApi.get(`/blogs/${id}`);
export const createBlog = (data) => api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateBlog = (id, data) => api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteBlog = (id) => api.delete(`/blogs/${id}`);

// --- Insta Posts ---
export const getInstaPosts = () => prodApi.get('/insta');
export const addInstaPost = (data) => api.post('/insta', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteInstaPost = (id) => api.delete(`/insta/${id}`);