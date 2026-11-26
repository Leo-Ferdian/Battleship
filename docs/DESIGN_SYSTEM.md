# Design System: Battleship Web Game (Radar taktis)

**Status:** Draft v0.2 (arah implementasi disetujui: CSS Modules; token dan komponen menunggu review pemilik)
**Dokumen terkait:** `PRD.md`, `GAME_DESIGN.md`, `UX_FLOW.md`
**Terakhir diperbarui:** 23 November 2026

---

## 1. Prinsip

1. **Satu tema, dikerjakan dengan matang.** Hanya tema gelap Radar taktis. Tidak ada mode terang di MVP.
2. **Token dulu, baru komponen.** Tidak ada warna, ukuran, atau durasi yang ditulis langsung di komponen. Semuanya membaca token.
3. **Status tidak pernah hanya warna.** Setiap status punya bentuk atau teks pendamping (titik, X, kotak penuh, label).
4. **Merah itu mahal.** Merah dicadangkan untuk kerusakan. Amber hanya untuk peringatan. Hijau untuk segala yang normal dan aman.
5. **Rata dan tegas.** Tanpa gradien, bayangan, atau efek blur. Kedalaman dibangun dari tiga lapis latar dan garis.

## 2. Token warna

Semua teks dan angka kontras dihitung terhadap tiga latar (WCAG 2.x).

### Latar dan garis

| Token | Nilai | Peran | Kontras vs base / panel / raised |
|---|---|---|---|
| `--color-bg-base` | `#0b1f1a` | Latar halaman dan layar utama | - |
| `--color-bg-panel` | `#0f2a23` | Panel konsol, modal | - |
| `--color-bg-raised` | `#14352c` | Hover, elemen terangkat | - |
| `--color-line` | `#1f5c46` | Garis grid dan pemisah dekoratif | 2,19 / 1,95 / 1,70 |
| `--color-line-strong` | `#2f9a76` | Batas kontrol dan state hover | 4,90 / 4,36 / 3,81 |

Catatan: `--color-line` **hanya untuk dekorasi** (grid, pemisah). Batas kontrol, hover, dan fokus memakai `--color-line-strong` atau lebih terang agar memenuhi 3:1 untuk komponen UI.

### Teks dan aksen

| Token | Nilai | Peran | Kontras vs base / panel / raised |
|---|---|---|---|
| `--color-text-primary` | `#d9f5ea` | Teks utama, fokus | 14,85 / 13,23 / 11,55 |
| `--color-text-secondary` | `#6fcfa8` | Label, teks pendukung | 9,11 / 8,12 / 7,09 |
| `--color-text-muted` | `#5fb394` | Keterangan kecil | 6,83 / 6,08 / 5,31 |
| `--color-accent` | `#4fd1a5` | Aksi utama, kapal utuh, meleset | 8,98 / 7,99 / 6,98 |
| `--color-danger` | `#ff6b57` | Kena, tenggelam, posisi tidak valid | 6,12 / 5,45 / 4,76 |
| `--color-warning` | `#ffb347` | Peringatan, api rudal | 9,62 / 8,57 / 7,48 |
| `--color-flash` | `#ffd27a` | Kilatan ledakan (efek saja) | 12,04 / 10,72 / 9,36 |

Semua teks di atas lolos AA (4,5:1) di ketiga latar.

### Turunan

| Token | Nilai | Peran |
|---|---|---|
| `--color-on-accent` | `#0b1f1a` | Teks di atas tombol aksen (8,98:1) |
| `--color-on-danger` | `#0b1f1a` | Teks/ikon di atas isi merah (6,12:1) |
| `--color-focus` | `#d9f5ea` | Cincin fokus keyboard (2 px, offset 2 px) |
| `--color-accent-wash` | `rgba(79, 209, 165, 0.2)` | Isi kapal utuh, knob saklar |
| `--color-danger-wash` | `rgba(255, 107, 87, 0.2)` | Glow sel kena, pratinjau tidak valid |
| `--color-valid-wash` | `rgba(79, 209, 165, 0.2)` | Pratinjau penempatan valid |

