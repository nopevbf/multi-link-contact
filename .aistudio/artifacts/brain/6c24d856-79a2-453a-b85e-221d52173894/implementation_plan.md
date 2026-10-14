# Simulasi Verifikasi Email Kontak & Validasi Penautan Seksi

Implementasi fitur simulasi verifikasi email tepat di bawah field Email pada modal Tambah/Edit Kontak dengan hitung mundur (*countdown*) 120 detik dan teks "Kirim Ulang", icon ceklis hijau *circle* pada label email di detail kontak, validasi pencegahan penautan (*link*) ke seksi untuk email yang belum diverifikasi, serta migrasi seluruh data kontak lama menjadi terverifikasi.

### User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan keputusan penting berdasarkan klarifikasi pengguna:

- **Alur Simulasi Verifikasi**: Begitu tombol verifikasi di bawah field email diklik, email langsung berstatus terverifikasi (*verified*) secara otomatis dalam simulasi, dan tombol langsung beralih ke mode hitung mundur 120 detik dengan label teks "Kirim Ulang (120s)" hingga timer selesai.
- **Status Data Lama**: Seluruh kontak awal yang sudah ada diatur berstatus `isEmailVerified: true` sehingga penugasan yang sudah ada tetap valid dan fungsional.
- **Validasi Penautan Seksi**: Tombol "Link Kontak Ini" tetap dapat diklik, namun jika email kontak belum diverifikasi, sistem akan memunculkan dialog/notifikasi peringatan validasi bahwa kontak belum dapat di-link sampai emailnya diverifikasi.
- **Indikator Visual Detail Kontak**: Pada modal detail kontak (ikon mata), label Email dilengkapi ikon ceklis hijau *circle* (`CheckCircle2 text-emerald-600`) sebagai penanda resmi status terverifikasi.

---

### 1. Overview & Core Concept

- **Apa yang Dibangun**: Mekanisme verifikasi identitas email PIC hotel untuk memastikan bahwa korespondensi penting sistem OTA hanya ditautkan ke PIC yang email resminya telah divalidasi.
- **Nilai Utama**:
  1. Keamanan & Kredibilitas: Mencegah kesalahan penautan email yang belum valid ke seksi-seksi penting seperti *Invoice & Payment* atau *Customer Support*.
  2. Pengalaman Pengguna Realistis: Fitur countdown 120 detik mencegah *spamming* permintaan OTP/verifikasi dengan indikator visual yang jelas.

---

### 2. User Experience & Visual Design

#### A. Formulir Modal Tambah / Edit Kontak (Di Bawah Field Email)
- Di bawah input `Email *`, terdapat baris aksi simulasi:
  - **State Belum Verifikasi**:
    - Tombol tautan/aksi: `[ Verifikasi Email ]` berwarna biru profesional dengan icon shield/check.
    - Informasi panduan singkat: *"Email harus diverifikasi sebelum kontak dapat di-link ke seksi."*
  - **Saat Diklik**:
    - Email langsung berstatus terverifikasi (`isEmailVerified = true`).
    - Muncul badge status hijau: `✓ Email Berhasil Terverifikasi`.
    - Tombol beralih menjadi nonaktif (*disabled*) dengan teks: `Kirim Ulang (120s)` dengan countdown detik berjalan mundur (119s, 118s ... 0s).
    - Ketika countdown mencapai 0, teks kembali menjadi `Kirim Ulang Verifikasi` dan tombol aktif kembali.

#### B. Modal Detail Kontak (Ikon Mata)
- Pada label **Email Utama**:
  - Ditampilkan icon ceklis hijau *circle* (`CheckCircle2` hijau emerald) tepat di samping label / alamat email terverifikasi:
    `Email Utama (✓ Terverifikasi)` dengan badge hijau lembut.
  - Jika belum diverifikasi (pada kontak baru yang belum diverifikasi): ditampilkan label abu-abu/kuning `(Belum Terverifikasi)`.

#### C. Validasi Penautan pada Tabel Kontak Tersedia (Link Kontak Ini)
- Ketika user mengklik **Link Kontak Ini**:
  - Sistem memeriksa apakah `contact.isEmailVerified` bernilai `true`.
  - Jika `false`, modal penautan **TIDAK dibuka**, dan sistem memunculkan toast/dialog peringatan validasi:
    *"Gagal menautkan: Email [Nama Kontak] belum diverifikasi. Harap verifikasi email kontak terlebih dahulu melalui Edit Kontak."*
  - Jika `true`, modal pemilihan posisi seksi terbuka normal seperti biasa.

---

### 3. Key Product Decisions & Trade-Offs

- **Model Data `isEmailVerified`**:
  - *Pendekatan*: Menambahkan field boolean `isEmailVerified: boolean` (default `true` untuk kontak lama, `false` untuk kontak baru sebelum tombol verifikasi diklik).
  - *Rasional*: Memastikan integritas data dan backward-compatibility sempurna.
- **Penyimpanan State Hitung Mundur**:
  - *Pendekatan*: Timer countdown 120 detik dijalankan via hook `useEffect` dengan interval 1 detik di dalam modal.
  - *Rasional*: Ringan, presisi, dan tidak memberatkan re-render global.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│ Modal Tambah/Edit Kontak                                               │
│                                                                        │
│   Email *                                                              │
│   [ receptionist@gmail.com                                           ] │
│   ┌──────────────────────────────────────────────────────────────────┐ │
│   │ [ Verifikasi Email ]  ──► [✓ Terverifikasi] [Kirim Ulang (120s)] │ │
│   └──────────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Validasi Saat Klik "Link Kontak Ini"                                   │
│                                                                        │
│ • isEmailVerified === true  ──► Buka Modal Link Posisi Seksi           │
│ • isEmailVerified === false ──► Blokir & Tampilkan Peringatan Validasi │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│ Modal Detail Kontak                                                    │
│                                                                        │
│   Email Utama                                                          │
│   receptionist@gmail.com  (● ✓ Terverifikasi)                          │
└────────────────────────────────────────────────────────────────────────┘
```
