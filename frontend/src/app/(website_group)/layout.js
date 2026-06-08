import React from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuestionsBanner from "@/components/QuestionsBanner";
import FloatingActions from "@/components/FloatingActions";
import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { LocaleProvider } from "@/context/LocaleContext";

export default function WebsiteGroupLayout({ children }) {
  return (
    <LocaleProvider locale="en-in">
      <CartProvider>
        <ProductsProvider>
          <div className="flex flex-col min-h-screen w-full relative">
            <Header />
            <div className="grow">
              {children}
            </div>
            <QuestionsBanner />
            <Footer />
            <FloatingActions />
          </div>
        </ProductsProvider>
      </CartProvider>
    </LocaleProvider>
  );
}