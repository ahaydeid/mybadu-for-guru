"use client";

import { useState } from "react";
import dayjs from "dayjs";
import AgendaModal from "./AgendaModal";

interface Schedule {
  id: number;
  date: string; // Format YYYY-MM-DD
  time: string;
  kelas: string;
  materi: string;
  detail: string;
}

interface Props {
  currentMonth: dayjs.Dayjs;
  today: dayjs.Dayjs;
  schedules: Schedule[];
}

export default function CalendarGrid({ currentMonth, today, schedules }: Props) {
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule[] | null>(null);

  const startOfMonth = currentMonth.startOf("month");
  const startDay = startOfMonth.day();
  const days: dayjs.Dayjs[] = [];

  for (let i = 0; i < 42; i++) {
    const dayNumber = i - startDay + 1;
    const date = currentMonth.date(dayNumber);
    days.push(date);
  }

  const openModal = (date: dayjs.Dayjs) => {
    const formattedDate = date.format("YYYY-MM-DD");
    const filtered = schedules.filter((s) => s.date === formattedDate);
    setSelectedSchedule(filtered.length > 0 ? filtered : []);
  };

  const closeModal = () => setSelectedSchedule(null);

  return (
    <>
      {/* Hari Mingguan */}
      <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium mb-2">
        {["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"].map((d) => (
          <div key={d} className="py-2 text-sm text-sky-700 font-semibold">
            {d}
          </div>
        ))}
      </div>

      {/* Grid Tanggal */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const isCurrentMonth = date.month() === currentMonth.month();
          const isToday = date.isSame(today, "day");

          const formattedDate = date.format("YYYY-MM-DD");
          const hasSchedule = schedules.some((s) => s.date === formattedDate);

          return (
            <button
              key={index}
              onClick={() => openModal(date)}
              className={`relative rounded-xl p-3 text-sm font-medium transition-all border text-left
                ${isCurrentMonth ? "bg-white hover:shadow-md" : "bg-gray-100 text-gray-400"}
                ${isToday ? "border-sky-500 text-sky-700 font-bold" : "border-gray-200"}
              `}
            >
              {/* Garis vertikal tanda jadwal */}
              {hasSchedule && <div className="absolute left-0 top-1 bottom-1 w-1 rounded-full bg-sky-500"></div>}
              {isCurrentMonth ? date.date() : ""}
            </button>
          );
        })}
      </div>

      {/* Modal Jadwal */}
      {selectedSchedule && <AgendaModal schedules={selectedSchedule} onClose={closeModal} />}
    </>
  );
}
