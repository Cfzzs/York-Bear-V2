"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";

const statusColors: Record<string, string> = {
  pending: "text-yellow-500",
  confirmed: "text-blue-500",
  shipped: "text-brand-accent",
  delivered: "text-brand-neon",
  cancelled: "text-red-500",
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (id: string, status: string) => {
    try {
      const res = await fetch(`/api/orders?id=${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Erro ao atualizar");
      toast.success("Status atualizado!");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">PEDIDOS</h1>

      {orders.length === 0 ? (
        <div className="bg-brand-gray-900 rounded-xl p-12 text-center">
          <p className="text-brand-gray-600">Nenhum pedido ainda</p>
        </div>
      ) : (
        <div className="bg-brand-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Pedido</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Cliente</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Total</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Status</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Data</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Ações</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => (
                  <tr
                    key={order._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 font-mono text-sm">
                      #{order._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="p-4 text-sm">{order.userId?.name || "N/A"}</td>
                    <td className="p-4 font-bold">
                      R$ {order.total.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-sm font-bold ${statusColors[order.status] || ""}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-brand-gray-600">
                      {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                    </td>
                    <td className="p-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="bg-brand-black border border-white/10 rounded px-2 py-1 text-sm"
                      >
                        {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                          (s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          )
                        )}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
