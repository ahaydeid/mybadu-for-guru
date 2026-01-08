"use client";

import AnnouncementSection from "../components/dashboard/AnnouncementSection";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function InfoPage() {
  const router = useRouter();
  
  return (
    <div suppressHydrationWarning={true} className="min-h-screen bg-white pb-20">
      <div suppressHydrationWarning={true} className="sticky top-0 z-20 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 py-3">
          <button
            onClick={() => router.back()}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors absolute left-4"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <h1 suppressHydrationWarning={true} className="text-xl font-bold text-gray-900 w-full text-center">Pusat Informasi</h1>
        </div>
      </div>
      <AnnouncementSection />
    </div>
  );
}