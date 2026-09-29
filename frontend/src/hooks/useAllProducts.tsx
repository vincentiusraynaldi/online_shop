import { useState, useEffect } from "react";
import { Product } from "../entity/Product";

export function useAllProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch(`/items`); // no query params
        if (!response.ok) return;
        const json = await response.json();
        setProducts(json.data);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []); // runs once, never tied to searchParams

  return { products, loading };
}