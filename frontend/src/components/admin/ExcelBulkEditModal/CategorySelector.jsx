"use client";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AlertCircle, RotateCcw } from "lucide-react";
import {
  fetchCategoriesForModal,
  setSelectedCategory,
  fetchProductsByCategory,
  fetchAllProducts,
} from "@/redux/slices/excelBulkEditSlice";
import LoadingSpinner from "./LoadingSpinner";

/**
 * CategorySelector - Dropdown for selecting product category or all products
 */
export default function CategorySelector({ onCategoryChange }) {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    categories,
    categoriesLoading,
    categoriesError,
    products,
    productsLoading,
  } = useSelector((state) => state.excelBulkEdit);

  const handleRetry = () => {
    dispatch(fetchCategoriesForModal());
  };

  const handleChange = (e) => {
    const categoryId = e.target.value;
    console.log("Category selected:", categoryId);
    
    if (categoryId === "all") {
      console.log("Fetching all products...");
      dispatch(setSelectedCategory("all"));
      dispatch(fetchAllProducts());
      onCategoryChange("all");
    } else if (categoryId) {
      console.log("Fetching products for category:", categoryId);
      dispatch(setSelectedCategory(categoryId));
      dispatch(fetchProductsByCategory(categoryId));
      onCategoryChange(categoryId);
    }
  };

  const sortedCategories = [...categories].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-bold text-gray-900">
          Select Category <span className="text-red-500">*</span>
        </label>
      </div>

      {categoriesError && (
        <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-sm font-medium text-red-900">Failed to load categories</p>
            <p className="text-sm text-red-700 mt-1">{categoriesError}</p>
          </div>
          <button
            onClick={handleRetry}
            className="text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap ml-2"
          >
            <RotateCcw size={16} className="inline mr-1" />
            Retry
          </button>
        </div>
      )}

      {categoriesLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="medium" />
        </div>
      ) : (
        <div className="space-y-2">
          <select
            value={selectedCategory || ""}
            onChange={handleChange}
            disabled={categoriesLoading || !categories.length}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white text-gray-900 font-medium disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed transition"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: "no-repeat",
              backgroundPosition: "right 1rem center",
              paddingRight: "2.5rem",
            }}
          >
            <option value="">-- Choose a category --</option>
            <option value="all">📦 All Products</option>
            {sortedCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          
          {selectedCategory && (
            <p className="text-xs text-gray-500 font-medium">
              {productsLoading && "Loading..."}
              {!productsLoading && selectedCategory === "all" && `✓ Showing all ${products.length} products`}
              {!productsLoading && selectedCategory !== "all" && `✓ Showing ${products.length} products in this category`}
            </p>
          )}
        </div>
      )}

      {!categoriesLoading && categories.length === 0 && !categoriesError && (
        <p className="text-sm text-gray-500 text-center py-4">
          No categories available
        </p>
      )}
    </div>
  );
}
