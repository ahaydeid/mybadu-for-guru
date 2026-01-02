"use client";

import { ReactElement } from "react";
import { usePathname } from "next/navigation";
import { Home, CalendarDays, Fingerprint, ClipboardCheck, User } from "lucide-react";
import Link from "next/link";

type Item = "home" | "agenda" | "absen" | "tinjau-izin" | "profile";

interface NavItem {
  id: Item;
  label: string;
  icon: ReactElement;
  href: string;
}

export default function BottomNav(): ReactElement | null {
  const pathname = usePathname();

  // Sembunyikan pada halaman login
  if (typeof pathname === "string" && pathname.startsWith("/login")) return null;

  // Daftar menu utama
  const items: NavItem[] = [
    { id: "home", label: "Home", icon: <Home className="w-6 h-6" />, href: "/" },
    { id: "tinjau-izin", label: "Tinjau Izin", icon: <ClipboardCheck className="w-6 h-6" />, href: "/tinjau-izin" },
    { id: "absen", label: "Absen", icon: <Fingerprint className="w-6 h-6" />, href: "/guru-attendance" },
    { id: "agenda", label: "Agenda", icon: <CalendarDays className="w-6 h-6" />, href: "/agenda" },
    { id: "profile", label: "Profile", icon: <User className="w-6 h-6" />, href: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="max-w-full mx-auto flex justify-between items-center h-15 px-4">
        {items.map((it) => {
          const isActive = pathname === it.href || (pathname.startsWith(`${it.href}/`) && it.href !== "/");

          return (
            <Link key={it.id} href={it.href} className={`flex-1 flex flex-col items-center justify-center text-xs py-2 transition ${isActive ? "text-gray-900 font-semibold" : "text-gray-500 hover:text-gray-700"}`}>
              <div>{it.icon}</div>
              <span className="mt-1">{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
