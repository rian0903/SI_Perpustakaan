"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  BookOpen,
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  Sparkles,
  Upload,
  ArrowRight,
  ArrowLeft,
  Search,
  ChevronDown,
  HelpCircle,
  FileText,
  User,
  Building,
  Mail,
  Phone,
  Calendar,
  MapPin,
  IdCard,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  Info
} from "lucide-react";
import axios from "axios";

// Validation Schemas for Multi-Step Form
const step1Schema = z.object({
  fullName: z.string().min(3, "Nama lengkap minimal 3 karakter."),
  gender: z.enum(["Laki-laki", "Perempuan"], { required_error: "Pilih jenis kelamin." }),
  birthPlace: z.string().min(2, "Tempat lahir wajib diisi."),
  birthDate: z.string().min(1, "Tanggal lahir wajib diisi."),
  address: z.string().min(5, "Alamat lengkap minimal 5 karakter."),
  phone: z.string().min(9, "Nomor telepon/HP tidak valid (minimal 9 digit)."),
  email: z.string().email("Format alamat email tidak valid."),
});

const step2Schema = z.object({
  nik: z.string().length(16, "NIK harus tepat 16 digit angka.").regex(/^\d+$/, "NIK hanya boleh berisi angka.").optional().or(z.literal("")),
  nisn: z.string().optional(),
  institution: z.string().optional(),
  occupation: z.string().optional(),
});

