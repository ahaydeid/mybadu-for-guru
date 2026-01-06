"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import Toast, { ToastType } from "../../components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";

const Page = () => {
  const router = useRouter();
  const { token } = useAuth();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; type: ToastType }>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast("Semua field harus diisi", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Konfirmasi kata sandi tidak cocok", "error");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmSave = async () => {
    if (!token) return;
    setIsLoading(true);
    setShowConfirm(false);

    try {
      const res = await api.updatePassword(token, {
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword
      });

      if (res.success) {
        showToast("Kata sandi berhasil diperbarui", "success");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setTimeout(() => router.back(), 2000);
      } else {
        showToast(res.message || "Gagal memperbarui kata sandi", "error");
      }
    } catch (error) {
      console.error("Update password error:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center px-4 py-3">
        <button 
          onClick={() => router.back()} 
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-900">Ganti Kata Sandi</h1>
        <div className="w-8"></div>
      </header>

      <div className="px-4 py-6">
        <div className="bg-white w-full p-6">

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata sandi lama</label>
            <div className="relative">
              <input
                type={showOldPassword ? "text" : "password"}
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi lama"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata sandi baru</label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Masukkan kata sandi baru"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi kata sandi baru</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Ulangi kata sandi baru"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full mt-4 bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 rounded-full transition-all duration-200 disabled:bg-gray-400"
          >
            {isLoading ? "Memproses..." : "Simpan Perubahan"}
          </button>
        </form>
        </div>
      </div>

      <ConfirmDialog 
        open={showConfirm}
        title="Ganti Kata Sandi?"
        message="Apakah Anda yakin ingin mengganti kata sandi? Anda akan diminta login ulang di perangkat lain."
        onConfirm={handleConfirmSave}
        onClose={() => setShowConfirm(false)}
        loading={isLoading}
      />

      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </div>
  );
};

export default Page;
