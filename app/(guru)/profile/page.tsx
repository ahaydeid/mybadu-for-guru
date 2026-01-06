"use client";

import { User, KeyRound, HelpCircle, LogOut, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Toast from "../components/ui/Toast";

const ProfilePage = () => {
  const router = useRouter();
  const { user, logout, syncProfile } = useAuth();
  
  // State untuk ConfirmDialog
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  // State untuk Toast
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    syncProfile();
  }, []);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastMessage(message);
    setToastType(type);
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 2000);
  };

  const handleLogout = async () => {
    try {
      await logout();
      showToast("Logout berhasil!");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    } catch (error) {
      showToast("Logout gagal. Silakan coba lagi.", "error");
    }
    setConfirmOpen(false);
  };

  const menus = [
    {
      id: 1,
      name: "Profil Saya",
      icon: <User className="w-5 h-5 text-gray-600" />,
      action: () => router.push("/profile/detail"),
    },
    {
      id: 2,
      name: "Ganti Kata Sandi",
      icon: <KeyRound className="w-5 h-5 text-gray-600" />,
      action: () => router.push("/profile/change-password"),
    },
    {
      id: 4,
      name: "Pengaturan",
      icon: <Settings className="w-5 h-5 text-gray-600" />,
      action: () => router.push("/profile/settings"),
    },
    {
      id: 5,
      name: "Bantuan",
      icon: <HelpCircle className="w-5 h-5 text-gray-600" />,
      action: () => router.push("/profile/help"),
    },
    {
      id: 6,
      name: "Logout",
      icon: <LogOut className="w-5 h-5 text-red-600" />,
      action: () => setConfirmOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white text-center text-2xl md:text-[22px] font-extrabold py-2 border-b border-gray-200 shadow-sm flex items-center justify-between px-4">
        {/* Tombol Back */}
        <button onClick={() => window.history.back()} className="text-gray-700 hover:text-sky-600 transition-colors" aria-label="Kembali">
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* Judul */}
        <h1 className="flex-1 text-center">Profile</h1>

        {/* Spacer kanan */}
        <div className="w-6" />
      </header>

      {/* Profile summary */}
      <section className="relative w-full flex items-center justify-between bg-white border-b border-gray-200 py-3 px-4 md:px-10">
        {/* Info kiri */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center text-white text-2xl font-bold uppercase overflow-hidden shrink-0">
            {user?.guru?.foto && !imageError ? (
              <img 
                src={getImageUrl(user.guru.foto) || ""} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              user?.name?.substring(0, 2) || <User className="w-8 h-8" />
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-lg font-semibold text-gray-900 truncate">
              {(() => {
                const g = user?.guru;
                const depan = g?.gelar_depan ? g.gelar_depan + " " : "";
                const belakang = g?.gelar_belakang ? ", " + g.gelar_belakang : "";
                return `${depan}${g?.nama || user?.name || "User"}${belakang}`;
              })()}
            </h2>
            <p className="text-sm text-gray-600 truncate mb-1">
              {(user?.guru?.mapel_diampu?.length ?? 0) > 0
                ? Array.from(new Set(user?.guru?.mapel_diampu?.map((m: any) => m.nama))).join(", ")
                : (user?.guru?.mengajar || user?.guru?.tugas_tambahan || "Guru")}
            </p>
            {/* Roles Badge */}
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {user?.roles?.map((role, idx) => (
                <span 
                  key={idx}
                  className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-tight"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Menu list */}
      <main className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {menus.map((menu) => (
            <button key={menu.id} onClick={menu.action} className={`flex items-center justify-between w-full text-left px-5 py-4 bg-white hover:bg-gray-50 transition ${menu.name === "Logout" ? "hover:bg-red-50" : ""}`}>
              <div className="flex items-center gap-3">
                {menu.icon}
                <span className={`text-base ${menu.name === "Logout" ? "text-red-600" : "text-gray-800 font-medium"}`}>{menu.name}</span>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Reusable Modals */}
      <ConfirmDialog
        open={confirmOpen}
        title="Logout"
        message="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmText="Ya, Logout"
        cancelText="Batal"
        variant="danger"
        onConfirm={handleLogout}
        onClose={() => setConfirmOpen(false)}
      />

      <Toast 
        open={toastOpen} 
        message={toastMessage} 
        type={toastType} 
      />
    </div>
  );
};

export default ProfilePage;
