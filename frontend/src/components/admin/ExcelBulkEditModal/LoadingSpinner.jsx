"use client";
import { Loader2 } from "lucide-react";

/**
 * LoadingSpinner - Animated loading indicator
 */
export default function LoadingSpinner({ size = "medium", text }) {
  const sizes = {
    small: "w-6 h-6",
    medium: "w-10 h-10",
    large: "w-16 h-16",
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
      {text && <p className="text-sm text-gray-600">{text}</p>}
    </div>
  );
}
