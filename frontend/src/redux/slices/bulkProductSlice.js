import { createSlice } from "@reduxjs/toolkit";

const bulkProductSlice = createSlice({
  name: "bulkProduct",
  initialState: {
    selectedProductIds: [],
    bulkEditFields: {
      productName: "",
      description: "",
      category: "",
      bestSeller: false,
      newArrival: false,
      seo: {
        metaTitle: "",
        metaDescription: "",
        metaKeywords: [],
      },
    },
    operationLoading: false,
    operationResult: null,
    operationError: null,
  },
  reducers: {
    setSelectedProducts: (state, action) => {
      state.selectedProductIds = action.payload;
    },
    toggleProductSelection: (state, action) => {
      const id = action.payload;
      const index = state.selectedProductIds.indexOf(id);
      if (index > -1) {
        state.selectedProductIds.splice(index, 1);
      } else {
        state.selectedProductIds.push(id);
      }
    },
    clearSelection: (state) => {
      state.selectedProductIds = [];
    },
    setBulkEditFields: (state, action) => {
      state.bulkEditFields = action.payload;
    },
    setOperationLoading: (state, action) => {
      state.operationLoading = action.payload;
    },
    setOperationResult: (state, action) => {
      state.operationResult = action.payload;
    },
  },
});

export const {
  setSelectedProducts,
  toggleProductSelection,
  clearSelection,
  setBulkEditFields,
  setOperationLoading,
  setOperationResult,
} = bulkProductSlice.actions;

export default bulkProductSlice.reducer;