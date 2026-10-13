import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as bulkEditApi from "@/lib/bulkEditApi";

export const fetchCategoriesForModal = createAsyncThunk(
  "excelBulkEdit/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const result = await bulkEditApi.fetchCategories();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "excelBulkEdit/fetchProducts",
  async (categoryId, { rejectWithValue }) => {
    try {
      const result = await bulkEditApi.fetchProductsByCategory(categoryId);
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch products");
    }
  }
);

export const fetchAllProducts = createAsyncThunk(
  "excelBulkEdit/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const result = await bulkEditApi.fetchAllProducts();
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to fetch all products");
    }
  }
);

export const submitBulkChanges = createAsyncThunk(
  "excelBulkEdit/submitChanges",
  async (payload, { rejectWithValue }) => {
    try {
      const result = await bulkEditApi.submitBulkChanges(payload);
      if (!result.success) throw new Error(result.error);
      return result.data;
    } catch (error) {
      return rejectWithValue(error.message || "Failed to submit changes");
    }
  }
);

const initialState = {
  isOpen: false,
  selectedCategory: null,
  categories: [],
  categoriesLoading: false,
  categoriesError: null,
  products: [],
  productsLoading: false,
  productsError: null,
  changes: {},
  originalValues: {},
  editingCell: null,
  selectedProductIds: [],
  globalSelectedProductIds: [],
  validationErrors: {},
  saveLoading: false,
  saveError: null,
  saveResult: null,
  excelExportLoading: false,
  excelExportError: null,
};

const excelBulkEditSlice = createSlice({
  name: "excelBulkEdit",
  initialState,
  reducers: {
    setModalOpen: (state, action) => {
      state.isOpen = action.payload;
    },
    resetModalState: (state) => {
      return initialState;
    },
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.products = [];
      state.changes = {};
      state.selectedProductIds = [];
    },
    recordCellEdit: (state, action) => {
      const { productId, fieldName, newValue } = action.payload;
      if (!state.changes[productId]) state.changes[productId] = {};
      state.changes[productId][fieldName] = newValue;
    },
    revertAllChanges: (state) => {
      state.changes = {};
    },
    toggleProductSelection: (state, action) => {
      const productId = action.payload;
      const index = state.selectedProductIds.indexOf(productId);
      if (index > -1) {
        state.selectedProductIds.splice(index, 1);
      } else {
        state.selectedProductIds.push(productId);
      }
    },
    setSelectedProducts: (state, action) => {
      state.selectedProductIds = action.payload;
    },
    setGlobalSelectedProducts: (state, action) => {
      state.globalSelectedProductIds = action.payload;
    },
    toggleSelectAll: (state, action) => {
      const productIds = action.payload;
      if (productIds.length === state.selectedProductIds.length) {
        state.selectedProductIds = [];
      } else {
        state.selectedProductIds = productIds;
      }
    },
    clearSelection: (state) => {
      state.selectedProductIds = [];
    },
    setEditingCell: (state, action) => {
      state.editingCell = action.payload;
    },
    clearEditingCell: (state) => {
      state.editingCell = null;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    },
    clearValidationErrors: (state) => {
      state.validationErrors = {};
    },
    setSaveError: (state, action) => {
      state.saveError = action.payload;
    },
    clearSaveResult: (state) => {
      state.saveResult = null;
      state.saveError = null;
    },
    setExcelExportError: (state, action) => {
      state.excelExportError = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder
      .addCase(fetchCategoriesForModal.pending, (state) => {
        state.categoriesLoading = true;
        state.categoriesError = null;
      })
      .addCase(fetchCategoriesForModal.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategoriesForModal.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.categoriesError = action.payload;
      });

    // Fetch products
    builder
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
        state.originalValues = {};
        action.payload.forEach((p) => {
          state.originalValues[p._id] = JSON.parse(JSON.stringify(p));
        });
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      });

    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsLoading = true;
        state.productsError = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.productsLoading = false;
        state.products = action.payload;
        state.originalValues = {};
        action.payload.forEach((p) => {
          state.originalValues[p._id] = JSON.parse(JSON.stringify(p));
        });
        state.globalSelectedProductIds = action.payload.map((p) => p._id);
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.productsLoading = false;
        state.productsError = action.payload;
      });

    // Submit bulk changes
    builder
      .addCase(submitBulkChanges.pending, (state) => {
        state.saveLoading = true;
        state.saveError = null;
      })
      .addCase(submitBulkChanges.fulfilled, (state, action) => {
        state.saveLoading = false;
        state.saveResult = action.payload;
        state.changes = {};
        state.selectedProductIds = [];
      })
      .addCase(submitBulkChanges.rejected, (state, action) => {
        state.saveLoading = false;
        state.saveError = action.payload;
      });
  },
});

export const {
  setModalOpen,
  resetModalState,
  setSelectedCategory,
  recordCellEdit,
  revertAllChanges,
  toggleProductSelection,
  setSelectedProducts,
  setGlobalSelectedProducts,
  toggleSelectAll,
  clearSelection,
  setEditingCell,
  clearEditingCell,
  setValidationErrors,
  clearValidationErrors,
  setSaveError,
  clearSaveResult,
  setExcelExportError,
} = excelBulkEditSlice.actions;

export default excelBulkEditSlice.reducer;

