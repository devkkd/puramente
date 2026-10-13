"use client";
import TextEditor from "./TextEditor";
import CheckboxEditor from "./CheckboxEditor";
import DropdownEditor from "./DropdownEditor";
import KeywordsEditor from "./KeywordsEditor";

/**
 * InlineEditor - Routes to appropriate editor based on field type
 */
export default function InlineEditor({
  value,
  fieldType,
  fieldName,
  options,
  onSave,
  onCancel,
  autoFocus,
}) {
  switch (fieldType) {
    case "text":
      return (
        <TextEditor
          value={value}
          onSave={onSave}
          onCancel={onCancel}
          autoFocus={autoFocus}
        />
      );
    case "checkbox":
      return (
        <CheckboxEditor value={value} onSave={onSave} />
      );
    case "dropdown":
      return (
        <DropdownEditor
          value={value}
          options={options}
          onSave={onSave}
          onCancel={onCancel}
          autoFocus={autoFocus}
        />
      );
    case "keywords":
      return (
        <KeywordsEditor
          value={value}
          onSave={onSave}
          onCancel={onCancel}
          autoFocus={autoFocus}
        />
      );
    default:
      return <span className="text-gray-700">{value || "-"}</span>;
  }
}
