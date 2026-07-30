"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from "react-icons/fi";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotal, clearCart } =
    useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <FiShoppingBag className="w-16 h-16 text-brand-gray-700" />
        <h1 className="text-2xl font-black">CARRINHO VAZIO</h1>
        <p className="text-brand-gray-600">
          Adicione produtos para continuar
        </p>
        <Link href="/shop">
          <Button variant="primary">Explorar produtos</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-5xl font-black">
            CARRINHO ({items.length})
          </h1>
          <button
            onClick={clearCart}
            className="text-sm text-brand-gray-600 hover:text-red-500 transition-colors"
          >
            Limpar carrinho
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item) => (
            <motion.div
              key={`${item.productId}-${item.size}-${item.color}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex gap-6 bg-brand-gray-900 rounded-xl p-4"
            >
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg truncate">{item.name}</h3>
                <p className="text-sm text-brand-gray-600">
                  {item.size} / {item.color}
                </p>
                <p className="text-brand-neon font-bold text-xl mt-1">
                  R$ {item.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center border border-white/10 rounded-lg">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          Math.max(1, item.quantity - 1)
                        )
                      }
                      className="p-2 hover:text-brand-neon"
                    >
                      <FiMinus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-mono text-sm">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.productId,
                          item.size,
                          item.color,
                          item.quantity + 1
                        )
                      }
                      className="p-2 hover:text-brand-neon"
                    >
                      <FiPlus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() =>
                      removeItem(item.productId, item.size, item.color)
                    }
                    className="p-2 text-brand-gray-600 hover:text-red-500 transition-colors"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 bg-brand-gray-900 rounded-xl p-6">
          <div className="flex justify-between text-lg mb-2">
            <span className="text-brand-gray-600">Subtotal</span>
            <span className="font-bold">R$ {getTotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-4">
            <span className="text-brand-gray-600">Frete</span>
            <span className="text-brand-accent font-bold">
              {getTotal() >= 299 ? "Grátis" : "Calculado no checkout"}
            </span>
          </div>
          <Link href="/checkout">
            <Button variant="primary" size="lg" className="w-full">
              Finalizar pedido
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
