"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin, Check, LogOut, Loader2, List, Camera, X, RefreshCw } from "lucide-react";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function AbsenGuruPage() {
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [waktuMasuk, setWaktuMasuk] = useState<string>("");
  const [waktuKeluar, setWaktuKeluar] = useState<string>("");
  const [isTerlambat, setIsTerlambat] = useState<boolean>(false);
  const [sudahMasuk, setSudahMasuk] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);

  // ⬇⬇⬇ TAMBAHAN: KAMERA & SELFIE
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);


  
  // ⬇⬇⬇ TAMBAHAN: UI STATES
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmData, setConfirmData] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    variant: "primary" | "danger" | "warning";
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
    variant: "primary",
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastData, setToastData] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastData({ message, type });
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 3000);
  };



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
      showToast("Browser tidak mendukung geolokasi.", "error");
      setIsDetecting(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition([pos.coords.latitude, pos.coords.longitude]);
        setIsDetecting(false);
      },
      () => {
        showToast("Gagal mendeteksi lokasi.", "error");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true }
    );
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
    showToast("Absen Masuk Berhasil (Simulasi UI)");
  };

  // ABSEN KELUAR
  const handleAbsenKeluar = () => {
    const now = new Date();
    const waktuSekarang = String(now.getHours()).padStart(2, "0") + ":" + String(now.getMinutes()).padStart(2, "0");

    setWaktuKeluar(waktuSekarang);
    showToast("Absen Pulang Berhasil (Simulasi UI)");
  };

  const bolehKeluar = sudahMasuk;

  // TRIGGER ABSEN MASUK
  const triggerAbsenMasuk = () => {
    if (!position) {
      showToast("Silakan deteksi lokasi terlebih dahulu.", "error");
      return;
    }
    if (!photo) {
      showToast("Silakan ambil foto selfie terlebih dahulu.", "error");
      return;
    }
    setConfirmData({
      title: "Absen Masuk",
      message: "Apakah Anda yakin ingin melakukan absen masuk sekarang?",
      variant: "primary",
      onConfirm: () => {
        setConfirmOpen(false);
        handleAbsenMasuk();
      },
    });
    setConfirmOpen(true);
  };

  // TRIGGER ABSEN KELUAR
  const triggerAbsenKeluar = () => {
    if (!photo) {
      showToast("Silakan ambil foto selfie terlebih dahulu.", "error");
      return;
    }
    setConfirmData({
      title: "Absen Pulang",
      message: "Apakah Anda yakin ingin melakukan absen pulang sekarang?",
      variant: "danger",
      onConfirm: () => {
        setConfirmOpen(false);
        handleAbsenKeluar();
      },
    });
    setConfirmOpen(true);
  };

  // ⬇⬇⬇ FUNGSI KAMERA
  const startCamera = async () => {
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } } 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error access camera:", err);
      showToast("Gagal mengakses kamera.", "error");
      setIsCameraOpen(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
        setPhoto(dataUrl);
        stopCamera();
      }
    }
  };



  return (
    <>
      <div suppressHydrationWarning={true} className="min-h-screen bg-gray-50 pb-48">
        {/* HEADER */}
        <div suppressHydrationWarning={true} className="sticky top-0 z-20 bg-white flex items-center justify-between px-1 py-1 border-b border-gray-200 shadow-sm">
          <h1 suppressHydrationWarning={true} className="text-[20px] font-extrabold flex-1 pl-2">Absen Guru</h1>
          <button suppressHydrationWarning={true} className="text-sm font-semibold px-3 py-1 bg-gray-700 text-white rounded hover:bg-sky-700 transition flex items-center gap-2">
            Log Saya <List suppressHydrationWarning={true} className="w-4 h-4" />
          </button>
        </div>

        {/* JAM */}
        <div suppressHydrationWarning={true} className="flex flex-col items-center justify-center py-1 bg-[#009BFF] text-white shadow-md">
          <div suppressHydrationWarning={true} className="text-[48px] md:text-[56px] font-mono font-extrabold tracking-widest drop-shadow-sm">{currentTime}</div>
        </div>

        {/* CONTENT */}
        <div suppressHydrationWarning={true} className="max-w-md mx-auto mt-4 px-2">
          {/* PETA */}
          <div suppressHydrationWarning={true} className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-200">
            <div suppressHydrationWarning={true} className="h-[280px] relative flex items-center justify-center">
              {isDetecting ? (
                <div suppressHydrationWarning={true} className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-sm">
                  <Loader2 suppressHydrationWarning={true} className="w-8 h-8 mb-2 animate-spin text-sky-600" />
                  <p suppressHydrationWarning={true}>Mendeteksi lokasi...</p>
                </div>
              ) : position ? (
                <MapView lat={position[0]} lng={position[1]} />
              ) : (
                <div suppressHydrationWarning={true} className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 text-gray-500 text-sm">
                  <p suppressHydrationWarning={true}>Deteksi lokasi untuk mendapat titik koordinat</p>
                </div>
              )}
            </div>
          </div>

          {/* PREVIEW FOTO */}
          <div suppressHydrationWarning={true} className="mt-4 rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[220px] bg-white relative group">
            {photo ? (
              <>
                <Image suppressHydrationWarning={true} src={photo} alt="Selfie preview" width={400} height={400} className="w-full h-full object-cover" />
                <button 
                  suppressHydrationWarning={true}
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-red-600/80 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition"
                >
                  <X suppressHydrationWarning={true} className="w-5 h-5" />
                </button>
              </>
            ) : (
              <div suppressHydrationWarning={true} className="flex flex-col items-center py-10 opacity-40">
                <Camera suppressHydrationWarning={true} className="w-16 h-16 mb-2" />
                <p suppressHydrationWarning={true} className="text-sm font-semibold">Foto selfie bukti kehadiran</p>
                <p suppressHydrationWarning={true} className="text-xs mt-1 italic">(Belum ada foto)</p>
              </div>
            )}
          </div>
        </div>

        {/* STICKY BOTTOM ACTIONS */}
        <div suppressHydrationWarning={true} className="fixed bottom-[60px] left-0 right-0 z-30 px-4 pb-6 pt-4">
          <div suppressHydrationWarning={true} className="max-w-md mx-auto space-y-4">
            
            {/* LOCATION & CAMERA */}
            <div suppressHydrationWarning={true} className="flex gap-2">
              <button
                suppressHydrationWarning={true}
                onClick={handleDetectLocation}
                disabled={isDetecting}
                className={`flex-1 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  isDetecting
                    ? "bg-sky-300 cursor-not-allowed text-white"
                    : "bg-[#009BFF] hover:bg-sky-600 text-white"
                }`}
              >
                <MapPin suppressHydrationWarning={true} className="w-5 h-5" />
                {isDetecting ? "Mendeteksi..." : "Deteksi Lokasi"}
              </button>
              <button
                suppressHydrationWarning={true}
                onClick={startCamera}
                className="flex-1 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 bg-zinc-800 hover:bg-black text-white transition-all active:scale-95 shadow-sm"
              >
                <Camera suppressHydrationWarning={true} className="w-5 h-5" />
                {photo ? "Ulang Selfie" : "Ambil selfie"}
              </button>
            </div>

            {/* MASUK & KELUAR */}
            <div suppressHydrationWarning={true} className="flex gap-2">
              {/* MASUK */}
              <div suppressHydrationWarning={true} className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div suppressHydrationWarning={true} className="flex justify-between items-center px-3 py-2 border-b border-gray-50 bg-gray-50/50">
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-gray-700 leading-none">{jamMulaiPertama}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Mulai</p>
                  </div>
                  <div suppressHydrationWarning={true} className="w-px h-5 bg-gray-200 mx-1" />
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-sky-600 leading-none">{waktuMasuk || "--:--"}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Masuk</p>
                  </div>
                </div>

                <button
                  suppressHydrationWarning={true}
                  onClick={triggerAbsenMasuk}
                  disabled={sudahMasuk || !position || isDetecting}
                  className={`w-full py-3 text-white text-sm font-black transition-all flex items-center justify-center gap-2 ${
                    sudahMasuk
                      ? isTerlambat ? "bg-rose-500" : "bg-emerald-500"
                      : !position || isDetecting ? "bg-gray-300 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  {sudahMasuk ? (isTerlambat ? "Terlambat!" : <Check suppressHydrationWarning={true} className="w-5 h-5 text-white stroke-[3]" />) : "Masuk"}
                </button>
              </div>

              {/* KELUAR */}
              <div suppressHydrationWarning={true} className="flex-1 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
                <div suppressHydrationWarning={true} className="flex justify-between items-center px-3 py-2 border-b border-gray-50 bg-gray-50/50">
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-gray-700 leading-none">{jamSelesaiTerakhir}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Selesai</p>
                  </div>
                  <div suppressHydrationWarning={true} className="w-px h-5 bg-gray-200 mx-1" />
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-rose-600 leading-none">{waktuKeluar || "--:--"}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Keluar</p>
                  </div>
                </div>

                <button
                  suppressHydrationWarning={true}
                  onClick={triggerAbsenKeluar}
                  disabled={!sudahMasuk || !bolehKeluar}
                  className={`w-full py-3 text-white text-sm font-black transition-all flex items-center justify-center gap-2 ${
                    !sudahMasuk || !bolehKeluar ? "bg-gray-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  <LogOut suppressHydrationWarning={true} className="w-4 h-4 text-white stroke-[3]" />
                  Keluar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL KAMERA OVERLAY */}
      {isCameraOpen && (
        <div suppressHydrationWarning={true} className="fixed inset-0 z-50 flex flex-col bg-black">
          <div suppressHydrationWarning={true} className="flex items-center justify-between p-4 text-white bg-black/50 absolute top-0 left-0 right-0 z-10">
            <h2 suppressHydrationWarning={true} className="text-lg font-bold">Ambil Selfie</h2>
            <button suppressHydrationWarning={true} onClick={stopCamera} className="p-2 bg-white/10 rounded-full">
              <X suppressHydrationWarning={true} className="w-6 h-6" />
            </button>
          </div>
          
          <div suppressHydrationWarning={true} className="flex-1 flex items-center justify-center overflow-hidden">
            <video 
              suppressHydrationWarning={true}
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="min-w-full min-h-full object-cover -scale-x-100" 
            />
            <canvas suppressHydrationWarning={true} ref={canvasRef} className="hidden" />
          </div>

          <div suppressHydrationWarning={true} className="p-10 flex items-center justify-around bg-black/50 absolute bottom-0 left-0 right-0">
            <div suppressHydrationWarning={true} className="w-12 h-12" />
            <button 
              suppressHydrationWarning={true}
              onClick={capturePhoto}
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-90 transition shadow-inner"
            >
              <div suppressHydrationWarning={true} className="w-14 h-14 rounded-full bg-white" />
            </button>
            <button suppressHydrationWarning={true} onClick={startCamera} className="p-4 bg-white/10 rounded-full text-white">
              <RefreshCw suppressHydrationWarning={true} className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* CONFIRM DIALOG */}
      <ConfirmDialog
        open={confirmOpen}
        title={confirmData.title}
        message={confirmData.message}
        variant={confirmData.variant}
        onConfirm={confirmData.onConfirm}
        onClose={() => setConfirmOpen(false)}
      />

      {/* TOAST */}
      <Toast
        open={toastOpen}
        message={toastData.message}
        type={toastData.type}
      />
    </>
  );
}
