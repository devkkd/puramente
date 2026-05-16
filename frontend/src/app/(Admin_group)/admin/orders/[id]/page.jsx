"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Mail, Phone, Globe, MapPin, Building2, Calendar } from "lucide-react";
import Link from "next/link";
import { getAdminOrderById, updateOrderStatus } from "@/lib/api";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getAdminOrderById(id);
        if (res.success) {
          setOrder(res.data);
          setStatus(res.data.status || "Pending");
        }
      } catch (error) {
        console.error("Failed to fetch order", error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchOrder();
  }, [id]);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    try {
      await updateOrderStatus(id, newStatus);
      // Optional: replace alert with a subtle toast notification if you have one
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const getStatusColor = (currentStatus) => {
    switch (currentStatus) {
      case "Pending": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Reviewed": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Fulfilled": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading) return (
    <div className="p-8 flex items-center justify-center min-h-[50vh]">
      <div className="animate-pulse text-[#0082A4] font-medium tracking-widest">Loading request details...</div>
    </div>
  );
  
  if (!order) return <div className="p-8 text-red-500 font-medium">Order not found.</div>;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* Top Navigation */}
      <Link href="/admin/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#0082A4] mb-6 text-sm font-medium transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Request <span className="text-[#0082A4]">#{order._id.toString().slice(-6).toUpperCase()}</span>
          </h1>
          <p className="text-sm text-gray-500 flex items-center gap-1.5">
            <Calendar size={14} /> 
            Submitted on {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
          <label className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Status:</label>
          <select 
            value={status} 
            onChange={handleStatusChange}
            className={`border rounded-lg px-3 py-1.5 text-sm font-bold shadow-sm focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 cursor-pointer transition-colors ${getStatusColor(status)}`}
          >
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* --- LEFT COLUMN: CONTACT INFO --- */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-5">Customer Info</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-lg font-bold text-gray-900">{order.contactDetails?.fullName}</p>
                <p className="text-sm text-[#0082A4] font-medium">{order.userId ? "Registered User" : "Guest Request"}</p>
              </div>

              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${order.contactDetails?.email}`} className="hover:text-[#0082A4] transition-colors">{order.contactDetails?.email}</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <Phone size={16} className="text-gray-400" />
                  <span>{order.contactDetails?.whatsappNo}</span>
                </div>
                {order.contactDetails?.companyName && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Building2 size={16} className="text-gray-400" />
                    <span>{order.contactDetails.companyName}</span>
                  </div>
                )}
                {order.contactDetails?.companyWebsite && (
                  <div className="flex items-center gap-3 text-sm text-gray-700">
                    <Globe size={16} className="text-gray-400" />
                    <a href={order.contactDetails.companyWebsite} target="_blank" rel="noreferrer" className="hover:text-[#0082A4] truncate">
                      {order.contactDetails.companyWebsite}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-3 text-sm text-gray-700">
                  <MapPin size={16} className="text-gray-400" />
                  <span>{order.contactDetails?.country}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Message Card */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Client Message</h2>
            <div className="bg-[#F4f9fa] p-4 rounded-xl border border-[#E2FCFF]">
              <p className="text-sm text-gray-700 leading-relaxed italic">
                "{order.contactDetails?.message}"
              </p>
            </div>
          </div>
        </div>

        {/* --- RIGHT COLUMN: REQUESTED ITEMS --- */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-fit">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Requested Items</h2>
            <span className="bg-[#0082A4] text-white text-xs font-bold px-3 py-1 rounded-full">
              {order.items?.length} Styles
            </span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white text-xs text-gray-400 uppercase border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold">Product</th>
                  <th className="p-5 font-semibold">Specifications</th>
                  <th className="p-5 font-semibold text-right">Desired Qty</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {order.items?.map((item, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 flex items-center gap-4">
                      {/* Product Image */}
                      <div className="w-16 h-16 bg-white border border-gray-100 rounded-lg flex items-center justify-center p-1 shadow-sm shrink-0">
                        {item.product?.imageUrl ? (
                          <img 
                            src={item.product.imageUrl} 
                            alt={item.productName} 
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-[10px] text-gray-300">No Image</span>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-base">{item.productName}</p>
                        <p className="text-xs font-medium text-[#0082A4] bg-[#E2FCFF] inline-block px-2 py-0.5 rounded mt-1">
                          SKU: {item.designCode}
                        </p>
                      </div>
                    </td>
                    <td className="p-5 align-middle">
                      <div className="space-y-1">
                        <p className="text-gray-900 font-medium"><span className="text-gray-400 font-normal mr-1">Metal:</span> {item.metalType}</p>
                        <p className="text-gray-900 font-medium"><span className="text-gray-400 font-normal mr-1">Finish:</span> {item.customFinish}</p>
                      </div>
                    </td>
                    <td className="p-5 align-middle text-right">
                      <span className="font-bold text-gray-900 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200">
                        {item.quantityBand}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
      </div>
    </div>
  );
}