# PRD: Battleship Web Game

**Status:** Draft v0.7
**Terakhir diperbarui:** 23 November 2026
**Pemilik produk:** (Anda)
**Peran:** Kontributor bersama (product owner + developer)

---

## 1. Ringkasan

Game Battleship berbasis web yang bersih, cepat dimainkan, dwibahasa (Indonesia/Inggris), dan dibangun dengan kualitas kode setara portofolio profesional. Proyek ini juga menjadi sarana belajar pengembangan web modern.

## 2. Tujuan

### Tujuan produk
- Pemain dapat menyelesaikan satu game penuh melawan komputer, dari menu hingga layar hasil.
- Pengalaman bermain intuitif tanpa perlu membaca petunjuk panjang.

### Tujuan proyek
- Menjadi proyek portofolio yang di-deploy publik dengan README yang jelas.
- Menjadi media belajar: arsitektur bersih, testing, i18n, dan deployment.
- Menyiapkan fondasi agar mode online dapat ditambahkan tanpa menulis ulang logika inti.

### Bukan tujuan (MVP)
- Mode multiplayer online
- Akun pengguna dan leaderboard
- Aplikasi mobile native

## 3. Target pengguna

- **Utama:** pemain kasual yang bermain di desktop (mouse dan keyboard).
- **Sekunder:** perekrut atau sesama developer yang menilai kualitas kode dan desain.
- Layout tetap responsif, tetapi dioptimalkan untuk desktop (desktop-first).

## 4. Keputusan yang sudah disepakati

| Aspek | Keputusan |
|---|---|
| Mode MVP | Pemain vs komputer |
| Mode lanjutan | Online (fase berikutnya, belum dijadwalkan) |
| Platform utama | Desktop browser |
| Framework | React + TypeScript + Vite |
| Bahasa antarmuka | Indonesia dan Inggris, dapat dipilih pengguna |
| Arah visual | **Radar taktis**: latar gelap, aksen hijau sonar, grid bergaya layar radar. Status tembakan tidak hanya dibedakan warna (titik = meleset, X = kena, kotak penuh = tenggelam) |
| State management | Zustand |
| Styling | CSS Modules + CSS custom properties |
| Deployment | Vercel |
| Font | IBM Plex Mono dan IBM Plex Sans, di-host sendiri |
| Detail teknis lain | Lihat `TECH_SPEC.md` (i18n, pengujian, CI/CD, arsitektur) |

## 5. Ruang lingkup MVP

### Termasuk
- Menu utama (mulai game, cara bermain, pengaturan termasuk bahasa)
- Penempatan kapal: manual (klik dan rotasi) dan acak
- Pertempuran melawan AI bergiliran
- Penanda hasil tembakan: kena, meleset, tenggelam
- Deteksi menang/kalah dan layar hasil
- Tombol main lagi / restart
- Pilihan bahasa dengan penyimpanan preferensi

### Ditunda (backlog)
- Mode online
- 2 pemain lokal (satu perangkat)
- Level kesulitan AI (mudah/sulit)
- Efek suara dan musik
- Statistik dan riwayat permainan
- Tema visual tambahan
- Dukungan layar sentuh penuh

## 6. User stories

| ID | Sebagai... | Saya ingin... | Agar... |
|---|---|---|---|
| US-01 | Pemain | memilih bahasa Indonesia atau Inggris | saya memahami semua teks di game |
| US-02 | Pemain | menempatkan kapal secara manual | saya bisa mengatur strategi sendiri |
| US-03 | Pemain | menempatkan kapal secara acak | saya bisa mulai bermain dengan cepat |
| US-04 | Pemain | memutar arah kapal saat menempatkan | saya bisa memasang kapal horizontal atau vertikal |
| US-05 | Pemain | menembak koordinat di papan lawan | saya bisa menyerang kapal komputer |
| US-06 | Pemain | melihat dengan jelas tembakan kena, meleset, dan kapal tenggelam | saya tahu perkembangan permainan |
| US-07 | Pemain | melihat giliran komputer menembak | saya paham apa yang terjadi di papan saya |
| US-08 | Pemain | mengetahui siapa pemenangnya | saya tahu game sudah selesai |
| US-09 | Pemain | memulai game baru kapan saja | saya bisa main lagi tanpa memuat ulang halaman |
| US-10 | Pemain | bahasa pilihan saya diingat | saya tidak perlu memilih ulang tiap kunjungan |

## 7. Kebutuhan fungsional

