# Game Design Spec: Battleship Web Game

**Status:** Draft v0.4 (keputusan sudah disetujui, menjadi acuan `TECH_SPEC.md`)
**Dokumen terkait:** `PRD.md`, `UX_FLOW.md`, `DESIGN_SYSTEM.md`
**Terakhir diperbarui:** 23 November 2026

---

## 1. Ringkasan

Battleship klasik satu pemain melawan komputer, bertema **Radar taktis**. Dokumen ini mendefinisikan aturan main, perilaku AI, desain kapal, dan spesifikasi animasi. Dokumen ini adalah sumber kebenaran untuk logika game (engine) dan perilaku visualnya.

## 2. Aturan permainan

| Aspek | Keputusan |
|---|---|
| Ukuran papan | 10x10, kolom A-J, baris 1-10 |
| Armada | Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2) |
| Orientasi kapal | Horizontal atau vertikal |
| Kapal bersentuhan | **Boleh** (hanya tidak boleh tumpang tindih) |
| Tembakan per giliran | **Satu**, tanpa tembakan tambahan setelah kena |
| Giliran pertama | **Acak** (lempar koin dengan animasi singkat) |
| Sel yang sudah ditembak | Tidak dapat ditembak lagi |
| Kapal tenggelam | Diumumkan dengan nama kapal dan siluetnya terungkap di papan lawan |
| Kondisi menang | Seluruh kapal lawan tenggelam |
| Radar "ping" | Murni visual, tidak memengaruhi aturan |

### Nama kapal (i18n)

| Kunci | Indonesia | Inggris | Panjang |
|---|---|---|---|
| `carrier` | Kapal Induk | Carrier | 5 |
| `battleship` | Kapal Perang | Battleship | 4 |
| `cruiser` | Penjelajah | Cruiser | 3 |
| `submarine` | Kapal Selam | Submarine | 3 |
| `destroyer` | Perusak | Destroyer | 2 |

## 3. Alur game (state machine)

```
MENU -> PLACEMENT -> COIN_TOSS -> PLAYER_TURN <-> AI_TURN -> GAME_OVER -> (MENU | PLACEMENT)
```

Di dalam satu giliran:

```
AIMING -> LOCKING -> FIRING -> IMPACT -> RESOLVING -> (SINKING?) -> (GAME_OVER? | giliran berikutnya)
```

- Input pemain diabaikan selama `LOCKING` sampai `RESOLVING`, dan selama `AI_TURN`.
- Giliran berikutnya baru dimulai setelah animasi dampak (dan animasi tenggelam, jika ada) selesai.
- State ditentukan oleh engine (TypeScript murni). UI hanya membaca state dan memicu animasi.

## 4. Penempatan kapal

- Pemain memilih kapal dari daftar, lalu mengklik sel untuk meletakkannya.
- Rotasi: tombol `R`, klik kanan, atau tombol Rotasi.
- Pratinjau saat kursor di atas papan: **hijau transparan** jika valid, **merah transparan** jika tidak valid (keluar papan atau tumpang tindih).
- Tombol: **Acak** (menempatkan seluruh armada valid), **Reset** (mengosongkan papan), **Mulai** (tetap dapat diklik; jika armada belum lengkap, log menampilkan "Tempatkan semua kapal dulu" dan kapal yang belum terpasang berkedip, sesuai aturan "tanpa tombol mati" di `UX_FLOW.md`).
- Kapal yang sudah dipasang dapat diklik untuk diangkat dan dipindah.
- Penempatan acak: untuk tiap kapal, pilih orientasi dan posisi acak, ulangi sampai valid. Jika buntu, ulang dari awal. Batas percobaan dijaga agar tidak ada loop tak berujung.
- Armada AI ditempatkan dengan algoritma acak yang sama dan disembunyikan dari pemain.

## 5. Pertempuran

