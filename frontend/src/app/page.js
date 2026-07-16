"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon, 
  MapPin, User, ChevronDown, X, Mail, Phone, Clock, Search, 
  AlertCircle, CheckCircle, ArrowUpRight, Facebook, Twitter, Instagram, 
  Youtube, Info, Award, Shield, Library, Users2, Activity, Database
} from "lucide-react";
import anime from "animejs";

// Mock Data
const MOCK_NEWS = [
  {
    id: "news-1",
    title: "Festival Literasi Kota 2026: Mengembalikan Kehangatan Membaca Buku Fisik",
    slug: "festival-literasi-kota-2026",
    content: "Festival tahunan ini diselenggarakan untuk merayakan budaya membaca. Berbagai penerbit nasional memamerkan buku-buku terbaik mereka dengan diskon khusus, disertai kelas diskusi penulisan kreatif.",
    category: "Komunitas",
    date: "12 Juli 2026",
    thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "news-2",
    title: "Implementasi Kecerdasan Buatan dalam Kategorisasi Buku Perpustakaan",
    slug: "implementasi-ai-perpustakaan",
    content: "Dalam upaya meningkatkan akurasi pencarian katalog digital perpustakaan, kami meluncurkan asisten pencarian cerdas berbasis AI yang mempermudah pengunjung menemukan referensi buku yang dicari.",
    category: "Teknologi",
    date: "28 Juni 2026",
    thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "news-3",
    title: "Donasi 1.500 Buku Langka dari Yayasan Indonesia Membaca Resmi Diterima",
    slug: "donasi-buku-langka",
    content: "Koleksi sejarah dan manuskrip kuno abad ke-18 telah disumbangkan kepada kami untuk disimpan di ruang koleksi khusus agar dapat diteliti oleh akademisi dan masyarakat umum.",
    category: "Berita",
    date: "15 Juni 2026",
    thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop"
  }
];

const MOCK_EVENTS = [
  {
    id: "event-1",
    title: "Bedah Buku: 'Dunia di Dalam Lembaran Kertas'",
    date: "25 Juli 2026",
    time: "10:00 - 12:00 WIB",
    location: "Ruang Aula Utama, Lantai 2",
    speaker: "Rian Pratama (Penulis & Kritikus Sastra)",
    capacity: 50,
    registered: 38,
    thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "event-2",
    title: "Workshop Menulis Kreatif Untuk Remaja: Menemukan Suara Tulisanmu",
    date: "02 Agustus 2026",
    time: "13:00 - 16:00 WIB",
    location: "Ruang Diskusi Kreatif 2",
    speaker: "Sinta Aulia (Novelis & Penulis Skenario)",
    capacity: 30,
    registered: 29,
    thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop"
  },
  {
    id: "event-3",
    title: "Diskusi Panel: Masa Depan Perpustakaan Sebagai Ruang Ketiga Masyarakat",
    date: "15 Agustus 2026",
    time: "09:00 - 12:00 WIB",
    location: "Teater Mini Digital",
    speaker: "Dr. Ahmad Subagyo & Tim Ahli Tata Kota",
    capacity: 100,
    registered: 45,
    thumbnail: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?q=80&w=600&auto=format&fit=crop"
  }
];

