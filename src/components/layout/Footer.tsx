"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiInstagram, FiTwitter, FiYoutube, FiMail } from "react-icons/fi";
import { FaTiktok } from "react-icons/fa";
import { useState } from "react";
import toast from "react-hot-toast";

const socialLinks = [
  { icon: FiInstagram, href: "#", label: "Instagram" },
  { icon: FiTwitter, href: "#", label: "Twitter" },
  { icon: FaTiktok, href: "#", label: "TikTok" },
  { icon: FiYoutube, href: "#", label: "YouTube" },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      toast.success("Inscrito na newsletter!");
      setEmail("");
    }
  };

  return (
    <footer className="bg-brand-gray-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-brand-neon rounded-full flex items-center justify-center font-black text-[10px] leading-none">
            YB
          </div>
          <span className="font-black text-xl tracking-widest">
            YORK BEAR
          </span>
            </div>
            <p className="text-brand-gray-600 text-sm max-w-md mb-6">
              Sua loja de roupas premium. Roupas que definem estilo, atitude
              e personalidade. Seja parte da revolução urbana.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-brand-gray-600 hover:text-brand-neon hover:border-brand-neon transition-all"
                >
                  <social.icon className="w-4 h-4" />
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Links
            </h3>
            <div className="space-y-3">
              {[
                { href: "/shop", label: "Todos os Produtos" },
                { href: "/shop?category=novidades", label: "Novidades" },
                { href: "/shop?category=masculino", label: "Masculino" },
                { href: "/shop?category=feminino", label: "Feminino" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-brand-gray-600 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4">
              Ajuda
            </h3>
            <div className="space-y-3">
              {[
                { href: "#", label: "FAQ" },
                { href: "#", label: "Trocas e Devoluções" },
                { href: "#", label: "Entregas" },
                { href: "#", label: "Contato" },
              ].map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="block text-sm text-brand-gray-600 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-brand-gray-600">
              © 2026 STREETWEAR STORE. Todos os direitos reservados.
            </p>
            <form
              onSubmit={handleNewsletter}
              className="flex items-center gap-2"
            >
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-gray-600" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu melhor e-mail"
                  className="bg-brand-black border border-white/10 rounded pl-10 pr-4 py-2 text-sm w-64 focus:outline-none focus:border-brand-neon transition-colors"
                  required
                />
              </div>
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-brand-neon text-white text-sm font-bold px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Inscrever
              </motion.button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
}
