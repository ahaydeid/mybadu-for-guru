"use client";

import AnnouncementSection from "../components/dashboard/AnnouncementSection";

export default function InfoPage() {
  return (
    <div suppressHydrationWarning={true} className="min-h-screen bg-white pb-20">
      <div suppressHydrationWarning={true} className="sticky top-0 z-20 bg-white flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <h1 suppressHydrationWarning={true} className="text-xl font-bold text-gray-900">Pusat Informasi</h1>
      </div>
      <AnnouncementSection />
    </div>
  );
}