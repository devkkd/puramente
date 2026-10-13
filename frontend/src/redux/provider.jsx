'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import bulkProductReducer from '@/redux/slices/bulkProductSlice';
import excelBulkEditReducer from '@/redux/slices/excelBulkEditSlice';

// Create Redux store
const store = configureStore({
  reducer: {
    bulkProduct: bulkProductReducer,
    excelBulkEdit: excelBulkEditReducer,
  },
});

export function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
    </Provider>
  );
}
