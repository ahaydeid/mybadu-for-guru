"use client";

type DayRow = { id: number; nama: string };

type Jadwal = {
  id: number;
  kelas?: { nama?: string } | null;

  jamPertama?: string | null;
  jamKedua?: string | null;

  jamMulai?: string | null;
  jamSelesai?: string | null;
};

interface Props {
  day: DayRow;
  list: Jadwal[];
}

const getTodayName = () => {
  const hari = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  return hari[new Date().getDay()]!;
};

export default function JadwalHariCard({ day, list }: Props) {
  const today = getTodayName();
  const isToday = day.nama === today;

  return (
    <section>
      <div className={`rounded shadow-xs p-4 flex flex-row gap-4 ${isToday ? "bg-[#009ed6]" : "bg-white"}`}>
        {/* Kiri: Nama Hari */}
        <div className="w-1/5 flex items-center justify-center">
          <h2 className={`text-center text-lg font-extrabold ${isToday ? "text-white" : "text-gray-800"}`}>{day.nama}</h2>
        </div>

        {/* Kolom Jadwal */}
        <div className="flex-1 min-h-0">
          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {list.length === 0 ? (
              <div className="text-sm text-center py-3 text-gray-500">Tidak ada jadwal.</div>
            ) : (
              list.map((j) => {
                const hasPertama = Boolean(j.jamPertama);
                const hasKedua = Boolean(j.jamKedua);

                return (
                  <div key={j.id} className="flex flex-row items-center justify-between rounded-lg bg-gray-50 px-2 py-2 border border-gray-200">
                    {/* Detail kelas */}
                    <div className="flex pl-1 flex-col">
                      <div className="font-semibold text-xl text-gray-800">{j.kelas?.nama ?? "Tidak diketahui"}</div>

                      {/* Hitung JP */}
                      <div className="text-xs text-gray-600 mt-2">
                        <span className="px-3 py-1 rounded-full bg-gray-100 border border-gray-300">{hasPertama && hasKedua ? "2 JP" : hasPertama ? "1 JP" : "0 JP"}</span>
                      </div>

                      <div className="text-xs text-gray-600 mt-2">
                        <span className="px-3 py-1 rounded-full bg-amber-300 text-gray-900">
                          {j.jamMulai?.slice(0, 5)} - {j.jamSelesai?.slice(0, 5)}
                        </span>
                      </div>
                    </div>

                    {/* Badge J-x */}
                    <div className={`flex flex-col items-center leading-tight rounded-md px-5 py-3 ml-auto ${isToday ? "bg-sky-400 text-white" : "bg-white text-gray-800 border border-gray-300"}`}>
                      {hasPertama && hasKedua ? (
                        <>
                          <span className="text-lg font-extrabold">{j.jamPertama}</span>
                          <div className="w-8 h-0.5 bg-gray-300" />
                          <span className="text-lg font-extrabold">{j.jamKedua}</span>
                        </>
                      ) : (
                        // Jika hanya satu jam → tampil di TENGAH
                        <span className="text-lg font-extrabold py-1">{j.jamPertama ?? j.jamKedua ?? "?"}</span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
