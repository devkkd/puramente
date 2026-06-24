"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Filter, ClipboardList, Clock, CheckCircle2, Search, Trash2 } from "lucide-react";
import { getAdminOrders, deleteAdminOrder } from "@/lib/api";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");

  // Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await getAdminOrders();
      if (res.success) setOrders(res.data);
    } catch (error) {
      console.error("Failed to fetch orders", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this price request?")) return;
    try {
      const res = await deleteAdminOrder(id);
      if (res.success) {
        setOrders(prev => prev.filter(order => order._id !== id));
      }
    } catch (error) {
      alert("Failed to delete order.");
    }
  };

  // Aesthetic Status Badges
  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-yellow-50 text-yellow-700 border border-yellow-100"><Clock size={12}/> Pending</span>;
      case "Reviewed":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-100"><CheckCircle2 size={12}/> Reviewed</span>;
      case "Fulfilled":
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-50 text-green-600 border border-green-100"><CheckCircle2 size={12}/> Fulfilled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">{status || "Pending"}</span>;
    }
  };

  // Apply Filter
  const filteredOrders = orders.filter(order => {
    // 1. Status Filter
    if (statusFilter !== "All" && (order.status || "Pending") !== statusFilter) {
      return false;
    }
    
    // 2. Search Query
    const matchesSearch = 
      order.contactDetails?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contactDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.contactDetails?.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order._id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // 3. Date Range
    let matchesDate = true;
    if (startDate) {
      const sDate = new Date(startDate);
      sDate.setHours(0, 0, 0, 0);
      const orderDate = new Date(order.createdAt);
      if (orderDate < sDate) matchesDate = false;
    }
    if (endDate) {
      const eDate = new Date(endDate);
      eDate.setHours(23, 59, 59, 999);
      const orderDate = new Date(order.createdAt);
      if (orderDate > eDate) matchesDate = false;
    }

    return matchesSearch && matchesDate;
  });

  const pendingCount = orders.filter(o => (o.status || "Pending") === "Pending").length;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <ClipboardList size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Shop Price Requests
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {pendingCount} Pending
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Manage bulk pricing requests submitted from the store catalog.
            </p>
          </div>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-3 relative min-w-[200px]">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all shadow-sm appearance-none cursor-pointer font-medium"
          >
            <option value="All">All Requests</option>
            <option value="Pending">Pending</option>
            <option value="Reviewed">Reviewed</option>
            <option value="Fulfilled">Fulfilled</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      {!loading && orders.length > 0 && (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Text Search */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search customer, email, company..."
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

            {(searchQuery || startDate || endDate || statusFilter !== "All") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setStartDate("");
                  setEndDate("");
                  setStatusFilter("All");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase tracking-wider transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}

      {/* --- MAIN CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Requests...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Requests Found</h2>
          <p className="text-gray-500 max-w-md">No price requests have been submitted yet.</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No Requests Found</h2>
          <p className="text-gray-500 text-sm mb-4">
            There are no requests matching your search filters.
          </p>
          <button 
            onClick={() => {
              setSearchQuery("");
              setStartDate("");
              setEndDate("");
              setStatusFilter("All");
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
                  <th className="p-5 font-semibold">Customer</th>
                  <th className="p-5 font-semibold">Company</th>
                  <th className="p-5 font-semibold text-center">Items Requested</th>
                  <th className="p-5 font-semibold">Status</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredOrders.map((order) => {
                  const isPending = (order.status || "Pending") === "Pending";
                  return (
                    <tr key={order._id} className={`hover:bg-[#F4f9fa]/50 transition-colors group ${isPending ? 'bg-yellow-50/20' : ''}`}>
                      <td className="p-5 align-middle text-gray-500 font-medium">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="p-5 align-middle">
                        <p className="font-bold text-gray-900">{order.contactDetails?.fullName}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[200px]">{order.contactDetails?.email}</p>
                      </td>
                      <td className="p-5 align-middle">
                        <span className="text-gray-700">{order.contactDetails?.companyName || <span className="text-gray-400 italic">Not Provided</span>}</span>
                      </td>
                      <td className="p-5 align-middle text-center">
                        <span className="inline-flex items-center text-xs font-bold text-[#0082A4] bg-[#E2FCFF] px-3 py-1 rounded-full">
                          {order.items?.length || 0} Styles
                        </span>
                      </td>
                      <td className="p-5 align-middle">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="p-5 align-middle text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Link 
                            href={`/admin/orders/${order._id}`}
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 hover:text-[#0082A4] hover:bg-[#E2FCFF] rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider"
                          >
                            <Eye size={14} /> Review
                          </Link>
                          <button 
                            onClick={() => handleDelete(order._id)}
                            className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                            title="Delete Order"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}