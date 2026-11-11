export interface ProductPackage {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  description: string;
  features: string[];
  badge?: string;
  image: string;
}

export const bookPackages: ProductPackage[] = [
  {
    id: "pkg_book_box_monthly",
    name: "Paket Langganan Book Box Bulanan",
    subtitle: "Kurasi Buku Pilihan & Suvenir Literasi",
    price: 185000,
    badge: "Paling Populer",
    description:
      "Paket kejutan buku bulanan yang dikurasi khusus oleh dewan redaksi Bookers. Setiap edisi dilengkapi pembatas buku artistik, surat pengantar kurator, dan racikan sampel kopi artisan.",
    features: [
      "2 Judul buku kurasi sastra/esai pilihan",
      "Surat pengantar refleksi dari dewan kurator",
      "Pembatas buku eksklusif edisi terbatas",
      "Sample drip bag kopi artisan Bookers Lounge",
      "Akses gratis ke Bedah Buku Online bulanan",
    ],
    image: "/images/news-1.jpg",
  },
  {
    id: "pkg_antologi_nusantara",
    name: "Paket Antologi Sastra Klasik Nusantara",
    subtitle: "Koleksi Karya Penulis Maestro Indonesia",
    price: 245000,
    badge: "Koleksi Sastra",
    description:
      "Kompilasi mahakarya sastra Indonesia yang dicetak dengan kertas berkualitas tinggi, sampul hard-cover elegan, dan catatan kontekstual sejarah peradaban Nusantara.",
    features: [
      "3 Buku sastra klasik pilihan bernas",
      "Hardcover edisi kolektor bertekstur kain",
      "Esai telaah kritis pendamping bacaan",
      "Kotak kemasan eksklusif Bookers Press",
    ],
    image: "/images/news-2.jpg",
  },
  {
    id: "pkg_kurasi_editor",
    name: "Paket Koleksi Pilihan Meja Editor",
    subtitle: "Rekomendasi Naskah Kontemporer Terbaik",
    price: 290000,
    badge: "Rekomendasi Redaksi",
    description:
      "Ragam novel dan bunga rampai terbaru dari penulis independen mitra Bookers yang telah melewati proses telaah naskah mendalam.",
    features: [
      "3 Judul fiksi & non-fiksi berdaya gugah",
      "Bonus notebook catatan bacaan eksklusif",
      "Totebag kanvas edisi 'Menyalakan Semangat Literasi'",
    ],
    image: "/images/hero-bookstore.jpg",
  },
  {
    id: "pkg_starter_penulis",
    name: "Paket Bimbingan & Cetak Penulis Mandiri",
    subtitle: "Starter Kit Penulis Naskah Pemula",
    price: 450000,
    badge: "Khusus Penulis",
    description:
      "Panduan lengkap penerbitan mandiri, voucher proofreading 1 naskah hingga 10.000 kata, serta 5 eksemplar buku cetak perdana berstandar ISBN resmi.",
    features: [
      "Review naskah dan konsultasi 1-on-1 via Google Meet / Senopati",
      "Panduan tata letak (layout) dan legalitas ISBN",
      "Voucher diskon 20% cetak skala nasional",
      "5 Eksemplar buku contoh cetak berkualitas",
    ],
    image: "/images/news-3.jpg",
  },
];

