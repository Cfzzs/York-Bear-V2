"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    image: "",
    date: "",
    link: "",
    type: "drop",
  });

  const load = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data.events || []);
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
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, published: true }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao criar evento");
      }
      toast.success("Evento criado! E-mails sendo enviados...");
      setShowForm(false);
      setForm({
        title: "",
        description: "",
        image: "",
        date: "",
        link: "",
        type: "drop",
      });
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar evento?")) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      toast.success("Evento deletado");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">EVENTOS</h1>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowForm(!showForm)}
        >
          <FiPlus className="w-4 h-4 mr-1" />
          Novo Evento
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
                Descrição
              </label>
              <textarea
                required
                rows={3}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
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
                Data do evento
              </label>
              <input
                type="datetime-local"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                Link (opcional)
              </label>
              <input
                value={form.link}
                onChange={(e) => setForm({ ...form, link: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              />
            </div>
            <div>
              <label className="text-xs text-brand-gray-600 block mb-1">
                Tipo
              </label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full bg-brand-black border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              >
                <option value="drop">Drop</option>
                <option value="fashion_show">Desfile</option>
                <option value="launch">Lançamento</option>
                <option value="other">Outro</option>
              </select>
            </div>
            <Button type="submit" variant="primary">
              Criar evento e notificar usuários
            </Button>
          </form>
        </motion.div>
      )}

      {events.length === 0 ? (
        <div className="bg-brand-gray-900 rounded-xl p-12 text-center">
          <p className="text-brand-gray-600">Nenhum evento cadastrado</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {events.map((event: any) => (
            <div
              key={event._id}
              className="bg-brand-gray-900 rounded-xl p-6 flex items-center justify-between"
            >
              <div>
                <h3 className="font-bold">{event.title}</h3>
                <p className="text-sm text-brand-gray-600">
                  {new Date(event.date).toLocaleDateString("pt-BR")} —{" "}
                  {event.type}
                </p>
                <span
                  className={`text-xs font-bold ${
                    event.notified
                      ? "text-brand-accent"
                      : "text-yellow-500"
                  }`}
                >
                  {event.notified ? "Notificado" : "Pendente"}
                </span>
              </div>
              <button
                onClick={() => handleDelete(event._id)}
                className="p-2 hover:text-red-500 transition-colors"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
