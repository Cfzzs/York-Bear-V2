"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  duration?: number;
}

const variants = {
  up: { hidden: { y: 60, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  down: { hidden: { y: -60, opacity: 0 }, visible: { y: 0, opacity: 1 } },
  left: { hidden: { x: -60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
  right: { hidden: { x: 60, opacity: 0 }, visible: { x: 0, opacity: 1 } },
};

export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  duration = 0.6,
}: ScrollRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants[direction]}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      {children}
    </motion.div>
  );
}
