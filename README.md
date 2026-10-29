# UTARA GRADU - Graduation Photography Web Booking Platform 🎓📸

Platform aplikasi web pemesanan (*booking*) sesi foto wisuda *on-location* (area kampus & spot outdoor) resmi dari **UTARA GRADU** (Instagram: `@utara.photo`, WhatsApp: `0821-2077-6606` a/n Tara).

---

## 🌟 Fitur Utama Sistem

### 1. 📦 Katalog Paket Wisuda
- **Paket Basic (Rp 350.000):** Sesi 1 Jam penuh (solo), 20 foto diedit high-resolution, semua file mentah via Google Drive.
- **Paket Combo (Rp 500.000):** Sesi 2 Jam santai, wisudawan + maks. 4 orang keluarga/sahabat, 30 foto diedit high-resolution, cetak 10R + bingkai minimalis, all softcopy via Drive. *(Paling Populer)*
- **Paket Premium (Rp 550.000):** Sesi 2 Jam ekstra, wisudawan + maks. 8 orang pendamping, 30 foto diedit high-resolution, cetak 12R/16R + bingkai kayu eksklusif, all softcopy via Drive, prioritas editing kilat (3 hari kerja).

### 2. 📅 Pilihan Durasi Sesi & Slot Jam Bulat (06.00 - 16.00 WIB)
- **Selektor Durasi Interaktif:** Pilihan fleksibel **⏱️ Sesi 1 Jam** (Paket Solo/Basic) dan **⏱️ Sesi 2 Jam** (Paket Combo & Premium) langsung di formulir booking.
- **Jam Operasional Pemotretan:** Dimulai dari **jam 6 pagi (06.00) sampai 16.00 WIB**.
- **Slot Jam Bulat Otomatis:**
  - **Sesi 1 Jam:** Slot 1 jam bulat mulai `06.00-07.00`, `07.00-08.00`, `08.00-09.00`, hingga `15.00-16.00`.
  - **Sesi 2 Jam:** Slot 2 jam bulat mulai `06.00-08.00`, `08.00-10.00`, `10.00-12.00`, `12.00-14.00`, `13.00-15.00`, hingga `14.00-16.00`.
- Slot yang sudah terisi otomatis bertanda `Terisi` dan dinonaktifkan guna mencegah bentrok jadwal (*double-booking*).

### 3. ✍️ Form Registrasi Customer Fleksibel
- Input manual bebas untuk **Nama Universitas** dan **Lokasi Titik Temu Spot Kampus/Outdoor** (tanpa dropdown kaku dan tanpa studio indoor).
- Nomor WhatsApp validasi format Indonesia (`08xx` / `628xx`).
- Akun Instagram wisudawan untuk *tagging* hasil foto teaser.

### 4. 📲 Integrasi Konfirmasi WhatsApp & Foto QRIS Resmi
- **Metode Pembayaran DP:** Terintegrasi scan **QRIS Resmi Standar Nasional** (BCA Mobile, Livin Mandiri, GoPay, OVO, DANA, ShopeePay) serta transfer manual Bank BCA.
- **Modal Pembayaran & Unduh QRIS:** Wisudawan dapat melihat foto QRIS beresolusi tinggi, memperbesar, serta mengunduh gambar QRIS ke galeri HP.
- **Salin Rekening Instan:** Tombol satu klik untuk menyalin nomor rekening Bank BCA ke clipboard.
- **Konfirmasi Instan via WhatsApp:** Tombol **"Kirim Konfirmasi ke WhatsApp"** otomatis membuka tautan `wa.me` ke nomor `082120776606` dengan pesan berformat rapi dan ber-emoticon.

### 5. 🔍 Pelacak Jadwal (Cek Status Booking)
- Wisudawan dapat mengecek kepastian slot mereka kapan saja dengan memasukkan kode booking.
- Menampilkan timeline status: `1. Registrasi Sukses` ➔ `2. Verifikasi DP` ➔ `3. Hari-H Sesi Foto`.
- **Upload Bukti Transfer DP Langsung:** Wisudawan dapat langsung melampirkan foto struk transfer DP BCA dari HP atau komputer.

### 6. 📸 Galeri Portofolio & Lightbox Preview
- Galeri foto resolusi tinggi dengan filter kategori: `Semua Karya`, `Solo Portrait`, `Sahabat & Grup`, dan `Keluarga`.
- Klik gambar untuk membuka **Modal Lightbox Fullscreen** dengan efek zoom.

### 7. ⭐ Rating & Ulasan Pelayanan (Terbuka untuk Semua Wisudawan)
- **Tanpa Login / Akun:** Seluruh wisudawan dapat langsung memberikan rating bintang 1–5, nama lengkap, universitas, serta ulasan testimoni secara instan.
- **Transparansi Publik:** Ulasan langsung tayang secara transparan di halaman Rating & Ulasan lengkap dengan skor agregat (4.9/5.0) dan rincian bintang.

