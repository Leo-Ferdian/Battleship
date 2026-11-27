# PROJECT_CONTEXT: Battleship Web Game (Radar taktis / CIC)

Berkas ini adalah pintu masuk untuk AI atau developer mana pun yang melanjutkan proyek. Baca ini dulu, lalu dokumen lain sesuai kebutuhan. Terakhir diperbarui: 26 November 2026.

## 1. Ringkasan satu paragraf

Game Battleship berbasis web, pemain melawan komputer, desktop-first, dwibahasa (Indonesia/Inggris), dibangun dengan React + TypeScript + Vite. Tema visual **Radar taktis**: pemain berperan sebagai komandan di ruang kendali kapal perang (**CIC**, Combat Information Center). Satu layar utama besar dengan saklar **Radar musuh / Dek Anda**, bukan dua papan berdampingan. Proyek ini untuk portofolio sekaligus belajar web dev; pemilik proyek ikut berkontribusi menulis kode.

## 2. Status saat ini

| Tahap | Status | Berkas |
|---|---|---|
| Discovery | Selesai | (tercatat di PRD bagian 4) |
| PRD | Draf v0.7, keputusan disetujui bertahap | `PRD.md` |
| Game design (aturan, AI, kapal, animasi) | Selesai, disetujui | `GAME_DESIGN.md` |
| UX flow dan wireframe | Selesai, konsep CIC disetujui | `UX_FLOW.md` |
| Design System | Draf v0.2. Tipografi dan CSS Modules disetujui; **palet, ukuran teks, dan komponen belum direview pemilik secara eksplisit** | `DESIGN_SYSTEM.md` |
| Prototipe kapal dan animasi | Selesai, gaya disetujui | `prototype-ships-animations.html` |
| Technical Design | Draf v0.1 selesai. Pilihan stack disetujui; alat pendukung (i18n, pengujian, lint) adalah default teknis yang bisa diubah | `TECH_SPEC.md` |
| Rencana implementasi | Draf v0.1 selesai (milestone M0 sampai M9) | `IMPLEMENTATION_PLAN.md` |
| Kode game | **Belum ada.** M0 sedang berjalan: repositori `Leo-Ferdian/Battleship` sudah dibuat, proyek Vite (React 19, Vite 8, TypeScript 6, ESLint 10) sudah di-scaffold, TypeScript ketat dan Prettier aktif, dokumen ada di `docs/`. Berikutnya: Vitest, pagar engine murni, CI, Vercel | - |

Artinya: seluruh perencanaan sudah rampung. Langkah berikutnya adalah menulis kode, dimulai dari milestone M0 (fondasi proyek).

## 3. Peta dokumen

| Berkas | Isi | Kapan dibaca |
|---|---|---|
| `PRD.md` | Tujuan, ruang lingkup MVP, user stories, FR-01 sampai FR-22, non-fungsional, metrik, risiko | Selalu, sebagai acuan kebutuhan |
| `GAME_DESIGN.md` | Aturan main, state machine, penempatan kapal, spesifikasi AI hunt/target, desain kapal, tabel animasi, kasus tepi | Saat menulis engine, AI, atau animasi |
| `UX_FLOW.md` | Peta layar, wireframe, saklar CIC, kontrol tembak dua langkah, alur giliran AI, microcopy log, pintasan keyboard | Saat menulis UI |
| `DESIGN_SYSTEM.md` | Token warna (dengan rasio kontras), tipografi, spasi, token gerak, komponen dan state | Saat menulis styling dan komponen |
| `TECH_SPEC.md` | Arsitektur berlapis, struktur folder, model data, API engine, AI, alur giliran, animasi, i18n, pengujian, CI/CD, risiko teknis | Sebelum menulis kode apa pun |
| `IMPLEMENTATION_PLAN.md` | Milestone M0-M9 dengan tugas dan kriteria penerimaan, Definition of Done, keterlacakan FR, pembagian kerja | Untuk menentukan pekerjaan berikutnya |
| `prototype-ships-animations.html` | Gambar SVG lima kapal (utuh dan tenggelam) dan animasi rudal, kena, meleset, tenggelam | Saat membuat `ShipSprite` dan efek animasi |

Jika dokumen bertentangan: `GAME_DESIGN.md` menang untuk aturan dan perilaku game, `UX_FLOW.md` untuk interaksi, `DESIGN_SYSTEM.md` untuk tampilan, `TECH_SPEC.md` untuk struktur kode, `PRD.md` untuk ruang lingkup.

## 4. Keputusan yang sudah dikunci

**Produk**
- Mode MVP: pemain vs komputer. Online adalah fase berikutnya (belum dijadwalkan); engine dirancang bebas dari UI agar bisa dijalankan di server nanti.
- Platform: desktop browser (Chrome, Firefox, Safari, Edge terbaru). Layout tetap responsif, desktop-first.
- Bahasa: Indonesia dan Inggris, dipilih pengguna. Semua teks lewat i18n sejak awal. Default mengikuti bahasa browser (fallback Inggris), pilihan disimpan di localStorage.

