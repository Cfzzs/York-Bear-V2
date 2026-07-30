"use client";

import { motion } from "framer-motion";
import ProductCard from "@/components/ui/ProductCard";
import Button from "@/components/ui/Button";
import Link from "next/link";

interface FeaturedProductsProps {
  products: any[];
}

export default function FeaturedProducts({
  products = [],
}: FeaturedProductsProps) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center justify-between mb-12"
        >
          <div>
            <p className="text-brand-neon font-bold text-sm tracking-[0.3em] uppercase mb-2">
              Destaques
            </p>
            <h2 className="text-3xl md:text-5xl font-black">LANÇAMENTOS</h2>
          </div>
          <Link href="/shop">
            <Button variant="outline" size="sm">
              Ver tudo
            </Button>
          </Link>
        </motion.div>

        {products.length === 0 ? (
          <div className="text-center py-20 text-brand-gray-600">
            <p>Nenhum produto em destaque ainda.</p>
            <p className="text-sm mt-2">
              Adicione produtos no painel admin.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
