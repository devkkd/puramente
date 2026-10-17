"use client";
import { useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, AlertCircle, Check, Download } from "lucide-react";
import {
  setModalOpen,
  resetModalState,
  fetchCategoriesForModal,
  setSelectedCategory,
  fetchProductsByCategory,
  fetchAllProducts,
  submitBulkChanges,
  clearSaveResult,
  setValidationErrors,
} from "@/redux/slices/excelBulkEditSlice";
import { validateAll } from "@/lib/validationEngine";
import { generateExcelFile, downloadExcelFile } from "@/lib/excelExport";
import CategorySelector from "./CategorySelector";
import BulkEditTable from "./BulkEditTable";
import SuccessNotification from "./SuccessNotification";
import ErrorBanner from "./ErrorBanner";
import ValidationErrorSummary from "./ValidationErrorSummary";

/**
 * ExcelBulkEditModal - Main container component for bulk product editing
 * Manages modal lifecycle, state coordination, and API operations
 */
export default function ExcelBulkEditModal() {
  const dispatch = useDispatch();
  const {
    isOpen,
    selectedCategory,
    categories,
    products,
    changes,
    originalValues,
    validationErrors,
    saveLoading,
    saveError,
    saveResult,
    selectedProductIds,
  } = useSelector((state) => state.excelBulkEdit);

  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [closeConfirmation, setCloseConfirmation] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    if (isOpen && categories.length === 0) {
      dispatch(fetchCategoriesForModal());
    }
  }, [isOpen, dispatch, categories.length]);

  // Track if there are unsaved changes
  useEffect(() => {
    setUnsavedChanges(Object.keys(changes).length > 0);
  }, [changes]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isOpen) {
        if (unsavedChanges) {
          setCloseConfirmation(true);
        } else {
          handleCloseModal();
        }
      }
    };

    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isOpen, unsavedChanges]);

  const handleCloseModal = useCallback(() => {
    dispatch(resetModalState());
    dispatch(setModalOpen(false));
    setCloseConfirmation(false);
  }, [dispatch]);

  const handleConfirmDiscard = () => {
    setCloseConfirmation(false);
    handleCloseModal();
  };

  const handleExportExcel = useCallback(async () => {
    if (!products || products.length === 0) {
      alert("No products to export");
      return;
    }

    const productsToExport = selectedProductIds.length > 0 
      ? products.filter(p => selectedProductIds.includes(p._id))
      : products;

    if (productsToExport.length === 0) {
      alert("Please select products to export");
      return;
    }

    setExportingExcel(true);
    try {
      const workbook = generateExcelFile(productsToExport);
      downloadExcelFile(workbook, `products-${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (error) {
      console.error("Export error:", error);
      alert("Failed to export Excel: " + error.message);
    } finally {
      setExportingExcel(false);
    }
  }, [products, selectedProductIds]);

  const handleSave = useCallback(async () => {
    console.log("🔵 [BULK EDIT] handleSave called");
    console.log("🔵 [BULK EDIT] Current changes object:", changes);
    console.log("🔵 [BULK EDIT] Number of products with changes:", Object.keys(changes).length);
    
    // Show details of each product's changes
    Object.keys(changes).forEach(productId => {
      console.log("🔵 [BULK EDIT] Product " + productId + " changes:", changes[productId]);
      console.log("🔵 [BULK EDIT] Has metaTitle?", "metaTitle" in changes[productId]);
      console.log("🔵 [BULK EDIT] Has metaDescription?", "metaDescription" in changes[productId]);
      console.log("🔵 [BULK EDIT] Has metaKeywords?", "metaKeywords" in changes[productId]);
    });
    if (Object.keys(changes).length === 0) {
      alert("No changes to save.");
      return;
    }

    // Validate all changes
    const errors = validateAll(products, changes);
    if (Object.keys(errors).length > 0) {
      dispatch(setValidationErrors(errors));
      alert("Please fix validation errors before saving.");
      return;
    }

    // Format and submit
    const payload = {
      products: products
        .filter((p) => changes[p._id] && Object.keys(changes[p._id]).length > 0)
        .map((p) => ({
          _id: p._id,
          updates: changes[p._id],
        })),
    };

    dispatch(submitBulkChanges(payload));
  }, [changes, products, dispatch]);

  if (!isOpen) return null;

  return (
    <>
      {/* Modal Backdrop */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40" />

      {/* Modal Container */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-transparent">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Bulk Edit Products</h2>
              <p className="text-sm text-gray-600 mt-1">Select a category or all products to edit in bulk</p>
            </div>
            <button
              onClick={() =>
                unsavedChanges ? setCloseConfirmation(true) : handleCloseModal()
              }
              className="p-2 hover:bg-gray-100 rounded-lg transition text-gray-600 hover:text-gray-900"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-6">
            
            {/* Success Notification */}
            {saveResult && <SuccessNotification result={saveResult} />}

            {/* Error Banner */}
            {saveError && (
              <ErrorBanner error={saveError} onRetry={() => handleSave()} />
            )}

            {/* Validation Errors Summary */}
            {Object.keys(validationErrors).length > 0 && (
              <ValidationErrorSummary errors={validationErrors} products={products} />
            )}

            {/* Category Selector */}
            <CategorySelector
              onCategoryChange={(categoryId) => {
                // Category change is handled in CategorySelector
              }}
            />

            {/* Bulk Edit Table */}
            {selectedCategory !== null && selectedCategory !== "" && <BulkEditTable />}
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-between px-8 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              {Object.keys(changes).length > 0 && (
                <span className="font-semibold text-blue-600">
                  {Object.keys(changes).length} product(s) with changes
                </span>
              )}
            </p>
            <div className="flex gap-3">
              {selectedProductIds.length > 0 && (
                <button
                  onClick={handleExportExcel}
                  disabled={exportingExcel || selectedProductIds.length === 0}
                  className="px-4 py-2.5 border border-green-300 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 disabled:bg-gray-200 disabled:text-gray-500 transition-all font-medium flex items-center gap-2"
                >
                  {exportingExcel ? (
                    <>
                      <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download size={18} />
                      Download Excel
                    </>
                  )}
                </button>
              )}
              <button
                onClick={() =>
                  unsavedChanges ? setCloseConfirmation(true) : handleCloseModal()
                }
                className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-all font-medium"
              >
                Discard
              </button>
              <button
                onClick={handleSave}
                disabled={saveLoading || Object.keys(changes).length === 0}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-all font-medium flex items-center gap-2"
              >
                {saveLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog for Unsaved Changes */}
      {closeConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="text-amber-600" size={24} />
              <h3 className="text-lg font-bold text-gray-900">Unsaved Changes</h3>
            </div>
            <p className="text-gray-700 mb-6">
              You have unsaved changes. Are you sure you want to discard them?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setCloseConfirmation(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
              >
                Keep Editing
              </button>
              <button
                onClick={handleConfirmDiscard}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                Discard Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}



