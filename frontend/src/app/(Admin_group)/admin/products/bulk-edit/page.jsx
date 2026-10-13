'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import BulkFilterBar from '@/components/BulkFilterBar';
import BulkProductTable from '@/components/BulkProductTable';
import BulkEditPanel from '@/components/BulkEditPanel';
import { getProducts, getCategories, bulkEditProducts } from '@/lib/api';
import { BulkProductProvider } from '@/context/BulkProductContext';

export default function BulkProductEditPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState(new Set());
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    bestSeller: false,
    newArrival: false
  });
  const [bulkEditLoading, setBulkEditLoading] = useState(false);
  const [operationResult, setOperationResult] = useState(null);
  const [editFormData, setEditFormData] = useState({
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
  });

  useEffect(() => {
    checkAdminAccess();
    loadCategoriesAndProducts();
  }, []);

  useEffect(() => {
    applyFilters(products, filters);
  }, [products, filters]);

  const checkAdminAccess = async () => {
    try {
      const token = typeof window !== 'undefined' 
        ? localStorage.getItem('adminToken') || localStorage.getItem('token')
        : null;

      if (!token) {
        router.push('/admin/login');
        return;
      }
    } catch (err) {
      console.error('Auth check failed:', err);
      router.push('/admin/login');
    }
  };

  const loadCategoriesAndProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const [categoriesResult, productsResult] = await Promise.all([
        getCategories(),
        getProducts(1000)
      ]);

      if (categoriesResult.success) {
        setCategories(categoriesResult.data);
      }

      if (productsResult.success) {
        setProducts(productsResult.data);
      } else {
        throw new Error(productsResult.error || 'Failed to fetch products');
      }
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Failed to load products. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = useCallback((allProducts, currentFilters) => {
    let filtered = allProducts;

    if (currentFilters.search) {
      const searchLower = currentFilters.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.productName?.toLowerCase().includes(searchLower) ||
        p.designCode?.toLowerCase().includes(searchLower)
      );
    }

    if (currentFilters.category) {
      filtered = filtered.filter(p => p.category === currentFilters.category);
    }

    if (currentFilters.bestSeller) {
      filtered = filtered.filter(p => p.bestSeller === true);
    }

    if (currentFilters.newArrival) {
      filtered = filtered.filter(p => p.newArrival === true);
    }

    setFilteredProducts(filtered);
  }, []);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setSelectedProductIds(new Set());
  };

  const handleSelectProduct = (productId, isSelected) => {
    const newSelection = new Set(selectedProductIds);
    if (isSelected) {
      newSelection.add(productId);
    } else {
      newSelection.delete(productId);
    }
    setSelectedProductIds(newSelection);
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const allIds = new Set(filteredProducts.map(p => p._id));
      setSelectedProductIds(allIds);
    } else {
      setSelectedProductIds(new Set());
    }
  };

  const handleEditFieldChange = (fieldName, value) => {
    if (fieldName.startsWith('seo.')) {
      const seoField = fieldName.substring(4);
      setEditFormData(prev => ({
        ...prev,
        seo: {
          ...prev.seo,
          [seoField]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [fieldName]: value
      }));
    }
  };

  const handleBulkEditSubmit = async (updateObject) => {
    if (selectedProductIds.size === 0) {
      setOperationResult({
        success: false,
        message: 'No products selected'
      });
      return;
    }

    try {
      setBulkEditLoading(true);
      setOperationResult(null);

      const result = await bulkEditProducts(
        Array.from(selectedProductIds),
        updateObject
      );

      if (result.success) {
        setOperationResult({
          success: true,
          message: result.message || `Successfully updated ${result.updatedCount} product${result.updatedCount !== 1 ? 's' : ''}`
        });

        await loadCategoriesAndProducts();

        setTimeout(() => {
          setSelectedProductIds(new Set());
          setIsEditPanelOpen(false);
          setEditFormData({
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
          });
        }, 2000);
      } else {
        setOperationResult({
          success: false,
          message: result.error || 'Bulk edit failed'
        });
      }
    } catch (err) {
      console.error('Error submitting bulk edit:', err);
      setOperationResult({
        success: false,
        message: 'Error submitting bulk edit. Please try again.'
      });
    } finally {
      setBulkEditLoading(false);
    }
  };

  const handleSort = (sortConfig) => {
    // Sorting is handled locally
  };

  return (
    <BulkProductProvider>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/admin/products"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Back to Products</span>
          </Link>

          <h1 className="text-3xl font-bold text-gray-900">Bulk Edit Products</h1>
          <p className="text-gray-600 mt-2">
            Select multiple products and update common fields efficiently
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900">Error</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Loading products...</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3 space-y-6">
              <BulkFilterBar onFiltersChange={handleFiltersChange} />

              <BulkProductTable
                products={filteredProducts}
                selectedProductIds={selectedProductIds}
                categories={categories}
                onSelectProduct={handleSelectProduct}
                onSelectAll={handleSelectAll}
                onSort={handleSort}
              />
            </div>

            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="mb-6">
                  <p className="text-3xl font-bold text-blue-600">
                    {selectedProductIds.size}
                  </p>
                  <p className="text-sm text-gray-600">
                    Product{selectedProductIds.size !== 1 ? 's' : ''} selected
                  </p>
                </div>

                <button
                  onClick={() => setIsEditPanelOpen(true)}
                  disabled={selectedProductIds.size === 0}
                  className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Edit Selected
                </button>

                <p className="text-xs text-gray-500 mt-4 text-center">
                  {selectedProductIds.size === 0
                    ? 'Select products to enable bulk edit'
                    : `Click "Edit Selected" to modify ${selectedProductIds.size} product${selectedProductIds.size !== 1 ? 's' : ''}`}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      </div>

      <BulkEditPanel
        isOpen={isEditPanelOpen}
        selectedCount={selectedProductIds.size}
        categories={categories}
        formData={editFormData}
        onClose={() => setIsEditPanelOpen(false)}
        onApply={handleBulkEditSubmit}
        onFieldChange={handleEditFieldChange}
        loading={bulkEditLoading}
        result={operationResult}
      />
    </BulkProductProvider>
  );
}



