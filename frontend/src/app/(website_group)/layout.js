import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionsBanner from "@/components/QuestionsBanner";
import FloatingActions from "@/components/FloatingActions"; // <-- IMPORT HERE
import { CartProvider } from "@/context/CartContext";

export default function WebsiteGroupLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen w-full relative">
        <Header />

        <div className="flex-grow">
          {children}
        </div>

        <QuestionsBanner />
        <Footer />
        
        {/* <-- ADD COMPONENT HERE --> */}
        <FloatingActions /> 
      </div>
    </CartProvider>
  );
}