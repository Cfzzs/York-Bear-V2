"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function AdminCountdownPage() {
  const [form, setForm] = useState({
    title: "PRÓXIMO DROP",
    targetDate: "2026-12-31T23:59",
    active: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/countdown")
      .then((r) => r.json())
      .then((data) => {
        if (data.countdown) {
          setForm({
            title: data.countdown.title,
            targetDate: data.countdown.targetDate.slice(0, 16),
            active: data.countdown.active,
          });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/countdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Erro ao salvar");
      toast.success("Countdown atualizado!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">COUNTDOWN</h1>
      <form onSubmit={handleSubmit} className="max-w-lg space-y-4 bg-brand-gray-900 rounded-xl p-6">
        <div>
          <label className="text-xs text-brand-gray-600 block mb-1">Título</label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
          />
        </div>
        <div>
          <label className="text-xs text-brand-gray-600 block mb-1">
            Data do lançamento
          </label>
          <input
            type="datetime-local"
            required
            value={form.targetDate}
            onChange={(e) =>
              setForm({ ...form, targetDate: e.target.value })
            }
            className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => setForm({ ...form, active: e.target.checked })}
            className="accent-brand-neon"
          />
          <span className="text-sm">Ativo</span>
        </label>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
      </form>
    </div>
  );
}
