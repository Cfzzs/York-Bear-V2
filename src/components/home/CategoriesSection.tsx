"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    name: "Camisetas",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    slug: "camisetas",
  },
  {
    name: "Moletons",
    image:
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800&q=80",
    slug: "moletons",
  },
  {
    name: "Calças",
    image:
      "https://images.unsplash.com/photo-1593032452887-5271b357f314?w=800&q=80",
    slug: "calcas",
  },
  {
    name: "Acessórios",
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80",
    slug: "acessorios",
  },
];

export default function CategoriesSection() {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-brand-neon font-bold text-sm tracking-[0.3em] uppercase mb-2">
            Categorias
          </p>
          <h2 className="text-3xl md:text-5xl font-black">EXPLORE</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className="group relative block aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="25vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-xl font-black text-white">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-brand-neon font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Comprar →
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
