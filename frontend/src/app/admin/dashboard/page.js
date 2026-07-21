"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  BookOpen, LayoutDashboard, FileText, Calendar, Image as ImageIcon, 
  Settings, Users, HelpCircle, LogOut, Plus, Trash2, Edit, CheckCircle, 
  X, AlertCircle, Eye, EyeOff, User as UserIcon, ShieldAlert, Sliders,
  Mail, MapPin, Phone, MessageSquare, Clock, Globe, ShieldCheck, Loader2,
  Navigation, Link2, Send, ArrowUp, ArrowDown, ToggleLeft, ToggleRight,
  ChevronRight, ChevronDown, ExternalLink, Info, Activity, Database, Menu
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

const INITIAL_ABOUT = {
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
};

const INITIAL_TEAM = [
  { id: "team-1", name: "Dr. Hendrawan Basuki", role: "Kepala Perpustakaan", desc: "Mengarahkan visi strategis literasi kota." },
  { id: "team-2", name: "Siti Rahmawati, M.Hum", role: "Sekretaris & Operasional", desc: "Mengelola manajemen internal & kemitraan." },
  { id: "team-3", name: "Budi Utomo, S.I.Pust", role: "Kepala Bidang Layanan & TI", desc: "Mengembangkan integrasi sistem & digitalisasi." }
];

const INITIAL_FACILITIES = [
  { id: "fac-1", num: "01", title: "Ruang Baca Hening", desc: "Meja partisi individu dengan pencahayaan baca personal untuk fokus maksimal." },
  { id: "fac-2", num: "02", title: "Lab Komputer & E-Library", desc: "Workstation komputer terhubung basis data jurnal internasional premium." },
  { id: "fac-3", num: "03", title: "Kids Literacy Area", desc: "Sudut buku cerita edukatif, karpet bermain, dan ruang dongeng anak." },
  { id: "fac-4", num: "04", title: "Taman Diskusi Terbuka", desc: "Ruang luar hijau yang nyaman untuk mendiskusikan buku dengan santai." }
];

const INITIAL_STATS = [
  { id: "stat-1", value: "25.000+", label: "Koleksi Buku Fisik" },
  { id: "stat-2", value: "10.500+", label: "Anggota Aktif" },
  { id: "stat-3", value: "120+", label: "Kegiatan / Tahun" },
  { id: "stat-4", value: "5.000+", label: "E-Journal Premium" }
];

const INITIAL_FOOTER_INFO = {
  brandName: "Perpustakaan Kota Buku",
  description: "Pusat layanan literasi dan informasi terpadu untuk masyarakat Kota Buku. Gratis untuk semua.",
  address: "Jl. Sastra Kencana No. 45, Kota Buku",
  email: "info@perpustakaankota.go.id",
  phone: "(021) 8899-7766",
  copyright: "© 2026 Perpustakaan Kota Buku. Hak Cipta Dilindungi Undang-Undang."
};

const INITIAL_FOOTER_HOURS = [
  { id: "fh-1", days: "Senin — Jumat", hours: "08:00 — 18:00" },
  { id: "fh-2", days: "Sabtu — Minggu", hours: "09:00 — 15:00" }
];

const INITIAL_FOOTER_LINKS = [
  { id: "fl-1", label: "Kebijakan Privasi", url: "#privacy" },
  { id: "fl-2", label: "Ketentuan Layanan", url: "#terms" }
];

// ---- Reusable styled form input ----
const FormInput = ({ label, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="lib-label">{label}</label>}
    <input className="lib-input text-sm" {...props} />
  </div>
);

const FormTextarea = ({ label, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="lib-label">{label}</label>}
    <textarea className="lib-input resize-none text-sm" {...props} />
  </div>
);

