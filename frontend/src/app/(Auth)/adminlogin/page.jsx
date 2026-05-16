"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { loginAdminUser } from "@/lib/api"; 

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await loginAdminUser({ email, password });
      
      if (res.success) {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin"); 
      }
    } catch (err) {
      setErrorMsg(err.error || "Invalid Admin Credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4f9fa] font-mona p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
          <p className="text-sm text-gray-500 tracking-widest uppercase">Authorized Personnel Only</p>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-200 rounded-md">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-900 font-medium">Admin Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-[#0082A4]" 
              required 
            />
          </div>
          
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-900 font-medium">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-[#0082A4]" 
              required 
            />
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-[#0082A4] text-white py-3.5 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[#006a85] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

      </div>
    </div>
  );
}