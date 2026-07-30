"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Loading from "@/components/ui/Loading";
import { FiFilter } from "react-icons/fi";

const categories = [
  "Todos",
  "Camisetas",
  "Moletons",
  "Calças",
  "Acessórios",
  "Novidades",
  "Drop",
];

function ShopContent() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "Todos";
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory && selectedCategory !== "Todos") {
          params.set("category", selectedCategory.toLowerCase());
        }
        const res = await fetch(`/api/products?${params}`);
        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [selectedCategory]);

  const displayCategory =
    selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1);

  return (
    <div className="min-h-screen pt-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-4xl md:text-6xl font-black">LOJA</h1>
            <p className="text-brand-gray-600 mt-1">
              {products.length} produto{products.length !== 1 ? "s" : ""}{" "}
              encontrado{products.length !== 1 ? "s" : ""}
              {selectedCategory !== "Todos"
                ? ` em "${displayCategory}"`
                : ""}
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm text-brand-gray-600 hover:text-white transition-colors"
          >
            <FiFilter className="w-4 h-4" />
            Filtros
          </button>
        </motion.div>

        <div className="flex gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat.toLowerCase())}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                selectedCategory === cat.toLowerCase()
                  ? "bg-brand-neon text-white"
                  : "bg-brand-gray-800 text-gray-400 hover:bg-brand-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-brand-gray-600 text-lg">
              Nenhum produto encontrado
            </p>
            <p className="text-sm text-brand-gray-600 mt-2">
              Tente outra categoria ou volte mais tarde.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {products.map((product: any, i: number) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<Loading />}>
      <ShopContent />
    </Suspense>
  );
}
