"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface CountdownSectionProps {
  title?: string;
  targetDate?: string;
}

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownSection({
  title = "PRÓXIMO DROP",
  targetDate = "2026-12-31T23:59:59",
}: CountdownSectionProps) {
  const [time, setTime] = useState(() => getTimeLeft(new Date(targetDate)));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeLeft(new Date(targetDate)));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const units = [
    { label: "Dias", value: time.days },
    { label: "Horas", value: time.hours },
    { label: "Minutos", value: time.minutes },
    { label: "Segundos", value: time.seconds },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-neon/5 via-transparent to-brand-accent/5" />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative max-w-7xl mx-auto px-4 text-center"
      >
        <p className="text-brand-neon font-bold text-sm tracking-[0.3em] uppercase mb-2">
          {title}
        </p>
        <h2 className="text-4xl md:text-6xl font-black mb-12">
          O FUTURO ESTÁ CHEGANDO
        </h2>
        <div className="flex justify-center gap-4 md:gap-8">
          {units.map((unit) => (
            <div key={unit.label} className="text-center">
              <motion.div
                key={unit.value}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 md:w-28 md:h-28 rounded-xl bg-brand-gray-900 border border-white/5 flex items-center justify-center"
              >
                <span className="text-3xl md:text-5xl font-black text-gradient">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </motion.div>
              <p className="text-xs text-brand-gray-600 mt-2 uppercase tracking-wider">
                {unit.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