### Papan dan kapal
- **FR-01** Papan berukuran 10x10 dengan kolom A-J dan baris 1-10.
- **FR-02** Armada per pemain: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2).
- **FR-03** Kapal hanya boleh diletakkan horizontal atau vertikal, di dalam papan, tanpa tumpang tindih. Kapal boleh saling bersentuhan.
- **FR-04** Penempatan acak selalu menghasilkan konfigurasi valid.

### Pertempuran
- **FR-05** Giliran pertama ditentukan acak (lempar koin dengan animasi singkat). Lempar koin dapat dilewati dengan klik atau `Enter`/`Spasi`.
- **FR-06** Satu giliran = satu tembakan. Sel yang sudah ditembak tidak dapat ditembak lagi.
- **FR-07** Hasil tembakan: meleset, kena, atau kena dan menenggelamkan kapal. Kapal tenggelam diumumkan dengan nama kapalnya.
- **FR-08** Aturan giliran tambahan setelah kena tidak berlaku pada MVP (satu tembakan per giliran).
- **FR-09** Game berakhir ketika seluruh kapal satu pihak tenggelam.

### AI
- **FR-10** AI menembak sel yang belum pernah ditembak.
- **FR-11** Setelah mengenai kapal, AI memprioritaskan sel di sekitar titik kena (mode "hunt/target"), dan menyelesaikan kapal sebelum kembali mencari.
- **FR-12** AI tidak boleh mengakses posisi kapal pemain secara langsung (tidak curang).
- **FR-13** Penempatan kapal AI acak dan tersembunyi dari pemain hingga kapal tenggelam atau game berakhir.

### Bahasa dan penyimpanan
- **FR-14** Semua teks antarmuka melewati sistem terjemahan (tidak ada teks yang ditulis langsung di komponen).
- **FR-15** Bahasa default mengikuti bahasa browser (fallback: Inggris); pilihan pengguna disimpan di localStorage.

### Animasi
- **FR-16** Setiap tembakan menampilkan animasi penguncian target, rudal, dan dampak (kena atau meleset). Kapal tenggelam menampilkan animasi tenggelam dan banner nama kapal. Giliran berikutnya dimulai setelah animasi dampak selesai.
- **FR-17** Animasi menghormati preferensi `prefers-reduced-motion`.

### Layar pertempuran (CIC)
- **FR-18** Layar pertempuran menampilkan satu layar utama berukuran besar dengan saklar dua pilihan: **Radar musuh** (default) dan **Dek Anda**. Panel kiri (kondisi armada) dan panel kanan (log komunikasi dan kontrol tembak) tetap tampil.
- **FR-19** Menembak memakai dua langkah: klik sel untuk mengunci target, lalu tekan Tembak, Enter, atau klik sel yang sama sekali lagi. Esc membatalkan.
- **FR-20** Saat giliran komputer, tampilan beralih otomatis ke Dek Anda dan kembali ke Radar musuh setelah dampak selesai. Perilaku ini dapat dimatikan di Pengaturan (default aktif).
- **FR-21** Jika kapal pemain diserang saat tampilan berada di Radar musuh, lampu peringatan amber di samping "Dek Anda" menyala dan log menambahkan peringatan.
- **FR-22** Pengaturan (modal) memuat: Bahasa, Beralih otomatis ke Dek, dan Kurangi gerakan.

Rincian aturan, AI, kapal, dan animasi ada di `GAME_DESIGN.md`. Rincian alur layar, wireframe, dan interaksi ada di `UX_FLOW.md`. Tampilan visual dan komponen ada di `DESIGN_SYSTEM.md`. Arsitektur teknis ada di `TECH_SPEC.md`, dan rencana kerja per milestone ada di `IMPLEMENTATION_PLAN.md` (termasuk keterlacakan FR ke milestone).

## 8. Kebutuhan non-fungsional

- **Performa:** waktu muat awal di bawah 2 detik pada koneksi broadband; interaksi terasa instan.
- **Keterbacaan:** status kena/meleset/tenggelam tidak hanya dibedakan lewat warna (ikon atau pola tambahan) demi aksesibilitas buta warna.
- **Aksesibilitas:** navigasi keyboard untuk aksi utama, label ARIA pada sel papan, kontras teks memenuhi WCAG AA.
- **Kualitas kode:** TypeScript strict, linting, dan format otomatis.
- **Testabilitas:** logika game (papan, kapal, tembakan, AI) berupa TypeScript murni tanpa ketergantungan ke React, dengan target cakupan tes tinggi pada modul tersebut.
- **Kompatibilitas:** versi terbaru Chrome, Firefox, Safari, dan Edge.
- **Ekstensibilitas:** logika game dapat dijalankan ulang di server pada fase online.

