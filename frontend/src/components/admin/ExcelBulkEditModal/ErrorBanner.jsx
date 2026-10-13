"use client";
import { useState } from "react";
import { AlertCircle, X, RotateCcw } from "lucide-react";

/**
 * ErrorBanner - Error message with retry capability
 */
export default function ErrorBanner({ error, onRetry }) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
      <div className="flex-1">
        <p className="font-medium text-red-900">Error saving changes</p>
        <p className="text-sm text-red-700 mt-1">{error}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-red-600 hover:text-red-700 font-medium text-sm whitespace-nowrap"
          >
            <RotateCcw size={16} className="inline mr-1" />
            Retry
          </button>
        )}
        <button
          onClick={() => setVisible(false)}
          className="text-red-600 hover:text-red-700 p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}
