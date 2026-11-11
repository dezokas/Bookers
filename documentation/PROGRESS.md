 # Progres Proyek - Bookers

Terakhir diperbarui: 11 November 2026  
Posisi saat ini: **Step 4 - Deploy ke Vercel & Mode Maintenance**

## Checklist Proyek

- [x] Inisiasi (data usaha & desain terkumpul)
  - [x] Nama Usaha: Bookers
  - [x] Bidang Usaha: Toko Buku, Kurasi Sastra & Penerbitan Mandiri
  - [x] Narasi Tentang Usaha: Terkumpul & tersimpan terpusat di `src/config/site.ts`
  - [x] Link Google Maps: Terhubung (`https://maps.app.goo.gl/TUoghCEi7ZaDoCCS6`) & iframe embed aktif
  - [x] Referensi Desain: Desain editorial Bookers (`design-reference`) dan screenshot yang diunggah terverifikasi
- [x] STEP 1 - Landing Page
  - [x] Inisialisasi struktur Next.js 14 App Router + Tailwind CSS + TypeScript
  - [x] Konfigurasi Design Tokens (warna warm paper `#fbf9f5`, terracotta primary `#9d4300`, forest green `#006c4a`, font Merriweather & Plus Jakarta Sans, radius, spacing)
  - [x] File konfigurasi terpusat `src/config/site.ts` (seluruh teks dinamis dapat diubah dari sini)
  - [x] Header / Navbar (logo vector, tautan navigasi desktop & drawer mobile aksesibel, scroll spy dinamis)
  - [x] Hero Section (pill statistik berkedip, display headline, CTA ganda, framed photo visual, location & feature badges)
  - [x] About Section (cerita brand dari data inisiasi, manifesto redaksional, 4 counter statistik, 3 kartu keunggulan utama)
  - [x] Service Section (6 kartu layanan kurasi, penerbitan, pengadaan, book box langganan, lokakarya, & distribusi)
  - [x] Berita/Post Section (3 kartu editorial berita & esai sastra, modal pembaca artikel)
  - [x] Contact Section & Google Maps Embed (info kontak, form pesan interaktif dengan feedback sukses, peta iframe responsif)
  - [x] Footer (logo, deskripsi singkat, sosial media, navigasi cepat, info jam buka & alamat, copyright)
  - [x] Media dummy lokal di `public/images/`
  - [x] Metadata SEO dasar (title, description, Open Graph, Twitter cards, favicon `icon.svg`) & halaman 404
  - [x] Responsif diuji (375px mobile, 768px tablet, 1280px desktop)
  - [x] Build produksi (`npm run build`) berhasil 100% tanpa error
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 1 lolos)
- [x] STEP 2 - User Management, Dashboard & Database Google Spreadsheet
  - [x] Apps Script (`code.gs`, `setup.gs`) dibuat di root project + diabaikan oleh `.gitignore`
  - [x] Fungsi inisiasi `initTables()` idempoten (Roles, Users, News, seed admin awal)
  - [x] Sistem autentikasi lengkap (Login, Register, Logout, proteksi route di middleware & server)
  - [x] Password di-hash menggunakan `bcryptjs` (tidak pernah disimpan polos)
  - [x] Sesi cookie `httpOnly` bertanda tangan JWT (`jose`)
  - [x] Role admin & user (role bawaan berstatus `is_system`, tidak bisa dihapus sembarangan)
  - [x] Akun admin awal: `admin@gmail.com` / `123456` (tersimpan sebagai hash)
  - [x] Fitur ganti password admin di Dashboard (`/dashboard/profile`)
  - [x] Dashboard Admin:
    - [x] Ringkasan statistik & banner panduan (`/dashboard`)
    - [x] Manajemen User: cari, ubah role, aktif/nonaktif, proteksi admin terakhir (`/dashboard/users`)
    - [x] Manajemen Role: daftar role, tambah/edit role kustom, hak izin permissions (`/dashboard/roles`)
    - [x] CRUD Berita: tambah, edit, hapus, status draft/publish, pratinjau (`/dashboard/news`)
  - [x] Upload media lokal terisolasi di `public/uploads/` via modul `src/lib/storage.ts`
  - [x] Landing page terhubung langsung ke database artikel berita (`src/components/News.tsx`)
  - [x] Dokumentasi lengkap langkah setup Google Apps Script di `/documentation/SETUP.md`
  - [x] Build produksi lulus tanpa error
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 2 lolos)
- [x] STEP 3 - Sistem Pemesanan Paket Buku & Pembayaran QRIS (Opsi A)
  - [x] Integrasi Barcode QRIS Merchant Resmi (`public/images/qris.jpg`, NMID: ID1026545853032, Mohammad Ammar Ayyasy)
  - [x] Pembaruan `setup.gs` dengan tabel `Orders` & schema 17 kolom
  - [x] Katalog Paket Buku (`src/config/products.ts`): Paket Kurasi Sastra, Book Box Misteri, Paket Penulis Pemula, Koleksi Perpustakaan Mini
  - [x] Form Pemesanan Interaktif (`/pesan`):
    - [x] Pemilihan produk & paket dinamis
    - [x] Pengaturan kuantitas & kalkulasi total harga otomatis
    - [x] Input data penerima, nomor WhatsApp, & alamat pengiriman
    - [x] Integrasi akun pemesan (autofill nama & email jika login)
  - [x] Halaman Tiket Pesanan & Pembayaran QRIS (`/pesanan/[id]`):
    - [x] Tampilan kartu tiket cetak & status pesanan (Badge dinamis)
    - [x] Tampilan Barcode QRIS resmi dengan panduan langkah transfer perbankan/e-wallet
    - [x] Tombol konfirmasi cepat via WhatsApp langsung ke tim Bookers dengan format template pesan
    - [x] Tombol cetak tiket fisik / PDF browser
  - [x] Portal Riwayat Pesanan Pelanggan (`/pesanan-saya`):
    - [x] Tab filter status (Semua, Menunggu Konfirmasi, Dikonfirmasi, Dibatalkan)
    - [x] Akses langsung ke tiket pesanan masing-masing
  - [x] Panel Manajemen Pesanan Admin (`/dashboard/orders`):
    - [x] Filter status pesanan, pencarian nomor tiket / pelanggan
    - [x] Modal verifikasi & konfirmasi pembayaran QRIS
    - [x] Modal pembatalan pesanan dengan input alasan pembatalan
    - [x] Tombol WhatsApp langsung ke pembeli untuk koordinasi pengiriman
  - [x] Integrasi ringkasan statistik pesanan di beranda admin (`/dashboard`)
  - [x] Integrasi navigasi "Pesan Buku" & "Pesanan Saya" di Header Navbar & Drawer Mobile
  - [x] Dikonfirmasi pengguna (Gerbang Konfirmasi Step 3 lolos)