## 3. Tipografi

| Token | Nilai |
|---|---|
| `--font-mono` | `'IBM Plex Mono', ui-monospace, monospace` |
| `--font-sans` | `'IBM Plex Sans', system-ui, sans-serif` |

Mono untuk semua yang terasa "konsol": label, koordinat, log, tombol. Sans untuk teks yang dibaca panjang (Cara bermain, deskripsi pengaturan). Bobot hanya 400 dan 500.

| Peran | Font | Ukuran / bobot | Catatan |
|---|---|---|---|
| Judul | Mono | 28 px / 500, spasi huruf 0,12 em | Huruf kapital |
| Readout | Mono | 28 px / 500 | Koordinat target ("D5") |
| Label | Mono | 11 px / 500, spasi huruf 0,1 em | Huruf kapital, judul panel |
| Tombol | Mono | 13 px / 500, spasi huruf 0,06 em | Huruf kapital |
| Log | Mono | 12 px / 400 | Baris komunikasi |
| Isi | Sans | 14 px / 400, tinggi baris 1,6 | Modal, pengaturan |

Ukuran minimum teks adalah 11 px. Informasi penting (status giliran, hasil tembakan) tidak boleh hanya berupa teks 11 px.

## 4. Spasi, bentuk, garis

| Token | Nilai |
|---|---|
| `--space-1` sampai `--space-6` | 4, 8, 12, 16, 24, 32 px |
| `--radius-sm` | 2 px (kapal, kotak lampu, sel tenggelam) |
| `--radius-md` | 4 px (tombol, banner, panel) |
| `--radius-lg` | 8 px (bingkai konsol, modal) |
| `--radius-pill` | 999 px (saklar tampilan) |
| `--border-thin` | 1 px (panel, grid) |
| `--border-control` | 1,5 px (tombol, saklar) |
| `--cell-size` | 28 px (papan kecil), 40 px (papan layar utama) |

## 5. Token gerak

Nilai awal dari `GAME_DESIGN.md`, disetel saat uji rasa.

