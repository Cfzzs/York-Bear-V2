"use client";

import { motion } from "framer-motion";
import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "accent";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  href?: string;
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  className = "",
  ...props
}: ButtonProps) {
  const base =
    "relative inline-flex items-center justify-center font-bold uppercase tracking-wider transition-all duration-300 rounded";

  const sizes = {
    sm: "px-4 py-2 text-xs",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };

  const variants = {
    primary:
      "bg-brand-neon text-white hover:bg-red-700 glow-neon hover:scale-105",
    secondary:
      "bg-brand-gray-800 text-white hover:bg-brand-gray-700 border border-brand-gray-600",
    outline:
      "border-2 border-brand-neon text-brand-neon hover:bg-brand-neon hover:text-white",
    ghost: "text-white hover:text-brand-neon",
    accent: "bg-brand-accent text-brand-black hover:bg-green-400 glow-accent hover:scale-105",
  };

  return (
    <motion.button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      disabled={loading}
      {...(props as any)}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
          Carregando...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
