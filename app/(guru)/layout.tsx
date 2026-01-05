"use client";

import { ReactNode, useState, useEffect } from "react";
import BottomNav from "./components/BottomNav";
import { ProtectedRoute } from "@/components/ProtectedRoute";

export default function GuruLayout({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(t);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div suppressHydrationWarning={true} className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
        <main suppressHydrationWarning={true} className="flex-1">{children}</main>
        <BottomNav />
      </div>
    </ProtectedRoute>
  );
}
