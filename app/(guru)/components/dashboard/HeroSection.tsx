"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User2 } from "lucide-react";

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const [greetingInfo, setGreetingInfo] = useState({ greeting: "Selamat", emoji: "👋", date: "" });

  useEffect(() => {
    const hour = new Date().getHours();
    let greeting = "Selamat Pagi";
    let emoji = "🌤️";

    if (hour >= 11 && hour < 15) {
      greeting = "Selamat Siang";
      emoji = "☀️";
    } else if (hour >= 15 && hour < 18) {
      greeting = "Selamat Sore";
      emoji = "☀️";
    } else if (hour >= 18 || hour < 4) {
      greeting = "Selamat Malam";
      emoji = "🌙";
    }

    const dateStr = new Date()
      .toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "short",
      })
      .replace(".", "");

    setGreetingInfo({ greeting, emoji, date: dateStr });
    setMounted(true);
  }, []);

  return (
    <section suppressHydrationWarning={true} className="relative w-full bg-linear-to-r from-sky-700 via-sky-600 to-sky-400 rounded-b-4xl shadow-md pt-2 pb-16 px-6 z-10 overflow-visible">
      {/* Top - School name */}
      <div suppressHydrationWarning={true} className="flex items-center gap-3 border-b border-white pb-1 mb-2">
        <div suppressHydrationWarning={true} className="bg-white rounded-full shadow-md flex items-center justify-center p-0.5">
          <Image src="/img/albadar.png" alt="Logo SMK Al Badar Dangdeur" width={28} height={28} className="rounded-sm" priority />
        </div>
        <h1 suppressHydrationWarning={true} className="text-lg font-semibold text-white tracking-wide drop-shadow-md">SMK Al Badar Dangdeur</h1>
      </div>

      {/* Bottom - Greeting & User */}
      <div suppressHydrationWarning={true} className="flex justify-between items-center">
        {/* Left side - Greeting */}
        <div suppressHydrationWarning={true} className="w-[40%]">
          <h1 suppressHydrationWarning={true} className="text-xs mt-4 font-semibold text-white flex gap-2 drop-shadow-md">
            {mounted ? greetingInfo.greeting : "..."} 
            <span suppressHydrationWarning={true} className="text-xl leading-none relative -top-2">
              {mounted ? greetingInfo.emoji : ""}
            </span>
          </h1>

          {/* Tanggal hari ini */}
          <p suppressHydrationWarning={true} className="text-sm text-white/90 mt-1 drop-shadow-sm min-h-[1.25rem]">
            {mounted ? greetingInfo.date : ""}
          </p>
        </div>

        {/* Right side - User info */}
        <div suppressHydrationWarning={true} className="w-[60%] flex items-center justify-end gap-3">
          <div suppressHydrationWarning={true} className="text-right">
            <p suppressHydrationWarning={true} className="text-base font-extrabold text-white leading-tight drop-shadow-md">Ahadi</p>
            <p suppressHydrationWarning={true} className="text-sm font-medium text-white/80 drop-shadow-md">Coding</p>
          </div>
          <div suppressHydrationWarning={true} className="w-14 h-14 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center">
            <User2 suppressHydrationWarning={true} className="w-8 h-8 text-gray-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
