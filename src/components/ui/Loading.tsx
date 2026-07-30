"use client";

import { motion } from "framer-motion";

export default function Loading({ text = "Carregando..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
      <motion.div
        className="relative w-16 h-16"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      >
        <div className="absolute inset-0 border-2 border-brand-gray-700 rounded-full" />
        <div className="absolute inset-0 border-2 border-brand-neon rounded-full border-t-transparent" />
      </motion.div>
      <motion.p
        className="text-sm text-brand-gray-600 font-mono"
        animate={{ opacity: [0.3, 1, 0.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        {text}
      </motion.p>
    </div>
  );
}
