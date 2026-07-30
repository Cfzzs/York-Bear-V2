"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiPackage, FiShoppingBag, FiUsers, FiDollarSign } from "react-icons/fi";

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
  });

  useEffect(() => {
    Promise.all([
      fetch("/api/products").then((r) => r.json()),
      fetch("/api/orders").then((r) => r.json()),
      fetch("/api/users").then((r) => r.json()),
    ])
      .then(([products, orders, users]) => {
        const totalRevenue = (orders.orders || []).reduce(
          (acc: number, o: any) =>
            o.status !== "cancelled" ? acc + (o.total || 0) : acc,
          0
        );
        setMetrics({
          totalProducts: products.products?.length || 0,
          totalOrders: orders.orders?.length || 0,
          totalUsers: users.users?.length || 0,
          totalRevenue,
        });
      })
      .catch(console.error);
  }, []);

  const cards = [
    {
      label: "Produtos",
      value: metrics.totalProducts,
      icon: FiPackage,
      color: "text-brand-neon",
      bg: "bg-brand-neon/10",
    },
    {
      label: "Pedidos",
      value: metrics.totalOrders,
      icon: FiShoppingBag,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Usuários",
      value: metrics.totalUsers,
      icon: FiUsers,
      color: "text-brand-accent",
      bg: "bg-brand-accent/10",
    },
    {
      label: "Receita",
      value: `R$ ${metrics.totalRevenue.toFixed(2)}`,
      icon: FiDollarSign,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-black mb-8"
      >
        DASHBOARD
      </motion.h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-brand-gray-900 rounded-xl p-6"
          >
            <div
              className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center mb-4`}
            >
              <card.icon className={`w-5 h-5 ${card.color}`} />
            </div>
            <p className="text-2xl font-black">{card.value}</p>
            <p className="text-sm text-brand-gray-600">{card.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-brand-gray-900 rounded-xl p-8 text-center">
        <p className="text-brand-gray-600">
          Bem-vindo ao painel administrativo
        </p>
        <p className="text-sm text-brand-gray-600 mt-2">
          Use o menu lateral para gerenciar produtos, pedidos, eventos e mais
        </p>
      </div>
    </div>
  );
}
