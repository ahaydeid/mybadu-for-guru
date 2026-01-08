"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

// Type definitions
interface LogItem {
  tanggal: string;
  hari: string;
  jamMasuk: string;
  jamPulang: string;
  totalJp?: number; // NEW: optional field for total JP
  status: string;
}

interface Stats {
  total: number;
  hadir: number;
  terlambat: number;
  tidakHadir: number;
}

export default function LogAbsenSayaPage() {
  const router = useRouter();
  const { token } = useAuth();
  
  // State untuk data
  const [logs, setLogs] = useState<LogItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    total: 0,
    hadir: 0,
    terlambat: 0,
    tidakHadir: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk filter (temporary)
  const [tempStartDate, setTempStartDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`; // Format: YYYY-MM-01
  });
  const [tempEndDate, setTempEndDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  });
  
  // State untuk filter yang aktif
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}-01`; // Format: YYYY-MM-01
  });
  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`; // Format: YYYY-MM-DD
  });
  
  // Fetch data dari API
  const fetchLogs = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await api.getAttendanceLog(token, startDate, endDate);
      console.log('DEBUG - API Response:', result);
      console.log('DEBUG - Start Date:', startDate);
      console.log('DEBUG - End Date:', endDate);
      
      if (result.success && result.data) {
        console.log('DEBUG - Logs:', result.data.logs);
        console.log('DEBUG - Stats:', result.data.stats);
        setLogs(result.data.logs || []);
        setStats(result.data.stats || {
          total: 0,
          hadir: 0,
          terlambat: 0,
          tidakHadir: 0
        });
      } else {
        console.error('DEBUG - API Failed:', result);
        throw new Error(result.message || 'Gagal mengambil data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      console.error('Error fetching logs:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch saat pertama kali load dan saat filter berubah
  useEffect(() => {
    fetchLogs();
  }, [startDate, endDate, token]);
  
  const formatTanggal = (tanggal: string, hari: string) => {
    const date = new Date(tanggal);
    const day = date.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
    const month = months[date.getMonth()];
    return `${hari}, ${day} ${month}`;
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Hadir":
        return "bg-green-600 text-white";
      case "Terlambat":
        return "bg-yellow-500 text-white";
      case "Tidak Hadir":
        return "bg-red-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3 relative">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors absolute left-4"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 className="text-xl font-bold text-gray-900 w-full text-center">Log Absen Saya</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-4 space-y-4">
        {/* Filter Section - Always Visible */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Periode</span>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Dari
              </label>
              <input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sampai
              </label>
              <input
                type="date"
                value={tempEndDate}
                onChange={(e) => setTempEndDate(e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => {
                const date = new Date();
                const firstDay = new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
                const today = date.toISOString().split('T')[0];
                setTempStartDate(firstDay);
                setTempEndDate(today);
              }}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors text-sm"
            >
              Reset
            </button>
            <button
              onClick={() => {
                setStartDate(tempStartDate);
                setEndDate(tempEndDate);
              }}
              className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors text-sm"
            >
              Terapkan Filter
            </button>
          </div>
        </div>

        {/* Statistik Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-700 rounded-lg shadow-sm p-4">
            <div className="text-sm text-gray-200 mb-1">Total Hari</div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          
          <div className="bg-green-600 rounded-lg shadow-sm p-4">
            <div className="text-sm text-green-100 mb-1">Hadir</div>
            <div className="text-2xl font-bold text-white">{stats.hadir}</div>
          </div>
          
          <div className="bg-yellow-500 rounded-lg shadow-sm p-4">
            <div className="text-sm text-yellow-100 mb-1">Terlambat</div>
            <div className="text-2xl font-bold text-white">{stats.terlambat}</div>
          </div>
          
          <div className="bg-red-600 rounded-lg shadow-sm p-4">
            <div className="text-sm text-red-100 mb-1">Tidak Hadir</div>
            <div className="text-2xl font-bold text-white">{stats.tidakHadir}</div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded border border-gray-200 p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Memuat data...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-red-800">
              <span className="font-semibold">Error:</span> {error}
            </p>
          </div>
        )}

        {/* Tabel Absensi */}
        {!loading && !error && (
          <div className="bg-white rounded border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              {logs.length === 0 ? (
                <div className="px-4 text-xs py-8 text-center text-gray-500">
                  Tidak ada data untuk periode yang dipilih
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Hari
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Masuk
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Pulang
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Total JP
                      </th>
                      <th className="px-3 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider whitespace-nowrap">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {logs.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 py-3 text-sm font-medium text-gray-900 whitespace-nowrap">
                          {formatTanggal(item.tanggal, item.hari)}
                        </td>
                        <td className="px-3 py-3 text-sm text-center text-gray-900 font-mono whitespace-nowrap">
                          {item.jamMasuk}
                        </td>
                        <td className="px-3 py-3 text-sm text-center text-gray-900 font-mono whitespace-nowrap">
                          {item.jamPulang}
                        </td>
                        <td className="px-3 py-3 text-sm text-center text-gray-900 whitespace-nowrap">
                          {item.totalJp ?? "-"}
                        </td>
                        <td className="px-3 py-3 text-center whitespace-nowrap">
                          <span className={`inline-block px-2 py-1 text-xs font-medium ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
