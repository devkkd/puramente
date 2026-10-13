'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * BulkEditPanel Component
 * 
 * A slide-out panel for editing bulk product fields.
 * Features:
 * - Shows selected product count
 * - Form fields for bulk updates (productName, description, category, flags, SEO)
 * - Field change tracking and visual indicators
 * - Preview of fields that will be updated
 * - Success/error notification display
 * - Loading state during submission
 * 
 * Props:
 * - isOpen: Boolean to show/hide panel
 * - selectedCount: Number of selected products
 * - categories: Array of category objects
 * - onClose: Callback when panel is closed
 * - onApply: Callback when "Apply Changes" is clicked
 * - onFieldChange: Callback when field value changes
 * - loading: Boolean to show loading state
 * - result: Operation result object with success/error info
 */
export default function BulkEditPanel({
  isOpen = false,
  selectedCount = 0,
  categories = [],
  onClose = () => {},
  onApply = () => {},
  onFieldChange = () => {},
  loading = false,
  result = null,
  formData = {
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
}) {
  const [changedFields, setChangedFields] = useState(new Set());
  const [errors, setErrors] = useState({});
  const [seoKeywordInput, setSeoKeywordInput] = useState('');

  // Track which fields have been modified
  useEffect(() => {
    // Update changed fields based on non-empty values
    const changed = new Set();

    if (formData.productName?.trim()) changed.add('productName');
    if (formData.description?.trim()) changed.add('description');
    if (formData.category) changed.add('category');
    if (formData.bestSeller) changed.add('bestSeller');
    if (formData.newArrival) changed.add('newArrival');
    if (
      formData.seo?.metaTitle ||
      formData.seo?.metaDescription ||
      (formData.seo?.metaKeywords && formData.seo.metaKeywords.length > 0)
    ) {
      changed.add('seo');
    }

    setChangedFields(changed);
  }, [formData]);

  // Handle field changes
  const handleFieldChange = (fieldName, value) => {
    // Validate field
    const fieldErrors = validateField(fieldName, value);
    setErrors(prev => {
      if (fieldErrors.length > 0) {
        return { ...prev, [fieldName]: fieldErrors };
      } else {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      }
    });

    onFieldChange?.(fieldName, value);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    const errs = [];

    if (fieldName === 'productName') {
      if (value && value.length > 200) {
        errs.push('Product name cannot exceed 200 characters');
      }
    } else if (fieldName === 'description') {
      if (value && value.length > 5000) {
        errs.push('Description cannot exceed 5000 characters');
      }
    } else if (fieldName === 'seo.metaTitle') {
      if (value && value.length > 60) {
        errs.push('Meta title cannot exceed 60 characters');
      }
    } else if (fieldName === 'seo.metaDescription') {
      if (value && value.length > 160) {
        errs.push('Meta description cannot exceed 160 characters');
      }
    }

    return errs;
  };

  // Add keyword to SEO
  const handleAddKeyword = () => {
    if (!seoKeywordInput.trim()) return;

    const currentKeywords = formData.seo?.metaKeywords || [];
    if (!currentKeywords.includes(seoKeywordInput.trim())) {
      handleFieldChange('seo.metaKeywords', [
        ...currentKeywords,
        seoKeywordInput.trim()
      ]);
    }
    setSeoKeywordInput('');
  };

  // Remove keyword from SEO
  const handleRemoveKeyword = (keyword) => {
    const currentKeywords = formData.seo?.metaKeywords || [];
    handleFieldChange(
      'seo.metaKeywords',
      currentKeywords.filter(k => k !== keyword)
    );
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (changedFields.size === 0) {
      setErrors({ general: 'Please modify at least one field' });
      return;
    }

    // Build update object with only changed fields
    const updateObject = {};

    if (changedFields.has('productName')) {
      updateObject.productName = formData.productName;
    }
    if (changedFields.has('description')) {
      updateObject.description = formData.description;
    }
    if (changedFields.has('category')) {
      updateObject.category = formData.category;
    }
    if (changedFields.has('bestSeller')) {
      updateObject.bestSeller = formData.bestSeller;
    }
    if (changedFields.has('newArrival')) {
      updateObject.newArrival = formData.newArrival;
    }
    if (changedFields.has('seo')) {
      updateObject.seo = formData.seo;
    }

    onApply?.(updateObject);
  };

  // Build preview text
  const getPreviewText = () => {
    const fields = Array.from(changedFields);
    if (fields.length === 0) return 'No fields selected';

    const fieldLabels = {
      productName: 'Product Name',
      description: 'Description',
      category: 'Category',
      bestSeller: 'Best Seller Status',
      newArrival: 'New Arrival Status',
      seo: 'SEO Fields'
    };

    const labels = fields.map(f => fieldLabels[f] || f);
    if (labels.length === 1) {
      return `Only ${labels[0]} will be updated`;
    }
    return `${labels.slice(0, -1).join(', ')} and ${labels[labels.length - 1]} will be updated`;
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 overflow-y-auto transform transition-transform">
        {/* Panel Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Bulk Edit</h2>
            <p className="text-sm text-gray-600">
              {selectedCount} product{selectedCount !== 1 ? 's' : ''} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Close panel"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        {/* Panel Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Operation Result Alert */}
          {result && (
            <div
              className={`p-4 rounded-lg border-l-4 flex items-start gap-3 ${
                result.success
                  ? 'bg-green-50 border-green-500 text-green-800'
                  : 'bg-red-50 border-red-500 text-red-800'
              }`}
            >
              {result.success ? (
                <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{result.message}</p>
                {result.errors && result.errors.length > 0 && (
                  <ul className="mt-2 space-y-1 text-sm">
                    {result.errors.map((err, idx) => (
                      <li key={idx}>• {err}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          )}

          {/* General Error */}
          {errors.general && (
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-800 text-sm">
              {errors.general}
            </div>
          )}

          {/* Product Name Field */}
          <div>
            <label
              htmlFor="productName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Product Name {changedFields.has('productName') && <span className="text-red-500">*</span>}
            </label>
            <input
              id="productName"
              type="text"
              placeholder="Leave blank to keep unchanged"
              value={formData.productName || ''}
              onChange={(e) => handleFieldChange('productName', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {errors.productName && (
              <p className="text-sm text-red-600 mt-1">{errors.productName[0]}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.productName?.length || 0}/200 characters
            </p>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description {changedFields.has('description') && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="description"
              placeholder="Leave blank to keep unchanged"
              value={formData.description || ''}
              onChange={(e) => handleFieldChange('description', e.target.value)}
              disabled={loading}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {errors.description && (
              <p className="text-sm text-red-600 mt-1">{errors.description[0]}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              {formData.description?.length || 0}/5000 characters
            </p>
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Category {changedFields.has('category') && <span className="text-red-500">*</span>}
            </label>
            <select
              id="category"
              value={formData.category || ''}
              onChange={(e) => handleFieldChange('category', e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none bg-white disabled:bg-gray-50 disabled:cursor-not-allowed"
            >
              <option value="">Keep unchanged</option>
              {categories.map((category) => (
                <option
                  key={category._id || category.id}
                  value={category._id || category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Flags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Product Flags {(changedFields.has('bestSeller') || changedFields.has('newArrival')) && <span className="text-red-500">*</span>}
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.bestSeller || false}
                onChange={(e) => handleFieldChange('bestSeller', e.target.checked)}
                disabled={loading}
                className="w-5 h-5 rounded border-gray-300 text-yellow-600 focus:ring-2 focus:ring-yellow-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700">Best Seller</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50 transition-colors">
              <input
                type="checkbox"
                checked={formData.newArrival || false}
                onChange={(e) => handleFieldChange('newArrival', e.target.checked)}
                disabled={loading}
                className="w-5 h-5 rounded border-gray-300 text-green-600 focus:ring-2 focus:ring-green-500 disabled:cursor-not-allowed"
              />
              <span className="text-sm text-gray-700">New Arrival</span>
            </label>
          </div>

          {/* SEO Fields */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              SEO {changedFields.has('seo') && <span className="text-red-500">*</span>}
            </h3>

            {/* Meta Title */}
            <div className="mb-4">
              <label
                htmlFor="metaTitle"
                className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide"
              >
                Meta Title
              </label>
              <input
                id="metaTitle"
                type="text"
                placeholder="Leave blank to skip"
                value={formData.seo?.metaTitle || ''}
                onChange={(e) => handleFieldChange('seo.metaTitle', e.target.value)}
                disabled={loading}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors['seo.metaTitle'] && (
                <p className="text-xs text-red-600 mt-1">{errors['seo.metaTitle'][0]}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.seo?.metaTitle?.length || 0}/60 characters
              </p>
            </div>

            {/* Meta Description */}
            <div className="mb-4">
              <label
                htmlFor="metaDescription"
                className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide"
              >
                Meta Description
              </label>
              <textarea
                id="metaDescription"
                placeholder="Leave blank to skip"
                value={formData.seo?.metaDescription || ''}
                onChange={(e) => handleFieldChange('seo.metaDescription', e.target.value)}
                disabled={loading}
                rows={2}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none disabled:bg-gray-50 disabled:cursor-not-allowed"
              />
              {errors['seo.metaDescription'] && (
                <p className="text-xs text-red-600 mt-1">{errors['seo.metaDescription'][0]}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                {formData.seo?.metaDescription?.length || 0}/160 characters
              </p>
            </div>

            {/* Meta Keywords */}
            <div>
              <label
                htmlFor="metaKeywords"
                className="block text-xs font-medium text-gray-700 mb-1 uppercase tracking-wide"
              >
                Meta Keywords
              </label>
              <div className="flex gap-2">
                <input
                  id="metaKeywords"
                  type="text"
                  placeholder="Type and press Add"
                  value={seoKeywordInput}
                  onChange={(e) => setSeoKeywordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                  disabled={loading}
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
                />
                <button
                  type="button"
                  onClick={handleAddKeyword}
                  disabled={loading || !seoKeywordInput.trim()}
                  className="px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  Add
                </button>
              </div>

              {/* Keywords List */}
              {formData.seo?.metaKeywords && formData.seo.metaKeywords.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.seo.metaKeywords.map((keyword) => (
                    <div
                      key={keyword}
                      className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                    >
                      <span>{keyword}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveKeyword(keyword)}
                        disabled={loading}
                        className="text-blue-600 hover:text-blue-800 disabled:cursor-not-allowed"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Preview */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Update preview:</strong> {getPreviewText()} for all selected products.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || changedFields.size === 0}
              className="flex-1 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
