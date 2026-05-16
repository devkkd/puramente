"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, PackagePlus } from "lucide-react";
import { getCategories, createProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function AddProductPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await getCategories();
        if (res.success) setCategories(res.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    fetchCats();
  }, []);

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      const data = await createProduct(formData);
      if (data.success) {
        alert("Product created successfully!");
        router.push("/admin/products");
      } else {
        alert(data.error || "Failed to create product");
      }
    } catch (err) {
      console.error(err);
      alert(err.error || "Error submitting form. Ensure all fields are filled correctly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto font-mona p-4 lg:p-8">
      {/* Top Navigation */}
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
          <PackagePlus size={28} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Add New Product</h1>
          <p className="text-sm text-gray-500">Create a single product listing for your catalog.</p>
        </div>
      </div>

      {/* Render the Reusable Form */}
      <ProductForm 
        categories={categories} 
        onSubmit={handleSubmit} 
        isLoading={loading} 
      />
    </div>
  );
}