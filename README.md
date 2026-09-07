# Digital Book Experience — Library Information Portal

**Digital Book Experience** adalah portal informasi digital resmi perpustakaan yang mengusung konsep visual interaktif layaknya membaca buku bab demi bab (*digital storytelling*). Aplikasi ini menggabungkan estetika desain modern, tipografi editorial premium, animasi 3D interaktif, serta sistem pengelolaan konten (CMS) dan keanggotaan perpustakaan secara digital.

Proyek ini dibangun menggunakan arsitektur **Monorepo (NPM Workspaces)** dengan pemisahan tegas antara **Frontend** (Next.js 16) dan **Backend** (NestJS), terintegrasi dengan database melalui **Prisma ORM**.

---

## ✨ Fitur Utama System

- **📖 Interactive 3D Digital Book Experience:** Visualisasi perpustakaan digital interaktif dengan efek pembalik halaman dan komponen 3D menggunakan Three.js, GSAP, & Anime.js.
- **🎛️ Comprehensive Admin CMS Dashboard:** Panel administrasi lengkap untuk mengelola konten website (berita, agenda kegiatan, galeri foto, banner slider, FAQ, kontak masuk, log pengunjung, dan konfigurasi navigasi).
- **📚 Katalog Koleksi Buku:** Pencarian dan pencatatan inventaris koleksi buku perpustakaan.
- **💳 Sistem Keanggotaan Online (Membership):**
  - Form pendaftaran anggota baru secara online (upload foto & KTP/Kartu Identitas).
  - Alur verifikasi status pendaftaran (*Pending*, *Approved*, *Rejected*, *Ready for Pickup*, *Active*).
  - Generator otomatis Nomor Pendaftaran dan Nomor Anggota.
  - Halaman pengecekan status pendaftaran anggota (*Status Tracker*).
- **📧 Notifikasi Email Otomatis:** Integrasi Handlebars + Nodemailer untuk mengirimkan email HTML responsif saat status pendaftaran berubah (Pendaftaran diterima, Disetujui, Siap diambil, atau Ditolak).
- **🐧 WSL Debian & Docker Ready:** Kompatibel penuh untuk dijalankan di lingkungan Windows, Linux/WSL Debian, maupun containerized via Docker Compose.

---

## 📁 Struktur Monorepo (Detail)

```text
rian0903/SI_Perpustakaan
├── backend/                        # API Server & Business Logic (NestJS + TypeScript)
│   ├── prisma/                     # Konfigurasi Database & ORM
│   │   ├── schema.prisma           # Skema 17 Model Tabel Database (SQLite / PostgreSQL)
│   │   ├── seed.ts                 # Script seeding data awal (Admin, Kategori, Menu, FAQ, dll)
│   │   └── dev.db                  # File database SQLite lokal
│   ├── src/                        # Source Code Backend
│   │   ├── auth/                   # Autentikasi JWT, Strategy, Guards, & Role Decorator
│   │   ├── cms/                    # Modul CMS (News, Events, Gallery, Banners, FAQ, Contacts, Settings)
│   │   ├── mail/                   # Service Email (Nodemailer) & Template Handlebars (.hbs)
│   │   │   └── templates/          # Template email (registration, approved, rejected, ready-for-pickup)
│   │   ├── membership/             # Modul Keanggotaan (Registration, Verification, Status, DTOs)
│   │   │   └── dto/                # Data Transfer Objects untuk validasi request keanggotaan
│   │   ├── prisma/                 # Prisma Service & Module wrapper
│   │   ├── app.module.ts           # Root module NestJS
│   │   └── main.ts                 # Entry point server (Port 3001, CORS, Static Uploads)
│   ├── test/                       # End-to-End (E2E) Test Specs (Jest)
│   ├── uploads/                    # Direktori penampung file unggahan media backend
│   └── package.json                # Dependensi & script backend
│
├── frontend/                       # Web Application (Next.js 16 + React 19 + Tailwind v4)
│   ├── public/                     # Asset statis (SVG icons, favicons)
│   ├── src/                        # Source Code Frontend
│   │   ├── app/                    # Next.js App Router (Pages & Layouts)
│   │   │   ├── admin/              # Portal Administrator
│   │   │   │   ├── login/          # Halaman Login Admin CMS
│   │   │   │   └── dashboard/      # Panel Dashboard CMS Utama
│   │   │   ├── books/              # Halaman Katalog Buku Perpustakaan
│   │   │   ├── membership/         # Halaman Pendaftaran Anggota Baru
│   │   │   │   └── status/         # Halaman Pengecekan Status Pendaftaran Anggota
│   │   │   ├── globals.css         # Styling global & Tailwind CSS v4 directives
│   │   │   ├── layout.js           # Root Layout Aplikasi
│   │   │   └── page.js             # Halaman Utama (Interactive Storytelling Landing Page)
│   │   └── components/             # Reusable UI Components
│   │       └── Book3D.js           # Komponen 3D Canvas Buku Interaktif (Three.js/GSAP)
│   └── package.json                # Dependensi & script frontend
│
├── docker/                         # File Konfigurasi Containerization
│   ├── Dockerfile.backend          # Multi-stage build Docker image NestJS
│   ├── Dockerfile.frontend         # Multi-stage build Docker image Next.js
│   └── nginx.conf                  # Proxy Reverse Nginx (Routing port 80 ke frontend & backend)
│
├── scripts/                        # Script Otomasi & Pengujian API
│   ├── wsl-setup.sh                # Script otomatisasi instalasi & migrasi di WSL Debian
│   ├── test-full-email-flow.js     # Script uji coba alur pengiriman email Handlebars
│   ├── test-membership-flow.ts     # Script pengujian otomatis alur keanggotaan (E2E API)
│   ├── test-membership-api.js      # Script pengujian endpoint API membership
│   ├── test-live-gmail.js          # Script pengujian koneksi SMTP Gmail
│   └── test-other-email.js         # Script pengujian fallback transporter email
│
├── uploads/                        # Penampung media terpusat di root
├── .env                            # Variable lingkungan lokal (git-ignored)
├── .env.example                    # Template konfigurasi variable lingkungan
├── docker-compose.yml              # Orchestration Docker (Nginx, Backend, Frontend)
├── package.json                    # Konfigurasi Root Monorepo NPM Workspaces
├── WSL_DEBIAN_GUIDE.md             # Panduan komprehensif migrasi & setup di WSL Debian Linux
└── README.md                       # Dokumentasi utama proyek
```

