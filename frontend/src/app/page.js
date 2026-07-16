"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon, 
  MapPin, User, ChevronDown, X, Mail, Phone, Clock, Search, 
  AlertCircle, CheckCircle, ArrowUpRight, Facebook, Twitter, Instagram, 
  Youtube, Info, Award, Shield, Library, Users2, Activity, Database
} from "lucide-react";
import anime from "animejs";
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

// Faux text line placeholders for book pages representation
const FakeTextLines = ({ lines = 6, color = "bg-gray-300/40" }) => {
  return (
    <div className="space-y-2 w-full">
      {Array.from({ length: lines }).map((_, idx) => {
        const widths = ["w-full", "w-11/12", "w-5/6", "w-4/5", "w-3/4", "w-2/3"];
        const width = widths[idx % widths.length];
        return <div key={idx} className={`h-1 rounded-full ${width} ${color}`} />;
      })}
    </div>
  );
};

export default function Home() {
  // Cinematic States: intro | opening | site
  const [stage, setStage] = useState("intro");
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Search & Forms States
  const [newsSearch, setNewsSearch] = useState("");
  const [selectedNewsCategory, setSelectedNewsCategory] = useState("Semua");
  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [contactSuccess, setContactSuccess] = useState(false);
  const [registeredEventId, setRegisteredEventId] = useState(null);
  const [eventRegisterForm, setEventRegisterForm] = useState({ name: "", email: "" });

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const touchStartY = useRef(0);
  const floatAnimRef = useRef(null);

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

  // Particles Canvas Effect
  useEffect(() => {
    if (stage !== "intro" && stage !== "opening") return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    
    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height + height,
      size: Math.random() * 2 + 0.5,
      speedY: -(Math.random() * 0.8 + 0.2),
      speedX: Math.random() * 0.4 - 0.2,
      opacity: Math.random() * 0.5 + 0.2,
      fadeSpeed: Math.random() * 0.005 + 0.002
    }));

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        // Alternate between soft gold and ocean blue particles
        const isBlue = Math.floor(p.x + p.y) % 2 === 0;
        ctx.fillStyle = isBlue 
          ? `rgba(0, 113, 227, ${p.opacity * 0.45})` 
          : `rgba(212, 175, 55, ${p.opacity * 0.6})`;
        ctx.fill();
      });
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [stage]);

  // Float loop for intro book
  useEffect(() => {
    if (stage === "intro") {
      floatAnimRef.current = anime({
        targets: ".intro-book-float",
        translateY: [-10, 10],
        duration: 4000,
        direction: "alternate",
        loop: true,
        easing: "easeInOutQuad"
      });
    }
  }, [stage]);

  // Handle header background change on scroll
  useEffect(() => {
    if (stage !== "site") return;
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [stage]);

  // Trigger Opening Timeline (Intro to Site)
  const triggerOpening = () => {
    if (stage !== "intro") return;
    setStage("opening");

    // Pause floating loop to prevent jitter
    if (floatAnimRef.current) {
      floatAnimRef.current.pause();
    }

    const tl = anime.timeline({
      easing: "cubicBezier(0.25, 1, 0.5, 1)",
      complete: () => {
        setStage("site");
        window.scrollTo(0, 0);
      }
    });

    tl.add({
      targets: ".intro-ui-fade",
      opacity: [1, 0],
      translateY: [0, -20],
      duration: 600
    })
    .add({
      targets: ".intro-book-float",
      translateY: 0,
      scale: [1, 2.2], // Centered scale up
      duration: 1600,
      offset: "-=300"
    })
    .add({
      targets: ".intro-book-cover",
      rotateY: -155,
      duration: 1800,
      offset: "-=1400"
    })
    .add({
      targets: ".intro-book-page-1",
      rotateY: -140,
      duration: 1800,
      offset: "-=1800"
    })
    .add({
      targets: ".intro-book-page-2",
      rotateY: -125,
      duration: 1800,
      offset: "-=1800"
    })
    .add({
      targets: ".intro-book-page-3",
      rotateY: -25,
      duration: 1800,
      offset: "-=1800"
    })
    // Smoothly blur and fade out the book model as it finishes opening
    .add({
      targets: ".intro-book-float",
      filter: ["blur(0px)", "blur(16px)"],
      opacity: [1, 0],
      duration: 1000,
      offset: "-=1000"
    })
    .add({
      targets: ".intro-ambient-overlay",
      opacity: [1, 0],
      duration: 1400,
      offset: "-=1400"
    });
  };

  // Skip animations directly to site
  const handleSkipAnimation = () => {
    setStage("site");
    window.scrollTo(0, 0);
  };

  // Scroll Interceptions (Intro stage locks only)
  const handleWheel = (e) => {
    if (stage === "intro" && e.deltaY > 5) {
      e.preventDefault();
      triggerOpening();
    }
  };

  const handleTouchStart = (e) => {
    if (stage === "intro") {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    if (stage === "intro") {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      if (deltaY > 10) {
        e.preventDefault();
        triggerOpening();
      }
    }
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
    <div 
      ref={containerRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className={`flex-1 flex flex-col min-h-screen relative overflow-x-hidden ${stage === "intro" || stage === "opening" ? "overflow-y-hidden h-screen" : ""}`}
    >
      
      {/* -------------------- DUST PARTICLES CANVAS -------------------- */}
      {(stage === "intro" || stage === "opening") && (
        <canvas ref={canvasRef} className="particle-canvas" />
      )}

      {/* -------------------- ACCESSIBILITY: SKIP LINK -------------------- */}
      {(stage === "intro" || stage === "opening") && (
        <button
          onClick={handleSkipAnimation}
          className="fixed top-6 right-6 z-55 px-5 py-2.5 rounded-full bg-gray-900/5 hover:bg-gray-900/10 text-gray-800 font-navigation text-xs font-semibold tracking-wider border border-gray-250/60 backdrop-blur-md transition-all cursor-pointer"
        >
          Lewati Animasi (Skip)
        </button>
      )}

      {/* -------------------- CINEMATIC STAGE: INTRO / OPENING -------------------- */}
      {(stage === "intro" || stage === "opening") && (
        <div className="fixed inset-0 z-40 dark-stage flex flex-col justify-center items-center overflow-hidden">
          
          {/* Ambient Glow behind the book */}
          <div className="absolute inset-0 ambient-glow opacity-80 pointer-events-none" />

          {/* Book Wrapper */}
          <div className="intro-book-float flex justify-center items-center scale-100 z-10">
            <div className="perspective-1800">
              <div className="book-cinematic">
                {/* Spine groove decoration */}
                <div className="book-spine-cinematic" />

                {/* FRONT COVER */}
                <div className="intro-book-cover book-cover-cinematic flex flex-col justify-between p-8 select-none">
                  {/* Decorative internal frame */}
                  <div className="border border-gold-305/20 h-full w-full absolute top-0 left-0 p-4 pointer-events-none">
                    <div className="border border-gold-300/10 h-full w-full rounded-sm" />
                  </div>

                  <div className="space-y-4 relative z-10">
                    <span className="text-[10px] tracking-[0.25em] text-gold-300 font-navigation font-bold uppercase block">
                      Digital Book Experience
                    </span>
                    <h2 className="text-3xl font-bold text-white font-sans leading-snug">
                      Sistem Informasi <br />
                      <span className="text-gold-400 font-display italic font-light">Perpustakaan</span>
                    </h2>
                  </div>

                  <div className="border-t border-white/10 pt-6 space-y-2 relative z-10">
                    <p className="text-[10px] text-gold-300 font-navigation tracking-wider font-bold">
                      KOTA BUKU
                    </p>
                    <div className="h-0.5 w-16 bg-gold-400 rounded-full" />
                  </div>
                </div>

                {/* PAGES STACK */}
                <div className="intro-book-page-1 book-page-cinematic page-1 select-none p-6">
                  <div className="flipped-page-content">
                    <div className="space-y-3">
                      <span className="text-[9px] uppercase tracking-wider text-primary-500 font-bold font-navigation">Lembaran Pembuka</span>
                      <h3 className="text-sm font-bold text-gray-900 font-sans">Bab I: Menjelajah</h3>
                      <p className="text-[10px] text-gray-500 leading-relaxed font-sans">Menyingkap rahasia peradaban melalui aksara dan lembaran ilmu.</p>
                    </div>
                    <FakeTextLines lines={5} />
                  </div>
                </div>
                <div className="intro-book-page-2 book-page-cinematic page-2 select-none p-6">
                  <div className="flipped-page-content justify-center gap-4">
                    <FakeTextLines lines={8} />
                    <FakeTextLines lines={6} />
                  </div>
                </div>
                <div className="intro-book-page-3 book-page-cinematic page-3 select-none flex flex-col justify-center p-6 gap-4">
                  <FakeTextLines lines={7} />
                  <FakeTextLines lines={5} />
                </div>
                <div className="book-page-cinematic page-4 select-none flex flex-col justify-center p-6 gap-4">
                  <FakeTextLines lines={8} />
                  <FakeTextLines lines={4} />
                </div>
              </div>
            </div>
          </div>

          {/* Intro Text Indicators */}
          <div className="intro-ui-fade text-center space-y-4 mt-16 z-20">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 font-sans tracking-wide">
              Perpustakaan Umum Kota Buku
            </h1>
            <p className="text-xs text-primary-650 font-navigation tracking-wider animate-pulse uppercase">
              Scroll ke bawah untuk membuka buku perjalanan Anda.
            </p>
            <div className="w-6 h-10 border border-gray-300 rounded-full mx-auto flex items-start p-1.5 opacity-80">
              <div className="w-1.5 h-2 bg-primary-500 rounded-full mx-auto animate-bounce" />
            </div>
          </div>

          {/* Ambient Fade overlay that reveals the white website */}
          <div className="intro-ambient-overlay absolute inset-0 bg-[#FAF9F6] z-0 pointer-events-none" />
        </div>
      )}

      {/* -------------------- STAGE: MAIN SITE (Scrollable Layout) -------------------- */}
      {stage === "site" && (
        <div className="flex-1 flex flex-col animate-fade-in relative z-10 bg-white">
          {/* HEADER */}
          <header className={`fixed top-0 left-0 w-full h-20 z-35 transition-all duration-300 ${scrolled ? "glass-header shadow-soft" : "bg-transparent"}`}>
            <div className="chapter-container h-full flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {navLogoUrl ? (
                  <img src={navLogoUrl} alt="Logo" className="w-9 h-9 rounded-lg object-cover shadow-soft" />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft">
                    <BookOpen size={18} />
                  </div>
                )}
                <span className="font-navigation font-bold text-sm tracking-wider text-gray-900 uppercase">
                  {navLogoText}
                </span>
              </div>

              {/* Desktop Navigation - Dynamic */}
              <nav className="hidden md:flex items-center gap-8 text-xs font-navigation font-semibold text-gray-500 uppercase tracking-widest">
                {navMenu.map((item) => (
                  <a key={item.id} href={item.target} className="hover:text-primary-500 transition-colors">{item.label}</a>
                ))}
              </nav>

              <a
                href={ctaButton.href}
                target={ctaButton.href.startsWith("http") || ctaButton.href.startsWith("mailto:") ? "_blank" : undefined}
                rel={ctaButton.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-navigation text-xs font-bold hover:bg-black shadow-soft transition-all text-center"
              >
                {ctaButton.label}
              </a>
            </div>
          </header>

          {/* HERO */}
          <section className="pt-32 pb-16 md:pt-40 md:pb-24 flex items-center min-h-[85vh] bg-paper-100">
            <div className="chapter-container grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-8 space-y-6">
                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 text-primary-700 text-[10px] font-bold tracking-widest uppercase font-navigation">
                  <Compass size={12} className="text-primary-500" />
                  <span>Bab I: Permulaan Perjalanan</span>
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900 font-sans leading-[1.08]">
                  Membuka Lembaran Baru <br />
                  <span className="text-primary-500 font-display italic font-light">Ilmu Pengetahuan.</span>
                </h1>
                <p className="text-base text-gray-500 max-w-xl leading-relaxed font-sans pt-2">
                  Selamat datang di portal perpustakaan kota. Setiap bab yang Anda temukan di halaman ini dirancang khusus untuk memandu Anda menyerap wawasan literatur dengan sentuhan visual modern.
                </p>
                <div className="flex gap-4 pt-4">
                  <a href="#about" className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary-500 text-white font-navigation text-xs font-bold hover:bg-primary-600 shadow-soft">
                    <span>Baca Profil Kami</span>
                    <ArrowRight size={14} />
                  </a>
                  <a href="#news" className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-gray-200 bg-white text-gray-700 font-navigation text-xs font-bold hover:border-primary-500 shadow-soft">
                    <span>Berita Terbaru</span>
                  </a>
                </div>
              </div>
              <div className="lg:col-span-4 flex justify-center">
                <div className="w-56 h-56 rounded-full bg-primary-100/50 flex items-center justify-center relative">
                  <div className="absolute inset-4 rounded-full border border-primary-300 border-dashed animate-spin duration-[10000ms]" />
                  <Library size={48} className="text-primary-500" />
                </div>
              </div>
            </div>
          </section>

          {/* TENTANG KAMI */}
          <section id="about" className="py-24 bg-white border-y border-gray-200/40">
            <div className="chapter-container space-y-16">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Tentang Kami</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">Sejarah & Filosofi Literasi</h2>
                <p className="text-xs text-gray-400 font-sans">Langkah perjalanan kami membina peradaban intelektual masyarakat.</p>
              </div>

              {/* Sejarah */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-5">
                  <h3 className="text-xl font-bold text-gray-900 font-display italic">Sejarah Kehadiran</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    Didirikan sebagai ruang baca kolektif kecil pada tahun 1980 di pinggiran balai kota, perpustakaan ini berdiri atas impian sederhana: memberikan akses buku gratis kepada anak-anak sekolah. Melalui dedikasi tanpa henti selama lebih dari 45 tahun, perpustakaan ini kini tegak sebagai pusat digitalisasi literatur dan pelestarian manuskrip kota.
                  </p>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    Transformasi digital kami membuktikan bahwa buku fisik dan portal e-journal modern dapat bersatu memberikan pengalaman penelitian akademik yang lengkap bagi masyarakat umum.
                  </p>
                </div>
                <div className="relative h-64 rounded-2xl overflow-hidden border border-gray-100 shadow-soft">
                  <img src="https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop" alt="Library space" className="w-full h-full object-cover" />
                </div>
              </div>

              {/* Visi & Misi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-paper-200 p-8 rounded-2xl border border-gray-100 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center"><Shield size={16} /></div>
                  <h4 className="text-base font-bold text-gray-900 font-display">Visi Mulia</h4>
                  <p className="text-xs text-gray-500 leading-relaxed font-sans">
                    Menjadi pusat peradaban pengetahuan terkemuka yang memadukan kehangatan interaksi sosial budaya membaca dengan akselerasi inovasi teknologi digital.
                  </p>
                </div>
                <div className="bg-paper-200 p-8 rounded-2xl border border-gray-100 space-y-3">
                  <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center"><Award size={16} /></div>
                  <h4 className="text-base font-bold text-gray-900 font-display">Misi Layanan</h4>
                  <ul className="text-xs text-gray-500 leading-relaxed space-y-1.5 font-sans list-disc list-inside">
                    <li>Menyelenggarakan repositori literatur digital yang terbuka dan akurat.</li>
                    <li>Mengadakan program kepenulisan kreatif dan seminar sastra berkala.</li>
                    <li>Membangun infrastruktur ruang baca inklusif ramah difabel dan lansia.</li>
                  </ul>
                </div>
              </div>

              {/* Struktur Organisasi */}
              <div className="space-y-6 pt-4 border-t border-gray-100">
                <h4 className="text-lg font-bold text-gray-900 font-navigation text-center">Struktur Pengurus</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {[
                    { name: "Dr. Hendrawan Basuki", role: "Kepala Perpustakaan", desc: "Mengarahkan visi strategis literasi kota." },
                    { name: "Siti Rahmawati, M.Hum", role: "Sekretaris & Operasional", desc: "Mengelola manajemen internal & kemitraan." },
                    { name: "Budi Utomo, S.I.Pust", role: "Kepala Bidang Layanan & TI", desc: "Mengembangkan integrasi sistem & digitalisasi." }
                  ].map((item, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-gray-150 text-center space-y-1">
                      <h5 className="font-bold text-xs text-gray-900 font-navigation">{item.name}</h5>
                      <span className="text-[9px] font-bold text-primary-500 uppercase block tracking-wider">{item.role}</span>
                      <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fasilitas & Operasional */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-gray-100">
                <div className="lg:col-span-8 space-y-4">
                  <h4 className="text-base font-bold text-gray-900 font-navigation">Fasilitas Utama</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { title: "Ruang Baca Hening", desc: "Meja partisi individu dengan pencahayaan baca personal untuk fokus maksimal." },
                      { title: "Lab Komputer & E-Library", desc: "Workstation komputer terhubung basis data jurnal internasional premium." },
                      { title: "Kids Literacy Area", desc: "Sudut buku cerita edukatif, karpet bermain, dan ruang dongeng anak." },
                      { title: "Taman Diskusi Terbuka", desc: "Ruang luar hijau yang nyaman untuk mendiskusikan buku dengan santai." }
                    ].map((f, i) => (
                      <div key={i} className="flex gap-2.5 items-start">
                        <div className="w-5 h-5 rounded-full bg-primary-50 text-primary-500 flex items-center justify-center shrink-0 text-[10px] font-bold">{i+1}</div>
                        <div>
                          <h5 className="font-bold text-xs text-gray-900 font-navigation">{f.title}</h5>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-sans">{f.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 bg-paper-200 p-6 rounded-xl border border-gray-150 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-gray-900 font-navigation flex items-center gap-1.5">
                      <Clock size={16} className="text-primary-500" />
                      <span>Jam Layanan Fisik</span>
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans">Silakan kunjungi gedung layanan kami pada jam operasional berikut.</p>
                  </div>
                  <div className="space-y-2 pt-4">
                    <div className="flex justify-between items-center text-[11px] border-b border-gray-250 pb-2">
                      <span className="font-semibold text-gray-500 font-navigation">Senin - Jumat</span>
                      <span className="font-bold text-primary-500">08:00 - 18:00 WIB</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-gray-500 font-navigation">Sabtu - Minggu</span>
                      <span className="font-bold text-primary-500">09:00 - 15:00 WIB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* STATISTIK */}
          <section id="stats" className="py-16 bg-gray-900 text-white relative">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#0071E3_1px,transparent_0)] bg-[size:16px_16px]" />
            <div className="chapter-container relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                {[
                  { icon: <Library size={22} />, value: "25.000+", label: "Koleksi Buku Fisik" },
                  { icon: <Users2 size={22} />, value: "10.500+", label: "Anggota Aktif" },
                  { icon: <Activity size={22} />, value: "120+", label: "Kegiatan / Tahun" },
                  { icon: <Database size={22} />, value: "5.000+", label: "E-Journal Premium" }
                ].map((stat, i) => (
                  <div key={i} className="space-y-1">
                    <div className="w-8 h-8 rounded-full bg-white/5 text-primary-400 flex items-center justify-center mx-auto mb-1">{stat.icon}</div>
                    <div className="text-3xl font-bold font-sans text-white">{stat.value}</div>
                    <div className="text-[10px] text-gray-400 uppercase font-navigation font-semibold tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* BERITA */}
          <section id="news" className="py-24 bg-white border-b border-gray-200/40">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Berita Terbaru</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">Kabar & Publikasi Terkini</h2>
                <p className="text-xs text-gray-400 font-sans">Ikuti info perkembangan literasi komunitas dan pembaruan sistem katalog.</p>
              </div>

              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-paper-200 p-4 rounded-xl border border-gray-150">
                <div className="relative w-full sm:w-80">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Cari berita..."
                    value={newsSearch}
                    onChange={(e) => setNewsSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-primary-500 text-xs font-sans"
                  />
                </div>
                <div className="flex gap-2 w-full sm:w-auto overflow-x-auto">
                  {["Semua", "Komunitas", "Teknologi", "Berita"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedNewsCategory(cat)}
                      className={`px-4 py-1.5 rounded-full text-xs font-navigation font-semibold transition-colors cursor-pointer ${
                        selectedNewsCategory === cat ? "bg-primary-500 text-white" : "bg-white text-gray-500 border border-gray-200"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {filteredNews.length > 0 ? (
                  filteredNews.map((news) => (
                    <article key={news.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-soft overflow-hidden group flex flex-col justify-between">
                      <div className="h-44 overflow-hidden relative">
                        <img src={news.thumbnail} alt={news.title} className="w-full h-full object-cover group-hover:scale-105 duration-500" />
                      </div>
                      <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <span className="text-[10px] text-gray-400 font-navigation font-bold block">{news.date}</span>
                          <h4 className="text-base font-bold text-gray-900 font-sans leading-snug group-hover:text-primary-500 line-clamp-2">{news.title}</h4>
                          <p className="text-xs text-gray-500 line-clamp-3 font-sans leading-relaxed">{news.content}</p>
                        </div>
                        <button className="text-[11px] text-primary-500 font-bold font-navigation flex items-center gap-1 cursor-pointer pt-2">
                          <span>Selengkapnya</span>
                          <ArrowUpRight size={12} />
                        </button>
                      </div>
                    </article>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-16 bg-white border border-gray-150 rounded-2xl">
                    <AlertCircle size={28} className="mx-auto text-gray-300 mb-2" />
                    <p className="text-xs text-gray-400 font-navigation">Berita tidak ditemukan.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* EVENTS */}
          <section id="events" className="py-24 bg-paper-100 border-b border-gray-200/40">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Kegiatan Komunitas</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">Agenda Literasi Kreatif</h2>
                <p className="text-xs text-gray-400 font-sans">Segera daftarkan diri Anda pada program lokakarya dan diskusi gratis di bawah ini.</p>
              </div>

              <div className="space-y-6">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-gray-250/40 shadow-soft overflow-hidden grid grid-cols-1 lg:grid-cols-12">
                    <div className="lg:col-span-4 h-48 lg:h-full relative min-h-40">
                      <img src={event.thumbnail} alt={event.title} className="w-full h-full object-cover" />
                    </div>
                    
                    <div className="lg:col-span-8 p-6 md:p-8 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-lg font-bold text-gray-900 font-sans leading-snug">{event.title}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-gray-500 font-sans pt-1">
                          <div className="flex items-center gap-1.5"><Calendar size={14} className="text-primary-500" /> <span>{event.date} ({event.time})</span></div>
                          <div className="flex items-center gap-1.5"><MapPin size={14} className="text-primary-500" /> <span>{event.location}</span></div>
                          <div className="flex items-center gap-1.5 col-span-1 sm:col-span-2"><User size={14} className="text-primary-500" /> <span>Pembicara: **{event.speaker}**</span></div>
                        </div>
                      </div>

                      <div className="border-t border-gray-100 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="text-[11px] font-sans text-gray-400">
                          <span className="block text-primary-600 font-semibold">Telah Terdaftar: {event.registered} / {event.capacity} Kursi</span>
                        </div>

                        {registeredEventId === event.id ? (
                          <div className="flex items-center gap-1 text-[11px] text-green-600 font-semibold font-navigation bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                            <CheckCircle size={12} />
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
                              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-32 focus:outline-none bg-paper-100" 
                            />
                            <input 
                              type="email" 
                              placeholder="Email" 
                              required
                              value={eventRegisterForm.email}
                              onChange={(e) => setEventRegisterForm({...eventRegisterForm, email: e.target.value})}
                              className="px-3 py-1.5 border border-gray-200 rounded-lg text-xs w-full sm:w-32 focus:outline-none bg-paper-100" 
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
          </section>

          {/* GALERI */}
          <section id="gallery" className="py-24 bg-white border-b border-gray-200/40">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Galeri Dokumentasi</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">Koleksi Visual Kegiatan</h2>
                <p className="text-xs text-gray-400 font-sans">Potret dokumentasi kemeriahan literasi kreatif dan ruang baca perpustakaan.</p>
              </div>

              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {MOCK_GALLERY.map((photo) => (
                  <div key={photo.id} className="relative group overflow-hidden rounded-2xl border border-gray-200/50 shadow-soft break-inside-avoid">
                    <img src={photo.url} alt={photo.caption} className="w-full h-auto object-cover transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <p className="text-[11px] text-white font-navigation font-semibold">{photo.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* FAQ SECTION (Moved to Main Page) */}
          <section id="faq" className="py-24 bg-white border-b border-gray-200/40">
            <div className="chapter-container max-w-4xl space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Informasi Layanan</span>
                <h2 className="text-3xl font-bold text-gray-900 font-sans">Pertanyaan Umum (FAQ)</h2>
                <p className="text-xs text-gray-400 font-sans">Jawaban atas pertanyaan yang paling sering diajukan pengunjung.</p>
              </div>

              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <div key={index} className="bg-white rounded-xl border border-gray-150 overflow-hidden shadow-soft">
                    <button
                      onClick={() => setActiveFaq(activeFaq === index ? null : index)}
                      className="w-full text-left p-4.5 flex items-center justify-between font-navigation text-sm font-semibold text-primary-600 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown 
                        size={16} 
                        className={`text-primary-500 transition-transform duration-300 ${activeFaq === index ? "transform rotate-180" : ""}`} 
                      />
                    </button>
                    {activeFaq === index && (
                      <div className="p-4.5 pt-0 border-t border-gray-50 text-xs text-gray-500 leading-relaxed font-sans">
                        {faq.a}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* KONTAK & MAPS SECTION (Moved to Main Page) */}
          <section id="contact" className="py-24 bg-white">
            <div className="chapter-container space-y-12">
              <div className="max-w-2xl space-y-3">
                <span className="text-xs uppercase tracking-widest text-primary-500 font-navigation font-bold">Bab Kontak</span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 font-sans">Pusat Bantuan & Lokasi</h2>
                <p className="text-xs text-gray-400 font-sans">Hubungi admin atau kunjungi gedung perpustakaan kami melalui peta rute berikut.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Message Form (7 cols) */}
                <div className="lg:col-span-7 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 font-navigation">Form Hubungi Kami</h3>
                  
                  {contactSuccess ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-2xl text-center space-y-3">
                      <CheckCircle size={32} className="mx-auto text-green-600 animate-bounce" />
                      <h4 className="font-bold text-base">Pesan Anda Terkirim!</h4>
                      <p className="text-xs text-green-650">Terima kasih atas laporan Anda. Hubungan Masyarakat kami akan segera merespons aduan Anda.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleContactSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] font-navigation text-gray-500 font-bold uppercase">Nama Lengkap</label>
                          <input
                            type="text"
                            required
                            value={contactForm.name}
                            onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-paper-100 border border-gray-250 rounded-lg focus:outline-none focus:border-primary-500 text-xs font-sans"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-navigation text-gray-500 font-bold uppercase">Email</label>
                          <input
                            type="email"
                            required
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                            className="w-full px-3 py-2 bg-paper-100 border border-gray-250 rounded-lg focus:outline-none focus:border-primary-500 text-xs font-sans"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-navigation text-gray-500 font-bold uppercase">Isi Pesan</label>
                        <textarea
                          required
                          rows={4}
                          value={contactForm.message}
                          onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                          className="w-full px-3 py-2 bg-paper-100 border border-gray-250 rounded-lg focus:outline-none focus:border-primary-500 text-xs font-sans resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-navigation text-xs font-bold transition-colors cursor-pointer"
                      >
                        Kirim Aduan
                      </button>
                    </form>
                  )}
                </div>

                {/* Maps & Medsos (5 cols) */}
                <div className="lg:col-span-5 space-y-6">
                  <h3 className="text-lg font-bold text-gray-900 font-navigation">Detail Kontak & Peta</h3>
                  
                  {/* Map box */}
                  <div className="relative h-56 w-full rounded-2xl overflow-hidden border border-gray-150 bg-paper-100 flex flex-col justify-center items-center text-center p-4">
                    <MapPin size={24} className="text-primary-500 animate-bounce mb-2" />
                    <h5 className="font-navigation text-xs font-bold text-gray-800 font-semibold">Jl. Sastra Kencana No. 45, Kota Buku</h5>
                    <p className="text-[10px] text-gray-400 max-w-xs leading-relaxed pt-1">Gedung Utama Sektor Timur (Samping Danau Kota).</p>
                    <div className="mt-3 px-3 py-1.5 rounded bg-white text-[10px] text-primary-500 font-bold border border-primary-100 shadow-soft cursor-pointer">
                      Tunjukkan Arah Google Maps
                    </div>
                  </div>

                  <div className="bg-paper-100 p-5 rounded-xl border border-gray-150 space-y-3 font-sans text-xs text-gray-500">
                    <div className="flex items-center gap-3"><Mail size={16} className="text-primary-500" /> <span>info@perpustakaankota.go.id</span></div>
                    <div className="flex items-center gap-3"><Phone size={16} className="text-primary-500" /> <span>(021) 8899-7766</span></div>
                  </div>

                  {/* Social media */}
                  <div className="space-y-3">
                    <h4 className="text-[10px] uppercase tracking-widest text-gray-400 font-navigation font-bold">Ikuti Media Sosial</h4>
                    <div className="flex gap-4">
                      {[
                        { icon: <Facebook size={16} />, link: "#", color: "hover:bg-[#1877F2]" },
                        { icon: <Twitter size={16} />, link: "#", color: "hover:bg-[#1DA1F2]" },
                        { icon: <Instagram size={16} />, link: "#", color: "hover:bg-[#E1306C]" },
                        { icon: <Youtube size={16} />, link: "#", color: "hover:bg-[#FF0000]" }
                      ].map((soc, idx) => (
                        <a
                          key={idx}
                          href={soc.link}
                          className={`w-9 h-9 rounded-full bg-paper-100 text-gray-400 hover:text-white flex items-center justify-center border border-gray-200 transition-all ${soc.color}`}
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

          {/* FOOTER */}
          <footer className="bg-white border-t border-gray-250/20 py-12 text-gray-400 font-sans text-xs">
            <div className="chapter-container flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-[10px]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-primary-500 flex items-center justify-center text-white">
                  <BookOpen size={12} />
                </div>
                <span className="font-navigation font-bold tracking-wider uppercase">Digital Book Experience</span>
              </div>
              <p>© 2026 Digital Book Experience. Hak Cipta Dilindungi Undang-Undang.</p>
              <div className="flex gap-4 font-navigation">
                <span className="hover:underline cursor-pointer">Kebijakan Privasi</span>
                <span className="hover:underline cursor-pointer">Ketentuan Layanan</span>
              </div>
            </div>
          </footer>
        </div>
      )}

    </div>
  );
}
