# UX Flow dan Wireframe: Battleship Web Game

**Status:** Draft v0.2 (konsep CIC disetujui; pertanyaan terbuka ditutup)
**Dokumen terkait:** `PRD.md`, `GAME_DESIGN.md`
**Terakhir diperbarui:** 23 November 2026

---

## 1. Prinsip UX

1. **Pemain adalah komandan di CIC** (Combat Information Center). Antarmuka terasa seperti konsol, bukan halaman web biasa.
2. **Satu layar utama, satu fokus.** Papan besar di tengah menjadi pusat perhatian, panel samping hanya pendukung.
3. **Selalu jelas siapa yang sedang bergiliran** dan apa yang bisa dilakukan sekarang.
4. **Tidak ada aksi yang membingungkan.** Setiap aksi penting punya umpan balik (animasi, log, atau pesan).
5. **Status tidak hanya lewat warna.** Selalu ada bentuk atau teks pendamping.
6. **Desktop-first**, dengan layout yang tetap terpakai di layar lebih sempit.

## 2. Peta layar dan navigasi

```
                 +-----------------+
                 |      MENU       |<--------------------------+
                 +--+----+------+--+                           |
        Mulai game   |    |      | Pengaturan (modal)          |
                     |    |      +--> Bahasa, Beralih otomatis |
      Cara bermain --+    |           ke Dek, Kurangi gerakan   |
        (modal)           v                                     |
                 +-----------------+                            |
                 |   PENEMPATAN    |                            |
                 +--------+--------+                            |
                          | Mulai                               |
                          v                                     |
                 +-----------------+                            |
                 |   LEMPAR KOIN   |  (overlay singkat)         |
                 +--------+--------+                            |
                          v                                     |
                 +-----------------+                            |
                 |  PERTEMPURAN    |  Radar musuh <-> Dek Anda  |
                 |      (CIC)      |                            |
                 +--------+--------+                            |
                          | Semua kapal satu pihak tenggelam    |
                          v                                     |
                 +-----------------+   Kembali ke menu          |
                 |      HASIL      |----------------------------+
                 +--------+--------+
                          | Main lagi
                          v
                      PENEMPATAN
```

Navigasi keluar di tengah game (tombol **Menu** di pojok) menampilkan konfirmasi: "Keluar dari game? Progres tidak disimpan."

## 3. Layar demi layar

### 3.1 Menu

**Tujuan:** memulai game dengan cepat dan mengatur preferensi.

```
+----------------------------------------------------------------+
|                          BATTLESHIP                            |
|                (latar: papan radar menyapu pelan)              |
|                                                                |
|                         [ Mulai game ]                         |
|                         [ Cara bermain ]                       |
|                         [ Pengaturan ]                         |
|                                                                |
|                                             Bahasa: [ID | EN] |
+----------------------------------------------------------------+
```

- Satu tombol utama: **Mulai game**.
- Bahasa dapat diganti langsung dari menu (pojok kanan bawah), dan dari Pengaturan.
- **Cara bermain** membuka modal berisi aturan ringkas, ilustrasi kapal, dan arti penanda (titik, X, kotak penuh).
- **Pengaturan** (modal): Bahasa, "Beralih otomatis ke Dek saat giliran komputer" (default aktif), dan "Kurangi gerakan" (default mengikuti sistem).

### 3.2 Penempatan armada

**Tujuan:** pemain menempatkan lima kapal dengan yakin dan cepat.

```
+----------------------------------------------------------------+
| PENEMPATAN ARMADA                                              |
+------------------+---------------------------+-----------------+
| ARMADA           |   A B C D E F G H I J     | PETUNJUK        |
| [Kapal Induk  5] |  1 . . . . . . . . . .   | Pilih kapal,    |
| [Kapal Perang 4] |  2 . . . . . . . . . .   | klik sel untuk  |
| [Penjelajah   3] |  3 . . papan 10x10 . .    | menaruh.        |
| [Kapal Selam  3] |  ...                      | R atau klik     |
| [Perusak      2] |  pratinjau hijau/merah    | kanan: rotasi.  |
|                  |                           |                 |
| Terpasang: 0/5   |                           |                 |
+------------------+---------------------------+-----------------+
|        [Rotasi]   [Acak]   [Reset]               [ Mulai ]     |
+----------------------------------------------------------------+
```

