"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { getCategoryById, updateCategory } from "@/lib/api";
import CategoryForm from "@/components/admin/CategoryForm";

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await getCategoryById(id);
        if (res.success) setCategoryData(res.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      const res = await updateCategory(id, formData);
      if (res.success) {
        alert("Category updated successfully!");
        router.push("/admin/categories");
      } else {
        alert(res.error || "Failed to update category");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating category. Ensure all fields are filled correctly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-[#0082A4] font-medium tracking-widest">Loading category details...</div>
      </div>
    );
  }

  if (!categoryData) return <div className="p-8 text-red-500 font-medium">Category not found.</div>;

  return (
    <div className="max-w-7xl mx-auto font-mona p-4 lg:p-8">
      <Link href="/admin/categories" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Categories
      </Link>

      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
          <Pencil size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Category</h1>
          <p className="text-sm text-gray-500">Update details and media for <span className="font-bold text-[#0082A4]">{categoryData.name}</span>.</p>
        </div>
      </div>

      <CategoryForm 
        initialData={categoryData}
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}