const FormSelect = ({ label, options, ...props }) => (
  <div className="space-y-1.5">
    {label && <label className="lib-label">{label}</label>}
    <select className="lib-input text-sm" {...props}>
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ---- Table with lib-table styling ----
const DataTable = ({ headers, rows, onEdit, onDelete, renderRow }) => (
  <div className="overflow-x-auto rounded-xl border border-border-200">
    <table className="lib-table">
      <thead>
        <tr>
          {headers.map((h, i) => (
            <th key={i} className={h.right ? "text-right" : ""}>{h.label}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => renderRow(row, i, onEdit, onDelete))}
      </tbody>
    </table>
  </div>
);

// ---- Action buttons ----
const ActionEdit = ({ onClick }) => (
  <button onClick={onClick} title="Edit" className="p-1.5 bg-primary-50 hover:bg-primary-100 text-primary-600 rounded-lg cursor-pointer inline-flex transition-colors">
    <Edit size={13} />
  </button>
);
const ActionDelete = ({ onClick, disabled }) => (
  <button onClick={onClick} disabled={disabled} title="Hapus" className={`p-1.5 rounded-lg inline-flex transition-colors ${disabled ? "bg-gray-100 text-gray-300 cursor-not-allowed" : "bg-danger-50 hover:bg-red-100 text-danger-500 cursor-pointer"}`}>
    <Trash2 size={13} />
  </button>
);

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

  // Navbar CMS States
  const [navMenuItems, setNavMenuItems] = useState([
    { id: 1, label: "Tentang", target: "#about", order: 1, active: true },
    { id: 2, label: "Statistik", target: "#stats", order: 2, active: true },
    { id: 3, label: "Berita", target: "#news", order: 3, active: true },
    { id: 4, label: "Kegiatan", target: "#events", order: 4, active: true },
    { id: 5, label: "Galeri", target: "#gallery", order: 5, active: true },
    { id: 6, label: "FAQ", target: "#faq", order: 6, active: true }
  ]);
  const [contactButtons, setContactButtons] = useState([
    { id: 1, label: "Hubungi Kami", platform: "whatsapp", value: "6281234567890", active: true }
  ]);
  const [navMenuForm, setNavMenuForm] = useState({ label: "", target: "", order: 1, active: true });
  const [contactBtnForm, setContactBtnForm] = useState({ label: "", platform: "whatsapp", value: "", active: true });
  const [editingNavMenu, setEditingNavMenu] = useState(null);
  const [editingContactBtn, setEditingContactBtn] = useState(null);
  const [showNavMenuModal, setShowNavMenuModal] = useState(false);
  const [showContactBtnModal, setShowContactBtnModal] = useState(false);
  const [logoText, setLogoText] = useState("Digital Book Experience");
  const [logoUrl, setLogoUrl] = useState("");

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

  // Tentang & Statistik CRUD States
  const [aboutInfo, setAboutInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_about_info");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_ABOUT;
  });
  const [teamList, setTeamList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_team_list");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_TEAM;
  });
  const [facilityList, setFacilityList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_facility_list");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_FACILITIES;
  });
  const [statsList, setStatsList] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_stats_list");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_STATS;
  });

  // Modal Forms for CRUD
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [editingTeam, setEditingTeam] = useState(null);
  const [teamForm, setTeamForm] = useState({ name: "", role: "", desc: "" });

  const [showFacModal, setShowFacModal] = useState(false);
  const [editingFac, setEditingFac] = useState(null);
  const [facForm, setFacForm] = useState({ num: "01", title: "", desc: "" });

  const [showStatModal, setShowStatModal] = useState(false);
  const [editingStat, setEditingStat] = useState(null);
  const [statForm, setStatForm] = useState({ value: "", label: "" });

  // Footer CRUD States
  const [footerInfo, setFooterInfo] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_footer_info");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_FOOTER_INFO;
  });
  const [footerHours, setFooterHours] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_footer_hours");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_FOOTER_HOURS;
  });
  const [footerLinks, setFooterLinks] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_footer_links");
      if (saved) try { return JSON.parse(saved); } catch(e) {}
    }
    return INITIAL_FOOTER_LINKS;
  });

  const [showFooterHoursModal, setShowFooterHoursModal] = useState(false);
  const [editingFooterHours, setEditingFooterHours] = useState(null);
  const [footerHoursForm, setFooterHoursForm] = useState({ days: "", hours: "" });

  const [showFooterLinkModal, setShowFooterLinkModal] = useState(false);
  const [editingFooterLink, setEditingFooterLink] = useState(null);
  const [footerLinkForm, setFooterLinkForm] = useState({ label: "", url: "#" });

  const [notif, setNotif] = useState(null);

  const showNotification = (msg, type = "success") => {
    setNotif({ msg, type });
    setTimeout(() => setNotif(null), 4000);
  };

  const fetchBackendData = async (token) => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [resNews, resEvents, resFaq, resBanners, resGallery, resContacts, resUsers, resSettings, resSocials, resNavMenu, resContactBtns] = await Promise.all([
        axios.get(`${apiUrl}/cms/news`),
        axios.get(`${apiUrl}/cms/events`),
        axios.get(`${apiUrl}/cms/faq`),
        axios.get(`${apiUrl}/cms/banners`),
        axios.get(`${apiUrl}/cms/gallery`),
        axios.get(`${apiUrl}/cms/contacts`, { headers }),
        axios.get(`${apiUrl}/cms/users`, { headers }).catch(() => ({ data: INITIAL_USERS })),
        axios.get(`${apiUrl}/cms/settings`),
        axios.get(`${apiUrl}/cms/social-media`),
        axios.get(`${apiUrl}/cms/nav-menu`),
        axios.get(`${apiUrl}/cms/contact-buttons`)
      ]);

      if (resNews.data) setNews(resNews.data);
      if (resEvents.data) setEvents(resEvents.data);
      if (resFaq.data) setFaqs(resFaq.data);
      if (resBanners.data) setBanners(resBanners.data);
      if (resGallery.data) setGallery(resGallery.data);
      if (resContacts.data) setContacts(resContacts.data);
      if (resUsers.data) setUsers(resUsers.data);
      if (resSettings.data && resSettings.data.length > 0) {
        setSettings(resSettings.data);
        const lt = resSettings.data.find(s => s.key === "navbar_logo_text");
        const lu = resSettings.data.find(s => s.key === "navbar_logo_url");
        if (lt) setLogoText(lt.value);
        if (lu) setLogoUrl(lu.value);
      }
      if (resSocials.data && resSocials.data.length > 0) setSocials(resSocials.data);
      if (resNavMenu.data && resNavMenu.data.length > 0) setNavMenuItems(resNavMenu.data);
      if (resContactBtns.data && resContactBtns.data.length > 0) setContactButtons(resContactBtns.data);
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
      <div className="min-h-screen flex items-center justify-center bg-surface-100">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary-500 flex items-center justify-center">
            <BookOpen size={22} className="text-white" />
          </div>
          <Loader2 className="animate-spin text-primary-500" size={24} />
          <p className="text-sm text-muted font-navigation">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  // Tab page title map
  const TAB_TITLES = {
    overview: "Ringkasan Dashboard",
    about: "Kelola Section Tentang Kami",
    stats: "Kelola Section Statistik",
    news: "Kelola Artikel Berita",
    events: "Kelola Agenda Kegiatan",
    gallery: "Koleksi Galeri Foto",
    banner: "Slider Banner Landing",
    faq: "Kelola Tanya Jawab (FAQ)",
    user: "Manajemen Akun Administrator",
    navbar: "Pengaturan Navbar Landing Page",
    footer: "Pengaturan Footer Landing Page",
    settings: "Konfigurasi Kesekretariatan"
  };

  const SIDEBAR_MENU = [
    { id: "overview", label: "Ringkasan", icon: <LayoutDashboard size={16} />, role: "ADMIN" },
    { id: "about", label: "Kelola Tentang", icon: <Info size={16} />, role: "ADMIN" },
    { id: "stats", label: "Kelola Statistik", icon: <Activity size={16} />, role: "ADMIN" },
    { id: "news", label: "Kelola Berita", icon: <FileText size={16} />, role: "ADMIN" },
    { id: "events", label: "Kelola Event", icon: <Calendar size={16} />, role: "ADMIN" },
    { id: "gallery", label: "Kelola Galeri", icon: <ImageIcon size={16} />, role: "ADMIN" },
    { id: "banner", label: "Kelola Banner", icon: <Sliders size={16} />, role: "ADMIN" },
    { id: "faq", label: "Kelola FAQ", icon: <HelpCircle size={16} />, role: "ADMIN" },
    { id: "user", label: "Kelola User", icon: <Users size={16} />, role: "SUPER_ADMIN" },
    { id: "navbar", label: "Pengaturan Navbar", icon: <Navigation size={16} />, role: "SUPER_ADMIN" },
    { id: "footer", label: "Kelola Footer", icon: <BookOpen size={16} />, role: "ADMIN" },
    { id: "settings", label: "Pengaturan & Medsos", icon: <Settings size={16} />, role: "ADMIN" }
  ];

  return (
    <div className="min-h-screen bg-surface-100 flex flex-col md:flex-row text-sm font-sans relative overflow-x-hidden">

      {/* ==================== NOTIFICATION TOAST ==================== */}
      {notif && (
        <div className={`lib-toast ${notif.type === "error" ? "error" : "success"}`}>
          {notif.type === "error" ? <AlertCircle size={16} /> : <CheckCircle size={16} />}
          <span>{notif.msg}</span>
        </div>
      )}

      {/* ==================== MOBILE TOP HEADER (< md) ==================== */}
      <header className="md:hidden text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-soft" style={{ backgroundColor: "#005BAC" }}>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-white/10 text-white hover:bg-white/20 transition-colors cursor-pointer"
            aria-label="Menu Navigasi Mobile"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          <div className="flex items-center gap-2">
            <BookOpen size={18} className="text-white" />
            <span className="font-navigation font-bold text-sm text-white tracking-wide">CMS Panel</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-white/80 font-navigation font-medium truncate max-w-[110px]">{user.name}</span>
          <button
            onClick={handleLogout}
            title="Keluar Sesi"
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* ==================== MOBILE OVERLAY BACKDROP (< md) ==================== */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* ==================== SIDEBAR (DESKTOP & MOBILE DRAWER) ==================== */}
      <aside
        className={`fixed md:sticky top-0 left-0 bottom-0 z-50 md:z-30 w-72 md:w-64 flex flex-col shrink-0 transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ backgroundColor: "#005BAC", height: "100vh" }}
      >
        {/* Brand Header */}
        <div className="px-5 py-5 border-b flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.15)" }}>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0">
              <BookOpen size={16} />
            </div>
            <span className="font-navigation font-bold text-white text-sm tracking-wide">CMS Panel</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="md:hidden text-white/70 hover:text-white p-1 cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* User Profile */}
        <div className="px-5 py-4 border-b" style={{ borderColor: "rgba(255,255,255,0.10)", backgroundColor: "rgba(0,0,0,0.10)" }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white/30 bg-white/15 flex items-center justify-center font-bold text-white text-base shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-white font-navigation font-bold text-sm truncate">{user.name}</p>
              <div className="flex items-center gap-1 mt-0.5">
                {user.role === "SUPER_ADMIN" ? <ShieldCheck size={11} className="text-gold-300" /> : <UserIcon size={11} className="text-white/50" />}
                <span className="text-xs font-navigation text-white/60 font-medium">
                  {user.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Konten"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto" aria-label="Menu admin">
          {SIDEBAR_MENU.map((menu) => {
            const isLocked = menu.role === "SUPER_ADMIN" && user.role !== "SUPER_ADMIN";
            const isActive = activeTab === menu.id;
            return (
              <button
                key={menu.id}
                disabled={isLocked}
                onClick={() => { setActiveTab(menu.id); setIsMobileMenuOpen(false); }}
                className={`sidebar-item ${isActive ? "active" : ""} ${isLocked ? "locked" : ""}`}
              >
                <div className="flex items-center gap-2.5 flex-1">
                  {menu.icon}
                  <span>{menu.label}</span>
                </div>
                {isLocked && <ShieldAlert size={12} className="text-white/30" />}
                {isActive && <ChevronRight size={14} className="text-white" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
          <button
            onClick={handleLogout}
            className="sidebar-item text-white/60 hover:text-white hover:bg-white/10"
          >
            <LogOut size={16} />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </aside>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* Desktop Header Bar */}
        <header className="bg-white border-b border-border-200 px-4 md:px-8 py-4 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div>
            <h1 className="text-base font-bold text-heading font-navigation">
              {TAB_TITLES[activeTab] || activeTab}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-muted mt-0.5">
              <span>Dashboard</span>
              <ChevronRight size={12} />
              <span className="text-primary-500 font-medium">{TAB_TITLES[activeTab]}</span>
            </div>
          </div>
        </header>

        {/* Panel Content */}
        <div className="p-6 md:p-8 flex-1 space-y-6">

          {/* ====== OVERVIEW TAB ====== */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                {[
                  { label: "Total Berita", val: news.length, icon: <FileText size={20} />, color: "text-primary-500", bg: "bg-primary-50" },
                  { label: "Total Event", val: events.length, icon: <Calendar size={20} />, color: "text-purple-600", bg: "bg-purple-50" },
                  { label: "Album Galeri", val: gallery.length, icon: <ImageIcon size={20} />, color: "text-blue-600", bg: "bg-blue-50" },
                  { label: "Tanya Jawab", val: faqs.length, icon: <HelpCircle size={20} />, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((box, idx) => (
                  <div key={idx} className="stat-card">
                    <div className={`w-12 h-12 rounded-xl ${box.bg} ${box.color} flex items-center justify-center mb-4`}>
                      {box.icon}
                    </div>
                    <div className="stat-value">{box.val}</div>
                    <div className="stat-label">{box.label}</div>
                  </div>
                ))}
              </div>

              {/* Contacts / Inquiries */}
              <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
                <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <MessageSquare size={15} className="text-primary-500" />
                    </div>
                    <h3 className="font-bold text-heading font-navigation">Aduan & Pesan Masuk Pengunjung</h3>
                  </div>
                  <span className="badge badge-danger">{contacts.filter(c => !c.isRead).length} Belum Dibaca</span>
                </div>

                <div className="divide-y divide-border-100">
                  {contacts.map((c) => (
                    <div key={c.id} className={`px-6 py-5 flex flex-col sm:flex-row justify-between gap-4 items-start transition-colors hover:bg-surface-100 ${c.isRead ? "opacity-50" : ""}`}>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-heading font-navigation">{c.name}</span>
                          <span className="text-xs text-muted">({c.email})</span>
                          {!c.isRead && (
                            <span className="w-2 h-2 rounded-full bg-danger-500 animate-pulse shrink-0" />
                          )}
                        </div>
                        <p className="text-xs font-semibold text-primary-600 font-navigation">{c.subject}</p>
                        <p className="text-sm text-body leading-relaxed">{c.message}</p>
                      </div>
                      {!c.isRead && (
                        <button
                          onClick={() => handleMarkContactRead(c.id)}
                          className="btn-primary !py-1.5 !px-3 !text-xs shrink-0"
                        >
                          <CheckCircle size={13} />
                          <span>Tandai Dibaca</span>
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ====== KELOLA TENTANG TAB (FULL CRUD) ====== */}
          {activeTab === "about" && (
            <div className="space-y-6">
              {/* Header Info Form */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border-200 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Info size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading font-navigation">Informasi Profil & Sejarah Utama</h3>
                    <p className="text-xs text-muted">Atur teks pembuka, sejarah, dan visi perpustakaan.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (typeof window !== "undefined") {
                    localStorage.setItem("cms_about_info", JSON.stringify(aboutInfo));
                  }
                  showNotification("Profil & Sejarah berhasil diperbarui!");
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormInput label="Eyebrow Section" value={aboutInfo.eyebrow} onChange={(e) => setAboutInfo({ ...aboutInfo, eyebrow: e.target.value })} />
                    <FormInput label="Judul Utama Section" value={aboutInfo.title} onChange={(e) => setAboutInfo({ ...aboutInfo, title: e.target.value })} />
                  </div>
                  <FormInput label="Deskripsi Subtitle" value={aboutInfo.subtitle} onChange={(e) => setAboutInfo({ ...aboutInfo, subtitle: e.target.value })} />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-border-200">
                    <FormTextarea label="Paragraf Sejarah 1" rows={3} value={aboutInfo.historyP1} onChange={(e) => setAboutInfo({ ...aboutInfo, historyP1: e.target.value })} />
                    <FormTextarea label="Paragraf Sejarah 2" rows={3} value={aboutInfo.historyP2} onChange={(e) => setAboutInfo({ ...aboutInfo, historyP2: e.target.value })} />
                  </div>

                  <FormInput label="URL Foto Sejarah" value={aboutInfo.historyImageUrl} onChange={(e) => setAboutInfo({ ...aboutInfo, historyImageUrl: e.target.value })} />

                  <div className="flex justify-end pt-2">
                    <button type="submit" className="btn-primary !py-2 !px-5">Simpan Profil Utama</button>
                  </div>
                </form>
              </div>

              {/* CRUD Pengurus / Tim */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Users size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Struktur Pengurus Perpustakaan</h3>
                      <p className="text-xs text-muted">Kelola daftar kepala dan pengelola perpustakaan (CRUD).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingTeam(null); setTeamForm({ name: "", role: "", desc: "" }); setShowTeamModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Pengurus</span>
                  </button>
                </div>

                <DataTable
                  headers={[{ label: "Nama Pengurus" }, { label: "Jabatan / Role" }, { label: "Deskripsi Tugas" }, { label: "Aksi", right: true }]}
                  rows={teamList}
                  renderRow={(item) => (
                    <tr key={item.id}>
                      <td className="font-semibold text-heading">{item.name}</td>
                      <td><span className="badge badge-primary">{item.role}</span></td>
                      <td className="text-muted text-xs">{item.desc}</td>
                      <td className="text-right space-x-1.5">
                        <ActionEdit onClick={() => { setEditingTeam(item); setTeamForm({ name: item.name, role: item.role, desc: item.desc }); setShowTeamModal(true); }} />
                        <ActionDelete onClick={() => {
                          if (!confirm(`Hapus pengurus "${item.name}"?`)) return;
                          const updated = teamList.filter(t => t.id !== item.id);
                          setTeamList(updated);
                          if (typeof window !== "undefined") localStorage.setItem("cms_team_list", JSON.stringify(updated));
                          showNotification("Pengurus berhasil dihapus.");
                        }} />
                      </td>
                    </tr>
                  )}
                />
              </div>

              {/* CRUD Fasilitas Utama */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <BookOpen size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Fasilitas Utama</h3>
                      <p className="text-xs text-muted">Kelola daftar fasilitas yang dapat dinikmati pengunjung (CRUD).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingFac(null); setFacForm({ num: `0${facilityList.length + 1}`, title: "", desc: "" }); setShowFacModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Fasilitas</span>
                  </button>
                </div>

                <DataTable
                  headers={[{ label: "No." }, { label: "Nama Fasilitas" }, { label: "Deskripsi Fasilitas" }, { label: "Aksi", right: true }]}
                  rows={facilityList}
                  renderRow={(item) => (
                    <tr key={item.id}>
                      <td><span className="font-bold text-primary-500">{item.num}</span></td>
                      <td className="font-semibold text-heading">{item.title}</td>
                      <td className="text-muted text-xs">{item.desc}</td>
                      <td className="text-right space-x-1.5">
                        <ActionEdit onClick={() => { setEditingFac(item); setFacForm({ num: item.num, title: item.title, desc: item.desc }); setShowFacModal(true); }} />
                        <ActionDelete onClick={() => {
                          if (!confirm(`Hapus fasilitas "${item.title}"?`)) return;
                          const updated = facilityList.filter(f => f.id !== item.id);
                          setFacilityList(updated);
                          if (typeof window !== "undefined") localStorage.setItem("cms_facility_list", JSON.stringify(updated));
                          showNotification("Fasilitas berhasil dihapus.");
                        }} />
                      </td>
                    </tr>
                  )}
                />
              </div>
            </div>
          )}

          {/* ====== KELOLA STATISTIK TAB (FULL CRUD) ====== */}
          {activeTab === "stats" && (
            <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
              <div className="flex items-center justify-between border-b border-border-200 pb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Activity size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading font-navigation">Statistik Layanan Perpustakaan</h3>
                    <p className="text-xs text-muted">Tambah, ubah, dan hapus metrik angka statistik yang tampil di strip banner (CRUD).</p>
                  </div>
                </div>
                <button
                  onClick={() => { setEditingStat(null); setStatForm({ value: "", label: "" }); setShowStatModal(true); }}
                  className="btn-primary !py-2 !px-4"
                >
                  <Plus size={14} />
                  <span>Tambah Statistik</span>
                </button>
              </div>

              <DataTable
                headers={[{ label: "Angka / Nilai" }, { label: "Deskripsi Label" }, { label: "Aksi", right: true }]}
                rows={statsList}
                renderRow={(item) => (
                  <tr key={item.id}>
                    <td><span className="font-bold text-base text-primary-500 font-navigation">{item.value}</span></td>
                    <td className="font-semibold text-heading">{item.label}</td>
                    <td className="text-right space-x-1.5">
                      <ActionEdit onClick={() => { setEditingStat(item); setStatForm({ value: item.value, label: item.label }); setShowStatModal(true); }} />
                      <ActionDelete onClick={() => {
                        if (!confirm(`Hapus statistik "${item.label}"?`)) return;
                        const updated = statsList.filter(s => s.id !== item.id);
                        setStatsList(updated);
                        if (typeof window !== "undefined") localStorage.setItem("cms_stats_list", JSON.stringify(updated));
                        showNotification("Statistik berhasil dihapus.");
                      }} />
                    </td>
                  </tr>
                )}
              />
            </div>
          )}

          {/* ====== KELOLA FOOTER TAB (FULL CRUD) ====== */}
          {activeTab === "footer" && (
            <div className="space-y-6">
              {/* Brand & Teks Footer Form */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border-200 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <BookOpen size={16} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading font-navigation">Informasi Brand & Hak Cipta Footer</h3>
                    <p className="text-xs text-muted">Atur nama brand, deskripsi singkat, dan hak cipta footer.</p>
                  </div>
                </div>

                <form onSubmit={(e) => {
                  e.preventDefault();
                  if (typeof window !== "undefined") {
                    localStorage.setItem("cms_footer_info", JSON.stringify(footerInfo));
                  }
                  showNotification("Informasi Footer berhasil disimpan!");
                }} className="space-y-4">
                  <FormInput label="Nama Brand Footer" value={footerInfo.brandName} onChange={(e) => setFooterInfo({ ...footerInfo, brandName: e.target.value })} />
                  <FormTextarea label="Deskripsi Singkat" rows={2} value={footerInfo.description} onChange={(e) => setFooterInfo({ ...footerInfo, description: e.target.value })} />
                  <FormInput label="Teks Hak Cipta / Copyright" value={footerInfo.copyright} onChange={(e) => setFooterInfo({ ...footerInfo, copyright: e.target.value })} />

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border-200">
                    <FormInput label="Alamat Gedung" value={footerInfo.address} onChange={(e) => setFooterInfo({ ...footerInfo, address: e.target.value })} />
                    <FormInput label="Email Resmi" value={footerInfo.email} onChange={(e) => setFooterInfo({ ...footerInfo, email: e.target.value })} />
                    <FormInput label="Telepon Hotline" value={footerInfo.phone} onChange={(e) => setFooterInfo({ ...footerInfo, phone: e.target.value })} />
                  </div>

                  <div className="flex justify-end pt-2">
                    <button type="submit" className="btn-primary !py-2 !px-5">Simpan Informasi Footer</button>
                  </div>
                </form>
              </div>

              {/* CRUD Jam Operasional Footer */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Clock size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Jam Operasional Layanan Footer</h3>
                      <p className="text-xs text-muted">Kelola jadwal hari & jam operasional yang tampil di footer (CRUD).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingFooterHours(null); setFooterHoursForm({ days: "", hours: "" }); setShowFooterHoursModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Jam Operasional</span>
                  </button>
                </div>

                <DataTable
                  headers={[{ label: "Hari / Jangkauan" }, { label: "Jam Layanan" }, { label: "Aksi", right: true }]}
                  rows={footerHours}
                  renderRow={(item) => (
                    <tr key={item.id}>
                      <td className="font-semibold text-heading">{item.days}</td>
                      <td><span className="badge badge-primary">{item.hours}</span></td>
                      <td className="text-right space-x-1.5">
                        <ActionEdit onClick={() => { setEditingFooterHours(item); setFooterHoursForm({ days: item.days, hours: item.hours }); setShowFooterHoursModal(true); }} />
                        <ActionDelete onClick={() => {
                          if (!confirm(`Hapus jam operasional "${item.days}"?`)) return;
                          const updated = footerHours.filter(h => h.id !== item.id);
                          setFooterHours(updated);
                          if (typeof window !== "undefined") localStorage.setItem("cms_footer_hours", JSON.stringify(updated));
                          showNotification("Jam operasional berhasil dihapus.");
                        }} />
                      </td>
                    </tr>
                  )}
                />
              </div>

              {/* CRUD Tautan / Link Footer */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Link2 size={16} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Tautan / Link Bawah Footer</h3>
                      <p className="text-xs text-muted">Kelola link navigasi cepat (Kebijakan Privasi, Ketentuan Layanan, dll.) (CRUD).</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingFooterLink(null); setFooterLinkForm({ label: "", url: "#" }); setShowFooterLinkModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Link Footer</span>
                  </button>
                </div>

                <DataTable
                  headers={[{ label: "Label Tautan" }, { label: "URL / Target Link" }, { label: "Aksi", right: true }]}
                  rows={footerLinks}
                  renderRow={(item) => (
                    <tr key={item.id}>
                      <td className="font-semibold text-heading">{item.label}</td>
                      <td><code className="text-xs text-primary-600 bg-primary-50 px-2 py-1 rounded">{item.url}</code></td>
                      <td className="text-right space-x-1.5">
                        <ActionEdit onClick={() => { setEditingFooterLink(item); setFooterLinkForm({ label: item.label, url: item.url }); setShowFooterLinkModal(true); }} />
                        <ActionDelete onClick={() => {
                          if (!confirm(`Hapus link "${item.label}"?`)) return;
                          const updated = footerLinks.filter(l => l.id !== item.id);
                          setFooterLinks(updated);
                          if (typeof window !== "undefined") localStorage.setItem("cms_footer_links", JSON.stringify(updated));
                          showNotification("Link footer berhasil dihapus.");
                        }} />
                      </td>
                    </tr>
                  )}
                />
              </div>
            </div>
          )}

          {/* ====== NEWS TAB ====== */}
          {activeTab === "news" && (
            <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                <h3 className="font-bold text-heading font-navigation">Daftar Artikel Berita</h3>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Tambah Berita</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="lib-table">
                  <thead><tr>
                    <th>Judul Artikel</th>
                    <th>Kategori</th>
                    <th>Tanggal</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {news.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-heading max-w-xs truncate">{item.title}</td>
                        <td><span className="badge badge-primary">{item.category?.name || item.category}</span></td>
                        <td className="text-muted">{item.date}</td>
                        <td>
                          <span className={`badge ${item.published ? "badge-success" : "badge-gray"}`}>
                            {item.published ? "Published" : "Draft"}
                          </span>
                        </td>
                        <td className="text-right space-x-1.5">
                          <ActionEdit onClick={() => handleOpenEditModal(item)} />
                          <ActionDelete onClick={() => handleDelete(item.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== EVENTS TAB ====== */}
          {activeTab === "events" && (
            <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                <h3 className="font-bold text-heading font-navigation">Daftar Agenda Kegiatan</h3>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Tambah Event</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="lib-table">
                  <thead><tr>
                    <th>Nama Event</th>
                    <th>Tanggal & Waktu</th>
                    <th>Lokasi</th>
                    <th>Pembicara</th>
                    <th>Kapasitas</th>
                    <th className="text-right">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {events.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-heading max-w-[200px] truncate">{item.title}</td>
                        <td className="text-muted">{item.date} ({item.time})</td>
                        <td className="text-muted max-w-[120px] truncate">{item.location}</td>
                        <td className="font-semibold text-primary-600">{item.speaker}</td>
                        <td className="text-muted">{item.registeredCount} / {item.capacity}</td>
                        <td className="text-right space-x-1.5">
                          <ActionEdit onClick={() => handleOpenEditModal(item)} />
                          <ActionDelete onClick={() => handleDelete(item.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== GALLERY TAB ====== */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              <div className="bg-white rounded-xl border border-border-200 shadow-soft px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-heading font-navigation">Kelola Album Dokumentasi</h3>
                  <p className="text-xs text-muted mt-0.5">Buat album visual dan kelola foto kegiatan.</p>
                </div>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Buat Album</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {gallery.map((album) => (
                  <div key={album.id} className="lib-card">
                    <div className="h-40 relative bg-surface-200">
                      <img src={album.thumbnail} alt={album.title} className="w-full h-full object-cover" loading="lazy" />
                      <div className="absolute top-2.5 right-2.5">
                        <span className="badge badge-gray">{album.images?.length || 0} Foto</span>
                      </div>
                    </div>
                    <div className="p-4 space-y-3">
                      <div>
                        <h4 className="font-bold text-heading font-navigation text-sm leading-snug">{album.title}</h4>
                        <p className="text-xs text-muted line-clamp-2 mt-0.5">{album.description}</p>
                      </div>
                      <div className="border-t border-border-200 pt-3">
                        <button
                          onClick={() => handleDelete(album.id)}
                          className="w-full py-1.5 bg-danger-50 hover:bg-red-100 text-danger-500 rounded-lg font-bold font-navigation flex items-center justify-center gap-1.5 cursor-pointer text-xs transition-colors"
                        >
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

          {/* ====== BANNER TAB ====== */}
          {activeTab === "banner" && (
            <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                <h3 className="font-bold text-heading font-navigation">Kelola Slider Banner Hero</h3>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Tambah Banner</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="lib-table">
                  <thead><tr>
                    <th>Judul Banner</th>
                    <th>Subtitle</th>
                    <th>Urutan</th>
                    <th>Status</th>
                    <th className="text-right">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {banners.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-heading max-w-xs truncate">{item.title}</td>
                        <td className="text-muted max-w-xs truncate">{item.subtitle}</td>
                        <td className="font-bold text-primary-500">{item.order}</td>
                        <td>
                          <span className={`badge ${item.active ? "badge-success" : "badge-gray"}`}>
                            {item.active ? "Aktif" : "Nonaktif"}
                          </span>
                        </td>
                        <td className="text-right space-x-1.5">
                          <ActionEdit onClick={() => handleOpenEditModal(item)} />
                          <ActionDelete onClick={() => handleDelete(item.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== FAQ TAB ====== */}
          {activeTab === "faq" && (
            <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                <h3 className="font-bold text-heading font-navigation">Kelola Tanya Jawab (FAQ)</h3>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Tambah FAQ</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="lib-table">
                  <thead><tr>
                    <th>Pertanyaan</th>
                    <th>Jawaban</th>
                    <th>Order</th>
                    <th className="text-right">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {faqs.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-heading max-w-xs truncate">{item.question}</td>
                        <td className="text-muted max-w-sm truncate">{item.answer}</td>
                        <td className="font-bold text-primary-500">{item.order}</td>
                        <td className="text-right space-x-1.5">
                          <ActionEdit onClick={() => handleOpenEditModal(item)} />
                          <ActionDelete onClick={() => handleDelete(item.id)} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== USER TAB ====== */}
          {activeTab === "user" && user.role === "SUPER_ADMIN" && (
            <div className="bg-white rounded-xl border border-border-200 shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-border-200 flex items-center justify-between">
                <h3 className="font-bold text-heading font-navigation">Kelola Akun Administrator</h3>
                <button onClick={handleOpenAddModal} className="btn-primary !py-2 !px-4">
                  <Plus size={14} />
                  <span>Tambah Admin</span>
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="lib-table">
                  <thead><tr>
                    <th>Nama Admin</th>
                    <th>Email</th>
                    <th>Role Akses</th>
                    <th className="text-right">Aksi</th>
                  </tr></thead>
                  <tbody>
                    {users.map((item) => (
                      <tr key={item.id}>
                        <td className="font-semibold text-heading">{item.name}</td>
                        <td className="text-muted">{item.email}</td>
                        <td>
                          <span className={`badge ${item.role === "SUPER_ADMIN" ? "badge-danger" : "badge-primary"}`}>
                            {item.role === "SUPER_ADMIN" ? "Super Admin" : "Admin Konten"}
                          </span>
                        </td>
                        <td className="text-right">
                          <ActionDelete onClick={() => handleDelete(item.id)} disabled={item.id === user.id} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====== SETTINGS TAB ====== */}
          {activeTab === "settings" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Secretariat Info */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border-200 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <MapPin size={15} className="text-primary-500" />
                  </div>
                  <h3 className="font-bold text-heading font-navigation">Detail Profil Sekretariat</h3>
                </div>
                {settings.map((set) => (
                  <form key={set.key} onSubmit={(e) => handleUpdateSettings(e, set.key, e.target.elements[set.key].value)} className="space-y-1.5">
                    <label className="lib-label">
                      {set.key === "site_address" && "Alamat Fisik Gedung"}
                      {set.key === "site_email" && "Email Kantor Humas"}
                      {set.key === "site_phone" && "Nomor Telepon Sekretariat"}
                    </label>
                    <div className="flex gap-2">
                      <input name={set.key} type="text" defaultValue={set.value} className="lib-input flex-1" />
                      <button type="submit" className="btn-primary !py-2 !px-4 shrink-0">Simpan</button>
                    </div>
                  </form>
                ))}
              </div>

              {/* Social Media */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border-200 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <Globe size={15} className="text-primary-500" />
                  </div>
                  <h3 className="font-bold text-heading font-navigation">Kanal Media Sosial</h3>
                </div>
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
                    className="space-y-1.5"
                  >
                    <label className="lib-label capitalize">{soc.platform}</label>
                    <div className="flex gap-2">
                      <input name="url" type="url" defaultValue={soc.url} className="lib-input flex-1" />
                      <button type="submit" className="btn-primary !py-2 !px-4 shrink-0">Simpan</button>
                    </div>
                  </form>
                ))}
              </div>
            </div>
          )}

          {/* ====== NAVBAR TAB ====== */}
          {activeTab === "navbar" && (
            <div className="space-y-6">
              {/* Logo Config */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center gap-2.5 border-b border-border-200 pb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                    <BookOpen size={15} className="text-primary-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-heading font-navigation">Pengaturan Logo Navbar</h3>
                    <p className="text-xs text-muted">Atur teks brand dan gambar logo yang ditampilkan di navbar.</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (offline) { showNotification("Logo teks disimpan (Offline)"); return; }
                    const token = localStorage.getItem("admin_token");
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                    const headers = { Authorization: `Bearer ${token}` };
                    try {
                      await axios.post(`${apiUrl}/cms/settings`, { key: "navbar_logo_text", value: logoText }, { headers });
                      showNotification("Teks logo navbar berhasil disimpan.");
                    } catch (err) { showNotification("Gagal menyimpan teks logo: " + err.message, "error"); }
                  }} className="space-y-1.5">
                    <label className="lib-label">Teks Brand Logo</label>
                    <div className="flex gap-2">
                      <input type="text" value={logoText} onChange={(e) => setLogoText(e.target.value)} placeholder="Digital Book Experience" className="lib-input flex-1" />
                      <button type="submit" className="btn-primary !py-2 !px-4 shrink-0">Simpan</button>
                    </div>
                  </form>

                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    if (offline) { showNotification("Logo URL disimpan (Offline)"); return; }
                    const token = localStorage.getItem("admin_token");
                    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                    const headers = { Authorization: `Bearer ${token}` };
                    try {
                      await axios.post(`${apiUrl}/cms/settings`, { key: "navbar_logo_url", value: logoUrl }, { headers });
                      showNotification("URL logo navbar berhasil disimpan.");
                    } catch (err) { showNotification("Gagal menyimpan URL logo: " + err.message, "error"); }
                  }} className="space-y-1.5">
                    <label className="lib-label">URL Gambar Logo (opsional)</label>
                    <div className="flex gap-2">
                      <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} placeholder="https://example.com/logo.png" className="lib-input flex-1" />
                      <button type="submit" className="btn-primary !py-2 !px-4 shrink-0">Simpan</button>
                    </div>
                  </form>
                </div>

                {/* Preview */}
                <div className="bg-surface-100 rounded-xl border border-border-200 p-4">
                  <p className="text-xs font-navigation font-bold text-muted uppercase tracking-wider mb-3">Preview Logo</p>
                  <div className="flex items-center gap-2.5">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-9 h-9 rounded-lg object-cover shadow-soft" />
                    ) : (
                      <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center text-white shadow-soft">
                        <BookOpen size={18} />
                      </div>
                    )}
                    <span className="font-navigation font-bold text-sm text-heading tracking-wide">
                      {logoText || "Digital Book Experience"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nav Menu Items */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Link2 size={15} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Menu Navigasi Landing Page</h3>
                      <p className="text-xs text-muted">Kelola daftar menu yang ditampilkan di navbar.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingNavMenu(null); setNavMenuForm({ label: "", target: "", order: navMenuItems.length + 1, active: true }); setShowNavMenuModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Menu</span>
                  </button>
                </div>

                {navMenuItems.length === 0 ? (
                  <div className="text-center py-10 text-muted">
                    <Navigation size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada menu navigasi.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-xl border border-border-200">
                    <table className="lib-table">
                      <thead><tr>
                        <th>Urutan</th>
                        <th>Label Menu</th>
                        <th>Link Tujuan</th>
                        <th>Status</th>
                        <th className="text-right">Aksi</th>
                      </tr></thead>
                      <tbody>
                        {navMenuItems.sort((a, b) => a.order - b.order).map((item) => (
                          <tr key={item.id} className={!item.active ? "opacity-40" : ""}>
                            <td>
                              <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-primary-50 text-primary-600 font-bold text-xs">
                                {item.order}
                              </span>
                            </td>
                            <td className="font-semibold text-heading">{item.label}</td>
                            <td><code className="px-2 py-0.5 bg-surface-200 rounded text-xs text-body">{item.target}</code></td>
                            <td>
                              <button
                                onClick={async () => {
                                  const newActive = !item.active;
                                  if (offline) {
                                    setNavMenuItems(navMenuItems.map(m => m.id === item.id ? { ...m, active: newActive } : m));
                                    showNotification(`Menu "${item.label}" ${newActive ? 'diaktifkan' : 'dinonaktifkan'} (Offline)`);
                                    return;
                                  }
                                  const token = localStorage.getItem("admin_token");
                                  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                                  const headers = { Authorization: `Bearer ${token}` };
                                  try {
                                    await axios.put(`${apiUrl}/cms/nav-menu/${item.id}`, { active: newActive }, { headers });
                                    showNotification(`Menu "${item.label}" ${newActive ? 'diaktifkan' : 'dinonaktifkan'}.`);
                                    fetchBackendData(token);
                                  } catch (err) { showNotification("Gagal mengubah status: " + err.message, "error"); }
                                }}
                                className="cursor-pointer"
                              >
                                {item.active ? (
                                  <span className="badge badge-success"><ToggleRight size={11} /> Aktif</span>
                                ) : (
                                  <span className="badge badge-gray"><ToggleLeft size={11} /> Nonaktif</span>
                                )}
                              </button>
                            </td>
                            <td className="text-right space-x-1.5">
                              <button onClick={() => { setEditingNavMenu(item); setNavMenuForm({ label: item.label, target: item.target, order: item.order, active: item.active }); setShowNavMenuModal(true); }} className="p-1.5 rounded-lg bg-primary-50 hover:bg-primary-100 text-primary-600 cursor-pointer inline-flex">
                                <Edit size={13} />
                              </button>
                              <button onClick={async () => {
                                if (!confirm(`Hapus menu "${item.label}"?`)) return;
                                if (offline) { setNavMenuItems(navMenuItems.filter(m => m.id !== item.id)); showNotification("Menu berhasil dihapus (Offline)"); return; }
                                const token = localStorage.getItem("admin_token");
                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                                const headers = { Authorization: `Bearer ${token}` };
                                try {
                                  await axios.delete(`${apiUrl}/cms/nav-menu/${item.id}`, { headers });
                                  showNotification("Menu berhasil dihapus."); fetchBackendData(token);
                                } catch (err) { showNotification("Gagal menghapus menu: " + err.message, "error"); }
                              }} className="p-1.5 rounded-lg bg-danger-50 hover:bg-red-100 text-danger-500 cursor-pointer inline-flex">
                                <Trash2 size={13} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Contact Buttons */}
              <div className="bg-white p-6 rounded-xl border border-border-200 shadow-soft space-y-5">
                <div className="flex items-center justify-between border-b border-border-200 pb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
                      <Send size={15} className="text-primary-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-heading font-navigation">Tombol Hubungi Kami</h3>
                      <p className="text-xs text-muted">Atur tombol kontak yang tampil di navbar.</p>
                    </div>
                  </div>
                  <button
                    onClick={() => { setEditingContactBtn(null); setContactBtnForm({ label: "", platform: "whatsapp", value: "", active: true }); setShowContactBtnModal(true); }}
                    className="btn-primary !py-2 !px-4"
                  >
                    <Plus size={14} />
                    <span>Tambah Tombol</span>
                  </button>
                </div>

                {contactButtons.length === 0 ? (
                  <div className="text-center py-10 text-muted">
                    <Send size={32} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">Belum ada tombol kontak.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {contactButtons.map((btn) => {
                      const platformColors = {
                        whatsapp: "bg-green-50 border-green-200 text-green-700",
                        instagram: "bg-pink-50 border-pink-200 text-pink-700",
                        email: "bg-blue-50 border-blue-200 text-blue-700",
                        telegram: "bg-sky-50 border-sky-200 text-sky-700",
                        custom: "bg-gray-50 border-gray-200 text-gray-700"
                      };
                      const platformLabels = { whatsapp: "WhatsApp", instagram: "Instagram DM", email: "Email", telegram: "Telegram", custom: "URL Custom" };
                      return (
                        <div key={btn.id} className={`p-4 rounded-xl border flex items-center justify-between ${!btn.active ? "opacity-40" : ""} ${platformColors[btn.platform] || platformColors.custom}`}>
                          <div className="space-y-0.5">
                            <span className="font-bold text-sm">{btn.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="badge badge-gray text-[9px]">{platformLabels[btn.platform] || btn.platform}</span>
                              <span className="text-xs font-mono opacity-70">{btn.value}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <button onClick={async () => {
                              const newActive = !btn.active;
                              if (offline) { setContactButtons(contactButtons.map(b => b.id === btn.id ? { ...b, active: newActive } : b)); showNotification(`Tombol "${btn.label}" diperbarui (Offline)`); return; }
                              const token = localStorage.getItem("admin_token");
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                              const headers = { Authorization: `Bearer ${token}` };
                              try { await axios.put(`${apiUrl}/cms/contact-buttons/${btn.id}`, { active: newActive }, { headers }); showNotification(`Tombol "${btn.label}" diperbarui.`); fetchBackendData(token); } catch (err) { showNotification("Gagal: " + err.message, "error"); }
                            }} className="cursor-pointer p-1.5 rounded-lg hover:bg-white/60">
                              {btn.active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                            </button>
                            <button onClick={() => { setEditingContactBtn(btn); setContactBtnForm({ label: btn.label, platform: btn.platform, value: btn.value, active: btn.active }); setShowContactBtnModal(true); }} className="p-1.5 rounded-lg hover:bg-white/60 text-blue-500 cursor-pointer"><Edit size={13} /></button>
                            <button onClick={async () => {
                              if (!confirm(`Hapus tombol "${btn.label}"?`)) return;
                              if (offline) { setContactButtons(contactButtons.filter(b => b.id !== btn.id)); showNotification("Tombol berhasil dihapus (Offline)"); return; }
                              const token = localStorage.getItem("admin_token");
                              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
                              const headers = { Authorization: `Bearer ${token}` };
                              try { await axios.delete(`${apiUrl}/cms/contact-buttons/${btn.id}`, { headers }); showNotification("Tombol berhasil dihapus."); fetchBackendData(token); } catch (err) { showNotification("Gagal: " + err.message, "error"); }
                            }} className="p-1.5 rounded-lg hover:bg-white/60 text-red-500 cursor-pointer"><Trash2 size={13} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ==================== NAV MENU MODAL ==================== */}
      {showNavMenuModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingNavMenu ? "Ubah Menu Navigasi" : "Tambah Menu Navigasi"}</h4>
              <button onClick={() => setShowNavMenuModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setShowNavMenuModal(false);
              if (offline) {
                if (editingNavMenu) { setNavMenuItems(navMenuItems.map(m => m.id === editingNavMenu.id ? { ...m, ...navMenuForm } : m)); showNotification("Menu berhasil diperbarui (Offline)"); }
                else { setNavMenuItems([...navMenuItems, { id: Date.now(), ...navMenuForm }]); showNotification("Menu baru berhasil ditambahkan (Offline)"); }
                return;
              }
              const token = localStorage.getItem("admin_token");
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
              const headers = { Authorization: `Bearer ${token}` };
              try {
                if (editingNavMenu) { await axios.put(`${apiUrl}/cms/nav-menu/${editingNavMenu.id}`, navMenuForm, { headers }); showNotification("Menu berhasil diperbarui."); }
                else { await axios.post(`${apiUrl}/cms/nav-menu`, navMenuForm, { headers }); showNotification("Menu baru berhasil dibuat."); }
                fetchBackendData(token);
              } catch (err) { showNotification("Gagal menyimpan menu: " + err.message, "error"); }
            }}>
              <div className="lib-modal-body space-y-4">
                <div className="space-y-1.5">
                  <label className="lib-label">Label Menu</label>
                  <input type="text" required value={navMenuForm.label} onChange={(e) => setNavMenuForm({ ...navMenuForm, label: e.target.value })} className="lib-input" placeholder="Tentang Kami" />
                </div>
                <div className="space-y-1.5">
                  <label className="lib-label">Link Tujuan</label>
                  <input type="text" required value={navMenuForm.target} onChange={(e) => setNavMenuForm({ ...navMenuForm, target: e.target.value })} className="lib-input" placeholder="#about atau https://..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="lib-label">Urutan Tampil</label>
                    <input type="number" min={1} value={navMenuForm.order} onChange={(e) => setNavMenuForm({ ...navMenuForm, order: parseInt(e.target.value) || 1 })} className="lib-input" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="lib-label">Status</label>
                    <select value={navMenuForm.active ? "true" : "false"} onChange={(e) => setNavMenuForm({ ...navMenuForm, active: e.target.value === "true" })} className="lib-input">
                      <option value="true">Aktif</option>
                      <option value="false">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="lib-modal-footer">
                <button type="button" onClick={() => setShowNavMenuModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== CONTACT BUTTON MODAL ==================== */}
      {showContactBtnModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingContactBtn ? "Ubah Tombol Kontak" : "Tambah Tombol Kontak"}</h4>
              <button onClick={() => setShowContactBtnModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              setShowContactBtnModal(false);
              if (offline) {
                if (editingContactBtn) { setContactButtons(contactButtons.map(b => b.id === editingContactBtn.id ? { ...b, ...contactBtnForm } : b)); showNotification("Tombol kontak diperbarui (Offline)"); }
                else { setContactButtons([...contactButtons, { id: Date.now(), ...contactBtnForm }]); showNotification("Tombol kontak baru ditambahkan (Offline)"); }
                return;
              }
              const token = localStorage.getItem("admin_token");
              const apiUrl = process.env.NEXT_PUBLIC_API_URL || "/api";
              const headers = { Authorization: `Bearer ${token}` };
              try {
                if (editingContactBtn) { await axios.put(`${apiUrl}/cms/contact-buttons/${editingContactBtn.id}`, contactBtnForm, { headers }); showNotification("Tombol kontak berhasil diperbarui."); }
                else { await axios.post(`${apiUrl}/cms/contact-buttons`, contactBtnForm, { headers }); showNotification("Tombol kontak baru berhasil dibuat."); }
                fetchBackendData(token);
              } catch (err) { showNotification("Gagal menyimpan tombol kontak: " + err.message, "error"); }
            }}>
              <div className="lib-modal-body space-y-4">
                <div className="space-y-1.5">
                  <label className="lib-label">Teks Tombol</label>
                  <input type="text" required value={contactBtnForm.label} onChange={(e) => setContactBtnForm({ ...contactBtnForm, label: e.target.value })} className="lib-input" placeholder="Hubungi Kami" />
                </div>
                <div className="space-y-1.5">
                  <label className="lib-label">Platform Komunikasi</label>
                  <select value={contactBtnForm.platform} onChange={(e) => setContactBtnForm({ ...contactBtnForm, platform: e.target.value })} className="lib-input">
                    <option value="whatsapp">WhatsApp</option>
                    <option value="instagram">Instagram DM</option>
                    <option value="email">Email</option>
                    <option value="telegram">Telegram</option>
                    <option value="custom">URL Custom</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="lib-label">
                    {contactBtnForm.platform === "whatsapp" && "Nomor WhatsApp (dengan kode negara)"}
                    {contactBtnForm.platform === "instagram" && "Username Instagram (tanpa @)"}
                    {contactBtnForm.platform === "email" && "Alamat Email"}
                    {contactBtnForm.platform === "telegram" && "Username Telegram (tanpa @)"}
                    {contactBtnForm.platform === "custom" && "URL Tujuan Lengkap"}
                  </label>
                  <input type="text" required value={contactBtnForm.value} onChange={(e) => setContactBtnForm({ ...contactBtnForm, value: e.target.value })} className="lib-input"
                    placeholder={
                      contactBtnForm.platform === "whatsapp" ? "6281234567890" :
                      contactBtnForm.platform === "instagram" ? "perpustakaankota" :
                      contactBtnForm.platform === "email" ? "info@perpustakaan.go.id" :
                      contactBtnForm.platform === "telegram" ? "perpustakaankota" : "https://..."
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="lib-label">Status</label>
                  <select value={contactBtnForm.active ? "true" : "false"} onChange={(e) => setContactBtnForm({ ...contactBtnForm, active: e.target.value === "true" })} className="lib-input">
                    <option value="true">Aktif</option>
                    <option value="false">Nonaktif</option>
                  </select>
                </div>
              </div>
              <div className="lib-modal-footer">
                <button type="button" onClick={() => setShowContactBtnModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MAIN CRUD FORMS MODAL ==================== */}
      {showModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">
                {editingItem ? "Ubah Data" : "Tambah Data Baru"}
              </h4>
              <button onClick={() => setShowModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>

            <form onSubmit={handleFormSubmit}>
              <div className="lib-modal-body space-y-4">

                {/* NEWS form */}
                {activeTab === "news" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Judul Artikel</label><input type="text" required value={newsForm.title} onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })} className="lib-input" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="lib-label">Kategori</label>
                        <select value={newsForm.category} onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })} className="lib-input">
                          <option value="Berita">Berita</option>
                          <option value="Komunitas">Komunitas</option>
                          <option value="Teknologi">Teknologi</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="lib-label">Status Publikasi</label>
                        <select value={newsForm.published ? "true" : "false"} onChange={(e) => setNewsForm({ ...newsForm, published: e.target.value === "true" })} className="lib-input">
                          <option value="true">Published</option>
                          <option value="false">Draft</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5"><label className="lib-label">Thumbnail URL</label><input type="text" value={newsForm.thumbnail} onChange={(e) => setNewsForm({ ...newsForm, thumbnail: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Isi Konten Artikel</label><textarea required rows={5} value={newsForm.content} onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })} className="lib-input resize-none" /></div>
                  </>
                )}

                {/* EVENTS form */}
                {activeTab === "events" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Nama Event</label><input type="text" required value={eventForm.title} onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })} className="lib-input" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="lib-label">Tanggal Pelaksanaan</label><input type="date" required value={eventForm.date} onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })} className="lib-input" /></div>
                      <div className="space-y-1.5"><label className="lib-label">Waktu/Jam</label><input type="text" required value={eventForm.time} onChange={(e) => setEventForm({ ...eventForm, time: e.target.value })} className="lib-input" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="lib-label">Lokasi Gedung</label><input type="text" required value={eventForm.location} onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })} className="lib-input" /></div>
                      <div className="space-y-1.5"><label className="lib-label">Kapasitas Kursi</label><input type="number" required value={eventForm.capacity} onChange={(e) => setEventForm({ ...eventForm, capacity: parseInt(e.target.value, 10) })} className="lib-input" /></div>
                    </div>
                    <div className="space-y-1.5"><label className="lib-label">Pembicara / Speaker</label><input type="text" value={eventForm.speaker} onChange={(e) => setEventForm({ ...eventForm, speaker: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Deskripsi Kegiatan</label><textarea required rows={3} value={eventForm.description} onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })} className="lib-input resize-none" /></div>
                  </>
                )}

                {/* FAQ form */}
                {activeTab === "faq" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Pertanyaan</label><input type="text" required value={faqForm.question} onChange={(e) => setFaqForm({ ...faqForm, question: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Order Urutan Tampil</label><input type="number" required value={faqForm.order} onChange={(e) => setFaqForm({ ...faqForm, order: parseInt(e.target.value, 10) })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Jawaban FAQ</label><textarea required rows={4} value={faqForm.answer} onChange={(e) => setFaqForm({ ...faqForm, answer: e.target.value })} className="lib-input resize-none" /></div>
                  </>
                )}

                {/* BANNER form */}
                {activeTab === "banner" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Judul Banner</label><input type="text" required value={bannerForm.title} onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Sub-Judul</label><input type="text" value={bannerForm.subtitle} onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })} className="lib-input" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="lib-label">Urutan Tampil</label><input type="number" required value={bannerForm.order} onChange={(e) => setBannerForm({ ...bannerForm, order: parseInt(e.target.value, 10) })} className="lib-input" /></div>
                      <div className="space-y-1.5">
                        <label className="lib-label">Status Aktif</label>
                        <select value={bannerForm.active ? "true" : "false"} onChange={(e) => setBannerForm({ ...bannerForm, active: e.target.value === "true" })} className="lib-input">
                          <option value="true">Aktif</option>
                          <option value="false">Nonaktif</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5"><label className="lib-label">Gambar URL</label><input type="text" required value={bannerForm.imageUrl} onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })} className="lib-input" /></div>
                  </>
                )}

                {/* GALLERY form */}
                {activeTab === "gallery" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Judul Album</label><input type="text" required value={galleryForm.title} onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Gambar Cover URL</label><input type="text" required value={galleryForm.thumbnail} onChange={(e) => setGalleryForm({ ...galleryForm, thumbnail: e.target.value })} className="lib-input" /></div>
                    <div className="space-y-1.5"><label className="lib-label">Deskripsi Singkat</label><textarea required rows={3} value={galleryForm.description} onChange={(e) => setGalleryForm({ ...galleryForm, description: e.target.value })} className="lib-input resize-none" /></div>
                  </>
                )}

                {/* USER form */}
                {activeTab === "user" && user.role === "SUPER_ADMIN" && (
                  <>
                    <div className="space-y-1.5"><label className="lib-label">Nama Lengkap</label><input type="text" required value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="lib-input" /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5"><label className="lib-label">Email Admin</label><input type="email" required value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="lib-input" /></div>
                      <div className="space-y-1.5">
                        <label className="lib-label">Role Akses</label>
                        <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="lib-input">
                          <option value="ADMIN">Admin Konten</option>
                          <option value="SUPER_ADMIN">Super Admin</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5"><label className="lib-label">Kata Sandi</label><input type="password" required value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="lib-input" /></div>
                  </>
                )}

              </div>
              <div className="lib-modal-footer">
                <button type="button" onClick={() => setShowModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== TEAM MODAL ==================== */}
      {showTeamModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingTeam ? "Ubah Data Pengurus" : "Tambah Pengurus Baru"}</h4>
              <button onClick={() => setShowTeamModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowTeamModal(false);
              let updated;
              if (editingTeam) {
                updated = teamList.map(t => t.id === editingTeam.id ? { ...t, ...teamForm } : t);
                showNotification("Data pengurus berhasil diperbarui!");
              } else {
                updated = [...teamList, { id: `team-${Date.now()}`, ...teamForm }];
                showNotification("Pengurus baru berhasil ditambahkan!");
              }
              setTeamList(updated);
              if (typeof window !== "undefined") localStorage.setItem("cms_team_list", JSON.stringify(updated));
            }} className="space-y-4 p-6">
              <FormInput label="Nama Lengkap & Gelar" required value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} />
              <FormInput label="Jabatan / Role" required value={teamForm.role} onChange={(e) => setTeamForm({ ...teamForm, role: e.target.value })} />
              <FormTextarea label="Deskripsi Tugas & Tanggung Jawab" rows={2} required value={teamForm.desc} onChange={(e) => setTeamForm({ ...teamForm, desc: e.target.value })} />
              <div className="lib-modal-footer pt-3">
                <button type="button" onClick={() => setShowTeamModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Pengurus</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== FACILITY MODAL ==================== */}
      {showFacModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingFac ? "Ubah Fasilitas" : "Tambah Fasilitas Baru"}</h4>
              <button onClick={() => setShowFacModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowFacModal(false);
              let updated;
              if (editingFac) {
                updated = facilityList.map(f => f.id === editingFac.id ? { ...f, ...facForm } : f);
                showNotification("Fasilitas berhasil diperbarui!");
              } else {
                updated = [...facilityList, { id: `fac-${Date.now()}`, ...facForm }];
                showNotification("Fasilitas baru berhasil ditambahkan!");
              }
              setFacilityList(updated);
              if (typeof window !== "undefined") localStorage.setItem("cms_facility_list", JSON.stringify(updated));
            }} className="space-y-4 p-6">
              <FormInput label="Nomor / Kode Urut" required value={facForm.num} onChange={(e) => setFacForm({ ...facForm, num: e.target.value })} />
              <FormInput label="Nama Fasilitas" required value={facForm.title} onChange={(e) => setFacForm({ ...facForm, title: e.target.value })} />
              <FormTextarea label="Deskripsi Fasilitas" rows={3} required value={facForm.desc} onChange={(e) => setFacForm({ ...facForm, desc: e.target.value })} />
              <div className="lib-modal-footer pt-3">
                <button type="button" onClick={() => setShowFacModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Fasilitas</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== STAT MODAL ==================== */}
      {showStatModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingStat ? "Ubah Angka Statistik" : "Tambah Statistik Baru"}</h4>
              <button onClick={() => setShowStatModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowStatModal(false);
              let updated;
              if (editingStat) {
                updated = statsList.map(s => s.id === editingStat.id ? { ...s, ...statForm } : s);
                showNotification("Statistik berhasil diperbarui!");
              } else {
                updated = [...statsList, { id: `stat-${Date.now()}`, ...statForm }];
                showNotification("Statistik baru berhasil ditambahkan!");
              }
              setStatsList(updated);
              if (typeof window !== "undefined") localStorage.setItem("cms_stats_list", JSON.stringify(updated));
            }} className="space-y-4 p-6">
              <FormInput label="Angka / Nilai (contoh: 25.000+)" required value={statForm.value} onChange={(e) => setStatForm({ ...statForm, value: e.target.value })} />
              <FormInput label="Deskripsi Label (contoh: Koleksi Buku Fisik)" required value={statForm.label} onChange={(e) => setStatForm({ ...statForm, label: e.target.value })} />
              <div className="lib-modal-footer pt-3">
                <button type="button" onClick={() => setShowStatModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Statistik</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== FOOTER HOURS MODAL ==================== */}
      {showFooterHoursModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingFooterHours ? "Ubah Jam Operasional Footer" : "Tambah Jam Operasional Footer"}</h4>
              <button onClick={() => setShowFooterHoursModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowFooterHoursModal(false);
              let updated;
              if (editingFooterHours) {
                updated = footerHours.map(h => h.id === editingFooterHours.id ? { ...h, ...footerHoursForm } : h);
                showNotification("Jam operasional footer berhasil diperbarui!");
              } else {
                updated = [...footerHours, { id: `fh-${Date.now()}`, ...footerHoursForm }];
                showNotification("Jam operasional footer baru berhasil ditambahkan!");
              }
              setFooterHours(updated);
              if (typeof window !== "undefined") localStorage.setItem("cms_footer_hours", JSON.stringify(updated));
            }} className="space-y-4 p-6">
              <FormInput label="Hari / Jangkauan (contoh: Senin — Jumat)" required value={footerHoursForm.days} onChange={(e) => setFooterHoursForm({ ...footerHoursForm, days: e.target.value })} />
              <FormInput label="Jam Layanan (contoh: 08:00 — 18:00)" required value={footerHoursForm.hours} onChange={(e) => setFooterHoursForm({ ...footerHoursForm, hours: e.target.value })} />
              <div className="lib-modal-footer pt-3">
                <button type="button" onClick={() => setShowFooterHoursModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Jam Operasional</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== FOOTER LINK MODAL ==================== */}
      {showFooterLinkModal && (
        <div className="lib-modal-overlay">
          <div className="lib-modal">
            <div className="lib-modal-header">
              <h4 className="font-bold text-heading font-navigation">{editingFooterLink ? "Ubah Link Footer" : "Tambah Link Footer Baru"}</h4>
              <button onClick={() => setShowFooterLinkModal(false)} className="text-muted hover:text-body cursor-pointer transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              setShowFooterLinkModal(false);
              let updated;
              if (editingFooterLink) {
                updated = footerLinks.map(l => l.id === editingFooterLink.id ? { ...l, ...footerLinkForm } : l);
                showNotification("Link footer berhasil diperbarui!");
              } else {
                updated = [...footerLinks, { id: `fl-${Date.now()}`, ...footerLinkForm }];
                showNotification("Link footer baru berhasil ditambahkan!");
              }
              setFooterLinks(updated);
              if (typeof window !== "undefined") localStorage.setItem("cms_footer_links", JSON.stringify(updated));
            }} className="space-y-4 p-6">
              <FormInput label="Label Tautan (contoh: Kebijakan Privasi)" required value={footerLinkForm.label} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, label: e.target.value })} />
              <FormInput label="URL / Target Link (contoh: #privacy atau https://...)" required value={footerLinkForm.url} onChange={(e) => setFooterLinkForm({ ...footerLinkForm, url: e.target.value })} />
              <div className="lib-modal-footer pt-3">
                <button type="button" onClick={() => setShowFooterLinkModal(false)} className="btn-ghost border border-border-200">Batal</button>
                <button type="submit" className="btn-primary">Simpan Link Footer</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
