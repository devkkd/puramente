"use client";

import React, { useState, useEffect } from "react";
import { UploadCloud, Trash2, Video, Image as ImageIcon, Camera, Plus } from "lucide-react";
import { addInstaPost, getInstaPosts, deleteInstaPost } from "@/lib/api";

export default function AdminInstaPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ icon: "reel", type: "video" });
  const [file, setFile] = useState(null);

  useEffect(() => { loadPosts(); }, []);

  const loadPosts = async () => {
    try {
      const res = await getInstaPosts();
      if (res.success) setPosts(res.data);
    } catch (err) {
      console.error("Error loading posts:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");
    
    setLoading(true);
    const data = new FormData();
    data.append("media", file);
    data.append("icon", formData.icon);
    data.append("type", formData.type);

    try {
      await addInstaPost(data);
      setFile(null);
      loadPosts();
    } catch (err) {
      alert("Failed to upload. Ensure file is under size limits.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      await deleteInstaPost(id);
      loadPosts();
    }
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <Camera size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Instagram Feed</h1>
            <p className="text-sm text-gray-500">Manage media shown on the home page feed.</p>
          </div>
        </div>
      </div>

      {/* --- UPLOAD FORM CARD --- */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6">Upload New Media</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-gray-700 mb-2">Select File</label>
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files[0])} 
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#0082A4] file:text-white hover:file:bg-[#006a86] cursor-pointer" 
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Media Type</label>
            <select className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#0082A4]" onChange={(e) => setFormData({...formData, type: e.target.value})}>
              <option value="video">Video (Reel)</option>
              <option value="image">Image (Carousel)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Overlay Icon</label>
            <select className="w-full border border-gray-200 p-2.5 rounded-xl text-sm focus:outline-none focus:border-[#0082A4]" onChange={(e) => setFormData({...formData, icon: e.target.value})}>
              <option value="reel">Reel Icon</option>
              <option value="carousel">Carousel Icon</option>
            </select>
          </div>

          <button disabled={loading} className="bg-[#0082A4] text-white py-2.5 rounded-xl hover:bg-[#006a86] transition-colors font-bold text-sm flex items-center justify-center gap-2">
            {loading ? "Uploading..." : <><Plus size={18}/> Add to Feed</>}
          </button>
        </form>
      </div>

      {/* --- GRID OF EXISTING POSTS --- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
        {posts.map((post) => (
          <div key={post._id} className="group bg-white p-3 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
            <div className="relative aspect-[4/5] bg-gray-50 rounded-xl overflow-hidden mb-3">
              {post.type === "video" ? (
                <Video className="w-full h-full p-10 text-gray-300" />
              ) : (
                <img src={post.mediaUrl} alt="post" className="w-full h-full object-cover" />
              )}
              {/* Delete Overlay */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button onClick={() => handleDelete(post._id)} className="bg-white text-red-500 p-3 rounded-full hover:bg-red-50 transition-colors">
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{post.type}</span>
              <span className={`text-[10px] font-bold uppercase ${post.icon === 'reel' ? 'text-purple-500' : 'text-blue-500'}`}>{post.icon}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}