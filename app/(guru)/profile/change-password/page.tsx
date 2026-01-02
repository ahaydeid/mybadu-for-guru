"use client";

import { useState } from "react";

const Page = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50 px-4">
      <div className="bg-white shadow rounded-lg w-full p-8 border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Ganti Kata Sandi</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata sandi lama</label>
            <input
              type="password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Masukkan kata sandi lama"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Kata sandi baru</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Masukkan kata sandi baru"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Konfirmasi kata sandi baru</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <button type="submit" className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200">
            Simpan Perubahan
          </button>
        </form>

        <div className="mt-6 text-gray-600 text-xs">
          <ul className="list-disc list-inside space-y-1 text-gray-500">
            <li>Minimal 8 karakter</li>
            <li>Mengandung huruf besar dan huruf kecil</li>
            <li>Mengandung minimal satu angka</li>
            <li>Mengandung minimal satu simbol (contoh: !, @, #, $)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Page;
