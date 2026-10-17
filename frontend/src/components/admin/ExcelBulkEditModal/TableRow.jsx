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
  const { changes, validationErrors, categories } = useSelector(
    (state) => state.excelBulkEdit
  );

  const [editingField, setEditingField] = useState(null);
  const productChanges = changes[product._id] || {};
  const productErrors = validationErrors[product._id] || {};
  const hasChanges = Object.keys(productChanges).length > 0;

  // Handle checkbox change - Direct dispatch
  const handleCheckboxChange = (e) => {
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

  const handleCellClick = (fieldKey) => {
    setEditingField(fieldKey);
  };

  const trClassName = bgColor + (hasError ? " border-l-4 border-red-500" : "") + " hover:bg-blue-50 transition";
  
  const tdEditorClassName = (field) => {
    let classes = "px-4 py-4 text-sm whitespace-normal";
    if (field.key in productChanges) classes += " bg-yellow-50";
    if (field.key in productErrors) classes += " border-l-2 border-red-500";
    if (field.type === "checkbox") classes += " text-center cursor-pointer";
    else classes += " cursor-pointer hover:bg-gray-100";
    classes += " transition";
    return classes;
  };

  return (
    <tr className={trClassName}>
      {/* Checkbox - Select Row */}
      <td className="w-12 px-4 py-4 text-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleCheckboxChange}
          className="w-5 h-5 rounded border-gray-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition"
          aria-label={`Select ` + product.productName}
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
            className={tdEditorClassName(field)}
            onClick={() => handleCellClick(field.key)}
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
              <div className={(field.type === "checkbox" ? "flex justify-center" : "flex justify-between") + " items-center gap-2"}>
                <span className="text-gray-700 line-clamp-2">
                  {field.type === "checkbox" ? (
                    <span className="inline-flex items-center gap-2 font-medium">
                      <input
                        type="checkbox"
                        checked={value}
                        readOnly
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCheckboxChange(e);
                        }}
                        className="w-4 h-4 pointer-events-auto cursor-pointer"
                      />
                      {value ? "Yes" : "No"}
                    </span>
                  ) : (
                    getDisplayValue(value, field.type)
                  )}
                </span>
                {isChanged && field.type !== "checkbox" && (
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