---

## 🚀 Teknologi & Framework

| Layer | Teknologi Utama |
| :--- | :--- |
| **Frontend Framework** | Next.js 16 (App Router), React 19 |
| **Styling & UI** | Tailwind CSS v4, Lucide Icons |
| **Animation & 3D** | Three.js, GSAP, Anime.js |
| **Form & Validasi** | React Hook Form, Zod Validation, Axios |
| **Backend Framework** | NestJS (TypeScript), Node.js v20/v22 |
| **ORM & Database** | Prisma ORM, SQLite (`dev.db`) / PostgreSQL Ready |
| **Security & Auth** | Passport.js, JWT (JSON Web Token), Bcrypt |
| **Email Engine** | Nodemailer, Handlebars Templating (`.hbs`) |
| **Media Handling** | Multer File Upload |
| **DevOps & Container** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 🗄️ Skema Database (Prisma ORM)

Database menggunakan **Prisma ORM** yang mencakup 17 entitas model utama:
1. `User`: Akun pengelola CMS (Role: `SUPER_ADMIN`, `ADMIN`).
2. `Category`: Kategori artikel berita.
3. `News`: Berita/pengumuman perpustakaan.
4. `Event`: Agenda kegiatan perpustakaan (Status: `UPCOMING`, `ONGOING`, `COMPLETED`, `CANCELLED`).
5. `Gallery` & `GalleryImage`: Album dokumentasi & foto galeri.
6. `Faq`: Tanya jawab seputar perpustakaan.
7. `Banner`: Hero slider & banner promo di halaman depan.
8. `Contact`: Pesan masuk dari form kontak pengunjung.
9. `Setting` & `SocialMedia`: Pengaturan konfigurasi website & tautan media sosial.
10. `VisitorLog`: Log statistik pengunjung website.
11. `NavMenuItem` & `ContactButton`: Menu navigasi & tombol CTA kontak dinamis.
12. `Membership`: Data keanggotaan & alur persetujuan (`PENDING`, `APPROVED`, `REJECTED`, `READY_FOR_PICKUP`, `ACTIVE`).
13. `Book`: Katalog koleksi dan inventaris buku perpustakaan.

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi di mesin lokal Anda, pastikan telah terinstal:
- **Node.js**: Versi 20 LTS atau 22 LTS direkomendasikan.
- **NPM**: Versi 10.x ke atas (mendukung fitur Monorepo Workspaces).
- **Git**: Versi terbaru.
- *(Opsional)* **Docker & Docker Compose**: Jika ingin menjalankan via container.
- *(Opsional)* **WSL Debian (Linux)**: Jika mengembangkan di lingkungan Linux Windows.

---

## 💻 Panduan Menjalankan Project (Lokal)

### 1. Kloning Repositori & Instal Dependensi Workspaces
Jalankan perintah ini di terminal root untuk memasang seluruh dependensi `frontend` dan `backend` sekaligus:

```bash
# Kloning repositori
git clone https://github.com/rian0903/SI_Perpustakaan.git
cd SI_Perpustakaan

# Install dependensi monorepo dari root folder
npm install
```

### 2. Konfigurasi Environment Variables (.env)
Salin `.env.example` menjadi `.env` di direktori root:

```bash
# Windows PowerShell
copy .env.example .env

# Linux / macOS / Git Bash
cp .env.example .env
```

Isi variabel utama di file `.env`:
```env
PORT=3001
DATABASE_URL="file:./dev.db"
JWT_SECRET="super-secret-jwt-key-change-in-production"

# Konfigurasi SMTP Email (Opsional - jika dikosongkan akan masuk ke Mock Mode)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="email-anda@gmail.com"
SMTP_PASS="app-password-gmail"
MAIL_FROM='"Perpustakaan Daerah" <email-anda@gmail.com>'
```