**Teknologi (disetujui pemilik)**
- React + TypeScript (strict) + Vite
- State: **Zustand**
- Styling: **CSS Modules + CSS custom properties**
- Deployment: **Vercel**
- Font: IBM Plex Mono dan IBM Plex Sans, di-host sendiri lewat `@fontsource`, bobot 400 dan 500
- Pintasan saklar: `Tab` dengan `V` sebagai cadangan, dalam satu konstanta (`SHORTCUTS`); keputusan akhir Tab di M8

**Default teknis (usulan, dapat diubah bila ada keberatan)**: `react-i18next`, Vitest + `fast-check` + Testing Library, Playwright (satu smoke test), ESLint + Prettier, elemen `<dialog>` untuk modal, papan berupa grid tombol HTML di atas lapisan seni SVG, npm sebagai package manager.

**Aturan game**
- Papan 10x10 (A-J, 1-10). Armada: Carrier 5, Battleship 4, Cruiser 3, Submarine 3, Destroyer 2.
- Kapal boleh bersentuhan, tidak boleh tumpang tindih. Satu tembakan per giliran. Giliran pertama acak (lempar koin, dapat dilewati dengan klik).
- Nama kapal (ID / EN): Kapal Induk / Carrier, Kapal Perang / Battleship, Penjelajah / Cruiser, Kapal Selam / Submarine, Perusak / Destroyer.

**AI**
- Hunt/target: hunt dengan pola papan catur, target di sekitar titik kena, kunci orientasi setelah dua kena sejajar. Tidak boleh melihat posisi kapal pemain (dijamin tipe `AiView`). Jeda 600-1200 ms. Dibuat sebagai `ShotStrategy` yang bisa diganti. Level kesulitan ditunda.

**UX (konsep CIC)**
- Satu layar utama besar dengan saklar **Radar musuh** (default) dan **Dek Anda**. Panel kiri: kondisi armada (lampu per sel kapal). Panel kanan: log komunikasi dan kontrol tembak.
- Menembak dua langkah: klik sel untuk mengunci target, lalu Tembak, `Enter`, atau klik sel yang sama lagi. `Esc` membatalkan.
- Saat giliran komputer, tampilan otomatis pindah ke Dek Anda lalu kembali ke Radar setelah dampak selesai. Bisa dimatikan di Pengaturan (default aktif).
- Jika kapal pemain diserang saat melihat Radar, lampu **amber** menyala di samping "Dek Anda" dan log mendapat peringatan.
- **Tidak ada tombol mati**: tombol tetap aktif dan merespons lewat pesan di log.
- Pratinjau penempatan kapal: hijau transparan (valid), merah transparan (tidak valid). "Cara bermain" berupa modal singkat.

**Visual**
- Tema tunggal gelap. Latar `#0b1f1a`, aksen hijau `#4fd1a5`, merah `#ff6b57` hanya untuk kerusakan, amber `#ffb347` hanya untuk peringatan. Rasio kontras ada di `DESIGN_SYSTEM.md`.
- Status tembakan tidak pernah hanya warna: titik = meleset, X = kena, kotak penuh = tenggelam.
- Animasi: penguncian target 450 ms, rudal 650 ms, kena 700 ms, meleset 800 ms, tenggelam 2300 ms, banner 1900 ms, lempar koin 1200 ms. Menghormati `prefers-reduced-motion`.

**Arsitektur (ringkas, rinci di `TECH_SPEC.md`)**
- Empat lapisan: UI, Store, Turn Controller + Animation Director, Engine murni. Engine tidak boleh mengimpor React, Zustand, atau memakai DOM, `Math.random`, `Date.now` (ditegakkan ESLint).
- Pola giliran: hitung hasil tembakan dulu (tanpa menyimpan), putar animasi, baru simpan. Log berisi data terstruktur, teks dirender lewat i18n.

## 5. Keputusan yang masih terbuka

| # | Hal | Keterangan |
|---|---|---|
| 1 | Review Design System v0.2 oleh pemilik | Palet, ukuran teks, dan komponen belum ditinjau secara eksplisit |
| 2 | Pintasan `Tab` untuk saklar | Dipasang bersama `V`; diputuskan ulang saat uji aksesibilitas (M8) |
| 3 | Ambang rata-rata tembakan AI di tes simulasi | Ditetapkan setelah simulasi pertama (perkiraan 45-60) |
| 4 | ~~Versi pasti React dan pustaka~~ | Terkunci di `package.json`: React 19.3, Vite 8.4, TypeScript 6.0, ESLint 10 |
| 5 | `eslint-plugin-jsx-a11y` | Belum dipasang (peer dependency baru sampai ESLint 9). Diganti tes axe dan Lighthouse; periksa ulang saat M4 atau M8 |

