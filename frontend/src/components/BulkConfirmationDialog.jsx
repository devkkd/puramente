'use client';

import React, { useState, useMemo } from 'react';
import { AlertCircle, CheckCircle, X } from 'lucide-react';

/**
 * BulkConfirmationDialog Component
 * 
 * Modal dialog for confirming bulk edit operations before execution.
 * Features:
 * - Display selected product count
 * - List fields that will be updated
 * - Show warnings for incomplete updates
 * - Require explicit user confirmation
 * - Display preview of changes
 * 
 * Props:
 * - isOpen: Boolean to show/hide dialog
 * - selectedCount: Number of selected products
 * - updateFields: Object containing fields to update
 * - onConfirm: Callback when user confirms
 * - onCancel: Callback when user cancels
 * - loading: Boolean to show loading state
 */
export default function BulkConfirmationDialog({
  isOpen = false,
  selectedCount = 0,
  updateFields = {},
  onConfirm = () => {},
  onCancel = () => {},
  loading = false
}) {
  const [confirmInput, setConfirmInput] = useState('');
  const requiredConfirmText = `UPDATE ${selectedCount}`;

  // Calculate warnings
  const warnings = useMemo(() => {
    const warns = [];

    // Check if description is being updated
    if (!updateFields.description || !updateFields.description.trim()) {
      warns.push({
        type: 'warning',
        icon: AlertCircle,
        message: 'Updating products without a description may affect SEO',
        severity: 'medium'
      });
    }

    // Check if SEO fields are incomplete
    if (updateFields.seo) {
      const seoFields = updateFields.seo;
      const hasSeoData = seoFields.metaTitle || seoFields.metaDescription || 
                         (seoFields.metaKeywords && seoFields.metaKeywords.length > 0);
      
      if (!hasSeoData) {
        warns.push({
          type: 'info',
          icon: AlertCircle,
          message: 'No SEO fields specified - existing SEO data will be preserved',
          severity: 'low'
        });
      } else if (!seoFields.metaKeywords || seoFields.metaKeywords.length === 0) {
        warns.push({
          type: 'warning',
          icon: AlertCircle,
          message: 'No meta keywords specified - consider adding keywords for better SEO',
          severity: 'low'
        });
      }
    }

    // Check category change impact
    if (updateFields.category) {
      warns.push({
        type: 'info',
        icon: AlertCircle,
        message: `All ${selectedCount} products will be moved to the selected category`,
        severity: 'high'
      });
    }

    return warns;
  }, [updateFields, selectedCount]);

  // Get field label for display
  const getFieldLabel = (fieldName) => {
    const labels = {
      productName: 'Product Name',
      description: 'Description',
      category: 'Category',
      bestSeller: 'Best Seller Status',
      newArrival: 'New Arrival Status',
      seo: 'SEO Fields'
    };
    return labels[fieldName] || fieldName;
  };

  // Format value for display
  const formatValue = (fieldName, value) => {
    if (!value && value !== false && value !== 0) return '(empty)';
    
    if (fieldName === 'bestSeller' || fieldName === 'newArrival') {
      return value ? 'Yes' : 'No';
    }
    
    if (fieldName === 'seo') {
      const parts = [];
      if (value.metaTitle) parts.push(`Title: "${value.metaTitle}"`);
      if (value.metaDescription) parts.push(`Description: "${value.metaDescription}"`);
      if (value.metaKeywords && value.metaKeywords.length > 0) {
        parts.push(`Keywords: ${value.metaKeywords.join(', ')}`);
      }
      return parts.length > 0 ? parts.join(' | ') : '(no SEO data)';
    }
    
    if (typeof value === 'string') {
      return value.length > 100 ? value.substring(0, 100) + '...' : value;
    }
    
    return String(value);
  };

  // Get fields that will be updated
  const fieldsToUpdate = useMemo(() => {
    return Object.keys(updateFields).filter(key => {
      const value = updateFields[key];
      return value !== null && value !== undefined && value !== '';
    });
  }, [updateFields]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
        onClick={onCancel}
      >
        <div
          className="bg-white rounded-lg shadow-2xl max-w-lg w-full mx-4 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Dialog Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 flex items-center justify-between rounded-t-lg">
            <div className="flex items-center gap-3">
              <AlertCircle size={24} className="text-white" />
              <h2 className="text-xl font-bold text-white">Confirm Bulk Update</h2>
            </div>
            <button
              onClick={onCancel}
              disabled={loading}
              className="p-1 hover:bg-blue-800 rounded transition-colors disabled:cursor-not-allowed"
            >
              <X size={20} className="text-white" />
            </button>
          </div>

          {/* Dialog Body */}
          <div className="p-6 space-y-6">
            {/* Selected Product Count */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-gray-600">Selected Products</p>
              <p className="text-3xl font-bold text-blue-600">{selectedCount}</p>
              <p className="text-xs text-gray-500 mt-1">
                This action cannot be undone. Please review before confirming.
              </p>
            </div>

            {/* Fields to Update */}
            {fieldsToUpdate.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">
                  Fields to Update
                </h3>
                <div className="space-y-2 bg-gray-50 rounded-lg p-4">
                  {fieldsToUpdate.map((fieldName) => (
                    <div key={fieldName} className="border-l-2 border-blue-600 pl-3">
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {getFieldLabel(fieldName)}
                      </p>
                      <p className="text-sm text-gray-900">
                        {formatValue(fieldName, updateFields[fieldName])}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warnings */}
            {warnings.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-900">Warnings</h3>
                {warnings.map((warning, idx) => {
                  const IconComponent = warning.icon;
                  const bgColor = warning.severity === 'high' ? 'bg-red-50' : 
                                  warning.severity === 'medium' ? 'bg-yellow-50' : 'bg-blue-50';
                  const borderColor = warning.severity === 'high' ? 'border-red-200' :
                                     warning.severity === 'medium' ? 'border-yellow-200' : 'border-blue-200';
                  const textColor = warning.severity === 'high' ? 'text-red-800' :
                                   warning.severity === 'medium' ? 'text-yellow-800' : 'text-blue-800';

                  return (
                    <div
                      key={idx}
                      className={`flex gap-3 p-3 rounded-lg border ${bgColor} ${borderColor}`}
                    >
                      <IconComponent size={18} className={`flex-shrink-0 mt-0.5 ${textColor}`} />
                      <p className={`text-sm ${textColor}`}>{warning.message}</p>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Confirmation Input */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Type <span className="font-bold text-blue-600">{requiredConfirmText}</span> to confirm
              </label>
              <input
                type="text"
                placeholder={requiredConfirmText}
                value={confirmInput}
                onChange={(e) => setConfirmInput(e.target.value.toUpperCase())}
                disabled={loading}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm font-mono disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-2">
                This prevents accidental bulk updates
              </p>
            </div>

            {/* Confirmation Status */}
            {confirmInput === requiredConfirmText && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <CheckCircle size={18} className="text-green-600" />
                <p className="text-sm text-green-800 font-medium">Confirmed - Ready to update</p>
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <div className="border-t border-gray-200 px-6 py-4 flex gap-3">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 disabled:bg-gray-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onConfirm()}
              disabled={loading || confirmInput !== requiredConfirmText}
              className={`flex-1 px-4 py-2 font-medium rounded-lg text-white transition-colors flex items-center justify-center gap-2 ${
                confirmInput === requiredConfirmText
                  ? 'bg-red-600 hover:bg-red-700 disabled:bg-gray-400'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {loading ? (
                <>
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <AlertCircle size={18} />
                  Confirm Update
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
