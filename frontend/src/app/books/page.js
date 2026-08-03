"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Search,
  Library,
  ArrowLeft,
  X,
  Database,
  Compass,
  CheckCircle2,
  Sparkles,
  ChevronRight
} from "lucide-react";
import axios from "axios";

const MOCK_BOOKS = [
  {
    id: "b1",
    title: "Laskar Pelangi",
    slug: "laskar-pelangi",
    author: "Andrea Hirata",
    publisher: "Bentang Pustaka",
    year: 2005,
    isbn: "978-979-3062-79-2",
    category: "Fiksi",
    description: "Kisah inspiratif tentang perjuangan 10 anak di Belitung dalam mengejar mimpi dan pendidikan di sekolah SD Muhammadiyah yang sederhana.",
    coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    stock: 5,
    available: 3,
    location: "Rak Fiksi - A01",
    isFeatured: true
  },
  {
    id: "b2",
    title: "Bumi Manusia",
    slug: "bumi-manusia",
    author: "Pramoedya Ananta Toer",
    publisher: "Lentera Dipantara",
    year: 1980,
    isbn: "978-979-97312-3-4",
    category: "Sejarah & Budaya",
    description: "Novel sejarah mahakarya berlatar era kolonial Hindia Belanda yang menceritakan pergerakan nasionalisme awal Minke dan Annelies.",
    coverUrl: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80",
    stock: 3,
    available: 2,
    location: "Rak Sejarah - B03",
    isFeatured: true
  },
  {
    id: "b3",
    title: "Filosofi Teras",
    slug: "filosofi-teras",
    author: "Henry Manampiring",
    publisher: "Kompas Gramedia",
    year: 2018,
    isbn: "978-602-4125-18-9",
    category: "Pengembangan Diri",
    description: "Penerapan filsafat Stoisisme kuno dalam kehidupan sehari-hari modern untuk mengatasi kecemasan dan emosi negatif.",
    coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80",
    stock: 6,
    available: 4,
    location: "Rak Mandiri - C02",
    isFeatured: true
  },
  {
    id: "b4",
    title: "Pemrograman Web Modern dengan React & NestJS",
    slug: "pemrograman-web-modern",
    author: "Rian Pratama",
    publisher: "Informatika Press",
    year: 2024,
    isbn: "978-623-0123-99-0",
    category: "Sains & Teknologi",
    description: "Panduan praktis dan komprehensif membangun aplikasi web fullstack berskala industri modern dari dasar hingga deployment.",
    coverUrl: "https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=600&q=80",
    stock: 4,
    available: 3,
    location: "Rak IT - D05",
    isFeatured: true
  },
  {
    id: "b5",
    title: "Sejarah Nusantara & Kerajaan Besar Aceh",
    slug: "sejarah-nusantara-aceh",
    author: "Dr. Iskandar Muda",
    publisher: "Pustaka Serambi",
    year: 2021,
    isbn: "978-602-9988-11-2",
    category: "Sejarah & Budaya",
    description: "Dokumentasi komprehensif kebudayaan, diplomasi, dan jalur perdagangan rempah di wilayah pesisir Sumatra dan Nusantara.",
    coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&w=600&q=80",
    stock: 2,
    available: 1,
    location: "Rak Aceh - B01",
    isFeatured: false
  }
];

const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

