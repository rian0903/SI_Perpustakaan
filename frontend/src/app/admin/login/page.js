"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, AlertCircle, Loader2 } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    try {
      // 1. Try real backend API login
      const response = await axios.post(`${apiUrl}/auth/login`, {
        email,
        password,
      });

      const { access_token, user } = response.data;
      localStorage.setItem("admin_token", access_token);
      localStorage.setItem("admin_user", JSON.stringify(user));
      
      router.push("/admin/dashboard");
    } catch (err) {
      console.warn("Backend login failed. Falling back to offline client-side validation...");
      
      // 2. Offline Mock Fallback for testing
      if (email === "superadmin@perpustakaan.go.id" && password === "superadmin123") {
        const mockUser = {
          id: "mock-super-admin-id",
          email: "superadmin@perpustakaan.go.id",
          name: "Super Admin (Offline)",
          role: "SUPER_ADMIN",
        };
        localStorage.setItem("admin_token", "mock-jwt-token-12345");
        localStorage.setItem("admin_user", JSON.stringify(mockUser));
        localStorage.setItem("offline_mode", "true");
        
        router.push("/admin/dashboard");
      } else if (email === "admin@perpustakaan.go.id" && password === "admin123") {
        const mockUser = {
          id: "mock-admin-id",
          email: "admin@perpustakaan.go.id",
          name: "Admin Sastra (Offline)",
          role: "ADMIN",
        };
        localStorage.setItem("admin_token", "mock-jwt-token-67890");
        localStorage.setItem("admin_user", JSON.stringify(mockUser));
        localStorage.setItem("offline_mode", "true");
        
        router.push("/admin/dashboard");
      } else {
        // Show actual API error if possible, or fallback invalid credentials
        const message = err.response?.data?.message || "Email atau password yang Anda masukkan salah.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-paper-100 p-6 relative">
      {/* Background soft ambient lights */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary-100/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-gold-100/30 blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white rounded-3xl border border-gray-200/50 shadow-large p-8 md:p-10 relative z-10">
        <div className="flex flex-col items-center text-center space-y-3 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 flex items-center justify-center text-white shadow-soft">
            <BookOpen size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 font-navigation">CMS Perpustakaan</h1>
            <p className="text-xs text-gray-400 font-sans">Masuk untuk mengelola publikasi & kegiatan</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-3.5 rounded-xl text-xs flex gap-2.5 items-start mb-6">
            <AlertCircle size={16} className="text-red-500 shrink-0 pt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <label className="text-[10px] font-navigation text-gray-500 font-bold uppercase tracking-wider">Email Administrator</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-450" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.go.id"
                className="w-full pl-11 pr-4 py-3 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white text-xs font-sans transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-navigation text-gray-500 font-bold uppercase tracking-wider">Kata Sandi</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-450" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="w-full pl-11 pr-4 py-3 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 focus:bg-white text-xs font-sans transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-navigation text-xs font-bold shadow-soft hover:shadow-medium transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk Ke Dashboard</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-150 text-center">
          <p className="text-[10px] text-gray-400 font-sans">
            Gunakan akun bawaan untuk pengujian:<br />
            <span className="font-semibold text-gray-500">superadmin@perpustakaan.go.id</span> / <span className="font-semibold text-gray-500">superadmin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}