- Kapal terpilih disorot di daftar. Pratinjau mengikuti kursor: **hijau** jika valid, **merah** jika tidak valid (keluar papan atau menumpuk).
- Kapal yang sudah terpasang dapat diklik untuk diangkat dan dipindah.
- **Mulai** tetap dapat diklik, tetapi jika armada belum lengkap, log petunjuk menampilkan "Tempatkan semua kapal dulu" dan kapal yang belum terpasang berkedip singkat. (Kita menghindari tombol mati.)
- **Acak** mengganti seluruh penempatan. **Reset** mengosongkan papan.

### 3.3 Lempar koin

Overlay singkat (sekitar 1,2 detik) di atas layar penempatan atau pertempuran: koin berputar, lalu teks "Anda mulai duluan" atau "Komputer mulai duluan". Otomatis tertutup, dan dapat dilewati dengan klik atau `Enter`/`Spasi`.

### 3.4 Pertempuran (CIC)

**Tujuan:** pengalaman inti. Pemain mengoperasikan konsol: mengunci target, menembak, dan memantau kondisi armada.

```
+--------------------------------------------------------------------+
| CIC / PERTEMPURAN      [> GILIRAN ANDA]      TEMBAKAN 10  AKURASI 30% |
+---------------+------------------------------+---------------------+
| LAWAN TERSISA |   RADAR / PERAIRAN LAWAN     | LOG KOMUNIKASI      |
| Kapal Induk   |    A B C D E F G H I J       | Anda > B2 meleset   |
| [][][][][]    |  1 . . . . . . . . . .       | Musuh > A5 meleset  |
| Kapal Perang  |  2 . . . . . # # . . .       | Anda > F3 kena      |
| [][X][][]     |  3 . . . . . . . . . .       | ...                 |
| Penjelajah    |  4 . . . ( + ) . . . .       |---------------------|
| [][][]        |  5 . . . . . X . . . .       | KONTROL TEMBAK      |
| Kapal Selam   |  ...                         | TARGET: D5          |
| [][][]        |                              | [   TEMBAK   ]      |
| Perusak       |                              | Enter atau klik ulang|
| [X][X]        |                              |                     |
+---------------+---------[ RADAR MUSUH | DEK ANDA ]----------------+
```

Elemen:
- **Bilah atas:** nama layar, indikator giliran, statistik (tembakan, akurasi), dan tombol Menu.
- **Panel kiri:** kondisi armada. Berisi daftar kapal dengan satu lampu per sel. Isinya mengikuti tampilan aktif: "Lawan tersisa" di Radar, "Kondisi kapal Anda" di Dek. Sel kena berwarna merah dan berbentuk X (tidak hanya warna).
- **Layar utama:** papan 10x10 dengan bingkai konsol. Radar menyapu pelan sebagai latar.
- **Panel kanan:** log komunikasi (lima baris terakhir, dapat digulir) dan kontrol tembak.
- **Saklar tampilan** di bawah layar utama.

### 3.5 Hasil

```
+----------------------------------------------------------------+
|                 KEMENANGAN   /   KEKALAHAN                     |
|  Tembakan 38    Kena 17    Akurasi 45%    Kapal tersisa 2      |
|                                                                |
|        [ papan lawan terungkap, kapal tersisa ditampilkan ]    |
|                                                                |
|             [ Main lagi ]        [ Kembali ke menu ]           |
+----------------------------------------------------------------+
```

- Layar hasil muncul setelah semua animasi tenggelam selesai.
- **Main lagi** langsung menuju Penempatan.

## 4. Saklar tampilan (Radar musuh / Dek Anda)

