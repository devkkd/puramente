'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';

/**
 * BulkProductContext
 * 
 * Manages state for bulk product editing operations.
 * This is a context-based implementation that can be easily migrated to Redux.
 * 
 * State Structure:
 * {
 *   selectedProductIds: Set<string>,
 *   bulkEditFields: {
 *     productName: string,
 *     description: string,
 *     category: string,
 *     bestSeller: boolean,
 *     newArrival: boolean,
 *     seo: { metaTitle, metaDescription, metaKeywords }
 *   },
 *   operationLoading: boolean,
 *   operationResult: {
 *     success: boolean,
 *     message: string,
 *     data: { updatedCount, failedIds, updatedProducts },
 *     errors: string[]
 *   } | null
 * }
 */

// Action Types (compatible with Redux actions)
export const ACTIONS = {
  // Selection actions
  SET_SELECTED_PRODUCTS: 'SET_SELECTED_PRODUCTS',
  TOGGLE_PRODUCT_SELECTION: 'TOGGLE_PRODUCT_SELECTION',
  SET_ALL_PRODUCTS_SELECTED: 'SET_ALL_PRODUCTS_SELECTED',
  CLEAR_SELECTION: 'CLEAR_SELECTION',

  // Bulk edit fields actions
  SET_BULK_EDIT_FIELDS: 'SET_BULK_EDIT_FIELDS',
  UPDATE_BULK_EDIT_FIELD: 'UPDATE_BULK_EDIT_FIELD',
  CLEAR_BULK_EDIT_FIELDS: 'CLEAR_BULK_EDIT_FIELDS',

  // Operation status actions
  SET_OPERATION_LOADING: 'SET_OPERATION_LOADING',
  SET_OPERATION_RESULT: 'SET_OPERATION_RESULT',
  CLEAR_OPERATION_RESULT: 'CLEAR_OPERATION_RESULT',
};

// Initial State
const initialState = {
  selectedProductIds: new Set(),
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
  operationLoading: false,
  operationResult: null
};

// Reducer function
function bulkProductReducer(state, action) {
  switch (action.type) {
    // Selection Actions
    case ACTIONS.SET_SELECTED_PRODUCTS: {
      const ids = Array.isArray(action.payload)
        ? new Set(action.payload)
        : action.payload;
      return {
        ...state,
        selectedProductIds: ids
      };
    }

    case ACTIONS.TOGGLE_PRODUCT_SELECTION: {
      const newSelected = new Set(state.selectedProductIds);
      if (newSelected.has(action.payload)) {
        newSelected.delete(action.payload);
      } else {
        newSelected.add(action.payload);
      }
      return {
        ...state,
        selectedProductIds: newSelected
      };
    }

    case ACTIONS.SET_ALL_PRODUCTS_SELECTED: {
      const newSelected = new Set();
      if (action.payload && Array.isArray(action.payload)) {
        action.payload.forEach(id => newSelected.add(id));
      }
      return {
        ...state,
        selectedProductIds: newSelected
      };
    }

    case ACTIONS.CLEAR_SELECTION: {
      return {
        ...state,
        selectedProductIds: new Set()
      };
    }

    // Bulk Edit Fields Actions
    case ACTIONS.SET_BULK_EDIT_FIELDS: {
      return {
        ...state,
        bulkEditFields: action.payload
      };
    }

    case ACTIONS.UPDATE_BULK_EDIT_FIELD: {
      const { field, value } = action.payload;
      return {
        ...state,
        bulkEditFields: {
          ...state.bulkEditFields,
          [field]: value
        }
      };
    }

    case ACTIONS.CLEAR_BULK_EDIT_FIELDS: {
      return {
        ...state,
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
        }
      };
    }

    // Operation Status Actions
    case ACTIONS.SET_OPERATION_LOADING: {
      return {
        ...state,
        operationLoading: action.payload
      };
    }

    case ACTIONS.SET_OPERATION_RESULT: {
      return {
        ...state,
        operationResult: action.payload,
        operationLoading: false
      };
    }

    case ACTIONS.CLEAR_OPERATION_RESULT: {
      return {
        ...state,
        operationResult: null
      };
    }

    default:
      return state;
  }
}

// Create context
const BulkProductContext = createContext();

/**
 * BulkProductProvider Component
 * 
 * Wraps the application to provide bulk product state management
 */
