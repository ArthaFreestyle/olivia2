<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://raw.githubusercontent.com/laravel/art/master/logo-lockup/5%20SVG/2%20CMYK/1%20Full%20Color/laravel-logolockup-cmyk-red.svg" width="400" alt="Laravel Logo"></a></p>

<p align="center">
<a href="https://github.com/laravel/framework/actions"><img src="https://github.com/laravel/framework/workflows/tests/badge.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/dt/laravel/framework" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/v/laravel/framework" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://img.shields.io/packagist/l/laravel/framework" alt="License"></a>
</p>

<h1 align="center">PanganMerata</h1>

![PanganMerata Screenshot](https://drive.google.com/uc?export=view&id=1AqDt_lnWH3ASxKKvFz5QLvPAMLVfJj-p)

# 🌾 PanganMerata

**PanganMerata** merupakan platform digital terintegrasi yang dirancang untuk mengatasi ketimpangan informasi distribusi pangan di Indonesia. Website ini menghadirkan dua sistem utama yang saling melengkapi:

## 🛰️ Sistem Utama

### 1. Sistem Pemantauan Produksi Spasial
Memantau data produksi beras kuartalan dari tiap provinsi untuk menganalisis tren (naik, turun, atau stabil). Data ini mendukung pengambilan kebijakan pangan jangka menengah dan mendeteksi lonjakan atau penurunan ekstrem produksi untuk intervensi seperti:
- Subsidi pupuk
- Dukungan harga
- Cadangan pangan pemerintah

### 2. Sistem Pengelolaan Logistik Adaptif (Freight Pooling)
Mengoptimalkan distribusi pangan dengan:
- Perbaikan rute dan kapasitas kendaraan logistik
- Kolaborasi antar pemangku kepentingan melalui platform terintegrasi



## ⚙️ Fitur Utama

- **📈 Analitik Prediktif**: Mendukung pengambilan keputusan logistik dan pasokan berbasis data produksi beras.
- **🚛 Freight Pooling**: Distribusi yang efisien dan kolaboratif.
- **🔗 Integrasi Distributor**: Menghubungkan distributor informal ke dalam sistem logistik resmi.
- **🛒 Konektivitas Pasar**: Membuka akses pasar lebih luas berbasis data, bukan intuisi.



## 🧰 Teknologi yang Digunakan

- **Laravel** (Backend)
- **Supabase** (Database PostgreSQL)
- **React.js** (Frontend)
- **OpenStreetMap (OSM)** (Pemetaan)
- **OSRM** (Open Source Routing Machine untuk rute logistik)
- **LangChain & Gemini** (AI-based NLP & analitik)
- **Deployment**:
  - Backend: Microsoft Azure
  - Frontend: Vercel

## Dokumentasi
<a href="https://drive.google.com/drive/folders/1igC6fP5oYONSxLnRa8tdRsp5V5Ay8vWX?usp=drive_link">Dokumen</a>
<a href="https://drive.google.com/file/d/1BZGnd3OhrRGa6JDACBpt_QnINbOmHuyw/view?usp=sharing">Video</a>


---

## 🚀 Instalasi & Penggunaan

⚠️ **CATATAN PENTING:**  
Jangan jalankan php artisan migrate karena proyek ini **menggunakan Supabase sebagai database utama**.  Seluruh struktur tabel sudah tersedia di Supabase dan tidak perlu migrasi ulang.

### Langkah-langkah:

1. **Clone Repositori**
   
```bash
   git clone https://github.com/ArthaFreestyle/olivia2.git
   cd olivia2
```

2. **Install Dependency PHP**

```bash
   composer install
   composer update
```

3. **Install Dependency JavaScript**
(Gunakan opsi --legacy-peer-deps untuk menghindari konflik versi dependency)

```bash
   npm install --legacy--peer-deps
```

4. **Build Asset Frontend**

```bash
   npm run build
```

5. **Jalankan Laravel**

```bash
   php artisan serve
```

### Catatan Tambahan
1. File .env sudah tersedia di repository, jadi tidak perlu melakukan konfigurasi manual untuk environment variable.
2. Pastikan koneksi internet aktif agar integrasi ke Supabase dan layanan pihak ketiga berjalan lancar.


### Kontak
Email: elia21196@gmail.com
Whatsapp: 085778445682