| Aspek | Spesifikasi |
|---|---|
| Posisi | Di bawah layar utama, di tengah |
| Pilihan | **Radar musuh** (default) dan **Dek Anda** |
| Transisi | Garis pindai menyapu layar, sekitar **350 ms**; isi papan dan panel kiri berganti di tengah transisi |
| Panel kiri | Berganti sesuai tampilan |
| Kontrol tembak | Di Dek, kontrol tembak meredup dan klik pada papan tidak menembak |
| Aksesibilitas | Kontrol dua pilihan dengan label teks, dioperasikan dengan keyboard (Tab, panah kiri/kanan, Spasi) |
| Pintasan | `Tab` pada layar pertempuran mengganti tampilan (lihat bagian 8) |

### Lampu peringatan
Saat kapal pemain terkena serangan sementara tampilan berada di Radar musuh (misalnya jika fitur auto-switch dimatikan), lampu **amber** berkedip di samping "Dek Anda" dan satu baris peringatan masuk ke log. Lampu padam saat pemain membuka Dek. Pada mode kurangi gerakan, lampu menyala tetap, tanpa kedip.

> Catatan: wireframe interaktif menampilkan lampu ini berwarna merah. Spesifikasi final memakai amber. Merah dicadangkan untuk kerusakan (kena, tenggelam, posisi tidak valid).

## 5. Kontrol tembak (dua langkah)

| Langkah | Aksi pemain | Respons |
|---|---|---|
| 1. Kunci target | Klik sel di Radar | Reticle muncul di sel, koordinat besar tampil di panel ("D5"), log: "Target terkunci: D5" |
| Ganti target | Klik sel lain | Reticle pindah |
| 2. Tembak | Klik **Tembak**, tekan `Enter`, atau klik sel yang sama sekali lagi | Animasi tembakan dimulai (penguncian, rudal, dampak) |
| Batal | `Esc` | Reticle hilang |

Aturan:
- Klik **Tembak** tanpa target terkunci: tombol tetap aktif, log menampilkan "Pilih target dulu" dan papan berkedip singkat. Tidak ada tombol mati.
- Sel yang sudah ditembak tidak dapat dikunci. Sel bergetar halus dan log menampilkan "D5 sudah ditembak".
- Setelah menembak, kontrol dikunci sampai animasi dampak selesai dan giliran berpindah.
- Animasi penguncian target pada Game Design mengikuti langkah 2 (bukan langkah 1). Pada langkah 1, reticle statis.

## 6. Alur giliran dan perpindahan tampilan otomatis

Pengaturan **"Beralih otomatis ke Dek saat giliran komputer"** aktif secara default.

| Tahap | Aksi | Perkiraan waktu |
|---|---|---|
| 1 | Tembakan pemain selesai (dampak, tenggelam, banner jika ada) | sesuai animasi |
| 2 | Jeda singkat, indikator giliran berubah menjadi "GILIRAN KOMPUTER" | 400 ms |
| 3 | Saklar berpindah ke **Dek Anda** dengan transisi pindai | 350 ms |
| 4 | AI "memindai" papan pemain (animasi menunggu) | 600-1200 ms |
| 5 | Penguncian, rudal, dan dampak pada papan pemain | sesuai animasi |
| 6 | Jeda singkat setelah dampak | 500 ms |
| 7 | Saklar kembali ke **Radar musuh**, indikator "GILIRAN ANDA" | 350 ms |

Pengecualian:
- Jika kapal pemain tenggelam, animasi tenggelam dan banner selesai dulu sebelum kembali.
- Jika tembakan AI mengakhiri game, tampilan tetap di Dek lalu layar hasil muncul.
- Jika pemain memindahkan saklar sendiri saat giliran AI, sistem tidak memaksa kembali sampai tahap 7. Pemain tetap dapat mengamati dengan bebas.
- Jika pengaturan dimatikan, tampilan tetap di Radar dan hanya lampu amber serta log yang memberi tahu.

## 7. Log komunikasi (microcopy)

Bahasa operator, singkat, kalimat dasar tanpa tanda seru berlebihan. Seluruh teks lewat kunci i18n.

