"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/ui/Loading";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/users")
      .then((r) => r.json())
      .then((data) => setUsers(data.users || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div>
      <h1 className="text-3xl font-black mb-8">USUÁRIOS</h1>

      {users.length === 0 ? (
        <div className="bg-brand-gray-900 rounded-xl p-12 text-center">
          <p className="text-brand-gray-600">Nenhum usuário cadastrado</p>
        </div>
      ) : (
        <div className="bg-brand-gray-900 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Nome</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Email</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Função</th>
                  <th className="p-4 text-xs text-brand-gray-600 uppercase">Cadastro</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user: any) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 hover:bg-white/5"
                  >
                    <td className="p-4 font-bold">{user.name}</td>
                    <td className="p-4 text-sm text-brand-gray-600">
                      {user.email}
                    </td>
                    <td className="p-4">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded ${
                          user.role === "admin"
                            ? "bg-brand-neon/10 text-brand-neon"
                            : "bg-brand-accent/10 text-brand-accent"
                        }`}
                      >
                        {user.role === "admin" ? "Admin" : "Usuário"}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-brand-gray-600">
                      {new Date(user.createdAt).toLocaleDateString("pt-BR")}
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