### 3. Setup Database (Prisma ORM)
Jalankan perintah berikut dari **direktori root** untuk generate Prisma Client, mendorong skema ke SQLite (`backend/prisma/dev.db`), serta mengisi data awal (*seed*):

```bash
# Generate Prisma Client
npm run db:generate

# Push skema tabel ke database
npm run db:push

# Seed data awal (Akun Admin default, Kategori, FAQ, Menu, dll)
npm run db:seed
```

> **Akun Login Admin Default (setelah seeding):**
> - **Email:** `superadmin@perpustakaan.go.id`
> - **Password:** `superadmin123`

### 4. Menjalankan Aplikasi (Mode Development)
Jalankan server Frontend dan Backend secara bersamaan melalui script root monorepo:

```bash
# Terminal 1: Jalankan Next.js Frontend (http://localhost:3000)
npm run dev:frontend

# Terminal 2: Jalankan NestJS Backend (http://localhost:3001/api)
npm run dev:backend
```

Akses Aplikasi:
- 🌐 **Web App Portal Public:** [http://localhost:3000](http://localhost:3000)
- 📚 **Katalog Buku:** [http://localhost:3000/books](http://localhost:3000/books)
- 💳 **Pendaftaran Keanggotaan:** [http://localhost:3000/membership](http://localhost:3000/membership)
- 🔍 **Cek Status Anggota:** [http://localhost:3000/membership/status](http://localhost:3000/membership/status)
- 🔐 **Admin Login:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
- 🎛️ **Admin Dashboard CMS:** [http://localhost:3000/admin/dashboard](http://localhost:3000/admin/dashboard)
- ⚡ **API Endpoint Backend:** [http://localhost:3001/api](http://localhost:3001/api)

---

## 🐳 Menjalankan Menggunakan Docker

Seluruh stack aplikasi (Nginx Reverse Proxy, NestJS Backend, dan Next.js Frontend) dapat dijalankan dalam satu perintah containerization:

```bash
# Build dan jalankan seluruh container
docker-compose up -d --build
```

Akses Docker Stack:
- **Aplikasi Web & Nginx Proxy:** [http://localhost](http://localhost)
- **API Proxy Routing:** `http://localhost/api`

Untuk menghentikan container:
```bash
docker-compose down
```

---

## 🐧 Penggunaan di WSL Debian (Linux)

Proyek ini telah diuji dan didukung penuh untuk lingkungan **WSL Debian (Linux)**.

Untuk setup otomatis di WSL Debian:
```bash
chmod +x ./scripts/wsl-setup.sh
./scripts/wsl-setup.sh
```

Untuk panduan mendalam langkah demi langkah di WSL, silakan baca dokumentasi [WSL_DEBIAN_GUIDE.md](file:///c:/Users/ASUS/Downloads/testing/website/WSL_DEBIAN_GUIDE.md).

---

## 📜 Daftar Script NPM Monorepo

Perintah-perintah berikut dapat dijalankan langsung dari **direktori root**:

| Script Perintah | Deskripsi |
| :--- | :--- |
| `npm run dev:frontend` | Jalankan Next.js Frontend dalam mode pengembangan (dev watch). |
| `npm run dev:backend` | Jalankan NestJS Backend dalam mode pengembangan (watch mode). |
| `npm run build:frontend` | Build bundel produksi Next.js. |
| `npm run build:backend` | Build kompilasi produksi NestJS TypeScript ke JavaScript (`dist/`). |
| `npm run lint` | Jalankan linter ESLint untuk frontend dan backend secara bersamaan. |
| `npm run format` | Otomatis merapikan format seluruh berkas dengan Prettier. |
| `npm run db:generate` | Menghasilkan Prisma Client terbaru berdasarkan `schema.prisma`. |
| `npm run db:push` | Mensinkronkan skema Prisma langsung ke database tanpa file migrasi. |
| `npm run db:seed` | Menjalankan seeder `backend/prisma/seed.ts` untuk membuat data awal. |
| `npm run db:migrate` | Menjalankan migrasi dev Prisma. |
| `npm run db:studio` | Membuka GUI Prisma Studio di browser untuk melihat & mengelola data. |

---

## 🧪 Testing & Script Uji Coba

Di dalam folder `scripts/` dan `backend/test/` telah disediakan berkas pengujian:

- **Pengujian Unit & E2E (Jest):**
  ```bash
  # Masuk ke folder backend untuk pengujian Jest
  cd backend
  npm run test          # Unit test
  npm run test:e2e      # End-to-end test
  ```
- **Pengujian Flow Email & Membership API:**
  ```bash
  # Uji coba alur pengiriman email Handlebars
  node scripts/test-full-email-flow.js

  # Uji coba API pendaftaran anggota
  node scripts/test-membership-api.js
  ```

---

## 📄 Lisensi & Kredit

Diikembangkan sebagai Sistem Informasi Perpustakaan berbasis digital modern dengan arsitektur Monorepo yang fleksibel dan modular.
