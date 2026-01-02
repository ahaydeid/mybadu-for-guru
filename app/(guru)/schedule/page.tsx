"use client";

import React, { useEffect, useState, useMemo } from "react";
import JadwalHariCard from "./comps/JadwalHariCard";

type DayRow = { id: number; nama: string };

type RawJadwal = {
  id: number;
  hari_id?: number | null;
  jam_id?: number | null;
  kelas_id?: number | null;
  jp?: number | null;
  guru_id?: number | null;
  kelas?: { nama?: string } | null;
  jamPertama?: string | null;
  jamKedua?: string | null;
  jamMulai?: string | null;
  jamSelesai?: string | null;
};

const toMinutes = (time: string | null): number => {
  if (!time) return 9999;
  const [h = "0", m = "0"] = time.split(":");
  return Number(h) * 60 + Number(m);
};

export default function Page(): React.ReactElement {
  const [days, setDays] = useState<DayRow[]>([]);
  const [jadwals, setJadwals] = useState<RawJadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadDummy = () => {
      setLoading(true);
      setError(null);

      try {
        if (!mounted) return;

        const dummyDays: DayRow[] = [
          { id: 1, nama: "Senin" },
          { id: 2, nama: "Selasa" },
          { id: 3, nama: "Rabu" },
          { id: 4, nama: "Kamis" },
          { id: 5, nama: "Jumat" },
          { id: 6, nama: "Sabtu" },
        ];

        const dummyJadwal: RawJadwal[] = [
          // =========================
          // SENIN
          // =========================
          {
            id: 1,
            hari_id: 1,
            guru_id: 1,
            kelas_id: 2,
            kelas: { nama: "X TKJ 1" },
            jamPertama: "J-1",
            jamKedua: "J-2",
            jamMulai: "07:00:00",
            jamSelesai: "07:45:00",
          },
          {
            id: 2,
            hari_id: 1,
            guru_id: 1,
            kelas_id: 2,
            kelas: { nama: "X TKJ 1" },
            jamPertama: "J-2",
            jamKedua: null, // 1 JP
            jamMulai: "07:45:00",
            jamSelesai: "08:30:00",
          },

          // =========================
          // SELASA
          // =========================
          {
            id: 3,
            hari_id: 2,
            guru_id: 1,
            kelas_id: 3,
            kelas: { nama: "XI RPL 2" },
            jamPertama: "J-3",
            jamKedua: "J-4",
            jamMulai: "09:00:00",
            jamSelesai: "09:45:00",
          },
          {
            id: 4,
            hari_id: 2,
            guru_id: 1,
            kelas_id: 3,
            kelas: { nama: "XI RPL 2" },
            jamPertama: "J-4",
            jamKedua: "J-5",
            jamMulai: "10:00:00",
            jamSelesai: "10:45:00",
          },
          {
            id: 5,
            hari_id: 2,
            guru_id: 1,
            kelas_id: 3,
            kelas: { nama: "XI RPL 2" },
            jamPertama: "J-5",
            jamKedua: null, // 1 JP
            jamMulai: "11:00:00",
            jamSelesai: "11:45:00",
          },

          // =========================
          // RABU
          // =========================
          {
            id: 6,
            hari_id: 3,
            guru_id: 1,
            kelas_id: 4,
            kelas: { nama: "XII TKJ 2" },
            jamPertama: "J-1",
            jamKedua: "J-2",
            jamMulai: "07:00:00",
            jamSelesai: "07:45:00",
          },

          // =========================
          // KAMIS
          // =========================
          {
            id: 8,
            hari_id: 4,
            guru_id: 1,
            kelas_id: 5,
            kelas: { nama: "XII TKJ 4" },
            jamPertama: "J-1",
            jamKedua: null, // 1 JP
            jamMulai: "07:00:00",
            jamSelesai: "07:45:00",
          },
          {
            id: 9,
            hari_id: 4,
            guru_id: 1,
            kelas_id: 5,
            kelas: { nama: "XII TKJ 4" },
            jamPertama: "J-2",
            jamKedua: "J-3",
            jamMulai: "07:45:00",
            jamSelesai: "08:30:00",
          },

          // =========================
          // JUMAT
          // =========================
          {
            id: 10,
            hari_id: 5,
            guru_id: 1,
            kelas_id: 6,
            kelas: { nama: "XII RPL 1" },
            jamPertama: "J-1",
            jamKedua: "J-2",
            jamMulai: "07:00:00",
            jamSelesai: "07:45:00",
          },
          {
            id: 11,
            hari_id: 5,
            guru_id: 1,
            kelas_id: 6,
            kelas: { nama: "XII RPL 1" },
            jamPertama: "J-2",
            jamKedua: null, // 1 JP
            jamMulai: "07:45:00",
            jamSelesai: "08:30:00",
          },
        ];

        setDays(dummyDays);
        setJadwals(dummyJadwal);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    loadDummy();

    return () => {
      mounted = false;
    };
  }, []);

  const jadwalMap = useMemo(() => {
    const map = new Map<number, RawJadwal[]>();

    jadwals.forEach((j) => {
      const hid = j.hari_id ?? -1;
      if (!map.has(hid)) map.set(hid, []);
      map.get(hid)!.push(j);
    });

    map.forEach((list) => {
      list.sort((a, b) => toMinutes(a.jamMulai ?? null) - toMinutes(b.jamMulai ?? null));
    });

    return map;
  }, [jadwals]);

  return (
    <div className="min-h-screen bg-[#f5f5f5] pb-28">
      <h1 className="sticky top-0 z-20 bg-gray-50 text-center text-2xl font-extrabold py-3 mb-4 border-b border-gray-200">Jadwal Mengajar</h1>

      <div className="mx-auto w-full px-4 max-w-xl md:max-w-2xl lg:max-w-3xl">
        {loading ? (
          <div className="text-center text-gray-500">Memuat jadwal dummy...</div>
        ) : error ? (
          <div className="text-center text-red-600">Error: {error}</div>
        ) : (
          <div className="space-y-2">
            {days.map((day) => {
              const list = jadwalMap.get(day.id) ?? [];
              return <JadwalHariCard key={day.id} day={day} list={list} />;
            })}
          </div>
        )}
      </div>
    </div>
  );
}