export function BulkProductProvider({ children }) {
  const [state, dispatch] = useReducer(bulkProductReducer, initialState);

  // Action creators (these match Redux thunk interface)
  const actions = {
    // Selection
    setSelectedProducts: useCallback((ids) => {
      dispatch({ type: ACTIONS.SET_SELECTED_PRODUCTS, payload: ids });
    }, []),

    toggleProductSelection: useCallback((productId) => {
      dispatch({ type: ACTIONS.TOGGLE_PRODUCT_SELECTION, payload: productId });
    }, []),

    setAllProductsSelected: useCallback((productIds) => {
      dispatch({ type: ACTIONS.SET_ALL_PRODUCTS_SELECTED, payload: productIds });
    }, []),

    clearSelection: useCallback(() => {
      dispatch({ type: ACTIONS.CLEAR_SELECTION });
    }, []),

    // Bulk Edit Fields
    setBulkEditFields: useCallback((fields) => {
      dispatch({ type: ACTIONS.SET_BULK_EDIT_FIELDS, payload: fields });
    }, []),

    updateBulkEditField: useCallback((field, value) => {
      dispatch({
        type: ACTIONS.UPDATE_BULK_EDIT_FIELD,
        payload: { field, value }
      });
    }, []),

    clearBulkEditFields: useCallback(() => {
      dispatch({ type: ACTIONS.CLEAR_BULK_EDIT_FIELDS });
    }, []),

    // Operation
    setOperationLoading: useCallback((isLoading) => {
      dispatch({ type: ACTIONS.SET_OPERATION_LOADING, payload: isLoading });
    }, []),

    setOperationResult: useCallback((result) => {
      dispatch({ type: ACTIONS.SET_OPERATION_RESULT, payload: result });
    }, []),

    clearOperationResult: useCallback(() => {
      dispatch({ type: ACTIONS.CLEAR_OPERATION_RESULT });
    }, []),
  };

  // Selectors (these match Redux selector interface)
  const selectors = {
    selectSelectedProductIds: () => state.selectedProductIds,
    selectSelectedCount: () => state.selectedProductIds.size,
    selectBulkEditFields: () => state.bulkEditFields,
    selectOperationLoading: () => state.operationLoading,
    selectOperationResult: () => state.operationResult,
    selectOperationStatus: () => ({
      loading: state.operationLoading,
      result: state.operationResult
    })
  };

  const value = {
    state,
    actions,
    selectors
  };

  return (
    <BulkProductContext.Provider value={value}>
      {children}
    </BulkProductContext.Provider>
  );
}

/**
 * useBulkProduct Hook
 * 
 * Use this hook to access bulk product state and actions
 * 
 * Example:
 * const { state, actions, selectors } = useBulkProduct();
 * const selectedCount = selectors.selectSelectedCount();
 */
export function useBulkProduct() {
  const context = useContext(BulkProductContext);

  if (!context) {
    throw new Error('useBulkProduct must be used within BulkProductProvider');
  }

  return context;
}

/**
 * Async thunk for bulk edit submission
 * This function can be called from components to submit bulk edits
 */
export async function submitBulkEdit(
  productIds,
  updateFields,
  apiClient,
  onSuccess = () => {},
  onError = () => {}
) {
  try {
    const response = await apiClient.post('/api/products/bulk-edit', {
      productIds: Array.from(productIds),
      updateFields
    });

    if (response.data.success) {
      onSuccess?.(response.data);
      return { success: true, data: response.data };
    } else {
      const error = new Error(response.data.error || 'Bulk edit failed');
      onError?.(error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('Error submitting bulk edit:', error);
    onError?.(error);
    return { success: false, error };
  }
}

/**
 * Async thunk for fetching products with filters
 */
export async function fetchProductsForBulkEdit(
  filters = {},
  apiClient,
  onSuccess = () => {},
  onError = () => {}
) {
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

    const response = await apiClient.get(
      `/api/products/list?${queryParams.toString()}`
    );

    if (response.data.success) {
      onSuccess?.(response.data.data);
      return { success: true, data: response.data.data };
    } else {
      const error = new Error(response.data.error || 'Failed to fetch products');
      onError?.(error);
      return { success: false, error };
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    onError?.(error);
    return { success: false, error };
  }
}
