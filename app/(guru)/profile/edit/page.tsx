"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Toast, { ToastType } from "../../components/ui/Toast";

const ProfileEditPage = () => {
  const router = useRouter();
  const { user, syncProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"identitas" | "kelahiran" | "kepegawaian" | "akademik">("identitas");
  const [loading, setLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState<{ open: boolean; message: string; type: ToastType }>({
    open: false,
    message: "",
    type: "success",
  });

  const showToast = (message: string, type: ToastType = "success") => {
    setToast({ open: true, message, type });
    setTimeout(() => setToast((prev) => ({ ...prev, open: false })), 3000);
  };

  useEffect(() => {
    syncProfile();
  }, []);

  const tabs: {id: typeof activeTab, label: string}[] = [
    { id: "identitas", label: "Identitas" },
    { id: "kelahiran", label: "Kelahiran" },
    { id: "kepegawaian", label: "Kepegawaian" },
    { id: "akademik", label: "Akademik" },
  ];

  const InputRow = ({ label, value, type = "text", placeholder = "", onChange }: { 
    label: string, 
    value: string | number | undefined | null, 
    type?: string,
    placeholder?: string,
    onChange?: (val: string) => void 
  }) => (
    <div className="py-3 border-b border-gray-100 last:border-0 px-2">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input 
        type={type}
        className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0 focus:ring-0 placeholder:text-gray-300"
        value={value || ""}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );

  const SelectRow = ({ label, value, options, onChange }: { 
    label: string, 
    value: string | undefined | null, 
    options: {value: string, label: string}[],
    onChange?: (val: string) => void 
  }) => (
    <div className="py-3 border-b border-gray-100 last:border-0 px-2">
      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">{label}</label>
      <select 
        className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0 focus:ring-0 appearance-none"
        value={value || ""}
        onChange={(e) => onChange?.(e.target.value)}
      >
        <option value="" disabled>Pilih {label}</option>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast("Perubahan data sedang diproses oleh sistem.", "success");
    }, 1500);
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
        <h1 className="flex-1 text-center text-base font-bold text-gray-900">Perbarui Data</h1>
      </header>

      {/* Tab Switcher - Horizontal Scroll */}
      <div className="flex bg-white border-b border-gray-100 sticky top-[53px] z-20 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[100px] py-4 text-[10px] font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab.id 
              ? "text-sky-600 border-b-2 border-sky-600" 
              : "text-gray-400"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <main className="pb-20">
        <div className="px-5 py-4">
          <div className="space-y-2">
            {activeTab === "identitas" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <InputRow label="Nama Tanpa Gelar" value={user?.guru?.nama} placeholder="Masukkan nama tanpa gelar" />
                <InputRow label="Gelar Depan" value={user?.guru?.gelar_depan} placeholder="Drs. / H. / dsb" />
                <InputRow label="Gelar Belakang" value={user?.guru?.gelar_belakang} placeholder="S.Pd / M.Kom / dsb" />
                <SelectRow 
                  label="Jenis Kelamin" 
                  value={user?.guru?.jk} 
                  options={[
                    {value: "L", label: "Laki-laki"},
                    {value: "P", label: "Perempuan"}
                  ]} 
                />
                <InputRow label="NIK (Nomor Induk Kependudukan)" value={user?.guru?.nik} type="number" placeholder="16 digit NIK" />
                <InputRow label="Username (Kode Guru)" value={user?.username} placeholder="GR-XXXX" />
                <InputRow label="Email" value={user?.email} type="email" placeholder="contoh@alamat.com" />
              </div>
            )}

            {activeTab === "kelahiran" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <InputRow label="Tempat Lahir" value={user?.guru?.tempat_lahir} placeholder="Kota/Kabupaten kelahiran" />
                <InputRow label="Tanggal Lahir" value={user?.guru?.tanggal_lahir} type="date" />
              </div>
            )}

            {activeTab === "kepegawaian" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <InputRow label="NIP" value={user?.guru?.nip} placeholder="Nomor Induk Pegawai" />
                <InputRow label="NUPTK" value={user?.guru?.nuptk} placeholder="Nomor Unik Pendidik" />
                <InputRow label="Status Kepegawaian" value={user?.guru?.status_kepegawaian} placeholder="GTY / PNS / Honor / dsb" />
                <InputRow label="Jenis PTK" value={user?.guru?.jenis_ptk} placeholder="Guru Mapel / Guru Kelas / dsb" />
                <InputRow label="TMT Kerja" value={user?.guru?.tmt_kerja} type="date" />
              </div>
            )}

            {activeTab === "akademik" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
                <InputRow label="Jenjang Terakhir" value={user?.guru?.jenjang} placeholder="D3 / S1 / S2 / dsb" />
                <InputRow label="Program Studi (Prodi)" value={user?.guru?.prodi} placeholder="Jurusan kuliah" />
                <InputRow label="Keterangan Mengajar (Stat)" value={user?.guru?.mengajar} placeholder="Misal: Mengajar Produktif TKJ" />
                <InputRow label="Tugas Tambahan" value={user?.guru?.tugas_tambahan} placeholder="Wali Kelas / Kepala Lab / dsb" />
                <InputRow label="JJM (Jam Mengajar)" value={user?.guru?.jjm} type="number" />
                <InputRow label="Total JJM" value={user?.guru?.total_jjm} type="number" />

                <div className="mt-10">
                  <button 
                    onClick={handleSave}
                    disabled={loading}
                    className={`w-full flex items-center justify-center gap-3 py-3 rounded-full transition-all active:scale-95 ${
                      loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-700 text-white'
                    }`}
                  >
                    {loading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    <span className="font-bold">Simpan Perubahan</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </div>
  );
};

export default ProfileEditPage;