const membershipSchema = step1Schema.merge(step2Schema).extend({
  agreeTerms: z.boolean().refine((val) => val === true, "Anda harus menyetujui syarat & ketentuan pendaftaran."),
});

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export default function MembershipPage() {
  const [step, setStep] = useState(1);
  const [photoUrl, setPhotoUrl] = useState("");
  const [identityCardUrl, setIdentityCardUrl] = useState("");
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingIdCard, setUploadingIdCard] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [registrationSuccess, setRegistrationSuccess] = useState(null);
  const [copiedCode, setCopiedCode] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const {
    register,
    handleSubmit,
    trigger,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(membershipSchema),
    defaultValues: {
      fullName: "",
      gender: "Laki-laki",
      birthPlace: "",
      birthDate: "",
      address: "",
      phone: "",
      email: "",
      nik: "",
      nisn: "",
      institution: "",
      occupation: "",
      agreeTerms: false,
    },
  });

  // Handle File Uploads to Backend API with Base64 Fallback
  const handleFileUpload = async (file, type) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      if (type === "photo") setUploadingPhoto(true);
      if (type === "idCard") setUploadingIdCard(true);

      const response = await axios.post(`${API_BASE_URL}/membership/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data && response.data.url) {
        if (type === "photo") setPhotoUrl(response.data.url);
        if (type === "idCard") setIdentityCardUrl(response.data.url);
        return;
      }
    } catch (err) {
      console.warn("Backend file upload failed, fallback to local Base64 string:", err.message);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result;
        if (result) {
          if (type === "photo") setPhotoUrl(result);
          if (type === "idCard") setIdentityCardUrl(result);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      if (type === "photo") setUploadingPhoto(false);
      if (type === "idCard") setUploadingIdCard(false);
    }
  };

  const nextStep = async () => {
    let isValid = false;
    if (step === 1) {
      isValid = await trigger(["fullName", "gender", "birthPlace", "birthDate", "address", "phone", "email"]);
    } else if (step === 2) {
      isValid = await trigger(["nik", "nisn", "institution", "occupation"]);
    }
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setStep((prev) => prev - 1);
  };

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSubmitError("");

    try {
      const payload = {
        fullName: data.fullName,
        gender: data.gender,
        birthPlace: data.birthPlace || undefined,
        birthDate: data.birthDate || undefined,
        address: data.address || undefined,
        phone: data.phone,
        email: data.email,
        nik: data.nik || undefined,
        nisn: data.nisn || undefined,
        institution: data.institution || undefined,
        occupation: data.occupation || undefined,
        photoUrl: photoUrl || undefined,
        identityCardUrl: identityCardUrl || undefined,
      };

      const res = await axios.post(`${API_BASE_URL}/membership`, payload);
      setRegistrationSuccess(res.data);
    } catch (err) {
      const msg = err.response?.data?.message || "Terjadi kesalahan saat memproses pendaftaran. Silakan coba lagi.";
      setSubmitError(Array.isArray(msg) ? msg.join(", ") : msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const faqs = [
    {
      q: "Apakah pendaftaran anggota ini dipungut biaya?",
      a: "Pendaftaran keanggotaan dan pencetakan kartu anggota fisik 100% GRATIS tanpa dipungut biaya apapun.",
    },
    {
      q: "Apakah kartu anggota dapat diunduh dalam bentuk digital/PDF?",
      a: "Tidak. Kartu anggota fisik WAJIB dicetak oleh petugas perpustakaan dan diambil langsung di lokasi perpustakaan untuk verifikasi identitas fisik asli.",
    },
    {
      q: "Berapa lama proses verifikasi hingga kartu siap diambil?",
      a: "Proses verifikasi oleh tim perpustakaan membutuhkan waktu 1-2 hari kerja. Notifikasi email akan otomatis dikirimkan begitu status berubah menjadi Siap Diambil.",
    },
    {
      q: "Apa saja berkas yang harus dibawa saat pengambilan kartu di perpustakaan?",
      a: "Anda wajib membawa identitas asli (KTP / Kartu Pelajar / SIM) serta menunjukkan Nomor Registrasi (REG-xxxxxx) atau Notifikasi Email kepada petugas sirkulasi.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Header / Navbar Bar */}
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

          <div className="flex items-center gap-4">
            <Link
              href="/membership/status"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
            >
              <Search className="w-4 h-4 text-slate-500" />
              Cek Status Pendaftaran
            </Link>
            <a
              href="#form-section"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all shadow-sm"
            >
              Daftar Sekarang
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 bg-white border-b border-slate-200 overflow-hidden">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-slate-100 text-slate-700 mb-6 border border-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Layanan Keanggotaan Online
          </span>

          <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.15] mb-6">
            Bergabung Jadi Anggota Resmi Perpustakaan Daerah
          </h1>

          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-normal">
            Nikmati peminjaman ribuan koleksi buku fisik, akses ruang baca eksklusif, serta fasilitas komputer & Wi-Fi gratis.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#form-section"
              className="px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-medium text-base rounded-xl transition-all shadow-md inline-flex items-center gap-2"
            >
              Isi Formulir Online <ArrowRight className="w-5 h-5" />
            </a>
            <Link
              href="/membership/status"
              className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-medium text-base rounded-xl border border-slate-300 transition-all inline-flex items-center gap-2"
            >
              <Search className="w-5 h-5 text-slate-500" /> Lacaknya Status Anda
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="py-20 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-4">
              Manfaat Keanggotaan Perpustakaan
            </h2>
            <p className="text-slate-600">
              Menjadi anggota perpustakaan membuka pintu pengetahuan tak terbatas dengan berbagai kemudahan.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Peminjaman Gratis</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Pinjam hingga 5 buku fisik secara gratis untuk jangka waktu 14 hari dengan fasilitas perpanjangan online.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Kartu Cetak Eksklusif</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kartu anggota fisik dengan nomor anggota resmi yang dicetak khusus dan dapat dipakai selamanya.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Notifikasi Otomatis Email</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Dapatkan notifikasi email langsung di setiap perubahan status pendaftaran dan jadwal peminjaman.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Form & Registration Section */}
      <section id="form-section" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-slate-900 mb-3">
              Formulir Pendaftaran Online
            </h2>
            <p className="text-slate-600">
              Silakan lengkapi 3 langkah pendaftaran di bawah ini secara cermat.
            </p>
          </div>

          {/* Registration Success Modal / Screen */}
          {registrationSuccess ? (
            <div className="bg-slate-900 text-white rounded-3xl p-8 md:p-12 shadow-2xl text-center animate-in fade-in zoom-in-95 duration-300">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <span className="inline-block px-3.5 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-semibold rounded-full uppercase tracking-wider mb-3">
                Pendaftaran Berhasil Dikirim
              </span>

              <h3 className="font-serif text-3xl font-bold mb-4">
                Selamat, {registrationSuccess.fullName}!
              </h3>

              <p className="text-slate-300 text-base max-w-lg mx-auto mb-8 leading-relaxed">
                Formulir pendaftaran Anda telah berhasil diterima. Simpan Nomor Registrasi berikut untuk melacak status verifikasi Anda.
              </p>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 max-w-md mx-auto mb-8 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-xs text-slate-400 uppercase tracking-widest block font-medium">Nomor Registrasi Anda</span>
                  <span className="font-mono text-2xl font-bold text-emerald-400 block tracking-wider">
                    {registrationSuccess.registrationNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(registrationSuccess.registrationNumber)}
                  className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                >
                  {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  {copiedCode ? "Tersalin" : "Salin"}
                </button>
              </div>

              <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-5 text-left text-sm text-slate-300 mb-8 max-w-lg mx-auto flex items-start gap-3">
                <Info className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-white block mb-1">Informasi Pengambilan Kartu:</strong>
                  Kartu anggota fisik dicetak oleh petugas dan <strong>WAJIB diambil langsung di lokasi perpustakaan</strong> setelah disetujui. Kartu tidak dapat diunduh/dikirim. Notifikasi email telah dikirimkan ke <span className="text-emerald-300 font-mono">{registrationSuccess.email}</span>.
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={`/membership/status?reg=${registrationSuccess.registrationNumber}`}
                  className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm rounded-xl transition-all inline-flex items-center gap-2"
                >
                  Pantau Status Pendaftaran <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setRegistrationSuccess(null);
                    setStep(1);
                  }}
                  className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-sm rounded-xl transition-all"
                >
                  Daftar Lagi
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-10 shadow-sm">
              {/* Stepper Progress Bar */}
              <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-6">
                <div className={`flex items-center gap-3 ${step >= 1 ? "text-slate-900" : "text-slate-400"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                    1
                  </div>
                  <span className="font-semibold text-sm hidden sm:inline">Data Pribadi</span>
                </div>

                <div className="h-0.5 flex-1 mx-4 bg-slate-200">
                  <div className={`h-full bg-slate-900 transition-all duration-300 ${step === 2 ? "w-1/2" : step === 3 ? "w-full" : "w-0"}`} />
                </div>

                <div className={`flex items-center gap-3 ${step >= 2 ? "text-slate-900" : "text-slate-400"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                    2
                  </div>
                  <span className="font-semibold text-sm hidden sm:inline">Identitas & Instansi</span>
                </div>

                <div className="h-0.5 flex-1 mx-4 bg-slate-200">
                  <div className={`h-full bg-slate-900 transition-all duration-300 ${step === 3 ? "w-full" : "w-0"}`} />
                </div>

                <div className={`flex items-center gap-3 ${step >= 3 ? "text-slate-900" : "text-slate-400"}`}>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${step === 3 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-400"}`}>
                    3
                  </div>
                  <span className="font-semibold text-sm hidden sm:inline">Upload & Persetujuan</span>
                </div>
              </div>

              {submitError && (
                <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                  <div>{submitError}</div>
                </div>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                {/* STEP 1: DATA PRIBADI */}
                {step === 1 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-slate-700" /> Langkah 1: Data Pribadi
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Nama Lengkap (Sesuai KTP) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: Ahmad Dahlan"
                        {...register("fullName")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                      />
                      {errors.fullName && <p className="text-xs text-rose-500 mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Jenis Kelamin <span className="text-rose-500">*</span>
                        </label>
                        <select
                          {...register("gender")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm bg-white"
                        >
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                        {errors.gender && <p className="text-xs text-rose-500 mt-1">{errors.gender.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Tempat Lahir <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Jakarta"
                          {...register("birthPlace")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        />
                        {errors.birthPlace && <p className="text-xs text-rose-500 mt-1">{errors.birthPlace.message}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Tanggal Lahir <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        {...register("birthDate")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm bg-white"
                      />
                      {errors.birthDate && <p className="text-xs text-rose-500 mt-1">{errors.birthDate.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Alamat Lengkap <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Nama jalan, nomor rumah, RT/RW, Kecamatan, Kota"
                        {...register("address")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                      />
                      {errors.address && <p className="text-xs text-rose-500 mt-1">{errors.address.message}</p>}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Nomor Telepon / WhatsApp <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="tel"
                          placeholder="Contoh: 081234567890"
                          {...register("phone")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        />
                        {errors.phone && <p className="text-xs text-rose-500 mt-1">{errors.phone.message}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Alamat Email (Aktif) <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="email"
                          placeholder="nama@email.com"
                          {...register("email")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        />
                        {errors.email && <p className="text-xs text-rose-500 mt-1">{errors.email.message}</p>}
                      </div>
                    </div>

                    <div className="pt-4 flex justify-end">
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all inline-flex items-center gap-2"
                      >
                        Lanjut Langkah 2 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 2: DATA IDENTITAS & INSTANSI */}
                {step === 2 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <IdCard className="w-5 h-5 text-slate-700" /> Langkah 2: Data Identitas & Pekerjaan
                    </h3>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        Nomor Induk Kependudukan (NIK - 16 Digit)
                      </label>
                      <input
                        type="text"
                        maxLength={16}
                        placeholder="3171012345678901"
                        {...register("nik")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm font-mono"
                      />
                      {errors.nik && <p className="text-xs text-rose-500 mt-1">{errors.nik.message}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-800 mb-2">
                        NISN / NIM (Bila Pelajar / Mahasiswa)
                      </label>
                      <input
                        type="text"
                        placeholder="Contoh: 0012345678"
                        {...register("nisn")}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm font-mono"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Instansi / Universitas / Sekolah
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Universitas Indonesia"
                          {...register("institution")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-slate-800 mb-2">
                          Pekerjaan / Profesi
                        </label>
                        <input
                          type="text"
                          placeholder="Contoh: Mahasiswa / PNS / Swasta"
                          {...register("occupation")}
                          className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                      </button>
                      <button
                        type="button"
                        onClick={nextStep}
                        className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm rounded-xl transition-all inline-flex items-center gap-2"
                      >
                        Lanjut Langkah 3 <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* STEP 3: UPLOAD & PERSETUJUAN */}
                {step === 3 && (
                  <div className="space-y-6 animate-in fade-in duration-200">
                    <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                      <Upload className="w-5 h-5 text-slate-700" /> Langkah 3: Unggah Berkas & Persetujuan
                    </h3>

                    <div className="grid sm:grid-cols-2 gap-6">
                      {/* Pas Foto Upload */}
                      <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-6 text-center transition-all bg-slate-50">
                        <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="block text-sm font-semibold text-slate-800 mb-1">Unggah Pas Foto Diri</span>
                        <span className="block text-xs text-slate-500 mb-4">Format JPG/PNG (Maks. 8MB)</span>

                        {photoUrl ? (
                          <div className="relative w-24 h-24 mx-auto rounded-lg overflow-hidden border border-slate-300">
                            <img src={photoUrl?.startsWith("data:") ? photoUrl : `${API_BASE_URL.replace('/api', '')}${photoUrl}`} alt="Foto Diri" className="w-full h-full object-cover" />
                            <span className="absolute bottom-0 inset-x-0 bg-emerald-600 text-white text-[10px] font-bold py-0.5">TERUNGGAH</span>
                          </div>
                        ) : (
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all">
                            {uploadingPhoto ? <Loader2 className="w-4 h-4 animate-spin text-slate-600" /> : <Upload className="w-4 h-4" />}
                            Pilih Pas Foto
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files[0], "photo")}
                            />
                          </label>
                        )}
                      </div>

                      {/* Identitas Card Upload */}
                      <div className="border-2 border-dashed border-slate-300 hover:border-slate-400 rounded-2xl p-6 text-center transition-all bg-slate-50">
                        <IdCard className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                        <span className="block text-sm font-semibold text-slate-800 mb-1">Unggah KTP / Kartu Pelajar</span>
                        <span className="block text-xs text-slate-500 mb-4">Format JPG/PNG/PDF (Maks. 8MB)</span>

                        {identityCardUrl ? (
                          <div className="py-3 px-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> Berkas Identitas Terunggah
                          </div>
                        ) : (
                          <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold transition-all">
                            {uploadingIdCard ? <Loader2 className="w-4 h-4 animate-spin text-slate-600" /> : <Upload className="w-4 h-4" />}
                            Pilih KTP/Kartu Pelajar
                            <input
                              type="file"
                              accept="image/*,application/pdf"
                              className="hidden"
                              onChange={(e) => handleFileUpload(e.target.files[0], "idCard")}
                            />
                          </label>
                        )}
                      </div>
                    </div>

                    {/* Terms Checkbox */}
                    <div className="pt-4 border-t border-slate-100">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          {...register("agreeTerms")}
                          className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 border-slate-300"
                        />
                        <span className="text-xs text-slate-600 leading-relaxed">
                          Saya menyatakan bahwa seluruh data yang diisikan adalah benar dan valid. Saya memahami bahwa <strong>kartu anggota fisik dicetak oleh petugas dan harus diambil di lokasi perpustakaan</strong>.
                        </span>
                      </label>
                      {errors.agreeTerms && <p className="text-xs text-rose-500 mt-1">{errors.agreeTerms.message}</p>}
                    </div>

                    <div className="pt-4 flex justify-between">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-sm rounded-xl transition-all inline-flex items-center gap-2"
                      >
                        <ArrowLeft className="w-4 h-4" /> Kembali
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl transition-all shadow-md inline-flex items-center gap-2 disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" /> Memproses...
                          </>
                        ) : (
                          <>
                            Kirim Pendaftaran <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-slate-900 mb-3">
              Pertanyaan Sering Diajukan (FAQ)
            </h2>
            <p className="text-slate-600">
              Hal-hal yang sering ditanyakan seputar pendaftaran keanggotaan.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden transition-all">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  className="w-full px-6 py-4 text-left font-semibold text-slate-900 flex justify-between items-center text-sm md:text-base"
                >
                  <span>{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === idx ? "rotate-180" : ""}`} />
                </button>
                {openFaq === idx && (
                  <div className="px-6 pb-5 pt-1 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs">
          <p>&copy; 2026 Perpustakaan Daerah Kota Buku. Layanan Pendaftaran Keanggotaan Digital.</p>
        </div>
      </footer>
    </div>
  );
}