### Papan
Layar pertempuran memakai konsep CIC (lihat `UX_FLOW.md`): satu layar utama berukuran besar dengan saklar dua tampilan.
- **Radar musuh** (default): menampilkan hasil tembakan pemain. Kapal lawan hanya muncul saat tenggelam, atau saat game berakhir.
- **Dek Anda**: menampilkan kapal pemain dan tembakan AI. Pada giliran komputer, tampilan beralih ke sini secara otomatis (dapat dimatikan di Pengaturan).

### Hasil tembakan
- **Meleset:** titik hijau menetap.
- **Kena:** tanda X merah dengan glow tipis menetap.
- **Tenggelam:** seluruh sel kapal bertanda X dan siluet kapal merah redup terungkap, plus banner nama kapal.

### Panel informasi
- Indikator giliran (pemain atau komputer).
- Log tembakan (misalnya "Anda menembak B7: kena Penjelajah").
- Daftar kapal lawan yang masih hidup (ikon siluet, kapal tenggelam dicoret).

### Layar hasil
Menang atau kalah, jumlah tembakan, jumlah kena, akurasi (kena / tembakan), dan kapal tersisa. Tombol: **Main lagi** dan **Kembali ke menu**. Kapal lawan yang tersisa diungkap di papan.

## 6. AI (MVP)

AI memakai strategi **hunt/target** dan **tidak boleh melihat** posisi kapal pemain. AI hanya membaca riwayat tembakannya sendiri.

### Mode hunt
- Menembak sel acak dengan **pola papan catur** (sel dengan (baris + kolom) genap), karena kapal terkecil berukuran 2, jadi pola ini sudah cukup menemukan semua kapal.
- Jika sel pola habis, lanjut ke sel lain yang belum ditembak.
- Sel yang mustahil memuat kapal tersisa dilewati (misalnya celah yang lebih kecil dari kapal terkecil yang masih hidup).

### Mode target
- Setelah **kena**, antrean target berisi empat sel tetangga (atas, bawah, kiri, kanan) yang belum ditembak.
- Setelah **dua kena sejajar**, AI mengunci orientasi dan hanya melanjutkan sepanjang garis itu (ke dua ujung).
- Jika satu ujung meleset, AI membalik ke ujung lainnya.

### Setelah kapal tenggelam
- Sel kapal yang tenggelam dikeluarkan dari daftar "kena yang belum selesai".
- Jika masih ada sel kena yang belum terselesaikan (kapal bersentuhan), AI tetap di mode target di sekitar sel tersebut. Jika tidak, kembali ke hunt.

### Perilaku visual
- Jeda acak **600-1200 ms** sebelum menembak, dengan animasi memindai di papan pemain.
- AI dirancang sebagai **strategy** yang dapat diganti (antarmuka `ShotStrategy`), sehingga level kesulitan lain dapat ditambahkan tanpa mengubah engine.

## 7. Desain kapal

Siluet tampak atas, detail dan ilustratif, dirender sebagai komponen SVG.

| Kapal | Ciri visual |
|---|---|
| Kapal Induk (5) | Landasan bergaris putus-putus, dua lift pesawat, menara kontrol, tiga pesawat di buritan |
| Kapal Perang (4) | Tiga menara meriam berlaras ganda, anjungan besar, satu cerobong |
| Penjelajah (3) | Dua menara meriam, anjungan, satu cerobong |
| Kapal Selam (3) | Badan kapsul, menara, sirip selam, baling-baling, garis tengah |
| Perusak (2) | Tabung torpedo, anjungan, cerobong, satu meriam |

### Dua kondisi
- **Utuh:** garis hijau dengan isi transparan (papan sendiri).
- **Tenggelam:** isi merah penuh dengan detail gelap (papan lawan), lalu meredup menjadi bayangan.

### Aturan komponen
- Panjang kapal = jumlah sel x ukuran sel, tinggi = satu sel.
- Orientasi vertikal = rotasi 90 derajat dari komponen yang sama.
- Warna dikendalikan lewat variabel CSS dari Design System (bukan hardcode).

## 8. Animasi

Semua durasi menjadi token di Design System dan dapat disetel di satu tempat.

