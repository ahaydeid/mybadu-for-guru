"use client";
import UnderDevelopment from "@/app/components/ui/UnderDevelopment";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const page = () => {
  const router = useRouter();
  
  return (
    <div className="bg-white min-h-screen">
      <header className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center px-4 py-3">
        <button 
          onClick={() => router.back()} 
          className="w-8 h-8 flex items-center justify-center text-gray-600 hover:text-sky-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="flex-1 text-center text-base font-bold text-gray-900">Pengaturan</h1>
        <div className="w-8"></div>
      </header>
      <UnderDevelopment />
    </div>
  );
};

export default page;