const MOCK_GALLERY = [
  { id: "gal-1", url: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=500&auto=format&fit=crop", caption: "Koleksi Sejarah Klasik" },
  { id: "gal-2", url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=500&auto=format&fit=crop", caption: "Ruang Baca Hening Utama" },
  { id: "gal-3", url: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=500&auto=format&fit=crop", caption: "Area Baca Anak-Anak" },
  { id: "gal-4", url: "https://images.unsplash.com/photo-1568667256549-094345857637?q=80&w=500&auto=format&fit=crop", caption: "Koridor Utama Sisi Timur" },
  { id: "gal-5", url: "https://images.unsplash.com/photo-1529148482759-b35b28193f5f?q=80&w=500&auto=format&fit=crop", caption: "Sudut Diskusi Komunitas" },
  { id: "gal-6", url: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=500&auto=format&fit=crop", caption: "Katalog Literatur Digital" }
];

const FAQS = [
  {
    q: "Apakah berkunjung ke perpustakaan atau mengakses portal ini dipungut biaya?",
    a: "Tidak sama sekali. Masuk ke perpustakaan fisik, membaca koleksi di tempat, menggunakan Wi-Fi, dan mengakses portal digital ini 100% gratis untuk umum."
  },
  {
    q: "Bagaimana cara menjadi anggota resmi perpustakaan?",
    a: "Pendaftaran dapat diajukan secara online dengan mengisi formulir di bagian bawah halaman ini, lalu datang ke bagian administrasi membawa KTP/Kartu Pelajar untuk pengambilan kartu fisik."
  },
  {
    q: "Apakah ada batasan usia untuk mengunjungi perpustakaan?",
    a: "Tidak ada batasan usia. Kami memiliki ruangan khusus anak-anak (Kids Zone) dan area ramah lansia dengan kursi yang nyaman serta koleksi khusus."
  }
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Search & Forms States
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("Semua");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState(null);
  const [eventRegisterForm, setEventRegisterForm] = useState({ name: "", email: "" });

  // Handle header background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Anime.js Stagger and Reveal Animations on Load
  useEffect(() => {
    anime({
      targets: ".apple-fade-up",
      opacity: [0, 1],
      translateY: [24, 0],
      delay: anime.stagger(150),
      duration: 1000,
      easing: "cubicBezier(0.15, 0.85, 0.35, 1)"
    });

    anime({
      targets: ".book-zoom-wrapper",
      opacity: [0, 1],
      scale: [0.96, 1],
      duration: 1200,
      delay: 400,
      easing: "cubicBezier(0.15, 0.85, 0.35, 1)"
    });
  }, []);

  // Event Registration Submit
  const handleRegisterEventSubmit = (e, eventId) => {
    e.preventDefault();
    if (eventRegisterForm.name && eventRegisterForm.email) {
      setRegisteredEventId(eventId);
      setEventRegisterForm({ name: "", email: "" });
      setTimeout(() => setRegisteredEventId(null), 4000);
    }
  };

  // Contact Form Submit
  const handleContactSubmit = (e) => {
    e.preventDefault();
    if (contactForm.name && contactForm.email && contactForm.message) {
      setContactSuccess(true);
      setContactForm({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setContactSuccess(false), 4000);
    }
  };

  // Filter News
  const filteredNews = MOCK_NEWS.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(newsSearch.toLowerCase()) || 
                          item.content.toLowerCase().includes(newsSearch.toLowerCase());
    const matchesCategory = selectedNewsCategory === "Semua" || item.category === selectedNewsCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex-1 flex flex-col min-h-screen relative bg-paper-100 selection:bg-primary-100 selection:text-primary-800">
      
      {/* -------------------- STICKY HEADER (Frosted Glass) -------------------- */}
      <header className={`fixed top-0 left-0 w-full h-20 z-50 transition-all duration-300 ${scrolled ? "glass-header shadow-soft" : "bg-transparent"}`}>
        <div className="chapter-container h-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft">
              <BookOpen size={18} />
            </div>
            <span className="font-navigation font-bold text-sm tracking-wider text-gray-900 uppercase">
              Digital Book Experience
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-navigation font-semibold text-gray-500 uppercase tracking-widest">
            <a href="#about" className="hover:text-primary-500 transition-colors">Tentang</a>
            <a href="#stats" className="hover:text-primary-500 transition-colors">Statistik</a>
            <a href="#news" className="hover:text-primary-500 transition-colors">Berita</a>
            <a href="#events" className="hover:text-primary-500 transition-colors">Kegiatan</a>
            <a href="#gallery" className="hover:text-primary-500 transition-colors">Galeri</a>
            <a href="#contact" className="hover:text-primary-500 transition-colors">Kontak</a>
          </nav>

          <a 
            href="#cta"
            className="px-6 py-2.5 rounded-full bg-primary-500 text-white font-navigation text-xs font-bold hover:bg-primary-600 shadow-soft transition-all"
          >
            Gabung Anggota
          </a>
        </div>
      </header>

      {/* -------------------- SECTION 1: HERO (Book Interactive Hero) -------------------- */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 relative overflow-hidden flex items-center min-h-[90vh]">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-25">
          <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-primary-100 blur-[80px]" />
          <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-gold-100 blur-[80px]" />
        </div>

        <div className="chapter-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Big Typography */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
              <div className="apple-fade-up inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold tracking-widest uppercase font-navigation">
                <Compass size={12} className="text-primary-500" />
                <span>Portal Informasi Resmi</span>
              </div>
              <h1 className="apple-fade-up text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 font-sans leading-[1.08]">
                Membuka Jendela <br />
                <span className="text-primary-500 font-display italic font-light">Pengetahuan Dunia.</span>
              </h1>
            </div>

            <p className="apple-fade-up text-base md:text-lg text-gray-500 font-sans max-w-xl leading-relaxed">
              Jelajahi dunia literasi melalui portal informasi perpustakaan kota. Nikmati pengalaman membaca digital layaknya membuka bab demi bab buku fisik yang elegan dan tenang.
            </p>

            <div className="apple-fade-up flex flex-wrap gap-4 pt-2">
              <a
                href="#about"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-500 text-white font-navigation text-xs font-bold hover:bg-primary-600 transition-all duration-300 transform hover:-translate-y-0.5 shadow-soft hover:shadow-medium"
              >
                <span>Mulai Menjelajah</span>
                <ArrowRight size={14} />
              </a>
              <a
                href="#events"
                className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gray-200 bg-white text-gray-700 font-navigation text-xs font-bold hover:border-primary-500 hover:text-primary-500 transition-all duration-300 transform hover:-translate-y-0.5 shadow-soft"
              >
                <span>Jadwal Kegiatan</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive 3D Book */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="book-zoom-wrapper opacity-0 scale-96 relative">
              {/* Tooltip hint */}
              <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-[10px] px-3 py-1.5 rounded-md shadow-md animate-bounce font-navigation whitespace-nowrap">
                Arahkan kursor untuk membuka halaman 📖
              </div>

              <div className="book-3d perspective-1500">
                {/* Spine Groove Deco */}
                <div className="book-spine-3d" />

                {/* FRONT COVER */}
                <div className="book-cover-3d bg-primary-500 flex flex-col justify-between p-8 border-l-8 border-primary-700 select-none">
                  {/* Decorative Frame */}
                  <div className="border border-white/20 h-full w-full absolute top-0 left-0 p-4 pointer-events-none">
                    <div className="border border-white/10 h-full w-full rounded-sm" />
                  </div>
                  
                  <div className="space-y-4 relative z-10">
                    <span className="text-[9px] tracking-[0.2em] text-primary-200 font-navigation font-bold uppercase">
                      Digital Book Experience
                    </span>
                    <h2 className="text-2xl font-bold text-white font-sans leading-snug">
                      Sistem Informasi <br />
                      <span className="text-gold-300 font-display italic font-light">Perpustakaan</span>
                    </h2>
                  </div>

                  <div className="border-t border-white/20 pt-6 space-y-2 relative z-10">
                    <p className="text-[10px] text-primary-100 font-navigation tracking-wider font-bold">
                      KOTA BUKU
                    </p>
                    <div className="h-1 w-12 bg-primary-300 rounded-full" />
                  </div>
                </div>

                {/* PAGES STACK (unfold on hover) */}
                <div className="book-page-3d page-1 select-none">
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-wider text-primary-500 font-bold font-navigation">Daftar Isi</span>
                    <h3 className="text-base font-bold text-gray-900 font-sans">Daftar Bab Utama</h3>
                    <ul className="text-[11px] text-gray-500 space-y-2 font-navigation">
                      <li className="flex items-center gap-1.5"><span>•</span> Bab I: Tentang Perpustakaan</li>
                      <li className="flex items-center gap-1.5"><span>•</span> Bab II: Berita & Publikasi</li>
                      <li className="flex items-center gap-1.5"><span>•</span> Bab III: Kegiatan & Agenda</li>
                      <li className="flex items-center gap-1.5"><span>•</span> Bab IV: Galeri Dokumentasi</li>
                    </ul>
                  </div>
                  <p className="text-[9px] text-gray-400 text-center font-navigation">Scroll ke bawah untuk mulai menjelajah</p>
                </div>

                <div className="book-page-3d page-2 select-none">
                  <div className="space-y-2 text-center my-auto">
                    <Compass size={24} className="mx-auto text-primary-500" />
                    <h4 className="text-xs font-bold text-gray-800 font-navigation uppercase">Mulai Menjelajah</h4>
                    <p className="text-[9px] text-gray-400 leading-relaxed">Nikmati lembaran informasi literatur digital.</p>
                  </div>
                </div>
                <div className="book-page-3d page-3 select-none" />
                <div className="book-page-3d page-4 select-none" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 2: TENTANG KAMI (Chapter I) -------------------- */}
      <section id="about" className="py-24 bg-white border-y border-gray-200/50">
        <div className="chapter-container space-y-16">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab I</span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">Tentang Perpustakaan</h2>
            <p className="text-sm text-gray-400 font-sans">Mengenal lebih dalam sejarah, visi, misi, organisasi, dan fasilitas perpustakaan kota.</p>
          </div>

          {/* Sejarah & Image */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 font-display italic">Sejarah Kehadiran Kami</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                Didirikan pada tahun 1980, perpustakaan kami awalnya hanya merupakan pojok baca kecil di tengah balai kota untuk memfasilitasi kebutuhan membaca masyarakat setempat. Seiring berjalannya waktu dan dukungan kota yang terus mengalir, kami berkembang menjadi pusat literasi digital yang modern.
              </p>
              <p className="text-sm text-gray-500 leading-relaxed font-sans">
                Kini, dengan koleksi lebih dari 25.000 literatur fisik, ribuan arsip digital, dan kerja sama e-journal internasional premium, kami melayani ribuan pengunjung aktif bulanan untuk belajar, meneliti, dan berinteraksi.
              </p>
            </div>
            <div className="lg:col-span-5 relative h-72 rounded-2xl overflow-hidden shadow-medium border border-gray-100">
              <img 
                src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop" 
                alt="Library spaces" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                <span className="text-xs text-white font-navigation font-semibold flex items-center gap-1.5">
                  <MapPin size={12} className="text-gold-300" />
                  <span>Ruang Baca Literasi Pusat</span>
                </span>
              </div>
            </div>
          </div>

          {/* Visi & Misi */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-gray-100">
            <div className="bg-paper-200 p-8 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
                <Shield size={16} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 font-display">Visi Perpustakaan</h4>
              <p className="text-xs text-gray-500 leading-relaxed font-sans">
                Menjadi episentrum ilmu pengetahuan yang dinamis, adaptif, serta inklusif untuk seluruh lapisan masyarakat, demi melahirkan generasi pembelajar yang cerdas, inovatif, dan berbudaya luhur.
              </p>
            </div>

            <div className="bg-paper-200 p-8 rounded-2xl border border-gray-100 space-y-3">
              <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center">
                <Award size={16} />
              </div>
              <h4 className="text-lg font-bold text-gray-900 font-display">Misi Perpustakaan</h4>
              <ul className="text-xs text-gray-500 leading-relaxed font-sans space-y-1.5 list-disc list-inside">
                <li>Menyediakan sarana akses literatur yang kredibel, mutakhir, dan merata.</li>
                <li>Menyelenggarakan kegiatan literasi kreatif bagi anak-anak dan generasi muda.</li>
                <li>Mengembangkan platform teknologi informasi portal digital terintegrasi.</li>
              </ul>
            </div>
          </div>

          {/* Struktur Organisasi (Simplified Cards) */}
          <div className="space-y-6 pt-8 border-t border-gray-100">
            <h4 className="text-xl font-bold text-gray-900 font-navigation text-center">Struktur Organisasi Kami</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {[
                { name: "Dr. Hendrawan Basuki", role: "Kepala Perpustakaan", desc: "Mengarahkan visi strategis literasi kota." },
                { name: "Siti Rahmawati, M.Hum", role: "Sekretaris & Operasional", desc: "Mengelola manajemen internal & kemitraan." },
                { name: "Budi Utomo, S.I.Pust", role: "Kepala Bidang Layanan & TI", desc: "Mengembangkan integrasi sistem & digitalisasi." }
              ].map((member, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-gray-150 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mx-auto text-sm font-bold">
                    {member.name[0]}
                  </div>
                  <h5 className="font-bold text-sm text-gray-900 font-navigation">{member.name}</h5>
                  <span className="text-[10px] font-bold text-primary-500 tracking-wider uppercase block">{member.role}</span>
                  <p className="text-xs text-gray-400 font-sans leading-relaxed pt-1">{member.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Fasilitas & Jam Operasional */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8 border-t border-gray-100">
            {/* Fasilitas */}
            <div className="lg:col-span-8 space-y-6">
              <h4 className="text-lg font-bold text-gray-900 font-navigation">Fasilitas Utama Pengunjung</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { title: "Quiet Zone (Ruang Sunyi)", desc: "Ruangan partisi khusus bebas bising untuk belajar mandiri dengan fokus tinggi." },
                  { title: "PC Lab & Hotspot", desc: "Akses workstation komputer gratis berkecepatan tinggi dan koneksi Wi-Fi kencang." },
                  { title: "Kids Corner & Story", desc: "Area bermain anak dengan karpet tebal, mainan edukatif, dan rak buku dongeng khusus." },
                  { title: "Mini Cafe & Lounge", desc: "Tempat bersantai yang bersih di area luar ruang baca untuk beristirahat sejenak." }
                ].map((facility, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <div className="w-6 h-6 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 text-xs font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-gray-900 font-navigation">{facility.title}</h5>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{facility.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Jam Operasional */}
            <div className="lg:col-span-4 bg-paper-200 p-6 rounded-2xl border border-gray-100 flex flex-col justify-between">
              <div className="space-y-3">
                <h4 className="text-lg font-bold text-gray-900 font-navigation flex items-center gap-1.5">
                  <Clock size={18} className="text-primary-500" />
                  <span>Jam Operasional</span>
                </h4>
                <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                  Kami menyambut kehadiran fisik Anda di gedung perpustakaan kami pada jam berikut.
                </p>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center text-xs border-b border-gray-200/50 pb-2">
                  <span className="font-navigation font-semibold text-gray-600">Senin - Jumat</span>
                  <span className="font-bold text-primary-500">08:00 - 18:00 WIB</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="font-navigation font-semibold text-gray-600">Sabtu - Minggu</span>
                  <span className="font-bold text-primary-500">09:00 - 15:00 WIB</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* -------------------- SECTION 3: STATISTIK (Black & Glow Section) -------------------- */}
      <section id="stats" className="py-16 bg-gray-900 text-white relative overflow-hidden">
        {/* Glow grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0071E3_1px,transparent_0)] bg-[size:16px_16px]" />
        
        <div className="chapter-container relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { icon: <Library size={24} />, value: "25.000+", label: "Koleksi Buku Fisik" },
              { icon: <Users2 size={24} />, value: "10.500+", label: "Anggota Terdaftar" },
              { icon: <Activity size={24} />, value: "120+", label: "Kegiatan Literasi / Tahun" },
              { icon: <Database size={24} />, value: "5.000+", label: "Akses E-Journal Gratis" }
            ].map((stat, i) => (
              <div key={i} className="space-y-2 group">
                <div className="w-10 h-10 rounded-full bg-white/5 text-primary-400 flex items-center justify-center mx-auto group-hover:scale-110 duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-bold tracking-tight text-white font-sans">
                  {stat.value}
                </div>
                <div className="text-xs text-gray-400 font-navigation font-semibold uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 4: BERITA (Chapter II) -------------------- */}
      <section id="news" className="py-24 bg-white">
        <div className="chapter-container space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab II</span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">Berita & Publikasi Literasi</h2>
            <p className="text-sm text-gray-400 font-sans">Ikuti kabar perkembangan literasi, hibah buku, dan teknologi kepustakaan terupdate.</p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-paper-200 p-4 rounded-xl border border-gray-150">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari berita..."
                value={newsSearch}
                onChange={(e) => setNewsSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 text-xs font-sans"
              />
            </div>
            {/* Category Filter */}
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
              {["Semua", "Komunitas", "Teknologi", "Berita"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedNewsCategory(cat)}
                  className={`px-4 py-1.5 rounded-full text-xs font-navigation font-semibold transition-colors cursor-pointer ${
                    selectedNewsCategory === cat
                      ? "bg-primary-500 text-white"
                      : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* News List */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredNews.length > 0 ? (
              filteredNews.map((news) => (
                <article key={news.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-soft hover:shadow-medium transition-all duration-300 flex flex-col justify-between overflow-hidden group">
                  <div className="h-48 overflow-hidden relative bg-gray-100 border-b border-gray-100">
                    <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover transform duration-500 group-hover:scale-105" />
                    <span className="absolute top-4 left-4 px-2.5 py-1 rounded-md bg-white/95 text-primary-500 text-[10px] font-bold tracking-wider font-navigation uppercase shadow-soft">
                      {news.category}
                    </span>
                  </div>
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-400 font-navigation font-bold block">{news.date}</span>
                      <h4 className="text-lg font-bold text-gray-900 font-sans leading-snug group-hover:text-primary-500 transition-colors line-clamp-2">{news.title}</h4>
                      <p className="text-xs text-gray-500 line-clamp-3 font-sans leading-relaxed">{news.content}</p>
                    </div>
                    <button className="text-xs text-primary-500 font-bold hover:text-primary-600 font-navigation flex items-center gap-1 cursor-pointer w-fit pt-2">
                      <span>Selengkapnya</span>
                      <ArrowUpRight size={14} />
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="col-span-3 text-center py-16 bg-white rounded-2xl border border-gray-100 space-y-2">
                <AlertCircle size={32} className="mx-auto text-gray-300" />
                <p className="text-sm font-semibold text-gray-400 font-navigation">Tidak ada berita yang ditemukan.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 5: EVENT / AGENDA (Chapter III) -------------------- */}
      <section id="events" className="py-24 bg-paper-200 border-y border-gray-200/30">
        <div className="chapter-container space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab III</span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">Agenda & Kegiatan Mendatang</h2>
            <p className="text-sm text-gray-400 font-sans">Ikuti berbagai program edukasi gratis, bedah buku, diskusi panel, dan workshop literasi kami.</p>
          </div>

          {/* Event Cards Stack */}
          <div className="space-y-6">
            {MOCK_EVENTS.map((event) => (
              <div key={event.id} className="bg-white rounded-2xl border border-gray-200/50 overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-4 h-48 lg:h-full relative min-h-40">
                  <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-xl font-bold text-gray-900 font-sans leading-snug">{event.title}</h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 font-sans pt-2">
                      <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary-500" /> <span>{event.date} ({event.time})</span></div>
                      <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary-500" /> <span>{event.location}</span></div>
                      <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2"><User size={14} className="text-primary-500" /> <span>Narasumber/Speaker: **{event.speaker}**</span></div>
                    </div>
                  </div>

                  {/* Register Form / Success State */}
                  <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="text-xs font-sans text-gray-400">
                      <span className="block">Kapasitas Tempat Duduk: **{event.capacity}**</span>
                      <span className="block text-primary-500 font-semibold">Telah Terdaftar: {event.registered} / {event.capacity} peserta</span>
                    </div>

                    {registeredEventId === event.id ? (
                      <div className="flex items-center gap-1.5 text-xs text-green-600 font-semibold font-navigation bg-green-50 px-4 py-2 rounded-full border border-green-200">
                        <CheckCircle size={14} />
                        <span>Pendaftaran Berhasil!</span>
                      </div>
                    ) : (
                      <form onSubmit={(e) => handleRegisterEventSubmit(e, event.id)} className="flex gap-2 w-full sm:w-auto">
                        <input 
                          type="text" 
                          placeholder="Nama Lengkap" 
                          required
                          value={eventRegisterForm.name}
                          onChange={(e) => setEventRegisterForm({...eventRegisterForm, name: e.target.value})}
                          className="px-3 py-2 border border-gray-250 rounded-lg text-xs w-full sm:w-36 focus:outline-none focus:border-primary-500 bg-paper-100" 
                        />
                        <input 
                          type="email" 
                          placeholder="Email" 
                          required
                          value={eventRegisterForm.email}
                          onChange={(e) => setEventRegisterForm({...eventRegisterForm, email: e.target.value})}
                          className="px-3 py-2 border border-gray-250 rounded-lg text-xs w-full sm:w-36 focus:outline-none focus:border-primary-500 bg-paper-100" 
                        />
                        <button type="submit" className="px-5 py-2 bg-primary-500 text-white rounded-lg text-xs font-bold font-navigation hover:bg-primary-600 cursor-pointer shrink-0">
                          Daftar Sekarang
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 6: GALERI (Chapter IV) -------------------- */}
      <section id="gallery" className="py-24 bg-white">
        <div className="chapter-container space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab IV</span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">Galeri Visual Dokumentasi</h2>
            <p className="text-sm text-gray-400 font-sans">Potret kehangatan interaksi dan kemeriahan aktivitas edukatif di perpustakaan kami.</p>
          </div>

          {/* Masonry Columns */}
          <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
            {MOCK_GALLERY.map((photo) => (
              <div key={photo.id} className="relative group overflow-hidden rounded-2xl border border-gray-250/50 shadow-soft break-inside-avoid">
                <img 
                  src={photo.url} 
                  alt={photo.caption} 
                  className="w-full h-auto object-cover transform duration-500 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                  <p className="text-xs text-white font-navigation font-semibold">{photo.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 7: FAQ (Questions) -------------------- */}
      <section className="py-24 bg-paper-200 border-y border-gray-200/30">
        <div className="chapter-container max-w-4xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Informasi Tambahan</span>
            <h2 className="text-3xl font-bold text-gray-900 font-sans">Pertanyaan yang Sering Diajukan</h2>
            <p className="text-xs text-gray-400 font-sans">Menjawab pertanyaan umum seputar akses layanan perpustakaan.</p>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-soft">
                <button
                  onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between font-navigation text-sm font-semibold text-primary-600 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown 
                    size={16} 
                    className={`text-primary-500 transition-transform duration-300 ${activeFaq === index ? "transform rotate-180" : ""}`} 
                  />
                </button>
                
                {activeFaq === index && (
                  <div className="p-5 pt-0 border-t border-gray-50 text-xs text-gray-500 leading-relaxed font-sans animate-slide-down">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 8: KONTAK & MEDSOS (Chapter V) -------------------- */}
      <section id="contact" className="py-24 bg-white">
        <div className="chapter-container space-y-12">
          {/* Header */}
          <div className="max-w-3xl space-y-3">
            <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab V</span>
            <h2 className="text-4xl font-bold tracking-tight text-gray-900 font-sans">Kontak & Lokasi</h2>
            <p className="text-sm text-gray-400 font-sans">Kirim masukan atau kunjungi sekretariat kami menggunakan peta arah di bawah.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Form Column (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 font-navigation">Form Hubungi Kami</h3>
              
              {contactSuccess ? (
                <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-2xl text-center space-y-3">
                  <CheckCircle size={36} className="mx-auto text-green-600" />
                  <h4 className="font-bold text-lg">Pesan Terkirim dengan Sukses!</h4>
                  <p className="text-xs text-green-600">Terima kasih atas masukannya. Tim administrasi perpustakaan akan membalas pesan Anda ke alamat email yang dicantumkan.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-navigation text-gray-500 font-semibold">Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-navigation text-gray-500 font-semibold">Email</label>
                      <input
                        type="email"
                        required
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-navigation text-gray-500 font-semibold">Subjek</label>
                    <input
                      type="text"
                      required
                      value={contactForm.subject}
                      onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                      className="w-full px-4 py-2.5 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-navigation text-gray-500 font-semibold">Isi Pesan</label>
                    <textarea
                      required
                      rows={5}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2.5 bg-paper-100 border border-gray-250 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-navigation text-xs font-bold tracking-wider transition-colors cursor-pointer"
                  >
                    Kirim Pesan
                  </button>
                </form>
              )}
            </div>

            {/* Map & Social Column (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-xl font-bold text-gray-900 font-navigation">Detail Kontak & Peta</h3>
              
              {/* Map Placeholder with clean design */}
              <div className="relative h-60 w-full rounded-2xl overflow-hidden border border-gray-150 bg-paper-200 flex flex-col justify-center items-center text-center p-4">
                <MapPin size={24} className="text-primary-500 animate-bounce mb-2" />
                <h5 className="font-navigation text-xs font-bold text-gray-800">Jl. Sastra Kencana No. 45, Kota Buku</h5>
                <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed pt-1">Gedung Perpustakaan Umum Sektor Sastra (Di samping Taman Kota).</p>
                <div className="mt-3 px-3 py-1 rounded bg-white text-[10px] text-primary-500 font-bold border border-primary-100 shadow-soft">
                  Lihat Rute di Google Maps
                </div>
              </div>

              {/* Direct Info */}
              <div className="bg-paper-200 p-6 rounded-2xl border border-gray-150 space-y-3 font-sans text-xs text-gray-500">
                <div className="flex items-center gap-3"><Mail size={16} className="text-primary-500" /> <span>info@perpustakaankota.go.id</span></div>
                <div className="flex items-center gap-3"><Phone size={16} className="text-primary-500" /> <span>(021) 8899-7766</span></div>
              </div>

              {/* Social Media Links */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase tracking-widest text-gray-400 font-navigation font-bold">Media Sosial Kami</h4>
                <div className="flex gap-4">
                  {[
                    { icon: <Facebook size={18} />, link: "#", color: "hover:bg-[#1877F2]" },
                    { icon: <Twitter size={18} />, link: "#", color: "hover:bg-[#1DA1F2]" },
                    { icon: <Instagram size={18} />, link: "#", color: "hover:bg-[#E1306C]" },
                    { icon: <Youtube size={18} />, link: "#", color: "hover:bg-[#FF0000]" }
                  ].map((soc, idx) => (
                    <a
                      key={idx}
                      href={soc.link}
                      className={`w-10 h-10 rounded-full bg-paper-250 text-gray-500 hover:text-white flex items-center justify-center transition-all ${soc.color}`}
                    >
                      {soc.icon}
                    </a>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* -------------------- SECTION 9: CALL TO ACTION (CTA) -------------------- */}
      <section id="cta" className="py-20 bg-primary-500 text-white text-center relative overflow-hidden">
        {/* Glow overlay */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        
        <div className="chapter-container relative z-10 max-w-2xl space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold font-sans">Siap Membuka Lembaran Baru?</h2>
          <p className="text-sm text-primary-100 leading-relaxed font-sans">
            Dapatkan kartu keanggotaan perpustakaan fisik gratis untuk akses peminjaman buku penuh, ruang hening khusus, dan layanan pinjam antar koleksi khusus.
          </p>
          <div className="pt-2">
            <a 
              href="#contact"
              className="inline-flex items-center gap-1.5 px-8 py-3.5 bg-white text-primary-600 rounded-full font-navigation text-xs font-bold hover:bg-paper-100 hover:scale-105 transition-all shadow-medium"
            >
              <span>Daftar Anggota Sekarang</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </section>

      {/* -------------------- FOOTER -------------------- */}
      <footer className="bg-paper-200 border-t border-gray-250/30 py-16 text-gray-400 font-sans text-xs">
        <div className="chapter-container grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Intro */}
          <div className="space-y-4 col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 text-gray-900 font-navigation font-bold text-sm tracking-wider uppercase">
              <div className="w-7 h-7 rounded bg-primary-500 flex items-center justify-center text-white">
                <BookOpen size={14} />
              </div>
              <span>Digital Book Experience</span>
            </div>
            <p className="text-gray-500 leading-relaxed max-w-sm">
              Sistem informasi publik resmi dan ruang literasi kota yang merayakan budaya belajar dan kehangatan membaca halaman demi halaman.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-navigation font-bold text-gray-800 text-xs uppercase tracking-wider">Navigasi</h5>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#about" className="hover:text-primary-500">Bab I: Tentang Kami</a></li>
              <li><a href="#news" className="hover:text-primary-500">Bab II: Berita</a></li>
              <li><a href="#events" className="hover:text-primary-500">Bab III: Kegiatan</a></li>
              <li><a href="#gallery" className="hover:text-primary-500">Bab IV: Galeri</a></li>
            </ul>
          </div>

          {/* Legal / Info */}
          <div className="space-y-3">
            <h5 className="font-navigation font-bold text-gray-800 text-xs uppercase tracking-wider">Kontak & Admin</h5>
            <ul className="space-y-2 text-gray-500">
              <li><a href="#contact" className="hover:text-primary-500">Pusat Layanan</a></li>
              <li><span className="text-gray-400">Admin CMS: [http://localhost/admin]</span></li>
              <li><span className="text-gray-400">Database: PostgreSQL via Docker</span></li>
            </ul>
          </div>
        </div>

        <div className="chapter-container border-t border-gray-250/20 mt-12 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px]">
          <p>© 2026 Digital Book Experience. Hak Cipta Dilindungi Undang-Undang.</p>
          <div className="flex gap-4">
            <span className="hover:underline">Kebijakan Privasi</span>
            <span className="hover:underline">Syarat Ketentuan</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
