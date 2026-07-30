"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  shipped: "text-brand-accent",
  delivered: "text-brand-neon",
  cancelled: "text-red-500",
};

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/orders")
        .then((r) => r.json())
        .then((data) => setOrders(data.orders || []))
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) return <Loading />;
  if (!session) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/profile"
            className="text-sm text-brand-gray-600 hover:text-white mb-4 inline-block"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-8">MEUS PEDIDOS</h1>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-brand-gray-600">
              <p>Nenhum pedido ainda</p>
              <Link href="/shop" className="text-brand-neon font-bold hover:underline mt-2 inline-block">
                Comprar agora
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div
                  key={order._id}
                  className="bg-brand-gray-900 rounded-xl p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-xs text-brand-gray-600 font-mono">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <p className="text-sm text-brand-gray-600">
                        {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <span
                      className={`text-sm font-bold ${statusColors[order.status] || "text-gray-400"}`}
                    >
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {order.items.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm">
                        <span className="text-brand-gray-600">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="font-bold">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-white/5 mt-4 pt-4 flex justify-between">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-brand-neon">
                      R$ {order.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
