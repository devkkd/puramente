"use client";

import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { resetPassword } from "@/lib/api";
import { EyeOff, Eye } from "lucide-react";

export default function ResetPassword() {
  const router = useRouter();
  const params = useParams();
  const token = params.token;

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrorMsg("");

    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match.");
    }

    if (password.length < 6) {
      return setErrorMsg("Password must be at least 6 characters long.");
    }

    setIsLoading(true);

    try {
      const res = await resetPassword(token, { password });
      if (res.success) {
        setMsg("Password successfully reset! Redirecting to login...");
        setTimeout(() => router.push("/account"), 3000);
      }
    } catch (err) {
      setErrorMsg(err.error || "Invalid or expired token.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4f9fa] font-mona p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">
            Set New <span className="italic text-[#0082A4] font-medium pr-1.5">Password</span>
          </h1>
          <p className="text-sm text-gray-500">
            Please enter your new password below.
          </p>
        </div>

        {msg && <div className="bg-green-50 text-green-700 p-3 mb-6 text-sm text-center border border-green-200 rounded-md">{msg}</div>}
        {errorMsg && <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-200 rounded-md">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          
          <div className="flex flex-col gap-1 relative">
            <label className="text-sm text-gray-900 font-medium">New Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#0082A4] pr-10" 
              placeholder="Enter new password"
              required 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-gray-500 hover:text-black">
              {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-900 font-medium">Confirm New Password</label>
            <input 
              type={showPassword ? "text" : "password"} 
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#0082A4]" 
              placeholder="Confirm new password"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-[#0082A4] text-white py-3.5 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[#006a85] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Saving..." : "Update Password"}
          </button>

        </form>
      </div>
    </div>
  );
}