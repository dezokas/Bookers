export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  badge: string;
  icon: string;
  badgeType?: "default" | "popular";
  linkText: string;
  href: string;
}

export interface NewsItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  thumbnail: string;
}

export interface SiteConfig {
  name: string;
  tagline: string;
  category: string;
  about: {
    story: string;
    quote: string;
    stats: {
      value: string;
      label: string;
    }[];
    strengths: {
      title: string;
      description: string;
      icon: string;
      theme: "primary" | "secondary" | "tertiary";
    }[];
  };
  contact: {
    address: string;
    addressSub: string;
    phone: string;
    phoneNote: string;
    email: string;
    emailEditorial: string;
    operatingHours: string;
    mapsUrl: string;
    mapsEmbedUrl: string;
  };
  social: {
    instagram: string;
    twitter: string;
    linkedin: string;
    youtube: string;
  };
  navigation: {
    label: string;
    href: string;
  }[];
  services: ServiceItem[];
  news: NewsItem[];
}

export const siteConfig: SiteConfig = {
  name: "Bookers",
  tagline: "Menyalakan Semangat Literasi & Ruang Imajinasi Indonesia",
  category: "Toko Buku, Kurasi Sastra & Penerbitan Mandiri",
  about: {
    story:
      "Didirikan pada tahun 2018 di Jakarta, Bookers bermula dari keyakinan sederhana: bahwa akses terhadap bacaan bermutu mampu membentuk peradaban yang kritis dan berempati. Kami meramu toko buku fisik bernuansa hangat, platform kurasi daring, serta studio penerbitan mandiri yang membimbing penulis lokal melahirkan karya berdaya saing global.",
    quote:
      "“Sebuah buku yang bagus bukan yang sekadar selesai dibaca, melainkan yang terus menyalakan dialog di dalam kepala.”",
    stats: [
      { value: "650+", label: "Judul Terbit Mandiri" },
      { value: "98.4%", label: "Kepuasan Penulis Mitra" },
      { value: "34 Kota", label: "Jaringan Distribusi" },
      { value: "12.000+", label: "Anggota Komunitas" },
    ],
    strengths: [
      {
        title: "Kurasi Kuratorial Ketat",
        description:
          "Setiap buku dipilih langsung oleh tim kurator sastra dan sains untuk menjamin kualitas bacaan terbaik tanpa kompromi tren sesaat.",
        icon: "verified",
        theme: "secondary",
      },
      {
        title: "Penerbitan Inklusif & Adil",
        description:
          "Skema royalti transparan, pendampingan penyuntingan mendalam oleh editor berpengalaman, dan jaminan distribusi terstruktur secara nasional.",
        icon: "handshake",
        theme: "primary",
      },
      {
        title: "Ruang Kolaborasi Komunitas",
        description:
          "Kafe literasi kami menjadi wadah rutin bedah buku mingguan, lokakarya penulisan naskah, dan pertemuan klub baca interaktif yang inklusif.",
        icon: "groups",
        theme: "tertiary",
      },
    ],
  },
  contact: {
    address: "Jl. Senopati Raya No. 42, Kebayoran Baru, Jakarta Selatan 12190",
    addressSub: "Kebayoran Baru, Jakarta Selatan (5 menit dari MRT Senayan)",
    phone: "+62 812-8899-7700",
    phoneNote: "Respon cepat tanggap via WhatsApp",
    email: "halo@bookers.id",
    emailEditorial: "naskah@bookers.id",
    operatingHours: "Senin – Minggu: 08.00 – 22.00 WIB",
    mapsUrl: "https://maps.app.goo.gl/TUoghCEi7ZaDoCCS6",
    mapsEmbedUrl:
      "https://maps.google.com/maps?q=-6.2576296,106.7428141&hl=id&z=15&output=embed",
  },
  social: {
    instagram: "https://instagram.com",
    twitter: "https://twitter.com",
    linkedin: "https://linkedin.com",
    youtube: "https://youtube.com",
  },
  navigation: [
    { label: "Beranda", href: "#beranda" },
    { label: "Tentang Kami", href: "#tentang-kami" },
    { label: "Layanan", href: "#layanan" },
    { label: "Kabar & Artikel", href: "#kabar-artikel" },
    { label: "Kontak", href: "#kontak" },
  ],
  services: [
    {
      id: "curated-bookstore",
      title: "Toko Buku Kurasi & Kafe Literasi",
      description:
        "Pengalaman belanja buku luring dan daring dengan rekomendasi personal serta racikan kopi artisan lokal di lounge bernuansa tenang.",
      badge: "Luring & Daring",
      icon: "storefront",
      badgeType: "default",
      linkText: "Pesan Paket Buku",
      href: "/pesan",
    },
    {
      id: "independent-publishing",
      title: "Penerbitan & Percetakan Naskah",
      description:
        "Layanan terpadu proofreading, tata letak, ilustrasi sampul, pengurusan ISBN legalitas, hingga cetak berkualitas tinggi berstandar internasional.",
      badge: "Penerbitan",
      icon: "history_edu",
      badgeType: "default",
      linkText: "Ajukan Naskah",
      href: "#kontak",
    },
    {
      id: "institution-supply",
      title: "Pengadaan Buku Institusi & Sekolah",
      description:
        "Paket perpustakaan sekolah, kantor korporat, dan ruang baca publik dengan diskon khusus komunitas dan pendampingan katalog tematik.",
      badge: "Institusi",
      icon: "apartment",
      badgeType: "default",
      linkText: "Katalog Institusi",
      href: "/pesan?package=pkg_antologi_nusantara",
    },
    {
      id: "book-box-subscription",
      title: "Program Langganan Buku (Book Box)",
      description:
        "Paket kejutan buku bertema bulanan dilengkapi merchandise literasi eksklusif, pembatas edisi terbatas, dan surat pengantar dari kurator.",
      badge: "Populer",
      icon: "inventory_2",
      badgeType: "popular",
      linkText: "Langganan Sekarang",
      href: "/pesan?package=pkg_book_box_monthly",
    },
    {
      id: "writing-workshops",
      title: "Lokakarya & Diskusi Penulisan",
      description:
        "Kelas intensif penulisan fiksi, non-fiksi, dan apresiasi sastra bersama sastrawan, jurnalis, dan editor kenamaan tanah air.",
      badge: "Edukasi",
      icon: "school",
      badgeType: "default",
      linkText: "Jadwal Kelas",
      href: "#kontak",
    },
    {
      id: "digital-distribution",
      title: "Distribusi & Promosi Digital",
      description:
        "Jangkauan distribusi naskah ke seluruh jaringan toko buku terkemuka di Indonesia serta integrasi penjualan e-book pada platform internasional.",
      badge: "Jaringan",
      icon: "hub",
      badgeType: "default",
      linkText: "Skema Distribusi",
      href: "#kontak",
    },
  ],
  news: [
    {
      id: "realisme-magis-asia-tenggara",
      title:
        "Membaca Ulang Realisme Magis dalam Lanskap Sastra Asia Tenggara Kontemporer",
      slug: "realisme-magis-asia-tenggara",
      excerpt:
        "Bagaimana penulis muda Indonesia mengolah kembali mitos lokal menjadi refleksi kritis persoalan sosial modern.",
      category: "Resensi Buku",
      date: "14 Mei 2025",
      readTime: "5 mnt baca",
      thumbnail: "/images/news-1.jpg",
    },
    {
      id: "malam-puisi-senopati",
      title:
        "Malam Puisi Senopati: Membuka Ruang Dialog Inklusif bagi Generasi Baru",
      slug: "malam-puisi-senopati",
      excerpt:
        "Ratusan penikmat sastra berkumpul di Bookers Lounge merayakan peluncuran antologi puisi kemanusiaan dan kebebasan berekspresi.",
      category: "Kabar Komunitas",
      date: "08 Mei 2025",
      readTime: "4 mnt baca",
      thumbnail: "/images/news-2.jpg",
    },
    {
      id: "panduan-proposal-naskah",
      title: "Panduan Menyusun Proposal Naskah yang Memikat Penerbit Idaman Anda",
      slug: "panduan-proposal-naskah",
      excerpt:
        "Langkah-langkah esensial dari meja dewan redaksi Bookers untuk membantu karya perdana Anda lolos telaah kurasi tanpa berbelit.",
      category: "Tips Penulis",
      date: "29 April 2025",
      readTime: "7 mnt baca",
      thumbnail: "/images/news-3.jpg",
    },
  ],
};

