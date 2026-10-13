"use client";
import { useEffect, useRef } from "react";

/**
 * TextEditor - Inline text input editor
 */
export default function TextEditor({
  value,
  onSave,
  onCancel,
  autoFocus,
}) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [autoFocus]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      onSave(inputRef.current.value);
    } else if (e.key === "Escape") {
      onCancel();
    }
  };

  const handleBlur = () => {
    onSave(inputRef.current.value);
  };

  return (
    <input
      ref={inputRef}
      type="text"
      defaultValue={value || ""}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      className="w-full px-2 py-1 border-2 border-blue-500 rounded bg-white text-gray-900 focus:outline-none"
      placeholder="Enter value..."
    />
  );
}
