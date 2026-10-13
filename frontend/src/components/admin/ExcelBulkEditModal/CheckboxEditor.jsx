"use client";

/**
 * CheckboxEditor - Inline checkbox toggle
 */
export default function CheckboxEditor({ value, onSave }) {
  return (
    <input
      type="checkbox"
      defaultChecked={value}
      onChange={(e) => onSave(e.target.checked)}
      className="w-5 h-5 rounded cursor-pointer"
    />
  );
}
