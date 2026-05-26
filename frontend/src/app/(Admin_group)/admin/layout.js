"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation"; // <-- IMPORT useRouter HERE
import { 
  LayoutDashboard, 
  Tags, 
  PackageSearch, 
  ClipboardList, 
  Users,
  Store,
  Wand2,
  Mail,
  FileText,
  Clapperboard, // <-- IMPORTED CLAPPERBOARD FOR INSTA VIDEOS
  Menu, 
  X     
} from "lucide-react";
import { getAdminCustomRequests, getAdminOrders, getAdminContactEnquiries } from "@/lib/api";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter(); // <-- INITIALIZE router HERE

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [unreadContactCount, setUnreadContactCount] = useState(0);
  
  // Mobile sidebar state
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Auth Protection State
  const [isAuthorized, setIsAuthorized] = useState(false); // <-- INITIALIZE isAuthorized HERE

  // Check Authorization
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    
    if (!adminToken) {
      router.push("/adminlogin"); 
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  // Fetch pending counts for the sidebar badges
  useEffect(() => {
    if (!isAuthorized) return; // Don't fetch until authorized

    const fetchBadgeCounts = async () => {
      try {
        const [customRes, ordersRes, contactRes] = await Promise.all([
          getAdminCustomRequests(),
          getAdminOrders(),
          getAdminContactEnquiries()
        ]);

        if (customRes.success) {
          const pendingCustom = customRes.data.filter(req => (req.status || "Pending") === "Pending").length;
          setPendingRequestsCount(pendingCustom);
        }

        if (ordersRes.success) {
          const pendingOrders = ordersRes.data.filter(order => (order.status || "Pending") === "Pending").length;
          setPendingOrdersCount(pendingOrders);
        }

        if (contactRes.success) {
          const unreadContact = contactRes.data.filter(enq => (enq.status || "Unread") === "Unread").length;
          setUnreadContactCount(unreadContact);
        }
      } catch (err) {
        console.error("Failed to fetch badge counts", err);
      }
    };
    
    fetchBadgeCounts();
    const interval = setInterval(fetchBadgeCounts, 30000);
    return () => clearInterval(interval);
  }, [isAuthorized]);

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Products", href: "/admin/products", icon: PackageSearch },
    { name: "Shop Orders", href: "/admin/orders", icon: ClipboardList, badge: pendingOrdersCount },
    { name: "Custom Requests", href: "/admin/custom-requests", icon: Wand2, badge: pendingRequestsCount },
    { name: "Contact Enquiries", href: "/admin/contact", icon: Mail, badge: unreadContactCount },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Insta Videos", href: "/admin/insta", icon: Clapperboard },
    { name: "Blog", href: "/admin/blog", icon: FileText }
  ];

  // Show a loading spinner while checking the token so the admin panel doesn't flash
  if (!isAuthorized) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#F4f9fa]">
        <div className="w-10 h-10 border-4 border-[#E2FCFF] border-t-[#0082A4] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#F4f9fa] font-mona overflow-hidden">
      
      {/* --- MOBILE OVERLAY --- */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 flex flex-col bg-[linear-gradient(180deg,#0082A4_0%,#00CEF3_100%)] text-white shadow-2xl transition-all duration-300 ease-in-out overflow-hidden group/sidebar
          ${isMobileOpen ? "translate-x-0 w-[280px]" : "-translate-x-full w-[280px] md:translate-x-0 md:w-[88px] md:hover:w-[280px]"}`
        }
      >
        
        {/* Mobile Close Button */}
        <button 
          onClick={() => setIsMobileOpen(false)}
          className="absolute top-4 right-4 md:hidden text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-2 rounded-full transition-colors z-50"
        >
          <X size={20} />
        </button>

        {/* Logo Section */}
        <div className="h-[120px] flex flex-col items-center justify-center border-b border-white/20 relative shrink-0">
          
          {/* Expanded Logo (Visible on mobile open OR desktop hover) */}
          <div className={`absolute flex flex-col items-center transition-all duration-300 
            ${isMobileOpen ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100"}`}
          >
            <Link href="/admin">
              <Image 
                src="/images/logo/PuramenteLogo.png" 
                alt="Puramente International" 
                width={160} 
                height={35} 
                className="object-contain hover:scale-105 transition-transform duration-300"
                priority
              />
            </Link>
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase mt-3 opacity-90 text-[#E2FCFF]">
              Admin Workspace
            </span>
          </div>

          {/* Shrunk Logo Icon (Visible ONLY on desktop when NOT hovered) */}
          <div className={`absolute flex items-center justify-center transition-all duration-300
            ${isMobileOpen ? "opacity-0" : "opacity-0 md:opacity-100 md:group-hover/sidebar:opacity-0 scale-50 md:scale-100"}`}
          >
            <Link href="/admin" className="w-12 h-12 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center shadow-inner hover:bg-white/20 transition-colors">
              <span className="font-playfair font-bold text-2xl text-white">P</span>
            </Link>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && (item.href !== "/admin" || pathname === "/admin");
            
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)} // Auto-close on mobile when clicked
                className={`relative flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group ${
                  isActive 
                    ? "bg-white text-[#0082A4] shadow-md font-bold" 
                    : "text-white/80 hover:bg-white/10 hover:text-white font-medium"
                }`}
              >
                {/* Icon (Stays fixed size) */}
                <div className="shrink-0 flex items-center justify-center">
                  <item.icon 
                    size={22} 
                    className={`transition-transform duration-300 ${isActive ? "stroke-[2.5]" : "group-hover:scale-110 stroke-[2]"}`} 
                  />
                </div>

                {/* Text (Fades and slides in on hover) */}
                <span className={`ml-4 tracking-wide text-sm whitespace-nowrap transition-all duration-300 
                  ${isMobileOpen ? "opacity-100 translate-x-0" : "opacity-100 md:opacity-0 md:-translate-x-4 md:group-hover/sidebar:opacity-100 md:group-hover/sidebar:translate-x-0"}`}
                >
                  {item.name}
                </span>
                
                {/* NOTIFICATION BADGE (Number) */}
                {item.badge > 0 && (
                  <span className={`absolute right-3 px-2 py-0.5 text-[10px] font-bold rounded-full transition-all duration-300
                    ${isActive ? "bg-red-500 text-white" : "bg-red-500 text-white shadow-sm"}
                    ${isMobileOpen ? "opacity-100 scale-100" : "opacity-100 md:opacity-0 md:scale-50 md:group-hover/sidebar:opacity-100 md:group-hover/sidebar:scale-100"}  
                  `}>
                    {item.badge}
                  </span>
                )}

                {/* NOTIFICATION DOT (Shows only when sidebar is shrunk on desktop) */}
                {item.badge > 0 && !isMobileOpen && (
                  <span className="absolute top-3 left-8 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0082A4] opacity-0 md:opacity-100 md:group-hover/sidebar:opacity-0 transition-opacity duration-300"></span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Action */}
        <div className="p-4 border-t border-white/20 shrink-0">
          <Link 
            href="/" 
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl bg-black/10 hover:bg-black/20 text-white transition-colors border border-white/10 overflow-hidden"
          >
            <div className="shrink-0 flex items-center justify-center">
              <Store size={22} strokeWidth={2} />
            </div>
            <span className={`tracking-wide text-sm whitespace-nowrap transition-all duration-300
              ${isMobileOpen ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover/sidebar:opacity-100"}`}
            >
              Back to Store
            </span>
          </Link>
        </div>

      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-[88px] transition-all duration-300 relative">
        
        {/* Mobile Header Bar */}
        <header className="md:hidden flex items-center justify-between bg-white border-b border-gray-200 px-4 py-4 z-30 shadow-sm shrink-0">
          <button 
            onClick={() => setIsMobileOpen(true)} 
            className="text-[#0082A4] hover:bg-gray-50 p-1.5 rounded-lg transition-colors"
          >
            <Menu size={28} strokeWidth={2} />
          </button>
          <span className="font-playfair font-bold text-xl text-gray-900 tracking-wide">
            Admin Panel
          </span>
          <div className="w-8"></div> {/* Spacer for centering */}
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {/* Subtle Background Graphic */}
          <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#E2FCFF]/50 to-transparent -z-10 pointer-events-none"></div>
          {children}
        </main>
      </div>

    </div>
  );
}