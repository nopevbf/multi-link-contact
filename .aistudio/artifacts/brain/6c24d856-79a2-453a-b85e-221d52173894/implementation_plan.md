# Pembaruan Formulir Modal Tambah Kontak & Kelengkapan Data PIC

Penyesuaian antarmuka dan struktur data formulir modal Tambah/Edit Kontak sesuai dengan format acuan visual yang diunggah pengguna, mencakup 7 field lengkap (Nama Kontak, Posisi, Email, Email Sekunder, Nomor Telepon, Fax, dan Jam Operasional) dengan penataan 2 kolom yang presisi.

### User Review & Critical Decisions

> [!IMPORTANT]
> Ringkasan keputusan berdasarkan klarifikasi kebutuhan pengguna:

- **Peran Posisi pada Modal Tambah Kontak**: Posisi yang dipilih pada modal Tambah Kontak berfungsi sebagai posisi dasar/default profil kontak. Saat kontak di-link ke seksi tertentu, posisi default ini otomatis terisi namun tetap dapat diubah atau disesuaikan secara independen untuk tiap seksi tanpa saling menimpa.
- **Tampilan Jam Operasional**: Ditampilkan sebagai opsi pilihan tunggal (*single-choice*) berformat kotak horizontal sesuai gambar acuan (*Available 24/7*, *Working Hours (9 AM-5 PM)*, dan *Hide Operational Hours*).
- **Tata Letak Formulir 2 Kolom**:
  - Kolom Kiri: Nama Kontak (\*), Email (\*), Nomor Telepon (\*)
  - Kolom Kanan: Posisi (\*), Email sekunder (jika ada), Fax (jika ada)
  - Bagian Bawah: Jam Operasional (pilihan tunggal horizontal)

---

### 1. Overview & Core Concept

- **Apa yang Diubah**: Memperbarui modal tambah dan edit kontak agar mencakup atribut komunikasi properti yang lengkap sesuai standar operasional hotel, serta menyelaraskan tata letak visual persis dengan referensi visual yang diberikan.
- **Nilai Tambah**:
  1. Data kontak lebih komprehensif dengan adanya email cadangan/sekunder, jalur fax hotel, dan preferensi jam operasional PIC.
  2. Alur penautan lebih cepat: kontak yang baru ditambahkan langsung memiliki posisi dasar yang dapat digunakan otomatis saat menautkan ke seksi, tanpa menghilangkan fleksibilitas posisi independen per seksi.

---

### 2. User Experience & Visual Design

#### A. Struktur Formulir Modal Tambah / Edit Kontak
1. **Baris 1 (2 Kolom)**:
   - **Nama Kontak \***: Input teks dengan placeholder `"Nama lengkap"`.
   - **Posisi \***: Dropdown seleksi posisi standar (seperti *Hotel Receptionist*, *Finance Manager*, *Hotel Operational*, *General Manager*, dll.) dengan opsi input teks kustom.
2. **Baris 2 (2 Kolom)**:
   - **Email \***: Input email utama dengan placeholder `"Contoh: receptionist@gmail.com"`.
   - **Email sekunder (jika ada)**: Input email cadangan dengan placeholder `"Contoh: receptionist2@gmail.com"`.
3. **Baris 3 (2 Kolom)**:
   - **Nomor Telepon \***: Input telepon / WhatsApp dengan placeholder `"Contoh: 0812-3456-7890"`.
   - **Fax (jika ada)**: Input nomor fax dengan placeholder `"Contoh: (021) 555-1234"`.
4. **Baris 4 (Lebar Penuh)**:
   - Label: `"Jam Operasional (hanya bisa piliha satu)"`.
   - Pilihan interaktif horizontal:
     - `[ ] Available 24/7`
     - `[ ] Working Hours (9 AM-5 PM)`
     - `[ ] Hide Operational Hours`
   - Interaksi eksklusif: memilih salah satu akan otomatis mengosongkan pilihan lainnya.
5. **Aksi Tombol**:
   - `Batal` dan `Simpan Kontak`.

#### B. Integrasi Visual pada Tabel & Modal Detail
- **Tabel Kontak Tersedia**:
  - Menampilkan posisi dasar kontak jika belum di-link ke seksi mana pun, atau menampilkan badge seksi yang terhubung jika sudah di-link.
- **Modal Detail Kontak (Ikon Mata)**:
  - Menampilkan ringkasan lengkap: Email primer, Email sekunder, Nomor Telepon, Nomor Fax, dan Badge Jam Operasional.

---

### 3. Key Product Decisions & Trade-Offs

- **Model Data Terstruktur (Backward Compatible)**:
  - *Pendekatan*: Menambahkan field opsional `secondaryEmail`, `fax`, `operationalHours`, dan `basePosition` ke tipe `PropertyContact`.
  - *Rasional*: Memastikan data kontak yang sudah ada tetap valid tanpa error, sementara kontak baru langsung memanfaatkan atribut lengkap ini.
- **Sinkronisasi Posisi**:
  - *Pendekatan*: Ketika user mengklik `Link Kontak Ini`, modal penautan seksi akan mempramuat (*pre-fill*) posisi dasar kontak sebagai default, sehingga user cukup klik konfirmasi atau menggantinya jika posisi pada seksi tersebut berbeda.

---

### 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────────────────────┐
│                      Modal Tambah / Edit Kontak                        │
│                                                                        │
│   Nama Kontak *                      Posisi *                          │
│   [ Nama lengkap               ]     [ Hotel Receptionist        ▼ ]   │
│                                                                        │
│   Email *                            Email sekunder (jika ada)         │
│   [ Contoh: receptionist@...   ]     [ Contoh: receptionist2@...   ]   │
│                                                                        │
│   Nomor Telepon *                    Fax (jika ada)                    │
│   [ Contoh: 0812-3456-7890     ]     [ Contoh: (021) 555-1234      ]   │
│                                                                        │
│   Jam Operasional (hanya bisa piliha satu)                             │
│   [■] Available 24/7   [ ] Working Hours (9 AM-5 PM)  [ ] Hide Hours   │
│                                                                        │
│                                                  [Batal] [Simpan]      │
└────────────────────────────────────────────────────────────────────────┘
```

#### Struktur Tipe TypeScript
```typescript
export type OperationalHoursType = '24/7' | 'working_hours' | 'hidden';

export interface PropertyContact {
  id: string;
  propertyId: string;
  name: string;
  basePosition: string; // Posisi dasar yang diisi saat Tambah Kontak
  email: string;
  secondaryEmail?: string;
  phone: string;
  fax?: string;
  operationalHours: OperationalHoursType;
  notes?: string;
  createdAt: string;
  updatedAt?: string;
}
```
