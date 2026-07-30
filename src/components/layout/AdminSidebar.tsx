"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FiHome,
  FiPackage,
  FiShoppingBag,
  FiCalendar,
  FiImage,
  FiUsers,
  FiArrowLeft,
  FiClock,
} from "react-icons/fi";

const sidebarLinks = [
  { href: "/admin", label: "Dashboard", icon: FiHome },
  { href: "/admin/products", label: "Produtos", icon: FiPackage },
  { href: "/admin/orders", label: "Pedidos", icon: FiShoppingBag },
  { href: "/admin/events", label: "Eventos", icon: FiCalendar },
  { href: "/admin/banner", label: "Banner", icon: FiImage },
  { href: "/admin/countdown", label: "Countdown", icon: FiClock },
  { href: "/admin/users", label: "Usuários", icon: FiUsers },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-brand-gray-900 min-h-screen border-r border-white/5 flex flex-col">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-brand-neon rounded flex items-center justify-center font-black text-xs">
            S
          </div>
          <span className="font-black text-sm tracking-wider">ADMIN</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {sidebarLinks.map((link) => {
          const isActive =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                isActive
                  ? "bg-brand-neon/10 text-brand-neon"
                  : "text-brand-gray-600 hover:text-white hover:bg-white/5"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/5">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-brand-gray-600 hover:text-white transition-colors"
        >
          <FiArrowLeft className="w-4 h-4" />
          Voltar ao site
        </Link>
      </div>
    </aside>
  );
}
