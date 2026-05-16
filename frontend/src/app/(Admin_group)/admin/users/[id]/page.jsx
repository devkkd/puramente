"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  ShoppingBag, 
  Mail, 
  Phone, 
  Building2, 
  Globe, 
  MapPin, 
  Calendar,
  User as UserIcon,
  PackageX
} from "lucide-react";
import { getUserProfile, getAdminUserCart } from "@/lib/api";

export default function AdminUserViewPage() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, cartRes] = await Promise.all([
          getUserProfile(id),
          getAdminUserCart(id)
        ]);
        
        if (userRes.success) setUser(userRes.data);
        if (cartRes.success) setCart(cartRes.data);
      } catch (error) {
        console.error("Failed to fetch user data", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
      <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Profile...</p>
    </div>
  );
  
  if (!user) return (
    <div className="p-8 flex flex-col items-center justify-center min-h-[50vh] text-center">
      <UserIcon size={48} className="text-gray-300 mb-4" />
      <h2 className="text-xl font-bold text-gray-900 mb-2">User Not Found</h2>
      <Link href="/admin/users" className="text-[#0082A4] hover:underline font-medium">Return to Directory</Link>
    </div>
  );

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* Top Navigation */}
      <Link href="/admin/users" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-bold tracking-wide transition-colors">
        <ArrowLeft size={16} /> Back to Users Directory
      </Link>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 bg-gradient-to-br from-[#E2FCFF] to-white border border-[#0082A4]/20 text-[#0082A4] rounded-full flex items-center justify-center shrink-0 shadow-sm">
            <UserIcon size={32} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">
              {user.fullName}
            </h1>
            <p className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
              <Calendar size={14} /> 
              Joined {new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Quick Cart Stat Badge */}
        <div className={`flex items-center gap-4 px-6 py-4 rounded-xl border ${cart?.items?.length > 0 ? "bg-[#E2FCFF]/50 border-[#0082A4]/20" : "bg-gray-50 border-gray-200"}`}>
          <div className={`p-2 rounded-lg ${cart?.items?.length > 0 ? "bg-[#0082A4] text-white" : "bg-gray-200 text-gray-500"}`}>
            <ShoppingBag size={20} />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Cart Status</span>
            <span className={`text-sm font-bold ${cart?.items?.length > 0 ? "text-[#0082A4]" : "text-gray-600"}`}>
              {cart?.items?.length || 0} Items Active
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: PROFILE INFO --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6">Contact Details</h2>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#F4f9fa] flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-[#0082A4]" />
                </div>
                <div className="flex flex-col justify-center min-h-[40px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Email</span>
                  <a href={`mailto:${user.email}`} className="hover:text-[#0082A4] transition-colors truncate font-medium text-gray-900">{user.email}</a>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#F4f9fa] flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#0082A4]" />
                </div>
                <div className="flex flex-col justify-center min-h-[40px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Phone / WhatsApp</span>
                  <span className="font-medium text-gray-900">{user.whatsappNo || <span className="text-gray-400 italic font-normal">Not provided</span>}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#F4f9fa] flex items-center justify-center shrink-0">
                  <Building2 size={18} className="text-[#0082A4]" />
                </div>
                <div className="flex flex-col justify-center min-h-[40px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Company</span>
                  <span className="font-medium text-gray-900">{user.companyName || <span className="text-gray-400 italic font-normal">Not provided</span>}</span>
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#F4f9fa] flex items-center justify-center shrink-0">
                  <Globe size={18} className="text-[#0082A4]" />
                </div>
                <div className="flex flex-col justify-center min-h-[40px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Website</span>
                  {user.companyWebsite ? (
                    <a href={user.companyWebsite.startsWith('http') ? user.companyWebsite : `https://${user.companyWebsite}`} target="_blank" rel="noreferrer" className="hover:text-[#0082A4] transition-colors truncate font-medium text-gray-900">
                      {user.companyWebsite}
                    </a>
                  ) : (
                    <span className="text-gray-400 italic font-normal">Not provided</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-start gap-4 text-sm text-gray-700">
                <div className="w-10 h-10 rounded-full bg-[#F4f9fa] flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#0082A4]" />
                </div>
                <div className="flex flex-col justify-center min-h-[40px]">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Location</span>
                  <span className="font-medium text-gray-900">{user.country || <span className="text-gray-400 italic font-normal">Not provided</span>}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: ACTIVE CART --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Current Cart Contents</h2>
          </div>
          
          {!cart || !cart.items || cart.items.length === 0 ? (
            <div className="p-16 flex flex-col items-center justify-center text-center bg-gray-50/30">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <PackageX size={32} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Cart is Empty</h3>
              <p className="text-sm text-gray-500 max-w-sm">This user currently has no items saved in their cart for a price request.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                  <tr>
                    <th className="p-5 font-semibold">Product</th>
                    <th className="p-5 font-semibold">Specifications</th>
                    <th className="p-5 font-semibold text-right">Desired Qty</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {cart.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#F4f9fa]/50 transition-colors">
                      <td className="p-5 flex items-center gap-4">
                        {/* Product Image */}
                        <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm shrink-0 overflow-hidden">
                          {item.product?.imageUrl ? (
                            <img 
                              src={item.product.imageUrl} 
                              alt={item.product?.productName} 
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <span className="text-[10px] text-gray-300">No Image</span>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 text-base">{item.product?.productName}</p>
                          <p className="font-mono text-xs font-semibold text-gray-600 bg-gray-100 px-2.5 py-1 rounded-md border border-gray-200 mt-1 inline-block">
                            {item.product?.designCode}
                          </p>
                        </div>
                      </td>
                      <td className="p-5 align-middle">
                        <div className="space-y-1.5">
                          <p className="text-gray-900 text-sm"><span className="text-gray-400 font-medium mr-2 text-xs uppercase tracking-wider">Metal:</span> <span className="font-bold">{item.metalType}</span></p>
                          <p className="text-gray-900 text-sm"><span className="text-gray-400 font-medium mr-2 text-xs uppercase tracking-wider">Finish:</span> <span className="font-bold">{item.customFinish}</span></p>
                        </div>
                      </td>
                      <td className="p-5 align-middle text-right">
                        <span className="inline-flex items-center text-xs font-bold text-[#0082A4] bg-[#E2FCFF] px-3 py-1.5 rounded-lg border border-[#0082A4]/10">
                          {item.quantityBand}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}