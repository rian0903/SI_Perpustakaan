"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon, 
  MapPin, User, ChevronRight, X, Mail, Phone, Clock, Search, 
  AlertCircle, CheckCircle, ArrowLeft, ArrowUpRight
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
    a: "Pendaftaran dapat diajukan secara gratis dengan mengunjungi layanan informasi kami secara fisik dengan membawa KTP/Kartu Pelajar. Kartu anggota fisik akan langsung dicetak pada hari yang sama."
  },
  {
    q: "Apakah ada batasan usia untuk mengunjungi perpustakaan?",
    a: "Tidak ada batasan usia. Kami memiliki ruangan khusus anak-anak (Kids Literacy Zone) dan area ramah lansia dengan kursi yang nyaman serta koleksi khusus."
  }
];

export default function Home() {
  const [isOpened, setIsOpened] = useState(false);
  const [currentChapter, setCurrentChapter] = useState("about");
  const [activeFaq, setActiveFaq] = useState(null);
  
  // States for search and forms
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("Semua");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState(null);
  const [eventRegisterForm, setEventRegisterForm] = useState({ name: "", email: "" });

  // Anime.js Entry Animations
  useEffect(() => {
    if (!isOpened) {
      // Animate Hero typography fading in on load
      anime({
        targets: ".hero-animate-up",
        opacity: [0, 1],
        translateY: [20, 0],
        delay: anime.stagger(150),
        duration: 800,
        easing: "easeOutCubic"
      });

      anime({
        targets: ".book-perspective-wrapper",
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 1000,
        delay: 300,
        easing: "easeOutElastic(1, .8)"
      });
    } else {
      // Animate open-book pages fading in
      anime({
        targets: ".open-book-page-anim",
        opacity: [0, 1],
        translateX: [-15, 0],
        delay: anime.stagger(100),
        duration: 600,
        easing: "easeOutQuad"
      });
    }
  }, [isOpened]);

  // Open Book Action
  const handleOpenBook = (chapterId = "about") => {
    setIsOpened(true);
    setCurrentChapter(chapterId);
  };

  // Close Book Action
  const handleCloseBook = () => {
    setIsOpened(false);
  };

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
    <div className="flex-1 flex flex-col min-h-screen relative overflow-hidden bg-paper-100 selection:bg-primary-200 selection:text-primary-800">
      
      {/* -------------------- VIEW 1: HERO & CLOSE COVER -------------------- */}
      {!isOpened && (
        <main className="flex-1 flex flex-col justify-center py-12 md:py-24 relative">
          
          {/* Subtle Glows */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
            <div className="absolute top-1/6 left-1/10 w-[450px] h-[450px] rounded-full bg-primary-100 blur-[100px]" />
            <div className="absolute bottom-1/6 right-1/10 w-[450px] h-[450px] rounded-full bg-gold-100 blur-[100px]" />
          </div>

          <div className="chapter-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-8 pr-0 lg:pr-8">
              <div className="space-y-4">
                <div className="hero-animate-up opacity-0 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wider uppercase font-navigation">
                  <BookOpen size={14} />
                  <span>Bab I: Pembuka Portal</span>
                </div>
                
                <h1 className="hero-animate-up opacity-0 text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-primary-500 font-display leading-[1.12]">
                  Membuka Jendela <br />
                  <span className="text-gold-400 font-normal italic font-display">Pengetahuan Dunia</span>
                </h1>
              </div>

              <p className="hero-animate-up opacity-0 text-lg md:text-xl text-gray-500 font-sans max-w-xl leading-relaxed">
                Selamat datang di **Digital Book Experience**, portal publikasi informasi resmi perpustakaan kota. Jelajahi fasilitas, berita, galeri, dan agenda literasi terbaru halaman demi halaman.
              </p>

              <div className="hero-animate-up opacity-0 flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => handleOpenBook("about")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] shadow-soft hover:shadow-medium font-navigation text-sm cursor-pointer"
                >
                  <span>Mulai Menjelajah</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => handleOpenBook("services")}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:border-primary-500 hover:text-primary-500 transition-all duration-300 transform hover:-translate-y-0.5 font-navigation text-sm cursor-pointer"
                >
                  <span>Layanan Publik</span>
                </button>
              </div>

              {/* Quick links to categories */}
              <div className="hero-animate-up opacity-0 pt-6 border-t border-gray-200/50 flex flex-wrap gap-x-6 gap-y-3 text-sm text-gray-400 font-navigation">
                <span className="text-gray-600 font-semibold">Tautan Cepat:</span>
                <button onClick={() => handleOpenBook("news")} className="hover:text-primary-500 transition-colors">Bab II: Berita</button>
                <button onClick={() => handleOpenBook("events")} className="hover:text-primary-500 transition-colors">Bab III: Kegiatan</button>
                <button onClick={() => handleOpenBook("gallery")} className="hover:text-primary-500 transition-colors">Bab IV: Galeri</button>
              </div>
            </div>

            {/* Right Column: Interactive 3D Book */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div className="book-perspective-wrapper opacity-0 scale-95 duration-1000 relative">
                
                {/* Visual indicator / tooltip */}
                <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-primary-500 text-white text-xs px-3 py-1.5 rounded-md shadow-md animate-bounce font-navigation whitespace-nowrap">
                  Arahkan kursor / Klik untuk membuka 📖
                </div>

                <div 
                  className="book-3d perspective-1000"
                  onClick={() => handleOpenBook("about")}
                >
                  {/* Spine Deco */}
                  <div className="book-spine-3d" />

                  {/* FRONT COVER */}
                  <div className="book-cover-3d bg-primary-500 flex flex-col justify-between p-8 border-l-8 border-primary-700 select-none">
                    {/* Cover Art elements */}
                    <div className="absolute top-0 right-0 w-36 h-36 bg-white/5 rounded-full -mr-16 -mt-16 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 pointer-events-none" />
                    <div className="border border-white/20 h-full w-full absolute top-0 left-0 p-4 pointer-events-none">
                      <div className="border border-white/10 h-full w-full rounded-sm" />
                    </div>

                    <div className="space-y-4 relative z-10">
                      <span className="text-[10px] tracking-[0.25em] text-gold-300 font-navigation font-bold uppercase">
                        Digital Book Experience
                      </span>
                      <h2 className="text-3xl font-bold text-white font-display leading-[1.2]">
                        Sistem Informasi <br />
                        <span className="text-gold-400 font-normal italic font-display">Perpustakaan</span>
                      </h2>
                    </div>

                    <div className="border-t border-white/20 pt-6 space-y-2 relative z-10">
                      <p className="text-xs text-gold-200 font-navigation">
                        PORTAL RESMI DIGITAL
                      </p>
                      <div className="h-1 w-16 bg-gold-400 rounded-full" />
                    </div>
                  </div>

                  {/* PAGES STACK (Swing open on hover) */}
                  <div className="book-page-3d page-1 select-none">
                    <div className="space-y-4">
                      <span className="text-[10px] uppercase tracking-wider text-primary-500 font-semibold font-navigation">Halaman i</span>
                      <h3 className="text-lg font-bold text-primary-900 font-display">Daftar Bab Utama</h3>
                      <ul className="text-xs text-gray-600 space-y-2 font-navigation">
                        <li className="flex items-center gap-1.5"><ChevronRight size={10} className="text-gold-500" /> Bab I: Tentang Kami</li>
                        <li className="flex items-center gap-1.5"><ChevronRight size={10} className="text-gold-500" /> Bab II: Layanan Publik</li>
                        <li className="flex items-center gap-1.5"><ChevronRight size={10} className="text-gold-500" /> Bab III: Berita & Pengumuman</li>
                        <li className="flex items-center gap-1.5"><ChevronRight size={10} className="text-gold-500" /> Bab IV: Agenda Kegiatan</li>
                      </ul>
                    </div>
                    <p className="text-[9px] text-gray-400 text-center font-navigation">{"Gunakan tombol 'Mulai Menjelajah' untuk membuka penuh"}</p>
                  </div>

                  <div className="book-page-3d page-2 select-none">
                    <div className="space-y-2 text-center my-auto">
                      <Compass size={28} className="mx-auto text-gold-500" />
                      <h4 className="text-sm font-semibold text-primary-800 font-display">Jelajahi Ilmu</h4>
                      <p className="text-[10px] text-gray-500">Silakan bersantai di ruang baca hening kami yang sejuk.</p>
                    </div>
                  </div>
                  <div className="book-page-3d page-3 select-none" />
                  <div className="book-page-3d page-4 select-none" />
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* -------------------- VIEW 2: FULLY OPENED BOOK -------------------- */}
      {isOpened && (
        <main className="flex-1 flex items-center justify-center p-4 md:p-8 animate-fade-in relative z-20">
          
          {/* Close overlay/Return to Hero button */}
          <button 
            onClick={handleCloseBook}
            className="absolute top-6 right-6 md:right-12 bg-white text-gray-700 p-3 rounded-full shadow-medium hover:text-red-500 hover:shadow-large transition-all transform hover:scale-105 cursor-pointer z-30 flex items-center gap-2 font-navigation text-xs font-semibold"
          >
            <X size={16} />
            <span className="hidden sm:inline">Tutup Buku (Kembali)</span>
          </button>

          {/* Root Open Book Layout */}
          <div className="w-full max-w-[1400px] min-h-[85vh] bg-white rounded-2xl shadow-floating overflow-hidden grid grid-cols-1 lg:grid-cols-12 border border-gray-100 paper-texture">
            
            {/* LEFT COLUMN: TABLE OF CONTENTS (TOC) / INDEX SIDEBAR */}
            <div className="lg:col-span-3 bg-paper-300 border-r border-gray-200/50 p-6 md:p-8 flex flex-col justify-between">
              <div className="space-y-8">
                {/* Portal Title & Indicator */}
                <div className="space-y-2">
                  <div 
                    onClick={handleCloseBook}
                    className="inline-flex items-center gap-1.5 text-xs text-primary-600 font-semibold font-navigation hover:text-primary-800 transition-colors cursor-pointer"
                  >
                    <ArrowLeft size={12} />
                    <span>Kembali ke Cover</span>
                  </div>
                  <h2 className="text-xl font-bold text-primary-500 font-display flex items-center gap-2">
                    <BookOpen size={20} />
                    <span>Daftar Isi Portal</span>
                  </h2>
                </div>

                {/* Chapter list / Navigation buttons */}
                <nav className="space-y-2">
                  {[
                    { id: "about", label: "Tentang Perpustakaan", chapter: "Bab I" },
                    { id: "services", label: "Layanan & Fasilitas", chapter: "Bab II" },
                    { id: "news", label: "Berita & Publikasi", chapter: "Bab III" },
                    { id: "events", label: "Kegiatan & Agenda", chapter: "Bab IV" },
                    { id: "gallery", label: "Galeri Dokumentasi", chapter: "Bab V" },
                    { id: "contact", label: "Kontak & Informasi", chapter: "Bab VI" },
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setCurrentChapter(item.id)}
                      className={`w-full text-left p-3.5 rounded-lg flex items-center justify-between font-navigation text-sm font-semibold transition-all duration-300 cursor-pointer ${
                        currentChapter === item.id
                          ? "bg-primary-500 text-white shadow-soft"
                          : "bg-transparent text-gray-500 hover:bg-paper-400 hover:text-gray-800"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className={`text-[10px] uppercase font-bold tracking-wider ${currentChapter === item.id ? "text-gold-200" : "text-gray-400"}`}>
                          {item.chapter}
                        </span>
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight size={16} className={currentChapter === item.id ? "text-gold-300" : "text-gray-300"} />
                    </button>
                  ))}
                </nav>
              </div>

              {/* Sidebar Footer */}
              <div className="pt-6 border-t border-gray-200/50 space-y-2 text-center text-xs text-gray-400 font-navigation">
                <p className="font-semibold text-primary-600">Digital Book Experience v1.0</p>
                <p>© 2026 Perpustakaan Umum.</p>
              </div>
            </div>

            {/* RIGHT COLUMN: DYNAMIC CHAPTER PAGES (TOC CONTENT) */}
            <div className="lg:col-span-9 p-8 md:p-12 overflow-y-auto max-h-[85vh] bg-[#fcfcfc] flex flex-col justify-between">
              <div className="space-y-8 open-book-page-anim opacity-0">
                
                {/* -------------------- CHAPTER: ABOUT perpustakaan -------------------- */}
                {currentChapter === "about" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab I</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Lembaran Tentang Kami</h3>
                      <p className="text-sm text-gray-400 font-sans">Sejarah singkat, visi, misi, dan nilai luhur perpustakaan kita.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                      <div className="space-y-4">
                        <h4 className="text-2xl font-bold text-primary-500 font-display italic">Sejarah Kehadiran</h4>
                        <p className="text-sm text-gray-500 leading-relaxed font-sans">
                          Didirikan pada tahun 1980, perpustakaan kami awalnya hanya merupakan pojok baca kecil di tengah balai kota. Seiring waktu, komitmen kami untuk mencerdaskan masyarakat membimbing transformasi kami menjadi ruang baca modern bernuansa digital.
                        </p>
                        <p className="text-sm text-gray-500 leading-relaxed font-sans">
                          Kini, dengan koleksi lebih dari 20.000 judul literatur fisik dan akses data e-journal premium, kami menjadi pusat peradaban dan interaksi literasi kota kami.
                        </p>
                      </div>
                      <div className="relative h-64 rounded-xl overflow-hidden shadow-medium border border-gray-100">
                        <img 
                          src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop" 
                          alt="Library bookshelves"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                          <p className="text-xs text-white font-navigation font-semibold">Ruang Baca Literasi Utama</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-200/30">
                      <div className="bg-paper-300 p-6 rounded-xl border border-gray-100 space-y-2">
                        <h5 className="text-lg font-bold text-primary-500 font-display">Visi Kami</h5>
                        <p className="text-xs text-gray-600 leading-relaxed font-sans">
                          Menjadi portal pengetahuan yang hidup dan ruang interaksi literasi inklusif bagi seluruh lapisan masyarakat kota, mewujudkan masa depan cerdas bernilai luhur.
                        </p>
                      </div>
                      <div className="bg-paper-300 p-6 rounded-xl border border-gray-100 space-y-2">
                        <h5 className="text-lg font-bold text-primary-500 font-display">Misi Kami</h5>
                        <ul className="text-xs text-gray-600 space-y-1.5 font-sans list-disc list-inside">
                          <li>Menghadirkan layanan informasi literatur secara terbuka & merata.</li>
                          <li>Menggalakkan program edukatif literasi kreatif bagi remaja dan anak.</li>
                          <li>Mengembangkan integrasi portal teknologi informasi perpustakaan.</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- CHAPTER: SERVICES -------------------- */}
                {currentChapter === "services" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab II</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Layanan & Fasilitas Publik</h3>
                      <p className="text-sm text-gray-400 font-sans">Berbagai ruang ramah pengunjung dan akses literasi yang kami sediakan.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {[
                        {
                          title: "Ruang Baca Hening",
                          desc: "Ruang membaca dengan meja partisi individu yang didesain kedap suara untuk fokus belajar dan bekerja dengan nyaman.",
                          icon: "🔇"
                        },
                        {
                          title: "Akses E-Journal Premium",
                          desc: "Akses gratis ke database jurnal internasional ternama seperti ProQuest dan JSTOR menggunakan fasilitas PC perpustakaan.",
                          icon: "💻"
                        },
                        {
                          title: "Kids Zone & Storytelling",
                          desc: "Pojok baca yang nyaman dengan karpet ramah anak, mainan edukatif, dan sesi dongeng (storytelling) mingguan gratis.",
                          icon: "🧸"
                        }
                      ].map((service, index) => (
                        <div key={index} className="bg-white p-6 rounded-xl border border-gray-100 shadow-soft hover:shadow-medium transition-all duration-300 space-y-4">
                          <span className="text-3xl">{service.icon}</span>
                          <h4 className="text-lg font-bold text-primary-500 font-display">{service.title}</h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-sans">{service.desc}</p>
                        </div>
                      ))}
                    </div>

                    {/* Operational hours */}
                    <div className="bg-primary-50 border border-primary-100 p-6 rounded-xl flex flex-col md:flex-row gap-6 justify-between items-center">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-primary-700 font-display">Jam Operasional Layanan</h4>
                        <p className="text-xs text-primary-600 font-sans">Bagi pengunjung yang ingin datang membaca secara langsung ke perpustakaan.</p>
                      </div>
                      <div className="flex gap-6 text-sm font-navigation">
                        <div className="bg-white p-3 rounded-lg border border-primary-100 text-center shadow-soft min-w-32">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">Senin - Jumat</span>
                          <span className="font-bold text-primary-600">08:00 - 18:00 WIB</span>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-primary-100 text-center shadow-soft min-w-32">
                          <span className="block text-[10px] text-gray-400 uppercase font-bold">Sabtu - Minggu</span>
                          <span className="font-bold text-primary-600">09:00 - 15:00 WIB</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* -------------------- CHAPTER: NEWS -------------------- */}
                {currentChapter === "news" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab III</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Berita & Publikasi Terbaru</h3>
                      <p className="text-sm text-gray-400 font-sans">Kumpulan artikel, pengumuman, dan wawasan dunia literasi perpustakaan.</p>
                    </div>

                    {/* Search & Filter Controls */}
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-paper-300 p-4 rounded-xl border border-gray-150">
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
                            className={`px-4 py-1.5 rounded-full text-xs font-navigation font-medium transition-colors cursor-pointer ${
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

                    {/* News Grid */}
                    <div className="space-y-6">
                      {filteredNews.length > 0 ? (
                        filteredNews.map((news) => (
                          <article key={news.id} className="bg-white p-5 rounded-xl border border-gray-100 hover:border-primary-200 transition-all duration-300 shadow-soft hover:shadow-medium grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-4 h-40 rounded-lg overflow-hidden border border-gray-100">
                              <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover hover:scale-105 duration-500" />
                            </div>
                            <div className="md:col-span-8 flex flex-col justify-between py-1">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-[10px] font-navigation font-bold uppercase tracking-wider text-gray-400">
                                  <span className="px-2 py-0.5 rounded-full bg-primary-550/10 text-primary-600">{news.category}</span>
                                  <span>•</span>
                                  <span>{news.date}</span>
                                </div>
                                <h4 className="text-lg font-bold text-primary-500 font-display leading-snug">{news.title}</h4>
                                <p className="text-xs text-gray-500 line-clamp-2 font-sans leading-relaxed">{news.content}</p>
                              </div>
                              <button className="text-xs text-gold-500 font-bold hover:text-gold-600 font-navigation flex items-center gap-1 cursor-pointer pt-2 w-fit">
                                <span>Selengkapnya</span>
                                <ArrowUpRight size={14} />
                              </button>
                            </div>
                          </article>
                        ))
                      ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-gray-100 space-y-2">
                          <AlertCircle size={32} className="mx-auto text-gray-300" />
                          <p className="text-sm font-semibold text-gray-400 font-navigation">Tidak ada berita yang cocok dengan kriteria.</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* -------------------- CHAPTER: EVENTS -------------------- */}
                {currentChapter === "events" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab IV</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Agenda & Kegiatan Komunitas</h3>
                      <p className="text-sm text-gray-400 font-sans">Ikuti lokakarya literasi, diskusi buku, dan pameran interaktif yang kami selenggarakan.</p>
                    </div>

                    <div className="space-y-6">
                      {MOCK_EVENTS.map((event) => (
                        <div key={event.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 grid grid-cols-1 md:grid-cols-12">
                          <div className="md:col-span-4 h-48 md:h-full relative min-h-40 border-b md:border-b-0 md:border-r border-gray-100">
                            <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="md:col-span-8 p-6 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              <h4 className="text-xl font-bold text-primary-500 font-display leading-snug">{event.title}</h4>
                              
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-500 font-sans pt-2">
                                <div className="flex items-center gap-1.5"><Calendar size={14} className="text-gold-500" /> <span>{event.date} ({event.time})</span></div>
                                <div className="flex items-center gap-1.5"><MapPin size={14} className="text-gold-500" /> <span>{event.location}</span></div>
                                <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2"><User size={14} className="text-gold-500" /> <span>Narasumber: **{event.speaker}**</span></div>
                              </div>
                            </div>

                            {/* Registration action */}
                            <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                              <div className="text-xs font-sans text-gray-400">
                                <span className="block">Kapasitas Kursi: **{event.capacity}**</span>
                                <span className="block text-primary-600 font-semibold">Telah Terdaftar: {event.registered} / {event.capacity} peserta</span>
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
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-32 focus:outline-none focus:border-primary-500" 
                                  />
                                  <input 
                                    type="email" 
                                    placeholder="Email" 
                                    required
                                    value={eventRegisterForm.email}
                                    onChange={(e) => setEventRegisterForm({...eventRegisterForm, email: e.target.value})}
                                    className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-32 focus:outline-none focus:border-primary-500" 
                                  />
                                  <button type="submit" className="px-4 py-1.5 bg-primary-500 text-white rounded-lg text-xs font-bold font-navigation hover:bg-primary-600 cursor-pointer shrink-0">
                                    Daftar
                                  </button>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* -------------------- CHAPTER: GALLERY -------------------- */}
                {currentChapter === "gallery" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab V</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Galeri Dokumentasi Perpustakaan</h3>
                      <p className="text-sm text-gray-400 font-sans">Potret visual aktivitas literasi, koleksi buku, dan kehangatan interaksi di perpustakaan.</p>
                    </div>

                    <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                      {MOCK_GALLERY.map((photo) => (
                        <div key={photo.id} className="relative group overflow-hidden rounded-xl border border-gray-150 shadow-soft break-inside-avoid">
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
                )}

                {/* -------------------- CHAPTER: CONTACT & FAQ -------------------- */}
                {currentChapter === "contact" && (
                  <div className="space-y-8">
                    <div className="space-y-3 border-b border-gray-200/50 pb-6">
                      <span className="text-xs uppercase tracking-widest text-gold-400 font-navigation font-bold">Bab VI</span>
                      <h3 className="text-4xl font-bold text-primary-500 font-display">Kontak & Pertanyaan Umum</h3>
                      <p className="text-sm text-gray-400 font-sans">Hubungi tim informasi kami atau baca jawaban atas pertanyaan paling umum.</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      
                      {/* Left: Contact Info & Form */}
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-primary-500 font-display italic">Kirim Pesan Ke Kami</h4>
                        
                        {contactSuccess ? (
                          <div className="bg-green-50 border border-green-200 text-green-700 p-6 rounded-xl space-y-2 text-center">
                            <CheckCircle size={32} className="mx-auto text-green-600" />
                            <h5 className="font-bold text-base">Pesan Anda Berhasil Terkirim!</h5>
                            <p className="text-xs text-green-600">Terima kasih atas masukannya. Tim administrasi kami akan segera membalas email Anda.</p>
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
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
                                />
                              </div>
                              <div className="space-y-1">
                                <label className="text-xs font-navigation text-gray-500 font-semibold">Alamat Email</label>
                                <input
                                  type="email"
                                  required
                                  value={contactForm.email}
                                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                  className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
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
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans"
                              />
                            </div>

                            <div className="space-y-1">
                              <label className="text-xs font-navigation text-gray-500 font-semibold">Isi Pesan</label>
                              <textarea
                                required
                                rows={4}
                                value={contactForm.message}
                                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-primary-500 text-xs font-sans resize-none"
                              />
                            </div>

                            <button
                              type="submit"
                              className="w-full py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-navigation text-xs font-bold tracking-wider transition-colors cursor-pointer"
                            >
                              Kirim Masukan
                            </button>
                          </form>
                        )}
                      </div>

                      {/* Right: FAQ Accordions */}
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-primary-500 font-display italic">Pertanyaan Umum (FAQ)</h4>
                        
                        <div className="space-y-3">
                          {FAQS.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-soft">
                              <button
                                onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                                className="w-full text-left p-4 flex items-center justify-between font-navigation text-sm font-semibold text-primary-600 hover:bg-gray-50 transition-colors cursor-pointer"
                              >
                                <span>{faq.q}</span>
                                <ChevronRight 
                                  size={16} 
                                  className={`text-gold-500 transition-transform duration-300 ${activeFaq === index ? "transform rotate-90" : ""}`} 
                                />
                              </button>
                              
                              {activeFaq === index && (
                                <div className="p-4 pt-0 border-t border-gray-50 text-xs text-gray-500 leading-relaxed font-sans animate-slide-down">
                                  {faq.a}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Physical Address details */}
                        <div className="bg-paper-300 p-6 rounded-xl border border-gray-150 space-y-4 font-sans text-xs text-gray-500">
                          <h5 className="font-navigation text-sm font-bold text-primary-750">Sekretariat Perpustakaan</h5>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2"><MapPin size={14} className="text-gold-500" /> <span>Jl. Sastra Kencana No. 45, Kota Buku</span></div>
                            <div className="flex items-center gap-2"><Mail size={14} className="text-gold-500" /> <span>info@perpustakaankota.go.id</span></div>
                            <div className="flex items-center gap-2"><Phone size={14} className="text-gold-500" /> <span>(021) 8899-7766</span></div>
                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}

              </div>
            </div>

          </div>
        </main>
      )}

    </div>
  );
}
