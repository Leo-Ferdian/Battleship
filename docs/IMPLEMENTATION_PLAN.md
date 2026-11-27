# Rencana Implementasi: Battleship Web Game

**Status:** Draft v0.1
**Dokumen terkait:** `PRD.md`, `TECH_SPEC.md`, `GAME_DESIGN.md`, `UX_FLOW.md`, `DESIGN_SYSTEM.md`
**Terakhir diperbarui:** 26 November 2026

---

## 1. Cara membaca rencana ini

- Pekerjaan dibagi menjadi **10 milestone (M0 sampai M9)**. Tiap milestone menghasilkan sesuatu yang bisa dijalankan atau diuji, bukan hanya kumpulan berkas.
- Ukuran memakai **S / M / L** (relatif), bukan jam, karena Anda mengerjakan sambil belajar. Perkiraan: S sekitar satu sesi kerja, M beberapa sesi, L banyak sesi.
- **Latihan Anda** menandai bagian yang sebaiknya Anda tulis sendiri agar belajarnya nyata. AI menyiapkan kerangka, tes yang gagal, dan penjelasan; Anda mengisi implementasinya, lalu kita tinjau bersama.
- Urutan sengaja dari bawah ke atas: engine dites dulu sebelum ada layar apa pun, sehingga UI dibangun di atas fondasi yang sudah terbukti benar.

## 2. Definition of Done (berlaku untuk semua milestone)

1. Semua tugas milestone selesai dan kriteria penerimaannya terpenuhi.
2. CI hijau: lint, typecheck, tes, build.
3. Kode baru punya tes yang relevan (engine wajib memenuhi ambang cakupan).
4. Tidak ada teks UI yang ditulis langsung di komponen (semua lewat i18n, sejak M4).
5. Tidak ada warna, ukuran, atau durasi hardcode di komponen (semua lewat token).
6. Pull request kecil, dijelaskan singkat, dan sudah ditinjau.
7. Dokumen terkait diperbarui bila ada keputusan yang berubah.

## 3. Ringkasan milestone

| # | Milestone | Ukuran | Hasil yang bisa diperlihatkan |
|---|---|---|---|
| M0 | Fondasi proyek | S | Situs kosong ter-deploy di Vercel dengan CI hijau |
| M1 | Engine inti | M | Tes membuktikan aturan Battleship benar |
| M2 | AI hunt/target | M | Simulasi 1000 game AI selesai dengan statistik |
| M3 | State dan alur giliran | M | Satu game penuh berjalan lewat tes (tanpa UI) |
| M4 | Fondasi UI, i18n, Menu | L | Menu dwibahasa dengan komponen dasar dan seni kapal |
| M5 | Layar Penempatan | M | Armada dapat ditempatkan manual dan acak |
| M6 | Layar CIC dan Hasil | L | **MVP dapat dimainkan dari awal sampai akhir (tanpa animasi)** |
| M7 | Animasi | L | Rudal, dampak, tenggelam, banner, koin, transisi saklar |
| M8 | Aksesibilitas, responsif, polesan | M | Lighthouse 90+, keyboard penuh, reduced motion |
| M9 | QA dan rilis | S | v1.0.0 produksi dengan README lengkap |

## 4. Rincian milestone

### M0. Fondasi proyek (S)

