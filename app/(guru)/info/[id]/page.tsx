"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, Loader2, Megaphone } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

type Announcement = {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  is_active: boolean;
};

export default function AnnouncementDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { token } = useAuth();
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!token || !params.id) return;

      try {
        setIsLoading(true);
        // Karena endpoint detail /pengumuman/[id] tidak tersedia (404),
        // kita ambil dari list utama dan cari yang cocok
        const response = await api.getAnnouncements(token);
        
        if (response.success) {
          const found = response.data.find((item: Announcement) => item.id.toString() === params.id);
          if (found) {
            setAnnouncement(found);
          } else {
            setError("Pengumuman tidak ditemukan");
          }
        } else {
          setError(response.message || "Gagal memuat data");
        }
      } catch (err) {
        setError("Gagal memuat detail pengumuman");
        console.error("Fetch detail error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetail();
  }, [params.id, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Loader2 className="w-8 h-8 animate-spin text-sky-600 mb-2" />
        <p className="text-gray-500 font-medium">Memuat informasi...</p>
      </div>
    );
  }

  if (error || !announcement) {
    return (
      <div className="min-h-screen bg-white p-6">
        <button onClick={() => router.back()} className="mb-6 flex items-center gap-2 text-gray-600 font-medium hover:text-sky-600 transition-colors">
          <ArrowLeft className="w-5 h-5" /> Kembali
        </button>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <Megaphone className="w-10 h-10 text-red-500 opacity-50" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Maaf</h2>
          <p className="text-gray-500 max-w-[250px]">{error || "Informasi tidak tersedia"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-10">
      {/* Sticky Back Button */}
      <button 
        onClick={() => router.back()} 
        className="fixed top-4 left-4 z-50 w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-lg border border-white/20 rounded-full text-white shadow-lg active:scale-90 transition-all"
        aria-label="Kembali"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      {/* Dynamic Header - Image Only */}
      <div className="relative w-full bg-gray-50 border-b border-gray-100">
        {announcement.gambar ? (
          <div className="w-full h-auto flex items-center justify-center min-h-[200px]">
            <img 
              src={announcement.gambar.startsWith('http') ? announcement.gambar : `/storage/${announcement.gambar}`} 
              alt={announcement.judul}
              className="w-full h-auto block shadow-sm"
            />
          </div>
        ) : (
          <div className="w-full h-[200px] flex flex-col items-center justify-center bg-linear-to-br from-sky-700 to-sky-500">
             <Megaphone className="w-20 h-20 text-white/20" />
          </div>
        )}
      </div>

      {/* Content Container */}
      <main className="px-6 py-8 bg-white min-h-screen">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-2 text-sky-600 text-[11px] font-bold uppercase tracking-widest">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(announcement.tanggal_mulai).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
              })}
          </div>

          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white shadow-sm ${announcement.is_active ? 'bg-green-600 shadow-green-100' : 'bg-gray-400'}`}>
              {announcement.is_active ? 'Aktif' : 'Selesai'}
          </span>
        </div>

        <h1 className="text-2xl font-black text-gray-900 leading-tight mb-6">
            {announcement.judul}
        </h1>

        <div className="w-12 h-1 bg-sky-500 rounded-full mb-8"></div>

        <article className="prose prose-sm max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
            {announcement.isi}
        </article>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col gap-4">
            <div className="flex items-center gap-3 text-gray-400">
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                    <Megaphone className="w-4 h-4" />
                </div>
                <p className="text-xs italic">
                    Berlaku sampai: {new Date(announcement.tanggal_selesai).toLocaleDateString("id-ID", {
                         day: "numeric",
                         month: "long",
                         year: "numeric"
                    })}
                </p>
            </div>
        </div>
      </main>
    </div>
  );
}
