"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Camera, Calendar, Cloud, ChevronRight } from "lucide-react";

const slides = [
  {
    title: "Absensi Selfie & GPS",
    description: "Lakukan absensi mandiri dengan verifikasi wajah dan lokasi yang akurat.",
    icon: <Camera className="w-20 h-20 text-sky-500" />,
    color: "bg-sky-50",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        <circle cx="100" cy="100" r="80" fill="#E0F2FE" />
        <rect x="60" y="70" width="80" height="60" rx="8" fill="#0EA5E9" />
        <circle cx="100" cy="100" r="15" fill="white" opacity="0.3" />
        <circle cx="100" cy="100" r="8" fill="white" />
        <path d="M90 60 L110 60 L105 50 L95 50 Z" fill="#0369A1" />
      </svg>
    )
  },
  {
    title: "Pantau Jadwal",
    description: "Lihat jadwal mengajar harian Anda dengan mudah dalam satu tampilan.",
    icon: <Calendar className="w-20 h-20 text-purple-500" />,
    color: "bg-purple-50",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        <circle cx="100" cy="100" r="80" fill="#F3E8FF" />
        <rect x="60" y="60" width="80" height="80" rx="4" fill="#A855F7" />
        <rect x="60" y="60" width="80" height="20" rx="4" fill="#7E22CE" />
        <rect x="70" y="90" width="20" height="10" rx="2" fill="white" opacity="0.5" />
        <rect x="100" y="90" width="30" height="10" rx="2" fill="white" opacity="0.5" />
        <rect x="70" y="110" width="60" height="10" rx="2" fill="white" opacity="0.5" />
      </svg>
    )
  },
  {
    title: "Data Terintegrasi",
    description: "Seluruh data kehadiran Anda tersimpan aman dan sinkron dengan sistem sekolah.",
    icon: <Cloud className="w-20 h-20 text-orange-500" />,
    color: "bg-orange-50",
    illustration: (
      <svg viewBox="0 0 200 200" className="w-48 h-48">
        <circle cx="100" cy="100" r="80" fill="#FFF7ED" />
        <path d="M150 110 A30 30 0 0 0 120 80 A40 40 0 1 0 50 110 Z" fill="#F97316" />
        <path d="M130 130 L100 100 L70 130" stroke="white" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M100 100 L100 140" stroke="white" strokeWidth="6" strokeLinecap="round" fill="none" />
      </svg>
    )
  }
];

export default function Onboarding({ onComplete }: { onComplete: () => void }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const next = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(s => s + 1);
    } else {
      onComplete();
    }
  };

  const skip = () => onComplete();

  return (
    <div className="fixed inset-0 z-[101] bg-white flex flex-col">
      <div className="flex-1 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.5, ease: "anticipate" }}
            className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center"
          >
            <div className="mb-12 relative">
              <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 15 }}
              >
                {slides[currentSlide].illustration}
              </motion.div>
            </div>

            <h2 className="text-3xl font-extrabold text-gray-900 mb-4 px-4 leading-tight">
              {slides[currentSlide].title}
            </h2>
            <p className="text-lg text-gray-600 max-w-sm mx-auto leading-relaxed">
              {slides[currentSlide].description}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="p-8 flex flex-col space-y-6">
        {/* Indicators */}
        <div className="flex justify-center space-x-2">
          {slides.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === currentSlide ? "w-8 bg-sky-600" : "w-2 bg-gray-200"
              }`}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <button
            onClick={skip}
            className="text-gray-400 font-bold px-4 py-2 hover:text-gray-600 transition"
          >
            Lewati
          </button>
          
          <button
            onClick={next}
            className="bg-purple-600 text-white font-bold h-10 px-8 rounded-full flex items-center gap-2 shadow-lg active:scale-95 transition-transform"
          >
            {currentSlide === slides.length - 1 ? (
              "Mulai Sekarang"
            ) : (
              <>
                Lanjut <ChevronRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
