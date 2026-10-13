"use client";

/**
 * ChangeIndicator - Badge showing number of changes in a row
 */
export default function ChangeIndicator({ count }) {
  if (!count) return null;

  return (
    <span className="inline-block bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full border border-yellow-300">
      {count} changed
    </span>
  );
}
