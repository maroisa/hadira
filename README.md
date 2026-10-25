# Web Absensi Karyawan

Aplikasi manajemen kehadiran/absensi karyawan berbasis web yang dibangun menggunakan **Laravel 13**. Sistem ini dirancang untuk mencatat waktu kerja secara akurat serta memberikan fleksibilitas penuh dalam pengaturan jadwal kerja berbasis jabatan (_role-based access control_).

---

## Fitur Utama

### 1. Fleksibilitas Jabatan (RBAC)

Sistem memiliki 3 tingkat jabatan dengan hak akses yang berbeda:

- **Admin & Manager:**
    - Memantau riwayat dan rekap absensi seluruh karyawan.
    - Membuat, mengubah, dan menghapus jadwal kerja baru.
    - Melakukan _assign_ (penugasan) jadwal kerja spesifik ke karyawan tertentu.
- **Karyawan:**
    - Melihat jadwal kerja yang telah ditugaskan.
    - Melakukan pencatatan kehadiran harian.

### 2. Presensi Berbasis Waktu & Lokasi

- **Waktu Real-time:** Mencatat jam masuk (_check-in_) dan jam keluar (_check-out_) secara akurat.
- **Geolokasi:** Mengunci atau mencatat koordinat lokasi (Latitude & Longitude) saat karyawan melakukan absensi masuk dan keluar untuk validasi tempat dengan fleksibilitas _Work From Home_ (WFH).

---

## Instalasi

1. **Clone Repositori**

    ```bash
    git clone https://github.com/username/nama-repositori.git
    cd nama-repositori
    ```

2. **Instalasi Dependency**

    ```bash
    composer install
    ```

3. **Konfigurasi Environment**
   Salin file `.env.example` menjadi `.env` dan sesuaikan kredensial database Anda.

    ```bash
    cp .env.example .env
    php artisan key:generate
    ```

4. **Migrasi Database & Seeding**
   Jalankan migrasi untuk membuat tabel beserta data awal (_seed_) untuk akun Admin, Manager, dan Karyawan default.

    ```bash
    php artisan migrate --seed
    ```

5. **Jalankan Aplikasi**
    ```bash
    php artisan serve
    ```
    Aplikasi dapat diakses melalui browser di `http://127.0.0.1:8000`.

---

## Stack Teknologi

- **Backend:** PHP 8.3+ & Laravel 13
- **Frontend:** Blade
- **Database:** SQLite
