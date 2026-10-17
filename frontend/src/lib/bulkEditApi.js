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
    config.headers.Authorization = "Bearer " + token;
  }
  return config;
});

export async function fetchCategories() {
  try {
    const response = await apiClient.get("/api/categories");
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
    console.log("Fetching products for category:", categoryId);
    const response = await apiClient.get("/api/products?category=" + categoryId);
    const products = response.data.data || [];
    console.log("Received " + products.length + " products for category " + categoryId);
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
    const products = response.data.data || [];
    console.log("Received " + products.length + " total products");
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
        console.log("BULK_EDIT_API: Submitting bulk changes");
    console.log("BULK_EDIT_API: Total products to update:", payload.products.length);
    
    // Log each product's updates
    payload.products.forEach((item, idx) => {
      console.log("BULK_EDIT_API: Product " + idx + " ID:", item._id);
      console.log("BULK_EDIT_API: Product " + idx + " updates:", Object.keys(item.updates));
      console.log("BULK_EDIT_API: Product " + idx + " full data:", item.updates);
    });
    
    console.log("BULK_EDIT_API: Full payload =", JSON.stringify(payload, null, 2));
    
    const response = await apiClient.post("/api/products/bulk-edit", payload);
    
    console.log("BULK_EDIT_API: Response received =", response.data);
    
    return {
      success: response.data.success,
      data: response.data.data,
      error: response.data.error,
    };
  } catch (error) {
    console.error("BULK_EDIT_API: Error caught =", error);
    console.error("BULK_EDIT_API: Error response =", error.response?.data);
    
    return {
      success: false,
      error: error.response?.data?.error || error.message,
    };
  }
}

export default apiClient;

