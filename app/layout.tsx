import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Teoria Universal | Linha da Vida Ressignificada",
  description:
    "Um espaço para reconstruir sua história, episódio por episódio, ligando a dor presente à própria linha da vida.",
  applicationName: "Teoria Universal",
  manifest: "/manifest.webmanifest",
  themeColor: "#2A1D16",
  appleWebApp: {
    capable: true,
    title: "Teoria Universal",
    statusBarStyle: "black-translucent",
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "Teoria Universal",
    description:
      "Reconstrua sua história, episódio por episódio, ligando a dor presente à própria linha da vida.",
    type: "website",
    locale: "pt_BR",
    images: [
      {
        url: "/og-teoria-universal.png",
        width: 1200,
        height: 630,
        alt: "Teoria Universal - Reconstrua sua história, episódio por episódio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Teoria Universal",
    description:
      "Reconstrua sua história, episódio por episódio, ligando a dor presente à própria linha da vida.",
    images: ["/og-teoria-universal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
