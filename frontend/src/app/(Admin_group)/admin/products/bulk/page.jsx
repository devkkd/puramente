"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, UploadCloud, FileSpreadsheet, Folder as FolderIcon } from "lucide-react";
import { bulkUploadProducts } from "@/lib/api";

export default function BulkUploadPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setLogs(["Preparing files..."]);

    const formData = new FormData(e.target);

    try {
      setLogs(prev => [...prev, "Uploading files and processing images via Cloudflare... (Since you have 1300+ images, this may take 5-10 minutes. Do not close this page!)"]);
      
      const data = await bulkUploadProducts(formData);
      
      if (data.success) {
        setLogs(prev => [...prev, `✅ Success! Inserted ${data.count} products.`]);
        if (data.errors && data.errors.length > 0) {
          setLogs(prev => [...prev, "⚠️ Some items were skipped:", ...data.errors]);
        }
        alert(`Successfully uploaded ${data.count} products! Check logs below.`);
      } else {
        setLogs(prev => [...prev, `❌ Error: ${data.error}`]);
        alert(data.error || "Failed to bulk upload");
      }
    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "❌ Network error occurred or request timed out."]);
      alert("Error submitting form. The payload might be too large or the server timed out.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto font-mona p-4 lg:p-8">
      {/* Top Navigation */}
      <Link href="/admin/products" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Products
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
        
        {/* Header */}
        <div className="flex items-start gap-4 mb-8 border-b border-gray-100 pb-8">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0 mt-1">
            <UploadCloud size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Bulk Upload Products
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl">
              <strong>Instructions:</strong> Put all your category image folders (Necklaces, Bracelets, etc.) into ONE main folder on your computer. Upload the Excel file, then select that MAIN image folder below.
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          
          <div className="bg-[#F4f9fa] p-6 rounded-2xl border border-[#E2FCFF] shadow-sm">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
              <FileSpreadsheet size={20} className="text-[#0082A4]" />
              1. Upload Excel File (.xlsx)
            </label>
            <input 
              type="file" 
              name="excel" 
              accept=".xlsx, .xls, .csv" 
              required 
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E2FCFF] file:text-[#0082A4] hover:file:bg-[#c9f8fc]" 
            />
          </div>

          <div className="bg-[#F4f9fa] p-6 rounded-2xl border border-[#E2FCFF] shadow-sm">
            <label className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-4">
              <FolderIcon size={20} className="text-[#0082A4]" />
              2. Select Master Image Folder
            </label>
            <input 
              type="file" 
              name="images" 
              webkitdirectory="true" 
              directory="true"
              multiple 
              required 
              className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#E2FCFF] file:text-[#0082A4] hover:file:bg-[#c9f8fc]" 
            />
          </div>
          
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-[#0082A4] text-white py-4 rounded-xl font-bold tracking-widest uppercase hover:bg-[#006a86] disabled:opacity-50 transition-colors shadow-md"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin"></span>
                  Uploading to Server & Cloudflare...
                </>
              ) : (
                <>
                  <UploadCloud size={20} />
                  Start Bulk Upload
                </>
              )}
            </button>
          </div>
        </form>

        {logs.length > 0 && (
          <div className="mt-8 bg-gray-900 text-green-400 p-5 rounded-2xl font-mono text-xs overflow-y-auto max-h-60 space-y-1.5 shadow-inner">
            {logs.map((log, i) => (
              <div key={i} className={log.includes("❌") || log.includes("⚠️") ? "text-yellow-400" : ""}>
                <span className="opacity-50 mr-2">{">"}</span> {log}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}