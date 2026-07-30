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
    { label: 'Berita', target: '/#news', order: 3, active: true },
    { label: 'Agenda', target: '/#events', order: 4, active: true },
    { label: 'Galeri', target: '/#gallery', order: 5, active: true },
    { label: 'Layanan', target: '/#services', order: 6, active: true },
    { label: 'Kontak', target: '/#contact', order: 7, active: true },
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