export default function BooksPage() {
  const [booksList, setBooksList] = useState(MOCK_BOOKS);
  const [bookSearch, setBookSearch] = useState("");
  const [selectedBookCategory, setSelectedBookCategory] = useState("Semua");
  const [selectedBookDetail, setSelectedBookDetail] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";
        const res = await axios.get(`${apiUrl}/cms/books`);
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setBooksList(res.data);
        }
      } catch (err) {
        console.log("Using initial books seed");
      }
    };
    fetchBooks();
  }, []);

  const filteredBooks = booksList.filter((item) => {
    const q = bookSearch.toLowerCase();
    const matchesSearch =
      !q ||
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.author && item.author.toLowerCase().includes(q)) ||
      (item.isbn && item.isbn.toLowerCase().includes(q)) ||
      (item.publisher && item.publisher.toLowerCase().includes(q));
    const matchesCategory = selectedBookCategory === "Semua" || item.category === selectedBookCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex flex-col justify-between">
      {/* Header Navbar */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-xl shadow-md">
              <BookOpen size={20} />
            </div>
            <div>
              <span className="font-navigation font-bold text-lg tracking-tight text-slate-900 block leading-tight">
                Perpustakaan Daerah
              </span>
              <span className="text-xs text-slate-500 uppercase tracking-widest block font-medium">
                Katalog Koleksi Buku
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs sm:text-sm font-navigation font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all border border-slate-200/80 shadow-xs cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-slate-600" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Main Content Catalog */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8 flex-1 w-full">
        {/* Page Hero Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3 relative z-10">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-navigation font-semibold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur">
              <Library className="w-3.5 h-3.5 text-amber-400" /> Katalog Resmi Perpustakaan
            </span>
            <h1 className="text-3xl sm:text-5xl font-bold font-navigation leading-tight">
              Eksplorasi Koleksi Buku & Jurnal
            </h1>
            <p className="text-sm sm:text-base text-slate-300 font-sans leading-relaxed">
              Cari ketersediaan judul buku fisik, sinopsis lengkap, stok eksemplar, serta lokasi nomor rak secara real-time.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 text-center shrink-0 min-w-[200px] relative z-10">
            <div className="text-3xl font-bold font-navigation text-amber-400 mb-1">{booksList.length}</div>
            <div className="text-xs text-slate-200 font-navigation font-semibold">Total Koleksi Terdaftar</div>
          </div>
        </div>

        {/* Search & Category Filter Bar */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Cari judul, pengarang, ISBN..."
              value={bookSearch}
              onChange={(e) => setBookSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900/20 focus:border-slate-900 transition-all font-navigation"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {["Semua", "Fiksi", "Sains & Teknologi", "Sejarah & Budaya", "Pengembangan Diri", "Referensi"].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedBookCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-navigation font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  selectedBookCategory === cat
                    ? "bg-slate-900 text-white shadow-md"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Book Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200/80 p-16 text-center text-slate-500">
              <BookOpen size={48} className="mx-auto mb-3 opacity-30 text-slate-400" />
              <p className="font-navigation font-bold text-lg text-slate-800">Buku tidak ditemukan</p>
              <p className="text-xs text-slate-500 mt-1">Coba sesuaikan kata kunci pencarian atau kategori yang dipilih.</p>
            </div>
          ) : (
            filteredBooks.map((book) => (
              <div
                key={book.id}
                onClick={() => setSelectedBookDetail(book)}
                className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-slate-300 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer"
              >
                <div>
                  {/* Portrait Cover Frame Container */}
                  <div className="relative pt-6 pb-4 px-4 bg-gradient-to-b from-slate-100 via-slate-50 to-white border-b border-slate-100 flex items-center justify-center min-h-[250px]">
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur text-slate-800 font-navigation font-bold text-[10px] tracking-wider uppercase border border-slate-200 shadow-xs">
                        {book.category || "Umum"}
                      </span>
                    </div>

                    {/* Recommended Badge */}
                    {book.isFeatured && (
                      <div className="absolute top-3 right-3 z-10">
                        <span className="px-2 py-0.5 rounded-full bg-amber-400 text-amber-950 font-navigation font-extrabold text-[10px] uppercase shadow-xs flex items-center gap-0.5">
                          ⭐ Featured
                        </span>
                      </div>
                    )}

                    {/* Realistic Portrait 3D Book Cover Frame */}
                    <div className="relative w-36 h-52 sm:w-40 sm:h-56 rounded-r-lg rounded-l-xs overflow-hidden shadow-md group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300 bg-slate-900 border border-slate-200/60 flex shrink-0">
                      {/* 3D Spine Shadow Overlay */}
                      <div className="absolute left-0 top-0 bottom-0 w-2.5 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10 pointer-events-none" />
                      <div className="absolute left-2.5 top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none" />

                      {book.coverUrl ? (
                        <img
                          src={getImageUrl(book.coverUrl)}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-black p-3 flex flex-col justify-between text-white text-center">
                          <div className="pt-2 flex justify-center">
                            <BookOpen size={28} className="text-white/40" />
                          </div>
                          <span className="text-xs font-navigation font-bold line-clamp-3 leading-snug text-white/90">
                            {book.title}
                          </span>
                          <span className="text-[10px] font-mono text-white/60 pb-1">
                            {book.author}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Book Content */}
                  <div className="p-4 space-y-1.5">
                    <h3 className="font-navigation font-bold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-700 transition-colors">
                      {book.title}
                    </h3>

                    <div className="flex items-center gap-1 text-xs text-slate-500 font-navigation font-medium">
                      <span>Oleh:</span>
                      <strong className="text-slate-700 truncate">{book.author}</strong>
                    </div>

                    {book.publisher && (
                      <p className="text-[11px] text-slate-400 font-navigation truncate">
                        {book.publisher} {book.year ? `(${book.year})` : ""}
                      </p>
                    )}

                    {book.description && (
                      <p className="text-xs text-slate-600 line-clamp-2 pt-1 leading-relaxed font-sans">
                        {book.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="p-4 pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-auto">
                  <span className={`text-[11px] font-navigation font-bold px-2.5 py-0.5 rounded-md ${
                    (book.available ?? book.stock ?? 1) > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {(book.available ?? book.stock ?? 1) > 0 ? `Tersedia: ${book.available ?? book.stock}` : "Dipinjam"}
                  </span>

                  {book.location && (
                    <span className="text-[11px] font-navigation font-medium text-slate-500 truncate max-w-[130px]" title={book.location}>
                      📍 {book.location}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 text-center text-xs text-slate-500 font-navigation">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-slate-700" />
            <span className="font-bold text-slate-800">Perpustakaan Daerah</span>
          </div>
          <p>© 2026 Perpustakaan Daerah. Hak Cipta Dilindungi Undang-Undang.</p>
          <Link href="/" className="text-slate-700 font-bold hover:underline">
            Kembali ke Beranda →
          </Link>
        </div>
      </footer>

      {/* Modal Detail Buku */}
      {selectedBookDetail && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            {/* Close button */}
            <button
              onClick={() => setSelectedBookDetail(null)}
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer z-10"
            >
              <X size={18} />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 p-6 sm:p-8">
              {/* Left Cover */}
              <div className="sm:col-span-5 flex flex-col items-center justify-center">
                <div className="relative w-48 h-72 sm:w-52 sm:h-76 rounded-r-xl rounded-l-xs overflow-hidden shadow-2xl border border-slate-200/80 bg-slate-900 flex shrink-0">
                  <div className="absolute left-0 top-0 bottom-0 w-3 bg-gradient-to-r from-black/40 via-black/10 to-transparent z-10 pointer-events-none" />
                  <div className="absolute left-3 top-0 bottom-0 w-[1px] bg-white/20 z-10 pointer-events-none" />

                  {selectedBookDetail.coverUrl ? (
                    <img
                      src={getImageUrl(selectedBookDetail.coverUrl)}
                      alt={selectedBookDetail.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-800 to-black p-4 flex flex-col justify-between text-white text-center">
                      <div className="pt-4 flex justify-center">
                        <BookOpen size={48} className="text-white/30" />
                      </div>
                      <span className="text-sm font-navigation font-bold leading-snug">{selectedBookDetail.title}</span>
                      <span className="text-xs text-white/60 font-mono pb-2">{selectedBookDetail.author}</span>
                    </div>
                  )}
                </div>
                <div className="mt-4 w-full text-center">
                  <span className={`inline-block px-3 py-1.5 rounded-xl text-xs font-navigation font-bold ${
                    (selectedBookDetail.available ?? selectedBookDetail.stock ?? 1) > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    Stok: {selectedBookDetail.available ?? selectedBookDetail.stock ?? 0} dari {selectedBookDetail.stock ?? 1} Eksemplar
                  </span>
                </div>
              </div>

              {/* Right Information */}
              <div className="sm:col-span-7 space-y-4">
                <div>
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 font-navigation font-bold text-xs uppercase tracking-wide">
                    {selectedBookDetail.category || "Umum"}
                  </span>
                  <h3 className="text-2xl font-bold font-navigation text-slate-900 mt-2 leading-snug">
                    {selectedBookDetail.title}
                  </h3>
                  <p className="text-sm font-semibold text-slate-600 font-navigation mt-1">
                    Penulis: {selectedBookDetail.author}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  {selectedBookDetail.publisher && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Penerbit:</span>
                      <span className="font-semibold text-slate-800">{selectedBookDetail.publisher}</span>
                    </div>
                  )}
                  {selectedBookDetail.year && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Tahun Terbit:</span>
                      <span className="font-semibold text-slate-800">{selectedBookDetail.year}</span>
                    </div>
                  )}
                  {selectedBookDetail.isbn && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">ISBN:</span>
                      <span className="font-mono font-semibold text-slate-800">{selectedBookDetail.isbn}</span>
                    </div>
                  )}
                  {selectedBookDetail.location && (
                    <div className="flex justify-between">
                      <span className="text-slate-500">Lokasi Rak:</span>
                      <span className="font-semibold text-slate-800">📍 {selectedBookDetail.location}</span>
                    </div>
                  )}
                </div>

                {selectedBookDetail.description && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 font-navigation mb-1">Sinopsis & Deskripsi:</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                      {selectedBookDetail.description}
                    </p>
                  </div>
                )}

                <div className="pt-2">
                  <button
                    onClick={() => setSelectedBookDetail(null)}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold font-navigation rounded-xl transition-all shadow-sm"
                  >
                    Tutup Informasi Detail
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
