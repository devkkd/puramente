"use client";
import { useEffect, useRef } from "react";

/**
 * KeywordsEditor - Inline editor for comma-separated keywords
 */
export default function KeywordsEditor({
  value,
  onSave,
  onCancel,
  autoFocus,
}) {
  const inputRef = useRef(null);

  const displayValue = Array.isArray(value) ? value.join(", ") : value || "";

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const keywords = inputRef.current.value
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k);
      onSave(keywords);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    const keywords = inputRef.current.value
      .split(",")
      .map((k) => k.trim())
      .filter((k) => k);
    onSave(keywords);
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="text"
        defaultValue={displayValue}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        className="w-full px-2 py-1 border-2 border-blue-500 rounded bg-white text-gray-900 focus:outline-none"
        placeholder="Separate keywords with commas"
      />
      <p className="text-xs text-gray-500 mt-1">Comma-separated keywords</p>
    </div>
  );
}
