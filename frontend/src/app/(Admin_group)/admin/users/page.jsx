"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Eye, Filter, ShoppingCart, Users, Search, User as UserIcon } from "lucide-react";
import { getAdminUsers } from "@/lib/api";

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartFilter, setCartFilter] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAdminUsers();
        if (res.success) setUsers(res.data);
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Apply Filter
  const filteredUsers = users.filter(user => {
    if (cartFilter === "All") return true;
    if (cartFilter === "WithCart") return user.cartItemCount > 0;
    if (cartFilter === "EmptyCart") return !user.cartItemCount || user.cartItemCount === 0;
    return true;
  });

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto font-mona">
      
      {/* --- PAGE HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-[#E2FCFF] text-[#0082A4] rounded-full flex items-center justify-center shrink-0">
            <Users size={28} strokeWidth={1.5} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1 flex items-center gap-3">
              Registered Users
              {!loading && (
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1 rounded-full border border-gray-200">
                  {users.length} Total
                </span>
              )}
            </h1>
            <p className="text-sm text-gray-500">
              Manage customer accounts and view their active carts.
            </p>
          </div>
        </div>

        {/* --- FILTER DROPDOWN --- */}
        <div className="flex items-center gap-3 relative min-w-[200px]">
          <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select 
            value={cartFilter}
            onChange={(e) => setCartFilter(e.target.value)}
            className="w-full pl-10 pr-10 py-3 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] transition-all shadow-sm appearance-none cursor-pointer font-medium"
          >
            <option value="All">All Users</option>
            <option value="WithCart">Items in Cart</option>
            <option value="EmptyCart">Empty Cart</option>
          </select>
          <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
      </div>
      
      {/* --- MAIN CONTENT --- */}
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin mb-4"></div>
          <p className="text-[#0082A4] font-medium tracking-widest animate-pulse text-sm uppercase">Loading Users...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[40vh] bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <UserIcon size={32} className="text-gray-300" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No Users Found</h2>
          <p className="text-gray-500 max-w-md">There are currently no registered users on the platform.</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
            <Search size={24} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">No Matches Found</h2>
          <p className="text-gray-500 text-sm mb-4">
            There are no users matching the selected cart filter.
          </p>
          <button 
            onClick={() => setCartFilter("All")}
            className="text-[#0082A4] font-semibold text-sm hover:underline"
          >
            Clear Filter
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50/50 text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                <tr>
                  <th className="p-5 font-semibold">User Info</th>
                  <th className="p-5 font-semibold">Contact</th>
                  <th className="p-5 font-semibold">Business / Location</th>
                  <th className="p-5 font-semibold text-center">Active Cart</th>
                  <th className="p-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-gray-50">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-[#F4f9fa]/50 transition-colors group">
                    
                    <td className="p-5 align-middle flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-bold text-gray-900 text-base">{user.fullName}</span>
                    </td>
                    
                    <td className="p-5 align-middle">
                      <p className="font-medium text-gray-800">{user.email}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.whatsappNo || <span className="italic">No Phone</span>}</p>
                    </td>
                    
                    <td className="p-5 align-middle">
                      <p className="text-gray-900 font-medium">{user.companyName || <span className="text-gray-400 italic">Individual</span>}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{user.country || "Unknown Location"}</p>
                    </td>
                    
                    <td className="p-5 align-middle text-center">
                      {user.cartItemCount > 0 ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#E2FCFF] text-[#0082A4]">
                          <ShoppingCart size={12} /> {user.cartItemCount} Items
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                          Empty
                        </span>
                      )}
                    </td>
                    
                    <td className="p-5 align-middle text-right">
                      <Link 
                        href={`/admin/users/${user._id}`}
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-gray-50 text-gray-700 hover:text-[#0082A4] hover:bg-[#E2FCFF] rounded-lg transition-colors font-semibold text-xs uppercase tracking-wider"
                      >
                        <Eye size={14} /> View
                      </Link>
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