"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type ScheduleItem = {
    id: number;
    kodeMulai: string;
    kodeSelesai: string;
    waktuMulai: string;
    waktuAkhir: string;
    jurusan: string;
    mapel: string;
    jp: string;
    status: "berlangsung" | "selesai";
};

export default function TodaySection() {
    const { token } = useAuth();
    const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSchedule = async () => {
            if (!token) return;

            try {
                const res = await api.getGuruSchedule(token);
                if (res.success && Array.isArray(res.data)) {
                    setSchedules(res.data);
                }
            } catch (error) {
                console.error("Failed to fetch today's schedule:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSchedule();
    }, [token]);

    if (isLoading) {
        return (
            <section className="mt-3 mb-3 bg-white px-4 py-8 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-sky-600" />
            </section>
        );
    }

    if (schedules.length === 0) {
        return (
            <section className="mt-3 mb-3 bg-white px-4 py-6">
                <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-bold text-gray-900">
                        Hari ini
                    </h2>
                </div>
                <div className="text-center text-gray-500 py-4 text-sm">
                    Tidak ada jadwal mengajar hari ini.
                </div>
            </section>
        );
    }

    return (
        <section className="mt-3 mb-3 bg-white px-4 py-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <h2 className="text-lg font-bold text-gray-900">Hari ini</h2>
            </div>

            {/* Schedule List */}
            <div className="space-y-2">
                {schedules.map((item) => (
                    <Link
                        key={item.id}
                        href={`/today/${item.id}`}
                        className="relative flex items-center bg-white border border-gray-100 rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 hover:shadow-sm transition-all duration-200 active:scale-[0.98]"
                    >
                        {/* RIGHT ICON - Positioned at top-right */}
                        <ExternalLink className="absolute top-3 right-3 w-5 h-5 text-gray-500 shrink-0" />

                        {/* LEFT BLOCK */}
                        <div
                            className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl text-white font-semibold 
              ${item.status === "selesai" ? "bg-green-600" : "bg-sky-500"}`}
                        >
                            {item.status === "selesai" ? (
                                <Check className="w-10 h-10 text-white" />
                            ) : (
                                <div className="flex flex-col items-center leading-tight">
                                    <span className="text-2xl font-extrabold">
                                        {item.kodeMulai}
                                    </span>
                                    {item.kodeMulai !== item.kodeSelesai && (
                                        <>
                                            <div className="w-10 h-0.5 bg-white" />
                                            <span className="text-2xl font-extrabold">
                                                {item.kodeSelesai}
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* MIDDLE INFO */}
                        <div className="flex-1 ml-4 pr-8">
                            <p className="text-lg font-extrabold text-gray-900 leading-tight">
                                {item.jurusan}
                            </p>
                            <p className="italic text-gray-600 text-base line-clamp-1">
                                {item.mapel}
                            </p>

                            <div className="flex items-center gap-2 mt-2">
                                {item.status === "selesai" ? (
                                    <span className="px-3 py-0.5 text-sm font-semibold rounded-full bg-green-700 text-white">
                                        Selesai
                                    </span>
                                ) : (
                                    <span className="px-3 py-0.5 text-sm rounded-full bg-amber-300 text-gray-900">
                                        {item.waktuMulai} - {item.waktuAkhir}
                                    </span>
                                )}
                                <span className="px-3 py-0.5 text-sm rounded-full bg-gray-700 text-white">
                                    {item.jp}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