| Peristiwa | Indonesia | Inggris |
|---|---|---|
| Target terkunci | Target terkunci: D5 | Target locked: D5 |
| Tembakan pemain meleset | Anda > D5 meleset | You > D5 missed |
| Tembakan pemain kena | Anda > D5 kena | You > D5 hit |
| Kapal lawan tenggelam | Anda > Perusak tenggelam | You > Destroyer sunk |
| Tembakan lawan meleset | Musuh > C4 meleset | Enemy > C4 missed |
| Tembakan lawan kena | Musuh > C4 kena | Enemy > C4 hit |
| Kapal Anda tenggelam | Musuh > Penjelajah Anda tenggelam | Enemy > Your Cruiser sunk |
| Belum ada target | Pilih target dulu | Select a target first |
| Sel sudah ditembak | D5 sudah ditembak | D5 already fired on |

Warna baris: baris tembakan pemain berwarna teks utama, baris tembakan lawan berwarna merah jika kena, peringatan berwarna amber.

## 8. Pintasan keyboard

| Tombol | Layar | Fungsi |
|---|---|---|
| `Tab` | Pertempuran | Ganti Radar musuh / Dek Anda |
| `V` | Pertempuran | Ganti Radar musuh / Dek Anda (cadangan, selalu aktif) |
| Panah | Pertempuran (Radar) | Pindahkan reticle antar sel |
| `Enter` | Pertempuran | Tembak target terkunci |
| `Esc` | Pertempuran, modal | Batalkan target, tutup modal |
| `R` | Penempatan | Rotasi kapal |
| `Spasi` | Modal, saklar | Pilih / aktifkan |

Catatan aksesibilitas: `Tab` pada layar pertempuran dipakai ulang untuk saklar, sehingga navigasi fokus standar tetap tersedia lewat `Shift+Tab` dan tombol panah. Kita akan memverifikasi ini saat pengujian aksesibilitas dan menyiapkan alternatif tombol bila perlu.

## 9. Responsif

| Lebar layar | Perilaku |
|---|---|
| Desktop (>= 1100 px) | Tiga kolom seperti wireframe |
| Menengah (800-1099 px) | Layar utama mengecil; panel kiri dan kanan tetap tampil, lebih ringkas |
| Sempit (< 800 px) | Layar utama penuh lebar; panel kiri dan kanan menjadi laci yang dibuka lewat tombol; saklar tetap di bawah |

## 10. Aksesibilitas

- Setiap sel papan memiliki label (misalnya "D5, belum ditembak", "D5, kena").
- Semua aksi dapat dilakukan lewat keyboard.
- Perubahan penting (giliran berganti, kapal tenggelam, game berakhir) diumumkan lewat wilayah `aria-live` pada log.
- Kontras teks memenuhi WCAG AA.
- Animasi menghormati `prefers-reduced-motion` (lihat `GAME_DESIGN.md`).

## 11. Penggunaan warna

| Warna | Peran | Contoh |
|---|---|---|
| Hijau | Normal, aman, aksi utama | Kapal utuh, meleset, label, saklar aktif |
| Merah | Kerusakan dan bahaya | Kena, tenggelam, posisi tidak valid |
| Amber | Peringatan saja | Lampu saklar saat diserang, pesan "Pilih target dulu" |

## 12. Pertanyaan terbuka

1. `Tab` dipakai sebagai pintasan saklar dengan `V` sebagai cadangan. Kedua tombol dipasang lewat satu konstanta (`SHORTCUTS`); uji aksesibilitas pada milestone M8 menentukan apakah `Tab` dipertahankan.
2. ~~Lempar koin dapat dilewati~~ Diputuskan: ya.
3. ~~Cara bermain~~ Diputuskan: modal singkat.

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 Nov 2026 | Draf awal: peta layar, wireframe, saklar CIC, kontrol tembak dua langkah, alur giliran AI |
| 0.2 | 26 Nov 2026 | Pertanyaan terbuka ditutup: lempar koin dapat dilewati, Cara bermain berupa modal, pintasan V sebagai cadangan Tab |