| Animasi | Urutan | Durasi awal |
|---|---|---|
| Penguncian target | Reticle (lingkaran dan crosshair) mengecil di sel target | 450 ms |
| Rudal | Meluncur dari peluncur ke sel target dengan jejak dan api, percepatan | 650 ms |
| Dampak kena | Kilatan, cincin kejut, percikan api, kapal bergetar, lalu X menetap | 700 ms |
| Dampak meleset | Tiga cincin riak air, lalu titik hijau menetap | 800 ms |
| Kapal tenggelam | Berubah merah dan berdenyut, miring (sekitar 8 derajat) dan mengecil, gelembung naik, lalu bayangan redup dan X pada tiap sel | 2300 ms |
| Banner tenggelam | Nama kapal muncul di tengah papan, lalu memudar | 1900 ms |
| Lempar koin | Animasi singkat penentu giliran pertama | sekitar 1200 ms |
| Radar sapuan | Garis sapuan pelan di latar papan (dekoratif) | loop |

Catatan: durasi di atas adalah titik awal dan akan disetel saat uji rasa (game feel).

### Reduced motion
Jika pengguna mengaktifkan `prefers-reduced-motion`: getaran, riak, sapuan radar, dan perputaran dinonaktifkan. Dampak diganti transisi warna singkat, dan informasi tetap sampai lewat log dan banner.

## 9. Visual (nilai awal, akan diformalkan di Design System)

| Peran | Nilai awal |
|---|---|
| Latar | `#0b1f1a` |
| Garis grid | `#1f5c46` |
| Aksen utama (kapal, meleset, label) | `#4fd1a5`, label `#6fcfa8` |
| Kena, tenggelam, bahaya | `#ff6b57` |
| Api rudal | `#ffb347` |
| Kilatan | `#ffd27a` |

Tipografi label papan: monospace. Status tidak pernah dibedakan **hanya** oleh warna (bentuk: titik, X, kotak penuh).

## 10. Kasus tepi

| Situasi | Perilaku |
|---|---|
| Klik sel yang sudah ditembak | Diabaikan, dengan umpan balik halus (misalnya getar kecil pada sel) |
| Klik papan saat giliran AI atau saat animasi | Diabaikan |
| Letakkan kapal di luar papan atau menumpuk | Pratinjau merah, klik tidak menempatkan |
| Tombol Mulai sebelum semua kapal terpasang | Tetap aktif, tetapi game tidak dimulai; log menampilkan "Tempatkan semua kapal dulu" |
| Muat ulang halaman saat game berjalan | MVP: game dimulai ulang dari menu. Hanya preferensi bahasa yang disimpan. Melanjutkan game masuk backlog. |
| Tembakan terakhir menenggelamkan kapal terakhir | Animasi tenggelam selesai dulu, lalu layar hasil |
| Bahasa diganti di tengah game | Seluruh teks (termasuk log dan nama kapal) berganti seketika |

## 11. Di luar MVP (backlog)

- Mode online (engine dapat dijalankan ulang di server)
- Pemain 2 lokal
- Level kesulitan AI (mudah/sulit)
- Tembakan tambahan setelah kena (varian aturan)
- Efek suara dan musik
- Statistik dan riwayat permainan
- Melanjutkan game setelah muat ulang
- Tema visual tambahan

## 12. Pertanyaan terbuka

1. ~~"Cara Bermain"~~ Diputuskan: modal singkat.
2. Apakah pemain boleh memilih sendiri siapa mulai duluan di pengaturan (backlog)?

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 Nov 2026 | Draf awal: aturan, AI hunt/target, desain kapal, spesifikasi animasi |
| 0.2 | 23 Nov 2026 | Bagian papan disesuaikan dengan konsep CIC (satu layar utama dengan saklar) |
| 0.3 | 26 Nov 2026 | Tombol Mulai disesuaikan dengan aturan "tanpa tombol mati"; tautan dokumen terkait |
| 0.4 | 26 Nov 2026 | Cara bermain diputuskan berupa modal; lempar koin dapat dilewati (lihat `UX_FLOW.md`) |
