import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001",
  timeout: 30000,
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("adminToken") || localStorage.getItem("token")
      : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function fetchCategories() {
  try {
    const response = await apiClient.get("/api/categories");
    // Backend returns { success, count, data }
    return {
      success: true,
      data: response.data.data || [],
    };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export async function fetchProductsByCategory(categoryId) {
  try {
    console.log(`Fetching products for category: ${categoryId}`);
    const response = await apiClient.get(`/api/products?category=${categoryId}`);
    // Backend returns { success, count, data }
    const products = response.data.data || [];
    console.log(`Received ${products.length} products for category ${categoryId}`);
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export async function fetchAllProducts() {
  try {
    console.log("Fetching all products");
    const response = await apiClient.get("/api/products");
    // Backend returns { success, count, data }
    const products = response.data.data || [];
    console.log(`Received ${products.length} total products`);
    return {
      success: true,
      data: products,
    };
  } catch (error) {
    console.error("Error fetching all products:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export async function submitBulkChanges(payload) {
  try {
    const response = await apiClient.post("/api/products/bulk-edit", payload);
    return {
      success: response.data.success,
      data: response.data.data,
      error: response.data.error,
    };
  } catch (error) {
    console.error("Error submitting bulk changes:", error);
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export default apiClient;
