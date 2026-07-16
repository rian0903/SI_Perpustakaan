"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, LayoutDashboard, FileText, Calendar, Image as ImageIcon, 
  Settings, Users, HelpCircle, LogOut, Plus, Trash2, Edit, CheckCircle, 
  X, AlertCircle, Eye, EyeOff, User as UserIcon, ShieldAlert, Sliders,
  Mail, MapPin, Phone, MessageSquare, Clock, Globe, ShieldCheck, Loader2
} from "lucide-react";
import axios from "axios";

// Initial Mock Populate Data
const INITIAL_NEWS = [
  { id: "news-1", title: "Festival Literasi Kota 2026: Mengembalikan Kehangatan Membaca Buku Fisik", content: "Festival tahunan ini diselenggarakan untuk merayakan budaya membaca...", category: "Komunitas", date: "12 Juli 2026", published: true, thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop" },
  { id: "news-2", title: "Implementasi Kecerdasan Buatan dalam Kategorisasi Buku Perpustakaan", content: "Dalam upaya meningkatkan akurasi pencarian katalog digital perpustakaan...", category: "Teknologi", date: "28 Juni 2026", published: true, thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop" },
  { id: "news-3", title: "Donasi 1.500 Buku Langka dari Yayasan Indonesia Membaca Resmi Diterima", content: "Koleksi sejarah dan manuskrip kuno abad ke-18 telah disumbangkan...", category: "Berita", date: "15 Juni 2026", published: false, thumbnail: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop" }
];

const INITIAL_EVENTS = [
  { id: "event-1", title: "Bedah Buku: 'Dunia di Dalam Lembaran Kertas'", date: "2026-07-25", time: "10:00 - 12:00 WIB", location: "Ruang Aula Utama, Lantai 2", speaker: "Rian Pratama", capacity: 50, registeredCount: 38, thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop" },
  { id: "event-2", title: "Workshop Menulis Kreatif Untuk Remaja: Menemukan Suara Tulisanmu", date: "2026-08-02", time: "13:00 - 16:00 WIB", location: "Ruang Diskusi Kreatif 2", speaker: "Sinta Aulia", capacity: 30, registeredCount: 29, thumbnail: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=600&auto=format&fit=crop" }
];

const INITIAL_FAQS = [
  { id: 1, question: "Apakah berkunjung ke perpustakaan atau mengakses portal ini dipungut biaya?", answer: "Tidak sama sekali. Masuk ke perpustakaan fisik, membaca koleksi di tempat, menggunakan Wi-Fi, dan mengakses portal digital ini 100% gratis untuk umum.", order: 1 },
  { id: 2, question: "Bagaimana cara menjadi anggota resmi perpustakaan?", answer: "Pendaftaran dapat diajukan secara online dengan mengisi formulir di bagian bawah halaman ini, lalu datang ke bagian administrasi membawa KTP/Kartu Pelajar untuk pengambilan kartu fisik.", order: 2 }
];

const INITIAL_BANNERS = [
  { id: 1, title: "Membuka Lembaran Baru Ilmu Pengetahuan", subtitle: "Akses ribuan buku fisik dan jurnal digital secara gratis", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop", order: 1, active: true },
  { id: 2, title: "Festival Literasi Kota 2026", subtitle: "Ikuti bedah buku, workshop kreatif, dan pameran literasi", imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop", order: 2, active: true }
];

const INITIAL_GALLERY = [
  { id: "gal-1", title: "Ruang Baca Utama Sisi Timur", description: "Potret kenyamanan ruang baca hening utama", thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=500&auto=format&fit=crop", images: [{ imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=500&auto=format&fit=crop", caption: "Meja belajar utama" }] }
];

const INITIAL_CONTACTS = [
  { id: "con-1", name: "Ahmad Dahlan", email: "dahlan@gmail.com", subject: "Saran Buku", message: "Mohon perbanyak buku tentang teknologi blockchain terbaru.", isRead: false, createdAt: new Date().toISOString() },
  { id: "con-2", name: "Rina Wijaya", email: "rina@yahoo.com", subject: "Fasilitas Wi-Fi", message: "Wi-Fi di ruang baca lantai 2 kadang terputus sendiri. Mohon diperiksa.", isRead: true, createdAt: new Date().toISOString() }
];

const INITIAL_USERS = [
  { id: "usr-1", email: "superadmin@perpustakaan.go.id", name: "Super Admin Kota Buku", role: "SUPER_ADMIN" },
  { id: "usr-2", email: "admin@perpustakaan.go.id", name: "Admin Sastra", role: "ADMIN" }
];

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [offline, setOffline] = useState(false);

  // CMS Content States
  const [news, setNews] = useState(INITIAL_NEWS);
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [faqs, setFaqs] = useState(INITIAL_FAQS);
  const [banners, setBanners] = useState(INITIAL_BANNERS);
  const [gallery, setGallery] = useState(INITIAL_GALLERY);
  const [contacts, setContacts] = useState(INITIAL_CONTACTS);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [settings, setSettings] = useState([
    { key: "site_address", value: "Jl. Sastra Kencana No. 45, Kota Buku" },
    { key: "site_email", value: "info@perpustakaankota.go.id" },
    { key: "site_phone", value: "(021) 8899-7766" }
  ]);
  const [socials, setSocials] = useState([
    { platform: "facebook", url: "https://facebook.com" },
    { platform: "twitter", url: "https://twitter.com" },
    { platform: "instagram", url: "https://instagram.com" }
  ]);

  // Form Modals / Input States
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  // Dynamic Form Fields state
  const [newsForm, setNewsForm] = useState({ title: "", category: "Berita", content: "", published: true, thumbnail: "" });
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "", location: "", speaker: "", capacity: 50, thumbnail: "" });
  const [faqForm, setFaqForm] = useState({ question: "", answer: "", order: 1 });
  const [bannerForm, setBannerForm] = useState({ title: "", subtitle: "", imageUrl: "", linkUrl: "", order: 1, active: true });
  const [galleryForm, setGalleryForm] = useState({ title: "", description: "", thumbnail: "" });
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "", role: "ADMIN" });

  const [notif, setNotif] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 4000);
  };

  const fetchBackendData = async (token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resNews, resEvents, resFaq, resBanners, resGallery, resContacts, resUsers, resSettings, resSocials] = await Promise.all([
        axios.get(`${apiUrl}/cms/news`),
        axios.get(`${apiUrl}/cms/events`),
        axios.get(`${apiUrl}/cms/faq`),
        axios.get(`${apiUrl}/cms/banners`),
        axios.get(`${apiUrl}/cms/gallery`),
        axios.get(`${apiUrl}/cms/contacts`, { headers }),
        axios.get(`${apiUrl}/cms/users`, { headers }).catch(() => ({ data: INITIAL_USERS })), // Super Admin only failover
        axios.get(`${apiUrl}/cms/settings`),
        axios.get(`${apiUrl}/cms/social-media`)
      ]);

      if (resNews.data) setNews(resNews.data);
      if (resEvents.data) setEvents(resEvents.data);
      if (resFaq.data) setFaqs(resFaq.data);
      if (resBanners.data) setBanners(resBanners.data);
      if (resGallery.data) setGallery(resGallery.data);
      if (resContacts.data) setContacts(resContacts.data);
      if (resUsers.data) setUsers(resUsers.data);
      if (resSettings.data && resSettings.data.length > 0) setSettings(resSettings.data);
      if (resSocials.data && resSocials.data.length > 0) setSocials(resSocials.data);
    } catch (err) {
      console.error("Failed to load real backend data, continuing in offline simulator mode:", err.message);
      setOffline(true);
    }
  };

  // Auth Protection and API Data Loading
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("admin_token");
      const storedUser = localStorage.getItem("admin_user");
      const offlineMode = localStorage.getItem("offline_mode") === "true";

      if (!token || !storedUser) {
        router.push("/admin/login");
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setOffline(offlineMode);

      // If online, fetch actual database data
      if (!offlineMode) {
        await fetchBackendData(token);
      }
    };

    initAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    localStorage.removeItem("offline_mode");
    router.push("/admin/login");
  };

  // ==========================================
  // GENERAL ACTION HANDLERS (CRUD MOCK + REAL)
  // ==========================================
  const handleOpenAddModal = () => {
    setEditingItem(null);
    // Reset forms
    setNewsForm({ title: "", category: "Berita", content: "", published: true, thumbnail: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?q=80&w=600&auto=format&fit=crop" });
    setEventForm({ title: "", description: "", date: "", time: "09:00 - 12:00 WIB", location: "Gedung Ruang Multi-Media", speaker: "", capacity: 50, thumbnail: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop" });
    setFaqForm({ question: "", answer: "", order: faqs.length + 1 });
    setBannerForm({ title: "", subtitle: "", imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=600&auto=format&fit=crop", linkUrl: "#", order: banners.length + 1, active: true });
    setGalleryForm({ title: "", description: "", thumbnail: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?q=80&w=500&auto=format&fit=crop" });
    setUserForm({ name: "", email: "", password: "", role: "ADMIN" });
    setShowModal(true);
  };

  const handleOpenEditModal = (item) => {
    setEditingItem(item);
    if (activeTab === "news") {
      setNewsForm({ title: item.title, category: item.category?.name || item.category, content: item.content, published: item.published, thumbnail: item.thumbnail });
    } else if (activeTab === "events") {
      setEventForm({ title: item.title, description: item.description, date: item.date?.split("T")[0] || item.date, time: item.time, location: item.location, speaker: item.speaker, capacity: item.capacity, thumbnail: item.thumbnail });
    } else if (activeTab === "faq") {
      setFaqForm({ question: item.question, answer: item.answer, order: item.order });
    } else if (activeTab === "banner") {
      setBannerForm({ title: item.title, subtitle: item.subtitle, imageUrl: item.imageUrl, linkUrl: item.linkUrl, order: item.order, active: item.active });
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data ini?")) return;

    if (offline) {
      if (activeTab === "news") setNews(news.filter(n => n.id !== id));
      else if (activeTab === "events") setEvents(events.filter(e => e.id !== id));
      else if (activeTab === "faq") setFaqs(faqs.filter(f => f.id !== id));
      else if (activeTab === "banner") setBanners(banners.filter(b => b.id !== id));
      else if (activeTab === "gallery") setGallery(gallery.filter(g => g.id !== id));
      else if (activeTab === "user") setUsers(users.filter(u => u.id !== id));
      showNotification("Data berhasil dihapus (Offline)");
      return;
    }

    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.delete(`${apiUrl}/cms/${activeTab === "banner" || activeTab === "faq" ? `${activeTab}s` : activeTab === "user" ? "users" : activeTab}/${id}`, { headers });
      showNotification("Data berhasil dihapus dari database.");
      fetchBackendData(token);
    } catch (err) {
      showNotification("Gagal menghapus data dari API: " + err.message, "error");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setShowModal(false);

    if (offline) {
      // Offline local states CRUD simulator
      if (activeTab === "news") {
        if (editingItem) {
          setNews(news.map(n => n.id === editingItem.id ? { ...n, ...newsForm } : n));
          showNotification("Berita berhasil diperbarui (Offline)");
        } else {
          setNews([...news, { id: `news-${Date.now()}`, ...newsForm, date: "Hari ini" }]);
          showNotification("Berita baru berhasil ditambahkan (Offline)");
        }
      } else if (activeTab === "events") {
        if (editingItem) {
          setEvents(events.map(ev => ev.id === editingItem.id ? { ...ev, ...eventForm } : ev));
          showNotification("Event berhasil diperbarui (Offline)");
        } else {
          setEvents([...events, { id: `event-${Date.now()}`, ...eventForm, registeredCount: 0 }]);
          showNotification("Event baru berhasil ditambahkan (Offline)");
        }
      } else if (activeTab === "faq") {
        if (editingItem) {
          setFaqs(faqs.map(f => f.id === editingItem.id ? { ...f, ...faqForm } : f));
          showNotification("FAQ berhasil diperbarui (Offline)");
        } else {
          setFaqs([...faqs, { id: Date.now(), ...faqForm }]);
          showNotification("FAQ baru berhasil ditambahkan (Offline)");
        }
      } else if (activeTab === "banner") {
        if (editingItem) {
          setBanners(banners.map(b => b.id === editingItem.id ? { ...b, ...bannerForm } : b));
          showNotification("Banner berhasil diperbarui (Offline)");
        } else {
          setBanners([...banners, { id: Date.now(), ...bannerForm }]);
          showNotification("Banner baru berhasil ditambahkan (Offline)");
        }
      } else if (activeTab === "gallery") {
        setGallery([...gallery, { id: `gal-${Date.now()}`, ...galleryForm, images: [] }]);
        showNotification("Album galeri baru berhasil ditambahkan (Offline)");
      } else if (activeTab === "user") {
        setUsers([...users, { id: `usr-${Date.now()}`, name: userForm.name, email: userForm.email, role: userForm.role }]);
        showNotification("Admin baru berhasil ditambahkan (Offline)");
      }
      return;
    }

    // Online DB API CRUD
    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      let payload = {};
      if (activeTab === "news") {
        payload = { ...newsForm, categoryName: newsForm.category };
      } else if (activeTab === "events") {
        payload = eventForm;
      } else if (activeTab === "faq") {
        payload = faqForm;
      } else if (activeTab === "banner") {
        payload = bannerForm;
      } else if (activeTab === "gallery") {
        payload = galleryForm;
      } else if (activeTab === "user") {
        payload = userForm;
      }

      const endpoint = activeTab === "banner" || activeTab === "faq" ? `${activeTab}s` : activeTab === "user" ? "users" : activeTab;

      if (editingItem) {
        await axios.put(`${apiUrl}/cms/${endpoint}/${editingItem.id}`, payload, { headers });
        showNotification("Data berhasil diperbarui.");
      } else {
        await axios.post(`${apiUrl}/cms/${endpoint}`, payload, { headers });
        showNotification("Data baru berhasil dibuat.");
      }
      fetchBackendData(token);
    } catch (err) {
      showNotification("Gagal menyimpan data ke API: " + err.message, "error");
    }
  };

  const handleMarkContactRead = async (id) => {
    if (offline) {
      setContacts(contacts.map(c => c.id === id ? { ...c, isRead: true } : c));
      showNotification("Aduan ditandai sebagai dibaca (Offline)");
      return;
    }

    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.patch(`${apiUrl}/cms/contacts/${id}/read`, {}, { headers });
      showNotification("Aduan ditandai sebagai dibaca.");
      fetchBackendData(token);
    } catch (err) {
      showNotification("Gagal memperbarui status aduan: " + err.message, "error");
    }
  };

  const handleUpdateSettings = async (e, key, val) => {
    e.preventDefault();
    if (user?.role !== "SUPER_ADMIN") {
      showNotification("Hanya Super Admin yang dapat mengubah pengaturan.", "error");
      return;
    }

    if (offline) {
      setSettings(settings.map(s => s.key === key ? { ...s, value: val } : s));
      showNotification("Pengaturan disimpan (Offline)");
      return;
    }

    const token = localStorage.getItem("admin_token");
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      await axios.post(`${apiUrl}/cms/settings`, { key, value: val }, { headers });
      showNotification("Pengaturan berhasil disimpan.");
      fetchBackendData(token);
    } catch (err) {
      showNotification("Gagal menyimpan pengaturan: " + err.message, "error");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper-100">
        <Loader2 className="animate-spin text-primary-500" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row text-xs font-sans">
      
      {/* -------------------- NOTIFICATION POPUP -------------------- */}
      {notif && (
        <div className={`fixed bottom-6 right-6 z-55 px-5 py-3 rounded-xl border shadow-floating flex items-center gap-3 transition-all animate-bounce ${
          notif.type === "error" ? "bg-red-50 border-red-200 text-red-700" : "bg-green-50 border-green-200 text-green-700"
        }`}>
          {notif.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span className="font-semibold">{notif.msg}</span>
        </div>
      )}

      {/* -------------------- ADMIN SIDEBAR -------------------- */}
      <aside className="w-full md:w-64 bg-gray-900 text-gray-400 flex flex-col justify-between shrink-0">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <div className="w-7 h-7 rounded bg-primary-500 flex items-center justify-center text-white">
                <BookOpen size={14} />
              </div>
              <span className="font-navigation font-bold tracking-wider uppercase text-[10px]">CMS Panel</span>
            </div>
            {offline && (
              <span className="px-2 py-0.5 rounded bg-yellow-500/20 text-yellow-500 text-[8px] font-bold uppercase">
                Simulasi Offline
              </span>
            )}
          </div>

          {/* Profile details */}
          <div className="p-6 bg-gray-950/40 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-900/40 text-primary-400 border border-primary-500/20 flex items-center justify-center font-bold">
              {user.name.charAt(0)}
            </div>
            <div className="space-y-0.5">
              <h4 className="text-white font-bold font-navigation truncate max-w-[140px]">{user.name}</h4>
              <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-primary-400">
                {user.role === "SUPER_ADMIN" ? <ShieldCheck size={10} /> : <UserIcon size={10} />}
                <span>{user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Konten"}</span>
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="p-4 space-y-1">
            {[
              { id: "overview", label: "Ringkasan", icon: <LayoutDashboard size={14} />, role: "ADMIN" },
              { id: "news", label: "Kelola Berita", icon: <FileText size={14} />, role: "ADMIN" },
              { id: "events", label: "Kelola Event", icon: <Calendar size={14} />, role: "ADMIN" },
              { id: "gallery", label: "Kelola Galeri", icon: <ImageIcon size={14} />, role: "ADMIN" },
              { id: "banner", label: "Kelola Banner", icon: <Sliders size={14} />, role: "ADMIN" },
              { id: "faq", label: "Kelola FAQ", icon: <HelpCircle size={14} />, role: "ADMIN" },
              { id: "user", label: "Kelola User", icon: <Users size={14} />, role: "SUPER_ADMIN" },
              { id: "settings", label: "Pengaturan & Medsos", icon: <Settings size={14} />, role: "ADMIN" }
            ].map((menu) => {
              const isLocked = menu.role === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN";
              return (
                <button
                  key={menu.id}
                  disabled={isLocked}
                  onClick={() => {
                    setActiveTab(menu.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 rounded-lg font-navigation font-bold text-left transition-all ${
                    isLocked 
                      ? "opacity-40 cursor-not-allowed text-gray-650"
                      : activeTab === menu.id 
                        ? "bg-primary-500 text-white shadow-soft" 
                        : "hover:bg-gray-800 text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {menu.icon}
                    <span>{menu.label}</span>
                  </div>
                  {isLocked && <ShieldAlert size={12} className="text-red-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-gray-450 hover:text-white hover:bg-gray-800 font-navigation font-bold transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* -------------------- MAIN DISPLAY AREA -------------------- */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        {/* Top Navbar */}
        <header className="bg-white border-b border-gray-200/60 px-8 py-5 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900 font-navigation uppercase tracking-wider">
              {activeTab === "overview" && "Ringkasan Website"}
              {activeTab === "news" && "Kelola Artikel Berita"}
              {activeTab === "events" && "Kelola Agenda Event"}
              {activeTab === "gallery" && "Koleksi Galeri Foto"}
              {activeTab === "banner" && "Slider Banner Landing"}
              {activeTab === "faq" && "Kelola Tanya Jawab (FAQ)"}
              {activeTab === "user" && "Manajemen Akun Administrator"}
              {activeTab === "settings" && "Konfigurasi Kesekretariatan"}
            </h2>
            <p className="text-[10px] text-gray-400 font-sans">Mengatur konten website utama Perpustakaan Kota Buku</p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-gray-400">Status Server: </span>
            <div className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
              offline 
                ? "bg-yellow-50 border-yellow-250 text-yellow-600" 
                : "bg-green-50 border-green-250 text-green-600"
            }`}>
              {offline ? "Simulasi Offline" : "Terkoneksi API"}
            </div>
          </div>
        </header>

        {/* Dynamic Inner Panel View */}
        <div className="p-8 flex-1 space-y-8 max-w-6xl">
          
          {/* ==========================================
              TAB VIEW: OVERVIEW
              ========================================== */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Stat Boxes */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { label: "Total Berita", val: news.length, color: "border-primary-500", bg: "bg-primary-50/50" },
                  { label: "Total Event", val: events.length, color: "border-purple-500", bg: "bg-purple-50/50" },
                  { label: "Album Galeri", val: gallery.length, color: "border-blue-500", bg: "bg-blue-50/50" },
                  { label: "Tanya Jawab (FAQ)", val: faqs.length, color: "border-orange-500", bg: "bg-orange-50/50" }
                ].map((box, idx) => (
                  <div key={idx} className={`p-5 bg-white rounded-2xl border border-gray-200/50 shadow-soft flex flex-col justify-between border-l-4 ${box.color} ${box.bg}`}>
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest font-bold font-navigation">{box.label}</span>
                    <span className="text-3xl font-bold text-gray-900 font-sans pt-3">{box.val}</span>
                  </div>
                ))}
              </div>

              {/* Inquiry Aduan List */}
              <div className="bg-white rounded-2xl border border-gray-200/50 shadow-soft p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h3 className="text-sm font-bold text-gray-900 font-navigation flex items-center gap-1.5">
                    <MessageSquare size={16} className="text-primary-500" />
                    <span>Aduan & Pesan Masuk Pengunjung</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-[9px] font-bold uppercase">
                    {contacts.filter(c => !c.isRead).length} Belum Dibaca
                  </span>
                </div>

                <div className="divide-y divide-gray-100">
                  {contacts.map((c) => (
                    <div key={c.id} className={`py-4 flex flex-col sm:flex-row justify-between gap-4 items-start ${c.isRead ? "opacity-60" : ""}`}>
                      <div className="space-y-1">
                        <div className="flex gap-2 items-center">
                          <span className="font-bold text-xs text-gray-900 font-navigation">{c.name}</span>
                          <span className="text-[10px] text-gray-400 font-sans">({c.email})</span>
                          {!c.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          )}
                        </div>
                        <p className="font-semibold text-primary-650 text-[10px]">{c.subject}</p>
                        <p className="text-xs text-gray-500 leading-relaxed font-sans">{c.message}</p>
                      </div>
                      
                      {!c.isRead && (
                        <button
                          onClick={() => handleMarkContactRead(c.id)}
                          className="px-3.5 py-1.5 rounded-lg bg-primary-500 hover:bg-primary-600 text-white font-bold font-navigation cursor-pointer text-[10px]"
                        >
                          Tandai Dibaca
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: NEWS
              ========================================== */}
          {activeTab === "news" && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 font-navigation">Daftar Artikel Berita</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah Berita Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Judul Artikel</th>
                      <th className="pb-3">Kategori</th>
                      <th className="pb-3">Tanggal</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {news.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40">
                        <td className="py-4 font-bold text-gray-900 font-navigation truncate max-w-xs">{item.title}</td>
                        <td className="py-4 text-gray-500">{item.category?.name || item.category}</td>
                        <td className="py-4 text-gray-400">{item.date}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            item.published 
                              ? "bg-green-50 border-green-200 text-green-600" 
                              : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}>
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg cursor-pointer inline-flex"><Edit size={12} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: EVENTS
              ========================================== */}
          {activeTab === "events" && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 font-navigation">Daftar Agenda Kegiatan</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah Event Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Nama Event</th>
                      <th className="pb-3">Tanggal & Waktu</th>
                      <th className="pb-3">Lokasi</th>
                      <th className="pb-3">Pembicara</th>
                      <th className="pb-3">Kapasitas Pendaftar</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {events.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40">
                        <td className="py-4 font-bold text-gray-900 font-navigation truncate max-w-[200px]">{item.title}</td>
                        <td className="py-4 text-gray-500">{item.date} ({item.time})</td>
                        <td className="py-4 text-gray-450 truncate max-w-[120px]">{item.location}</td>
                        <td className="py-4 font-bold text-primary-600">{item.speaker}</td>
                        <td className="py-4 text-gray-400">
                          {item.registeredCount} / {item.capacity} Kursi
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg cursor-pointer inline-flex"><Edit size={12} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: GALLERY
              ========================================== */}
          {activeTab === "gallery" && (
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft flex justify-between items-center">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 font-navigation">Kelola Album Dokumentasi</h3>
                  <p className="text-[10px] text-gray-400 font-sans">Buat album visual dan kelola foto kegiatan.</p>
                </div>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Buat Album Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {gallery.map((album) => (
                  <div key={album.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-soft overflow-hidden flex flex-col justify-between">
                    <div className="h-40 relative bg-gray-100">
                      <img src={album.thumbnail} alt={album.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded bg-black/60 text-white text-[9px] font-bold">
                        {album.images?.length || 0} Foto
                      </div>
                    </div>
                    <div className="p-5 space-y-4">
                      <div className="space-y-1">
                        <h4 className="font-bold text-gray-900 font-navigation text-xs leading-snug">{album.title}</h4>
                        <p className="text-[10px] text-gray-400 font-sans line-clamp-2">{album.description}</p>
                      </div>

                      <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                        <button onClick={() => handleDelete(album.id)} className="w-full py-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg font-bold font-navigation flex items-center justify-center gap-1 cursor-pointer">
                          <Trash2 size={12} />
                          <span>Hapus Album</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: BANNER
              ========================================== */}
          {activeTab === "banner" && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 font-navigation">Kelola Slider Banner Hero</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah Banner</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Judul Banner</th>
                      <th className="pb-3">Subtitle</th>
                      <th className="pb-3">Urutan</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {banners.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40">
                        <td className="py-4 font-bold text-gray-900 font-navigation truncate max-w-xs">{item.title}</td>
                        <td className="py-4 text-gray-500 truncate max-w-xs">{item.subtitle}</td>
                        <td className="py-4 text-primary-500 font-bold">{item.order}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            item.active 
                              ? "bg-green-50 border-green-200 text-green-600" 
                              : "bg-gray-50 border-gray-200 text-gray-500"
                          }`}>
                            {item.active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg cursor-pointer inline-flex"><Edit size={12} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: FAQ
              ========================================== */}
          {activeTab === "faq" && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 font-navigation">Kelola Tanya Jawab (FAQ)</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah FAQ Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Pertanyaan</th>
                      <th className="pb-3">Jawaban</th>
                      <th className="pb-3">Order</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {faqs.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40">
                        <td className="py-4 font-bold text-gray-900 font-navigation truncate max-w-xs">{item.question}</td>
                        <td className="py-4 text-gray-550 truncate max-w-sm">{item.answer}</td>
                        <td className="py-4 text-primary-500 font-bold">{item.order}</td>
                        <td className="py-4 text-right space-x-2">
                          <button onClick={() => handleOpenEditModal(item)} className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-lg cursor-pointer inline-flex"><Edit size={12} /></button>
                          <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-red-50 hover:bg-red-100 text-red-500 rounded-lg cursor-pointer inline-flex"><Trash2 size={12} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: USER
              ========================================== */}
          {activeTab === "user" && user.role === "SUPER_ADMIN" && (
            <div className="space-y-4 bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="text-sm font-bold text-gray-900 font-navigation">Kelola Akun Administrator</h3>
                <button
                  onClick={handleOpenAddModal}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Tambah Admin Baru</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                      <th className="pb-3">Nama Admin</th>
                      <th className="pb-3">Email</th>
                      <th className="pb-3">Role Akses</th>
                      <th className="pb-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {users.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/40">
                        <td className="py-4 font-bold text-gray-900 font-navigation">{item.name}</td>
                        <td className="py-4 text-gray-500">{item.email}</td>
                        <td className="py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            item.role === "SUPER_ADMIN" 
                              ? "bg-red-50 border-red-200 text-red-600" 
                              : "bg-blue-50 border-blue-200 text-blue-600"
                          }`}>
                            {item.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Konten"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <button 
                            disabled={item.id === user.id}
                            onClick={() => handleDelete(item.id)} 
                            className={`p-1.5 rounded-lg inline-flex ${
                              item.id === user.id 
                                ? "bg-gray-100 text-gray-300 cursor-not-allowed" 
                                : "bg-red-50 hover:bg-red-100 text-red-500 cursor-pointer"
                            }`}
                          >
                            <Trash2 size={12} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==========================================
              TAB VIEW: SETTINGS
              ========================================== */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Profile Secretariat Info Form */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft space-y-6">
                <h3 className="text-sm font-bold text-gray-900 font-navigation border-b border-gray-100 pb-3 flex items-center gap-1.5">
                  <MapPin size={16} className="text-primary-500" />
                  <span>Detail Profil Sekretariat</span>
                </h3>

                {settings.map((set) => (
                  <form key={set.key} onSubmit={(e) => handleUpdateSettings(e, set.key, e.target.elements[set.key].value)} className="space-y-2">
                    <label className="text-[10px] font-navigation text-gray-400 font-bold uppercase block">
                      {set.key === "site_address" && "Alamat Fisik Gedung"}
                      {set.key === "site_email" && "Email Kantor Humas"}
                      {set.key === "site_phone" && "Nomor Telepon Sekretariat"}
                    </label>
                    <div className="flex gap-2">
                      <input
                        name={set.key}
                        type="text"
                        defaultValue={set.value}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-xs font-sans"
                      />
                      <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer text-[10px]">
                        Simpan
                      </button>
                    </div>
                  </form>
                ))}
              </div>

              {/* Social Media links */}
              <div className="bg-white p-6 rounded-2xl border border-gray-200/50 shadow-soft space-y-6">
                <h3 className="text-sm font-bold text-gray-900 font-navigation border-b border-gray-100 pb-3 flex items-center gap-1.5">
                  <Globe size={16} className="text-primary-500" />
                  <span>Kanal Informasi Media Sosial</span>
                </h3>

                {socials.map((soc) => (
                  <form 
                    key={soc.platform} 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      const urlVal = e.target.elements.url.value;
                      if (offline) {
                        setSocials(socials.map(s => s.platform === soc.platform ? { ...s, url: urlVal } : s));
                        showNotification(`Media sosial ${soc.platform} disimpan (Offline)`);
                        return;
                      }
                      const token = localStorage.getItem("admin_token");
                      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                      const headers = { Authorization: `Bearer ${token}` };
                      try {
                        await axios.post(`${apiUrl}/cms/social-media`, { platform: soc.platform, url: urlVal }, { headers });
                        showNotification(`Media sosial ${soc.platform} disimpan.`);
                        fetchBackendData(token);
                      } catch (err) {
                        showNotification("Gagal menyimpan media sosial: " + err.message, "error");
                      }
                    }} 
                    className="space-y-2"
                  >
                    <label className="text-[10px] font-navigation text-gray-400 font-bold uppercase block">{soc.platform}</label>
                    <div className="flex gap-2">
                      <input
                        name="url"
                        type="url"
                        defaultValue={soc.url}
                        className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-primary-500 focus:bg-white text-xs font-sans"
                      />
                      <button type="submit" className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer text-[10px]">
                        Simpan
                      </button>
                    </div>
                  </form>
                ))}
              </div>

            </div>
          )}

        </div>
      </main>

      {/* -------------------- DYNAMIC FORMS MODAL DIALOG -------------------- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-250/30 shadow-large overflow-hidden">
            <header className="px-6 py-4 bg-gray-50 border-b border-gray-150 flex items-center justify-between">
              <h4 className="text-xs font-bold text-gray-900 font-navigation uppercase tracking-wider">
                {editingItem ? "Ubah Data" : "Tambah Data Baru"}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-650 cursor-pointer">
                <X size={16} />
              </button>
            </header>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              
              {/* Form fields for NEWS */}
              {activeTab === "news" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Judul Artikel</label>
                    <input 
                      type="text" 
                      required 
                      value={newsForm.title} 
                      onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Kategori</label>
                      <select 
                        value={newsForm.category} 
                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="Berita">Berita</option>
                        <option value="Komunitas">Komunitas</option>
                        <option value="Teknologi">Teknologi</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Status Publikasi</label>
                      <select 
                        value={newsForm.published ? "true" : "false"} 
                        onChange={(e) => setNewsForm({ ...newsForm, published: e.target.value === "true" })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="true">Published</option>
                        <option value="false">Draft</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Thumbnail URL Gambar</label>
                    <input 
                      type="text" 
                      value={newsForm.thumbnail} 
                      onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Isi Konten Artikel</label>
                    <textarea 
                      required 
                      rows={5} 
                      value={newsForm.content} 
                      onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Form fields for EVENTS */}
              {activeTab === "events" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Nama Event</label>
                    <input 
                      type="text" 
                      required 
                      value={eventForm.title} 
                      onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Tanggal Pelaksanaan</label>
                      <input 
                        type="date" 
                        required 
                        value={eventForm.date} 
                        onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Waktu/Jam</label>
                      <input 
                        type="text" 
                        required 
                        value={eventForm.time} 
                        onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Lokasi Gedung</label>
                      <input 
                        type="text" 
                        required 
                        value={eventForm.location} 
                        onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Kapasitas Kursi</label>
                      <input 
                        type="number" 
                        required 
                        value={eventForm.capacity} 
                        onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value, 10) })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Pembicara / Speaker</label>
                    <input 
                      type="text" 
                      value={eventForm.speaker} 
                      onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Deskripsi Kegiatan</label>
                    <textarea 
                      required 
                      rows={3} 
                      value={eventForm.description} 
                      onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Form fields for FAQ */}
              {activeTab === "faq" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Pertanyaan</label>
                    <input 
                      type="text" 
                      required 
                      value={faqForm.question} 
                      onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Order Urutan Tampil</label>
                    <input 
                      type="number" 
                      required 
                      value={faqForm.order} 
                      onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value, 10) })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Jawaban FAQ</label>
                    <textarea 
                      required 
                      rows={4} 
                      value={faqForm.answer} 
                      onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Form fields for BANNER */}
              {activeTab === "banner" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Judul Banner</label>
                    <input 
                      type="text" 
                      required 
                      value={bannerForm.title} 
                      onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Sub-Judul</label>
                    <input 
                      type="text" 
                      value={bannerForm.subtitle} 
                      onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Urutan Tampil</label>
                      <input 
                        type="number" 
                        required 
                        value={bannerForm.order} 
                        onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value, 10) })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Status Aktif</label>
                      <select 
                        value={bannerForm.active ? "true" : "false"} 
                        onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.value === "true" })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="true">Aktif</option>
                        <option value="false">Nonaktif</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Gambar URL</label>
                    <input 
                      type="text" 
                      required 
                      value={bannerForm.imageUrl} 
                      onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                </div>
              )}

              {/* Form fields for GALLERY */}
              {activeTab === "gallery" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Judul Album</label>
                    <input 
                      type="text" 
                      required 
                      value={galleryForm.title} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Gambar Cover URL</label>
                    <input 
                      type="text" 
                      required 
                      value={galleryForm.thumbnail} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, thumbnail: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Deskripsi Singkat</label>
                    <textarea 
                      required 
                      rows={3} 
                      value={galleryForm.description} 
                      onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs resize-none" 
                    />
                  </div>
                </div>
              )}

              {/* Form fields for USER (Super Admin only) */}
              {activeTab === "user" && user.role === "SUPER_ADMIN" && (
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required 
                      value={userForm.name} 
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Email Admin</label>
                      <input 
                        type="email" 
                        required 
                        value={userForm.email} 
                        onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Role Akses</label>
                      <select 
                        value={userForm.role} 
                        onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} 
                        className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs"
                      >
                        <option value="ADMIN">Admin Konten</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-navigation text-gray-550 font-bold uppercase">Kata Sandi</label>
                    <input 
                      type="password" 
                      required 
                      value={userForm.password} 
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} 
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs" 
                    />
                  </div>
                </div>
              )}

              <footer className="pt-4 border-t border-gray-150 flex gap-2 justify-end">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)} 
                  className="px-4 py-2 border border-gray-200 rounded-lg font-bold font-navigation cursor-pointer"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-bold font-navigation cursor-pointer"
                >
                  Simpan Data
                </button>
              </footer>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