- [ ] STEP 4 - Deploy & Maintenance
  - [ ] Checklist QA sebelum rilis
  - [ ] Deploy ke Vercel
  - [ ] Dikonfirmasi pengguna

## Daftar Gambar Dummy Lokal & Ukuran Ideal

| Nama File | Lokasi Pemakaian | Ukuran Ideal | Keterangan |
|---|---|---|---|
| `logo.svg` | Navbar & Footer | Vektor SVG / 200×48 px | Logo identitas Bookers |
| `hero-bookstore.jpg` | Hero Section | 1200×800 px (3:2) | Suasana ruang baca dan kafe buku |
| `about-team.jpg` | About Section | 800×600 px (4:3) | Tim kurator dan meja redaksi Bookers |
| `news-1.jpg` | Kabar & Artikel 1 | 600×400 px (3:2) | Resensi buku realisme magis |
| `news-2.jpg` | Kabar & Artikel 2 | 600×400 px (3:2) | Dokumentasi malam puisi komunitas |
| `news-3.jpg` | Kabar & Artikel 3 | 600×400 px (3:2) | Meja kerja editor & naskah |
| `qris.jpg` | Halaman Tiket Pembayaran | Rasio QRIS GoPay Merchant | Barcode pembayaran resmi Bookers |

## Catatan & Keputusan Teknis
- **Design Tokens**: Mengacu penuh pada `design-reference/bookers_editorial_commerce/DESIGN.md`.
- **Framework**: Next.js 14 App Router + Tailwind CSS + TypeScript (Vercel-ready).
- **Arsitektur Database**: Next.js API Server -> Google Apps Script Web App -> Google Spreadsheet.
- **Dual-Mode Engine**: Dilengkapi persistent local fallback store (`data/local-database.json`) sehingga seluruh fitur akun dan CRUD dapat langsung diuji secara lokal bahkan sebelum Apps Script selesai dideploy.
- **Keamanan Password**: Menggunakan salt hashing `bcryptjs` 10 rounds. Password `123456` wajib diganti pengguna sebelum rilis publik.

## Cara Menjalankan Secara Lokal
```bash
npm run dev
```
Akses di browser:
- Website: `http://localhost:3000`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/dashboard`
