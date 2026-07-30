"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import Image from "next/image";
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from "react-icons/fi";

export default function AdminBannerPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    image: "",
    title: "",
    subtitle: "",
    link: "",
  });

  const load = async () => {
    try {
      const res = await fetch("/api/banners");
      const data = await res.json();
      setBanners(data.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/banners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, order: banners.length }),
      });
      if (!res.ok) throw new Error("Erro ao criar banner");
      toast.success("Banner criado!");
      setShowForm(false);
      setForm({ image: "", title: "", subtitle: "", link: "" });
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar banner?")) return;
    try {
      const res = await fetch(`/api/banners?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      toast.success("Banner deletado");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const reorder = async (id: string, direction: "up" | "down") => {
    const idx = banners.findIndex((b) => b._id === id);
    if (idx === -1) return;
    const newBanners = [...banners];
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= newBanners.length) return;
    [newBanners[idx], newBanners[swapIdx]] = [
      newBanners[swapIdx],
      newBanners[idx],
    ];
    setBanners(newBanners);
    try {
      await Promise.all(
        newBanners.map((b, i) =>
          fetch(`/api/banners?id=${b._id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ order: i }),
          })
        )
      );
    } catch (err) {
      load();
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">BANNER ROTATIVO</h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus className="w-4 h-4 mr-1" />
          Novo Banner
        </Button>
      </div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-brand-gray-900 rounded-xl p-6 mb-8"
        >
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                URL da imagem
              </label>
              <input
                required
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                Título
              </label>
              <input
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                Subtítulo
              </label>
              <input
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                Link
              </label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <Button type="submit" variant="primary">
              Adicionar banner
            </Button>
          </form>
        </motion.div>
      )}

      <div className="grid gap-4">
        {banners.map((banner, i) => (
          <div
            key={banner._id}
            className="bg-brand-gray-900 rounded-xl p-4 flex items-center gap-6"
          >
            <div className="relative w-32 h-20 rounded-lg overflow-hidden flex-shrink-0">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold">{banner.title}</h3>
              {banner.subtitle && (
                <p className="text-sm text-brand-gray-600">{banner.subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => reorder(banner._id, "up")}
                disabled={i === 0}
                className="p-2 hover:text-brand-neon disabled:opacity-30"
              >
                <FiArrowUp className="w-4 h-4" />
              </button>
              <button
                onClick={() => reorder(banner._id, "down")}
                disabled={i === banners.length - 1}
                className="p-2 hover:text-brand-neon disabled:opacity-30"
              >
                <FiArrowDown className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleDelete(banner._id)}
                className="p-2 hover:text-red-500"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
        {banners.length === 0 && (
          <div className="bg-brand-gray-900 rounded-xl p-12 text-center">
            <p className="text-brand-gray-600">Nenhum banner cadastrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
