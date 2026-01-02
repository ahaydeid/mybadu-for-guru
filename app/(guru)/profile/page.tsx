"use client";

import { User, KeyRound, HelpCircle, LogOut, Settings, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const ProfilePage = () => {
  const router = useRouter();

  const handleLogout = () => {
    alert("Anda telah logout (dummy).");
    router.push("/login");
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
      action: () => window.open("https://ahadi.my.id/chat/2712f917-65ba-4a55-9bce-4eb80e4ea7d9", "_blank"),
    },
    {
      id: 6,
      name: "Logout",
      icon: <LogOut className="w-5 h-5 text-red-600" />,
      action: handleLogout,
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
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-700 text-2xl font-bold">
            <User className="w-8 h-8" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Ahadi</h2>
            <p className="text-sm text-gray-600">Coding</p>
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
    </div>
  );
};

export default ProfilePage;
