// FIXED: BulkEditTable.jsx - Pass filteredProducts to TableHeader
"use client";
import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { Search, X } from "lucide-react";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import LoadingSpinner from "./LoadingSpinner";

/**
 * BulkEditTable - Main table component for bulk editing products
 * Renders table with all products and inline editors
 */
export default function BulkEditTable() {
  const {
    products,
    productsLoading,
    productsError,
    selectedProductIds,
    selectedCategory,
  } = useSelector((state) => state.excelBulkEdit);

  const [searchQuery, setSearchQuery] = useState("");

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    
    if (!searchQuery.trim()) {
      return products;
    }

    const query = searchQuery.toLowerCase();
    return products.filter((product) => {
      const productName = product.productName?.toLowerCase() || "";
      const designCode = product.designCode?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      
      return (
        productName.includes(query) ||
        designCode.includes(query) ||
        description.includes(query)
      );
    });
  }, [products, searchQuery]);

  if (productsLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner text="Loading products..." />
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-700 font-medium">Failed to load products: {productsError}</p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
        <p className="text-gray-600">
          {selectedCategory === "all" 
            ? "No products found in system" 
            : "No products found in this category"}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-visible">
      {/* Selection Counter & Search */}
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 space-y-3 relative z-20">
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-gray-600 font-medium">
            <span className="font-bold text-gray-900">{selectedProductIds.length}</span> of{" "}
            <span className="font-bold text-gray-900">{filteredProducts.length}</span> product(s) selected
          </p>
          
          {/* Search Box */}
          <div className="relative flex-1 max-w-xs z-30">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" 
              size={18} 
            />
            <input
              type="text"
              placeholder="Search by name, code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm text-gray-900 font-medium placeholder-gray-500 relative z-30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 z-40"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>
        
        {searchQuery && (
          <p className="text-xs text-gray-500 font-medium">
            Showing {filteredProducts.length} of {products.length} products matching "{searchQuery}"
          </p>
        )}
      </div>

      {/* No Results */}
      {filteredProducts.length === 0 && searchQuery && (
        <div className="px-6 py-12 text-center text-gray-500 font-medium">
          <p>No products match your search</p>
        </div>
      )}

      {/* Table */}
      {filteredProducts.length > 0 && (
        <div className="overflow-x-auto relative z-10">
          <table className="w-full">
            <TableHeader productCount={filteredProducts.length} filteredProducts={filteredProducts} />
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredProducts.map((product, idx) => (
                <TableRow
                  key={product._id}
                  product={product}
                  rowIndex={idx}
                  isSelected={selectedProductIds.includes(product._id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
