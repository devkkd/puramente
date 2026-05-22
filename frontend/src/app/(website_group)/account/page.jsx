"use client";

import React, { useEffect, useRef, useState } from "react";
import { EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { loginUser, registerUser } from "@/lib/api";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
  "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
  "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo (Congo-Brazzaville)", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czechia",
  "Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France",
  "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy",
  "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar (formerly Burma)",
  "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine State", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

export default function AccountPage() {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  // Add these to your component's state
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const countryDropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter countries based on what the user types
  const filteredCountries = COUNTRIES.filter(country =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  );

  return (
    <main className="w-full bg-white font-mona pb-12 md:pb-24 pt-8 md:pt-10 min-h-[70vh]">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">

        <div className="flex flex-col items-center text-center w-full mb-6 md:mb-8">
          <h1 className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4 mt-2 md:mt-6 leading-tight">
            {activeTab === "register" ? (
              <><span className="italic text-[#00a3c4] font-medium pr-1.5">Create</span> Your Puramente Account</>
            ) : (
              <><span className="italic text-[#00a3c4] font-medium pr-1.5">Welcome</span> Back to Puramente</>
            )}
          </h1>
        </div>

        <div className="w-full flex justify-center border-b border-gray-300 mb-6 md:mb-10">
          <div className="flex items-center gap-6 md:gap-8">
            <button
              onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
              className={`pb-3 md:pb-4 text-[13px] sm:text-sm md:text-base tracking-widest uppercase transition-colors relative ${activeTab === "login" ? "text-black font-bold" : "text-gray-400 font-medium hover:text-gray-600"
                }`}
            >
              Login
              {activeTab === "login" && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-black"></span>}
            </button>
            <button
              onClick={() => { setActiveTab("register"); setErrorMsg(""); }}
              className={`pb-3 md:pb-4 text-[13px] sm:text-sm md:text-base tracking-widest uppercase transition-colors relative ${activeTab === "register" ? "text-black font-bold" : "text-gray-400 font-medium hover:text-gray-600"
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
            <form onSubmit={handleLoginSubmit} className="flex flex-col gap-5 md:gap-6 max-w-md mx-auto">
              <div className="flex flex-col gap-1">
                <label className="text-xs sm:text-sm text-gray-900 font-medium">Email*</label>
                <input
                  type="email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="flex flex-col gap-1 relative">
                <label className="text-xs sm:text-sm text-gray-900 font-medium">Password*</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4] pr-10"
                  placeholder="Enter your password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2.5 md:bottom-3 text-gray-500 hover:text-black">
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
              <button type="submit" className="w-full sm:w-auto bg-[#0082A4] text-white px-8 md:px-10 py-3 md:py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors mt-2 md:mt-4">
                Login &rarr;
              </button>
              <Link className="text-xs sm:text-sm text-gray-500 hover:text-[#0082A4] transition-colors text-center sm:text-left" href="/forgot-password">
                Forgot Password?
              </Link>
            </form>

          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-5 md:gap-8">

              {/* Row 1: Email & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Email*</label>
                  <input
                    type="email"
                    value={regData.email}
                    onChange={(e) => setRegData({ ...regData, email: e.target.value })}
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                    placeholder="Enter your email address"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1 relative">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Password*</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={regData.password}
                    onChange={(e) => setRegData({ ...regData, password: e.target.value })}
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4] pr-10"
                    placeholder="Create a password"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-0 bottom-2.5 md:bottom-3 text-gray-500 hover:text-black">
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {/* Row 2: Full Name & Country */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Full Name*</label>
                  <input
                    type="text"
                    value={regData.fullName}
                    onChange={(e) => setRegData({ ...regData, fullName: e.target.value })}
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Country</label>
                  <div className="relative" ref={countryDropdownRef}>

                    {/* Display Button */}
                    <div
                      onClick={() => {
                        setIsCountryDropdownOpen(!isCountryDropdownOpen);
                        setCountrySearch(""); // Reset search when opening
                      }}
                      className={`w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm bg-transparent cursor-pointer flex justify-between items-center transition-colors ${isCountryDropdownOpen ? "border-[#00a3c4]" : "hover:border-gray-400"
                        }`}
                    >
                      <span className={regData.country ? "text-gray-900" : "text-gray-500"}>
                        {regData.country || "Select your country"}
                      </span>
                      <div className="text-gray-500">
                        <svg
                          className={`w-4 h-4 transition-transform duration-200 ${isCountryDropdownOpen ? "rotate-180" : ""}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                    </div>

                    {/* Dropdown with Search */}
                    {isCountryDropdownOpen && (
                      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden">

                        {/* Search Input Area */}
                        <div className="p-2 border-b border-gray-100 bg-gray-50">
                          <div className="relative">
                            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                            </svg>
                            <input
                              type="text"
                              placeholder="Search country..."
                              value={countrySearch}
                              onChange={(e) => setCountrySearch(e.target.value)}
                              // ADDED: text-gray-900 placeholder:text-gray-400
                              className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-white border border-gray-200 rounded-md focus:outline-none focus:border-[#00a3c4] focus:ring-1 focus:ring-[#00a3c4] transition-colors text-gray-900 placeholder:text-gray-400"
                              autoFocus
                            />
                          </div>
                        </div>

                        {/* Scrollable Country List */}
                        <ul className="max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                          {filteredCountries.length > 0 ? (
                            filteredCountries.map((country) => (
                              <li
                                key={country}
                                onClick={() => {
                                  setRegData({ ...regData, country: country });
                                  setIsCountryDropdownOpen(false);
                                  setCountrySearch("");
                                }}
                                className={`px-4 py-2.5 text-xs sm:text-sm cursor-pointer transition-colors ${regData.country === country
                                    ? "bg-[#E2FCFF] text-[#0082A4] font-bold"
                                    : "text-gray-700 hover:bg-gray-50"
                                  }`}
                              >
                                {country}
                              </li>
                            ))
                          ) : (
                            <li className="px-4 py-3 text-sm text-gray-500 text-center italic">
                              No country found
                            </li>
                          )}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Row 3: WhatsApp & Company Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Phone / WhatsApp Number</label>
                  <input
                    type="tel"
                    value={regData.whatsappNo}
                    onChange={(e) => setRegData({ ...regData, whatsappNo: e.target.value })}
                    placeholder="Enter your phone / whatsapp number"
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Company Name</label>
                  <input
                    type="text"
                    value={regData.companyName}
                    onChange={(e) => setRegData({ ...regData, companyName: e.target.value })}
                    placeholder="Enter your company/business name"
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                  />
                </div>
              </div>

              {/* Row 4: Company Website & Empty spacer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8">
                <div className="flex flex-col gap-1">
                  <label className="text-xs sm:text-sm text-gray-900 font-medium">Company/Business Website (Optional)</label>
                  <input
                    type="url"
                    value={regData.companyWebsite}
                    onChange={(e) => setRegData({ ...regData, companyWebsite: e.target.value })}
                    placeholder="Enter the link of company website (e.g., https://...)"
                    className="w-full border-b border-gray-300 py-2.5 md:py-3 text-[13px] md:text-sm text-gray-900 placeholder-gray-400 bg-transparent focus:outline-none focus:border-[#00a3c4]"
                  />
                </div>
                <div className="hidden md:block"></div>
              </div>

              <div className="w-full flex justify-center mt-4 md:mt-6">
                <button type="submit" className="w-full sm:w-auto bg-[#0082A4] text-white px-8 md:px-10 py-3 md:py-3.5 text-xs sm:text-sm font-bold tracking-widest uppercase rounded-3xl hover:bg-[#006a85] transition-colors">
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