# Digital Book Experience — Library Information Portal

**Digital Book Experience** adalah portal informasi digital resmi perpustakaan yang mengusung konsep visual interaktif layaknya membaca buku bab demi bab (storytelling). Terinspirasi dari estetika desain bersih, whitespace, dan tipografi editorial premium.

Proyek ini dibangun menggunakan arsitektur Monorepo dengan pembagian **Frontend** (Next.js) dan **Backend** (NestJS) yang terpisah secara modular.

---

## 📁 Struktur Monorepo

```text
├── backend/            # NestJS API (TypeScript)
│   ├── src/            # Kode sumber backend
│   ├── prisma/         # Skema database & migrasi Prisma
│   └── package.json    # Dependensi backend
├── frontend/           # Next.js Web App (JavaScript)
│   ├── src/            # Kode sumber frontend & UI
│   └── package.json    # Dependensi frontend
├── docker/             # Konfigurasi containerization (Dockerfile & Nginx)
├── docker-compose.yml  # Docker orchestration
├── package.json        # Konfigurasi npm workspaces & script root
├── .env                # Variabel lingkungan lokal (diabaikan oleh git)
└── README.md           # Dokumentasi cara menjalankan proyek
```

---

## 🚀 Teknologi Utama

- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Anime.js, Axios, React Hook Form, Zod, Lucide Icons.
- **Backend:** NestJS, Node.js 22, Prisma ORM, JWT, Passport, bcrypt, Multer.
- **Database:** PostgreSQL.
- **DevOps:** Docker, Docker Compose, Nginx, PM2.

---

## 🛠️ Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terinstal:
1. **Node.js** (Versi 22 LTS direkomendasikan)
2. **NPM** (Versi 10 ke atas)
3. **PostgreSQL** (Lokal atau dijalankan lewat Docker)
4. *Optional:* **Docker & Docker Compose** (Jika ingin menjalankan via Container)

---

## 💻 Cara Menjalankan Project (Lokal)

Ikuti langkah-langkah berikut untuk menjalankan project di lingkungan lokal Anda:

### 1. Kloning Repositori & Install Dependensi
Kloning repositori ini dan masuk ke direktori utama, lalu jalankan `npm install`. NPM Workspaces akan mendownload seluruh package untuk frontend dan backend secara otomatis serta membuat tautan (linking) antar workspace.

```bash
# Install seluruh package dari root folder
npm install
```

### 2. Konfigurasi Environment Variables
Salin template environment variables `.env.example` ke file `.env` baru di direktori root:

```bash
# Windows PowerShell
copy .env.example .env

# Linux / macOS / Git Bash
cp .env.example .env
```

Buka file `.env` dan sesuaikan koneksi database PostgreSQL lokal Anda pada variabel `DATABASE_URL`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/digital_book_db?schema=public"
```

### 3. Setup Database (Prisma ORM)
Jalankan perintah berikut dari **direktori root** proyek untuk mensinkronisasikan skema Prisma ke database PostgreSQL Anda (ini memastikan file `.env` di root termuat dengan benar):

```bash
# Sinkronisasi skema database dari root
npm run db:push
```

### 4. Jalankan Aplikasi dalam Mode Pengembangan (Development)
Dari direktori root proyek, Anda dapat menjalankan frontend dan backend secara bersamaan menggunakan script monorepo:

```bash
# Jalankan Next.js Frontend (berjalan di http://localhost:3000)
npm run dev:frontend

# Jalankan NestJS Backend (berjalan di http://localhost:3001/api)
npm run dev:backend
```

Aplikasi siap diakses:
- **Web App Frontend:** [http://localhost:3000](http://localhost:3000)
- **API Backend:** [http://localhost:3001/api](http://localhost:3001/api)

---

## 🐳 Cara Menjalankan Project menggunakan Docker

Jika Anda telah menginstal Docker dan Docker Compose, Anda bisa menjalankan seluruh stack aplikasi (Nginx, PostgreSQL, NestJS, Next.js) dengan satu perintah:

```bash
# Build dan jalankan seluruh container di background
docker-compose up -d --build
```

Setelah container berhasil dijalankan:
- **Web App Frontend & API Proxy** di-serve melalui Nginx di port HTTP standar: [http://localhost](http://localhost)
- **API Endpoint:** `http://localhost/api`
- **Database PostgreSQL:** Terbuka secara internal di port `5432`

Untuk menghentikan container:
```bash
docker-compose down
```

---

## 🔧 Script Developer Lainnya

Perintah-perintah berikut dapat dijalankan dari direktori root:

- **Linting & Code Style Check:**
  ```bash
  npm run lint
  ```
- **Otomatis Merapikan Format Kode (Prettier):**
  ```bash
  npm run format
  ```
- **Membangun Bundling Produksi (Build):**
  ```bash
  # Build Next.js
  npm run build:frontend

  # Build NestJS
  npm run build:backend
  ```
