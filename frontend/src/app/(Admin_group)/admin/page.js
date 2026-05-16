"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Wand2, 
  Mail, 
  Package, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Activity
} from "lucide-react";
import { 
  getAdminOrders, 
  getAdminCustomRequests, 
  getAdminContactEnquiries, 
  getProducts, 
  getAdminUsers 
} from "@/lib/api";

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: { total: 0, pending: 0, reviewed: 0, fulfilled: 0, recent: [] },
    customReqs: { total: 0, pending: 0, recent: [] },
    contacts: { total: 0, unread: 0 },
    products: { total: 0 },
    users: { total: 0, withCart: 0 }
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch all data in parallel for speed
      const [ordersRes, customRes, contactRes, productRes, userRes] = await Promise.all([
        getAdminOrders(),
        getAdminCustomRequests(),
        getAdminContactEnquiries(),
        getProducts(),
        getAdminUsers()
      ]);

      const data = {
        orders: { total: 0, pending: 0, reviewed: 0, fulfilled: 0, recent: [] },
        customReqs: { total: 0, pending: 0, recent: [] },
        contacts: { total: 0, unread: 0 },
        products: { total: 0 },
        users: { total: 0, withCart: 0 }
      };

      // Process Orders
      if (ordersRes.success && ordersRes.data) {
        const orders = ordersRes.data;
        data.orders.total = orders.length;
        data.orders.pending = orders.filter(o => (o.status || "Pending") === "Pending").length;
        data.orders.reviewed = orders.filter(o => o.status === "Reviewed").length;
        data.orders.fulfilled = orders.filter(o => o.status === "Fulfilled").length;
        data.orders.recent = orders.slice(0, 5); // Get top 5 newest
      }

      // Process Custom Requests
      if (customRes.success && customRes.data) {
        const reqs = customRes.data;
        data.customReqs.total = reqs.length;
        data.customReqs.pending = reqs.filter(r => (r.status || "Pending") === "Pending").length;
        data.customReqs.recent = reqs.slice(0, 5);
      }

      // Process Contacts
      if (contactRes.success && contactRes.data) {
        const contacts = contactRes.data;
        data.contacts.total = contacts.length;
        data.contacts.unread = contacts.filter(c => (c.status || "Unread") === "Unread").length;
      }

      // Process Products & Users
      if (productRes.success && productRes.data) data.products.total = productRes.data.length;
      if (userRes.success && userRes.data) {
        data.users.total = userRes.data.length;
        data.users.withCart = userRes.data.filter(u => u.cartItemCount > 0).length;
      }

      setStats(data);
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally {
      setLoading(false);
    }
  };

  // Helper to calculate percentages for the CSS graphs
  const getPercent = (value, total) => {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh]">
        <div className="w-12 h-12 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
        <p className="text-[#0082A4] font-bold tracking-widest uppercase text-sm animate-pulse">Compiling Data...</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto font-mona space-y-8">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-bl from-[#E2FCFF] to-transparent rounded-full -translate-y-1/2 translate-x-1/3 opacity-50 pointer-events-none"></div>
        
        <div className="flex items-center gap-5 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-[#0082A4] to-[#00CEF3] text-white rounded-2xl flex items-center justify-center shrink-0 shadow-md transform rotate-3">
            <LayoutDashboard size={32} strokeWidth={1.5} className="-rotate-3" />
          </div>
          <div>
            <h1 className="text-3xl font-playfair font-bold text-gray-900 mb-1">
              Welcome back, Admin
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              Here is what's happening with your store today.
            </p>
          </div>
        </div>
        
        <div className="relative z-10 hidden md:block text-right">
          <p className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-1">Current Date</p>
          <p className="text-[#0082A4] font-bold bg-[#E2FCFF] px-4 py-2 rounded-lg">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* --- KPI CARDS (Top Stats) --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <ShoppingBag size={24} />
            </div>
            {stats.orders.pending > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                <Clock size={12}/> {stats.orders.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.orders.total}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Total Price Requests</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <Wand2 size={24} />
            </div>
            {stats.customReqs.pending > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                <Clock size={12}/> {stats.customReqs.pending} Pending
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.customReqs.total}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Custom Jewelry Requests</p>
        </div>

        {/* Card 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Mail size={24} />
            </div>
            {stats.contacts.unread > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-md">
                <Clock size={12}/> {stats.contacts.unread} Unread
              </span>
            )}
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.contacts.total}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Contact Enquiries</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <Users size={24} />
            </div>
            <span className="flex items-center gap-1 text-xs font-bold text-[#0082A4] bg-[#E2FCFF] px-2 py-1 rounded-md">
              <TrendingUp size={12}/> {stats.users.withCart} Active Carts
            </span>
          </div>
          <h3 className="text-3xl font-bold text-gray-900">{stats.users.total}</h3>
          <p className="text-sm font-medium text-gray-500 mt-1">Registered Users</p>
        </div>

      </div>

      {/* --- GRAPHS & ANALYTICS ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CSS Chart: Order Status Distribution */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="text-[#0082A4]" size={20}/> 
              Shop Requests Pipeline
            </h2>
            <Link href="/admin/orders" className="text-sm font-bold text-[#0082A4] hover:underline">View All</Link>
          </div>
          
          {stats.orders.total === 0 ? (
            <p className="text-gray-500 text-sm text-center py-10">No orders data available to display.</p>
          ) : (
            <div className="space-y-6">
              {/* The Visual Bar */}
              <div className="h-6 w-full bg-gray-100 rounded-full overflow-hidden flex shadow-inner">
                <div 
                  style={{ width: `${getPercent(stats.orders.pending, stats.orders.total)}%` }} 
                  className="bg-yellow-400 h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  title={`Pending: ${stats.orders.pending}`}
                ></div>
                <div 
                  style={{ width: `${getPercent(stats.orders.reviewed, stats.orders.total)}%` }} 
                  className="bg-blue-500 h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  title={`Reviewed: ${stats.orders.reviewed}`}
                ></div>
                <div 
                  style={{ width: `${getPercent(stats.orders.fulfilled, stats.orders.total)}%` }} 
                  className="bg-green-500 h-full transition-all duration-1000 ease-out hover:opacity-80 cursor-pointer"
                  title={`Fulfilled: ${stats.orders.fulfilled}`}
                ></div>
              </div>

              {/* Legend & Stats */}
              <div className="grid grid-cols-3 gap-4 text-center divide-x divide-gray-100">
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-yellow-400 shadow-sm"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Pending</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders.pending}</p>
                  <p className="text-xs text-gray-400">{getPercent(stats.orders.pending, stats.orders.total)}%</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-blue-500 shadow-sm"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Reviewed</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders.reviewed}</p>
                  <p className="text-xs text-gray-400">{getPercent(stats.orders.reviewed, stats.orders.total)}%</p>
                </div>
                <div>
                  <div className="flex items-center justify-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 shadow-sm"></div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Fulfilled</p>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{stats.orders.fulfilled}</p>
                  <p className="text-xs text-gray-400">{getPercent(stats.orders.fulfilled, stats.orders.total)}%</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick Inventory Overview */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 bg-[url('/images/logo/Butterfly.png')] bg-no-repeat bg-[length:150px] bg-[position:bottom_-20px_right_-20px]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="text-[#0082A4]" size={20}/> 
              Inventory Overview
            </h2>
            <Link href="/admin/products" className="text-sm font-bold text-[#0082A4] hover:underline">Manage Catalog</Link>
          </div>

          <div className="flex items-center gap-6 mb-8">
            <div className="w-20 h-20 rounded-full border-8 border-[#E2FCFF] border-t-[#0082A4] flex items-center justify-center shrink-0 shadow-sm">
              <span className="text-xl font-bold text-gray-900">{stats.products.total}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Total Products Live</h3>
              <p className="text-sm text-gray-500">Across all collections and categories.</p>
            </div>
          </div>

          <div className="space-y-4">
            <Link href="/admin/products/new" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors group">
              <span className="font-bold text-sm text-gray-700 group-hover:text-[#0082A4]">Add New Product</span>
              <ArrowRight size={16} />
            </Link>
            <Link href="/admin/categories" className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-[#E2FCFF] hover:text-[#0082A4] transition-colors group">
              <span className="font-bold text-sm text-gray-700 group-hover:text-[#0082A4]">Manage Categories</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

      </div>

      {/* --- RECENT ACTIVITY ROW --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Price Requests</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.orders.recent.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No recent requests.</p>
            ) : (
              stats.orders.recent.map(order => (
                <div key={order._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{order.contactDetails?.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{order.items?.length || 0} styles requested</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      (order.status || "Pending") === "Pending" ? "bg-yellow-50 text-yellow-700" :
                      order.status === "Reviewed" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                    }`}>
                      {order.status || "Pending"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
            <Link href="/admin/orders" className="text-sm font-bold text-[#0082A4] hover:underline">View All Requests</Link>
          </div>
        </div>

        {/* Recent Custom Requests List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">Recent Bespoke Requests</h2>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.customReqs.recent.length === 0 ? (
              <p className="p-6 text-sm text-gray-500 text-center">No recent bespoke requests.</p>
            ) : (
              stats.customReqs.recent.map(req => (
                <div key={req._id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between">
                  <div>
                    <p className="font-bold text-sm text-gray-900">{req.clientInfo?.fullName}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{req.category} in {req.metal}</p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                      (req.status || "Pending") === "Pending" ? "bg-yellow-50 text-yellow-700" :
                      req.status === "Reviewed" ? "bg-blue-50 text-blue-700" : "bg-green-50 text-green-700"
                    }`}>
                      {req.status || "Pending"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="p-4 bg-gray-50 text-center border-t border-gray-100">
            <Link href="/admin/custom-requests" className="text-sm font-bold text-[#0082A4] hover:underline">View All Bespoke Requests</Link>
          </div>
        </div>

      </div>

    </div>
  );
}