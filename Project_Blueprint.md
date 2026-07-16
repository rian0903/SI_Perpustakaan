Website Sistem Informasi Perpustakaan
Konsep: Digital Book Experience
1. Gambaran Umum

Website Sistem Informasi Perpustakaan merupakan sebuah website informasi modern yang berfungsi sebagai wajah digital perpustakaan. Website ini tidak menggantikan sistem perpustakaan yang sudah berjalan, melainkan menjadi media informasi, publikasi, promosi layanan, dan komunikasi kepada masyarakat.

Konsep utama yang diusung adalah Digital Book Experience, yaitu menghadirkan pengalaman menggunakan website yang terinspirasi dari aktivitas membaca buku. Identitas visual, animasi, dan interaksi dirancang agar pengguna merasa seperti membuka sebuah buku digital yang hidup.

2. Tujuan Project
Menjadi portal informasi resmi perpustakaan.
Meningkatkan citra digital perpustakaan.
Mempermudah masyarakat memperoleh informasi.
Menjadi media promosi kegiatan perpustakaan.
Menyediakan dashboard pengelolaan konten yang mudah digunakan.
Memberikan pengalaman pengguna (User Experience) yang modern melalui animasi yang relevan.
3. Tech Stack
Frontend
Teknologi	Digunakan Untuk
Next.js 16 (App Router)	Framework Frontend
React 19	UI Library
JavaScript (ES2025)	Bahasa Pemrograman
Tailwind CSS v4	Styling
Anime.js v4	Animasi Website
Framer Motion (opsional)	Gesture & Micro Interaction
Lucide React	Icon
React Hook Form	Form Handling
Zod	Validasi Form
Axios	HTTP Client
Swiper.js	Slider
Lenis (opsional)	Smooth Scroll
GSAP (opsional)	Animasi kompleks jika diperlukan
Backend
Teknologi	Digunakan Untuk
Node.js 22 LTS	Runtime
NestJS	Backend Framework
JavaScript	Bahasa Pemrograman
Passport.js	Authentication
JWT	Login
bcrypt	Hash Password
Prisma ORM	Database ORM
Multer	Upload File
Cloudinary / Local Storage	Penyimpanan Gambar
Database

Menggunakan

PostgreSQL

Kenapa PostgreSQL?

Stabil
Cepat
Open Source
Cocok untuk aplikasi skala besar
Sangat didukung oleh Prisma
Mudah di-deploy menggunakan Docker
DevOps
Docker
Docker Compose
Nginx
PM2
Git
GitHub
4. Struktur Project
Library Information System

├── frontend/
│
├── backend/
│
├── database/
│
├── docker/
│
├── docs/
│
└── README.md
5. Struktur Frontend
frontend/

src/

├── app/
│
├── components/
│
│   ├── ui/
│   ├── navbar/
│   ├── footer/
│   ├── hero/
│   ├── news/
│   ├── gallery/
│   ├── animations/
│   ├── cards/
│   ├── admin/
│   └── shared/
│
├── lib/
│
├── hooks/
│
├── services/
│
├── utils/
│
├── styles/
│
├── assets/
│
└── constants/
6. Struktur Backend
backend/

src/

├── auth/
├── users/
├── news/
├── events/
├── gallery/
├── faq/
├── profile/
├── banners/
├── uploads/
├── dashboard/
├── settings/
├── common/
└── prisma/
7. Database Structure
Tables
users

roles

news

categories

events

gallery

gallery_images

faq

banner

contacts

settings

social_media

visitor_logs
8. User Role
Super Admin

Mengelola seluruh website.

Hak akses:

Dashboard
User
Berita
Event
Banner
FAQ
Galeri
Profil
Setting Website
Admin

Mengelola konten website.

Visitor

Hanya melihat informasi.

9. Halaman Website
Landing Page

Isi:

Hero
Tentang
Statistik
Berita
Event
Galeri
CTA
Tentang
Sejarah
Visi Misi
Struktur Organisasi
Fasilitas
Jam Operasional
Berita

Berisi artikel.

Event

Agenda perpustakaan.

Galeri

Foto kegiatan.

FAQ

Pertanyaan umum.

Kontak

Maps

