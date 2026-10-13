"use client";
import { useState } from "react";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";

/**
 * ValidationErrorSummary - Displays validation errors for products
 */
export default function ValidationErrorSummary({ errors, products }) {
  const [expanded, setExpanded] = useState(true);

  const errorEntries = Object.entries(errors).map(([productId, fieldErrors]) => {
    const product = products.find((p) => p._id === productId);
    return { productId, product, fieldErrors };
  });

  return (
    <div className="border border-red-200 rounded-lg bg-red-50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-100 transition"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <div className="text-left">
            <p className="font-bold text-red-900">
              {errorEntries.length} product(s) with validation errors
            </p>
            <p className="text-sm text-red-700">
              Please fix these errors before saving
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="text-red-600" size={20} />
        ) : (
          <ChevronDown className="text-red-600" size={20} />
        )}
      </button>

      {expanded && (
        <div className="border-t border-red-200 p-4 space-y-4">
          {errorEntries.map(({ productId, product, fieldErrors }) => (
            <div key={productId} className="bg-white rounded p-3 border border-red-200">
              <p className="font-medium text-gray-900 mb-2">
                {product?.productName || "Unknown Product"}
              </p>
              <ul className="text-sm text-red-700 space-y-1 ml-4">
                {Object.entries(fieldErrors).map(([field, message]) => (
                  <li key={field} className="list-disc">
                    {message}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
