"use client";

import { useState } from "react";
import dayjs from "dayjs";
import AgendaModal, { CalendarEvent } from "./AgendaModal";

interface Props {
    currentMonth: dayjs.Dayjs;
    today: dayjs.Dayjs;
    events: CalendarEvent[];
}

export default function CalendarGrid({ currentMonth, today, events }: Props) {
    const [selectedEvents, setSelectedEvents] = useState<
        CalendarEvent[] | null
    >(null);

    const startOfMonth = currentMonth.startOf("month");
    const startDay = startOfMonth.day();
    const days: dayjs.Dayjs[] = [];

    for (let i = 0; i < 42; i++) {
        const dayNumber = i - startDay + 1;
        days.push(currentMonth.date(dayNumber));
    }

    const openModal = (date: dayjs.Dayjs) => {
        const formatted = date.format("YYYY-MM-DD");
        const filtered = events.filter(
            (e) => dayjs(e.tanggal).format("YYYY-MM-DD") === formatted
        );
        setSelectedEvents(filtered);
    };

    const closeModal = () => setSelectedEvents(null);

    return (
        <>
            <div className="grid grid-cols-7 gap-2 text-center text-gray-700 font-medium mb-2">
                {["M", "S", "S", "R", "K", "J", "S"].map((d, i) => (
                    <div
                        key={i}
                        className="py-2 text-lg text-sky-700 font-semibold"
                    >
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((date, index) => {
                    const isCurrentMonth =
                        date.month() === currentMonth.month();

                    if (!isCurrentMonth) {
                        return <div key={index} />;
                    }

                    const isToday = date.isSame(today, "day");

                    const todayEvents = events.filter(
                        (e) =>
                            dayjs(e.tanggal).format("YYYY-MM-DD") ===
                            date.format("YYYY-MM-DD")
                    );

                    const hasEvent = todayEvents.length > 0;
                    const isLibur = todayEvents.some(
                        (e) => e.kategori === "LIBUR"
                    );
                    const isSunday = date.day() === 0;
                    const isRedDay = isLibur || isSunday;

                    let className =
                        "relative rounded-lg p-2 text-lg font-medium transition-all border border-gray-300 text-center ";

                    if (isToday) {
                        className +=
                            "bg-sky-500 text-white font-bold border-sky-600";
                    } else if (isRedDay) {
                        className += "bg-red-500 text-white border-red-600";
                    } else {
                        className += "bg-white text-gray-700 hover:shadow-sm";
                    }

                    return (
                        <button
                            key={index}
                            onClick={() => openModal(date)}
                            className={className}
                        >
                            {hasEvent && (
                                <div
                                    className={`absolute left-0 top-1 bottom-1 w-1 rounded-full ${
                                        isRedDay || isToday
                                            ? "bg-white"
                                            : "bg-sky-500"
                                    }`}
                                />
                            )}

                            {date.date()}
                        </button>
                    );
                })}
            </div>

            {selectedEvents && (
                <AgendaModal events={selectedEvents} onClose={closeModal} />
            )}
        </>
    );
}
