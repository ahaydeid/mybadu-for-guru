"use client";

import { useState, useEffect } from "react";
import { User2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";

export default function HeroSection() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [imageError, setImageError] = useState(false);
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
      <div suppressHydrationWarning={true} className="flex items-center gap-2 pb-2 mb-4 border-b border-white/20 w-fit">
        <h1 suppressHydrationWarning={true} className="text-[15px] font-black text-white tracking-widest uppercase drop-shadow-md flex items-center">
          MY<span className="text-yellow-400">BADAR</span>
          <span className="ml-3 text-[9px] font-bold px-2 py-0.5 bg-white/20 rounded-full border border-white/30 backdrop-blur-sm tracking-widest text-white shadow-sm">GURU</span>
        </h1>
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
            <p suppressHydrationWarning={true} className="text-base font-extrabold text-white leading-tight drop-shadow-md">
              {mounted ? (() => {
                const g = user?.guru;
                const depan = g?.gelar_depan ? g.gelar_depan + " " : "";
                const belakang = g?.gelar_belakang ? ", " + g.gelar_belakang : "";
                const fullName = `${depan}${g?.nama || user?.name || "User"}${belakang}`;
                const words = fullName.split(" ");
                return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : fullName;
              })() : "..."}
            </p>
            <p suppressHydrationWarning={true} className="text-sm font-medium text-white/80 drop-shadow-md line-clamp-1">
              {mounted ? (() => {
                const subjects = (user?.guru?.mapel_diampu?.length ?? 0) > 0
                  ? user?.guru?.mapel_diampu?.map((m: any) => m.nama).join(", ")
                  : (user?.guru?.mengajar || user?.guru?.tugas_tambahan || "Guru");
                const words = subjects.split(" ");
                return words.length > 2 ? words.slice(0, 2).join(" ") + "..." : subjects;
              })() : "..."}
            </p>
          </div>
          <div suppressHydrationWarning={true} className="w-14 h-14 rounded-full bg-white/95 border border-gray-200 shadow-md flex items-center justify-center overflow-hidden shrink-0">
            {mounted && user?.guru?.foto && !imageError ? (
              <img 
                src={getImageUrl(user.guru.foto) || ""} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : mounted && user?.name ? (
              <span suppressHydrationWarning={true} className="text-xl font-black text-sky-700 uppercase">
                {user.name.substring(0, 2)}
              </span>
            ) : (
              <User2 suppressHydrationWarning={true} className="w-8 h-8 text-gray-700" />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
