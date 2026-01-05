"use client";

import React, { useEffect, useState, useMemo } from "react";
import JadwalHariCard from "./comps/JadwalHariCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

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
  const { token } = useAuth();
  const [days, setDays] = useState<DayRow[]>([]);
  const [jadwals, setJadwals] = useState<RawJadwal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchSchedule = async () => {
      if (!token) return;
      
      setLoading(true);
      setError(null);

      try {
        const result = await api.getGuruSchedule(token);
        
        if (mounted && result.success && result.data) {
          setDays(result.data.days || []);
          setJadwals(result.data.jadwals || []);
        } else if (mounted && !result.success) {
          setError(result.message || "Gagal memuat jadwal");
        }
      } catch (err) {
        if (mounted) {
          const msg = err instanceof Error ? err.message : String(err);
          setError(msg);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchSchedule();

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
          <div className="text-center text-gray-500">Memuat jadwal...</div>
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
