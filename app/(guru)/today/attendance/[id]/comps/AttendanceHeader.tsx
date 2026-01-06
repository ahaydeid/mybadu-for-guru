import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import DateDisplay from "@/app/components/DateDisplay";

export default function AttendanceHeader({ total, filled, kelasName }: { total: number; filled: number; kelasName?: string | null }) {
  const router = useRouter();
  
  return (
    <>
      {/* ====== Consolidated Sticky Header ====== */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 py-2">
        {/* Row 1: Back & Date */}
        <div className="flex items-center mb-2">
          <div className="w-10 flex justify-start">
            <button 
              onClick={() => router.back()} 
              className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-sky-600 transition-colors -ml-2"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 text-center">
            <div className="text-[11px] font-bold text-gray-400 uppercase tracking-widest mt-1">
              <DateDisplay />
            </div>
          </div>
          <div className="w-10"></div>
        </div>

        {/* Row 2: Stats */}
        <div className="flex justify-between items-center text-sm font-semibold px-1 pb-1">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-sky-600">{filled}/{total} <span className="text-xs text-gray-400 font-normal ml-0.5">Siswa</span></span>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{kelasName || "-"}</p>
          </div>
        </div>
      </div>
    </>
  );
}
