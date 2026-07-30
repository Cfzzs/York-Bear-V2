"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";

export default function AdminProductFormPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    comparePrice: 0,
    category: "",
    sizes: "",
    colors: "",
    images: "",
    stock: 0,
    featured: false,
    published: false,
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/products?id=${params.id}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setForm({
              name: p.name,
              slug: p.slug,
              description: p.description,
              price: p.price,
              comparePrice: p.comparePrice || 0,
              category: p.category,
              sizes: p.sizes.join(", "),
              colors: p.colors.map((c: any) => `${c.name}:${c.hex}`).join(", "),
              images: p.images.join("\n"),
              stock: p.stock,
              featured: p.featured,
              published: p.published,
            });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const body = {
      ...form,
      price: Number(form.price),
      comparePrice: form.comparePrice ? Number(form.comparePrice) : undefined,
      stock: Number(form.stock),
      sizes: form.sizes
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      colors: form.colors
        .split(",")
        .map((c) => {
          const [name, hex] = c.trim().split(":");
          return name && hex ? { name: name.trim(), hex: hex.trim() } : null;
        })
        .filter(Boolean),
      images: form.images
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    try {
      const res = await fetch(
        `/api/products${!isNew ? `?id=${params.id}` : ""}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao salvar");
      }
      toast.success(isNew ? "Produto criado!" : "Produto atualizado!");
      router.push("/admin/products");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "name" && isNew) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "");
      }
      return updated;
    });
  };

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">
        {isNew ? "NOVO PRODUTO" : "EDITAR PRODUTO"}
      </h1>

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-xs text-brand-gray-600 block mb-1">
              Nome
            </label>
            <input
              required
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-brand-gray-600 block mb-1">
              Slug (URL)
            </label>
            <input
              required
              value={form.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon font-mono"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-brand-gray-600 block mb-1">
              Descrição
            </label>
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Preço (R$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={form.price}
              onChange={(e) => updateField("price", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Preço original (opcional)
            </label>
            <input
              type="number"
              step="0.01"
              value={form.comparePrice}
              onChange={(e) => updateField("comparePrice", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Categoria
            </label>
            <input
              required
              value={form.category}
              onChange={(e) => updateField("category", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              placeholder="camisetas, moletons, etc"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Estoque
            </label>
            <input
              type="number"
              required
              value={form.stock}
              onChange={(e) => updateField("stock", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Tamanhos (separados por vírgula)
            </label>
            <input
              value={form.sizes}
              onChange={(e) => updateField("sizes", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              placeholder="P, M, G, GG"
            />
          </div>
          <div>
            <label className="text-xs text-brand-gray-600 block mb-1">
              Cores (nome:hex, separadas por vírgula)
            </label>
            <input
              value={form.colors}
              onChange={(e) => updateField("colors", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              placeholder="Preto:#000000, Branco:#ffffff"
            />
          </div>
          <div className="col-span-2">
            <label className="text-xs text-brand-gray-600 block mb-1">
              URLs das imagens (uma por linha)
            </label>
            <textarea
              rows={3}
              value={form.images}
              onChange={(e) => updateField("images", e.target.value)}
              className="w-full bg-brand-gray-900 border border-white/10 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-brand-neon"
              placeholder="https://..."
            />
          </div>
          <div className="col-span-2 flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => updateField("featured", e.target.checked)}
                className="accent-brand-neon"
              />
              <span className="text-sm">Destaque</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(e) => updateField("published", e.target.checked)}
                className="accent-brand-neon"
              />
              <span className="text-sm">Publicado</span>
            </label>
          </div>
        </div>

        <Button type="submit" variant="primary" size="lg" loading={saving}>
          {isNew ? "Criar produto" : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
