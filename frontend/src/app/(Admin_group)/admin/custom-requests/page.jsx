"use client";

import React, { useState, useEffect } from "react";
import { getAdminCustomRequests, updateCustomRequestStatus, deleteAdminCustomRequest } from "@/lib/api";
import { 
  Wand2, 
  ChevronDown, 
  CheckCircle2, 
  Clock, 
  Search, 
  Image as ImageIcon,
  Mail,
  Phone,
  MapPin,
  Ruler,
  Trash2
} from "lucide-react";

export default function AdminCustomRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await getAdminCustomRequests();
      if (res.success) setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await updateCustomRequestStatus(id, newStatus);
      if (res.success) {
        // Update local state to reflect change immediately
        setRequests(prev => prev.map(req => req._id === id ? { ...req, status: newStatus } : req));
      }
    } catch (error) {
      alert("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this custom request?")) return;
    try {
      const res = await deleteAdminCustomRequest(id);
      if (res.success) {
        setRequests(prev => prev.filter(req => req._id !== id));
        if (expandedId === id) setExpandedId(null);
      }
    } catch (error) {
      alert("Failed to delete request.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const filteredRequests = requests.filter(req => {
    const matchesSearch = 
      req.clientInfo?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.clientInfo?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.metal?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.designNotes?.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesDate = true;
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      const reqDate = new Date(req.createdAt);
      if (reqDate < sDate) matchesDate = false;
    }
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      const reqDate = new Date(req.createdAt);
      if (reqDate > eDate) matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case "Pending":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-600 border border-red-100"><Clock size={12}/> New / Unread</span>;
      case "Reviewed":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"><CheckCircle2 size={12}/> Reviewed</span>;
      case "In Production":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100">In Production</span>;
      case "Fulfilled":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100">Fulfilled</span>;
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
            <Wand2 size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Bespoke Custom Requests
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {requests.filter(r => r.status === "Pending").length} New
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Review and manage bespoke jewelry manufacturing requests from clients.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {!loading && requests.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Text Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search client, category, metal..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all text-gray-900"
            />
          </div>

          {/* Date Filters */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] text-gray-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-gray-500">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] text-gray-900"
              />
            </div>

            {(searchQuery || startDate || endDate) && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Requests...</p>
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h2>
          <p className="text-gray-500 max-w-md mb-4">No custom requests match your search filters.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setStartDate("");
              setEndDate("");
            }}
            className="text-[#0082A4] font-semibold text-sm hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold">Date</th>
                  <th className="p-5 font-semibold">Client</th>
                  <th className="p-5 font-semibold">Category</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Details</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredRequests.map((req) => (
                  <React.Fragment key={req._id}>
                    {/* VISIBLE ROW */}
                    <tr 
                      onClick={() => toggleExpand(req._id)}
                      className={`hover:bg-[#F4f9fa]/50 transition-colors cursor-pointer group ${req.status === "Pending" ? "bg-red-50/20" : ""}`}
                    >
                      <td className="p-5 align-middle text-gray-500">
                        {new Date(req.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 align-middle">
                        <p className="font-bold text-gray-900">{req.clientInfo.fullName}</p>
                        <p className="text-xs text-gray-500">{req.clientInfo.email}</p>
                      </td>
                      <td className="p-5 align-middle">
                        <span className="font-bold text-[#0082A4] bg-[#E2FCFF] px-3 py-1 rounded-md">{req.category}</span>
                      </td>
                      <td className="p-5 align-middle">
                        {getStatusBadge(req.status)}
                      </td>
                      <td className="p-5 align-middle text-right">
                        <button className="p-2 bg-gray-50 text-gray-500 rounded-lg group-hover:bg-[#0082A4] group-hover:text-white transition-colors">
                          <ChevronDown size={18} className={`transition-transform duration-300 ${expandedId === req._id ? "rotate-180" : ""}`} />
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILS PANEL */}
                    {expandedId === req._id && (
                      <tr className="bg-[#F4f9fa] border-b border-gray-100">
                        <td colSpan="5" className="p-0">
                          <div className="p-6 md:p-8 animate-in slide-in-from-top-2 fade-in duration-200">
                            
                            {/* Action Bar */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-xl border border-[#0082A4]/20 mb-6 shadow-sm gap-4">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-sm font-bold text-gray-900 mr-2">Update Request Status:</span>
                                <button onClick={() => handleStatusChange(req._id, "Pending")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${req.status === "Pending" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mark Unread</button>
                                <button onClick={() => handleStatusChange(req._id, "Reviewed")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${req.status === "Reviewed" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Mark Reviewed</button>
                                <button onClick={() => handleStatusChange(req._id, "In Production")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${req.status === "In Production" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>In Production</button>
                                <button onClick={() => handleStatusChange(req._id, "Fulfilled")} className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors ${req.status === "Fulfilled" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>Fulfilled</button>
                              </div>
                              <button 
                                onClick={() => handleDelete(req._id)} 
                                className="px-4 py-2 text-xs font-bold rounded-lg bg-red-50 text-red-600 border border-red-100 hover:bg-red-100 flex items-center gap-1.5 ml-auto sm:ml-0"
                              >
                                <Trash2 size={12}/> Delete Request
                              </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                              
                              {/* Column 1: Client Specs */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Client Contact</h4>
                                  <div className="space-y-2 text-sm text-gray-700">
                                    <p className="flex items-center gap-2"><Phone size={14} className="text-gray-400"/> {req.clientInfo.phone}</p>
                                    <p className="flex items-center gap-2"><Mail size={14} className="text-gray-400"/> <a href={`mailto:${req.clientInfo.email}`} className="text-[#0082A4] hover:underline">{req.clientInfo.email}</a></p>
                                    <p className="flex items-start gap-2 mt-2"><MapPin size={14} className="text-gray-400 mt-1"/> 
                                      <span>
                                        {req.clientInfo.address}<br/>
                                        {req.clientInfo.state}, {req.clientInfo.country}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Column 2: Jewelry Specs */}
                              <div className="space-y-6 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Design Specifications</h4>
                                  <div className="space-y-4 text-sm">
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500">Base Metal:</span>
                                      <span className="font-bold text-gray-900">{req.metal}</span>
                                    </div>
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500">Stone Selection:</span>
                                      <span className="font-bold text-gray-900">{req.stone?.type || "None"}</span>
                                    </div>
                                    {req.stone?.details && (
                                      <div className="bg-gray-50 p-2 rounded text-xs text-gray-600 italic">
                                        "{req.stone.details}"
                                      </div>
                                    )}
                                    <div className="flex justify-between border-b border-gray-50 pb-2">
                                      <span className="text-gray-500 flex items-center gap-1.5"><Ruler size={14}/> Dimensions:</span>
                                      <span className="font-bold text-[#0082A4]">{req.dimensions?.length || "?"} x {req.dimensions?.width || "?"} mm</span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Column 3: Notes & Images */}
                              <div className="space-y-6">
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Design Notes</h4>
                                  <div className="bg-white p-4 rounded-xl border border-gray-100 text-sm text-gray-700 italic min-h-[80px] shadow-sm">
                                    {req.designNotes ? `"${req.designNotes}"` : "No notes provided."}
                                  </div>
                                </div>
                                
                                <div>
                                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Reference Image</h4>
                                  {req.referenceImageUrl ? (
                                    <a href={req.referenceImageUrl} target="_blank" rel="noreferrer" className="block w-full h-32 bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:border-[#0082A4] transition-colors relative group">
                                      <img src={req.referenceImageUrl} alt="Reference" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-white text-xs font-bold uppercase tracking-wider">Click to Enlarge</span>
                                      </div>
                                    </a>
                                  ) : (
                                    <div className="w-full h-32 bg-white border border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400">
                                      <ImageIcon size={24} className="mb-2 opacity-50" />
                                      <span className="text-xs">No image provided</span>
                                    </div>
                                  )}
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