"use client";

import { ExternalLink, Check } from "lucide-react";
import Link from "next/link";

type ScheduleItem = {
  kodeMulai: string; // contoh: "J-4"
  kodeSelesai: string; // contoh: "J-5"
  waktuMulai: string;
  waktuAkhir: string;
  jurusan: string;
  mapel: string;
  jp: string;
  status?: "berlangsung" | "selesai";
};

const schedules: ScheduleItem[] = [
  {
    kodeMulai: "J-4",
    kodeSelesai: "J-5",
    waktuMulai: "08:15",
    waktuAkhir: "09:00",
    jurusan: "MPLB 1",
    mapel: "Algoritma Pemrograman",
    jp: "1 JP",
    status: "berlangsung",
  },
  {
    kodeMulai: "J-6",
    kodeSelesai: "J-7",
    waktuMulai: "10:30",
    waktuAkhir: "11:15",
    jurusan: "TKR",
    mapel: "Algoritma Pemrograman",
    jp: "1 JP",
    status: "berlangsung",
  },
  {
    kodeMulai: "✔", // selesai → icon, kodeSelesai dikosongkan
    kodeSelesai: "",
    waktuMulai: "",
    waktuAkhir: "",
    jurusan: "MPLB 2",
    mapel: "Algoritma Pemrograman",
    jp: "1 JP",
    status: "selesai",
  },
];

export default function TodaySection() {
  return (
    <section className="mt-3 mb-3 bg-white px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-lg font-bold text-gray-900">Hari ini</h2>
      </div>

      {/* Schedule List */}
      <div className="space-y-2">
        {schedules.map((item, index) => (
          <Link
            key={index}
            href="/today/detail"
            className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
          >
            {/* LEFT BLOCK */}
            <div
              className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl text-white font-semibold 
              ${item.status === "selesai" ? "bg-green-600" : "bg-sky-500"}`}
            >
              {item.status === "selesai" ? (
                <Check className="w-10 h-10 text-white" />
              ) : (
                <div className="flex flex-col items-center leading-tight">
                  <span className="text-2xl font-extrabold">{item.kodeMulai}</span>
                  <div className="w-10 h-0.5 bg-white" />
                  <span className="text-2xl font-extrabold">{item.kodeSelesai}</span>
                </div>
              )}
            </div>

            {/* MIDDLE INFO */}
            <div className="flex-1 ml-4">
              <p className="text-lg font-extrabold text-gray-900 leading-tight">{item.jurusan}</p>
              <p className="italic text-gray-600 text-base">{item.mapel}</p>

              <div className="flex items-center gap-2 mt-2">
                {item.status === "selesai" ? (
                  <span className="px-3 py-0.5 text-sm font-semibold rounded-full bg-green-700 text-white">Selesai</span>
                ) : (
                  <span className="px-3 py-0.5 text-sm rounded-full bg-amber-300 text-gray-900">
                    {item.waktuMulai} - {item.waktuAkhir}
                  </span>
                )}
                <span className="px-3 py-0.5 text-sm rounded-full bg-gray-700 text-white">{item.jp}</span>
              </div>
            </div>

            {/* RIGHT ICON */}
            <ExternalLink className="w-5 h-5 text-gray-500 shrink-0" />
          </Link>
        ))}
      </div>
    </section>
  );
}
