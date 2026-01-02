"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <main className="w-full max-w-md px-4 sm:px-6 pt-12 pb-6">
        <header className="flex items-center gap-3 px-2 mb-8 justify-center">
          <div className="flex items-center gap-3">
            {/* Gambar logo di sisi kiri */}
            <Image src="/img/albadar.png" alt="Logo Al Badar" width={48} height={48} className="object-contain rounded-md" priority />

            {/* Teks di kanan logo */}
            <div className="leading-tight text-center sm:text-left">
              <div className="text-xl font-extrabold text-sky-600">My Badar</div>
              <div className="text-lg font-semibold text-gray-900">SMKS Al Badar Dangdeur</div>
            </div>
          </div>
        </header>

        <section className="bg-white rounded-lg shadow border border-gray-100 mt-6 p-6 sm:p-8">
          <h1 className="text-center text-2xl font-extrabold tracking-tight text-gray-800 mb-6">Login</h1>

          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition duration-150"
                placeholder="example@mail.id"
                type="email"
                autoComplete="email"
              />
            </div>

            <div className="relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 pr-12 transition duration-150"
                placeholder="********"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 pt-8 text-gray-500 hover:text-sky-600 transition"
                aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.046.165-2.05.471-3.002M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div>
              <button type="button" className="w-full bg-sky-600 text-white font-bold rounded-full py-3 shadow-md hover:bg-sky-700 transition duration-200">
                Login
              </button>
            </div>

            <div className="text-sm italic text-center text-gray-500">
              <Link href="https://ahadi.my.id" className="hover:text-sky-600 transition">
                Lupa password?
              </Link>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
