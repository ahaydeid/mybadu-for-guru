"use client";

import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { MapPin, Check, LogOut, Loader2, Camera, X, RefreshCw, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function AbsenGuruPage() {
  const { token } = useAuth();
  const [currentTime, setCurrentTime] = useState<string>("--:--:--");
  const [currentDate, setCurrentDate] = useState<string>("");
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [waktuMasuk, setWaktuMasuk] = useState<string>("");
  const [waktuKeluar, setWaktuKeluar] = useState<string>("");
  const [isTerlambat, setIsTerlambat] = useState<boolean>(false);
  const [isPulangAwal, setIsPulangAwal] = useState<boolean>(false);
  const [sudahMasuk, setSudahMasuk] = useState<boolean>(false);
  const [isDetecting, setIsDetecting] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [jadwalHariIni, setJadwalHariIni] = useState<any[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);
  
  // State untuk koordinat & foto absen masuk dari API
  const [attendanceLatitude, setAttendanceLatitude] = useState<number | null>(null);
  const [attendanceLongitude, setAttendanceLongitude] = useState<number | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [statusVerifikasi, setStatusVerifikasi] = useState<string | null>(null);
  const [isInRange, setIsInRange] = useState<boolean>(true);
  const [schoolConfig, setSchoolConfig] = useState<any>(null);

  // ⬇⬇⬇ TAMBAHAN: KAMERA & SELFIE
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
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



  const formatTime = (timeString: string | null) => {
    if (!timeString) return "--:--";
    // Ambil Jam:Menit saja (format HH:mm)
    const match = timeString.match(/^(\d{1,2}:\d{2})/);
    return match ? match[0] : timeString.substring(0, 5);
  };

  const jamMulaiPertama = jadwalHariIni.length > 0 ? formatTime(jadwalHariIni[0].mulai) : "--:--";
  const jamSelesaiTerakhir = jadwalHariIni.length > 0 ? formatTime(jadwalHariIni[jadwalHariIni.length - 1].selesai) : "--:--";

  // JAM DIGITAL & TANGGAL
  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
      
      // Format tanggal: Day, DD Mon YYYY
      const dateFormatted = now.toLocaleDateString("id-ID", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
      });
      setCurrentDate(dateFormatted);
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // Helper untuk warna status (menggunakan HEX agar pasti muncul)
  const getStatusColor = (status: string | null) => {
    const s = status?.trim().toUpperCase();
    switch (s) {
      case "OTOMATIS": return "#0ea5e9"; // sky-500
      case "DISETUJUI": return "#10b981"; // emerald-500
      case "PENDING": return "#f59e0b"; // amber-500
      case "DITOLAK": return "#f43f5e"; // rose-500
      default: return "rgba(255,255,255,0.2)";
    }
  };

  // Helper hitung jarak (Haversine Formula) - hasil dalam Meter
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; // Jari-jari bumi dalam meter
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // FETCH INITIAL ATTENDANCE DATA
  useEffect(() => {
    const fetchTodayAttendance = async () => {
      if (!token) return;
      
      try {
        const result = await api.getTodayAttendance(token);
        
        if (result.success && result.data) {
          const data = result.data;
          setSudahMasuk(Boolean(data.sudah_masuk));
          setWaktuMasuk(data.waktu_masuk || "");
          setWaktuKeluar(data.waktu_keluar || "");
          setIsTerlambat(Boolean(data.is_terlambat));
          setIsPulangAwal(Boolean(data.is_pulang_awal));
          setJadwalHariIni(data.jadwal_hari_ini || []);
          
          // Simpan koordinat & foto URL dari API
          setAttendanceLatitude(data.latitude);
          setAttendanceLongitude(data.longitude);
          setFotoUrl(data.foto_url);
          setStatusVerifikasi(data.status_verifikasi);
          setIsInRange(data.is_in_range ?? true);
        }
      } catch (error) {
        console.error("Error fetching attendance:", error);
        showToast("Gagal memuat data absensi", "error");
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchTodayAttendance();
  }, [token]);

  // FETCH ATTENDANCE CONFIG
  useEffect(() => {
    const fetchConfig = async () => {
      if (!token) return;
      try {
        const result = await api.getAttendanceConfig(token);
        if (result.success && result.data) {
          setSchoolConfig(result.data);
        }
      } catch (error) {
        console.error("Error fetching attendance config:", error);
      }
    };
    fetchConfig();
  }, [token]);

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
        const userLat = pos.coords.latitude;
        const userLng = pos.coords.longitude;
        setPosition([userLat, userLng]);
        
        // Kalkulasi jangkauan secara real-time jika config sudah ada
        if (schoolConfig && schoolConfig.is_active) {
          const distance = calculateDistance(
            userLat, 
            userLng, 
            schoolConfig.latitude, 
            schoolConfig.longitude
          );
          
          const inRange = distance <= (schoolConfig.radius || 100);
          setIsInRange(inRange);
          
          if (!inRange) {
            showToast(`Anda berada di luar jangkauan (${Math.round(distance)}m)`, "error");
          } else {
            showToast("Lokasi terdeteksi di dalam jangkauan.", "success");
          }
        }
        
        setIsDetecting(false);
      },
      () => {
        showToast("Gagal mendeteksi lokasi.", "error");
        setIsDetecting(false);
      },
      { enableHighAccuracy: true }
    );
  };

  // REFRESH DATA DARI API (untuk auto-update setelah check-in/check-out)
  const refreshAttendanceData = async () => {
    if (!token) return;
    
    try {
      const result = await api.getTodayAttendance(token);
      
      if (result.success && result.data) {
        const data = result.data;
        setSudahMasuk(Boolean(data.sudah_masuk));
        setWaktuMasuk(data.waktu_masuk || "");
        setWaktuKeluar(data.waktu_keluar || "");
        setIsTerlambat(Boolean(data.is_terlambat));
        setIsPulangAwal(Boolean(data.is_pulang_awal));
        setJadwalHariIni(data.jadwal_hari_ini || []);
        
        // Update koordinat & foto URL dari API
        setAttendanceLatitude(data.latitude);
        setAttendanceLongitude(data.longitude);
        setFotoUrl(data.foto_url);
        setStatusVerifikasi(data.status_verifikasi);
        setIsInRange(data.is_in_range ?? true);
      }
    } catch (error) {
      console.error("Error refreshing attendance:", error);
    }
  };

  // ABSEN MASUK (API INTEGRATION)
  const handleAbsenMasuk = async () => {
    if (!token || !position || !photo) return;

    try {
      setIsSubmitting(true);
      const now = new Date();
      const timestamp = now.toISOString();

      const requestData = {
        latitude: position[0],
        longitude: position[1],
        photo: photo,
        timestamp: timestamp,
        metode_absen: "geo",
      };
      
      console.log("📤 Check-in Request Data:", requestData);
      
      const result = await api.checkInAttendance(token, requestData);

      if (result.success && result.data) {
        setWaktuMasuk(result.data.waktu_masuk);
        setIsTerlambat(result.data.is_terlambat);
        setSudahMasuk(true);
        
        // Simpan koordinat absen masuk untuk ditampilkan di maps
        setAttendanceLatitude(position[0]);
        setAttendanceLongitude(position[1]);
        setFotoUrl(null); // Foto URL akan di-set saat refresh/fetch ulang dari API
        
        showToast(result.message || "Absen masuk berhasil");
        
        // Reset position agar user harus deteksi lokasi lagi untuk check-out
        setPosition(null);
        
        // Auto-refresh data dari API untuk update foto_url dan data terbaru
        setTimeout(() => {
          refreshAttendanceData();
        }, 1000); // Delay 1 detik agar backend sempat save foto
      } else {
        showToast(result.message || "Gagal absen masuk", "error");
      }
    } catch (error: any) {
      console.error("Error check-in:", error);
      showToast(error.message || "Terjadi kesalahan saat absen masuk", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ABSEN KELUAR (API INTEGRATION)
  const handleAbsenKeluar = async () => {
    if (!token) return;

    try {
      setIsSubmitting(true);
      const now = new Date();
      const timestamp = now.toISOString();

      const result = await api.checkOutAttendance(token, {
        timestamp: timestamp,
      });

      if (result.success && result.data) {
        setWaktuKeluar(result.data.waktu_keluar);
        setIsPulangAwal(Boolean(result.data.is_pulang_awal));
        showToast(result.message || "Absen pulang berhasil");
        
        // Auto-refresh data dari API
        setTimeout(() => {
          refreshAttendanceData();
        }, 500);
      } else {
        showToast(result.message || "Gagal absen pulang", "error");
      }
    } catch (error: any) {
      console.error("Error check-out:", error);
      showToast(error.message || "Terjadi kesalahan saat absen pulang", "error");
    } finally {
      setIsSubmitting(false);
    }
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

    if (!isInRange) {
      setConfirmData({
        title: "Peringatan Lokasi",
        message: "Lokasi Anda berada di luar jangkauan sekolah. Tetap lanjutkan absen masuk?",
        variant: "warning",
        onConfirm: () => {
          setConfirmOpen(false);
          handleAbsenMasuk();
        },
      });
    } else {
      setConfirmData({
        title: "Absen Masuk",
        message: "Apakah Anda yakin ingin melakukan absen masuk sekarang?",
        variant: "primary",
        onConfirm: () => {
          setConfirmOpen(false);
          handleAbsenMasuk();
        },
      });
    }
    setConfirmOpen(true);
  };

  // TRIGGER ABSEN KELUAR
  const triggerAbsenKeluar = () => {
    if (!isInRange) {
      setConfirmData({
        title: "Peringatan Lokasi",
        message: "Lokasi Anda berada di luar jangkauan sekolah. Tetap lanjutkan absen pulang?",
        variant: "warning",
        onConfirm: () => {
          setConfirmOpen(false);
          handleAbsenKeluar();
        },
      });
    } else {
      setConfirmData({
        title: "Absen Pulang",
        message: "Apakah Anda yakin ingin melakukan absen pulang sekarang?",
        variant: "danger",
        onConfirm: () => {
          setConfirmOpen(false);
          handleAbsenKeluar();
        },
      });
    }
    setConfirmOpen(true);
  };

  // ⬇⬇⬇ FUNGSI KAMERA
  const startCamera = async (mode: "user" | "environment" = facingMode) => {
    // Stop previous stream if any
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
    }

    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: mode, width: { ideal: 720 }, height: { ideal: 720 } } 
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

  const toggleCamera = () => {
    const newMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(newMode);
    startCamera(newMode);
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



  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <Loader2 className="w-10 h-10 animate-spin text-sky-600 mb-4" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat data absensi...</p>
      </div>
    );
  }

  if (jadwalHariIni.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <Calendar className="w-10 h-10 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Tidak Ada Jadwal Hari Ini</h2>
        <p className="text-gray-500 max-w-xs">
          Anda tidak memiliki jadwal mengajar yang terdaftar untuk hari ini. Silakan hubungi admin jika ini adalah kesalahan.
        </p>
      </div>
    );
  }

  return (
    <>
      <div suppressHydrationWarning={true} className="min-h-screen bg-gray-50 pb-48">
        {/* JAM & TANGGAL */}
        <div suppressHydrationWarning={true} className="sticky top-0 z-40 flex items-center justify-between px-6 py-2 bg-[#009BFF] text-white shadow-md">
            <div suppressHydrationWarning={true} className="flex flex-col">
                <div suppressHydrationWarning={true} className="text-[10px] md:text-xs font-medium tracking-wide opacity-80">{currentDate}</div>
                <div suppressHydrationWarning={true} className="text-[32px] md:text-[40px] font-mono font-extrabold tracking-widest leading-none drop-shadow-sm">{currentTime}</div>
            </div>

            {statusVerifikasi && (
              <div 
                suppressHydrationWarning={true} 
                className="px-4 py-1.5 rounded-full text-[11px] font-bold border-2 border-white uppercase shadow-sm text-white"
                style={{ backgroundColor: getStatusColor(statusVerifikasi) }}
              >
                {statusVerifikasi}
              </div>
            )}
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
              ) : sudahMasuk && attendanceLatitude && attendanceLongitude ? (
                // Tampilkan Google Maps iframe dengan marker di lokasi absen masuk
                <iframe
                  suppressHydrationWarning={true}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  loading="lazy"
                  allowFullScreen
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${attendanceLatitude},${attendanceLongitude}&zoom=17`}
                />
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
            {sudahMasuk && fotoUrl ? (
              // Tampilkan foto dari API jika sudah check-in
              <>
                <img suppressHydrationWarning={true} src={fotoUrl} alt="Foto Absen Masuk" className="w-full h-full object-cover" />
                <div suppressHydrationWarning={true} className="absolute bottom-2 left-2 bg-emerald-600/90 text-white px-3 py-1 rounded-full text-xs font-bold">
                  ✓ Foto Tersimpan
                </div>
              </>
            ) : photo ? (
              <>
                <Image suppressHydrationWarning={true} src={photo} alt="Selfie preview" width={400} height={400} className="w-full h-full object-cover" />
                {!sudahMasuk && (
                  <button 
                    suppressHydrationWarning={true}
                    onClick={() => setPhoto(null)}
                    className="absolute top-2 right-2 bg-red-600/80 text-white p-1.5 rounded-full shadow-lg hover:bg-red-700 transition"
                  >
                    <X suppressHydrationWarning={true} className="w-5 h-5" />
                  </button>
                )}
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
        <div suppressHydrationWarning={true} className="fixed bottom-[55px] left-0 right-0 z-30 pb-2 pt-2 bg-gradient-to-t from-gray-50 to-transparent">
          <div suppressHydrationWarning={true} className="w-full space-y-3">
            
            {/* LOCATION & CAMERA */}
            <div suppressHydrationWarning={true} className="flex gap-2 px-4">
              <button
                suppressHydrationWarning={true}
                onClick={handleDetectLocation}
                disabled={isDetecting || (waktuKeluar !== "" && waktuKeluar !== null)}
                className={`flex-1 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  isDetecting || (waktuKeluar !== "" && waktuKeluar !== null)
                    ? "bg-gray-300 cursor-not-allowed text-white"
                    : "bg-[#009BFF] hover:bg-sky-600 text-white"
                }`}
              >
                <MapPin suppressHydrationWarning={true} className="w-5 h-5" />
                {isDetecting ? "Mendeteksi..." : "Deteksi Lokasi"}
              </button>
              <button
                suppressHydrationWarning={true}
                onClick={() => startCamera()}
                disabled={sudahMasuk && fotoUrl !== null}
                className={`flex-1 font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-sm ${
                  sudahMasuk && fotoUrl !== null
                    ? "bg-gray-300 cursor-not-allowed text-gray-500"
                    : "bg-zinc-800 hover:bg-black text-white"
                }`}
              >
                <Camera suppressHydrationWarning={true} className="w-5 h-5" />
                {sudahMasuk && fotoUrl !== null ? "Foto Tersimpan" : photo ? "Ulang Selfie" : "Ambil selfie"}
              </button>
            </div>

            {/* MASUK & KELUAR */}
            <div suppressHydrationWarning={true} className="flex gap-2 bg-white min-w-full">
              {/* MASUK */}
              <div suppressHydrationWarning={true} className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div suppressHydrationWarning={true} className="flex justify-between items-center px-3 py-2 border-b border-gray-50 bg-gray-50/50">
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-gray-700 leading-none">{jamMulaiPertama}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Mulai</p>
                  </div>
                  <div suppressHydrationWarning={true} className="w-px h-5 bg-gray-200 mx-1" />
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className={`text-[14px] font-extrabold leading-none ${isTerlambat ? "text-rose-600" : "text-sky-600"}`}>
                      {formatTime(waktuMasuk)}
                      {sudahMasuk && isTerlambat}
                    </p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Masuk</p>
                  </div>
                </div>

                <button
                  suppressHydrationWarning={true}
                  onClick={triggerAbsenMasuk}
                  disabled={sudahMasuk || !position || isDetecting || isSubmitting}
                  className={`w-full py-3 text-white text-sm font-black transition-all flex items-center justify-center gap-2 ${
                    sudahMasuk
                      ? Boolean(isTerlambat) ? "bg-red-600" : "bg-emerald-600 text-white"
                      : !position || isDetecting || isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-sky-600 hover:bg-sky-700"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 suppressHydrationWarning={true} className="w-5 h-5 animate-spin" />
                  ) : sudahMasuk ? (
                    Boolean(isTerlambat) ? (
                      <span className="text-white drop-shadow-sm uppercase tracking-tighter">Terlambat!</span>
                    ) : (
                      <Check suppressHydrationWarning={true} className="w-6 h-6 text-white stroke-[4]" />
                    )
                  ) : (
                    "Masuk"
                  )}
                </button>
              </div>

              {/* KELUAR */}
              <div suppressHydrationWarning={true} className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden flex flex-col">
                <div suppressHydrationWarning={true} className="flex justify-between items-center px-3 py-2 border-b border-gray-50 bg-gray-50/50">
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className="text-[14px] font-extrabold text-gray-700 leading-none">{jamSelesaiTerakhir}</p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Selesai</p>
                  </div>
                  <div suppressHydrationWarning={true} className="w-px h-5 bg-gray-200 mx-1" />
                  <div suppressHydrationWarning={true} className="text-center flex-1">
                    <p suppressHydrationWarning={true} className={`text-[14px] font-extrabold leading-none ${waktuKeluar && isPulangAwal ? "text-rose-600" : "text-emerald-600"}`}>
                      {formatTime(waktuKeluar)}
                    </p>
                    <p suppressHydrationWarning={true} className="text-[9px] text-gray-400 uppercase font-bold mt-1">Keluar</p>
                  </div>
                </div>

                <button
                  suppressHydrationWarning={true}
                  onClick={triggerAbsenKeluar}
                  disabled={!sudahMasuk || !bolehKeluar || !position || isSubmitting || (waktuKeluar !== "" && waktuKeluar !== null)}
                  className={`w-full py-3 text-white text-sm font-black transition-all flex items-center justify-center gap-2 ${
                    waktuKeluar
                      ? isPulangAwal ? "bg-red-600" : "bg-emerald-600"
                      : !sudahMasuk || !bolehKeluar || !position || isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-rose-600 hover:bg-rose-700"
                  }`}
                >
                  {isSubmitting ? (
                    <Loader2 suppressHydrationWarning={true} className="w-4 h-4 animate-spin" />
                  ) : waktuKeluar ? (
                    isPulangAwal ? (
                      <span className="text-white drop-shadow-sm uppercase tracking-tighter">Pulang awal</span>
                    ) : (
                      <Check suppressHydrationWarning={true} className="w-6 h-6 text-white stroke-[4]" />
                    )
                  ) : (
                    <>
                      <LogOut suppressHydrationWarning={true} className="w-4 h-4 text-white stroke-[3]" />
                      Keluar
                    </>
                  )}
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
              className={`min-w-full min-h-full object-cover ${facingMode === "user" ? "-scale-x-100" : ""}`} 
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
            <button suppressHydrationWarning={true} onClick={toggleCamera} className="p-4 bg-white/10 rounded-full text-white">
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