Tidak ada yang menghalangi dimulainya M0.

## 6. Langkah berikutnya

Mulai **M0 (fondasi proyek)** di `IMPLEMENTATION_PLAN.md`: repositori GitHub, proyek Vite, TypeScript strict, ESLint dan Prettier (termasuk aturan pembatas impor untuk engine), Vitest dengan ambang cakupan, `tokens.css`, font, CI, dan Vercel. Setelah itu M1 (engine inti), M2 (AI), M3 (state dan alur giliran), lalu UI dan animasi (M4-M7), aksesibilitas (M8), dan rilis (M9).

Target MVP yang terukur: satu game selesai dari menu hingga hasil tanpa error, cakupan tes engine minimal 90%, Lighthouse performa dan aksesibilitas minimal 90, situs ter-deploy publik dengan README yang menjelaskan keputusan arsitektur.

## 7. Cara bekerja dengan pemilik proyek

- Berkomunikasi dalam **bahasa Indonesia**. Dokumen proyek berbahasa Indonesia; identifier kode, nama berkas, dan komentar kode memakai bahasa Inggris.
- Pemilik ingin **belajar dan ikut menulis kode**. Jelaskan alasan di balik keputusan teknis, bagi pekerjaan menjadi langkah kecil, dan pakai pola di `IMPLEMENTATION_PLAN.md` bagian 6: AI menyiapkan kerangka dan tes yang gagal, pemilik mengisi bagian "Latihan Anda", lalu ditinjau bersama. Jangan menyerahkan seluruh proyek sekaligus.
- Gaya kerja yang berhasil: satu tahap per giliran, ajukan rekomendasi beserta alasan dan alternatif, pemilik memutuskan, lalu ringkas keputusan sebelum lanjut. Setiap keputusan dicatat di dokumen yang relevan dan di riwayat revisinya.
- Jangan menambah fitur di luar ruang lingkup MVP tanpa persetujuan. Backlog ada di `IMPLEMENTATION_PLAN.md` bagian 7.
- Bedakan hal yang sudah disetujui dari usulan (lihat bagian 4 dan 5).

## 8. Catatan dan jebakan yang sudah diketahui

- `prototype-ships-animations.html` memakai warna dan durasi hardcode dan menganimasikan lewat `requestAnimationFrame`. Di proyek React, ganti dengan token dan Animation Director.
- Wireframe CIC awal menampilkan lampu peringatan berwarna merah. Keputusan final: **amber** (merah hanya untuk kerusakan).
- `--color-line` (`#1f5c46`) kontrasnya hanya 2,19:1 terhadap latar, jadi hanya untuk dekorasi (grid, pemisah). Batas kontrol dan fokus memakai `--color-line-strong` atau lebih terang.
- Animasi "penguncian target" (reticle mengecil) terjadi di langkah 2 (saat menembak). Pada langkah 1 (mengunci target), reticle statis.
- Giliran berikutnya tidak boleh dimulai sebelum animasi dampak dan tenggelam selesai. Input diabaikan selama animasi dan giliran komputer; saklar tampilan tetap bisa dipakai.
- Muat ulang halaman saat game berjalan mengembalikan ke menu (MVP). Hanya pengaturan (bahasa, auto-switch, kurangi gerakan) yang disimpan.
- `Tab` untuk saklar memakai ulang tombol navigasi fokus, jadi berisiko untuk aksesibilitas. Karena itu `V` selalu terpasang.
- React StrictMode memanggil efek dua kali saat pengembangan; efek animasi dan `cancelAll()` harus idempoten.

## 9. Prompt awal yang bisa ditempel ke AI lain

> Kamu melanjutkan proyek game Battleship web (React + TypeScript + Vite, tema Radar taktis, layar utama bergaya CIC dengan saklar Radar musuh / Dek Anda). Baca `PROJECT_CONTEXT.md` terlebih dahulu, lalu `PRD.md`, `TECH_SPEC.md`, dan `IMPLEMENTATION_PLAN.md`; buka `GAME_DESIGN.md`, `UX_FLOW.md`, dan `DESIGN_SYSTEM.md` saat mengerjakan bagian yang relevan. Seluruh perencanaan sudah selesai dan disetujui; jangan mengubah keputusan di bagian 4 tanpa bertanya. Mulai dari milestone M0 di `IMPLEMENTATION_PLAN.md`. Berkomunikasilah dalam bahasa Indonesia. Pemilik proyek ingin belajar dan ikut menulis kode, jadi jelaskan alasan tiap keputusan teknis, kerjakan satu milestone per giliran dengan potongan kecil, siapkan kerangka dan tes yang gagal untuk bagian "Latihan Anda", dan minta persetujuan sebelum menyimpang dari dokumen.
