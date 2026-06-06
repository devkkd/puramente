import { CartProvider } from "@/context/CartContext";
import { ProductsProvider } from "@/context/ProductsContext";
import { LocaleProvider } from "@/context/LocaleContext";

// Provides context for pages that don't have a locale prefix yet
// (account, cart, blog etc. that are still at root level)
// Header/Footer are in [locale]/layout.js — NOT here
export default function WebsiteGroupLayout({ children }) {
  return (
    <LocaleProvider locale="en-in">
      <CartProvider>
        <ProductsProvider>
          {children}
        </ProductsProvider>
      </CartProvider>
    </LocaleProvider>
  );
}