"use client";

import { CheckCircle2, X, Info, PlusCircle, PencilIcon } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function TodayPage() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  // Dummy data statis
  const card = {
    code: "Jam ke-2",
    title: "MPLB 1",
    subject: "Algoritma Pemrograman",
    range: "08:15 - 09:00",
    jp: "1 JP",
    prevNote: "Kemarin siswa kurang fokus di bagian looping. Bingung katanya",
  };

  const isOverdue = false;
  const isChecked = false;
  const absenExists = true;
  const keterangan = "Siswa aktif berdiskusi hari ini.";

  const attendance = {
    hadir: 25,
    sakit: 2,
    izin: 1,
    alfa: 0,
    total: 28,
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center px-2 pb-20">
      <div className="min-w-full mt-3">
        <p className="text-sm md:text-lg font-bold text-gray-800 mb-2 text-center">Jumat, 7 November 2025</p>

        {/* ====== Section: Card utama ====== */}
        <section className="p-3 mb-4">
          <div className="flex flex-col gap-3">
            <h2 className="font-bold">{isOverdue ? <span className="bg-red-600 text-white px-2 p-1">Kelas terlewat</span> : <span className="bg-sky-500 text-white p-1 px-2">{card.code}</span>}</h2>

            <h3 className="text-4xl font-extrabold text-gray-900">{card.title}</h3>

            <div className="flex items-center gap-2">
              <span className="bg-yellow-400 text-black px-3 py-1.5 rounded-full text-xs">{card.range}</span>
              <span className="bg-gray-700 text-white px-3 py-1.5 rounded-full text-xs">{card.jp}</span>
            </div>
          </div>

          {/* ====== Section: Tombol Absen dan Nilai ====== */}
          <section className="mt-5 border-t border-gray-200 pt-4">
            {absenExists ? (
              <div className="p-2">
                <div className="flex items-center gap-3 mb-2">
                  {/* Tombol Absen Ulang */}
                  <Link href="./attendance/" className="block w-[50%]">
                    <span className="flex items-center justify-center gap-2 rounded-md py-3 px-1 shadow font-bold text-lg text-white transition bg-yellow-500 hover:bg-yellow-400">
                      <PencilIcon className="w-5 h-5 shrink-0" />
                      Edit Absen
                    </span>
                  </Link>

                  {/* Tombol Tambah Nilai Harian */}
                  <Link href="#" className="block w-[50%]">
                    <span className="flex items-center justify-center gap-2 rounded-md py-3 px-1 shadow font-bold text-lg text-white transition bg-sky-500 hover:bg-sky-600">
                      <PlusCircle className="w-5 h-5 shrink-0" />
                      Tambah Nilai
                    </span>
                  </Link>
                </div>

                <div className="text-left text-gray-700 text-sm font-semibold mt-1 pl-1">
                  {/* Grid Utama 2 kolom */}
                  <div className="grid grid-cols-2 gap-x-5">
                    {/* Kolom 1: Grid anak 2 kolom */}
                    <div className="grid grid-cols-2 gap-y-1 gap-x-1 pr-6">
                      <p className="py-0.5 text-gray-600 rounded text-center">
                        H - <span className="text-white bg-green-600 border py-0.5 px-1 rounded-sm">{attendance.hadir}</span>
                      </p>
                      <p className="py-0.5 text-gray-600 rounded text-center">
                        S - <span className="text-white bg-yellow-500 border py-0.5 px-1 rounded-sm">{attendance.sakit}</span>
                      </p>
                      <p className="py-0.5 text-gray-600 rounded text-center">
                        I - <span className="text-white bg-sky-500 border py-0.5 px-1 rounded-sm">{attendance.izin}</span>
                      </p>
                      <p className="py-0.5 text-gray-600 rounded text-center">
                        A - <span className="text-white bg-red-600 border py-0.5 px-1 rounded-sm">{attendance.alfa}</span>
                      </p>
                    </div>

                    {/* Kolom 2: Kosong */}
                    <div></div>
                  </div>

                  {/* Total siswa */}
                  <p className="text-gray-500 mt-2 font-normal">Dari total {attendance.total} siswa</p>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                {/* Tombol Buka Absen */}
                <Link href="./attendance/" className="flex-1 block">
                  <span className="block bg-sky-500 text-white font-extrabold text-lg rounded py-3 text-center">Buka Absen</span>
                </Link>

                {/* Tombol Tambah Nilai Harian */}
                <Link href="#" className="flex-1 block">
                  <span className="flex items-center justify-center gap-2 rounded py-3 shadow font-extrabold text-lg text-white transition bg-sky-500 hover:bg-sky-600">
                    <PlusCircle className="w-5 h-5 shrink-0" />
                    Tambah Nilai
                  </span>
                </Link>
              </div>
            )}
          </section>

          {/* ====== Section: Mapel + Detail ====== */}
          <section className="mt-5 border-t border-gray-200">
            <label className="block mt-3 text-gray-700 font-semibold mb-1">Materi hari ini</label>
            <div className="flex items-center justify-between bg-gray-100 rounded py-2 px-2">
              <div className="font-bold text-lg text-black">-</div>
              <button onClick={() => setShowDetail(true)} className="text-sm bg-gray-50 hover:bg-gray-200 gap-1 flex items-center text-gray-560 border border-gray-400 rounded-md px-3 py-1.5">
                <Info /> Detail
              </button>
            </div>
          </section>

          {/* ====== Section: Catatan sebelumnya ====== */}
          <section className="bg-white mt-3 border-t border-gray-200">
            <label className="block text-gray-700 font-semibold mb-1 mt-2">Catatan sebelumnya:</label>
            <div className="bg-white p-1 border border-gray-200 rounded">
              <div className="text-gray-700 whitespace-pre-wrap leading-tight text-justify">{card.prevNote}</div>
            </div>
          </section>

          {/* ====== Section: Catatan input ====== */}
          <section className="mt-3 border-t border-gray-200 pt-3">
            <label className="block text-gray-700 font-semibold mb-1">Catatan:</label>
            <div className="bg-white p-1 border rounded">
              <textarea className="w-full focus:outline-none focus:ring-1 focus:ring-sky-400" rows={3} placeholder="Tambahkan catatan kelas hari ini..." defaultValue={keterangan} />
              <div className="text-right text-xs text-gray-500 mt-[-8]">{keterangan.length}/150</div>
            </div>
          </section>
        </section>

        {/* ====== Section: Tombol bawah ====== */}
        <section className="mt-5 border-t border-gray-200 pt-3">
          {isChecked ? (
            <div className="w-full bg-gray-100 text-center font-bold text-lg rounded-xl py-3 text-gray-800">Kelas sudah selesai</div>
          ) : (
            <>
              <button onClick={() => setShowConfirm(true)} className="w-full font-bold text-lg rounded-xl py-3 flex items-center justify-center gap-2 shadow bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-6 h-6" />
                Selesaikan Kelas
              </button>

              {!absenExists && <p className="mt-2 text-sm text-gray-400 italic text-center">Isi absen sebelum menyelesaikan kelas</p>}
            </>
          )}
        </section>
      </div>

      {/* ====== Modal Konfirmasi ====== */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowConfirm(false)} />
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-xl p-6 shadow-lg">
            <h3 className="text-lg text-center font-bold mb-4">Selesaikan kelas?</h3>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-md border border-red-600 bg-red-500 text-white hover:bg-red-600 text-sm">
                Batal
              </button>
              <button onClick={() => setShowConfirm(false)} className="px-4 py-2 rounded-md bg-green-500 hover:bg-green-600 text-white text-sm font-semibold">
                Selesaikan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== Modal Detail ====== */}
      {showDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/30 transition-opacity duration-300" onClick={() => setShowDetail(false)} />

          {/* Modal Box */}
          <div className="relative z-10 w-[90%] max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-6 md:p-7 animate-[fadeIn_0.2s_ease-out] overflow-y-auto max-h-[90vh]">
            {/* Header (TIDAK DIUBAH) */}
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-4">
              <h3 className="text-xl font-bold text-gray-800">Panduan Ajar Hari Ini</h3>
            </div>

            {/* Body (INI YANG DIUBAH) */}
            <div className="flex flex-col items-center text-center py-10 px-4 text-gray-700 space-y-5">
              {/* Icon */}
              <div className="w-24 h-24 rounded-full bg-yellow-100 flex items-center justify-center shadow-inner">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-14 h-14 text-yellow-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L4.35 17c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>

              {/* Title */}
              <h2 className="text-xl font-bold text-gray-900">Fitur Lagi dibuat</h2>

              {/* Description */}
              <p className="text-[15px] text-gray-600 leading-relaxed max-w-sm">Halaman Panduan Ajar Hari Ini belum tersedia. Lagi dibuat, sabar yaww 😘</p>

              {/* Divider */}
              <div className="w-28 h-0.5 bg-gray-200 rounded-full mt-2"></div>
            </div>

            {/* Footer (TIDAK DIUBAH) */}
            <div className="flex justify-end mt-6 pt-3 border-t border-gray-200">
              <button onClick={() => setShowDetail(false)} className="px-5 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm flex items-center font-semibold shadow-sm transition-all active:scale-[0.98]">
                <X />
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
