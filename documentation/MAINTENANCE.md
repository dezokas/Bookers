# Maintenance Log - Bookers

Panduan pencatatan pemeliharaan, bug, backlog fitur, dan riwayat perubahan website Bookers.

---

## 1. Backlog Fitur (Pengembangan Lanjutan)
- [ ] **Payment Gateway Otomatis**: Integrasi Midtrans / Xendit untuk verifikasi pembayaran real-time tanpa perlu konfirmasi manual admin.
- [ ] **Notifikasi Otomatis**: Pengiriman email otomatis (via Resend) atau WhatsApp otomatis kepada pelanggan saat pesanan dibuat dan dikonfirmasi.
- [ ] **Cloud Storage Media**: Pengalihan penyimpanan file upload dari lokal ke cloud (Vercel Blob / Cloudinary) agar tahan banting di lingkungan serverless Vercel.
- [ ] **Katalog Buku Lengkap**: Integrasi pencarian dan filter judul buku berdasarkan kategori sastra, fiksi, non-fiksi, dan anak.

---

## 2. Bug Diketahui
*Belum ada bug aktif yang dilaporkan saat ini. Seluruh alur (Landing Page, Autentikasi, CRUD Berita, Pemesanan QRIS, Dashboard Orders) berjalan normal tanpa error.*

---

## 3. Riwayat Perubahan (Changelog)

### [12 November 2026] - Polish Step 4 & Refinement UI/UX
- **Perbaikan UI:**
  - Memperbaiki efek hover tombol "Konsultasi Naskah" di Hero: background kini bertransisi mulus ke deep forest green (`#006c4a`), warna teks & ikon menjadi putih (`text-white`), serta bayangan dan elevasi naik (`-translate-y-0.5`).
  - Menghilangkan badge kategori ("Resensi Buku" / "Kabar Komunitas") pada seluruh kartu artikel di section Kabar & Artikel landing page.
  - Memperbaiki margin dan padding bottom bar footer agar simetris, rapi, dan menggunakan divider garis modern.
  - Menghapus label "(Published)" pada status artikel di tabel berita, kini hanya bertuliskan "Tayang".
- **Fitur Baru & Perubahan Modal:**
  - Input thumbnail pada modal kelola berita dialihkan sepenuhnya menggunakan input URL gambar langsung (disertai live preview), menghapus tombol "Choose File" / upload lokal.
  - Penambahan fitur pembuatan akun baru non-admin (`role_user`) di `/dashboard/users` melalui tombol "+ Tambah Akun Baru" dan modal form.
  - Penambahan tombol Logout ("Keluar") yang langsung terlihat di Navbar dan Topbar Dashboard.

### [11 November 2026] - Step 3 Selesai & Persiapan Step 4
- **Fitur Baru:**
  - Form Pemesanan Paket Buku interaktif di `/pesan`.
  - Halaman Tiket Pesanan & Scan Barcode QRIS resmi (*GoPay Merchant: Mohammad Ammar Ayyasy*) di `/pesanan/[id]`.
  - Portal riwayat pesanan pelanggan di `/pesanan-saya`.
  - Panel kelola pesanan admin di `/dashboard/orders` dengan filter status, verifikasi bayar, batalkan, dan tombol chat WhatsApp pelanggan.
  - Sinkronisasi tabel `Orders` ke Google Spreadsheet via `code.gs`.
- **Perbaikan UI:**
  - Penataan tombol Hero Section menjadi vertikal (atas-bawah) dan terpusat di tengah.
  - Penyelarasan ukuran tombol navigasi atas (*Pesan Buku* & *Pesanan Saya*).
  - Peningkatan kontras teks pada kartu dashboard *Perlu Konfirmasi*.
  - Pembersihan form login (tanpa autofill bawaan & penghapusan callout kredensial).

### [10 November 2026] - Step 2 Selesai
- **Fitur Baru:**
  - Sistem Autentikasi lengkap: Login, Register, Logout dengan cookie `httpOnly` dan token JWT signed (`jose`).
  - Proteksi hashing kata sandi aman (`bcryptjs`).
  - Database dual-mode: Google Apps Script Web App -> Google Spreadsheet (`Roles`, `Users`, `News`) + local fallback.
  - Admin Dashboard lengkap di `/dashboard`: Manajemen User, Manajemen Role, CRUD Berita dengan upload gambar lokal, serta Profil Ganti Password.

### [9 November 2026] - Step 1 Selesai
- **Fitur Baru:**
  - Landing page profesional Bookers sesuai design token editorial commerce (*warm paper*, *terracotta*, *forest green*).
  - Komponen Hero, About manifesto & statistik, Service katalog, Kabar & Artikel sastra, Kontak form, Footer, dan Google Maps iframe responsif.

