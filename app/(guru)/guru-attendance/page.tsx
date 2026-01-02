"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { MapPin, Check, LogOut, Loader2, List } from "lucide-react";
import SuccessModal from "./components/SuccessModal";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function AbsenGuruPage() {
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [waktuMasuk, setWaktuMasuk] = useState<string>("");
  const [waktuKeluar, setWaktuKeluar] = useState<string>("");
  const [isTerlambat, setIsTerlambat] = useState<boolean>(false);
  const [sudahMasuk, setSudahMasuk] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // ⬇⬇⬇ TAMBAHAN: LOADING STATE
  const [loading, setLoading] = useState<boolean>(false);

  const GURU_ID = 1;

  const jadwalHariIni = [
    { id: 1, kelas: "12 MPLB 1", mulai: "07:30", selesai: "09:00" },
    { id: 2, kelas: "11 AKL 2", mulai: "09:15", selesai: "11:15" },
  ];

  const jamMulaiPertama = jadwalHariIni[0].mulai;
  const jamSelesaiTerakhir = jadwalHariIni[jadwalHariIni.length - 1].selesai;

  // JAM DIGITAL
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formatted = now.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
      setCurrentTime(formatted);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // DETEKSI LOKASI
  const handleDetectLocation = (): void => {
    setIsDetecting(true);
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung geolokasi.");
      setIsDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setIsDetecting(false);
      },
      () => {
        alert("Gagal mendeteksi lokasi.");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // API MASUK
  const submitAbsenMasuk = async (jam: string) => {
    if (!position) {
      alert("Silakan deteksi lokasi terlebih dahulu.");
      return;
    }

    setLoading(true); // ⬅ START LOADING

    const res = await fetch("https://mybadar-panel.vercel.app/api/absensi/masuk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guru_id: GURU_ID,
        lat: position[0],
        lng: position[1],
        jam_masuk: jam,
      }),
    });

    const data = await res.json();

    setLoading(false); // ⬅ STOP LOADING

    if (!res.ok) {
      alert("Gagal absen masuk: " + data.error);
      return;
    }

    // ⬇⬇⬇ GANTI ALERT → MODAL
    setModalMessage("Absen Masuk Berhasil");
    setModalOpen(true);
  };

  // API KELUAR
  const submitAbsenKeluar = async () => {
    setLoading(true); // ⬅ START LOADING

    const res = await fetch("https://mybadar-panel.vercel.app/api/absensi/keluar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        guru_id: GURU_ID,
        jam_pulang: waktuKeluar,
      }),
    });

    const data = await res.json();

    setLoading(false); // ⬅ STOP LOADING

    if (!res.ok) {
      alert("Gagal absen keluar: " + data.error);
      return;
    }

    // ⬇⬇⬇ GANTI ALERT → MODAL
    setModalMessage("Absen Pulang Berhasil");
    setModalOpen(true);
  };

  // ABSEN MASUK
  const handleAbsenMasuk = () => {
    const now = new Date();
    const waktuSekarang = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

    setWaktuMasuk(waktuSekarang);

    const [jamMulai, menitMulai] = jamMulaiPertama.split(":").map(Number);
    const jamSekarang = now.getHours();
    const menitSekarang = now.getMinutes();

    setIsTerlambat(jamSekarang > jamMulai || (jamSekarang === jamMulai && menitSekarang > menitMulai));
    setSudahMasuk(true);

    submitAbsenMasuk(waktuSekarang);
  };

  // ABSEN KELUAR
  const handleAbsenKeluar = () => {
    const now = new Date();
    const waktuSekarang = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

    setWaktuKeluar(waktuSekarang);
    submitAbsenKeluar();
  };

  const bolehKeluar = sudahMasuk;

  // ⬇⬇⬇ TAMBAHAN: SPINNER OVERLAY
  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
        <Loader2 className="w-16 h-16 text-white animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 pb-16">
        {/* HEADER */}
        <div className="sticky top-0 z-20 bg-white flex items-center justify-between px-1 py-1 border-b border-gray-200 shadow-sm">
          <h1 className="text-[20px] font-extrabold flex-1 pl-2">Absen Guru</h1>
          <button className="text-sm font-semibold px-3 py-1 bg-gray-700 text-white rounded hover:bg-sky-700 transition flex items-center gap-2">
            Log Saya <List className="w-4 h-4" />
          </button>
        </div>

        {/* JAM */}
        <div className="flex flex-col items-center justify-center py-1 bg-[#009BFF] text-white shadow-md">
          <div className="text-[48px] md:text-[56px] font-mono font-extrabold tracking-widest drop-shadow-sm">{currentTime}</div>
          <p className="text-sm opacity-90">waktu saat ini</p>
        </div>

        {/* PETA */}
        <div className="max-w-md mx-auto mt-4 px-2">
          <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div className="h-[280px] relative flex items-center justify-center">
              {isDetecting ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-sm">
                  <Loader2 className="w-8 h-8 mb-2 animate-spin text-sky-600" />
                  <p>Mendeteksi lokasi...</p>
                </div>
              ) : position ? (
                <MapView lat={position[0]} lng={position[1]} />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-sm">
                  <p>Deteksi lokasi untuk mendapat titik koordinat</p>
                </div>
              )}
            </div>
          </div>

          {/* DETEKSI */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={handleDetectLocation}
              disabled={isDetecting}
              className={`flex-1 font-semibold py-2 rounded-lg flex items-center justify-center gap-2 transition ${isDetecting ? "bg-sky-300 cursor-not-allowed text-white" : "bg-[#009BFF] hover:bg-sky-600 text-white"}`}
            >
              <MapPin className="w-5 h-5" />
              {isDetecting ? "Mendeteksi..." : "Deteksi Lokasi"}
            </button>
          </div>

          {/* MASUK & KELUAR */}
          <div className="mt-5 flex gap-2">
            {/* MASUK */}
            <div className="flex-1 bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <div className="text-center flex-1">
                  <p className="text-[18px] font-bold text-gray-800">{jamMulaiPertama}</p>
                  <p className="text-[12px] text-gray-500">Mulai</p>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="text-center flex-1">
                  <p className="text-[18px] font-bold text-gray-800">{waktuMasuk || "--:--"}</p>
                  <p className="text-[12px] text-gray-500">Masuk</p>
                </div>
              </div>

              <button
                onClick={handleAbsenMasuk}
                disabled={sudahMasuk || !position}
                className={`w-full py-2 rounded-b-xl text-white text-lg font-semibold transition flex items-center justify-center gap-2 ${sudahMasuk ? (isTerlambat ? "bg-red-600" : "bg-green-500") : "bg-gray-700"}`}
              >
                {sudahMasuk ? isTerlambat ? "Terlambat!" : <Check className="w-7 h-7 text-white" /> : "Masuk"}
              </button>
            </div>

            {/* KELUAR */}
            <div className="flex-1 bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3">
                <div className="text-center flex-1">
                  <p className="text-[18px] font-bold text-gray-800">{jamSelesaiTerakhir}</p>
                  <p className="text-[12px] text-gray-500">Selesai</p>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="text-center flex-1">
                  <p className="text-[18px] font-bold text-gray-800">{waktuKeluar || "--:--"}</p>
                  <p className="text-[12px] text-gray-500">Keluar</p>
                </div>
              </div>

              <button
                onClick={handleAbsenKeluar}
                disabled={!sudahMasuk || !bolehKeluar}
                className={`w-full py-2 rounded-b-xl text-white text-lg font-semibold transition flex items-center justify-center gap-2 ${!sudahMasuk || !bolehKeluar ? "bg-gray-700 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"}`}
              >
                <LogOut className="w-5 h-5" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL SUCCESS */}
      <SuccessModal open={modalOpen} message={modalMessage} onClose={() => setModalOpen(false)} />
    </>
  );
}
