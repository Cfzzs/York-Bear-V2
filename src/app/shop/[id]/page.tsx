"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCartStore } from "@/lib/store";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { FiMinus, FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";

export default function ProductDetailPage() {
  const params = useParams();
  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products?slug=${params.id}`);
        const data = await res.json();
        if (data.product) {
          setProduct(data.product);
          setSelectedSize(data.product.sizes[0] || "");
          setSelectedColor(data.product.colors[0]?.name || "");
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [params.id]);

  if (loading) return <Loading />;
  if (!product)
    return (
      <div className="text-center py-20">
        <p className="text-brand-gray-600">Produto não encontrado</p>
      </div>
    );

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      image: product.images[0] || "https://placehold.co/600x800/1a1a1a/333?text=Sem+Imagem",
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity,
    });
    toast.success(`${product.name} adicionado ao carrinho!`);
    openCart();
  };

  return (
    <div className="min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-brand-gray-900 mb-4">
              <Image
                src={
                  product.images[selectedImage] || "https://placehold.co/600x800/1a1a1a/333?text=Sem+Imagem"
                }
                alt={product.name}
                fill
                className="object-cover"
                priority
                sizes="50vw"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage - 1 + product.images.length) %
                          product.images.length
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-brand-neon/80 transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setSelectedImage(
                        (selectedImage + 1) % product.images.length
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-brand-neon/80 transition-colors"
                  >
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((img: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-colors ${
                      i === selectedImage
                        ? "border-brand-neon"
                        : "border-transparent"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div>
              <p className="text-sm text-brand-gray-600 uppercase tracking-wider">
                {product.category}
              </p>
              <h1 className="text-3xl md:text-5xl font-black mt-1">
                {product.name}
              </h1>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-3xl font-black text-brand-neon">
                R$ {product.price.toFixed(2)}
              </span>
              {product.comparePrice && (
                <span className="text-lg text-brand-gray-600 line-through">
                  R$ {product.comparePrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-400 leading-relaxed">
              {product.description}
            </p>

            {product.sizes.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-3">
                  TAMANHO:{" "}
                  <span className="text-brand-neon">{selectedSize}</span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg border text-sm font-bold transition-all ${
                        selectedSize === size
                          ? "bg-brand-neon border-brand-neon text-white"
                          : "border-white/10 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {product.colors.length > 0 && (
              <div>
                <p className="text-sm font-bold mb-3">
                  COR:{" "}
                  <span className="text-brand-neon">{selectedColor}</span>
                </p>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((c: { name: string; hex: string }) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedColor === c.name
                          ? "border-brand-neon bg-brand-neon/10"
                          : "border-white/10 hover:border-white/30"
                      }`}
                    >
                      <span
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4">
              <p className="text-sm font-bold">QTD:</p>
              <div className="flex items-center border border-white/10 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:text-brand-neon transition-colors"
                >
                  <FiMinus className="w-4 h-4" />
                </button>
                <span className="px-4 font-mono font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:text-brand-neon transition-colors"
                >
                  <FiPlus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              className="w-full md:w-auto"
              onClick={handleAddToCart}
            >
              Adicionar ao carrinho
            </Button>

            <div className="border-t border-white/5 pt-6">
              <p className="text-xs text-brand-gray-600">
                Frete grátis para pedidos acima de R$ 299 • Até 6x sem juros •
                Troca grátis em até 30 dias
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
