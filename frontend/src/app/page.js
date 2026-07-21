"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon, 
  MapPin, User, ChevronDown, X, Mail, Phone, Clock, Search, 
  AlertCircle, CheckCircle, ArrowUpRight, Facebook, Twitter, Instagram, 
  Youtube, Info, Award, Shield, Library, Users2, Activity, Database
} from "lucide-react";
import axios from "axios";

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

  // Dynamic Navbar Data (from CMS)
  const [navMenu, setNavMenu] = useState([
    { id: 1, label: "Tentang", target: "#about", order: 1, active: true },
    { id: 2, label: "Statistik", target: "#stats", order: 2, active: true },
    { id: 3, label: "Berita", target: "#news", order: 3, active: true },
    { id: 4, label: "Kegiatan", target: "#events", order: 4, active: true },
    { id: 5, label: "Galeri", target: "#gallery", order: 5, active: true },
    { id: 6, label: "FAQ", target: "#faq", order: 6, active: true }
  ]);
  const [ctaButton, setCtaButton] = useState({ label: "Hubungi Kami", href: "#contact" });
  const [navLogoText, setNavLogoText] = useState("Digital Book Experience");
  const [navLogoUrl, setNavLogoUrl] = useState("");

  // Fetch navbar data from CMS API
  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

    const buildContactHref = (btn) => {
      switch (btn.platform) {
        case "whatsapp": return `https://wa.me/${btn.value}`;
        case "instagram": return `https://instagram.com/${btn.value}`;
        case "email": return `mailto:${btn.value}`;
        case "telegram": return `https://t.me/${btn.value}`;
        case "custom": return btn.value;
        default: return "#contact";
      }
    };

    Promise.all([
      axios.get(`${apiUrl}/cms/nav-menu`).catch(() => null),
      axios.get(`${apiUrl}/cms/contact-buttons`).catch(() => null),
      axios.get(`${apiUrl}/cms/settings`).catch(() => null)
    ]).then(([menuRes, btnRes, settingsRes]) => {
      if (menuRes?.data?.length) {
        setNavMenu(menuRes.data.filter(m => m.active).sort((a, b) => a.order - b.order));
      }
      if (btnRes?.data?.length) {
        const activeBtn = btnRes.data.find(b => b.active);
        if (activeBtn) {
          setCtaButton({ label: activeBtn.label, href: buildContactHref(activeBtn) });
        }
      }
      if (settingsRes?.data?.length) {
        const lt = settingsRes.data.find(s => s.key === "navbar_logo_text");
        const lu = settingsRes.data.find(s => s.key === "navbar_logo_url");
        if (lt?.value) setNavLogoText(lt.value);
        if (lu?.value) setNavLogoUrl(lu.value);
      }
    }).catch(() => { /* silently use defaults */ });
  }, []);

  const [aboutInfo, setAboutInfo] = useState({
    eyebrow: "Tentang Kami",
    title: "Sejarah & Filosofi Literasi",
    subtitle: "Langkah perjalanan kami membina peradaban intelektual masyarakat.",
    historyTitle: "Sejarah Kehadiran",
    historyP1: "Didirikan sebagai ruang baca kolektif kecil pada tahun 1980 di pinggiran balai kota, perpustakaan ini berdiri atas impian sederhana: memberikan akses buku gratis kepada anak-anak sekolah. Melalui dedikasi tanpa henti selama lebih dari 45 tahun, perpustakaan ini kini tegak sebagai pusat digitalisasi literatur dan pelestarian manuskrip kota.",
    historyP2: "Transformasi digital kami membuktikan bahwa buku fisik dan portal e-journal modern dapat bersatu memberikan pengalaman penelitian akademik yang lengkap bagi masyarakat umum.",
    historyImageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop",
    visiTitle: "Visi Mulia",
    visiDesc: "Menjadi pusat peradaban pengetahuan terkemuka yang memadukan kehangatan interaksi sosial budaya membaca dengan akselerasi inovasi teknologi digital.",
    misiTitle: "Misi Layanan"
  });

  const [teamList, setTeamList] = useState([
    { id: "team-1", name: "Dr. Hendrawan Basuki", role: "Kepala Perpustakaan", desc: "Mengarahkan visi strategis literasi kota." },
    { id: "team-2", name: "Siti Rahmawati, M.Hum", role: "Sekretaris & Operasional", desc: "Mengelola manajemen internal & kemitraan." },
    { id: "team-3", name: "Budi Utomo, S.I.Pust", role: "Kepala Bidang Layanan & TI", desc: "Mengembangkan integrasi sistem & digitalisasi." }
  ]);

  const [facilityList, setFacilityList] = useState([
    { id: "fac-1", num: "01", title: "Ruang Baca Hening", desc: "Meja partisi individu dengan pencahayaan baca personal untuk fokus maksimal." },
    { id: "fac-2", num: "02", title: "Lab Komputer & E-Library", desc: "Workstation komputer terhubung basis data jurnal internasional premium." },
    { id: "fac-3", num: "03", title: "Kids Literacy Area", desc: "Sudut buku cerita edukatif, karpet bermain, dan ruang dongeng anak." },
    { id: "fac-4", num: "04", title: "Taman Diskusi Terbuka", desc: "Ruang luar hijau yang nyaman untuk mendiskusikan buku dengan santai." }
  ]);

  const [statsList, setStatsList] = useState([
    { id: "stat-1", value: "25.000+", label: "Koleksi Buku Fisik" },
    { id: "stat-2", value: "10.500+", label: "Anggota Aktif" },
    { id: "stat-3", value: "120+", label: "Kegiatan / Tahun" },
    { id: "stat-4", value: "5.000+", label: "E-Journal Premium" }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedInfo = localStorage.getItem("cms_about_info");
      if (savedInfo) try { setAboutInfo(JSON.parse(savedInfo)); } catch(e) {}

      const savedTeam = localStorage.getItem("cms_team_list");
      if (savedTeam) try { setTeamList(JSON.parse(savedTeam)); } catch(e) {}

      const savedFac = localStorage.getItem("cms_facility_list");
      if (savedFac) try { setFacilityList(JSON.parse(savedFac)); } catch(e) {}

      const savedStats = localStorage.getItem("cms_stats_list");
      if (savedStats) try { setStatsList(JSON.parse(savedStats)); } catch(e) {}
    }
  }, []);

  const [footerInfo, setFooterInfo] = useState({
    brandName: "Perpustakaan Kota Buku",
    description: "Pusat layanan literasi dan informasi terpadu untuk masyarakat Kota Buku. Gratis untuk semua.",
    address: "Jl. Sastra Kencana No. 45, Kota Buku",
    email: "info@perpustakaankota.go.id",
    phone: "(021) 8899-7766",
    copyright: "© 2026 Perpustakaan Kota Buku. Hak Cipta Dilindungi Undang-Undang."
  });

  const [footerHours, setFooterHours] = useState([
    { id: "fh-1", days: "Senin — Jumat", hours: "08:00 — 18:00" },
    { id: "fh-2", days: "Sabtu — Minggu", hours: "09:00 — 15:00" }
  ]);

  const [footerLinks, setFooterLinks] = useState([
    { id: "fl-1", label: "Kebijakan Privasi", url: "#privacy" },
    { id: "fl-2", label: "Ketentuan Layanan", url: "#terms" }
  ]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedFooterInfo = localStorage.getItem("cms_footer_info");
      if (savedFooterInfo) try { setFooterInfo(JSON.parse(savedFooterInfo)); } catch(e) {}

      const savedFooterHours = localStorage.getItem("cms_footer_hours");
      if (savedFooterHours) try { setFooterHours(JSON.parse(savedFooterHours)); } catch(e) {}

      const savedFooterLinks = localStorage.getItem("cms_footer_links");
      if (savedFooterLinks) try { setFooterLinks(JSON.parse(savedFooterLinks)); } catch(e) {}
    }
  }, []);





  // Handle header background change on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
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
    <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden bg-white">


          {/* ===== HEADER / NAVBAR ===== */}
          <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
              scrolled
                ? "bg-white border-b border-border-200 shadow-soft"
                : "bg-white border-b border-border-200"
            }`}
            style={{ height: "72px" }}
          >
            <div className="chapter-container h-full flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                {navLogoUrl ? (
                  <img src={navLogoUrl} alt="Logo" className="w-9 h-9 rounded-lg object-cover shadow-soft" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft shrink-0">
                    <BookOpen size={18} />
                  </div>
                )}
                <span className="font-navigation font-bold text-sm text-heading tracking-wide">
                  {navLogoText}
                </span>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center gap-1" aria-label="Navigasi utama">
                {navMenu.map((item) => (
                  <a
                    key={item.id}
                    href={item.target}
                    className="px-4 py-2 rounded-lg text-sm font-navigation font-medium text-body hover:text-primary-500 hover:bg-primary-50 transition-all"
                  >
                    {item.label}
                  </a>
                ))}
              </nav>

              {/* CTA Button */}
              <a
                href={ctaButton.href}
                target={ctaButton.href.startsWith("http") || ctaButton.href.startsWith("mailto:") ? "_blank" : undefined}
                rel={ctaButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="btn-primary"
              >
                {ctaButton.label}
              </a>
            </div>
          </header>

          {/* ===== HERO SECTION ===== */}
          <section className="pt-28 pb-20 md:pt-36 md:pb-28 bg-white relative overflow-hidden">
            {/* Decorative soft blue shape */}
            <div
              className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle at 80% 20%, rgba(0,91,172,0.05) 0%, transparent 65%)" }}
            />
            <div
              className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle at 20% 80%, rgba(244,180,0,0.04) 0%, transparent 65%)" }}
            />

            <div className="chapter-container relative">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
                {/* Left — Text */}
                <div className="space-y-7">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold-50 border border-gold-200">
                    <Compass size={13} className="text-gold-500" />
                    <span className="text-xs font-navigation font-bold text-gold-600 uppercase tracking-widest">
                      Portal Literasi Kota
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading font-navigation leading-tight">
                    Membuka Lembaran Baru{" "}
                    <span className="text-primary-500">Ilmu Pengetahuan.</span>
                  </h1>

                  <p className="text-base text-body leading-relaxed max-w-lg">
                    Selamat datang di portal perpustakaan kota. Akses ribuan koleksi buku fisik, jurnal digital, dan ikuti kegiatan literasi kreatif kami — gratis untuk semua.
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <a href="#about" className="btn-primary">
                      <span>Profil Perpustakaan</span>
                      <ArrowRight size={15} />
                    </a>
                    <a href="#news" className="btn-secondary">
                      Berita Terbaru
                    </a>
                  </div>

                  {/* Quick stats */}
                  <div className="flex flex-wrap gap-6 pt-4 border-t border-border-200">
                    {statsList.slice(0, 3).map((s, i) => (
                      <div key={s.id || i}>
                        <div className="text-xl font-bold text-primary-500 font-navigation">{s.value}</div>
                        <div className="text-xs text-muted font-navigation">{s.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right — Illustration */}
                <div className="flex justify-center lg:justify-end">
                  <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                    {/* Soft circular background */}
                    <div className="absolute inset-0 rounded-full bg-primary-50 border border-primary-100" />
                    {/* Dashed orbit ring */}
                    <div className="absolute inset-6 rounded-full border-2 border-dashed border-primary-200 animate-spin" style={{ animationDuration: "20s" }} />
                    {/* Center icon */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-28 h-28 rounded-2xl bg-white shadow-medium flex items-center justify-center border border-border-200">
                        <Library size={52} className="text-primary-500" />
                      </div>
                    </div>
                    {/* Floating decorative badges */}
                    <div className="absolute top-6 right-4 bg-white rounded-xl shadow-soft border border-border-200 px-3 py-2 flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-success-500" />
                      <span className="text-xs font-navigation font-bold text-heading">Buka Sekarang</span>
                    </div>
                    <div className="absolute bottom-8 left-2 bg-white rounded-xl shadow-soft border border-border-200 px-3 py-2">
                      <div className="text-xs font-navigation font-bold text-primary-500">
                        {statsList[3] ? `${statsList[3].value} ${statsList[3].label}` : "5.000+ E-Journal"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== TENTANG KAMI ===== */}
          <section id="about" className="py-24 bg-surface-100 border-y border-border-200">
            <div className="chapter-container space-y-16">
              {/* Section header */}
              <div className="max-w-2xl space-y-3">
                <span className="section-eyebrow">{aboutInfo.eyebrow}</span>
                <h2 className="text-3xl md:text-4xl font-bold text-heading font-navigation">
                  {aboutInfo.title}
                </h2>
                <p className="text-sm text-muted">{aboutInfo.subtitle}</p>
              </div>

              {/* Sejarah */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-heading font-navigation">{aboutInfo.historyTitle}</h3>
                  <p className="text-sm text-body leading-relaxed">
                    {aboutInfo.historyP1}
                  </p>
                  <p className="text-sm text-body leading-relaxed">
                    {aboutInfo.historyP2}
                  </p>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden border border-border-200 shadow-medium">
                  <img
                    src={aboutInfo.historyImageUrl}
                    alt="Ruang perpustakaan"
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-2xl border border-border-200 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-500 flex items-center justify-center">
                    <Shield size={18} />
                  </div>
                  <h4 className="text-base font-bold text-heading font-navigation">{aboutInfo.visiTitle}</h4>
                  <p className="text-sm text-body leading-relaxed">
                    {aboutInfo.visiDesc}
                  </p>
                </div>
                <div className="bg-white p-8 rounded-2xl border border-border-200 shadow-soft space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-gold-50 text-gold-500 flex items-center justify-center">
                    <Award size={18} />
                  </div>
                  <h4 className="text-base font-bold text-heading font-navigation">{aboutInfo.misiTitle}</h4>
                  <ul className="text-sm text-body leading-relaxed space-y-2">
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-success-500 mt-0.5 shrink-0" />
                      Menyelenggarakan repositori literatur digital yang terbuka dan akurat.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-success-500 mt-0.5 shrink-0" />
                      Mengadakan program kepenulisan kreatif dan seminar sastra berkala.
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-success-500 mt-0.5 shrink-0" />
                      Membangun infrastruktur ruang baca inklusif ramah difabel dan lansia.
                    </li>
                  </ul>
                </div>
              </div>

              {/* Struktur Organisasi */}
              <div className="space-y-6 pt-4 border-t border-border-200">
                <h4 className="text-lg font-bold text-heading font-navigation">Struktur Pengurus</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  {teamList.map((item, idx) => (
                    <div key={item.id || idx} className="bg-white p-5 rounded-xl border border-border-200 shadow-soft text-center space-y-1.5 hover:shadow-medium hover:-translate-y-0.5 transition-all duration-200">
                      <div className="w-12 h-12 rounded-full bg-primary-50 border-2 border-primary-100 flex items-center justify-center mx-auto mb-3">
                        <User size={20} className="text-primary-500" />
                      </div>
                      <h5 className="font-bold text-sm text-heading font-navigation">{item.name}</h5>
                      <span className="text-xs font-bold text-primary-500 uppercase tracking-wider block">{item.role}</span>
                      <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas & Jam Operasional */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-border-200">
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="text-base font-bold text-heading font-navigation">Fasilitas Utama</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {facilityList.map((f, i) => (
                      <div key={f.id || i} className="flex gap-3 items-start bg-white p-4 rounded-xl border border-border-200">
                        <div className="w-8 h-8 rounded-lg bg-primary-500 text-white flex items-center justify-center shrink-0 text-xs font-bold font-navigation">
                          {f.num}
                        </div>
                        <div>
                          <h5 className="font-bold text-sm text-heading font-navigation">{f.title}</h5>
                          <p className="text-xs text-muted leading-relaxed mt-0.5">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Clock size={16} className="text-primary-500" />
                    </div>
                    <h4 className="text-sm font-bold text-heading font-navigation">Jam Layanan Fisik</h4>
                  </div>
                  <p className="text-xs text-muted">Kunjungi gedung layanan kami pada jam operasional berikut.</p>
                  <div className="space-y-3 pt-1">
                    <div className="flex justify-between items-center text-sm border-b border-border-200 pb-3">
                      <span className="font-medium text-body font-navigation">Senin — Jumat</span>
                      <span className="font-bold text-primary-500 font-navigation">08:00 — 18:00</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-body font-navigation">Sabtu — Minggu</span>
                      <span className="font-bold text-primary-500 font-navigation">09:00 — 15:00</span>
                    </div>
                  </div>
                  <div className="pt-2">
                    <span className="badge badge-success">
                      <div className="w-1.5 h-1.5 rounded-full bg-success-500" />
                      Saat ini Buka
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ===== STATISTIK ===== */}
          <section id="stats" className="py-20 relative overflow-hidden" style={{ backgroundColor: "#005BAC" }}>
            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 0)",
              backgroundSize: "20px 20px"
            }} />

            <div className="chapter-container relative z-10">
              <div className="text-center mb-12">
                <span className="text-xs font-navigation font-bold tracking-widest uppercase text-white/60 block mb-2">Perpustakaan dalam Angka</span>
                <h2 className="text-3xl font-bold text-white font-navigation">Statistik Layanan Kami</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {statsList.map((stat, i) => (
                  <div key={stat.id || i} className="text-center group">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 text-white flex items-center justify-center mx-auto mb-4 group-hover:bg-white/20 transition-colors duration-200">
                      <Activity size={24} />
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white font-navigation mb-1">
                      {stat.value}
                    </div>
                    <div className="text-xs text-white/70 font-navigation font-medium uppercase tracking-wider">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== BERITA ===== */}
          <section id="news" className="py-24 bg-white">
            <div className="chapter-container space-y-12">
              {/* Header */}
              <div className="max-w-2xl space-y-2">
                <span className="section-eyebrow">Berita Terbaru</span>
                <h2 className="text-3xl md:text-4xl font-bold text-heading font-navigation">
                  Kabar & Publikasi Terkini
                </h2>
                <p className="text-sm text-muted">Ikuti info perkembangan literasi komunitas dan pembaruan sistem katalog.</p>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-surface-100 p-4 rounded-2xl border border-border-200">
                <div className="lib-search w-full sm:w-80">
                  <Search size={16} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    aria-label="Cari berita"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                  {["Semua", "Komunitas", "Teknologi", "Berita"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNewsCategory(cat)}
                      className={`px-4 py-2 rounded-lg text-xs font-navigation font-semibold whitespace-nowrap transition-all cursor-pointer ${
                        selectedNewsCategory === cat
                          ? "bg-primary-500 text-white shadow-soft"
                          : "bg-white text-body border border-border-200 hover:border-primary-300 hover:text-primary-500"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* News Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {filteredNews.length > 0 ? (
                  filteredNews.map((news) => (
                    <article
                      key={news.id}
                      className="lib-card flex flex-col"
                    >
                      <div className="h-48 overflow-hidden relative">
                        <img
                          src={news.thumbnail}
                          alt={news.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                        <div className="absolute top-3 left-3">
                          <span className="badge badge-primary">{news.category}</span>
                        </div>
                      </div>
                      <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1.5 text-xs text-muted font-navigation">
                            <Calendar size={12} />
                            <span>{news.date}</span>
                          </div>
                          <h4 className="text-base font-bold text-heading font-navigation leading-snug hover:text-primary-500 transition-colors line-clamp-2">
                            {news.title}
                          </h4>
                          <p className="text-sm text-body line-clamp-3 leading-relaxed">
                            {news.content}
                          </p>
                        </div>
                        <button className="inline-flex items-center gap-1.5 text-sm text-primary-500 font-bold font-navigation pt-2 hover:gap-3 transition-all cursor-pointer">
                          <span>Selengkapnya</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-20 bg-surface-100 border border-border-200 rounded-2xl">
                    <AlertCircle size={32} className="mx-auto text-muted mb-3" />
                    <p className="text-sm text-muted font-navigation font-medium">Berita tidak ditemukan.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ===== EVENTS ===== */}
          <section id="events" className="py-24 bg-surface-100 border-y border-border-200">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-2">
                <span className="section-eyebrow">Kegiatan Komunitas</span>
                <h2 className="text-3xl md:text-4xl font-bold text-heading font-navigation">
                  Agenda Literasi Kreatif
                </h2>
                <p className="text-sm text-muted">Segera daftarkan diri Anda pada program lokakarya dan diskusi gratis di bawah ini.</p>
              </div>

              <div className="space-y-5">
                {MOCK_EVENTS.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-2xl border border-border-200 shadow-soft overflow-hidden grid grid-cols-1 lg:grid-cols-12 hover:shadow-medium transition-shadow duration-200"
                  >
                    {/* Image */}
                    <div className="lg:col-span-4 h-52 lg:h-full relative min-h-48">
                      <img
                        src={event.thumbnail}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>

                    {/* Content */}
                    <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-5">
                      <div className="space-y-3">
                        <span className="badge badge-primary">Agenda Mendatang</span>
                        <h4 className="text-lg font-bold text-heading font-navigation leading-snug">{event.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 text-sm text-body">
                            <Calendar size={14} className="text-primary-500 shrink-0" />
                            <span>{event.date} · {event.time}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-body">
                            <MapPin size={14} className="text-primary-500 shrink-0" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-body sm:col-span-2">
                            <User size={14} className="text-primary-500 shrink-0" />
                            <span>Pembicara: <strong className="text-heading">{event.speaker}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="border-t border-border-200 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-heading font-navigation">
                            {event.registered} / {event.capacity} kursi terisi
                          </div>
                          <div className="w-40 h-1.5 bg-border-200 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-primary-500 transition-all"
                              style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                            />
                          </div>
                        </div>

                        {registeredEventId === event.id ? (
                          <div className="flex items-center gap-2 text-sm text-success-700 font-bold font-navigation bg-success-50 px-4 py-2 rounded-lg border border-success-500/30">
                            <CheckCircle size={15} />
                            <span>Pendaftaran Berhasil!</span>
                          </div>
                        ) : (
                          <form onSubmit={(e) => handleRegisterEventSubmit(e, event.id)} className="flex flex-wrap gap-2">
                            <input
                              type="text"
                              placeholder="Nama Lengkap"
                              required
                              value={eventRegisterForm.name}
                              onChange={(e) => setEventRegisterForm({ ...eventRegisterForm, name: e.target.value })}
                              className="lib-input !w-auto !py-2 text-xs"
                              style={{ minWidth: "120px" }}
                            />
                            <input
                              type="email"
                              placeholder="Email"
                              required
                              value={eventRegisterForm.email}
                              onChange={(e) => setEventRegisterForm({ ...eventRegisterForm, email: e.target.value })}
                              className="lib-input !w-auto !py-2 text-xs"
                              style={{ minWidth: "120px" }}
                            />
                            <button type="submit" className="btn-primary !py-2 !px-4 !text-xs shrink-0">
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
          </section>

          {/* ===== GALERI ===== */}
          <section id="gallery" className="py-24 bg-white">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-2">
                <span className="section-eyebrow">Galeri Dokumentasi</span>
                <h2 className="text-3xl md:text-4xl font-bold text-heading font-navigation">
                  Koleksi Visual Kegiatan
                </h2>
                <p className="text-sm text-muted">Potret dokumentasi kemeriahan literasi kreatif dan ruang baca perpustakaan.</p>
              </div>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-5 space-y-5">
                {MOCK_GALLERY.map((photo) => (
                  <div
                    key={photo.id}
                    className="relative group overflow-hidden rounded-2xl border border-border-200 shadow-soft break-inside-avoid hover:shadow-medium transition-all duration-300"
                  >
                    <img
                      src={photo.url}
                      alt={photo.caption}
                      className="w-full h-auto object-cover transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-heading/80 via-heading/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-xs text-white font-navigation font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== FAQ ===== */}
          <section id="faq" className="py-24 bg-surface-100 border-y border-border-200">
            <div className="chapter-container max-w-4xl space-y-10">
              <div className="text-center space-y-2">
                <span className="section-eyebrow">Informasi Layanan</span>
                <h2 className="text-3xl font-bold text-heading font-navigation">
                  Pertanyaan Umum (FAQ)
                </h2>
                <p className="text-sm text-muted">Jawaban atas pertanyaan yang paling sering diajukan pengunjung.</p>
              </div>

              <div className="space-y-3">
                {FAQS.map((faq, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl border border-border-200 overflow-hidden shadow-soft"
                  >
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full text-left px-6 py-5 flex items-center justify-between font-navigation text-sm font-semibold text-heading hover:bg-surface-100 transition-colors cursor-pointer"
                      aria-expanded={activeFaq === index}
                    >
                      <span className="pr-4">{faq.q}</span>
                      <ChevronDown
                        size={18}
                        className={`text-primary-500 transition-transform duration-300 shrink-0 ${activeFaq === index ? "rotate-180" : ""}`}
                      />
                    </button>
                    {activeFaq === index && (
                      <div className="px-6 pb-5 border-t border-border-100 text-sm text-body leading-relaxed pt-4">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ===== KONTAK & MAPS ===== */}
          <section id="contact" className="py-24 bg-white">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-2">
                <span className="section-eyebrow">Pusat Bantuan</span>
                <h2 className="text-3xl md:text-4xl font-bold text-heading font-navigation">
                  Hubungi & Kunjungi Kami
                </h2>
                <p className="text-sm text-muted">Hubungi admin atau kunjungi gedung perpustakaan kami melalui peta rute berikut.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Contact Form */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-lg font-bold text-heading font-navigation">Form Hubungi Kami</h3>

                  {contactSuccess ? (
                    <div className="bg-success-50 border border-success-500/30 text-success-700 p-8 rounded-2xl text-center space-y-3">
                      <CheckCircle size={36} className="mx-auto text-success-500" />
                      <h4 className="font-bold text-base font-navigation">Pesan Anda Terkirim!</h4>
                      <p className="text-sm text-success-700/80">Terima kasih atas laporan Anda. Tim kami akan segera merespons.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label className="lib-label" htmlFor="contact-name">Nama Lengkap</label>
                          <input
                            id="contact-name"
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="lib-input"
                            placeholder="Nama Anda"
                          />
                        </div>
                        <div>
                          <label className="lib-label" htmlFor="contact-email">Email</label>
                          <input
                            id="contact-email"
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="lib-input"
                            placeholder="email@contoh.com"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="lib-label" htmlFor="contact-message">Isi Pesan</label>
                        <textarea
                          id="contact-message"
                          required
                          rows={5}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="lib-input resize-none"
                          placeholder="Tulis pesan atau pertanyaan Anda..."
                        />
                      </div>
                      <button type="submit" className="btn-primary w-full justify-center !py-3">
                        Kirim Pesan
                      </button>
                    </form>
                  )}
                </div>

                {/* Maps & Contacts */}
                <div className="lg:col-span-5 space-y-5">
                  <h3 className="text-lg font-bold text-heading font-navigation">Detail Kontak & Peta</h3>

                  {/* Map placeholder */}
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-border-200 bg-surface-100 flex flex-col justify-center items-center text-center p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                      <MapPin size={24} className="text-primary-500" />
                    </div>
                    <h5 className="font-navigation text-sm font-bold text-heading">Jl. Sastra Kencana No. 45, Kota Buku</h5>
                    <p className="text-xs text-muted max-w-xs leading-relaxed pt-1">Gedung Utama Sektor Timur (Samping Danau Kota).</p>
                    <div className="mt-4">
                      <button className="btn-secondary !py-2 !px-4 !text-xs">
                        Lihat di Google Maps
                      </button>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="bg-surface-100 p-5 rounded-xl border border-border-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-body">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-primary-500" />
                      </div>
                      <span>info@perpustakaankota.go.id</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-body">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-primary-500" />
                      </div>
                      <span>(021) 8899-7766</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-body">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Clock size={14} className="text-primary-500" />
                      </div>
                      <span>Sen–Jum: 08.00–18.00 | Sab–Min: 09.00–15.00</span>
                    </div>
                  </div>

                  {/* Social media */}
                  <div>
                    <p className="text-xs font-navigation font-bold text-muted uppercase tracking-wider mb-3">Ikuti Media Sosial</p>
                    <div className="flex gap-3">
                      {[
                        { icon: <Facebook size={16} />, link: "#", label: "Facebook" },
                        { icon: <Twitter size={16} />, link: "#", label: "Twitter" },
                        { icon: <Instagram size={16} />, link: "#", label: "Instagram" },
                        { icon: <Youtube size={16} />, link: "#", label: "YouTube" }
                      ].map((soc, idx) => (
                        <a
                          key={idx}
                          href={soc.link}
                          aria-label={soc.label}
                          className="w-10 h-10 rounded-xl bg-surface-100 border border-border-200 text-muted hover:bg-primary-500 hover:border-primary-500 hover:text-white flex items-center justify-center transition-all duration-200"
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

          {/* ===== FOOTER ===== */}
          <footer style={{ backgroundColor: "#005BAC" }}>
            <div className="chapter-container py-14">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-10">
                {/* Brand */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-white">
                      <BookOpen size={18} />
                    </div>
                    <span className="font-navigation font-bold text-white text-sm tracking-wide">
                      {footerInfo.brandName}
                    </span>
                  </div>
                  <p className="text-sm text-white/70 leading-relaxed">
                    {footerInfo.description}
                  </p>
                </div>

                {/* Jam Operasional */}
                <div className="space-y-4">
                  <h4 className="font-navigation font-bold text-white text-sm uppercase tracking-wider">Jam Operasional</h4>
                  <div className="space-y-2 text-sm text-white/70">
                    {footerHours.map((fh, idx) => (
                      <div key={fh.id || idx} className="flex justify-between">
                        <span>{fh.days}</span>
                        <span className="font-semibold text-white">{fh.hours}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Kontak */}
                <div className="space-y-4">
                  <h4 className="font-navigation font-bold text-white text-sm uppercase tracking-wider">Kontak</h4>
                  <div className="space-y-2 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <MapPin size={13} className="text-white/50 shrink-0" />
                      <span>{footerInfo.address}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail size={13} className="text-white/50 shrink-0" />
                      <span>{footerInfo.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone size={13} className="text-white/50 shrink-0" />
                      <span>{footerInfo.phone}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="border-t border-white/15 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-xs text-white/60 font-navigation">
                  {footerInfo.copyright}
                </p>
                <div className="flex gap-5 text-xs text-white/60 font-navigation">
                  {footerLinks.map((fl, idx) => (
                    <a key={fl.id || idx} href={fl.url} className="hover:text-white cursor-pointer transition-colors">
                      {fl.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </footer>
    </div>
  );
}