## 9. Alur layar (tingkat tinggi)

1. **Menu utama:** Mulai Game, Cara Bermain, Pengaturan (termasuk bahasa)
2. **Penempatan kapal:** papan sendiri, daftar kapal, tombol Rotasi/Acak/Reset/Mulai
3. **Pertempuran (CIC):** satu layar utama dengan saklar Radar musuh / Dek Anda, status giliran, log komunikasi, kontrol tembak, dan panel kondisi armada
4. **Hasil:** menang/kalah, ringkasan singkat, tombol Main Lagi dan Kembali ke Menu

Detail wireframe ada di `UX_FLOW.md`.

## 10. Metrik sukses

- Satu game dapat diselesaikan end-to-end tanpa error.
- Seluruh acceptance criteria MVP lolos.
- Cakupan tes modul logika game minimal 90%.
- Skor Lighthouse (performa dan aksesibilitas) minimal 90.
- Situs ter-deploy publik dengan README (tangkapan layar, cara menjalankan, keputusan arsitektur).

## 11. Risiko dan mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Logika game bercampur dengan UI | Sulit dites dan sulit dipakai untuk mode online | Pisahkan modul engine sejak awal |
| Bug pada penempatan atau pengecekan tabrakan kapal | Game tidak valid | Tes unit dan tes berbasis properti pada penempatan acak |
| AI terlalu mudah atau terlalu membosankan | Pengalaman bermain buruk | Mulai dengan hunt/target, uji manual, evaluasi level kesulitan di backlog |
| Teks i18n tertinggal dalam satu bahasa | Pengalaman tidak konsisten | Aturan lint/tes untuk memeriksa kelengkapan kunci terjemahan |
| Cakupan proyek membengkak | MVP tidak selesai | Daftar backlog yang tegas; fitur baru masuk setelah MVP rilis |

## 12. Pertanyaan terbuka

1. ~~Arah visual~~ Diputuskan: Radar taktis (lihat bagian 4).
2. ~~Tembakan tambahan setelah kena~~ Diputuskan: tidak ada, satu tembakan per giliran.
3. ~~Giliran pertama~~ Diputuskan: acak (lempar koin).
4. ~~State management dan styling~~ Diputuskan: Zustand, CSS Modules + CSS custom properties.
5. ~~Platform deployment~~ Diputuskan: Vercel.

Tidak ada pertanyaan terbuka yang menghalangi implementasi. Hal kecil yang diputuskan saat pengerjaan dicatat di `TECH_SPEC.md` bagian 18.

## 13. Tahap berikutnya

1. ~~Menetapkan arah visual~~ (selesai)
2. ~~Game Design Spec~~ (selesai, lihat `GAME_DESIGN.md`)
3. ~~UX flow dan wireframe~~ (selesai, lihat `UX_FLOW.md`)
4. ~~Design System~~ (draf selesai, lihat `DESIGN_SYSTEM.md`)
5. ~~Technical Design~~ (draf selesai, lihat `TECH_SPEC.md`)
6. ~~Rencana implementasi dan milestone~~ (draf selesai, lihat `IMPLEMENTATION_PLAN.md`)
7. Implementasi, dimulai dari milestone M0

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 Nov 2026 | Draf awal berdasarkan hasil Discovery |
| 0.2 | 23 Nov 2026 | Arah visual ditetapkan: Radar taktis |
| 0.3 | 23 Nov 2026 | Aturan main dan AI disetujui; kapal dan animasi disetujui; FR-03 dan FR-05 diperbarui; FR-16 dan FR-17 (animasi) ditambahkan |
| 0.4 | 23 Nov 2026 | Konsep layar CIC disetujui (saklar Radar/Dek, tembak dua langkah, auto-switch giliran AI); FR-18 sampai FR-22 ditambahkan; alur layar diperbarui |
| 0.5 | 23 Nov 2026 | Tipografi disetujui (IBM Plex Mono dan Sans); Design System draf v0.1 ditambahkan; alur layar dan ruang lingkup disinkronkan dengan UX |
| 0.6 | 26 Nov 2026 | Tahap desain produk dan visual dinyatakan selesai; PROJECT_CONTEXT.md dan prototipe kapal/animasi ditambahkan untuk serah terima |
| 0.7 | 26 Nov 2026 | Keputusan teknis disetujui (Zustand, CSS Modules, Vercel, font self-host); TECH_SPEC.md dan IMPLEMENTATION_PLAN.md ditambahkan; FR-05 diperbarui (koin dapat dilewati); pertanyaan terbuka ditutup |
