"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FolderPlus } from "lucide-react";
import { createCategory } from "@/lib/api";
import CategoryForm from "@/components/admin/CategoryForm";

export default function AddCategoryPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await createCategory(formData);
      if (data.success) {
        router.push("/admin/categories");
      } else {
        alert(data.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-mona p-4 lg:p-8">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Categories
      </Link>

      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
          <FolderPlus size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Category</h1>
          <p className="text-sm text-gray-500">Create a new product collection and set its display names and banners.</p>
        </div>
      </div>
      
      <CategoryForm 
        onSubmit={handleSubmit} 
        isLoading={loading} 
      />
    </div>
  );
}