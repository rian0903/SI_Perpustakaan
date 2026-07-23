"use client";

import React, { useState, useEffect } from "react";
import { 
  BookOpen, ArrowRight, Compass, Calendar, Image as ImageIcon, 
  MapPin, User, ChevronDown, ChevronLeft, ChevronRight, X, Mail, Phone, Clock, Search, 
  AlertCircle, CheckCircle, ArrowUpRight, Facebook, Twitter, Instagram, 
  Youtube, Info, Award, Shield, Library, Users2, Activity, Database, MessageSquare, Send, Globe
} from "lucide-react";
import axios from "axios";

// ---- Helper to resolve image URL ----
const getImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (typeof window !== "undefined" ? `${window.location.protocol}//${window.location.hostname}:3001` : "http://localhost:3001");
  return `${backendUrl}${url.startsWith("/") ? "" : "/"}${url}`;
};

// Mock Banners Data
const MOCK_BANNERS = [
  { id: 1, title: "Membuka Lembaran Baru Ilmu Pengetahuan", subtitle: "Akses ribuan buku fisik dan jurnal digital secara gratis", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=1200&auto=format&fit=crop", order: 1, active: true, linkUrl: "#about" },
  { id: 2, title: "Festival Literasi Kota 2026", subtitle: "Ikuti bedah buku, workshop kreatif, dan pameran literasi", imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=1200&auto=format&fit=crop", order: 2, active: true, linkUrl: "#events" }
];

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
  const [navLogoText, setNavLogoText] = useState("Digital Book Experience");
  const [navLogoUrl, setNavLogoUrl] = useState("");
  const [contactList, setContactList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_contact_buttons");
      if (saved) try { return JSON.parse(saved); } catch (err) {}
    }
    return [
      { id: 1, label: "Hubungi Kami", platform: "whatsapp", value: "6281234567890", active: true },
      { id: 2, label: "DM kami", platform: "instagram", value: "@perpustakaan.bireuen", active: false }
    ];
  });
  const [showContactModal, setShowContactModal] = useState(false);
  const [heroInfo, setHeroInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_hero_info");
      if (saved) try { return JSON.parse(saved); } catch (err) {}
    }
    return {
      badge: "PORTAL LITERASI KOTA",
      title: "Membuka Lembaran Baru",
      titleHighlight: "Ilmu Pengetahuan.",
      subtitle: "Selamat datang di portal perpustakaan kota. Akses ribuan koleksi buku fisik, jurnal digital, dan ikuti kegiatan literasi kreatif kami — gratis untuk semua.",
      cta1Label: "Profil Perpustakaan",
      cta1Link: "#about",
      cta2Label: "Berita Terbaru",
      cta2Link: "#news"
    };
  });

  const [newsList, setNewsList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_news");
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_NEWS;
  });
  const [eventsList, setEventsList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_events");
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_EVENTS;
  });

  const [openStatus, setOpenStatus] = useState({ isOpen: true, text: "Buka Sekarang", dotColor: "bg-emerald-500" });
  const [banners, setBanners] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_banners");
      if (saved) try { return JSON.parse(saved); } catch (e) {}
    }
    return MOCK_BANNERS;
  });
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  const newsBanners = (newsList || []).slice(0, 3).map((item) => ({
    id: `news-${item.id}`,
    title: item.title,
    subtitle: item.content ? (item.content.length > 90 ? item.content.substring(0, 90) + "..." : item.content) : "Berita Terbaru Perpustakaan",
    imageUrl: item.thumbnail,
    badge: `BERITA · ${item.category?.name || item.category || "Berita"}`,
    linkUrl: "#news"
  }));

  const eventBanners = (eventsList || []).slice(0, 3).map((item) => ({
    id: `event-${item.id}`,
    title: item.title,
    subtitle: item.description ? (item.description.length > 90 ? item.description.substring(0, 90) + "..." : item.description) : `Agenda pada ${item.date || ""}`,
    imageUrl: item.thumbnail,
    badge: `KEGIATAN · ${item.date || "Agenda"}`,
    linkUrl: "#events"
  }));

  const customBanners = (banners || []).filter((b) => b.active).map((item) => ({
    id: `custom-${item.id}`,
    title: item.title,
    subtitle: item.subtitle,
    imageUrl: item.imageUrl,
    badge: "BANNER UTAMA",
    linkUrl: item.linkUrl || "#about"
  }));

  const activeBanners = [...newsBanners, ...eventBanners, ...customBanners];

  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  const updateOpeningStatus = () => {
    const now = new Date();
    const day = now.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const hour = now.getHours();
    const minute = now.getMinutes();
    const timeVal = hour + minute / 60;

    // Sunday (Tutup)
    if (day === 0) {
      setOpenStatus({ isOpen: false, text: "Tutup Hari Ini", dotColor: "bg-red-500 animate-pulse" });
      return;
    }
    // Saturday (08:00 - 12:00)
    if (day === 6) {
      if (timeVal >= 8 && timeVal < 12) {
        setOpenStatus({ isOpen: true, text: "Buka Sekarang", dotColor: "bg-emerald-500" });
      } else {
        setOpenStatus({ isOpen: false, text: "Tutup Sekarang", dotColor: "bg-red-500 animate-pulse" });
      }
      return;
    }
    // Weekdays (Monday - Friday: 08:00 - 16:00)
    if (timeVal >= 8 && timeVal < 16) {
      setOpenStatus({ isOpen: true, text: "Buka Sekarang", dotColor: "bg-emerald-500" });
    } else {
      setOpenStatus({ isOpen: false, text: "Tutup Sekarang", dotColor: "bg-red-500 animate-pulse" });
    }
  };

  const buildContactHref = (btn) => {
    if (!btn || !btn.value) return "#contact";
    const cleanVal = String(btn.value).trim();
    switch (btn.platform) {
      case "whatsapp": return `https://wa.me/${cleanVal.replace(/[^0-9]/g, "")}`;
      case "instagram": return `https://instagram.com/${cleanVal.replace(/^@/, "")}`;
      case "email": return `mailto:${cleanVal}`;
      case "telegram": return `https://t.me/${cleanVal.replace(/^@/, "")}`;
      case "custom": return cleanVal;
      default: return cleanVal || "#contact";
    }
  };

  const handleContactClick = (e) => {
    if (e) e.preventDefault();
    let currentList = contactList;
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_contact_buttons");
      if (saved) {
        try { currentList = JSON.parse(saved); } catch (err) {}
      }
    }

    const activeButtons = currentList.filter((b) => b.active);

    if (activeButtons.length === 0) {
      const contactSec = document.querySelector("#contact");
      if (contactSec) contactSec.scrollIntoView({ behavior: "smooth" });
      else window.location.href = "#contact";
    } else if (activeButtons.length === 1) {
      const targetHref = buildContactHref(activeButtons[0]);
      if (targetHref.startsWith("http") || targetHref.startsWith("mailto")) {
        window.open(targetHref, "_blank", "noopener,noreferrer");
      } else {
        window.location.href = targetHref;
      }
    } else {
      setShowContactModal(true);
    }
  };

  const [siteAddress, setSiteAddress] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_site_address");
      if (saved) return saved;
      const settings = localStorage.getItem("cms_settings");
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          const found = parsed.find(s => s.key === "site_address");
          if (found?.value) return found.value;
        } catch(e) {}
      }
    }
    return "Jl. Raya Bireuen - Takengon, Bireun Meunasah Capa, Kec. Kota Juang, Kabupaten Bireuen, Aceh 24261";
  });

  const [siteEmail, setSiteEmail] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_site_email");
      if (saved) return saved;
      const settings = localStorage.getItem("cms_settings");
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          const found = parsed.find(s => s.key === "site_email");
          if (found?.value) return found.value;
        } catch(e) {}
      }
    }
    return "info@perpustakaankota.go.id";
  });

  const [sitePhone, setSitePhone] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_site_phone");
      if (saved) return saved;
      const settings = localStorage.getItem("cms_settings");
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          const found = parsed.find(s => s.key === "site_phone");
          if (found?.value) return found.value;
        } catch(e) {}
      }
    }
    return "(021) 8899-7766";
  });

  const [siteMapsUrl, setSiteMapsUrl] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_site_maps_url");
      if (saved) return saved;
      const settings = localStorage.getItem("cms_settings");
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          const found = parsed.find(s => s.key === "site_maps_url");
          if (found?.value) return found.value;
        } catch(e) {}
      }
    }
    return "https://maps.app.goo.gl/XEp4LbgLnwjMhZHE7";
  });

  const getEmbedMapsUrl = (address, mapsUrl) => {
    if (mapsUrl && (mapsUrl.includes("google.com/maps/embed") || mapsUrl.includes("pb="))) {
      return mapsUrl;
    }
    const cleanAddress = address || "Jl. Raya Bireuen - Takengon, Bireun Meunasah Capa, Kec. Kota Juang, Kabupaten Bireuen, Aceh";
    return `https://www.google.com/maps?q=${encodeURIComponent(cleanAddress)}&output=embed`;
  };

  // Load local & CMS navbar settings
  useEffect(() => {
    const loadLocalSettings = () => {
      const localText = localStorage.getItem("cms_navbar_logo_text");
      const localUrl = localStorage.getItem("cms_navbar_logo_url");
      const localContacts = localStorage.getItem("cms_contact_buttons");
      const localHero = localStorage.getItem("cms_hero_info");
      const localBanners = localStorage.getItem("cms_banners");
      const localNews = localStorage.getItem("cms_news");
      const localEvents = localStorage.getItem("cms_events");
      const localAddress = localStorage.getItem("cms_site_address");
      const localEmail = localStorage.getItem("cms_site_email");
      const localPhone = localStorage.getItem("cms_site_phone");
      const localMaps = localStorage.getItem("cms_site_maps_url");
      const localSettings = localStorage.getItem("cms_settings");

      if (localText) setNavLogoText(localText);
      if (localUrl !== null) setNavLogoUrl(localUrl);
      if (localContacts) {
        try { setContactList(JSON.parse(localContacts)); } catch (err) {}
      }
      if (localHero) {
        try { setHeroInfo(JSON.parse(localHero)); } catch (err) {}
      }
      if (localBanners) {
        try { setBanners(JSON.parse(localBanners)); } catch (err) {}
      }
      if (localNews) {
        try { setNewsList(JSON.parse(localNews)); } catch (err) {}
      }
      if (localEvents) {
        try { setEventsList(JSON.parse(localEvents)); } catch (err) {}
      }
      if (localAddress) setSiteAddress(localAddress);
      if (localEmail) setSiteEmail(localEmail);
      if (localPhone) setSitePhone(localPhone);
      if (localMaps) setSiteMapsUrl(localMaps);

      if (localSettings) {
        try {
          const parsed = JSON.parse(localSettings);
          const sa = parsed.find(s => s.key === "site_address");
          const se = parsed.find(s => s.key === "site_email");
          const sp = parsed.find(s => s.key === "site_phone");
          const sm = parsed.find(s => s.key === "site_maps_url");
          if (sa?.value) setSiteAddress(sa.value);
          if (se?.value) setSiteEmail(se.value);
          if (sp?.value) setSitePhone(sp.value);
          if (sm?.value) setSiteMapsUrl(sm.value);
        } catch(e) {}
      }
    };

    loadLocalSettings();
    updateOpeningStatus();
    const intervalTimer = setInterval(updateOpeningStatus, 60000);

    window.addEventListener("storage", loadLocalSettings);

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    Promise.all([
      axios.get(`${apiUrl}/cms/nav-menu`).catch(() => null),
      axios.get(`${apiUrl}/cms/contact-buttons`).catch(() => null),
      axios.get(`${apiUrl}/cms/settings`).catch(() => null),
      axios.get(`${apiUrl}/cms/banners`).catch(() => null),
      axios.get(`${apiUrl}/cms/news`).catch(() => null),
      axios.get(`${apiUrl}/cms/events`).catch(() => null)
    ]).then(([menuRes, btnRes, settingsRes, bannerRes, newsRes, eventRes]) => {
      if (menuRes?.data?.length) {
        setNavMenu(menuRes.data.filter(m => m.active).sort((a, b) => a.order - b.order));
      }
      if (btnRes?.data?.length) {
        setContactList(btnRes.data);
      }
      if (settingsRes?.data?.length) {
        const lt = settingsRes.data.find(s => s.key === "navbar_logo_text");
        const lu = settingsRes.data.find(s => s.key === "navbar_logo_url");
        const sa = settingsRes.data.find(s => s.key === "site_address");
        const se = settingsRes.data.find(s => s.key === "site_email");
        const sp = settingsRes.data.find(s => s.key === "site_phone");
        const sm = settingsRes.data.find(s => s.key === "site_maps_url");
        if (lt?.value && !localStorage.getItem("cms_navbar_logo_text")) setNavLogoText(lt.value);
        if (lu?.value && !localStorage.getItem("cms_navbar_logo_url")) setNavLogoUrl(lu.value);
        if (sa?.value) setSiteAddress(sa.value);
        if (se?.value) setSiteEmail(se.value);
        if (sp?.value) setSitePhone(sp.value);
        if (sm?.value) setSiteMapsUrl(sm.value);
      }
      if (bannerRes?.data?.length) {
        setBanners(bannerRes.data);
      }
      if (newsRes?.data?.length) {
        setNewsList(newsRes.data);
      }
      if (eventRes?.data?.length) {
        setEventsList(eventRes.data);
      }
    }).catch(() => { /* silently use defaults */ });

    return () => {
      window.removeEventListener("storage", loadLocalSettings);
      clearInterval(intervalTimer);
    };
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
                  <img src={getImageUrl(navLogoUrl)} alt="Logo" className="w-9 h-9 rounded-lg object-cover shadow-soft" />
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
              <button
                onClick={handleContactClick}
                className="btn-primary cursor-pointer font-navigation font-bold"
              >
                Hubungi Kami
              </button>
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
                      {heroInfo.badge || "PORTAL LITERASI KOTA"}
                    </span>
                  </div>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-heading font-navigation leading-tight">
                    {heroInfo.title || "Membuka Lembaran Baru"}{" "}
                    <span className="text-primary-500">{heroInfo.titleHighlight || "Ilmu Pengetahuan."}</span>
                  </h1>

                  <p className="text-base text-body leading-relaxed max-w-lg">
                    {heroInfo.subtitle}
                  </p>

                  <div className="flex flex-wrap gap-4 pt-2">
                    <a href={heroInfo.cta1Link || "#about"} className="btn-primary">
                      <span>{heroInfo.cta1Label || "Profil Perpustakaan"}</span>
                      <ArrowRight size={15} />
                    </a>
                    <a href={heroInfo.cta2Link || "#news"} className="btn-secondary">
                      {heroInfo.cta2Label || "Berita Terbaru"}
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

                {/* Right — Interactive CMS Banner Slider */}
                <div className="flex flex-col items-center lg:items-end w-full">
                  {activeBanners.length > 0 ? (
                    <div className="relative w-full max-w-lg h-80 sm:h-96 rounded-2xl overflow-hidden shadow-medium border border-border-200 group bg-surface-200">
                      {/* Banner Image */}
                      {activeBanners[currentBannerIndex]?.imageUrl ? (
                        <img
                          src={getImageUrl(activeBanners[currentBannerIndex].imageUrl)}
                          alt={activeBanners[currentBannerIndex].title}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full bg-primary-900 flex items-center justify-center">
                          <Library size={64} className="text-white/20" />
                        </div>
                      )}

                      {/* Dark Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/50 to-slate-900/20 flex flex-col justify-between p-6">
                        {/* Top Badge & Open Status */}
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="px-3 py-1 rounded-full bg-slate-900/60 backdrop-blur-md text-white font-bold text-[11px] font-navigation tracking-wide border border-white/40 shadow-md"
                            style={{ color: "#ffffff", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                          >
                            {activeBanners[currentBannerIndex]?.badge || "SOROTAN"} ({currentBannerIndex + 1}/{activeBanners.length})
                          </span>
                          <div
                            className="bg-slate-900/60 backdrop-blur-md rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/40 shadow-md"
                            style={{ color: "#ffffff", textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000" }}
                          >
                            <div className={`w-2 h-2 rounded-full ${openStatus.dotColor}`} />
                            <span className="text-[11px] font-navigation font-bold text-white">{openStatus.text}</span>
                          </div>
                        </div>

                        {/* Banner Content & CTA */}
                        <div className="space-y-3">
                          <h3
                            className="text-xl sm:text-2xl font-bold font-navigation leading-tight !text-white"
                            style={{
                              color: "#ffffff",
                              textShadow: "-1.5px -1.5px 0 #000, 1.5px -1.5px 0 #000, -1.5px 1.5px 0 #000, 1.5px 1.5px 0 #000, 0 4px 12px rgba(0,0,0,0.95)",
                              WebkitTextStroke: "0.4px #000000"
                            }}
                          >
                            {activeBanners[currentBannerIndex]?.title}
                          </h3>
                          {activeBanners[currentBannerIndex]?.subtitle && (
                            <p
                              className="text-xs sm:text-sm font-semibold line-clamp-2 leading-relaxed !text-white"
                              style={{
                                color: "#ffffff",
                                textShadow: "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 2px 6px rgba(0,0,0,0.9)",
                                WebkitTextStroke: "0.2px #000000"
                              }}
                            >
                              {activeBanners[currentBannerIndex].subtitle}
                            </p>
                          )}
                          <div className="pt-1 flex items-center justify-between">
                            <a
                              href={activeBanners[currentBannerIndex]?.linkUrl || "#news"}
                              className="btn-primary !bg-white !text-primary-700 hover:!bg-white/90 !py-2 !px-4 !text-xs font-bold shadow-medium inline-flex items-center gap-1.5 transition-all cursor-pointer"
                            >
                              <span>Lihat Detail</span>
                              <ArrowRight size={13} className="text-primary-700" />
                            </a>

                            {/* Prev / Next Arrows */}
                            {activeBanners.length > 1 && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => setCurrentBannerIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
                                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer"
                                  title="Banner Sebelumnya"
                                >
                                  <ChevronLeft size={16} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setCurrentBannerIndex((prev) => (prev + 1) % activeBanners.length)}
                                  className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-md border border-white/30 flex items-center justify-center transition-all cursor-pointer"
                                  title="Banner Selanjutnya"
                                >
                                  <ChevronRight size={16} />
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Pagination Dots */}
                      {activeBanners.length > 1 && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                          {activeBanners.map((b, idx) => (
                            <button
                              key={b.id || idx}
                              type="button"
                              onClick={() => setCurrentBannerIndex(idx)}
                              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                                idx === currentBannerIndex ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="relative w-72 h-72 md:w-80 md:h-80 lg:w-96 lg:h-96">
                      <div className="absolute inset-0 rounded-full bg-primary-50 border border-primary-100" />
                      <div className="absolute inset-6 rounded-full border-2 border-dashed border-primary-200 animate-spin" style={{ animationDuration: "20s" }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-28 h-28 rounded-2xl bg-white shadow-medium flex items-center justify-center border border-border-200">
                          <Library size={52} className="text-primary-500" />
                        </div>
                      </div>
                    </div>
                  )}
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
                    src={getImageUrl(aboutInfo.historyImageUrl)}
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
                          src={getImageUrl(news.thumbnail)}
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
                        src={getImageUrl(event.thumbnail)}
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
                      src={getImageUrl(photo.url)}
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

                  {/* Live Google Map Container */}
                  <div className="relative h-64 w-full rounded-2xl overflow-hidden border border-border-200 shadow-soft group bg-surface-100">
                    <iframe
                      title="Google Maps Location"
                      src={getEmbedMapsUrl(siteAddress, siteMapsUrl)}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-full"
                    />

                    {/* Floating Bottom Bar with Direct Link Button */}
                    <div className="absolute bottom-3 left-3 right-3 bg-white/95 backdrop-blur-md rounded-xl p-3 border border-white/60 shadow-medium flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                          <MapPin size={14} className="text-primary-500" />
                        </div>
                        <span className="text-xs font-navigation font-bold text-heading truncate">
                          {siteAddress}
                        </span>
                      </div>
                      <a
                        href={siteMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteAddress)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary !py-1.5 !px-3 !text-[11px] shrink-0 inline-flex items-center gap-1 shadow-sm cursor-pointer"
                      >
                        <span>Buka Peta Full</span>
                        <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>

                  {/* Contact details */}
                  <div className="bg-surface-100 p-5 rounded-xl border border-border-200 space-y-3">
                    <div className="flex items-center gap-3 text-sm text-body">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Mail size={14} className="text-primary-500" />
                      </div>
                      <span>{siteEmail}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-body">
                      <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                        <Phone size={14} className="text-primary-500" />
                      </div>
                      <span>{sitePhone}</span>
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

      {/* ====== MODAL OPSI HUBUNGI KAMI (MULTI-CHANNEL) ====== */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-all">
          <div className="bg-white rounded-2xl border border-border-200 shadow-floating w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowContactModal(false)}
              className="absolute top-4 right-4 p-2 text-muted hover:text-heading rounded-full hover:bg-surface-200 transition-colors cursor-pointer"
              aria-label="Tutup Modal"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-6 space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mx-auto shadow-soft">
                <Phone size={22} />
              </div>
              <h3 className="text-xl font-bold text-heading font-navigation">Pilih Saluran Komunikasi</h3>
              <p className="text-xs text-muted">
                Pilih salah satu saluran resmi di bawah ini untuk terhubung langsung dengan tim layanan perpustakaan.
              </p>
            </div>

            <div className="space-y-3">
              {contactList.filter(b => b.active).map((btn) => {
                const href = buildContactHref(btn);
                let channelIcon = <Globe size={20} className="text-primary-500" />;
                if (btn.platform === "whatsapp") channelIcon = <MessageSquare size={20} className="text-emerald-600" />;
                if (btn.platform === "instagram") channelIcon = <Instagram size={20} className="text-pink-600" />;
                if (btn.platform === "email") channelIcon = <Mail size={20} className="text-primary-500" />;
                if (btn.platform === "telegram") channelIcon = <Send size={20} className="text-sky-500" />;
                if (btn.platform === "phone") channelIcon = <Phone size={20} className="text-amber-500" />;

                return (
                  <a
                    key={btn.id}
                    href={href}
                    target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    onClick={() => setShowContactModal(false)}
                    className="flex items-center justify-between p-4 bg-surface-100 hover:bg-primary-50 border border-border-200 hover:border-primary-300 rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-soft border border-border-100 group-hover:scale-105 transition-transform shrink-0">
                        {channelIcon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-heading font-navigation group-hover:text-primary-600 transition-colors">
                          {btn.label}
                        </h4>
                        <p className="text-xs text-muted truncate max-w-[200px]">{btn.value}</p>
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-muted group-hover:text-primary-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-border-200 text-center">
              <button
                onClick={() => setShowContactModal(false)}
                className="text-xs text-muted hover:text-body font-navigation font-medium cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