Form

Media Sosial

10. Dashboard

Dashboard memiliki menu:

Dashboard

Berita

Event

Galeri

Banner

FAQ

Profil

Media Sosial

Pengaturan

Admin
11. Sistem Login

Login menggunakan:

Email
Password

Menggunakan:

JWT Authentication

Role Based Access Control (RBAC)

12. Media Upload

Admin dapat upload:

Foto
Banner
Dokumentasi
Logo
13. Animasi Website (Anime.js)
Opening Animation

Saat website pertama kali dibuka:

Sebuah buku tertutup muncul di tengah layar.
Cover buku perlahan terbuka dengan efek 3D.
Dari dalam buku muncul cahaya lembut atau ilustrasi halaman.
Halaman buku berubah menjadi Hero Section.
Hero Animation
Judul muncul seperti tinta yang sedang ditulis.
Ilustrasi buku sedikit bergerak (floating).
Tombol memiliki efek hover yang halus.
Scroll Animation

Saat pengguna menggulir halaman:

Setiap section muncul secara bertahap.
Pergantian antar-section terasa seperti membuka bab baru.
Card Animation

Pada hover:

Card sedikit terangkat.
Shadow bertambah halus.
Gambar sedikit membesar.
News Animation

Artikel muncul bergantian.

Gallery Animation

Foto muncul menggunakan efek:

Fade
Scale
Stagger
Counter Animation

Statistik:

5000+

Buku

↓

angka menghitung naik
Page Transition

Setiap perpindahan halaman:

Halaman lama seperti ditutup.

↓

Halaman baru terbuka.

Loading

Loading menggunakan animasi:

Membalik halaman buku.


14. Typography

Heading

Poppins

Body

Inter

Accent (opsional)

Playfair Display

15. Target Responsive
Desktop
Laptop
Tablet
Mobile
16. SEO
Dynamic Metadata
Open Graph
Sitemap
robots.txt
Structured Data
Optimasi Core Web Vitals
17. Security
JWT Authentication
Password Hashing (bcrypt)
Rate Limiting
Helmet
CORS
Input Validation
Sanitasi Input
CSRF Protection (jika menggunakan cookie)
Audit Log untuk aktivitas admin (opsional)
18. Future Development

Versi selanjutnya dapat dikembangkan dengan fitur seperti:

Integrasi API dengan sistem perpustakaan yang sudah ada (agar berita atau data tertentu dapat tersinkronisasi).
Pencarian global untuk seluruh konten website.
Chatbot informasi berbasis AI.
Virtual Tour perpustakaan 360°.
Sistem reservasi ruang baca atau ruang diskusi.
Dashboard analitik pengunjung website.
Dukungan multi-bahasa (Indonesia & Inggris).
Progressive Web App (PWA) agar website dapat dipasang seperti aplikasi di ponsel.
19. Filosofi Proyek

Website ini tidak hanya bertujuan menyampaikan informasi, tetapi juga membangun pengalaman digital yang mencerminkan nilai utama perpustakaan: membaca, belajar, dan mengeksplorasi pengetahuan. Setiap animasi, warna, dan interaksi dirancang untuk memperkuat identitas tersebut, sehingga pengunjung tidak sekadar mengakses informasi, tetapi juga merasakan karakter perpustakaan sejak halaman pertama terbuka.

Beberapa catatan teknis

Aku punya beberapa saran agar fondasinya lebih kuat:

Tetap gunakan JavaScript penuh jika memang itu tujuan tim. Namun, jika proyek ini berkembang besar, migrasi ke TypeScript akan cukup mudah karena Next.js, NestJS, dan Prisma mendukungnya dengan sangat baik.
Prisma + PostgreSQL adalah kombinasi yang sangat solid. Selain mudah digunakan, migrasi database dan relasi data juga lebih nyaman dikelola.
Untuk animasi, gunakan Anime.js sebagai library utama. Tambahkan GSAP hanya jika benar-benar diperlukan untuk animasi yang sangat kompleks, agar bundle tetap ringan.
Pisahkan deployment menjadi dua container Docker (frontend dan backend) serta satu container PostgreSQL agar proses pengembangan dan deployment lebih rapi.