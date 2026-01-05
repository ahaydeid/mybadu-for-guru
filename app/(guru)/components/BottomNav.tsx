"use client";

import { ReactElement } from "react";
import { usePathname } from "next/navigation";
import { Home, Bell, Fingerprint, ClipboardCheck, User } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import useSWR from "swr";

type Item = "home" | "info" | "absen" | "tinjau-izin" | "profile";

interface NavItem {
  id: Item;
  label: string;
  icon: ReactElement;
  href: string;
}

export default function BottomNav(): ReactElement | null {
  const pathname = usePathname();
  const { token } = useAuth();
  
  const { data: response } = useSWR(
    token ? ["/pengumuman", token] : null,
    ([, t]) => api.getAnnouncements(t),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  const notificationCount = response?.success 
    ? response.data.filter((ann: { is_active: boolean }) => ann.is_active).length 
    : 0;

  // Sembunyikan pada halaman login
  if (typeof pathname === "string" && pathname.startsWith("/login")) return null;

  // Daftar menu utama
  const items: NavItem[] = [
    { id: "home", label: "Home", icon: <Home className="w-6 h-6" />, href: "/" },
    { id: "tinjau-izin", label: "Tinjau Izin", icon: <ClipboardCheck className="w-6 h-6" />, href: "/tinjau-izin" },
    { id: "absen", label: "Absen", icon: <Fingerprint className="w-6 h-6" />, href: "/guru-attendance" },
    { id: "info", label: "Info", icon: <Bell className="w-6 h-6" />, href: "/info" },
    { id: "profile", label: "Profile", icon: <User className="w-6 h-6" />, href: "/profile" },
  ];

  return (
    <nav suppressHydrationWarning={true} className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div suppressHydrationWarning={true} className="max-w-full mx-auto flex justify-between items-center h-15 px-4">
        {items.map((it) => {
          const isActive = pathname === it.href || (pathname.startsWith(`${it.href}/`) && it.href !== "/");

          return (
            <Link suppressHydrationWarning={true} key={it.id} href={it.href} className={`flex-1 flex flex-col items-center justify-center text-xs py-2 transition ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700"}`}>
              <div suppressHydrationWarning={true} className="relative">
                {it.icon}
                {it.id === "info" && notificationCount > 0 && (
                  <span suppressHydrationWarning={true} className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {notificationCount}
                  </span>
                )}
              </div>
              <span suppressHydrationWarning={true} className="mt-1">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
