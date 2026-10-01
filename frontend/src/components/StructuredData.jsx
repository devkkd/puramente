// components/StructuredData.jsx - Renders JSON-LD structured data for SEO

export default function StructuredData({ schema }) {
  if (!schema) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
