"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { getCategories, getProductById, updateProduct } from "@/lib/api";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;
  const router = useRouter();
  
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data and categories on load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          getCategories(),
          getProductById(id)
        ]);
        
        if (catRes.success) setCategories(catRes.data);
        if (prodRes.success) setProductData(prodRes.data);
      } catch (err) {
        console.error("Failed to load data", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    try {
      // Send the PUT request to update the product
      const res = await updateProduct(id, formData);
      if (res.success) {
        alert("Product updated successfully!");
        router.push("/admin/products");
      } else {
        alert(res.error || "Failed to update product");
      }
    } catch (err) {
      console.error(err);
      alert("Error updating product. Ensure all fields are filled correctly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[50vh]">
        <div className="animate-pulse text-[#0082A4] font-medium tracking-widest">Loading product details...</div>
      </div>
    );
  }

  if (!productData) {
    return <div className="p-8 text-red-500 font-medium">Product not found.</div>;
  }

  return (
    <div className="max-w-5xl mx-auto font-mona p-4 lg:p-8">
      {/* Top Navigation */}
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      {/* Page Header */}
      <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
          <Pencil size={24} strokeWidth={1.5} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Edit Product</h1>
          <p className="text-sm text-gray-500">Update details, categorization, or media for <span className="font-bold text-[#0082A4]">{productData.designCode}</span>.</p>
        </div>
      </div>

      {/* Render the Reusable Form pre-filled with data */}
      <ProductForm 
        initialData={productData}
        categories={categories} 
        onSubmit={handleSubmit} 
        isLoading={isSubmitting} 
      />
    </div>
  );
}