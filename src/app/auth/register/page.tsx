"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erro ao cadastrar");
      }

      toast.success("Conta criada! Faça login.");
      router.push("/auth/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-brand-neon rounded-full flex items-center justify-center font-black text-2xl mx-auto mb-4">
            S
          </div>
          <h1 className="text-3xl font-black">CRIAR CONTA</h1>
          <p className="text-brand-gray-600 text-sm mt-2">
            Junte-se à revolução streetwear
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Nome
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
              placeholder="Seu nome"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Senha
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon transition-colors"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}
          >
            Criar conta
          </Button>
        </form>

        <p className="text-center text-sm text-brand-gray-600 mt-6">
          Já tem conta?{" "}
          <Link
            href="/auth/login"
            className="text-brand-neon font-bold hover:underline"
          >
            Entrar
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
