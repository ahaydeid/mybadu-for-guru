"use client";

import React, { useEffect, useState, useMemo } from "react";
import JadwalHariCard from "./comps/JadwalHariCard";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
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
        // Fetch weekly schedule using new API parameter
        const result = await api.getGuruSchedule(token, true);
        console.log("DEBUG - getGuruSchedule (weekly) result:", result);
        
        if (mounted && result.success && result.data) {
          // Weekly API returns { days: [], jadwals: [] }
          if (result.data.days) {
            setDays(result.data.days);
          }
          if (result.data.jadwals) {
            setJadwals(result.data.jadwals);
          }
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
  }, [token]);

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
    <div className="min-h-screen bg-[#f5f5f5] pb-20">
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3 relative">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors absolute left-4"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 w-full text-center">Jadwal Mengajar</h1>
        </div>
      </div>

      <div className="mx-auto w-full px-2 max-w-xl md:max-w-2xl pt-2 lg:max-w-3xl">
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
