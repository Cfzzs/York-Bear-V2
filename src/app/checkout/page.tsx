"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";
import Link from "next/link";
import { FiLock } from "react-icons/fi";

export default function CheckoutPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

  const [form, setForm] = useState({
    street: "",
    number: "",
    complement: "",
    neighborhood: "",
    city: "",
    state: "",
    zip: "",
  });
  const [submitting, setSubmitting] = useState(false);

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-black">CARRINHO VAZIO</h1>
        <Link href="/shop">
          <Button variant="primary">Voltar à loja</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Faça login para finalizar o pedido");
      router.push("/auth/login");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          shippingAddress: form,
          paymentMethod: "pix",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao criar pedido");
      }

      clearCart();
      toast.success("Pedido realizado com sucesso!");
      router.push("/profile/orders");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const shipping = getTotal() >= 299 ? 0 : 19.9;
  const total = getTotal() + shipping;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-5xl font-black mb-8"
        >
          CHECKOUT
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <form
            onSubmit={handleSubmit}
            className="md:col-span-3 space-y-6"
          >
            <div className="bg-brand-gray-900 rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Endereço de entrega</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 md:col-span-1">
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Rua
                  </label>
                  <input
                    required
                    value={form.street}
                    onChange={(e) => updateField("street", e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Número
                  </label>
                  <input
                    required
                    value={form.number}
                    onChange={(e) => updateField("number", e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Complemento
                  </label>
                  <input
                    value={form.complement}
                    onChange={(e) =>
                      updateField("complement", e.target.value)
                    }
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Bairro
                  </label>
                  <input
                    required
                    value={form.neighborhood}
                    onChange={(e) =>
                      updateField("neighborhood", e.target.value)
                    }
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Cidade
                  </label>
                  <input
                    required
                    value={form.city}
                    onChange={(e) => updateField("city", e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    Estado
                  </label>
                  <input
                    required
                    value={form.state}
                    onChange={(e) => updateField("state", e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
                <div>
                  <label className="text-xs text-brand-gray-600 block mb-1">
                    CEP
                  </label>
                  <input
                    required
                    value={form.zip}
                    onChange={(e) => updateField("zip", e.target.value)}
                    className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="bg-brand-gray-900 rounded-xl p-6 space-y-4">
              <h2 className="font-bold text-lg">Pagamento</h2>
              <div className="flex items-center gap-3 p-4 border border-brand-accent/30 bg-brand-accent/5 rounded-lg">
                <div className="w-10 h-10 rounded-full bg-brand-accent/20 flex items-center justify-center">
                  <FiLock className="w-4 h-4 text-brand-accent" />
                </div>
                <div>
                  <p className="font-bold text-sm">PIX</p>
                  <p className="text-xs text-brand-gray-600">
                    Pagamento instantâneo e seguro
                  </p>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              loading={submitting}
            >
              Finalizar pedido - R$ {total.toFixed(2)}
            </Button>
          </form>

          <div className="md:col-span-2">
            <div className="bg-brand-gray-900 rounded-xl p-6 space-y-4 sticky top-24">
              <h2 className="font-bold text-lg">Resumo</h2>
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.color}`}
                  className="flex justify-between text-sm"
                >
                  <span className="text-brand-gray-600 truncate mr-2">
                    {item.name} ({item.size}) x{item.quantity}
                  </span>
                  <span className="font-bold">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <hr className="border-white/5" />
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray-600">Subtotal</span>
                <span>R$ {getTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-brand-gray-600">Frete</span>
                <span
                  className={
                    shipping === 0
                      ? "text-brand-accent font-bold"
                      : ""
                  }
                >
                  {shipping === 0 ? "Grátis" : `R$ ${shipping.toFixed(2)}`}
                </span>
              </div>
              <hr className="border-white/5" />
              <div className="flex justify-between text-lg">
                <span className="font-bold">Total</span>
                <span className="font-black text-brand-neon">
                  R$ {total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
