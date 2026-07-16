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
  title: "Digital Book Experience | Portal Informasi Perpustakaan",
  description: "Selamat datang di Digital Book Experience, portal informasi, berita, galeri, dan kegiatan resmi perpustakaan kami. Jelajahi ilmu pengetahuan bab demi bab.",
  keywords: ["Perpustakaan", "Digital Book Experience", "Buku", "Informasi", "Portal Digital"],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      className={`${inter.variable} ${poppins.variable} ${playfair.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper-100 text-gray-900 font-sans">
        {children}
      </body>
    </html>
  );
}
