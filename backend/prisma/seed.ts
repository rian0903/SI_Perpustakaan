import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Prisma Database Seeding...');

  // 1. Seed Default Super Admin Account
  const defaultEmail = 'superadmin@perpustakaan.go.id';
  const hashedPassword = await bcrypt.hash('superadmin123', 10);

  const superAdmin = await prisma.user.upsert({
    where: { email: defaultEmail },
    update: {},
    create: {
      email: defaultEmail,
      password: hashedPassword,
      name: 'Super Admin Perpustakaan',
      role: Role.SUPER_ADMIN,
    },
  });
  console.log(`✅ Super Admin account ready: ${superAdmin.email}`);

  // 2. Seed News Categories
  const categoriesData = [
    { name: 'Berita Utama', slug: 'berita-utama' },
    { name: 'Pengumuman', slug: 'pengumuman' },
    { name: 'Kegiatan & Agenda', slug: 'kegiatan-agenda' },
    { name: 'E-Book & Literasi', slug: 'e-book-literasi' },
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name },
      create: cat,
    });
  }
  console.log(`✅ Default Categories seeded (${categoriesData.length} categories)`);

  // 3. Seed Initial Website Settings
  const settingsData = [
    { key: 'site_title', value: 'Perpustakaan Daerah Kota Buku', description: 'Nama utama website perpustakaan' },
    { key: 'site_tagline', value: 'Jendela Dunia, Gerbang Ilmu Pengetahuan Digital', description: 'Tagline atau deskripsi singkat' },
    { key: 'contact_email', value: 'info@perpustakaan.go.id', description: 'Email resmi layanan' },
    { key: 'contact_phone', value: '(021) 555-0199', description: 'Nomor telepon layanan' },
    { key: 'address', value: 'Jl. Merdeka Literasi No. 45, Jakarta', description: 'Alamat fisik perpustakaan' },
    { key: 'operating_hours', value: 'Senin - Sabtu: 08.00 - 17.00 WIB', description: 'Jam operasional pelayanan' },
  ];

  for (const setting of settingsData) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value, description: setting.description },
      create: setting,
    });
  }
  console.log(`✅ General Website Settings seeded`);

  // 4. Seed Navbar Menu Items
  const menuItemsData = [
    { label: 'Beranda', target: '/', order: 1, active: true },
    { label: 'Profil', target: '/#about', order: 2, active: true },
    { label: 'Koleksi Buku', target: '/#books', order: 2.5, active: true },
    { label: 'Berita', target: '/#news', order: 3, active: true },
    { label: 'Agenda', target: '/#events', order: 4, active: true },
    { label: 'Galeri', target: '/#gallery', order: 5, active: true },
    { label: 'Keanggotaan', target: '/membership', order: 6, active: true },
    { label: 'Cek Status', target: '/membership/status', order: 7, active: true },
    { label: 'FAQ', target: '/#faq', order: 8, active: true },
  ];

  const existingNavs = await prisma.navMenuItem.count();
  if (existingNavs === 0) {
    for (const item of menuItemsData) {
      await prisma.navMenuItem.create({ data: item });
    }
    console.log(`✅ Navbar Menu Items seeded`);
  }

  // 5. Seed Contact CTA Button
  const existingButtons = await prisma.contactButton.count();
  if (existingButtons === 0) {
    await prisma.contactButton.create({
      data: {
        label: 'Hubungi Kami',
        platform: 'whatsapp',
        value: '6281234567890',
        active: true,
      },
    });
    console.log(`✅ Contact Button configuration seeded`);
  }

  // 6. Seed Sample Banners
  const existingBanners = await prisma.banner.count();
  if (existingBanners === 0) {
    await prisma.banner.createMany({
      data: [
        {
          title: 'Selamat Datang di Perpustakaan Digital',
          subtitle: 'Nikmati akses gratis ke ribuan koleksi buku, jurnal, dan multimedia.',
          imageUrl: '/images/hero-banner-1.jpg',
          linkUrl: '/#services',
          order: 1,
          active: true,
        },
        {
          title: 'Ruang Baca Modern & Nyaman',
          subtitle: 'Fasilitas coworking space, Wi-Fi gratis, dan ruang diskusi kelompok.',
          imageUrl: '/images/hero-banner-2.jpg',
          linkUrl: '/#about',
          order: 2,
          active: true,
        },
      ],
    });
    console.log(`✅ Sample Banners seeded`);
  }

  // 7. Seed Sample FAQs
  const existingFaqs = await prisma.faq.count();
  if (existingFaqs === 0) {
    await prisma.faq.createMany({
      data: [
        {
          question: 'Bagaimana cara membuat Kartu Anggota Perpustakaan?',
          answer: 'Pendaftaran anggota dapat dilakukan secara online melalui menu Pendaftaran atau datang langsung ke bagian pelayanan dengan membawa KTP/Kartu Pelajar.',
          order: 1,
        },
        {
          question: 'Berapa lama batas waktu peminjaman buku?',
          answer: 'Batas peminjaman buku cetak adalah 14 hari kerja dan dapat diperpanjang secara online sebanyak 1 kali.',
          order: 2,
        },
        {
          question: 'Apakah layanan perpustakaan digital ini berbayar?',
          answer: 'Seluruh layanan baca di tempat, e-book, dan fasilitas perpustakaan bersifat gratis 100% untuk masyarakat.',
          order: 3,
        },
      ],
    });
    console.log(`✅ Sample FAQs seeded`);
  }

  // 8. Seed Sample Books
  const existingBooks = await prisma.book.count();
  if (existingBooks === 0) {
    await prisma.book.createMany({
      data: [
        {
          title: "Laskar Pelangi",
          slug: "laskar-pelangi",
          author: "Andrea Hirata",
          publisher: "Bentang Pustaka",
          year: 2005,
          isbn: "978-979-3062-79-2",
          category: "Fiksi",
          description: "Kisah perjuangan 10 anak di Belitung dalam mengejar mimpi dan pendidikan di tengah keterbatasan.",
          coverUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=600&auto=format&fit=crop",
          stock: 5,
          available: 3,
          location: "Rak Fiksi - A01",
          isFeatured: true
        },
        {
          title: "Bumi Manusia",
          slug: "bumi-manusia",
          author: "Pramoedya Ananta Toer",
          publisher: "Lentera Dipantara",
          year: 1980,
          isbn: "978-979-97312-3-4",
          category: "Sejarah & Budaya",
          description: "Novel sejarah berlatar era kolonial Hindia Belanda yang menceritakan pergerakan dan kisah cinta Minke.",
          coverUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=600&auto=format&fit=crop",
          stock: 4,
          available: 2,
          location: "Rak Sejarah - B03",
          isFeatured: true
        },
        {
          title: "Filosfi Teras",
          slug: "filosofi-teras",
          author: "Henry Manampiring",
          publisher: "Kompik Media",
          year: 2018,
          isbn: "978-602-424-694-5",
          category: "Pengembangan Diri",
          description: "Penerapan filsafat Stoisisme dalam kehidupan sehari-hari untuk mengatasi kecemasan dan stres emosional.",
          coverUrl: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?q=80&w=600&auto=format&fit=crop",
          stock: 6,
          available: 4,
          location: "Rak Mandiri - C02",
          isFeatured: true
        },
        {
          title: "Pemrograman Web Modern dengan React & NestJS",
          slug: "pemrograman-web-modern-react-nestjs",
          author: "Rian Pratama",
          publisher: "Informatika Press",
          year: 2024,
          isbn: "978-623-01-1234-5",
          category: "Sains & Teknologi",
          description: "Panduan praktis membangun aplikasi web fullstack berskala enterprise dari awal sampai deployment.",
          coverUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=600&auto=format&fit=crop",
          stock: 3,
          available: 3,
          location: "Rak IT - D05",
          isFeatured: true
        },
        {
          title: "Sejarah Nusantara & Kerajaan Besar Aceh",
          slug: "sejarah-nusantara-kerajaan-aceh",
          author: "Dr. Iskandar Muda",
          publisher: "Pustaka Serambi",
          year: 2021,
          isbn: "978-602-00-9876-1",
          category: "Sejarah & Budaya",
          description: "Dokumentasi komprehensif kebudayaan dan jalur perdagangan rempah di Selat Malaka.",
          coverUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?q=80&w=600&auto=format&fit=crop",
          stock: 2,
          available: 1,
          location: "Rak Referensi - E01",
          isFeatured: false
        }
      ]
    });
    console.log(`✅ Sample Books seeded`);
  }

  console.log('🎉 Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error during database seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