| Token | Nilai | Dipakai untuk |
|---|---|---|
| `--dur-view-switch` | 350 ms | Transisi saklar Radar / Dek |
| `--dur-lock` | 450 ms | Reticle mengunci target |
| `--dur-missile` | 650 ms | Rudal meluncur |
| `--dur-hit` | 700 ms | Dampak kena |
| `--dur-miss` | 800 ms | Dampak meleset |
| `--dur-sink` | 2300 ms | Kapal tenggelam |
| `--dur-banner` | 1900 ms | Banner nama kapal tenggelam |
| `--dur-coin` | 1200 ms | Lempar koin |
| `--dur-ai-min` / `--dur-ai-max` | 600 / 1200 ms | Jeda AI "memindai" |
| `--ease-out` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | Muncul, memudar |
| `--ease-in` | `cubic-bezier(0.4, 0, 1, 1)` | Rudal (mempercepat) |
| `--ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Transisi saklar |

Dengan `prefers-reduced-motion` atau pengaturan "Kurangi gerakan": getaran, riak, sapuan radar, dan perputaran dimatikan. Dampak diganti perubahan warna singkat (kurang dari 150 ms). Informasi tetap tersampaikan lewat log dan banner.

## 6. Komponen

### 6.1 Tombol

| Varian | Tampilan | Dipakai untuk |
|---|---|---|
| Primer | Isi `accent`, teks `on-accent` | Satu aksi utama per layar (Mulai game, Main lagi) |
| Sekunder | Garis `accent`, teks `accent` | Aksi pendukung (Cara bermain, Acak, Rotasi) |
| Bahaya | Garis `danger`, teks `danger` | Tembak |
| Ghost | Tanpa garis, teks `text-secondary` | Aksi tersier (Reset, Menu) |

State: default, hover (latar `bg-raised`), ditekan (skala 0,98), fokus (cincin `--color-focus`). Kita **menghindari tombol mati**: tombol tetap aktif dan merespons dengan pesan di log. Aturan: satu tombol primer per layar.

### 6.2 Saklar tampilan (Radar musuh / Dek Anda)

- Kapsul 220 x 34 px, garis `accent` 1,5 px, dua label mono 11 px.
- Knob (`accent-wash` dengan garis `accent`) bergeser selama `--dur-view-switch`.
- Teks pilihan aktif `accent`, tidak aktif `text-secondary`.
- Lampu peringatan: titik 8 px `warning` di label "Dek Anda", berkedip pelan. Pada mode kurangi gerakan, menyala tetap.
- Semantik: kontrol dua pilihan (radio group) dengan label teks, dioperasikan keyboard.

### 6.3 Sel papan

| State | Tampilan | Label aksesibilitas (contoh) |
|---|---|---|
| Kosong | Garis `line` | "D5, belum ditembak" |
| Hover | Isi `bg-raised`, garis `line-strong` | sama |
| Terkunci | Reticle: lingkaran dan crosshair `accent` | "D5, terkunci sebagai target" |
| Meleset | Titik `accent` | "D5, meleset" |
| Kena | X `danger` 2,5 px dengan glow `danger-wash` | "D5, kena" |
| Tenggelam | Isi `danger` penuh, X `on-danger` | "D5, bagian dari Penjelajah yang tenggelam" |
| Fokus keyboard | Cincin `--color-focus` | sama |

Sel yang sudah ditembak tidak dapat dikunci: getar kecil dan pesan di log ("D5 sudah ditembak").

### 6.4 Kapal

- Siluet SVG per kapal (lihat `GAME_DESIGN.md`, bagian 7). Warna datang dari token, tidak ditulis di SVG.
- **Utuh:** garis `accent` 1,5 px, isi `accent-wash`, detail garis `accent`.
- **Tenggelam:** isi `danger`, detail `bg-base`, lalu meredup menjadi bayangan (opacity 0,3) dengan X pada setiap sel.
- **Pratinjau penempatan:** valid memakai `valid-wash` dengan garis `accent`; tidak valid memakai `danger-wash` dengan garis `danger`.
- Orientasi vertikal adalah rotasi 90 derajat dari komponen yang sama.

### 6.5 Lampu kondisi kapal

- Satu kotak 16 px per sel kapal, jarak 6 px, radius `radius-sm`.
- Utuh: garis `accent`, tanpa isi. Kena: isi `danger` dengan X `on-danger`.
- Dipakai di panel kiri ("Lawan tersisa" dan "Kondisi kapal Anda").

### 6.6 Panel konsol

- Latar `bg-panel`, garis `line` 1 px, radius `radius-md`.
- Judul panel: label mono 11 px huruf kapital `text-secondary`.
- Layar utama: latar `bg-panel`, garis `accent` 1,5 px, radius `radius-md`, baut kecil di sudut (dekoratif), sapuan radar sebagai latar.

### 6.7 Baris log komunikasi

| Tipe | Warna | Contoh |
|---|---|---|
| Tembakan pemain | `text-secondary` | Anda > D5 meleset |
| Tembakan lawan kena | `danger` | Musuh > C4 kena |
| Peringatan | `warning` | Pilih target dulu |
| Informasi | `text-primary` | Target terkunci: D5 |

Wilayah log memakai `aria-live="polite"`. Kejadian penting (kapal tenggelam, game berakhir) memakai `assertive`.

### 6.8 Banner

Kotak `bg-base` (90 persen), garis `danger` 1 px, teks mono 13 px `danger`, huruf kapital, di tengah layar utama. Muncul lalu memudar selama `--dur-banner`.

### 6.9 Modal

Latar `bg-panel`, garis `line-strong`, radius `radius-lg`, dengan lapisan penutup gelap di belakangnya. Judul mono, isi sans 14 px. Fokus terperangkap di dalam modal dan `Esc` menutupnya. Dipakai untuk Cara bermain dan Pengaturan.

### 6.10 Indikator giliran

Kotak 8 px berwarna `accent` dan teks "GILIRAN ANDA" (mono 11 px). Pada giliran komputer: teks "GILIRAN KOMPUTER" dengan kotak `warning`. Teks selalu ada, tidak hanya warna.

### 6.11 Pesan ringan (toast)

Dipakai jarang (misalnya "Armada diacak"). Kotak `bg-panel` dengan garis `line-strong`, mono 12 px, hilang otomatis setelah 2 detik. Pesan peringatan memakai garis dan teks `warning`.

## 7. Aturan penggunaan warna

| Warna | Boleh dipakai untuk | Jangan dipakai untuk |
|---|---|---|
| Hijau (`accent`) | Aksi utama, kapal utuh, meleset, label aktif | Menandai bahaya |
| Merah (`danger`) | Kena, tenggelam, posisi tidak valid, tombol Tembak | Peringatan ringan atau dekorasi |
| Amber (`warning`) | Peringatan, giliran komputer, api rudal | Kerusakan |

## 8. Aksesibilitas (checklist)

- [ ] Semua pasangan teks dan latar minimal 4,5:1 (sudah dihitung di bagian 2).
- [ ] Batas kontrol dan fokus minimal 3:1 (`line-strong` atau lebih terang).
- [ ] Setiap status memiliki bentuk atau teks selain warna.
- [ ] Cincin fokus terlihat di semua elemen interaktif.
- [ ] Animasi menghormati `prefers-reduced-motion`.
- [ ] Label ARIA pada sel papan, saklar, dan log.
- [ ] Ukuran target klik minimal 24 x 24 px (sel 28 px dan 40 px memenuhi).

## 9. Implementasi (arah awal)

Styling memakai **CSS Modules** (diputuskan). Token warna, spasi, dan tipografi ditulis sebagai CSS custom properties satu kali di `src/styles/tokens.css`, lalu dibaca oleh semua komponen. Token durasi gerak bersumber dari `src/animation/timings.ts` dan disalin menjadi CSS custom properties saat aplikasi mulai, sehingga CSS keyframe dan JavaScript membaca angka yang sama (lihat `TECH_SPEC.md` bagian 9).

```css
:root {
  --color-bg-base: #0b1f1a;
  --color-bg-panel: #0f2a23;
  --color-bg-raised: #14352c;
  --color-line: #1f5c46;
  --color-line-strong: #2f9a76;
  --color-text-primary: #d9f5ea;
  --color-text-secondary: #6fcfa8;
  --color-text-muted: #5fb394;
  --color-accent: #4fd1a5;
  --color-danger: #ff6b57;
  --color-warning: #ffb347;
  --color-flash: #ffd27a;
  --font-mono: 'IBM Plex Mono', ui-monospace, monospace;
  --font-sans: 'IBM Plex Sans', system-ui, sans-serif;
  --dur-view-switch: 350ms;
  --dur-missile: 650ms;
}
```

- Font di-host sendiri (paket `@fontsource`) untuk performa dan privasi, hanya bobot 400 dan 500.
- Ikon: tidak memakai pustaka ikon pada MVP. Penanda papan (titik, X, reticle) dan kapal digambar sebagai SVG sendiri.

## 10. Pertanyaan terbuka

1. ~~Hosting font~~ Diputuskan: di-host sendiri lewat `@fontsource`.
2. ~~Tailwind atau CSS Modules~~ Diputuskan: CSS Modules.
3. Perlu variasi tema tambahan setelah MVP? Struktur token sudah memungkinkan, tetapi belum direncanakan.
4. Review pemilik atas palet, ukuran teks, dan komponen di dokumen ini (belum dilakukan).

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 23 Nov 2026 | Draf awal: token warna dengan kontras, tipografi, spasi, gerak, komponen, dan aturan penggunaan |
| 0.2 | 26 Nov 2026 | CSS Modules dan font self-host diputuskan; sumber token gerak dipindah ke `timings.ts` |
