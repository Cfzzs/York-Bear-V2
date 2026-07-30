"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface BannerData {
  _id: string;
  image: string;
  title: string;
  subtitle?: string;
  link?: string;
}

const defaultBanners: BannerData[] = [
  {
    _id: "1",
    image: "https://images.unsplash.com/photo-1523398002811-999ca8dec234?w=1600&q=80",
    title: "NOVA COLEÇÃO",
    subtitle: "O futuro do streetwear chegou",
    link: "/shop",
  },
  {
    _id: "2",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1600&q=80",
    title: "DROP LIMITADO",
    subtitle: "Peças exclusivas por tempo limitado",
    link: "/shop?category=drop",
  },
  {
    _id: "3",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=1600&q=80",
    title: "STREETWEAR É ATITUDE",
    subtitle: "Vista-se como quem você é",
    link: "/shop",
  },
];

interface HeroCarouselProps {
  banners?: BannerData[];
}

export default function HeroCarousel({
  banners = defaultBanners,
}: HeroCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % banners.length);
  }, [banners.length]);

  const prev = useCallback(() => {
    setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length]);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [isPaused, next]);

  if (!banners || banners.length === 0) return null;

  return (
    <section
      className="relative h-[80vh] min-h-[500px] max-h-[900px] overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0"
        >
          <Image
            src={banners[current].image}
            alt={banners[current].title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-lg"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black leading-none mb-4">
              {banners[current].title}
            </h1>
            {banners[current].subtitle && (
              <p className="text-lg md:text-xl text-gray-300 mb-8">
                {banners[current].subtitle}
              </p>
            )}
            <Link
              href={banners[current].link || "/shop"}
              className="inline-block bg-brand-neon text-white font-bold px-8 py-4 rounded hover:bg-red-700 transition-colors glow-neon"
            >
              EXPLORAR
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-brand-neon/80 transition-colors"
      >
        <FiChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-brand-neon/80 transition-colors"
      >
        <FiChevronRight className="w-5 h-5" />
      </button>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-10 h-1 rounded-full transition-all ${
              i === current ? "bg-brand-neon w-16" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
