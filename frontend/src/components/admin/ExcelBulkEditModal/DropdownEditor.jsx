"use client";
import { useEffect, useRef } from "react";

/**
 * DropdownEditor - Inline dropdown/select editor
 */
export default function DropdownEditor({
  value,
  options,
  onSave,
  onCancel,
  autoFocus,
}) {
  const selectRef = useRef(null);

  useEffect(() => {
    if (autoFocus && selectRef.current) {
      selectRef.current.focus();
    }
  }, [autoFocus]);

  const handleChange = (e) => {
    onSave(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onCancel();
    }
  };

  return (
    <select
      ref={selectRef}
      defaultValue={value || ""}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      className="w-full px-2 py-1 border-2 border-blue-500 rounded bg-white text-gray-900 focus:outline-none"
    >
      <option value="">-- Select --</option>
      {options &&
        options.map((opt) => (
          <option key={opt._id} value={opt._id}>
            {opt.name}
          </option>
        ))}
    </select>
  );
}
