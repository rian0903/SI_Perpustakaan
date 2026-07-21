"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Mail, Lock, AlertCircle, Loader2, Eye, EyeOff } from "lucide-react";
import axios from "axios";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
          name: "Super Admin",
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
          name: "Admin Sastra",
          role: "ADMIN",
        };
        localStorage.setItem("admin_token", "mock-jwt-token-67890");
        localStorage.setItem("admin_user", JSON.stringify(mockUser));
        localStorage.setItem("offline_mode", "true");
        
        router.push("/admin/dashboard");
      } else {
        const message = err.response?.data?.message || "Email atau password yang Anda masukkan salah.";
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-100 p-6 relative overflow-hidden">
      {/* Very soft decorative background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 30% 20%, rgba(0,91,172,0.05) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(244,180,0,0.03) 0%, transparent 60%)"
        }}
      />

      {/* Login card */}
      <div className="w-full max-w-md bg-white rounded-2xl border border-border-200 shadow-large p-8 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          {/* Logo mark */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-500 shadow-medium mx-auto">
            <BookOpen size={28} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-heading font-navigation">CMS Perpustakaan</h1>
            <p className="text-sm text-muted mt-1">Masuk untuk mengelola konten website</p>
          </div>
        </div>

        {/* Blue accent line */}
        <div className="h-1 w-full rounded-full bg-primary-500 mb-8" style={{ background: "linear-gradient(90deg, #005BAC, #0077D9)" }} />

        {/* Error alert */}
        {error && (
          <div className="bg-danger-50 border border-danger-500/30 text-danger-700 p-4 rounded-xl flex gap-3 items-start mb-6" role="alert">
            <AlertCircle size={16} className="text-danger-500 shrink-0 mt-0.5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email field */}
          <div className="space-y-1.5">
            <label htmlFor="login-email" className="lib-label">Email Administrator</label>
            <div className="relative flex items-center">
              {!email && (
                <Mail size={16} className="absolute left-3.5 text-muted pointer-events-none z-10" />
              )}
              <input
                id="login-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@domain.go.id"
                className="lib-input"
                style={{ paddingLeft: email ? "14px" : "42px" }}
                autoComplete="email"
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label htmlFor="login-password" className="lib-label">Kata Sandi</label>
            <div className="relative flex items-center">
              {!password && (
                <Lock size={16} className="absolute left-3.5 text-muted pointer-events-none z-10" />
              )}
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan kata sandi Anda"
                className="lib-input"
                style={{ paddingLeft: password ? "14px" : "42px", paddingRight: "42px" }}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 text-muted hover:text-body transition-colors cursor-pointer z-10 p-1"
                aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-navigation text-sm font-bold shadow-soft hover:shadow-medium transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Memproses Masuk...</span>
              </>
            ) : (
              <span>Masuk ke Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
