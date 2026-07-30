"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/layout/AdminSidebar";
import Loading from "@/components/ui/Loading";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (
      status === "authenticated" &&
      (session?.user as any)?.role !== "admin"
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") return <Loading text="Verificando acesso..." />;
  if (!session || (session.user as any)?.role !== "admin") return null;

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  );
}
