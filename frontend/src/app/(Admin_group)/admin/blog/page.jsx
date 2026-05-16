"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getBlogs, deleteBlog } from "@/lib/api";
import { Plus, Trash2, Pencil, FileText, Search } from "lucide-react";

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await getBlogs();
      if (res.success) setBlogs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog? This cannot be undone.")) return;
    try {
      const res = await deleteBlog(id);
      if (res.success) {
        setBlogs(blogs.filter(b => b._id !== id));
      }
    } catch (error) {
      alert("Error deleting blog");
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-mona">
      {/* Header */}
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center">
            <FileText size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
            <p className="text-sm text-gray-500">Manage your published articles and news.</p>
          </div>
        </div>
        <Link href="/admin/blog/new" className="flex items-center gap-2 bg-[#0082A4] text-white px-5 py-3 rounded-xl hover:bg-[#006a86] font-bold text-sm shadow-sm transition-colors">
          <Plus size={18} /> Add Blog
        </Link>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Blogs...</p>
        </div>
      ) : blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Blogs Found</h2>
          <p className="text-gray-500 max-w-md mb-6">You haven't published any blogs yet.</p>
          <Link href="/admin/blog/new" className="bg-[#0082A4] text-white px-6 py-3 rounded-xl hover:bg-[#006a86] transition-colors font-bold text-sm">
            Write your first post
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
              <tr>
                <th className="p-5 font-semibold">Cover Image</th>
                <th className="p-5 font-semibold">Title</th>
                <th className="p-5 font-semibold">Published Date</th>
                <th className="p-5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-50">
              {blogs.map(blog => (
                <tr key={blog._id} className="hover:bg-[#F4f9fa]/50 transition-colors group">
                  <td className="p-5 w-32 align-middle">
                    <div className="w-20 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                      <img src={blog.imageUrl} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                    </div>
                  </td>
                  <td className="p-5 align-middle">
                    <p className="font-bold text-gray-900 text-base mb-1">{blog.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{blog.excerpt}</p>
                  </td>
                  <td className="p-5 align-middle text-gray-500 font-medium">
                    {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="p-5 align-middle text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        href={`/admin/blog/edit/${blog._id}`}
                        className="p-2 text-gray-400 hover:text-[#0082A4] hover:bg-[#E2FCFF] rounded-lg transition-colors"
                        title="Edit Blog"
                      >
                        <Pencil size={18} />
                      </Link>
                      <button 
                        onClick={() => handleDelete(blog._id)} 
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Blog"
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
      )}
    </div>
  );
}