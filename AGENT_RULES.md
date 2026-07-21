# UI Redesign Rules

## OBJECTIVE

Agent hanya diperbolehkan melakukan perubahan pada tampilan (UI/UX).

Agent DILARANG mengubah perilaku sistem.

---

# ABSOLUTE RULES

## DO

Agent boleh:

✔ Mengubah layout

✔ Mengubah warna

✔ Mengubah typography

✔ Mengubah spacing

✔ Mengubah icon

✔ Mengubah style button

✔ Mengubah card

✔ Mengubah navbar

✔ Mengubah footer

✔ Mengubah sidebar

✔ Mengubah animasi

✔ Mengubah responsive layout

✔ Mengubah class Tailwind

✔ Mengubah styling CSS

✔ Menambah reusable UI component

✔ Refactor UI component

---

## DO NOT

Agent TIDAK BOLEH:

❌ Mengubah business logic

❌ Mengubah API

❌ Mengubah endpoint

❌ Mengubah route

❌ Mengubah URL

❌ Mengubah database

❌ Mengubah Prisma Schema

❌ Mengubah migration

❌ Mengubah model

❌ Mengubah controller

❌ Mengubah service

❌ Mengubah repository

❌ Mengubah query SQL

❌ Mengubah validasi backend

❌ Mengubah authentication

❌ Mengubah authorization

❌ Mengubah middleware

❌ Mengubah state management

❌ Mengubah React Hook yang memengaruhi logika

❌ Mengubah request API

❌ Menghapus fitur

❌ Menambah fitur baru

❌ Mengubah flow pengguna

❌ Mengubah permission

❌ Mengubah struktur folder backend

❌ Mengubah struktur database

---

# EXISTING FEATURE PROTECTION

Semua fitur berikut WAJIB tetap bekerja:

- Login
- Logout
- Register
- Dashboard
- CRUD Buku
- CRUD Anggota
- CRUD Peminjaman
- CRUD Pengembalian
- Search
- Pagination
- Filter
- Export
- Import
- Upload
- Download
- Notification
- Profile
- Settings
- Semua API Existing

---

# UI CHANGES ONLY

Perubahan hanya boleh terjadi pada:

components/

layouts/

pages/

styles/

tailwind.config

theme

global.css

scss

css

UI Component

Icon

Typography

Color

Animation

---

# BEFORE EDITING

Agent WAJIB memastikan:

Business Logic == Tidak berubah

API == Tidak berubah

Database == Tidak berubah

Feature == Tidak berubah

Route == Tidak berubah

Request == Tidak berubah

Response == Tidak berubah

---

# AFTER EDITING

Lakukan pengecekan:

✓ Semua halaman masih bisa dibuka

✓ Semua button masih berfungsi

✓ Semua API masih berjalan

✓ Tidak ada error TypeScript

✓ Tidak ada error ESLint

✓ Tidak ada perubahan database

✓ Tidak ada perubahan backend

✓ Tidak ada perubahan endpoint

✓ Tidak ada perubahan authentication

---

# PRIORITY

1. Preserve Existing Feature
2. Preserve Existing Logic
3. Improve UI
4. Improve UX
5. Improve Responsiveness
6. Improve Accessibility

Jika terjadi konflik antara redesign dan fungsi sistem, selalu utamakan fungsi sistem.