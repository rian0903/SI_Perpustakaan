"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  Clock,
  Printer,
  MapPin,
  XCircle,
  ArrowLeft,
  Info,
  Calendar,
  User,
  ShieldCheck,
  Loader2,
  AlertCircle,
  Copy,
  Check
} from "lucide-react";
import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

function StatusContent() {
  const searchParams = useSearchParams();
  const regFromUrl = searchParams.get("reg") || "";

  const [registrationNumber, setRegistrationNumber] = useState(regFromUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [membershipData, setMembershipData] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchStatus = async (regNo) => {
    if (!regNo || !regNo.trim()) return;
    setLoading(true);
    setError("");
    setMembershipData(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/membership/status/${regNo.trim()}`);
      setMembershipData(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Nomor registrasi tidak ditemukan dalam sistem.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (regFromUrl) {
      setRegistrationNumber(regFromUrl);
      fetchStatus(regFromUrl);
    }
  }, [regFromUrl]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchStatus(registrationNumber);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getTimelineSteps = (status) => {
    const isRejected = status === "REJECTED";

    return [
      {
        key: "PENDING",
        label: "Verifikasi Berkas",
        desc: "Pendaftaran diterima & dalam proses verifikasi tim",
        completed: status === "PENDING" || status === "APPROVED" || status === "READY_FOR_PICKUP" || status === "ACTIVE",
        active: status === "PENDING",
        icon: Clock,
      },
      {
        key: "APPROVED",
        label: "Disetujui & Cetak Kartu",
        desc: "Verifikasi berhasil & kartu fisik dalam antrean cetak",
        completed: status === "APPROVED" || status === "READY_FOR_PICKUP" || status === "ACTIVE",
        active: status === "APPROVED",
        icon: Printer,
      },
      {
        key: "READY_FOR_PICKUP",
        label: "Siap Diambil",
        desc: "Kartu fisik selesai dicetak & siap diambil di perpustakaan",
        completed: status === "READY_FOR_PICKUP" || status === "ACTIVE",
        active: status === "READY_FOR_PICKUP",
        icon: MapPin,
      },
      {
        key: "ACTIVE",
        label: "Kartu Aktif",
        desc: "Kartu fisik telah diambil & keanggotaan aktif",
        completed: status === "ACTIVE",
        active: status === "ACTIVE",
        icon: CheckCircle2,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-xl shadow-md">
              P
            </div>
            <div>
              <span className="font-serif font-bold text-xl tracking-tight text-slate-900 block leading-tight">
                Perpustakaan
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest block font-medium">
                Kota Buku
              </span>
            </div>
          </Link>

          <Link
            href="/membership"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Formulir Pendaftaran
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-6 pt-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 mb-3 border border-slate-200">
            <Search className="w-3.5 h-3.5 text-slate-600" /> Pelacakan Online
          </span>
          <h1 className="font-serif text-3xl md:text-5xl font-bold text-slate-900 mb-4">
            Cek Status Pendaftaran Keanggotaan
          </h1>
          <p className="text-slate-600 max-w-xl mx-auto text-sm md:text-base">
            Masukkan Nomor Registrasi pendaftaran Anda (Contoh: REG-2026-000001) untuk melihat progres verifikasi.
          </p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-10 max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Masukkan Nomor Registrasi (REG-XXXXXX)"
                value={registrationNumber}
                onChange={(e) => setRegistrationNumber(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-900 text-sm font-mono tracking-wider"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !registrationNumber.trim()}
              className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all inline-flex items-center gap-2 disabled:opacity-50 shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Cek Status"}
            </button>
          </form>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl max-w-2xl mx-auto mb-10 flex items-center gap-4 animate-in fade-in">
            <AlertCircle className="w-6 h-6 text-rose-500 shrink-0" />
            <div>
              <strong className="block text-sm font-bold mb-0.5">Pencarian Gagal</strong>
              <p className="text-xs text-rose-600">{error}</p>
            </div>
          </div>
        )}

        {/* Status Result Details */}
        {membershipData && (
          <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm animate-in fade-in zoom-in-95 duration-300">
            {/* Header info card */}
            <div className="flex flex-wrap items-center justify-between border-b border-slate-100 pb-6 mb-8 gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-widest block font-medium">Pendaftar</span>
                <h2 className="font-serif text-2xl font-bold text-slate-900">{membershipData.fullName}</h2>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">Nomor Registrasi</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-800 text-sm">{membershipData.registrationNumber}</span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(membershipData.registrationNumber)}
                      className="text-slate-400 hover:text-slate-700"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {membershipData.membershipNumber && (
                  <div className="bg-sky-50 border border-sky-200 px-4 py-2 rounded-xl text-right">
                    <span className="text-[10px] text-sky-600 uppercase tracking-widest block font-medium">Nomor Anggota</span>
                    <span className="font-mono font-bold text-sky-800 text-sm">{membershipData.membershipNumber}</span>
                  </div>
                )}
              </div>
            </div>

            {/* If Rejected */}
            {membershipData.status === "REJECTED" ? (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 mb-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-600 flex items-center justify-center shrink-0">
                    <XCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 bg-rose-200 text-rose-800 font-bold text-xs rounded-full uppercase tracking-wider mb-2">
                      Pendaftaran Tidak Disetujui (REJECTED)
                    </span>
                    <h3 className="font-serif text-lg font-bold text-slate-900 mb-2">Catatan Penolakan:</h3>
                    <p className="text-sm text-slate-700 bg-white/80 border border-rose-200 p-4 rounded-xl font-normal leading-relaxed">
                      {membershipData.rejectionReason || "Dokumen atau data identitas yang diunggah belum memenuhi persyaratan perpustakaan."}
                    </p>
                    <p className="text-xs text-slate-500 mt-4">
                      Silakan ajukan pendaftaran ulang melalui <Link href="/membership" className="text-slate-900 font-bold underline">Formulir Pendaftaran</Link> dengan melengkapi berkas sesuai arahan di atas.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              /* Visual Timeline Progress */
              <div className="mb-10">
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
                  Progres Pendaftaran Keanggotaan:
                </h3>

                <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-8">
                  {getTimelineSteps(membershipData.status).map((step, idx) => {
                    const IconComponent = step.icon;
                    return (
                      <div key={idx} className="relative group">
                        {/* Step Marker Dot */}
                        <div
                          className={`absolute -left-[41px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            step.completed
                              ? "bg-slate-900 text-white shadow-md ring-4 ring-slate-100"
                              : "bg-slate-100 text-slate-400 border border-slate-300"
                          }`}
                        >
                          <IconComponent className="w-4 h-4" />
                        </div>

                        <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`text-base font-bold ${step.completed ? "text-slate-900" : "text-slate-400"}`}>
                              {step.label}
                            </h4>
                            {step.active && (
                              <span className="inline-block px-2.5 py-0.5 bg-amber-100 text-amber-800 text-[11px] font-bold rounded-full animate-pulse">
                                PROSES SAAT INI
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* In-Person Card Pickup Instructions Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex items-start gap-4">
              <Info className="w-6 h-6 text-amber-700 shrink-0 mt-0.5" />
              <div className="text-xs md:text-sm text-amber-900 leading-relaxed">
                <strong className="block font-bold text-amber-950 mb-1 text-sm">
                  Ketentuan Pengambilan Kartu Anggota Fisik:
                </strong>
                Kartu anggota fisik dicetak khusus oleh petugas perpustakaan dan <strong>TIDAK DAPAT diunduh secara digital</strong>. Bila status telah berubah menjadi <strong>READY_FOR_PICKUP</strong>, silakan datang langsung ke bagian sirkulasi Perpustakaan Daerah Kota Buku dengan membawa KTP/Kartu Pelajar Asli dan menunjukkan Nomor Registrasi di atas.
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function StatusPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-slate-500">Loading...</div>}>
      <StatusContent />
    </Suspense>
  );
}
