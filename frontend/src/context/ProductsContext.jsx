"use client";

import React, { createContext, useState, useEffect, useContext } from "react";
import { getProducts } from "@/lib/api";

const ProductsContext = createContext();

/**
 * Fetches all products ONCE and shares them across NewArrivals, BestSellers,
 * ShopByCollection, etc. — avoids duplicate API calls on homepage.
 */
export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await getProducts();
        if (response.success && response.data) {
          setProducts(response.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductsContext.Provider>
  );
}

export const useProducts = () => useContext(ProductsContext);