### 8. 🔒 Login Khusus Admin Studio (Kak Tara)
- **Autentikasi Terproteksi:** Fitur login dikhususkan hanya untuk Admin Studio (Kak Tara) dengan kata sandi aman.
- **Lock Screen Otomatis:** Mengunci akses ke Panel Admin jika belum terautentikasi.
- **Status & Logout Cepat:** Di navbar dan drawer terdapat indikator badge `👑 Tara (Admin)` dan opsi sekali klik untuk keluar (*logout*).

### 9. ⚙️ Panel Pengelola Studio (Admin Kak Tara)
- **Daftar Pesanan:** Filter pencarian status, verifikasi pembayaran DP, dan kirim konfirmasi resmi WA.
- **📅 Kalender & Timeline Sesi Harian:** Matrix jadwal visual per jam bulat (`06.00 - 16.00`) pada tanggal terpilih lengkap dengan metrik estimasi omzet dan status slot terisi vs kosong.
- **📸 Kelola Galeri Portofolio (Tambah & Hapus Foto):** Admin dapat mengunggah foto wisuda baru langsung dari file gambar HP/PC atau link URL, mengatur judul & kategori (`Solo Portrait`, `Sahabat & Grup`, `Keluarga`), mengedit rincian foto, serta menghapus foto kapan saja.
- **📸 Selesai Pemotretan & Kirim Link Google Drive:** Tombol penyelesaian sesi yang langsung menyimpan tautan Google Drive album foto serta mengirimkan notifikasi WA otomatis ke wisudawan.
- **Inspeksi Bukti Transfer:** Tombol `🖼️ Struk DP` untuk memeriksa foto struk yang diunggah customer secara langsung.
- **Unduh Rekap (CSV/Excel):** Sekali klik mengunduh rekap pesanan ke spreadsheet Microsoft Excel.
- **Master Paket CRUD:** Tambah paket baru atau edit harga, durasi, dan fitur paket secara visual.
- **Pengaturan Rekening & WhatsApp:** Ubah nomor rekening bank dan nomor kontak admin.

### 10. 🖨️ Cetak / Unduh E-Receipt Resmi (PDF & Print)
- **Tanda Terima Resmi:** Dilengkapi header studio UTARA GRADU, tanggal terbit, stempel digital *✓ TERVERIFIKASI RESMI*, rincian biaya DP Rp 100.000, serta sisa pelunasan di Hari-H.
- **Dukungan Cetak A4 / PDF:** Dapat diakses langsung setelah reservasi sukses, melalui menu *Cek Status Booking*, maupun via panel Admin.
- Tampilan cetak otomatis membersihkan elemen navigasi dan tombol web berkat styling `@media print`.

### 11. 📱 Desain 100% Fleksibel di Seluruh Perangkat (Multi-Device Responsive)
- **Fluid Layout & Breakpoints:** Dioptimalkan secara menyeluruh untuk smartphone ultra-compact (380px), smartphone standar (iPhone/Android 540px), tablet portrait (768px), tablet landscape/laptop (1024px), hingga desktop 4K.
- **Responsive Mobile Drawer (Hamburger Menu):** Navigasi slide-in yang nyaman untuk layar smartphone dengan backdrop blur.
- **Form-Row Adaptif:** Form isian wisudawan otomatis bersusun 1 kolom di layar HP dan 2 kolom di layar PC/tablet tanpa merusak proporsi tata letak.
- **Floating WhatsApp Quick-Chat Button:** Tombol mengambang di pojok kanan bawah dengan animasi denyut (*pulse*) untuk memudahkan customer langsung bertanya ke Kak Tara.

### 12. 📑 Navigasi Halaman Terpisah (Per-Page Multi-View Experience)
- **Struktur Halaman Mandiri:** Setiap menu (`Beranda & Paket`, `Portofolio`, `Form Reservasi`, `Rating & Ulasan`, `Panel Admin`) tampil terpisah sebagai satu halaman utuh tanpa bertumpuk panjang ke bawah.
- **Client-Side Hash Router:** Mendukung navigasi URL bersih (`#/beranda`, `#/paket`, `#/portofolio`, `#/booking`, `#/rating`, `#/admin`), tombol *Back* / *Forward* browser, dan penautan langsung (*deep linking*).
- **Transisi Halus:** Efek perpindahan halaman yang instan tanpa *reload* layar putih yang mengganggu.

---

## 🚀 Cara Menjalankan Secara Lokal

### 13. 🗄️ Backend Engine (Node.js Express + SQLite Database)
- **Persistent Database (SQLite):** Seluruh data pesanan (`bookings`), paket wisuda (`packages`), galeri portofolio (`portfolio`), ulasan testimoni (`reviews`), dan konfigurasi rekening/QRIS (`config`) tersimpan secara permanen di database `data/utara_gradu.sqlite`.
- **Anti-Bentrok Jadwal Sisi Server (Slot Collision Locking):** Mencegah dua pelanggan memesan jam sesi yang sama secara bersamaan (HTTP 409 Conflict Prevention).
- **RESTful API Terpadu di Port 8080:** Backend menyajikan REST API (`/api/...`) sekaligus melayani file frontend (`index.html`, `js/app.js`, `css/style.css`) pada port tunggal `8080` tanpa kendala CORS.
- **Dukungan Hibrida (Online + Offline LocalStorage Fallback):** Apabila server offline, web tetap dapat berjalan secara lokal berkat sinkronisasi otomatis.

