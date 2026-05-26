"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
// Assuming you have a generic API helper, keep your import
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
      // Simulate API call for UI testing if backend isn't ready
      // await new Promise(resolve => setTimeout(resolve, 2000));
      // const res = { success: true, data: { token: "dummy_token" } };

      const res = await loginAdminUser({ email, password });
      
      if (res.success) {
        localStorage.setItem("adminToken", res.data.token);
        router.push("/admin"); 
      }
    } catch (err) {
      setErrorMsg(err.error || "Invalid Admin Credentials. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Replaced font-mona with standard font-sans (Inter) for a more modern UI look, 
    // but you can keep font-mona if it's required by design guidelines.
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-white font-sans">
      
      {/* Left Side - Login Form */}
      <div className="col-span-1 md:col-span-5 flex items-center justify-center p-8 sm:p-12 md:p-16 w-full">
        <div className="w-full max-w-md">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center md:items-start mb-12">
            <div className="mb-8">
              <Image 
                src="/images/logo/PuramenteLogo.png" 
                alt="Puramente Logo" 
                width={180} 
                height={50} 
                priority
                className="object-contain"
              />
            </div>
            {/* Using a clean sans-serif instead of playfair for a modern admin look */}
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">
              Admin Portal
            </h1>
            <p className="text-base text-gray-600">
              Welcome back. Please enter your credentials.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="bg-red-50 text-red-700 p-4 mb-6 text-sm flex items-start gap-3 border border-red-200 rounded-xl animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-0.5 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
              </svg>
              {errorMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminLogin} className="space-y-6">
            
            {/* Modern Outlined Input - Email */}
            <div className="relative group">
              <input 
                type="email" 
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full px-4 py-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] peer transition-all" 
                placeholder=" "
                required 
              />
              <label 
                htmlFor="email"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#0082A4] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Admin Email
              </label>
            </div>
            
            {/* Modern Outlined Input - Password */}
            <div className="relative group">
              <input 
                type="password" 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full px-4 py-4 text-sm text-gray-900 bg-white border border-gray-300 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-[#0082A4]/20 focus:border-[#0082A4] peer transition-all" 
                placeholder=" "
                required 
              />
              <label 
                htmlFor="password"
                className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-[#0082A4] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-3"
              >
                Password
              </label>
            </div>


            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="relative w-full flex justify-center items-center gap-3 mt-6 bg-[#0082A4] text-white py-4 px-6 text-sm font-semibold rounded-xl hover:bg-[#006a85] focus:outline-none focus:ring-4 focus:ring-[#0082A4]/30 transition-all disabled:opacity-60 active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Authenticating...
                </>
              ) : (
                "Sign In to Dashboard"
              )}
            </button>
          </form>

          {/* Footer Footer */}
          <div className="mt-16 text-center">
            <p className="text-xs text-gray-400 tracking-wider uppercase">
              Authorized Personnel Only
            </p>
            <p className="text-xs text-gray-400 mt-1">
              &copy; {new Date().getFullYear()} Puramente. All rights reserved.
            </p>
          </div>

        </div>
      </div>

      {/* Right Side - Visual/Branding (Hidden on mobile) */}
      <div className="hidden md:block md:col-span-7 bg-[#F4f9fa] relative overflow-hidden">
        {/* Abstract background decoration */}
        <div className="absolute inset-0 opacity-[0.03] text-[#0082A4]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="dotPattern" patternUnits="userSpaceOnUse" width="32" height="32">
                        <circle cx="1" cy="1" r="1" fill="currentColor" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotPattern)" />
            </svg>
        </div>
        
        {/* Content Centered in Right Panel */}
        <div className="relative flex flex-col items-center justify-center h-full text-center p-16">
            <div className="bg-white p-6 rounded-3xl shadow-xl shadow-[#0082A4]/5 border border-gray-100 mb-10">
                 <Image 
                    src="/images/logo/puramenteLogoDark.png" 
                    alt="Puramente Icon" 
                    width={80} 
                    height={80} 
                    className="object-contain aspect-square"
                />
            </div>
          <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight max-w-lg">
            Secure Access to your <span className="text-[#0082A4]">Puramente</span> Management Tools
          </h2>
          <p className="text-lg text-gray-600 mt-6 max-w-md">
            Monitor analytics, manage content, and oversee operations from one central, secure location.
          </p>
          
          {/* Subtle gradient accent at bottom */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-gradient-to-r from-[#0082A4] to-[#c7eaf2]"></div>
        </div>
      </div>
    </div>
  );
}