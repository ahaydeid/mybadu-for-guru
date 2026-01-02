"use client";

import Link from "next/link";
import { BookOpen, CalendarClock, Calendar, Megaphone, CalendarDays } from "lucide-react";

type Menu = {
  title: string;
  icon: React.ReactNode;
  href: string;
  bgColor: string;
};

export default function MenuSection() {
  const menus: Menu[] = [
    { title: "Jadwal", icon: <Calendar className="w-7 h-7 text-amber-500" />, href: "/schedule", bgColor: "bg-amber-50" },
    { title: "Kelas", icon: <BookOpen className="w-7 h-7 text-sky-600" />, href: "/kelas", bgColor: "bg-sky-50" },
    { title: "Log Absen", icon: <CalendarClock className="w-7 h-7 text-rose-600" />, href: "/log-absen", bgColor: "bg-rose-50" },
    { title: "Pengumuman", icon: <Megaphone className="w-7 h-7 text-gray-800" />, href: "/pengumuman", bgColor: "bg-gray-100" },
    { title: "Kaldik", icon: <CalendarDays className="w-7 h-7 text-sky-500" />, href: "/kaldik", bgColor: "bg-sky-50" },
  ];

  return (
    <section suppressHydrationWarning={true} className="relative z-20 bg-white rounded-2xl p-5 grid grid-cols-4 gap-5 -mt-10 mx-4 border border-gray-200 shadow-xs">
      {menus.map((menu) => (
        <Link suppressHydrationWarning={true} key={menu.title} href={menu.href} aria-label={menu.title} className="flex flex-col items-center text-center text-sm text-gray-700 hover:opacity-80 transition-all duration-200">
          <div suppressHydrationWarning={true} className={`w-14 h-14 flex items-center justify-center rounded-2xl hover:shadow-sm ${menu.bgColor}`}>{menu.icon}</div>
          <span suppressHydrationWarning={true} className="mt-2 text-[13px] font-medium">{menu.title}</span>
        </Link>
      ))}
    </section>
  );
}