---

## 🚀 Cara Menjalankan Secara Lokal

### Opsi 1 (Paling Cepat & Otomatis):
Cukup **klik dua kali (*double click*)** file:
```text
start_server.bat
```
Server Node.js Express + SQLite akan otomatis berjalan di port 8080 dan membuka browser Anda di:
👉 `http://127.0.0.1:8080/`

### Opsi 2 (Melalui Terminal / PowerShell):
```powershell
cd "e:\pebe\web booking"
node server.js
```

---

## 🌐 Panduan Deploy ke Internet (Production Deployment)

Aplikasi ini telah dirancang **100% Production-Ready** untuk berjalan secara gratis (zero-cost, tanpa perlu kartu kredit) menggunakan arsitektur modern:
- **Frontend & Serverless API:** [Vercel](https://vercel.com) (Hosting global berkecepatan tinggi & SSL otomatis)
- **Cloud Database SQLite:** [Turso](https://turso.tech) (Database SQLite berbasis Edge/LibSQL gratis hingga 9 GB)

---

### 🚀 Cara Deploy: Vercel + Turso Cloud SQLite (Gratis & Permanen)

#### Langkah 1: Buat Database Gratis di Turso
1. Buka [turso.tech](https://turso.tech) dan login dengan akun GitHub Anda (`AsepRochmat`).
2. Klik tombol **Create Database**, beri nama (misal: `utara-gradu`), dan pilih lokasi server terdekat (misal: **Singapore / `sin`**).
3. Setelah database dibuat, salin **Database URL** yang berformat:
   ```text
   libsql://utara-gradu-aseprochmat.turso.io
   ```
4. Klik tab **Generate Token** / **Create Token**, lalu salin string token otentikasinya.

#### Langkah 2: Deploy Proyek ke Vercel
1. Buka [vercel.com/new](https://vercel.com/new) dan login dengan GitHub.
2. Cari dan klik **Import** pada repositori `AsepRochmat/utara-gradu-booking`.
3. Pada halaman konfigurasi (Configure Project), buka menu accordion **Environment Variables**, lalu tambahkan 2 variabel berikut:
   - **Nama:** `TURSO_DATABASE_URL`  
     **Nilai:** `libsql://utara-gradu-aseprochmat.turso.io` (URL dari Turso Anda)
   - **Nama:** `TURSO_AUTH_TOKEN`  
     **Nilai:** `ey...` (Token dari Turso Anda)
4. Klik tombol **Deploy**.
5. Dalam waktu ~20-30 detik, website Anda resmi aktif dengan domain HTTPS gratis (contoh: `https://utara-gradu-booking.vercel.app`)!

> **Keunggulan Arsitektur Ini:**
> - Data pesanan, konfigurasi nomor WhatsApp Kak Tara, paket harga, galeri, dan review tersimpan aman di cloud Turso SQLite.
> - Tidak akan hilang atau ter-reset meski dyno/server restart.
> - 100% Gratis selamanya tanpa meminta verifikasi kartu kredit.

---

### Informasi Kredensial Penting:
- **Akses Panel Admin:** `https://<domain-vercel-anda>/#/admin`
- **Kata Sandi Admin:** `admin123` (atau `tara123`)
- **Nomor Kontak WhatsApp Kak Tara:** `+62 821-2077-6606`

---

## 📁 Struktur Berkas

```text
web booking/
├── api/
│   └── index.js                    # Serverless Function Entry Point untuk Vercel
├── public/                         # Direktori Static Asset resmi Vercel CDN
│   ├── assets/                     # Foto hero, portofolio, logo & QRIS
│   ├── css/
│   │   └── style.css               # Design system modern (Terracotta #b3423f)
│   ├── js/
│   │   └── app.js                  # Frontend Controller, ApiService & WA modal
│   └── index.html                  # Halaman utama responsif & semantik
├── data/
│   └── utara_gradu.sqlite          # Database SQLite lokal (untuk mode offline/development)
├── server/
│   └── db.js                       # Dual-Mode Database DAO (Turso Cloud SQLite & Local SQLite)
├── package.json                    # Konfigurasi dependensi Node.js (@libsql/client, express, cors)
├── server.js                       # Server backend Express & REST API endpoints
├── vercel.json                     # Konfigurasi routing serverless Vercel
├── PRD.md                          # Dokumen Product Requirement Document
├── start_server.bat                # Script batch runner server lokal (node server.js)
└── README.md                       # Panduan dokumentasi lengkap proyek
```

---
&copy; 2026 **UTARA GRADU** (`@utara.photo`) • WhatsApp: `+62 821-2077-6606 (Tara)`.
