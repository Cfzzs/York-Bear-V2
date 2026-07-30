"use client";

import { useEffect, useState } from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import CountdownSection from "@/components/home/CountdownSection";
import EventHighlight from "@/components/home/EventHighlight";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import CategoriesSection from "@/components/home/CategoriesSection";
import ScrollReveal from "@/components/ui/ScrollReveal";
import Loading from "@/components/ui/Loading";

export default function HomePage() {
  const [data, setData] = useState<{
    banners: any[];
    countdown: any;
    event: any;
    products: any[];
  }>({ banners: [], countdown: null, event: null, products: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [bannersRes, countdownRes, eventRes, productsRes] =
          await Promise.all([
            fetch("/api/banners").then((r) => r.json()),
            fetch("/api/countdown").then((r) => r.json()),
            fetch("/api/events?published=true&limit=1").then((r) => r.json()),
            fetch("/api/products?featured=true&limit=8").then((r) => r.json()),
          ]);
        setData({
          banners: bannersRes.banners || [],
          countdown: countdownRes.countdown || null,
          event: eventRes.events?.[0] || null,
          products: productsRes.products || [],
        });
      } catch (err) {
        console.error("Error loading home data:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <HeroCarousel
        banners={
          data.banners.length > 0 ? data.banners : undefined
        }
      />
      <ScrollReveal>
        <CountdownSection
          title={data.countdown?.title || "PRÓXIMO DROP"}
          targetDate={
            data.countdown?.targetDate || "2026-12-31T23:59:59"
          }
        />
      </ScrollReveal>
      <ScrollReveal>
        <EventHighlight event={data.event} />
      </ScrollReveal>
      <ScrollReveal>
        <FeaturedProducts products={data.products} />
      </ScrollReveal>
      <ScrollReveal>
        <CategoriesSection />
      </ScrollReveal>
    </>
  );
}
