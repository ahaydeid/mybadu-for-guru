"use client";

import { useState } from "react";
import dayjs from "dayjs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import CalendarGrid from "./comps/CalendarGrid";

const Page = () => {
  const [currentMonth, setCurrentMonth] = useState(dayjs());
  const today = dayjs();

  const prevMonth = () => setCurrentMonth(currentMonth.subtract(1, "month"));
  const nextMonth = () => setCurrentMonth(currentMonth.add(1, "month"));

  const schedules = [
    {
      id: 1,
      date: "2025-11-10",
      time: "07:30 - 09:00",
      kelas: "12 MPLB 1",
      materi: "Etika Profesi",
      detail: "Diskusi studi kasus dan latihan soal.",
    },
    {
      id: 4,
      date: "2025-11-10",
      time: "09:45 - 10:30",
      kelas: "12 MPLB 4",
      materi: "Etika Digital",
      detail: "Diskusi studi kasus dan latihan praktik.",
    },
    {
      id: 2,
      date: "2025-11-13",
      time: "10:00 - 11:30",
      kelas: "11 AKL 2",
      materi: "Akuntansi Dasar",
      detail: "Pengantar jurnal umum dan transaksi.",
    },
    {
      id: 3,
      date: "2025-11-14",
      time: "08:00 - 09:30",
      kelas: "10 OTKP 1",
      materi: "Korespondensi",
      detail: "Praktik penulisan surat resmi.",
    },
  ];

  return (
    <section className="w-full min-h-screen bg-linear-to-br from-sky-50 to-white px-4 py-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-center mb-10">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">Agenda Mengajar</h1>
        </div>

        <div className="flex items-center justify-end gap-3">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <p className="text-lg font-semibold text-gray-800">{currentMonth.format("MMMM YYYY")}</p>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-sky-100 text-sky-600 transition">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <CalendarGrid currentMonth={currentMonth} today={today} schedules={schedules} />
    </section>
  );
};

export default Page;
