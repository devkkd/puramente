"use client";

import React, { useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api"; 
import { useCart } from "@/context/CartContext"; 
import Link from "next/link";

export default function AccountPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [loginData, setLoginData] = useState({ email: "", password: "" });
  
  // State holds all 7 pieces of information
  const [regData, setRegData] = useState({
    email: "", password: "", fullName: "", country: "", whatsappNo: "", companyName: "", companyWebsite: ""
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await loginUser(loginData);
      if (res.success) {
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userId", res.data._id);
        refreshCart();
        router.push("/");
      }
    } catch (err) {
      setErrorMsg(err.error || "Login failed.");
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const res = await registerUser(regData);
      if (res.success) {
        localStorage.setItem("userToken", res.data.token);
        localStorage.setItem("userId", res.data._id);
        refreshCart();
        router.push("/");
      }
    } catch (err) {
      setErrorMsg(err.error || "Registration failed.");
    }
  };

  return (
    <main className="w-full bg-white font-mona pb-24 pt-10 min-h-[70vh]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        
        <div className="flex flex-col items-center text-center w-full mb-8">
          <h1 className="font-playfair text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 mt-6">
            {activeTab === "register" ? (
              <><span className="italic text-[#00a3c4] font-medium pr-1.5">Create</span> Your Puramente Account</>
            ) : (
              <><span className="italic text-[#00a3c4] font-medium pr-1.5">Welcome</span> Back to Puramente</>
            )}
          </h1>
        </div>

        <div className="w-full flex justify-center border-b border-gray-300 mb-10">
          <div className="flex items-center gap-8">
            <button
              onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
              className={`pb-4 text-sm md:text-base tracking-widest uppercase transition-colors relative ${
                activeTab === "login" ? "text-black font-bold" : "text-gray-400 font-medium hover:text-gray-600"
              }`}
            >
              Login
              {activeTab === "login" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
            </button>
            <button
              onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
              className={`pb-4 text-sm md:text-base tracking-widest uppercase transition-colors relative ${
                activeTab === "register" ? "text-black font-bold" : "text-gray-400 font-medium hover:text-gray-600"
              }`}
            >
              Create An Account
              {activeTab === "register" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
            </button>
          </div>
        </div>

        {errorMsg && (
          <div className="w-full max-w-2xl bg-red-50 text-red-600 p-3 mb-6 text-sm text-center border border-red-200">
            {errorMsg}
          </div>
        )}

        <div className="w-full max-w-2xl">
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-6 max-w-md mx-auto">
              <div className="flex flex-col gap-1">
                <label className="text-sm text-gray-900 font-medium">Email*</label>
                <input 
                  type="email" 
                  value={loginData.email} 
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})} 
                  className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                  placeholder="Enter your email"
                  required 
                />
              </div>
              <div className="flex flex-col gap-1 relative">
                <label className="text-sm text-gray-900 font-medium">Password*</label>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={loginData.password} 
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})} 
                  className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4] pr-10" 
                  placeholder="Enter your password"
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-gray-500 hover:text-black">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <button type="submit" className="bg-[#0082A4] text-white px-10 py-3.5 text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors mt-4">
                Login &rarr;
              </button>
              <Link className="text-sm text-gray-500 hover:text-[#0082A4] transition-colors" href="/forgot-password">
                Forgot Password?
              </Link>
            </form>
            
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-8">
              
              {/* Row 1: Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Email*</label>
                  <input 
                    type="email" 
                    value={regData.email} 
                    onChange={(e) => setRegData({...regData, email: e.target.value})} 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                    placeholder="Enter your email address"
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1 relative">
                  <label className="text-sm text-gray-900 font-medium">Password*</label>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={regData.password} 
                    onChange={(e) => setRegData({...regData, password: e.target.value})} 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4] pr-10" 
                    placeholder="Create a password"
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-3 text-gray-500 hover:text-black">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Row 2: Full Name & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Full Name*</label>
                  <input 
                    type="text" 
                    value={regData.fullName} 
                    onChange={(e) => setRegData({...regData, fullName: e.target.value})} 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Country</label>
                  <div className="relative">
                    <select 
                      value={regData.country}
                      onChange={(e) => setRegData({...regData, country: e.target.value})}
                      className="appearance-none w-full border-b border-gray-300 py-3 text-sm text-gray-900 bg-transparent focus:outline-none focus:border-[#00a3c4] cursor-pointer"
                    >
                      <option value="" className="text-gray-500">Select your country</option>
                      <option value="United States" className="text-gray-900">United States</option>
                      <option value="United Kingdom" className="text-gray-900">United Kingdom</option>
                      <option value="Australia" className="text-gray-900">Australia</option>
                      <option value="India" className="text-gray-900">India</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-500">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 3: WhatsApp & Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Phone / WhatsApp Number</label>
                  <input 
                    type="tel" 
                    value={regData.whatsappNo} 
                    onChange={(e) => setRegData({...regData, whatsappNo: e.target.value})} 
                    placeholder="Enter your phone / whatsapp number" 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Company Name</label>
                  <input 
                    type="text" 
                    value={regData.companyName} 
                    onChange={(e) => setRegData({...regData, companyName: e.target.value})} 
                    placeholder="Enter your company/business name" 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                  />
                </div>
              </div>

              {/* Row 4: Company Website & Empty spacer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-900 font-medium">Company/Business Website</label>
                  <input 
                    type="url" 
                    value={regData.companyWebsite} 
                    onChange={(e) => setRegData({...regData, companyWebsite: e.target.value})} 
                    placeholder="Enter your company website (e.g., https://...)" 
                    className="w-full border-b border-gray-300 py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]" 
                  />
                </div>
                <div></div>
              </div>

              <div className="w-full flex justify-center mt-6">
                <button type="submit" className="bg-[#0082A4] text-white px-10 py-3.5 text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors">
                  Create An Account &rarr;
                </button>
              </div>

            </form>
          )}

        </div>
      </div>
    </main>
  );
}