"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import { FiPackage, FiMapPin, FiUser } from "react-icons/fi";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    }
  }, [status, router]);

  if (status === "loading") return <Loading />;
  if (!session) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl md:text-5xl font-black mb-8">
            MEU PERFIL
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-brand-gray-900 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-brand-neon/10 flex items-center justify-center">
                  <FiUser className="w-5 h-5 text-brand-neon" />
                </div>
                <div>
                  <p className="font-bold">{session.user?.name}</p>
                  <p className="text-sm text-brand-gray-600">
                    {session.user?.email}
                  </p>
                </div>
              </div>
              <p className="text-xs text-brand-gray-600">
                Membro desde{" "}
                {new Date().toLocaleDateString("pt-BR", {
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            <Link
              href="/profile/orders"
              className="bg-brand-gray-900 rounded-xl p-6 hover:border-brand-neon/30 border border-transparent transition-all group"
            >
              <FiPackage className="w-8 h-8 text-brand-gray-600 group-hover:text-brand-neon transition-colors mb-3" />
              <h3 className="font-bold">Meus Pedidos</h3>
              <p className="text-sm text-brand-gray-600">
                Acompanhe seus pedidos
              </p>
            </Link>

            <Link
              href="/profile/addresses"
              className="bg-brand-gray-900 rounded-xl p-6 hover:border-brand-neon/30 border border-transparent transition-all group"
            >
              <FiMapPin className="w-8 h-8 text-brand-gray-600 group-hover:text-brand-neon transition-colors mb-3" />
              <h3 className="font-bold">Endereços</h3>
              <p className="text-sm text-brand-gray-600">
                Gerencie endereços
              </p>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
