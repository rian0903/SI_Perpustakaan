import React from "react";
import { BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="flex-1 flex flex-col justify-center min-h-screen relative overflow-hidden bg-paper-100 py-16">
      {/* Background Subtle Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
        <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-primary-100 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/10 w-96 h-96 rounded-full bg-gold-100 blur-3xl" />
      </div>

      <div className="chapter-container relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Side: Editorial Typography & Copy */}
        <div className="lg:col-span-7 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wide uppercase font-navigation">
              <BookOpen size={14} />
              <span>Bab I: Permulaan</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-primary-500 font-display leading-[1.15]">
              Membuka Lembaran Baru <br />
              <span className="text-gold-500 italic">Ilmu Pengetahuan</span>
            </h1>
          </div>

          <p className="text-lg md:text-xl text-gray-500 font-sans max-w-xl leading-relaxed">
            Selamat datang di Digital Book Experience. Portal informasi digital resmi perpustakaan kami, dirancang untuk menghadirkan pengalaman eksplorasi pengetahuan yang elegan dan menginspirasi, halaman demi halaman.
          </p>

          <div className="flex flex-wrap gap-4 pt-2">
            <a
              href="#explore"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-primary-500 text-white font-medium hover:bg-primary-600 transition-all duration-300 transform hover:-translate-y-0.5 hover:scale-[1.02] shadow-soft hover:shadow-medium font-navigation text-sm"
            >
              <span>Mulai Membaca</span>
              <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border border-gray-200 bg-white text-gray-700 font-medium hover:border-primary-500 hover:text-primary-500 transition-all duration-300 transform hover:-translate-y-0.5 font-navigation text-sm"
            >
              <span>Layanan Kami</span>
            </a>
          </div>
        </div>

        {/* Right Side: Minimal Digital Book Illustration */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-72 h-96 md:w-80 md:h-[450px] bg-primary-500 rounded-r-2xl rounded-l-md shadow-large transform rotate-3 hover:rotate-0 transition-transform duration-500 flex flex-col justify-between p-8 border-l-8 border-primary-700 overflow-hidden">
            {/* Subtle patterns on book cover */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />

            <div className="space-y-4">
              <span className="text-xs uppercase tracking-widest text-gold-300 font-navigation font-semibold">
                Edisi Digital
              </span>
              <h2 className="text-3xl font-bold text-white font-display leading-snug">
                Digital Book <br /> Experience
              </h2>
            </div>

            <div className="border-t border-white/20 pt-6 space-y-2">
              <p className="text-xs text-gold-200 font-navigation">
                Perpustakaan Umum Kota
              </p>
              <div className="h-1.5 w-12 bg-gold-400 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Access Grid / Chapter Selector */}
      <div id="explore" className="chapter-container relative z-10 mt-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-medium group">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
              <Compass size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary-500 font-display mb-3">Kegiatan & Acara</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Jelajahi berbagai agenda literasi, lokakarya, dan pameran menarik yang kami selenggarakan untuk masyarakat luas.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-medium group">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary-500 font-display mb-3">Berita Literasi</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Dapatkan berita terbaru seputar buku, dunia kepustakaan, dan perkembangan komunitas baca di sekitar kita.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg border border-gray-100 hover:border-primary-200 transition-all duration-300 hover:-translate-y-1.5 shadow-soft hover:shadow-medium group col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center mb-6 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
              <ImageIcon size={20} />
            </div>
            <h3 className="text-xl font-bold text-primary-500 font-display mb-3">Galeri Foto</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Saksikan dokumentasi visual kehangatan interaksi dan kemeriahan aktivitas literasi di sudut-sudut perpustakaan kami.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
