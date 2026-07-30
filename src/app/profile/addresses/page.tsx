"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import { FiMapPin } from "react-icons/fi";

export default function AddressesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") return <Loading />;
  if (!session) return null;

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Link
            href="/profile"
            className="text-sm text-brand-gray-600 hover:text-white mb-4 inline-block"
          >
            ← Voltar
          </Link>
          <h1 className="text-3xl md:text-5xl font-black mb-8">ENDEREÇOS</h1>
          <div className="bg-brand-gray-900 rounded-xl p-8 text-center">
            <FiMapPin className="w-12 h-12 text-brand-gray-700 mx-auto mb-4" />
            <p className="text-brand-gray-600">
              Gerencie seus endereços de entrega
            </p>
            <p className="text-sm text-brand-gray-600 mt-2">
              Você pode adicionar endereços no checkout
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
