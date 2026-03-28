# Sedia

<p align="center">
	<img src="./public/logo/sedia_logo_primary.svg" alt="Logo Sedia" width="220" />
</p>

Sedia adalah aplikasi pemantauan cuaca dan potensi bencana yang membantu pengguna mendapatkan informasi lokasi, prakiraan cuaca, peringatan dini, serta ringkasan analisis untuk mendukung kesiapsiagaan.

## Gambaran Umum

- Menampilkan kondisi cuaca terkini berdasarkan lokasi pengguna.
- Menyediakan prakiraan cuaca beberapa hari ke depan.
- Menampilkan informasi gempa dan berita terkait peringatan cuaca.
- Mendukung pembaruan lokasi otomatis (GPS) maupun manual.
- Menyediakan analisis berbasis AI sebagai panduan tambahan.

## Fitur Utama

- Dashboard cuaca dan bencana dengan data real-time.
- Integrasi lokasi pengguna untuk hasil yang lebih relevan.
- Komponen antarmuka interaktif dengan animasi ringan.
- Halaman autentikasi untuk akses pengguna.

## Tech Stack


- Next.js (App Router)
- React
- TypeScript
- Motion
- Tailwind CSS
- Supabase

## Deploy Guide

Ikuti langkah berikut untuk menjalankan aplikasi di komputer lokal.

1. Install dependency:

```bash
npm install
```

2. Siapkan file environment:

```bash
cp .env.example .env.local
```

Jika file `.env.example` belum tersedia, buat `.env.local` lalu isi variabel yang dibutuhkan aplikasi, minimal:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_OPEN_WEATHER_API_KEY=
GEMINI_API_KEY=
```

3. Jalankan server development:

```bash
npm run dev
```

4. Buka di browser:

http://localhost:3000

## Catatan
- Agar geolocation dapat berjalan pastikan jalankan next js dengan https.
- Pastikan koneksi internet aktif untuk pengambilan data cuaca/bencana.
- Untuk akurasi lokasi terbaik, aktifkan izin lokasi pada browser/perangkat.
