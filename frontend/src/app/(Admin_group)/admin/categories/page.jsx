"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Tags, Search, Image as ImageIcon, Pencil, Trash2 } from "lucide-react";
import { getCategories } from "@/lib/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await getCategories();
      if (res.success) {
        setCategories(res.data || []);
      }
    } catch (err) {
      console.error("Failed to load categories", err);
    } finally {
      setLoading(false);
    }
  };

  // Optional: Add delete functionality here later if needed
  const handleDelete = (id) => {
    alert("Delete functionality to be connected to backend.");
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">

      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <Tags size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Categories
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {categories.length} Categories
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your jewelry collections and homepage banners.
            </p>
          </div>
        </div>

        <div>
          <Link
            href="/admin/categories/new"
            className="flex items-center gap-2 bg-[#0082A4] text-white px-5 py-3 rounded-xl hover:bg-[#006a86] transition-all shadow-sm text-sm font-bold tracking-wide"
          >
            <Plus size={18} />
            <span>Add Category</span>
          </Link>
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Categories...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Categories Found</h2>
          <p className="text-gray-500 max-w-md mb-6">
            You haven't created any categories yet. Add your first category to start organizing your products.
          </p>
          <Link
            href="/admin/categories/new"
            className="bg-[#0082A4] text-white px-6 py-3 rounded-xl hover:bg-[#006a86] transition-colors font-bold text-sm"
          >
            Create Category
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <div key={cat._id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group relative flex flex-col">

              {/* Image Container */}
              <div className="w-full h-48 bg-[#F4f9fa] rounded-xl mb-4 overflow-hidden relative flex items-center justify-center border border-gray-50">
                {cat.imageUrl ? (
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <ImageIcon size={32} className="text-gray-300" />
                )}

                {/* Overlay Actions */}
                <div className="absolute top-2 right-2 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Replace the Pencil button inside categories/page.jsx with this: */}
                  <Link
                    href={`/admin/categories/edit/${cat._id}`}
                    className="p-2 bg-white/90 backdrop-blur text-gray-700 hover:text-[#0082A4] rounded-lg shadow-sm transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button onClick={() => handleDelete(cat._id)} className="p-2 bg-white/90 backdrop-blur text-gray-700 hover:text-red-500 rounded-lg shadow-sm transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 flex flex-col">
                <h3 className="font-bold text-lg text-gray-900 mb-1">{cat.name}</h3>
                <div className="mt-auto pt-3 flex items-center justify-between border-t border-gray-50">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Home Display</span>
                  <span className="text-sm font-medium text-[#0082A4] bg-[#E2FCFF] px-2 py-1 rounded-md">
                    {cat.homeName || "N/A"}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}