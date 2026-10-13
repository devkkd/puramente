/**
 * Redux Slice for Bulk Product Operations
 * 
 * Manages state for:
 * - Selected products
 * - Bulk edit fields
 * - Operation status and results
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Async thunk: Fetch products with filters for bulk edit
 */
export const fetchProductsForBulkEdit = createAsyncThunk(
  'bulkProduct/fetchProducts',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams();

      if (filters.search) {
        queryParams.append('search', filters.search);
      }
      if (filters.category) {
        queryParams.append('category', filters.category);
      }
      if (filters.bestSeller) {
        queryParams.append('bestSeller', 'true');
      }
      if (filters.newArrival) {
        queryParams.append('newArrival', 'true');
      }

      const response = await fetch(
        `/api/products/list?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.error || `Failed to fetch products: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        return data.data || [];
      } else {
        return rejectWithValue(data.error || 'Failed to fetch products');
      }

    } catch (error) {
      console.error('Error fetching products:', error);
      return rejectWithValue(error.message || 'Network error while fetching products');
    }
  }
);

/**
 * Async thunk: Submit bulk edit request to backend
 */
export const submitBulkEdit = createAsyncThunk(
  'bulkProduct/submitEdit',
  async ({ productIds, updateFields }, { rejectWithValue }) => {
    try {
      // Ensure productIds is an array
      const idsArray = Array.isArray(productIds)
        ? productIds
        : Array.from(productIds); // Convert Set to Array if needed

      const response = await fetch('/api/products/bulk-edit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify({
          productIds: idsArray,
          updateFields
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          errorData.error || `Failed to submit bulk edit: ${response.statusText}`
        );
      }

      const data = await response.json();

      if (data.success) {
        return {
          success: true,
          message: data.message,
          updatedCount: data.data.updatedCount,
          failedIds: data.data.failedIds || [],
          errors: data.data.errors || [],
          updatedProducts: data.data.updatedProducts || []
        };
      } else {
        return rejectWithValue(data.error || 'Bulk edit operation failed');
      }

    } catch (error) {
      console.error('Error submitting bulk edit:', error);
      return rejectWithValue(error.message || 'Network error while submitting bulk edit');
    }
  }
);

/**
 * Redux Slice Definition
 */
const bulkProductSlice = createSlice({
  name: 'bulkProduct',
  initialState: {
    // Selection state
    selectedProductIds: new Set(),
    allProducts: [],
    filteredProducts: [],

    // Bulk edit fields
    bulkEditFields: {
      productName: '',
      description: '',
      category: '',
      bestSeller: false,
      newArrival: false,
      seo: {
        metaTitle: '',
        metaDescription: '',
        metaKeywords: []
      }
    },

    // Operation status
    operationLoading: false,
    operationResult: null,
    operationError: null,

    // Fetch state
    fetchLoading: false,
    fetchError: null
  },

  reducers: {
    // Selection Actions
    setSelectedProducts: (state, action) => {
      const ids = action.payload;
      if (Array.isArray(ids)) {
        state.selectedProductIds = new Set(ids);
      } else if (ids instanceof Set) {
        state.selectedProductIds = ids;
      } else {
        state.selectedProductIds = new Set();
      }
    },

    toggleProductSelection: (state, action) => {
      const productId = action.payload;
      if (state.selectedProductIds.has(productId)) {
        state.selectedProductIds.delete(productId);
      } else {
        state.selectedProductIds.add(productId);
      }
    },

    setAllProductsSelected: (state, action) => {
      const productIds = action.payload;
      if (Array.isArray(productIds)) {
        state.selectedProductIds = new Set(productIds);
      }
    },

    clearSelection: (state) => {
      state.selectedProductIds = new Set();
    },

    // Bulk Edit Fields Actions
    setBulkEditFields: (state, action) => {
      state.bulkEditFields = action.payload;
    },

    updateBulkEditField: (state, action) => {
      const { field, value } = action.payload;
      state.bulkEditFields[field] = value;
    },

    updateBulkEditSeoField: (state, action) => {
      const { field, value } = action.payload;
      state.bulkEditFields.seo[field] = value;
    },

    clearBulkEditFields: (state) => {
      state.bulkEditFields = {
        productName: '',
        description: '',
        category: '',
        bestSeller: false,
        newArrival: false,
        seo: {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: []
        }
      };
    },

    // Operation Actions
    clearOperationResult: (state) => {
      state.operationResult = null;
      state.operationError = null;
    },

    // Product List Actions
    setAllProducts: (state, action) => {
      state.allProducts = action.payload;
    },

    setFilteredProducts: (state, action) => {
      state.filteredProducts = action.payload;
    }
  },

  extraReducers: (builder) => {
    // Fetch Products
    builder
      .addCase(fetchProductsForBulkEdit.pending, (state) => {
        state.fetchLoading = true;
        state.fetchError = null;
      })
      .addCase(fetchProductsForBulkEdit.fulfilled, (state, action) => {
        state.fetchLoading = false;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProductsForBulkEdit.rejected, (state, action) => {
        state.fetchLoading = false;
        state.fetchError = action.payload;
      });

    // Submit Bulk Edit
    builder
      .addCase(submitBulkEdit.pending, (state) => {
        state.operationLoading = true;
        state.operationError = null;
      })
      .addCase(submitBulkEdit.fulfilled, (state, action) => {
        state.operationLoading = false;
        state.operationResult = action.payload;

        // Clear selection and fields after successful operation
        if (action.payload.success) {
          state.selectedProductIds = new Set();
          state.bulkEditFields = {
            productName: '',
            description: '',
            category: '',
            bestSeller: false,
            newArrival: false,
            seo: {
              metaTitle: '',
              metaDescription: '',
              metaKeywords: []
            }
          };
        }
      })
      .addCase(submitBulkEdit.rejected, (state, action) => {
        state.operationLoading = false;
        state.operationError = action.payload;
        state.operationResult = {
          success: false,
          error: action.payload
        };
      });
  }
});

// Export actions
export const {
  setSelectedProducts,
  toggleProductSelection,
  setAllProductsSelected,
  clearSelection,
  setBulkEditFields,
  updateBulkEditField,
  updateBulkEditSeoField,
  clearBulkEditFields,
  clearOperationResult,
  setAllProducts,
  setFilteredProducts
} = bulkProductSlice.actions;

// Selectors
export const selectSelectedProductIds = (state) => state.bulkProduct.selectedProductIds;
export const selectSelectedCount = (state) => state.bulkProduct.selectedProductIds.size;
export const selectBulkEditFields = (state) => state.bulkProduct.bulkEditFields;
export const selectOperationStatus = (state) => ({
  loading: state.bulkProduct.operationLoading,
  result: state.bulkProduct.operationResult,
  error: state.bulkProduct.operationError
});
export const selectFetchStatus = (state) => ({
  loading: state.bulkProduct.fetchLoading,
  error: state.bulkProduct.fetchError,
  products: state.bulkProduct.filteredProducts
});
export const selectFilteredProducts = (state) => state.bulkProduct.filteredProducts;
export const selectAllProducts = (state) => state.bulkProduct.allProducts;

// Export reducer as default
export default bulkProductSlice.reducer;
