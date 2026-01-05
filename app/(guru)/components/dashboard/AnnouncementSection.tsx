"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { Loader2, Megaphone } from "lucide-react";
import useSWR from "swr";

type Announcement = {
  id: number;
  judul: string;
  isi: string;
  gambar: string | null;
  tanggal_mulai: string;
  tanggal_selesai: string;
  is_active: boolean;
};

function truncateWords(text: string, limit = 12) {
  const words = text.split(" ");
  return words.length > limit ? words.slice(0, limit).join(" ") + "…" : text;
}

function formatDateShort(dateString: string) {
  try {
    const d = new Date(dateString);
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleString("id-ID", { month: "long" });
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
  } catch (e) {
    return dateString;
  }
}

export default function AnnouncementSection() {
  const router = useRouter();
  const { token } = useAuth();

  const { data: response, error, isLoading } = useSWR(
    token ? ["/pengumuman", token] : null,
    ([, t]) => api.getAnnouncements(t),
    {
      revalidateOnFocus: false, // Jangan validasi ulang setiap kali window fokus agar tidak berisik
      dedupingInterval: 60000,   // Cache dianggap valid selama 1 menit (tidak perlu request ulang)
    }
  );

  const announcements: Announcement[] = response?.success ? response.data : [];

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-gray-500">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <p className="text-sm font-medium">Memuat pengumuman...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 italic">
          {error}
        </div>
      </div>
    );
  }

  if (announcements.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-6 text-center text-gray-400">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 transition-transform hover:scale-110">
          <Megaphone className="w-8 h-8 opacity-40" />
        </div>
        <p className="text-base font-semibold text-gray-800">Belum ada pengumuman</p>
        <p className="text-sm mt-1 max-w-[200px]">Semua informasi terbaru akan muncul di sini.</p>
      </div>
    );
  }

  // Sorting: Active first, then by date newest
  const sortedItems = [...announcements].sort((a, b) => {
    if (a.is_active !== b.is_active) {
      return a.is_active ? -1 : 1;
    }
    return (
      new Date(b.tanggal_mulai).getTime() -
      new Date(a.tanggal_mulai).getTime()
    );
  });

  return (
    <section suppressHydrationWarning={true} className="bg-white">
      {/* List Items */}
      <div suppressHydrationWarning={true} className="flex flex-col">
        {sortedItems.map((p) => (
          <button
            key={p.id}
            onClick={() => router.push(`/info/${p.id}`)}
            className="relative w-full text-left px-5 py-4 hover:bg-sky-50 border-b border-gray-100 last:border-0 transition-colors duration-200"
          >
            {/* Indikator status aktif */}
            <span
              className={`absolute top-4 right-4 w-2 h-2 rounded-full ${
                p.is_active ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-gray-300"
              }`}
              title={p.is_active ? "Aktif" : "Tidak aktif"}
            />

            <div className="flex gap-4">
              {p.gambar && (
                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                  <Image 
                    src={p.gambar.startsWith('http') ? p.gambar : `/storage/${p.gambar}`} 
                    alt="" 
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex-1 pr-2">
                <div className="font-bold text-gray-900 line-clamp-2 leading-tight pr-4">
                  {p.judul}
                </div>
                <div className="text-xs text-gray-500 mt-1 line-clamp-2 leading-relaxed">
                  {truncateWords(p.isi, 20)}
                </div>
                <div className="text-[10px] text-gray-400 font-bold italic mt-2 flex items-center gap-1 uppercase tracking-wider">
                  <span>-</span>
                  {formatDateShort(p.tanggal_mulai)}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
