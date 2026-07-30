"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { useCartStore } from "@/lib/store";
import { FiShoppingBag, FiUser, FiMenu, FiX, FiLogOut } from "react-icons/fi";

const navLinks = [
  { href: "/", label: "Início" },
  { href: "/shop", label: "Loja" },
  { href: "/shop?category=novidades", label: "Novidades" },
  { href: "/shop?category=colecoes", label: "Coleções" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session } = useSession();
  const itemCount = useCartStore((s) => s.getItemCount());
  const openCart = useCartStore((s) => s.openCart);
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-brand-black/90 backdrop-blur-xl border-b border-white/5">
      <nav className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-brand-neon rounded-full flex items-center justify-center font-black text-[10px] group-hover:scale-110 transition-transform leading-none">
            YB
          </div>
          <span className="font-black text-xl tracking-widest hidden sm:block">
            YORK BEAR
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-brand-neon transition-all group-hover:w-full" />
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={openCart}
            className="relative p-2 hover:text-brand-neon transition-colors"
          >
            <FiShoppingBag className="w-5 h-5" />
            {itemCount > 0 && (
              <motion.span
                key={itemCount}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-brand-neon text-white text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>

          {session ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/profile"
                className="p-2 hover:text-brand-neon transition-colors"
              >
                <FiUser className="w-5 h-5" />
              </Link>
              {session.user && (session.user as any).role === "admin" && (
                <Link
                  href="/admin"
                  className="text-xs font-bold text-brand-accent hover:underline"
                >
                  ADMIN
                </Link>
              )}
              <button
                onClick={() => signOut()}
                className="p-2 hover:text-brand-neon transition-colors"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <Link
              href="/auth/login"
              className="hidden sm:block text-sm font-medium hover:text-brand-neon transition-colors"
            >
              Entrar
            </Link>
          )}

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <FiX className="w-6 h-6" />
            ) : (
              <FiMenu className="w-6 h-6" />
            )}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden bg-brand-gray-900 border-t border-white/5"
          >
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-bold hover:text-brand-neon transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/10" />
              {session ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block text-lg font-bold hover:text-brand-neon transition-colors"
                  >
                    Meu Perfil
                  </Link>
                  {session.user && (session.user as any).role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="block text-lg font-bold text-brand-accent"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => signOut()}
                    className="block text-lg font-bold text-brand-neon"
                  >
                    Sair
                  </button>
                </>
              ) : (
                <Link
                  href="/auth/login"
                  onClick={() => setMenuOpen(false)}
                  className="block text-lg font-bold text-brand-neon"
                >
                  Entrar
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
