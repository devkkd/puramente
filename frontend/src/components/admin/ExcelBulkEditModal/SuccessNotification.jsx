"use client";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Check, X } from "lucide-react";
import { clearSaveResult } from "@/redux/slices/excelBulkEditSlice";

/**
 * SuccessNotification - Success message banner with auto-dismiss
 */
export default function SuccessNotification({ result }) {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      dispatch(clearSaveResult());
    }, 4000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  if (!visible) return null;

  return (
    <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
      <Check className="text-green-600 shrink-0" size={20} />
      <div className="flex-1">
        <p className="font-medium text-green-900">
          Successfully updated {result?.updatedCount || 0} product(s)
        </p>
        {result?.failedCount > 0 && (
          <p className="text-sm text-green-800 mt-1">
            {result.failedCount} product(s) had errors
          </p>
        )}
      </div>
      <button
        onClick={() => {
          setVisible(false);
          dispatch(clearSaveResult());
        }}
        className="text-green-600 hover:text-green-700 p-1"
      >
        <X size={18} />
      </button>
    </div>
  );
}
