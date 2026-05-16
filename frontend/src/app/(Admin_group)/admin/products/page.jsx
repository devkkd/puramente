"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, UploadCloud, Package, Image as ImageIcon, Search, Pencil, Trash2, Filter } from "lucide-react";
// --- IMPORT 'api' TO MAKE SECURE DELETE REQUESTS ---
import { api, getProducts, getCategories } from "@/lib/api"; 

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Search and Filter State ---
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      
      if (prodRes.success) setProducts(prodRes.data || []);
      if (catRes.success) setCategories(catRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) return;
    
    try {
      // --- FIX: Use our configured API instance so the Admin Token is sent ---
      const res = await api.delete(`/products/${id}`);
      
      if (res.success) {
        setProducts(products.filter(p => p._id !== id));
      }
    } catch (error) {
      console.error("Delete Error:", error);
      alert(error.error || "Error deleting product.");
    }
  };

  // --- Derived State: Filtered Products ---
  const filteredProducts = products.filter(prod => {
    const matchesSearch = 
      prod.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.designCode.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesCategory = selectedCategory === "All" || prod.category?._id === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <Package size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Products Catalog
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {products.length} Items
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your jewelry inventory, design codes, and categories.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products/bulk"
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm text-sm font-bold"
          >
            <UploadCloud size={18} className="text-[#0082A4]" />
            <span className="hidden sm:inline">Bulk Upload</span>
          </Link>
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 bg-[#0082A4] text-white px-4 py-2.5 rounded-xl hover:bg-[#006a86] transition-all shadow-sm text-sm font-bold"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">Add Product</span>
          </Link>
        </div>
      </div>

      {/* --- SEARCH & FILTER BAR --- */}
      {!loading && products.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by product name or SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all shadow-sm"
            />
          </div>

          {/* Category Filter Dropdown */}
          <div className="relative min-w-[220px]">
            <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all shadow-sm appearance-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </div>
          </div>

        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Catalog...</p>
        </div>
      ) : products.length === 0 ? (
        // Empty State: No products exist in the database at all
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Package size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Products Found</h2>
          <p className="text-gray-500 max-w-md mb-6">
            Your catalog is currently empty. Start by adding a single product or use the bulk upload tool to import your spreadsheet.
          </p>
          <Link
            href="/admin/products/new"
            className="bg-[#0082A4] text-white px-6 py-3 rounded-xl hover:bg-[#006a86] transition-colors font-bold text-sm"
          >
            Add Your First Product
          </Link>
        </div>
      ) : filteredProducts.length === 0 ? (
        // Empty State: Products exist, but the search/filter returned no results
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No Matches Found</h2>
          <p className="text-gray-500 text-sm mb-4">
            We couldn't find any products matching your search or category filter.
          </p>
          <button 
            onClick={() => { setSearchQuery(""); setSelectedCategory("All"); }}
            className="text-[#0082A4] font-semibold text-sm hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        // Data Table
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold">Product</th>
                  <th className="p-5 font-semibold">Design Code</th>
                  <th className="p-5 font-semibold">Category</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredProducts.map((prod) => (
                  <tr key={prod._id} className="hover:bg-[#F4f9fa]/50 transition-colors group">
                    <td className="p-5 flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-14 h-14 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
                        {prod.imageUrl ? (
                          <img 
                            src={prod.imageUrl} 
                            alt={prod.productName} 
                            className="w-full h-full object-contain transition-transform group-hover:scale-110" 
                          />
                        ) : (
                          <ImageIcon size={20} className="text-gray-300" />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{prod.productName}</p>
                      </div>
                    </td>
                    <td className="p-5 align-middle">
                      <span className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200">
                        {prod.designCode}
                      </span>
                    </td>
                    <td className="p-5 align-middle">
                      <span className="inline-flex items-center text-xs font-bold text-[#0082A4] bg-[#E2FCFF] px-3 py-1 rounded-full">
                        {prod.category?.name || "Uncategorized"}
                      </span>
                    </td>
                    
                    {/* --- ACTION BUTTONS --- */}
                    <td className="p-5 align-middle text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link 
                          href={`/admin/products/edit/${prod._id}`}
                          className="p-2 text-gray-400 hover:text-[#0082A4] hover:bg-[#E2FCFF] rounded-lg transition-colors"
                          title="Edit Product"
                        >
                          <Pencil size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(prod._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}