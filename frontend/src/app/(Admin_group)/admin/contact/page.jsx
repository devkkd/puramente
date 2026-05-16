"use client";

import React, { useState, useEffect } from "react";
import { getAdminContactEnquiries, updateContactEnquiryStatus } from "@/lib/api";
import { 
  Mail, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Search, 
  Phone,
  Building,
  Globe,
  Package,
  MessageSquare
} from "lucide-react";

export default function AdminContactPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const res = await getAdminContactEnquiries();
      if (res.success) setEnquiries(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateContactEnquiryStatus(id, newStatus);
      if (res.success) {
        setEnquiries(prev => prev.map(enq => enq._id === id ? { ...enq, status: newStatus } : enq));
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
    // Auto-mark as read when expanding an unread message
    const enquiry = enquiries.find(e => e._id === id);
    if (enquiry && expandedId !== id && enquiry.status === "Unread") {
      handleStatusChange(id, "Read");
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "Unread":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100"><Clock size={12}/> New / Unread</span>;
      case "Read":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"><CheckCircle2 size={12}/> Read</span>;
      case "Replied":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100"><CheckCircle2 size={12}/> Replied</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status}</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto font-mona">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <Mail size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Contact Enquiries
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {enquiries.filter(e => e.status === "Unread").length} New
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Manage messages and trade enquiries submitted via the Contact Us page.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Enquiries...</p>
        </div>
      ) : enquiries.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Messages Yet</h2>
          <p className="text-gray-500 max-w-md">When clients fill out the contact form, their messages will appear here.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Sender</th>
                  <th className="p-5 font-semibold">Company</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Message</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {enquiries.map((enq) => (
                  <React.Fragment key={enq._id}>
                    {/* VISIBLE ROW */}
                    <tr 
                      onClick={() => toggleExpand(enq._id)}
                      className={`hover:bg-[#F4f9fa]/50 transition-colors cursor-pointer group ${enq.status === "Unread" ? "bg-red-50/20" : ""}`}
                    >
                      <td className="p-5 align-middle text-gray-500">
                        {new Date(enq.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 align-middle">
                        <p className="font-bold text-gray-900">{enq.fullName}</p>
                        <p className="text-xs text-gray-500">{enq.email}</p>
                      </td>
                      <td className="p-5 align-middle">
                        {enq.companyName ? (
                          <span className="font-medium text-gray-700">{enq.companyName}</span>
                        ) : (
                          <span className="text-gray-400 italic">N/A</span>
                        )}
                      </td>
                      <td className="p-5 align-middle">
                        {getStatusBadge(enq.status)}
                      </td>
                      <td className="p-5 align-middle text-right">
                        <button className="p-2 bg-gray-50 text-gray-500 rounded-lg group-hover:bg-[#0082A4] group-hover:text-white transition-colors">
                          <ChevronDown size={18} className={`transition-transform duration-300 ${expandedId === enq._id ? "rotate-180" : ""}`} />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS PANEL */}
                    {expandedId === enq._id && (
                      <tr className="bg-[#F4f9fa] border-b border-gray-100">
                        <td colSpan="5" className="p-0">
                          <div className="p-6 md:p-8 animate-in slide-in-from-top-2 fade-in duration-200">
                            
                            {/* Action Bar */}
                            <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-[#0082A4]/20 mb-6 shadow-sm">
                              <span className="text-sm font-bold text-gray-900">Update Status:</span>
                              <div className="flex gap-2">
                                <button onClick={() => handleStatusChange(enq._id, "Unread")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${enq.status === "Unread" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mark Unread</button>
                                <button onClick={() => handleStatusChange(enq._id, "Read")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${enq.status === "Read" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mark Read</button>
                                <button onClick={() => handleStatusChange(enq._id, "Replied")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${enq.status === "Replied" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mark Replied</button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              
                              {/* Column 1: Contact Info */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Sender Details</h4>
                                  <div className="space-y-3 text-sm text-gray-700 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <p className="flex items-center gap-3"><Phone size={16} className="text-[#0082A4]"/> {enq.phone}</p>
                                    <p className="flex items-center gap-3"><Mail size={16} className="text-[#0082A4]"/> <a href={`mailto:${enq.email}`} className="text-[#0082A4] hover:underline font-medium">{enq.email}</a></p>
                                    <p className="flex items-center gap-3"><Globe size={16} className="text-[#0082A4]"/> {enq.country || "Not specified"}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2: Business Profile */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Business Profile</h4>
                                  <div className="space-y-4 text-sm bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                    <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                                      <Building size={16} className="text-[#0082A4]"/> 
                                      <span className="font-bold text-gray-900">{enq.companyName || "N/A"}</span>
                                    </div>
                                    <div className="flex items-center gap-3 border-b border-gray-50 pb-3">
                                      <Globe size={16} className="text-[#0082A4]"/> 
                                      {enq.companyWebsite ? (
                                        <a href={enq.companyWebsite.startsWith('http') ? enq.companyWebsite : `https://${enq.companyWebsite}`} target="_blank" rel="noreferrer" className="text-[#0082A4] hover:underline truncate">
                                          {enq.companyWebsite}
                                        </a>
                                      ) : (
                                        <span className="text-gray-400 italic">No website provided</span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                      <Package size={16} className="text-[#0082A4]"/> 
                                      <span className="text-gray-600">Volume: <span className="font-bold text-gray-900">{enq.orderVolume || "N/A"}</span></span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Column 3: The Message */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <MessageSquare size={14}/> Client Message
                                  </h4>
                                  <div className="bg-white p-5 rounded-xl border border-gray-100 text-sm text-gray-800 leading-relaxed shadow-sm min-h-[150px] whitespace-pre-wrap">
                                    {enq.message}
                                  </div>
                                  
                                  <div className="mt-4 text-right">
                                    <a 
                                      href={`mailto:${enq.email}?subject=Re: Your enquiry at Puramente Jewel`}
                                      className="inline-flex items-center gap-2 bg-[#0082A4] text-white px-5 py-2.5 rounded-lg text-sm font-bold hover:bg-[#006a86] transition-colors shadow-sm"
                                    >
                                      <Mail size={16} /> Reply via Email
                                    </a>
                                  </div>
                                </div>
                              </div>

                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}