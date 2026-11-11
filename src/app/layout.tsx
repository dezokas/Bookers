import type { Metadata } from "next";
import "./globals.css";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL("https://bookers.id"),
  title: {
    default: `${siteConfig.name} — Toko Buku, Kurasi Sastra & Penerbitan Mandiri`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.about.story,
  keywords: [
    "Bookers",
    "Toko Buku Jakarta",
    "Penerbitan Mandiri",
    "Kurasi Sastra",
    "Kafe Literasi Senopati",
    "Penerbit Buku Independen",
    "Bookstore Jakarta",
  ],
  authors: [{ name: "Bookers Indonesia" }],
  creator: "Bookers",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://bookers.id",
    title: `${siteConfig.name} — Menyalakan Semangat Literasi Indonesia`,
    description: siteConfig.about.story,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-bookstore.jpg",
        width: 1200,
        height: 630,
        alt: "Bookers Senopati Bookstore & Editorial Lounge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Menyalakan Semangat Literasi Indonesia`,
    description: siteConfig.about.story,
    images: ["/images/hero-bookstore.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Merriweather:ital,wght@0,300;0,400;0,700;0,900;1,300;1,400&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
      </head>
      <body className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-body">
        {children}
      </body>
    </html>
  );
}
