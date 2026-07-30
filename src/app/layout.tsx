"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/layout/CartDrawer";
import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="min-h-screen bg-brand-black text-brand-white">
        <SessionProvider>
          <Navbar />
          <main className="pt-20">{children}</main>
          <Footer />
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#1a1a1a",
                color: "#fafafa",
                border: "1px solid #2a2a2a",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