**Tugas**
- Buat repositori GitHub dan proyek Vite (React + TypeScript).
- Aktifkan TypeScript `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- Pasang ESLint (`typescript-eslint`, `react-hooks`, `jsx-a11y`) dan Prettier. Tambahkan aturan pembatas impor untuk `src/engine/**`.
- Pasang Vitest dengan ambang cakupan untuk engine.
- Buat `tokens.css` dari `DESIGN_SYSTEM.md` dan pasang font lewat `@fontsource`.
- Buat workflow CI. Hubungkan Vercel.
- README kerangka dan struktur folder dari `TECH_SPEC.md` bagian 4.

**Kriteria penerimaan**: `npm run lint && npm run typecheck && npm run test && npm run build` lolos; pull request mendapat URL pratinjau Vercel; mengimpor `react` di dalam `src/engine` membuat lint gagal (diuji sengaja sekali).

**Latihan Anda**: membuat repositori, menghubungkan Vercel, dan menjalankan skrip pertama sendiri.

### M1. Engine inti (M)

**Tugas**: `types.ts`, `constants.ts`, `rng.ts`, `coords.ts`, `board.ts`, `placement.ts`, `shooting.ts`, `game.ts` sesuai `TECH_SPEC.md` bagian 5 dan 6. Tulis tes bersamaan dengan kodenya (tes dulu bila memungkinkan).

**Kriteria penerimaan**
- Semua invarian di `TECH_SPEC.md` bagian 6 dibuktikan dengan tes properti.
- Kasus tepi tercakup: pojok papan, kapal bersentuhan, tumpang tindih, kapal keluar papan, tembakan pada sel yang sama, tembakan terakhir.
- Cakupan `src/engine` minimal 90% dan diwajibkan oleh konfigurasi.

**Latihan Anda**: `coords.ts` (parse dan format "D5") dan `randomFleet`. AI menyiapkan tes yang gagal terlebih dahulu.

### M2. AI hunt/target (M)

**Tugas**: antarmuka `ShotStrategy`, `huntTarget` sesuai `TECH_SPEC.md` bagian 7, dan `getAiView`.

**Kriteria penerimaan**
- AI tidak pernah menembak sel yang sama, dan tidak pernah menerima data posisi kapal (dijamin tipe `AiView`).
- Setelah kena, AI menyelesaikan kapal sebelum kembali mencari; dua kena sejajar mengunci orientasi.
- Kasus kapal bersentuhan tertangani (kena belum selesai tetap dikejar setelah kapal lain tenggelam).
- Simulasi 1000 game: seluruhnya selesai, rata-rata tembakan tercatat. Ambang regresi ditetapkan dari hasil pertama dan masuk ke tes.

**Latihan Anda**: fungsi pemilihan kandidat mode target (garis versus tetangga).

### M3. State dan alur giliran (M)

**Tugas**: `gameStore`, `settingsStore` (dengan persist yang aman), `turnController` dengan dependensi yang disuntik, `AnimationDirector` versi instan untuk tes, dan struktur `LogEvent`.

**Kriteria penerimaan**
- Satu game penuh (penempatan acak, tembak bergantian, game selesai) berjalan dalam tes tanpa UI dan tanpa menunggu animasi.
- Fase giliran berpindah sesuai tabel `TECH_SPEC.md` bagian 8; input diabaikan di luar fase `idle`.
- Keluar ke Menu di tengah giliran membatalkan seluruh proses tanpa galat.
- `settingsStore` tetap berfungsi bila `localStorage` melempar galat.

**Latihan Anda**: aksi `lockTarget` dan aturan "sel sudah ditembak tidak dapat dikunci".

### M4. Fondasi UI, i18n, dan Menu (L)

**Tugas**
- Pasang `react-i18next` dengan kunci diketik, `id.json`, `en.json`, dan tes kelengkapan kunci.
- Komponen dasar: `Button` (empat varian), `ConsolePanel`, `Modal` (`<dialog>`), `Toast`, `TurnIndicator`.
- `ShipSprite`: pindahkan lima kapal dari `prototype-ships-animations.html` menjadi komponen SVG bertipe dengan token warna.
- `Board` tiga lapisan dan `Cell` dengan semua state di `DESIGN_SYSTEM.md` bagian 6.3 (belum animasi).
- Layar **Menu**, modal **Cara bermain**, modal **Pengaturan** (bahasa, auto-switch, kurangi gerakan), pemilih bahasa di Menu.

**Kriteria penerimaan**: mengganti bahasa mengubah seluruh teks seketika dan tersimpan setelah muat ulang; modal tertutup dengan `Esc` dan fokus kembali ke pemicu; galeri komponen sementara (halaman dev) menampilkan semua state sel dan kapal; tidak ada literal teks UI di JSX.

**Latihan Anda**: `Cell` (semua state) dan berkas `id.json`/`en.json`.

### M5. Layar Penempatan (M)

**Tugas**: daftar armada, pratinjau mengikuti kursor (hijau valid, merah tidak valid), rotasi (`R`, klik kanan, tombol), angkat dan pindah kapal, **Acak**, **Reset**, **Mulai** (tetap aktif; jika belum lengkap, log menampilkan "Tempatkan semua kapal dulu" dan kapal yang belum terpasang berkedip).

**Kriteria penerimaan**: kelima kapal dapat ditempatkan manual maupun acak; penempatan tidak valid tidak pernah tersimpan; menekan Mulai sebelum lengkap tidak memulai game; seluruh alur dapat diselesaikan hanya dengan keyboard.

**Latihan Anda**: logika pratinjau dan rotasi di sisi UI.

### M6. Layar CIC dan Hasil (L)

**Tugas**
- Layout tiga kolom (bilah atas, panel kiri `FleetStatus`, layar utama, panel kanan `CommLog` dan `FireControl`).
- `ViewSwitch` (Radar musuh / Dek Anda) dengan panel kiri yang ikut berganti; kontrol tembak meredup di Dek.
- Kontrol tembak dua langkah: kunci target, Tembak / `Enter` / klik ulang, `Esc` membatalkan.
- Lempar koin sederhana (belum animasi), dapat dilewati.
- Giliran AI terhubung ke controller: auto-switch ke Dek lalu kembali; lampu peringatan amber dan baris peringatan di log bila auto-switch mati.
- Layar **Hasil** (menang/kalah, statistik, kapal lawan tersisa terungkap, Main lagi, Kembali ke menu) dan konfirmasi keluar di tengah game.
- Pintasan lewat konstanta `SHORTCUTS` (`Tab`, `V`, `Enter`, `Esc`, panah).

**Kriteria penerimaan (MVP dapat dimainkan)**: satu game penuh dari Menu hingga Hasil, tanpa galat, di kedua bahasa; pesan "Pilih target dulu" dan "D5 sudah ditembak" muncul sesuai `UX_FLOW.md`; mengganti bahasa di tengah game mengubah log; Main lagi kembali ke Penempatan.

**Latihan Anda**: `FireControl` (dua langkah) dan `CommLog`.

### M7. Animasi (L)

**Tugas**: implementasi `AnimationDirector` sungguhan dan seluruh efek: reticle penguncian, rudal dengan jejak, dampak kena (kilatan, cincin, percikan, getar kapal), riak meleset, kapal tenggelam, banner, lempar koin, transisi pindai saklar 350 ms, sapuan radar latar. Durasi dari `timings.ts` disalin ke CSS variables. Reduced motion sesuai `TECH_SPEC.md` bagian 9.

**Kriteria penerimaan**: setiap tembakan memutar urutan lengkap dan giliran berikutnya baru mulai setelah selesai; keluar ke Menu saat animasi tidak meninggalkan efek hantu; dengan reduced motion tidak ada getar, riak, atau sapuan, tetapi informasi tetap sampai lewat log dan banner; animasi tetap lancar (tanpa patah terlihat) di laptop biasa.

**Latihan Anda**: satu efek penuh, misalnya riak meleset, dari awal sampai akhir.

### M8. Aksesibilitas, responsif, polesan (M)

**Tugas**: navigasi keyboard papan (roving tabindex), label ARIA sel dan wilayah `aria-live`, audit kontras dengan nilai di `DESIGN_SYSTEM.md`, keputusan akhir `Tab` versus `V`, breakpoint (>= 1100 px tiga kolom, 800-1099 px ringkas, < 800 px panel menjadi laci), uji dengan pembaca layar, perapian visual (bingkai konsol, baut sudut, penyesuaian rasa gerak).

**Kriteria penerimaan**: Lighthouse performa dan aksesibilitas minimal 90; seluruh game dapat dimainkan hanya dengan keyboard; pembaca layar mengumumkan giliran, hasil tembakan, kapal tenggelam, dan hasil akhir; tidak ada gulir horizontal di lebar 800 px.

### M9. QA dan rilis (S)

**Tugas**: smoke test Playwright, uji manual di Chrome, Firefox, Safari, dan Edge terbaru, cek ukuran bundel (maksimal 150 KB gzip), README final (tangkapan layar, cara menjalankan, ringkasan arsitektur, catatan keputusan, tautan dokumen), deploy produksi, tag `v1.0.0`.

**Kriteria penerimaan**: seluruh metrik sukses PRD bagian 10 terpenuhi (game selesai end-to-end, cakupan engine minimal 90%, Lighthouse minimal 90, situs publik dengan README).

## 5. Keterlacakan: kebutuhan PRD ke milestone

| Kebutuhan | Milestone |
|---|---|
| FR-01 sampai FR-04 (papan, armada, penempatan) | M1 (aturan), M5 (UI) |
| FR-05 (giliran pertama acak, lempar koin dapat dilewati) | M3 (logika), M6 (UI), M7 (animasi) |
| FR-06, FR-07, FR-08, FR-09 (tembakan, hasil, game berakhir) | M1 (aturan), M6 (UI) |
| FR-10 sampai FR-13 (AI) | M2, terhubung di M6 |
| FR-14, FR-15 (i18n dan penyimpanan bahasa) | M4, M3 |
| FR-16, FR-17 (animasi dan reduced motion) | M7, diverifikasi di M8 |
| FR-18 sampai FR-21 (CIC, tembak dua langkah, auto-switch, lampu peringatan) | M6 |
| FR-22 (Pengaturan) | M4 (modal), M3 (persist) |
| Non-fungsional: aksesibilitas, performa, kompatibilitas | M8, M9 |

## 6. Cara kita bekerja per milestone

1. **Rencana singkat**: tujuan, tugas, dan bagian "Latihan Anda" disepakati di awal.
2. **Kerangka dan tes lebih dulu**: AI menyiapkan struktur dan tes yang gagal; Anda mengisi bagian latihan.
3. **Tinjau bersama**: AI meninjau kode Anda (benar, terbaca, aman tipe) dan menjelaskan perbaikannya.
4. **Pull request kecil**: satu per potongan kerja, CI hijau sebelum digabung.
5. **Demo dan catat keputusan**: tunjukkan hasilnya, perbarui dokumen bila ada yang berubah, lalu lanjut.

## 7. Setelah MVP (backlog, urutan prioritas awal)

1. Level kesulitan AI (mudah dan sulit; strategi baru tanpa mengubah engine)
2. Efek suara dan musik
3. Melanjutkan game setelah muat ulang
4. Statistik dan riwayat permainan
5. Pemain 2 lokal
6. Varian aturan (tembakan tambahan setelah kena)
7. Tema visual tambahan
8. Mode online (butuh Node.js dan WebSocket; engine dan model data sudah disiapkan, lihat `TECH_SPEC.md` bagian 16)

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 26 Nov 2026 | Draf awal: milestone M0 sampai M9, DoD, keterlacakan FR, pembagian kerja |
