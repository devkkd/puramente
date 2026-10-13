'use client';

import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

/**
 * BulkProductTable Component
 * 
 * Displays products in a table format with checkboxes for selection.
 * Features:
 * - Individual row selection with checkboxes
 * - "Select All" checkbox with indeterminate state
 * - Column sorting (click headers to sort)
 * - Shows product details: image, name, SKU, category, flags
 * - Responsive design with Tailwind CSS
 * 
 * Props:
 * - products: Array of product objects
 * - selectedProductIds: Set of selected product IDs
 * - categories: Array of category objects
 * - onSelectProduct: Callback when individual product is toggled
 * - onSelectAll: Callback when "Select All" is clicked
 * - onSort: Callback when column header is clicked
 * - currentSort: Current sort state { field, direction }
 */
export default function BulkProductTable({
  products = [],
  selectedProductIds = new Set(),
  categories = [],
  onSelectProduct = () => {},
  onSelectAll = () => {},
  onSort = () => {},
  currentSort = { field: 'createdAt', direction: 'desc' }
}) {
  const [sortConfig, setSortConfig] = useState(currentSort);

  // Determine if header checkbox should be indeterminate
  const isAllSelected = products.length > 0 && selectedProductIds.size === products.length;
  const isIndeterminate = selectedProductIds.size > 0 && selectedProductIds.size < products.length;

  // Handle column header click for sorting
  const handleSort = (field) => {
    let direction = 'asc';
    if (sortConfig.field === field && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    const newSort = { field, direction };
    setSortConfig(newSort);
    onSort?.(newSort);
  };

  // Sort products based on sortConfig
  const sortedProducts = useMemo(() => {
    const sorted = [...products].sort((a, b) => {
      let aVal = a[sortConfig.field];
      let bVal = b[sortConfig.field];

      // Handle nested properties (e.g., category.name)
      if (sortConfig.field.includes('.')) {
        const path = sortConfig.field.split('.');
        aVal = path.reduce((obj, key) => obj?.[key], a);
        bVal = path.reduce((obj, key) => obj?.[key], b);
      }

      // Convert to comparable format
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [products, sortConfig]);

  // Get category name by ID
  const getCategoryName = (categoryId) => {
    const category = categories.find(c => c._id === categoryId || c.id === categoryId);
    return category?.name || 'Uncategorized';
  };

  // Column header component with sort indicators
  const SortableHeader = ({ field, label, sortable = true }) => {
    const isActive = sortConfig.field === field;
    
    return (
      <th
        className={`px-6 py-3 text-left font-semibold text-gray-700 border-b border-gray-200 ${
          sortable ? 'cursor-pointer hover:bg-gray-50' : ''
        }`}
        onClick={() => sortable && handleSort(field)}
      >
        <div className="flex items-center gap-2">
          <span>{label}</span>
          {sortable && isActive && (
            <span className="text-blue-600">
              {sortConfig.direction === 'asc' ? (
                <ChevronUp size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </span>
          )}
        </div>
      </th>
    );
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      {/* Table wrapper with scroll on mobile */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* Table Header */}
          <thead className="bg-gray-100">
            <tr>
              {/* Select All Checkbox */}
              <th className="px-6 py-3 text-left border-b border-gray-200 w-12">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={el => {
                      if (el) el.indeterminate = isIndeterminate;
                    }}
                    onChange={(e) => {
                      onSelectAll?.(e.target.checked);
                    }}
                    className="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                    title={
                      isAllSelected
                        ? 'Deselect all products'
                        : isIndeterminate
                        ? 'Some products selected'
                        : 'Select all products'
                    }
                  />
                </div>
              </th>

              {/* Product Image/Name */}
              <SortableHeader
                field="productName"
                label="Product"
                sortable={true}
              />

              {/* Design Code / SKU */}
              <SortableHeader
                field="designCode"
                label="Design Code"
                sortable={true}
              />

              {/* Category */}
              <SortableHeader
                field="category"
                label="Category"
                sortable={false}
              />

              {/* Flags: Best Seller, New Arrival */}
              <th className="px-6 py-3 text-left font-semibold text-gray-700 border-b border-gray-200">
                Flags
              </th>

              {/* Created Date */}
              <SortableHeader
                field="createdAt"
                label="Added"
                sortable={true}
              />
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-gray-200">
            {sortedProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            ) : (
              sortedProducts.map((product) => {
                const isSelected = selectedProductIds.has(product._id);
                return (
                  <tr
                    key={product._id}
                    className={`hover:bg-gray-50 transition-colors ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    {/* Row Checkbox */}
                    <td className="px-6 py-4 w-12">
                      <div className="flex items-center justify-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            onSelectProduct?.(product._id, e.target.checked);
                          }}
                          className="w-5 h-5 cursor-pointer rounded border-gray-300 text-blue-600 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </td>

                    {/* Product Name + Image */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {/* Product Image */}
                        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded overflow-hidden">
                          {product.imageUrl ? (
                            <img
                              src={product.imageUrl}
                              alt={product.productName}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No Image
                            </div>
                          )}
                        </div>

                        {/* Product Name */}
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">
                            {product.productName}
                          </p>
                          {product.option && (
                            <p className="text-sm text-gray-500">
                              {product.option}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Design Code */}
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {product.designCode}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">
                        {getCategoryName(product.category)}
                      </span>
                    </td>

                    {/* Flags */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {product.bestSeller && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-yellow-500 rounded">
                            Best Seller
                          </span>
                        )}
                        {product.newArrival && (
                          <span className="inline-block px-2 py-1 text-xs font-semibold text-white bg-green-500 rounded">
                            New
                          </span>
                        )}
                        {!product.bestSeller && !product.newArrival && (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </div>
                    </td>

                    {/* Created Date */}
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {product.createdAt
                        ? new Date(product.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })
                        : '—'}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer: Product Count */}
      {products.length > 0 && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 text-sm text-gray-600">
          Showing {sortedProducts.length} of {products.length} products
        </div>
      )}
    </div>
  );
}
