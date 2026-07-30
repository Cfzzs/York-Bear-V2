"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";
import Loading from "@/components/ui/Loading";
import toast from "react-hot-toast";
import { FiEdit2, FiTrash2, FiPlus } from "react-icons/fi";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Deletar produto?")) return;
    try {
      const res = await fetch(`/api/products?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar");
      toast.success("Produto deletado");
      load();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  if (loading) return <Loading />;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-black">PRODUTOS</h1>
        <Link href="/admin/products/new">
          <Button variant="primary" size="sm">
            <FiPlus className="w-4 h-4 mr-1" />
            Novo Produto
          </Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-brand-gray-900 rounded-xl p-12 text-center">
          <p className="text-brand-gray-600">Nenhum produto cadastrado</p>
          <Link href="/admin/products/new">
            <Button variant="primary" className="mt-4">
              Criar primeiro produto
            </Button>
          </Link>
        </div>
      ) : (
        <div className="bg-brand-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Produto
                  </th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Preço
                  </th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Estoque
                  </th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Categoria
                  </th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.map((product: any) => (
                  <tr
                    key={product._id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="p-4 font-bold">{product.name}</td>
                    <td className="p-4">R$ {product.price.toFixed(2)}</td>
                    <td className="p-4">{product.stock}</td>
                    <td className="p-4 text-sm text-brand-gray-600">
                      {product.category}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          product.published
                            ? "bg-brand-accent/10 text-brand-accent"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {product.published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${product._id}`}
                          className="p-2 hover:text-brand-neon transition-colors"
                        >
                          <FiEdit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="p-2 hover:text-red-500 transition-colors"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
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
