"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSelectAll } from "@/redux/slices/excelBulkEditSlice";

/**
 * TableHeader - Header row with select-all checkbox and column titles
 */
export default function TableHeader({ productCount, filteredProducts }) {
  const dispatch = useDispatch();
  const checkboxRef = useRef(null);
  const { selectedProductIds } = useSelector(
    (state) => state.excelBulkEdit
  );

  // Use filteredProducts if provided, otherwise use all products from Redux
  const visibleProducts = filteredProducts || [];
  
  const allSelected = visibleProducts.length > 0 && 
    selectedProductIds.length === visibleProducts.length &&
    visibleProducts.every(p => selectedProductIds.includes(p._id));
  
  const someSelected = selectedProductIds.length > 0 && 
    selectedProductIds.length < visibleProducts.length;

  // Update indeterminate state directly on the DOM element
  useEffect(() => {
    if (checkboxRef.current) {
      checkboxRef.current.indeterminate = someSelected && !allSelected;
    }
  }, [someSelected, allSelected]);

  const handleSelectAll = () => {
    const productIds = visibleProducts.map((p) => p._id);
    dispatch(toggleSelectAll(productIds));
  };

  const columns = [
    { key: "checkbox", label: "Select", width: "w-12" },
    { key: "productName", label: "Product Name", width: "w-48" },
    { key: "designCode", label: "Design Code", width: "w-40" },
    { key: "description", label: "Description", width: "w-48" },
    { key: "category", label: "Category", width: "w-32" },
    { key: "bestSeller", label: "Best Seller", width: "w-24" },
    { key: "newArrival", label: "New Arrival", width: "w-24" },
    { key: "metaTitle", label: "Meta Title", width: "w-40" },
    { key: "metaDescription", label: "Meta Description", width: "w-48" },
    { key: "metaKeywords", label: "Meta Keywords", width: "w-48" },
  ];

  return (
    <thead className="bg-blue-600 text-white sticky top-0 z-10">
      <tr>
        {columns.map((col) => (
          <th
            key={col.key}
            className={col.width + " px-4 py-4 text-left text-sm font-bold"}
          >
            {col.key === "checkbox" ? (
              <input
                ref={checkboxRef}
                type="checkbox"
                checked={allSelected}
                onChange={handleSelectAll}
                className="w-5 h-5 rounded border-gray-300 cursor-pointer hover:brightness-110 transition"
                aria-label="Select all visible products"
                title={allSelected ? "Deselect all" : "Select all"}
              />
            ) : (
              col.label
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
}
