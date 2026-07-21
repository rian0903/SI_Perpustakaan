import { Inter, Poppins, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Portal Perpustakaan | Pusat Layanan Literasi & Informasi",
  description: "Selamat datang di Portal Perpustakaan Kota. Temukan ribuan koleksi buku fisik, jurnal digital, dan ikuti kegiatan literasi kreatif kami secara gratis.",
  keywords: ["Perpustakaan", "Literasi", "Koleksi Buku", "Portal Digital", "Informasi", "Akademik"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-body font-sans">
        {children}
      </body>
    </html>
  );
}
