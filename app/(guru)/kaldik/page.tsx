"use client";

import { useState, useEffect } from "react";
import dayjs, { Dayjs } from "dayjs";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import CalendarGrid from "./comps/CalendarGrid";
import { CalendarEvent } from "./comps/AgendaModal";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

export default function Page() {
    const { token } = useAuth();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<Dayjs>(dayjs());
    const today = dayjs();

    const fetchKaldik = async () => {
        if (!token) return;
        
        try {
            setIsLoading(true);
            const res = await api.getKaldik(token);
            if (res.success && Array.isArray(res.data)) {
                setEvents(res.data);
            }
        } catch (error) {
            console.error("Failed to fetch kaldik:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchKaldik();
    }, [token]);

    const prevMonth = () =>
        setCurrentMonth((prev) => prev.subtract(1, "month"));
    const nextMonth = () => setCurrentMonth((prev) => prev.add(1, "month"));

    return (
        <>
            <section className="w-full min-h-screen px-4 md:px-24 pt-6 pb-20">
                <div>
                    <div className="flex items-center justify-center mb-10">
                        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                            Kalender Akademik
                        </h1>
                    </div>

                    <div className="flex items-center justify-end gap-2 mb-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>

                        <p className="text-lg font-semibold text-sky-700">
                            {currentMonth.format("MMMM YYYY")}
                        </p>

                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {isLoading && events.length === 0 ? (
                   <div className="flex justify-center items-center h-64">
                       <Loader2 className="w-10 h-10 animate-spin text-sky-600" />
                   </div>
                ) : (
                    <CalendarGrid
                        currentMonth={currentMonth}
                        today={today}
                        events={events}
                    />
                )}

                <div className="mt-10">
                    {(() => {
                        const bulanEvents = events.filter(
                            (e) =>
                                dayjs(e.tanggal).month() ===
                                    currentMonth.month() &&
                                dayjs(e.tanggal).year() === currentMonth.year()
                        );

                        if (bulanEvents.length === 0) {
                            return (
                                <p className="text-sm text-gray-500">
                                    Tidak ada kegiatan untuk bulan ini.
                                </p>
                            );
                        }

                        const grouped: Record<
                            string,
                            { tanggal: number[]; kategori: string | null }
                        > = {};

                        bulanEvents.forEach((e) => {
                            const key = e.kegiatan ?? "Tidak ada kegiatan";
                            const tgl = dayjs(e.tanggal).date();

                            if (!grouped[key]) {
                                grouped[key] = {
                                    tanggal: [],
                                    kategori: e.kategori ?? null,
                                };
                            }

                            grouped[key].tanggal.push(tgl);
                        });

                        return Object.entries(grouped)
                            .sort((a, b) => a[1].tanggal[0] - b[1].tanggal[0])
                            .map(([kegiatan, info]) => {
                                const tanggalStr = info.tanggal
                                    .sort((a, b) => a - b)
                                    .join(", ");
                                const bulanStr = currentMonth.format("MMMM");

                                return (
                                    <div
                                        key={kegiatan}
                                        className="text-sm mb-1"
                                    >
                                        <span className="font-semibold text-gray-700">
                                            {tanggalStr} {bulanStr}
                                        </span>
                                        {": "}
                                        <span
                                            className={
                                                info.kategori === "LIBUR"
                                                    ? "text-red-500 font-medium"
                                                    : "text-gray-700"
                                            }
                                        >
                                            {kegiatan}
                                        </span>
                                    </div>
                                );
                            });
                    })()}
                </div>
            </section>
        </>
    );
}
