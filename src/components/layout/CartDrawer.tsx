"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/lib/store";
import { FiX, FiTrash2, FiMinus, FiPlus } from "react-icons/fi";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotal } =
    useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-brand-gray-900 z-50 shadow-2xl border-l border-white/5"
          >
            <div className="flex flex-col h-full">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <h2 className="text-lg font-bold">
                  CARRINHO ({items.length})
                </h2>
                <button
                  onClick={closeCart}
                  className="p-2 hover:text-brand-neon transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-brand-gray-600 mb-4">
                      Seu carrinho está vazio
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeCart}
                      className="text-brand-neon font-bold hover:underline"
                    >
                      Explorar produtos
                    </Link>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div
                      key={`${item.productId}-${item.size}-${item.color}`}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 bg-brand-black/50 rounded-lg p-3"
                    >
                      <div className="relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm truncate">
                          {item.name}
                        </h3>
                        <p className="text-xs text-brand-gray-600">
                          {item.size} / {item.color}
                        </p>
                        <p className="text-brand-neon font-bold text-sm mt-1">
                          R$ {item.price.toFixed(2)}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.productId,
                                item.size,
                                item.color,
                                Math.max(1, item.quantity - 1)
                              )
                            }
                            className="p-1 hover:text-brand-neon"
                          >
                            <FiMinus className="w-3 h-3" />
                          </button>
                          <span className="text-sm font-mono w-6 text-center">
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
                            className="p-1 hover:text-brand-neon"
                          >
                            <FiPlus className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() =>
                              removeItem(
                                item.productId,
                                item.size,
                                item.color
                              )
                            }
                            className="p-1 hover:text-red-500 ml-auto"
                          >
                            <FiTrash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {items.length > 0 && (
                <div className="border-t border-white/5 p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-brand-gray-600">Subtotal</span>
                    <span className="font-bold text-lg">
                      R$ {getTotal().toFixed(2)}
                    </span>
                  </div>
                  <Link
                    href="/checkout"
                    onClick={closeCart}
                    className="block w-full bg-brand-neon text-white font-bold text-center py-4 rounded hover:bg-red-700 transition-colors"
                  >
                    FINALIZAR PEDIDO
                  </Link>
                  <button
                    onClick={closeCart}
                    className="block w-full text-sm text-brand-gray-600 hover:text-white transition-colors text-center"
                  >
                    Continuar comprando
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
