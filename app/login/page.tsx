"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(username, password);
      router.push("/");
    } catch (err: any) {
      const message = err.message === "Invalid credentials" 
        ? "Username atau kata sandi salah" 
        : (err.message || "Login gagal. Hubungi administrator.");
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center relative overflow-hidden font-sans pt-12 pb-8 px-6">
      {/* Decorative Background Elements (Lightweight SVGs) */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-[#8B2FFC]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-[-5%] left-[-5%] w-72 h-72 bg-[#0284c7]/5 rounded-full blur-3xl" />
      
      <main 
        className={`w-full max-w-md z-10 transition-all duration-1000 transform flex-grow flex flex-col justify-center ${
          isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center mb-5">
          <div className="relative w-20 h-20 mb-4 drop-shadow-sm">
            <Image 
              src="/img/albadar.png" 
              alt="Logo Al Badar" 
              fill 
              className="object-contain" 
              sizes="80px"
              priority 
            />
          </div>
          <div className="text-center group">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900">
              <span className="text-[#8B2FFC]">My </span>
              <span>Badar</span>
            </h1>
            <p className="text-sm font-bold text-zinc-400 uppercase tracking-widest mt-1">
              For Guru
            </p>
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-zinc-100 px-8 pb-8 py-4 shadow-2xl shadow-zinc-200/50">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-extrabold text-zinc-900">Login</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {error && (
              <div className="-mt-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                {error}
              </div>
            )}
            {/* Kode Guru Field */}
            <div className="space-y-1">
              <label htmlFor="email" className="block text-sm font-medium text-zinc-500 ml-1">
                Kode Guru
              </label>
              <div className="relative group">
                <input
                  id="email"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan kode guru"
                  className="w-full bg-transparent border-0 border-b border-zinc-200 py-3 text-zinc-900 font-medium placeholder:text-zinc-300 focus:border-[#8B2FFC] transition-all outline-none rounded-none text-sm"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label htmlFor="password" className="block text-sm font-medium text-zinc-500 ml-1">
                Password
              </label>
              <div className="relative group">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-transparent border-0 border-b border-zinc-200 pr-10 py-3 text-zinc-900 font-medium placeholder:text-zinc-300 focus:border-[#8B2FFC] transition-all outline-none rounded-none text-sm"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end pt-0.5">
              <Link href="#" className="text-xs text-[#A855F7] hover:text-[#8B2FFC] transition-colors">
                Lupa password?
              </Link>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex flex-col items-center gap-6">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-purple-600 text-white font-bold py-4 rounded-full flex items-center justify-center hover:bg-[#9333EA] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Memproses..." : "Masuk"}
              </button>
              
              <p className="text-xs font-medium text-zinc-500">
                Guru Baru? <Link href="#" className="text-[#A855F7] hover:underline">Permohonan Akun</Link>
              </p>
            </div>
          </form>
        </div>
      </main>

      {/* Footer info - Sticky to original bottom */}
      <footer className="w-full max-w-md z-10 text-center mt-auto pt-8">
        <p className="text-zinc-400 text-xs font-medium">
          SMKS Al Badar Dangdeur &copy; {new Date().getFullYear()} - by Hadi
        </p>
      </footer>
    </div>
  );
}
