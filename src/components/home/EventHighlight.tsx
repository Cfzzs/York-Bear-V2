"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { FiCalendar } from "react-icons/fi";

interface EventHighlightProps {
  event?: {
    _id: string;
    title: string;
    description: string;
    image: string;
    date: string;
    link?: string;
    type: string;
  } | null;
}

export default function EventHighlight({ event }: EventHighlightProps) {
  if (!event) return null;

  const dateStr = new Date(event.date).toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="relative h-[400px] md:h-[500px]">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-center p-8 md:p-16">
            <div className="max-w-lg">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center gap-2 text-brand-neon font-bold text-sm mb-4">
                  <FiCalendar className="w-4 h-4" />
                  <span className="tracking-[0.2em] uppercase">
                    {event.type === "drop"
                      ? "DROP"
                      : event.type === "fashion_show"
                      ? "DESFILE"
                      : event.type === "launch"
                      ? "LANÇAMENTO"
                      : "EVENTO"}{" "}
                    — {dateStr}
                  </span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black mb-4">
                  {event.title}
                </h2>
                <p className="text-gray-300 mb-8">{event.description}</p>
                {event.link && (
                  <Link href={event.link}>
                    <Button variant="accent" size="lg">
                      Saiba mais
                    </Button>
                  </Link>
                )}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
