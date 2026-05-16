"use client";

import React, { useState } from "react";
import Link from "next/link";
import { forgotPassword } from "@/lib/api"; 

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setErrorMsg("");
    setIsLoading(true);

    try {
      const res = await forgotPassword({ email });
      if (res.success) {
        setMsg("An email with reset instructions has been sent to your address.");
      }
    } catch (err) {
      setErrorMsg(err.error || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4f9fa] font-mona p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        
        <div className="text-center mb-8">
          <h1 className="font-playfair text-3xl font-bold text-gray-900 mb-2">
            Forgot <span className="italic text-[#0082A4] font-medium pr-1.5">Password</span>
          </h1>
          <p className="text-sm text-gray-500">
            Enter your email and we will send a reset link.
          </p>
        </div>

        {msg && <div className="bg-green-50 text-green-700 p-3 mb-6 text-sm text-center border border-green-200 rounded-md">{msg}</div>}
        {errorMsg && <div className="bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-200 rounded-md">{errorMsg}</div>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1">
            <label className="text-sm text-gray-900 font-medium">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#0082A4]" 
              placeholder="Enter your email"
              required 
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="mt-4 bg-[#0082A4] text-white py-3.5 text-sm font-bold tracking-widest uppercase rounded-lg hover:bg-[#006a85] transition-colors disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center mt-2">
            <Link href="/account" className="text-sm text-gray-500 hover:text-[#0082A4] transition-colors">
              &larr; Back to Login
            </Link>
          </div>
        </form>

      </div>
    </div>
  );
}