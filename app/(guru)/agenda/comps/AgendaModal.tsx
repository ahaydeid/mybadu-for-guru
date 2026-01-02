"use client";

import dayjs from "dayjs";
import "dayjs/locale/id"; // Bahasa Indonesia
dayjs.locale("id");

interface Schedule {
  id: number;
  date: string;
  time: string;
  kelas: string;
  materi: string;
  detail: string;
}

interface Props {
  schedules: Schedule[];
  onClose: () => void;
}

export default function AgendaModal({ schedules, onClose }: Props) {
  // Ambil tanggal real dari data pertama
  const tanggal = schedules.length > 0 ? dayjs(schedules[0].date).format("dddd, DD MMM YY") : "";

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded shadow-xl w-11/12 max-w-md px-2 py-4 relative">
        {/* Tombol Tutup */}
        <button onClick={onClose} className="absolute top-2 right-4 text-gray-600 hover:text-red-500 text-lg">
          ✕
        </button>

        {/* Judul */}
        <h2 className="text-lg font-bold text-sky-700 mb-1 text-center">Jadwal Hari Ini</h2>

        {/* Tanggal (Day, dd Mon yy) */}
        {tanggal && <p className="text-center text-sm text-gray-600 mb-4">{tanggal.charAt(0).toUpperCase() + tanggal.slice(1)}</p>}

        {/* Isi Modal */}
        {schedules.length === 0 ? (
          <p className="text-gray-500 text-center text-sm">Tidak ada jadwal untuk tanggal ini.</p>
        ) : (
          <div className="space-y-4">
            {schedules.map((s) => (
              <div key={s.id} className="border border-gray-200 rounded-xl p-3 bg-gray-50">
                <p className="font-bold text-gray-800">{s.kelas}</p>
                <p className="text-sm text-gray-600 italic mb-1">{s.time}</p>
                <p className="text-sm font-semibold text-sky-700">{s.materi}</p>
                <p className="text-sm text-gray-600 mt-1">{s.detail}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
