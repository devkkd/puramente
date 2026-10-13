"use client";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleProductSelection, recordCellEdit } from "@/redux/slices/excelBulkEditSlice";
import ChangeIndicator from "./ChangeIndicator";
import InlineEditor from "./InlineEditor";

/**
 * TableRow - Single product row with editable cells
 */
export default function TableRow({ product, rowIndex, isSelected }) {
  const dispatch = useDispatch();
  const { changes, validationErrors } = useSelector(
    (state) => state.excelBulkEdit
  );
  const { categories } = useSelector((state) => state.excelBulkEdit);

  const [editingField, setEditingField] = useState(null);
  const productChanges = changes[product._id] || {};
  const productErrors = validationErrors[product._id] || {};
  const hasChanges = Object.keys(productChanges).length > 0;

  const handleToggleSelection = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(toggleProductSelection(product._id));
  };

  const handleCellChange = (fieldName, newValue) => {
    dispatch(recordCellEdit({ productId: product._id, fieldName, newValue }));
    setEditingField(null);
  };

  const getCellValue = (fieldName) => {
    if (productChanges[fieldName] !== undefined) {
      return productChanges[fieldName];
    }
    if (fieldName === "metaTitle") return product.seo?.metaTitle || "";
    if (fieldName === "metaDescription") return product.seo?.metaDescription || "";
    if (fieldName === "metaKeywords") return product.seo?.metaKeywords || [];
    if (fieldName === "category") {
      return typeof product.category === "object" ? product.category?._id : product.category;
    }
    return product[fieldName] || "";
  };

  const cellFields = [
    { key: "productName", type: "text", label: "Product Name" },
    { key: "designCode", type: "text", label: "Design Code" },
    { key: "description", type: "text", label: "Description" },
    { key: "category", type: "dropdown", label: "Category", options: categories },
    { key: "bestSeller", type: "checkbox", label: "Best Seller" },
    { key: "newArrival", type: "checkbox", label: "New Arrival" },
    { key: "metaTitle", type: "text", label: "Meta Title" },
    { key: "metaDescription", type: "text", label: "Meta Description" },
    { key: "metaKeywords", type: "keywords", label: "Meta Keywords" },
  ];

  const bgColor = rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50";
  const hasError = Object.keys(productErrors).length > 0;

  const getDisplayValue = (value, fieldType) => {
    if (Array.isArray(value)) {
      return value.join(", ") || "-";
    }
    if (fieldType === "checkbox") {
      return value ? "✓ Yes" : "✗ No";
    }
    if (fieldType === "dropdown") {
      const category = categories.find((c) => c._id === value);
      return category?.name || value || "-";
    }
    return value || "-";
  };

  const handleCellClick = (fieldKey, fieldType) => {
    // Allow clicking on checkboxes to edit them
    setEditingField(fieldKey);
  };

  return (
    <tr className={`${bgColor} ${hasError ? "border-l-4 border-red-500" : ""} hover:bg-blue-50 transition`}>
      {/* Checkbox - Select Row */}
      <td className="w-12 px-4 py-4 text-center cursor-pointer" onClick={handleToggleSelection}>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleToggleSelection}
          onClick={handleToggleSelection}
          className="w-5 h-5 rounded border-gray-300 cursor-pointer"
          aria-label={`Select ${product.productName}`}
        />
      </td>

      {/* Editable Cells */}
      {cellFields.map((field) => {
        const value = getCellValue(field.key);
        const hasError = productErrors[field.key];
        const isChanged = productChanges[field.key] !== undefined;

        return (
          <td
            key={field.key}
            className={`px-4 py-4 text-sm whitespace-normal ${
              isChanged ? "bg-yellow-50" : ""
            } ${hasError ? "border-l-2 border-red-500" : ""} ${
              field.type === "checkbox" ? "text-center cursor-pointer" : "cursor-pointer"
            }`}
            onClick={() => handleCellClick(field.key, field.type)}
          >
            {editingField === field.key ? (
              <InlineEditor
                value={value}
                fieldType={field.type}
                fieldName={field.key}
                options={field.options}
                onSave={(newValue) => handleCellChange(field.key, newValue)}
                onCancel={() => setEditingField(null)}
                autoFocus
              />
            ) : (
              <div className={`flex ${field.type === "checkbox" ? "justify-center" : "justify-between"} items-center`}>
                <span className="text-gray-700 line-clamp-2">
                  {field.type === "checkbox" ? (
                    <span className="inline-flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={value}
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCellClick(field.key, field.type);
                        }}
                        className="w-4 h-4 pointer-events-auto cursor-pointer"
                      />
                      {value ? "Yes" : "No"}
                    </span>
                  ) : (
                    getDisplayValue(value, field.type)
                  )}
                </span>
                {isChanged && !field.type === "checkbox" && (
                  <span className="ml-2 text-xs font-bold text-blue-600 shrink-0">●</span>
                )}
              </div>
            )}
          </td>
        );
      })}

      {/* Change Indicator */}
      <td className="px-4 py-4">
        {hasChanges && <ChangeIndicator count={Object.keys(productChanges).length} />}
      </td>
    </tr>
  );
}
