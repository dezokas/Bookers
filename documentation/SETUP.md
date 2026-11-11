# Panduan Setup Proyek Bookers

Dokumen ini berisi panduan teknis menjalankan aplikasi secara lokal dan menghubungkan database Google Spreadsheet menggunakan Google Apps Script.

---

## 1. Menjalankan di Komputer Lokal

1. Buka terminal di folder proyek:
   ```bash
   npm run dev
   ```
2. Buka browser di alamat:
   ```
   http://localhost:3000
   ```
3. Akun Administrator Bawaan:
   - **Email:** `admin@gmail.com`
   - **Password:** `123456`
   - Halaman Login: `http://localhost:3000/login`
   - Dashboard Admin: `http://localhost:3000/dashboard`

> ⚠️ **PERINGATAN KEAMANAN:**  
> Password `123456` adalah kredensial awal untuk memudahkan pengujian. Segera ganti password administrator melalui menu **Dashboard > Profil & Keamanan** sebelum website dipublikasikan ke production.

---

## 2. Setup Database Google Spreadsheet (Google Apps Script)

Aplikasi Bookers menggunakan Google Spreadsheet sebagai database melalui perantara Google Apps Script Web App. Arsitekturnya:
```
Browser -> Next.js (Server API) -> Apps Script Web App -> Google Spreadsheet
```
*Mengapa ada lapisan server Next.js?* Supaya spreadsheet tidak bisa diakses sembarang orang dari browser dan kunci rahasia tetap aman.

### Langkah demi Langkah:

### Langkah A: Siapkan Spreadsheet & Editor Apps Script
1. Buka [Google Drive](https://drive.google.com/) atau langsung [Google Sheets](https://sheets.new) untuk membuat spreadsheet baru.
2. Beri nama spreadsheet, misalnya: `Database Bookers`.
3. Di menu atas Google Sheets, klik **Ekstensi (Extensions)** > **Apps Script**.

### Langkah B: Salin File `setup.gs` dan Jalankan Inisiasi Tabel
1. Pada editor Apps Script, ganti nama file `Code.gs` default menjadi `setup.gs` (atau buat file baru).
2. Buka file `setup.gs` yang ada di root proyek Bookers komputer Anda, lalu salin seluruh kodenya ke file `setup.gs` di editor Apps Script.
3. Di bagian dropdown fungsi atas, pilih **`initTables`**.
4. Klik tombol **Jalankan (Run)**.
5. Google akan meminta izin akses (*Authorization Required*) -> Klik *Review permissions* -> Pilih akun Google Anda -> Klik *Advanced* -> Klik *Go to Untitled project (unsafe)* -> Klik *Allow*.
6. Buka kembali spreadsheet Anda. Anda akan melihat 3 sheet sudah terbentuk otomatis dengan baris header berwarna oranye terracotta khas Bookers:
   - `Roles` (berisi role `admin` dan `user`)
   - `Users` (berisi akun `admin@gmail.com`)
   - `News` (berisi 3 artikel kurasi sastra)
   - `Orders` (tabel pesanan paket buku & status pembayaran QRIS)

> 💡 **Catatan:** Fungsi `initTables()` bersifat **idempoten**, artinya aman dijalankan berulang kali tanpa merusak atau menduplikasi data yang sudah ada. Kode `code.gs` versi terbaru juga telah dilengkapi *auto-create* tabel `Orders` otomatis saat pesanan pertama masuk.

### Langkah C: Salin File `code.gs`
1. Di editor Apps Script, buat file baru: klik tombol **+** di samping *Files* > pilih **Script**, lalu beri nama `code`.
2. Buka file `code.gs` di root proyek Bookers komputer Anda, salin seluruh kodenya ke file `code.gs` di editor Apps Script, lalu klik ikon Simpan (Ctrl+S / Cmd+S).

### Langkah D: Isi Script Properties (Kunci Rahasia)
1. Di bilah menu kiri editor Apps Script, klik ikon roda gigi **Project Settings (Setelan Project)**.
2. Gulir ke bawah ke bagian **Script Properties (Properti Skrip)**.
3. Klik **Add script property (Tambahkan properti skrip)**:
   - **Property:** `APPS_SCRIPT_SECRET`
   - **Value:** `bookers_super_secret_token_2026` *(atau token rahasia yang sama persis dengan yang ada di `.env.local` Anda)*
4. Klik **Save script properties**.

### Langkah E: Deploy sebagai Web App
1. Di pojok kanan atas editor Apps Script, klik tombol biru **Deploy** > **New deployment**.
2. Klik ikon gerigi di sebelah *Select type* > pilih **Web app**.
3. Isi setelan berikut:
   - **Description:** `Bookers Production API v1`
   - **Execute as:** `Me (email-anda@gmail.com)`
   - **Who has access:** `Anyone (Siapa saja)` *(wajib dipilih agar server Next.js Anda bisa memanggilnya)*
4. Klik **Deploy**.
5. Salin **Web app URL** yang dihasilkan (formatnya: `https://script.google.com/macros/s/AKfycb.../exec`).
6. Tempelkan URL tersebut ke file `.env.local` di komputer Anda:
   ```env
   APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycb.../exec
   APPS_SCRIPT_SECRET=bookers_super_secret_token_2026
   ```
7. Restart server dev Anda (`npm run dev`). Kini website Anda telah terhubung penuh ke Google Spreadsheet!

### Cara Memperbarui Deployment Jika Kode Apps Script Berubah:
Setiap kali Anda mengubah kode di `code.gs` atau `setup.gs`:
1. Klik **Deploy** > **Manage deployments**.
2. Klik ikon pensil (Edit).
3. Pada dropdown **Version**, pilih **New version**.
4. Klik **Deploy**. (URL Web App tidak akan berubah).

---

## 4. Alur Pengujian Pemesanan & Pembayaran QRIS (Step 3)

1. **Memesan Paket Buku:**
   - Kunjungi `http://localhost:3000/pesan` (atau klik tombol **Pesan Buku** di Navbar).
   - Pilih paket buku (misal: *Paket Langganan Book Box Bulanan* atau *Paket Antologi Sastra*).
   - Tentukan kuantitas (total harga akan dihitung otomatis).
   - Masukkan nama penerima, nomor WhatsApp, dan alamat pengiriman lengkap.
   - Klik **Konfirmasi & Buat Pesanan**.

2. **Melihat Tiket Pesanan & Scan QRIS:**
   - Setelah memesan, Anda akan langsung dialihkan ke halaman tiket pesanan: `http://localhost:3000/pesanan/[id]`.
   - Tiket menampilkan barcode resmi **QRIS GoPay Merchant (MOHAMMAD AMMAR AYYASY, DIGITAL & KREATIF, NMID: ID1026545853032)**.
   - Pembeli dapat menekan tombol **Konfirmasi Pembayaran via WhatsApp** untuk konfirmasi cepat atau **Cetak Tiket Pesanan**.

3. **Verifikasi oleh Admin:**
   - Masuk ke dashboard admin di `http://localhost:3000/dashboard/orders`.
   - Admin melihat daftar seluruh pesanan yang masuk dengan status *Menunggu Konfirmasi*.
   - Admin dapat menekan tombol hijau **Konfirmasi Pembayaran** (status akan berubah menjadi *Dikonfirmasi*).
   - Atau menekan tombol merah **Batalkan** dengan menyertakan alasan pembatalan.
   - Admin juga dapat mengklik ikon WhatsApp untuk langsung membuka obrolan ke nomor pembeli.

4. **Portal Pelanggan:**
   - Pelanggan yang telah login dapat melihat daftar pesanan mereka di menu `http://localhost:3000/pesanan-saya`.

Semua file gambar sampul berita saat ini disimpan secara lokal di folder `public/uploads/` dan path-nya dicatat ke database.
- Cara ini berfungsi sempurna saat dijalankan di **komputer lokal (development)**.
- **Penting untuk Vercel:** Disk server Vercel bersifat sementara (*ephemeral* & *read-only*) di production. File yang diunggah saat aplikasi berjalan tidak akan bertahan permanen di disk Vercel.
- Seluruh logika penyimpanan telah kami bungkus rapi di satu modul khusus: `src/lib/storage.ts` (`saveFile` / `deleteFile`).
- Pada **Step 4**, kami akan mendampingi Anda jika ingin mengarahkan penyimpanan gambar ke cloud storage (seperti Vercel Blob, Cloudinary, atau Google Drive) tanpa merombak kode aplikasi.
