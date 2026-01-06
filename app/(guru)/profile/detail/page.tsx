"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Briefcase, 
  Calendar, 
  Trophy, 
  Fingerprint,
  Info,
  MapPin,
  Mail,
  Edit3
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getImageUrl } from "@/lib/api";

const ProfileDetailPage = () => {
  const router = useRouter();
  const { user, syncProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"identitas" | "kelahiran" | "kepegawaian" | "akademik">("identitas");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    syncProfile();
  }, []);

  const formatDateIndo = (dateStr: string | null | undefined) => {
    if (!dateStr) return "-";
    try {
      // Handle YYYY-MM-DD
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return dateStr;

      const months = [
        "Januari", "Februari", "Maret", "April", "Mei", "Juni",
        "Juli", "Agustus", "September", "Oktober", "November", "Desember"
      ];

      const day = date.getDate().toString().padStart(2, '0');
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    } catch (e) {
      return dateStr;
    }
  };

  const DataRow = ({ icon, label, value }: { icon: any, label: string, value: string | number | undefined | null }) => (
    <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2">
      <div className="text-gray-400 shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-sm font-medium text-gray-900 truncate">{value !== null && value !== undefined ? value : "-"}</p>
      </div>
    </div>
  );

  const tabs: {id: typeof activeTab, label: string}[] = [
    { id: "identitas", label: "Identitas" },
    { id: "kelahiran", label: "Kelahiran" },
    { id: "kepegawaian", label: "Kepegawaian" },
    { id: "akademik", label: "Akademik" },
  ];

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
        <h1 className="flex-1 text-center text-base font-bold text-gray-900">Detail Profil</h1>
        <button 
          onClick={() => router.push("/profile/edit")}
          className="flex items-center gap-1.5 px-3 py-1 text-xs text-white rounded-lg font-bold bg-sky-600 hover:bg-sky-700 transition-colors uppercase tracking-tight"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Perbarui</span>
        </button>
      </header>

      {/* Hero Profile - Simple */}
      <section className="bg-white px-6 py-6 flex items-center gap-5 border-b border-gray-100">
        <div className="w-20 h-20 bg-sky-600 rounded-lg flex items-center justify-center text-white text-3xl font-bold shrink-0 overflow-hidden">
          {user?.guru?.foto && !imageError ? (
            <img 
              src={getImageUrl(user.guru.foto) || ""} 
              alt={user.name}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            user?.name?.substring(0, 2).toUpperCase() || "..."
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">
            {(() => {
              const g = user?.guru;
              const depan = g?.gelar_depan ? g.gelar_depan + " " : "";
              const belakang = g?.gelar_belakang ? ", " + g.gelar_belakang : "";
              return `${depan}${g?.nama || user?.name || "User"}${belakang}`;
            })()}
          </h2>
          <p className="text-sm text-gray-600 mt-0.5 mb-2">
            {(user?.guru?.mapel_diampu?.length ?? 0) > 0
              ? user?.guru?.mapel_diampu?.map((m: any) => m.nama).join(", ")
              : (user?.guru?.mengajar || user?.guru?.tugas_tambahan || "Guru")}
          </p>
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
      </section>

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

      {/* Main Content Area */}
      <main className="bg-white">
        <div className="px-5 py-2">
          {activeTab === "identitas" && (
            <div className="animate-in fade-in duration-200">
              <DataRow icon={<User className="w-4 h-4"/>} label="Nama Lengkap" value={user?.guru?.nama} />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Gelar Depan" value={user?.guru?.gelar_depan} />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Gelar Belakang" value={user?.guru?.gelar_belakang} />
              <DataRow icon={<Info className="w-4 h-4"/>} label="Jenis Kelamin (jk)" value={user?.guru?.jk === "L" ? "Laki-laki" : user?.guru?.jk === "P" ? "Perempuan" : "-"} />
              <DataRow icon={<Fingerprint className="w-4 h-4"/>} label="NIK" value={user?.guru?.nik} />
              <DataRow icon={<Fingerprint className="w-4 h-4"/>} label="Kode Guru" value={user?.guru?.kode_guru} />
              <DataRow icon={<Mail className="w-4 h-4"/>} label="Email Terdaftar" value={user?.email} />
            </div>
          )}

          {activeTab === "kelahiran" && (
            <div className="animate-in fade-in duration-200">
              <DataRow icon={<MapPin className="w-4 h-4"/>} label="Tempat Lahir" value={user?.guru?.tempat_lahir} />
              <DataRow icon={<Calendar className="w-4 h-4"/>} label="Tanggal Lahir" value={formatDateIndo(user?.guru?.tanggal_lahir)} />
            </div>
          )}

          {activeTab === "kepegawaian" && (
            <div className="animate-in fade-in duration-200">
              <DataRow icon={<Fingerprint className="w-4 h-4"/>} label="NIP" value={user?.guru?.nip} />
              <DataRow icon={<Fingerprint className="w-4 h-4"/>} label="NUPTK" value={user?.guru?.nuptk} />
              <DataRow icon={<Briefcase className="w-4 h-4"/>} label="Status Kepegawaian" value={user?.guru?.status_kepegawaian} />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Jenis PTK" value={user?.guru?.jenis_ptk} />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Sertifikasi" value={user?.guru?.sertifikasi} />
              <DataRow icon={<Calendar className="w-4 h-4"/>} label="TMT Kerja" value={formatDateIndo(user?.guru?.tmt_kerja)} />
            </div>
          )}

          {activeTab === "akademik" && (
            <div className="animate-in fade-in duration-200 pb-10">
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Jenjang Terakhir" value={user?.guru?.jenjang} />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Program Studi (Prodi)" value={user?.guru?.prodi} />
              <DataRow icon={<Info className="w-4 h-4"/>} label="Keterangan Mengajar (Stat)" value={user?.guru?.mengajar} />
              <DataRow 
                icon={<Briefcase className="w-4 h-4"/>} 
                label="Mapel Diampu (Dinamis)" 
                value={
                  (user?.guru?.mapel_diampu?.length ?? 0) > 0
                    ? user?.guru?.mapel_diampu?.map((m: any) => m.nama).join(", ")
                    : "-"
                } 
              />
              <DataRow icon={<Trophy className="w-4 h-4"/>} label="Tugas Tambahan" value={user?.guru?.tugas_tambahan} />
              <DataRow icon={<Calendar className="w-4 h-4"/>} label="Jam Tugas Tambahan" value={user?.guru?.jam_tugas_tambahan} />
              <DataRow icon={<Calendar className="w-4 h-4"/>} label="JJM (Jam Mengajar)" value={user?.guru?.jjm} />
              <DataRow icon={<Calendar className="w-4 h-4"/>} label="Total JJM" value={user?.guru?.total_jjm} />
              <div className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2">
                <div className="text-gray-400 shrink-0 pt-0.5">
                  <Info className="w-4 h-4"/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Kompetensi</p>
                  <p className="text-sm font-medium text-gray-900 whitespace-pre-wrap">{user?.guru?.kompetensi || "-"}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProfileDetailPage;
