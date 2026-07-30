# Panduan Migrasi Database Prisma & Penggunaan di WSL Debian

Dokumen ini berisi panduan langkah demi langkah untuk mengkonfigurasi, menjalankan migrasi database dengan **Prisma ORM**, serta menjalankan aplikasi backend NestJS di lingkungan **WSL (Windows Subsystem for Linux) Debian**.

---

## 1. Prasyarat Lingkungan (WSL Debian)

Pastikan dependensi sistem utama seperti OpenSSL dan Node.js telah terpasang di dalam terminal WSL Debian Anda:

```bash
# Update paket Debian
sudo apt update && sudo apt upgrade -y

# Instal dependensi dasar (OpenSSL & SQLite3)
sudo apt install -y openssl sqlite3 curl ca-certificates build-essential
```

### Menginstal Node.js (jika belum ada)
Disarankan menggunakan Node.js v20 LTS atau v22:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
```

Periksa versi Node.js & npm:
```bash
node -v
npm -v
```

---

## 2. Cara Otomatis (Menggunakan Script Setup)

Telah disediakan script otomatis `scripts/wsl-setup.sh` untuk menyiapkan dependensi, menghasilkan Prisma Client untuk Linux/Debian, menjalankan migrasi, dan mengisi data awal (seeding).

Jalankan perintah berikut di terminal WSL Debian dari direktori root project:

```bash
chmod +x ./scripts/wsl-setup.sh
./scripts/wsl-setup.sh
```

---

## 3. Cara Manual (Langkah demi Langkah)

Jika Anda ingin menjalankan perintah satu per satu:

### 1. Instal Dependensi Project
```bash
npm install
```

### 2. Generasi Prisma Client
Menghasilkan Prisma Client yang sesuai dengan lingkungan Debian Linux:
```bash
npm run db:generate
```

### 3. Sinkronisasi Schema ke Database (Prisma DB Push)
Menerapkan struktur tabel SQLite di `backend/prisma/dev.db`:
```bash
npm run db:push
```

### 4. Mengisi Data Awal (Seeding)
Mengisi data awal akun Super Admin (`superadmin@perpustakaan.go.id` / `superadmin123`), kategori berita, pengaturan website, menu navigasi, dan FAQ:
```bash
npm run db:seed
```

---

## 4. Perintah Tambahan Prisma CLI

| Perintah | Deskripsi |
| :--- | :--- |
| `npm run db:generate` | Menghasilkan kode Prisma Client terbaru berdasarkan `schema.prisma`. |
| `npm run db:push` | Mendorong perubahan skema langsung ke file database SQLite. |
| `npm run db:seed` | Menjalankan script seeder `backend/prisma/seed.ts`. |
| `npm run db:studio` | Membuka GUI Prisma Studio di browser untuk melihat/mengubah isi database. |

---

## 5. Menjalankan Server Backend NestJS

Untuk menjalankan backend di WSL Debian:

```bash
npm run dev:backend
```

Server backend NestJS akan berjalan pada `http://localhost:3001` dengan koneksi ke database SQLite Prisma (`backend/prisma/dev.db`).
