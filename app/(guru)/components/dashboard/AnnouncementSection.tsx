"use client";

import Image from "next/image";

type Announcement = {
  id: number;
  title: string;
  description: string;
  image?: string | null;
};

const announcements: Announcement[] = [
  {
    id: 1,
    title: "Kegiatan Workshop Pengembangan Kurikulum 2025",
    description: "Diberitahukan kepada seluruh guru untuk mengikuti kegiatan workshop pengembangan kurikulum pada tanggal 20 November 2025 di aula sekolah.",
    image: "https://matematika.mipa.unej.ac.id/wp-content/uploads/2025/09/Workshop-Kurikulum-Minimal-Statis-300x169.webp",
  },
  {
    id: 2,
    title: "Maintenance Sistem Akademik Online",
    description: "Sistem akademik online akan mengalami downtime pada hari Minggu, 23 November 2025 mulai pukul 22.00 hingga 02.00 untuk perbaikan server.",
  },
  {
    id: 3,
    title: "Pendaftaran Lomba Inovasi Pembelajaran",
    description: "Dibuka pendaftaran lomba inovasi pembelajaran untuk seluruh guru. Informasi lebih lanjut dapat dilihat di ruang TU.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSodfiVaXxPaoQr_rEuZ6HEwFoQByHbhpvlhQ&s",
  },
];

export default function AnnouncementSection() {
  return (
    <section className="px-3 py-6 bg-white ">
      {/* Heading */}
      <h2 className="text-lg font-bold text-gray-900 mb-3">Pengumuman</h2>

      {/* Card List */}
      <div className="divide-y space-y-2 divide-gray-200">
        {announcements.map((item) => (
          <div
            key={item.id}
            className="flex w-full cursor-pointer hover:bg-gray-50 border-2 border-gray-100 rounded transition-all duration-200"
            onClick={() => console.log("Clicked:", item.title)} // ganti dengan aksi sesungguhnya nanti
          >
            {/* Left: Image (if exists) */}
            {item.image ? (
              <div className="w-1/3 shrink-0 p-2 relative">
                <Image src={item.image} alt={item.title} width={150} height={100} className="object-cover w-full h-full max-h-32" unoptimized />
              </div>
            ) : null}

            {/* Right: Text Content */}
            <div className={`py-2 pr-3 pl-1 ${item.image ? "w-2/3" : "w-full"} flex flex-col`}>
              <h3 className="text-base font-semibold text-gray-900 line-clamp-2 mb-1">{item.title}</h3>
              <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
