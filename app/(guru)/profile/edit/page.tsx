"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Upload, Camera } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import Toast, { ToastType } from "../../components/ui/Toast";
import { api, getImageUrl } from "@/lib/api";

// Helper Components defined outside
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

const ProfileEditPage = () => {
  const router = useRouter();
  const { user, token, syncProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"identitas" | "kelahiran" | "kepegawaian" | "akademik">("identitas");
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState<any>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

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

  useEffect(() => {
    if (user?.guru) {
      setFormData({
        nama: user.guru.nama || "",
        nik: user.guru.nik || "",
        nip: user.guru.nip || "",
        nuptk: user.guru.nuptk || "",
        jk: user.guru.jk || "",
        tempat_lahir: user.guru.tempat_lahir || "",
        tanggal_lahir: user.guru.tanggal_lahir || "",
        status_kepegawaian: user.guru.status_kepegawaian || "",
        jenis_ptk: user.guru.jenis_ptk || "",
        gelar_depan: user.guru.gelar_depan || "",
        gelar_belakang: user.guru.gelar_belakang || "",
        jenjang: user.guru.jenjang || "",
        prodi: user.guru.prodi || "",
        sertifikasi: user.guru.sertifikasi || "",
        tmt_kerja: user.guru.tmt_kerja || "",
        tugas_tambahan: user.guru.tugas_tambahan || "",
        jam_tugas_tambahan: user.guru.jam_tugas_tambahan || "",
        mengajar: user.guru.mengajar || "",
        jjm: user.guru.jjm || "",
        total_jjm: user.guru.total_jjm || "",
        kompetensi: user.guru.kompetensi || "",
      });
      if (user.guru.foto) {
        setPhotoPreview(getImageUrl(user.guru.foto));
      }
    }
  }, [user]);

  const handleChange = (key: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        showToast("Ukuran foto maksimal 2MB", "error");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const tabs: {id: typeof activeTab, label: string}[] = [
    { id: "identitas", label: "Identitas" },
    { id: "kelahiran", label: "Kelahiran" },
    { id: "kepegawaian", label: "Kepegawaian" },
    { id: "akademik", label: "Akademik" },
  ];

  const handleSave = async () => {
    if (!token) return;
    
    // Required validations
    if (!formData.nama || !formData.nik) {
      showToast("Nama dan NIK wajib diisi", "error");
      return;
    }
    
    if (formData.nik.length !== 16) {
      showToast("NIK harus 16 digit", "error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== undefined) {
           data.append(key, formData[key]);
        }
      });

      if (photoFile) {
        data.append('foto', photoFile);
      }

      const res = await api.updateProfile(token, data);

      if (res.success) {
        showToast("Profil berhasil diperbarui", "success");
        await syncProfile();
        setTimeout(() => router.back(), 1500);
      } else {
        showToast(res.message || "Gagal memperbarui profil", "error");
      }
    } catch (error) {
      console.error("Update profile error:", error);
      showToast("Terjadi kesalahan sistem", "error");
    } finally {
      setLoading(false);
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
                {/* Foto Profile Upload */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative w-24 h-24 mb-3">
                    <div className="w-full h-full rounded-full overflow-hidden bg-gray-100 border border-gray-200">
                      {photoPreview ? (
                        <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-gray-400">
                           <Upload className="w-8 h-8" />
                         </div>
                      )}
                    </div>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-0 right-0 w-8 h-8 bg-sky-600 rounded-full flex items-center justify-center text-white border-2 border-white shadow-sm"
                    >
                      <Camera className="w-4 h-4" />
                    </button>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Ketuk ikon kamera untuk ubah foto</p>
                </div>

                <InputRow label="Nama Tanpa Gelar (Wajib)" value={formData.nama} placeholder="Masukkan nama tanpa gelar" onChange={(v) => handleChange('nama', v)} />
                <InputRow label="Gelar Depan" value={formData.gelar_depan} placeholder="Drs. / H. / dsb" onChange={(v) => handleChange('gelar_depan', v)} />
                <InputRow label="Gelar Belakang" value={formData.gelar_belakang} placeholder="S.Pd / M.Kom / dsb" onChange={(v) => handleChange('gelar_belakang', v)} />
                <SelectRow 
                  label="Jenis Kelamin" 
                  value={formData.jk} 
                  options={[
                    {value: "L", label: "Laki-laki"},
                    {value: "P", label: "Perempuan"}
                  ]} 
                  onChange={(v) => handleChange('jk', v)}
                />
                <InputRow label="NIK (Wajib 16 Digit)" value={formData.nik} type="number" placeholder="16 digit NIK" onChange={(v) => handleChange('nik', v)} />
                <div className="py-3 border-b border-gray-100 px-2 opacity-50">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Username (Kode Guru)</label>
                   <input disabled className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0" value={user?.username || ""} />
                   <p className="text-[10px] text-red-400 mt-1">*Tidak dapat diubah manual</p>
                </div>
                <div className="py-3 border-b border-gray-100 px-2 opacity-50">
                   <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Email</label>
                   <input disabled className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0" value={user?.email || ""} />
                   <p className="text-[10px] text-red-400 mt-1">*Hubungi admin untuk ubah email</p>
                </div>
              </div>
            )}

            {activeTab === "kelahiran" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <InputRow label="Tempat Lahir" value={formData.tempat_lahir} placeholder="Kota/Kabupaten kelahiran" onChange={(v) => handleChange('tempat_lahir', v)} />
                <InputRow label="Tanggal Lahir" value={formData.tanggal_lahir} type="date" onChange={(v) => handleChange('tanggal_lahir', v)} />
              </div>
            )}

            {activeTab === "kepegawaian" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300">
                <InputRow label="NIP" value={formData.nip} placeholder="Nomor Induk Pegawai" onChange={(v) => handleChange('nip', v)} />
                <InputRow label="NUPTK" value={formData.nuptk} placeholder="Nomor Unik Pendidik" onChange={(v) => handleChange('nuptk', v)} />
                <InputRow label="Status Kepegawaian" value={formData.status_kepegawaian} placeholder="GTY / PNS / Honor / dsb" onChange={(v) => handleChange('status_kepegawaian', v)} />
                <InputRow label="Jenis PTK" value={formData.jenis_ptk} placeholder="Guru Mapel / Guru Kelas / dsb" onChange={(v) => handleChange('jenis_ptk', v)} />
                <InputRow label="TMT Kerja" value={formData.tmt_kerja} type="date" onChange={(v) => handleChange('tmt_kerja', v)} />
                <InputRow label="Sertifikasi" value={formData.sertifikasi} placeholder="Sudah / Belum" onChange={(v) => handleChange('sertifikasi', v)} />
              </div>
            )}

            {activeTab === "akademik" && (
              <div className="animate-in fade-in slide-in-from-right-4 duration-300 pb-10">
                <InputRow label="Jenjang Terakhir" value={formData.jenjang} placeholder="D3 / S1 / S2 / dsb" onChange={(v) => handleChange('jenjang', v)} />
                <InputRow label="Program Studi (Prodi)" value={formData.prodi} placeholder="Jurusan kuliah" onChange={(v) => handleChange('prodi', v)} />
                <InputRow label="Keterangan Mengajar" value={formData.mengajar} placeholder="Misal: Mengajar Produktif TKJ" onChange={(v) => handleChange('mengajar', v)} />
                <InputRow label="Tugas Tambahan" value={formData.tugas_tambahan} placeholder="Wali Kelas / Kepala Lab / dsb" onChange={(v) => handleChange('tugas_tambahan', v)} />
                <InputRow label="Jam Tugas Tambahan" value={formData.jam_tugas_tambahan} type="number" onChange={(v) => handleChange('jam_tugas_tambahan', v)} />
                <InputRow label="JJM (Jam Mengajar)" value={formData.jjm} type="number" onChange={(v) => handleChange('jjm', v)} />
                <InputRow label="Total JJM" value={formData.total_jjm} type="number" onChange={(v) => handleChange('total_jjm', v)} />
                
                 <div className="py-3 border-b border-gray-100 last:border-0 px-2">
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Kompetensi</label>
                  <textarea 
                    className="w-full text-sm font-medium text-gray-900 bg-transparent border-0 p-0 focus:ring-0 placeholder:text-gray-300 min-h-[80px]"
                    value={formData.kompetensi || ""}
                    placeholder="Deskripsi kompetensi..."
                    onChange={(e) => handleChange('kompetensi', e.target.value)}
                  />
                </div>

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
