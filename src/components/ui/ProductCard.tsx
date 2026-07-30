"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import toast from "react-hot-toast";

interface ProductCardProps {
  product: {
    _id: string;
    name: string;
    slug: string;
    price: number;
    comparePrice?: number;
    images: string[];
    category: string;
    sizes: string[];
    colors: { name: string; hex: string }[];
  };
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0] || "https://placehold.co/600x800/1a1a1a/333?text=Sem+Imagem",
      price: product.price,
      size: product.sizes[0] || "U",
      color: product.colors[0]?.name || "Única",
      quantity: 1,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
    openCart();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className="group relative"
    >
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden bg-brand-gray-900 rounded-lg">
          <Image
            src={product.images[0] || "https://placehold.co/600x800/1a1a1a/333?text=Sem+Imagem"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300" />
          {product.comparePrice && (
            <div className="absolute top-3 left-3 bg-brand-neon text-white text-xs font-bold px-2 py-1 rounded">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button
              onClick={handleQuickAdd}
              className="w-full bg-white text-brand-black font-bold text-sm py-3 rounded hover:bg-brand-neon hover:text-white transition-colors"
            >
              ADICIONAR AO CARRINHO
            </button>
          </div>
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-brand-gray-600 uppercase tracking-wider">
            {product.category}
          </p>
          <h3 className="font-bold text-sm truncate">{product.name}</h3>
          <div className="flex items-center gap-2">
            <span className="text-brand-neon font-bold">
              R$ {product.price.toFixed(2)}
            </span>
            {product.comparePrice && (
              <span className="text-brand-gray-600 text-sm line-through">
                R$ {product.comparePrice.toFixed(2)}
              </span>
            )}
          </div>
          {product.colors.length > 0 && (
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((c) => (
                <span
                  key={c.name}
                  className="w-3 h-3 rounded-full border border-white/20"
                  style={{ backgroundColor: c.hex }}
                  title={c.name}
                />
              ))}
            </div>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
