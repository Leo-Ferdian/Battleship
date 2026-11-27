# Technical Design: Battleship Web Game

**Status:** Draft v0.1
**Dokumen terkait:** `PRD.md`, `GAME_DESIGN.md`, `UX_FLOW.md`, `DESIGN_SYSTEM.md`, `IMPLEMENTATION_PLAN.md`
**Terakhir diperbarui:** 26 November 2026

---

## 1. Tujuan

Mengubah dokumen produk dan desain menjadi rancangan teknis yang bisa langsung dikerjakan: struktur kode, model data, batas antar lapisan, alur giliran dan animasi, pengujian, dan pipeline rilis. Dua tujuan teknis utama dari PRD:

1. **Engine murni dan terpisah dari UI**, agar mudah dites dan kelak bisa dijalankan di server (mode online).
2. **Kualitas portofolio**: TypeScript ketat, tes bermakna, aksesibilitas, dan keputusan arsitektur yang terdokumentasi.

## 2. Keputusan teknis

"Disetujui" berarti diputuskan pemilik proyek. "Default" berarti usulan teknis yang dipakai sampai ada keberatan.

| Area | Pilihan | Status | Alasan singkat | Alternatif |
|---|---|---|---|---|
| Framework | React + TypeScript (strict) | Disetujui | Paling banyak dicari, ekosistem terbesar | Vue, Svelte |
| Build tool | Vite | Disetujui | Setup cepat, tanpa konfigurasi rumit | - |
| State UI | Zustand | Disetujui | Ringan, store dapat memanggil engine murni | `useReducer`, Redux Toolkit |
| Styling | CSS Modules + CSS custom properties | Disetujui | Token sudah berupa CSS variables; animasi dan SVG kustom | Tailwind |
| Deployment | Vercel | Disetujui | Deploy otomatis dari GitHub, preview per PR | Netlify, GitHub Pages |
| Font | `@fontsource` (self-host), IBM Plex Mono dan Sans, bobot 400 dan 500 | Disetujui | Performa dan privasi | Google Fonts |
| Pintasan saklar | `Tab` dengan `V` cadangan, satu konstanta | Disetujui | Lihat risiko R2 | - |
| Lempar koin | Dapat dilewati | Disetujui | - | - |
| Cara bermain | Modal singkat | Disetujui | - | Halaman terpisah |
| i18n | `react-i18next` + `i18next-browser-languagedetector` | Default | Standar de facto, interpolasi dan tipe kunci | Format.js, buatan sendiri |
| Unit test | Vitest (+ `@vitest/coverage-v8`) | Default | Satu konfigurasi dengan Vite | Jest |
| Property test | `fast-check` | Default | Cocok untuk penempatan acak dan AI | - |
| Tes komponen | Testing Library (React, user-event) | Default | Menguji perilaku, bukan implementasi | - |
| E2E | Playwright (satu smoke test) | Default | Menjaga alur utama tetap jalan | Cypress |
| Lint dan format | ESLint (`typescript-eslint`, `react-hooks`, `jsx-a11y`) + Prettier | Default | Konsistensi dan aksesibilitas otomatis | Biome |
| Modal | Elemen `<dialog>` bawaan browser | Default | Fokus terperangkap dan `Esc` gratis | Library modal |
| Papan | Grid tombol HTML di atas lapisan seni SVG | Default | Aksesibilitas kuat, seni tetap vektor | Papan SVG penuh |
| Paket manajer | npm | Default | Tanpa langkah instalasi tambahan | pnpm |

## 3. Arsitektur

Empat lapisan, dependensi hanya mengarah ke bawah.

```
+--------------------------------------------------------------+
|  UI (React)        features/*, components/*                  |
|  menampilkan state, mengirim niat pemain                     |
+------------------------------+-------------------------------+
                               | membaca / memanggil aksi
+------------------------------v-------------------------------+
|  Store (Zustand)   gameStore, settingsStore                  |
|  menyimpan state, menyediakan aksi                           |
+------------------------------+-------------------------------+
                               | memanggil
+------------------------------v-------------------------------+
|  Turn Controller + Animation Director                        |
|  mengurutkan: kunci, rudal, dampak, tenggelam, giliran AI    |
+------------------------------+-------------------------------+
                               | memakai fungsi murni
+------------------------------v-------------------------------+
|  Engine (TypeScript murni)  src/engine/*                     |
|  aturan, papan, tembakan, AI. Tanpa React, DOM, atau timer   |
+--------------------------------------------------------------+
```

Aturan yang ditegakkan alat, bukan hanya kesepakatan:
- `src/engine/**` **tidak boleh** mengimpor `react`, `zustand`, `i18next`, atau apa pun dari `src/` selain dirinya sendiri, dan tidak boleh memakai `window`, `document`, `Math.random`, atau `Date.now`. Ditegakkan lewat override ESLint (`no-restricted-imports`, `no-restricted-globals`, `no-restricted-properties`).
- Engine menerima sumber acak (`Rng`) lewat parameter. Produksi memakai seed dari waktu, tes memakai seed tetap.
- UI tidak pernah memodifikasi state engine langsung, hanya lewat aksi store.

## 4. Struktur folder

```
battleship/
  public/
  src/
    engine/                 # TS murni, nol dependensi
      types.ts              # tipe domain
      constants.ts          # BOARD_SIZE, FLEET
      rng.ts                # Rng + createSeededRng (mulberry32)
      coords.ts             # parse/format "D5", dalam papan, tetangga
      board.ts              # createBoard, canPlace, placeShip, removeShip
      placement.ts          # randomFleet
      shooting.ts           # resolveShot, isFleetSunk
      game.ts               # createGame, getAiView, statistik
      ai/
        strategy.ts         # antarmuka ShotStrategy
        huntTarget.ts       # strategi MVP
      index.ts              # API publik engine
    store/
      gameStore.ts          # state permainan + aksi
      settingsStore.ts      # bahasa, auto-switch, reduced motion (persist)
      turnController.ts     # orkestrasi giliran (dependensi disuntik)
    animation/
      timings.ts            # sumber tunggal durasi (lihat bagian 9)
      director.ts           # AnimationDirector: play(effect): Promise<void>
      useReducedMotion.ts
      effects/              # Reticle, Missile, HitBurst, MissRipple, SinkShip, Banner, CoinFlip, RadarSweep
    features/
      menu/  placement/  battle/  result/  settings/  howto/
    components/
      Board/ Cell/ ShipSprite/ ViewSwitch/ ConsolePanel/ FleetStatus/
      CommLog/ FireControl/ TurnIndicator/ Banner/ Modal/ Button/ Toast/
    i18n/
      index.ts  locales/id.json  locales/en.json  types.d.ts
    styles/
      tokens.css  global.css
    App.tsx  main.tsx
  tests/e2e/                # Playwright
  .github/workflows/ci.yml
  README.md
```

Tes unit diletakkan berdampingan dengan kodenya (`board.ts` dan `board.test.ts`). Komponen memakai CSS Module di sebelahnya (`Cell.tsx` dan `Cell.module.css`).

## 5. Model data

Semua tipe berada di `src/engine/types.ts`. Semuanya dapat diserialisasi ke JSON (tanpa kelas, `Map`, atau fungsi) agar siap dikirim lewat jaringan nanti.

```ts
export type Side = 'player' | 'ai';
export type Orientation = 'H' | 'V';
export type ShipType = 'carrier' | 'battleship' | 'cruiser' | 'submarine' | 'destroyer';

export interface Coord { row: number; col: number } // 0..9

export interface PlacedShip {
  type: ShipType;
  length: number;
  origin: Coord;            // sel paling kiri (H) atau paling atas (V)
  orientation: Orientation;
}

export type ShotOutcome = 'miss' | 'hit' | 'sunk';

export interface ShotRecord {
  by: Side;
  coord: Coord;
  outcome: ShotOutcome;
  sunk?: { type: ShipType; cells: Coord[] };  // hanya jika outcome === 'sunk'
  turn: number;                                // urutan tembakan, mulai 1
}

export interface Board {
  size: number;                       // 10
  ships: PlacedShip[];                // kapal pemilik papan ini
  incoming: ShotRecord[];             // tembakan yang MENGENAI papan ini
}

export type Phase = 'menu' | 'placement' | 'coinToss' | 'playing' | 'gameOver';

export interface GameState {
  phase: Phase;
  boards: Record<Side, Board>;
  turn: Side;                         // yang berhak menembak
  winner: Side | null;
  seed: number;                       // untuk reproduksi
}

export interface AiView {
  size: number;
  shots: readonly ShotRecord[];       // hanya tembakan milik AI
  remainingLengths: readonly number[];// panjang kapal pemain yang belum tenggelam
}
```

Catatan desain:
- Sel kapal **diturunkan** dari `origin`, `length`, `orientation` (tidak disimpan ganda), sehingga mustahil tidak sinkron.
- Kena dan tenggelam **diturunkan** dari `incoming` dan `ships`. Tidak ada penghitung `hits` yang bisa melenceng.
- `AiView` secara tipe **tidak memuat posisi kapal pemain**, sehingga AI tidak bisa curang bahkan karena kelalaian (FR-12). Informasi `sunk.cells` sah karena UI juga mengungkapkannya.

## 6. API engine

Semua fungsi murni: input sama menghasilkan output sama, tanpa mutasi (mengembalikan objek baru).

| Fungsi | Tugas |
|---|---|
| `createBoard()` | Papan kosong 10x10 |
| `shipCells(ship)` | Daftar `Coord` yang ditempati kapal |
| `canPlace(board, ship)` | Valid jika di dalam papan dan tidak tumpang tindih (bersentuhan boleh). Mengembalikan `{ ok: true }` atau `{ ok: false, reason: 'out-of-bounds' \| 'overlap' \| 'duplicate-type' }` |
| `placeShip(board, ship)` / `removeShip(board, type)` | Menambah atau mengangkat kapal, mengembalikan papan baru atau galat |
| `randomFleet(rng)` | Armada lengkap yang valid. Mencoba berulang dengan batas percobaan; jika buntu, mulai ulang dari awal. Dijamin selesai |
| `resolveShot(board, coord, by, turn)` | Menghitung hasil tembakan **tanpa efek samping**: mengembalikan `{ board, record }`. Menolak sel yang sudah ditembak |
| `isFleetSunk(board)` | Seluruh kapal tenggelam |
| `getAiView(state)` | Membangun `AiView` dari state |
| `createGame(rng)` | State awal untuk game baru |

Invarian yang harus selalu benar (dijadikan tes properti):
1. Setiap armada dari `randomFleet` memiliki 5 kapal dengan panjang 5, 4, 3, 3, 2, semuanya di dalam papan, tanpa tumpang tindih.
2. Sel tidak pernah menerima dua tembakan.
3. Jumlah sel kapal total adalah 17, dan game selesai tepat ketika 17 sel kapal sudah terkena.
4. `resolveShot` pada papan yang sama dan koordinat yang sama menghasilkan hasil identik.

## 7. AI

### Antarmuka

```ts
export interface ShotStrategy {
  nextShot(view: AiView, rng: Rng): Coord;
}
```

Strategi MVP (`huntTarget`) **tanpa state internal**: seluruh keputusan dihitung ulang dari `view.shots`. Ini membuatnya mudah dites dan tidak mungkin tidak sinkron.

### Algoritma

1. **Kena yang belum selesai** = tembakan `hit` yang selnya tidak termasuk `sunk.cells` kapal mana pun.
2. Jika ada, **mode target**:
   - Jika dua atau lebih kena yang belum selesai segaris, perpanjang garis itu pada kedua ujungnya (sel dalam papan dan belum ditembak).
   - Jika tidak ada garis, ambil empat tetangga dari setiap kena yang belum selesai.
   - Pilih acak dari kandidat yang tersedia. Jika garis tersumbat di kedua ujung, kembali ke tetangga.
3. Jika tidak ada, **mode hunt**:
   - Kandidat = sel belum ditembak yang masih **muat** kapal terkecil yang tersisa (ada ruang bebas berurutan sepanjang `min(remainingLengths)` secara horizontal atau vertikal).
   - Utamakan sel berpola catur (`(row + col) % 2 === 0`). Jika habis, pakai seluruh kandidat.
   - Pilih acak.

Jeda 600-1200 ms dan animasi "memindai" **bukan** bagian AI, melainkan tanggung jawab Turn Controller.

Level kesulitan lain (backlog) cukup menambah strategi baru, misalnya `probabilityDensity`, tanpa mengubah engine.

## 8. State dan alur giliran

### Store

| Store | Isi | Persist |
|---|---|---|
| `gameStore` | `game: GameState`, `turnPhase`, `viewMode` (`radar` \| `deck`), `lockedTarget`, `log: LogEvent[]`, `stats`, `placement` (kapal terpilih, orientasi) | Tidak |
| `settingsStore` | `language`, `autoSwitchToDeck`, `reducedMotion` (`system` \| `on` \| `off`) | Ya (localStorage) |

`LogEvent` menyimpan **data terstruktur**, bukan kalimat (`{ type: 'shot', by, coord, outcome, shipType? }`). Teks dirender saat tampil lewat i18n, sehingga mengganti bahasa di tengah game langsung mengubah seluruh log.

### Fase giliran (`turnPhase`)

| Fase | Arti | Input pemain |
|---|---|---|
| `idle` | Menunggu pemain memilih | Aktif |
| `locking` | Reticle mengunci | Diabaikan |
| `firing` | Rudal meluncur | Diabaikan |
| `impact` | Dampak kena atau meleset | Diabaikan |
| `sinking` | Animasi tenggelam dan banner | Diabaikan |
| `handoff` | Jeda dan peralihan ke giliran lawan | Diabaikan |
| `aiThinking` | AI memindai (600-1200 ms) | Diabaikan |

Saklar tampilan tetap dapat dipakai pemain di semua fase.

### Pola: hitung dulu, animasikan, baru simpan

Engine tahu hasil tembakan seketika, tetapi UI tidak boleh membocorkannya sebelum animasi sampai. Karena itu Turn Controller menghitung hasil lebih dulu (tanpa menyimpan), memutar animasi, lalu menyimpan hasilnya.

```ts
async function playerFire(coord: Coord) {
  if (!canFire(coord)) return;                         // pesan di log, tanpa tombol mati
  const { board, record } = resolveShot(game.boards.ai, coord, 'player', n);  // belum disimpan

  setPhase('locking');  await director.play({ kind: 'lock', coord });
  setPhase('firing');   await director.play({ kind: 'missile', coord });
  setPhase('impact');   await director.play({ kind: record.outcome === 'miss' ? 'miss' : 'hit', coord });

  commit(board, record);                                // tanda menetap, log, statistik
  if (record.outcome === 'sunk') {
    setPhase('sinking');
    await director.play({ kind: 'sink', ship: record.sunk! });
    await director.play({ kind: 'banner', ship: record.sunk!.type });
  }
  if (isFleetSunk(board)) return finish('player');

  await handoffToAi();                                  // saklar ke Dek jika autoSwitch, jeda, giliran AI
}
```

Giliran AI memakai jalur yang sama (`strategy.nextShot(getAiView(game))`, tembakan ke papan pemain), lalu saklar kembali ke Radar. Jika kapal pemain tenggelam, animasi tenggelam dan banner selesai dulu. Jika tembakan AI mengakhiri game, tampilan tetap di Dek lalu layar hasil muncul.

### Pembatalan

Setiap permainan memiliki `runId`. Keluar ke Menu, memulai ulang, atau mengganti game menaikkan `runId` dan memanggil `director.cancelAll()`. Janji yang menunggu ditolak dengan `AbortError` dan controller berhenti diam-diam. Ini mencegah animasi "hantu" dari game lama.

### Dependency injection

`createTurnController({ director, rng, strategy, getState, setState })` menerima semua ketergantungannya. Dalam tes, `director` diganti versi instan sehingga alur satu game penuh bisa diuji dalam milidetik tanpa menunggu animasi.

## 9. Animasi

### Sumber durasi tunggal

Durasi didefinisikan **sekali** di `src/animation/timings.ts` (nilai awal dari `GAME_DESIGN.md` bagian 8 dan `DESIGN_SYSTEM.md` bagian 5). Saat aplikasi mulai, nilai itu disalin menjadi CSS custom properties (`--dur-missile`, dan seterusnya), jadi CSS keyframe dan JavaScript membaca angka yang sama. Warna, spasi, dan tipografi tetap hidup di `tokens.css`.

### Animation Director

```ts
type Effect =
  | { kind: 'lock'; coord: Coord }
  | { kind: 'missile'; coord: Coord }
  | { kind: 'hit' | 'miss'; coord: Coord }
  | { kind: 'sink'; ship: { type: ShipType; cells: Coord[] } }
  | { kind: 'banner'; ship: ShipType }
  | { kind: 'coin'; first: Side }
  | { kind: 'wait'; ms: number };

interface AnimationDirector {
  play(effect: Effect): Promise<void>;   // selesai saat animasi selesai
  cancelAll(): void;
}
```

Komponen efek mendaftarkan diri ke director. Implementasi memakai Web Animations API (`element.animate(...).finished`) dan CSS keyframe untuk efek sederhana. Aturan:
- Hanya menganimasikan `transform` dan `opacity` (kecuali efek SVG yang memang mengubah atribut, seperti riak dan cincin kejut), agar tetap 60 fps.
- Dengan reduced motion (`prefers-reduced-motion` atau pengaturan "Kurangi gerakan"): getaran, riak, sapuan radar, dan perputaran dimatikan, dampak diganti perubahan warna di bawah 150 ms. Director tetap me-resolve janji sehingga alur giliran tidak berubah.
- `cancelAll()` harus aman dipanggil berkali-kali (React StrictMode memanggil efek dua kali saat pengembangan).

Gambar kapal dan urutan efek dipindahkan dari `prototype-ships-animations.html` menjadi komponen SVG bertipe. Warna dan durasi diganti token.

### Lapisan papan

Satu kotak persegi dengan tiga lapisan bertumpuk:

1. **Seni (SVG, `aria-hidden`)**: grid, kapal, penanda tetap, efek (`ShipSprite`, efek). Satu `viewBox` (satu sel = 40 satuan), diskalakan ke ukuran layar.
2. **Grid interaktif (HTML)**: 100 `<button>` di CSS grid yang menumpuk persis di atas seni. Ini yang menerima klik, fokus, dan dibaca pembaca layar.
3. **Overlay**: banner dan reticle.

Pemisahan ini membuat seni bebas dianimasikan tanpa merusak aksesibilitas. Sel dibungkus `React.memo` agar klik satu sel tidak merender ulang 99 lainnya.

## 10. i18n

- Berkas `id.json` dan `en.json`, kunci bersarang per area (`menu.*`, `placement.*`, `battle.*`, `log.*`, `ships.*`, `settings.*`, `a11y.*`).
- Interpolasi untuk nilai dinamis: `"log.playerMiss": "Anda > {{coord}} meleset"`. Pluralisasi memakai fitur bawaan i18next.
- **Kunci diketik**: `i18n/types.d.ts` memperluas `CustomTypeOptions` dengan bentuk `id.json`. Kunci yang salah ketik gagal saat kompilasi.
- **Kelengkapan dites**: satu tes memastikan himpunan kunci `id.json` dan `en.json` sama persis dan tidak ada nilai kosong.
- Bahasa awal: `localStorage` jika ada, lalu bahasa browser, lalu Inggris. Mengganti bahasa memperbarui `document.documentElement.lang`.
- Aturan lint: tidak ada literal teks UI di dalam JSX selain lewat `t(...)`.

## 11. Persistensi

Hanya `settingsStore` yang disimpan, dengan kunci `battleship:settings:v1` (versi di nama kunci untuk migrasi kelak). Pembacaan dan penulisan dibungkus `try/catch` karena `localStorage` bisa melempar galat (mode privat, data situs diblokir); jika gagal, aplikasi tetap jalan dengan nilai default. State game tidak disimpan di MVP: muat ulang kembali ke Menu.

## 12. Aksesibilitas (implementasi)

| Kebutuhan | Cara |
|---|---|
| Papan dapat dinavigasi keyboard | Grid tombol dengan roving tabindex: satu sel fokus, tombol panah memindahkan, `Enter` atau `Spasi` mengunci target |
| Label sel | `aria-label` dari i18n ("D5, belum ditembak", "D5, kena", "D5, bagian dari Penjelajah yang tenggelam") |
| Saklar tampilan | `role="radiogroup"` dengan dua `role="radio"` dan label teks |
| Pengumuman | Log memakai `aria-live="polite"`; kapal tenggelam dan game berakhir memakai wilayah terpisah `assertive` |
| Modal | Elemen `<dialog>` dengan `showModal()`: fokus terperangkap, `Esc` menutup, fokus kembali ke pemicu |
| Fokus terlihat | Cincin `--color-focus` 2 px pada semua elemen interaktif |
| Reduced motion | Lihat bagian 9 |
| Bahasa dokumen | `lang` mengikuti bahasa terpilih |
| Pintasan | Semua dalam satu konstanta `SHORTCUTS` (Tab, V, Enter, Esc, R, panah), mudah diubah |

Pengecekan otomatis: aturan `jsx-a11y` di ESLint, ditambah audit Lighthouse dan pengecekan manual dengan pembaca layar pada milestone M8.

## 13. Pengujian

| Lapisan | Alat | Fokus | Target |
|---|---|---|---|
| Engine | Vitest | Setiap fungsi, kasus tepi (pojok papan, kapal bersentuhan, sel berulang) | Cakupan baris dan fungsi minimal 90% pada `src/engine/**`, diwajibkan di konfigurasi |
| Properti | fast-check | Invarian bagian 6, penempatan acak selalu valid, AI tidak pernah menembak sel yang sama | Ratusan kasus acak per properti |
| Simulasi AI | Vitest | 1000 game AI vs armada acak: selalu selesai dalam 100 tembakan atau kurang; rata-rata tembakan di bawah ambang yang ditetapkan setelah simulasi pertama (perkiraan 45-60) | Mencegah regresi kualitas AI |
| Alur giliran | Vitest + director palsu | Urutan fase, pembatalan, auto-switch, giliran berganti hanya setelah animasi selesai | Seluruh game penuh dapat disimulasikan |
| i18n | Vitest | Kunci `id` dan `en` identik | Gagal jika ada kunci hilang |
| Komponen | Testing Library | Kontrol tembak dua langkah, saklar dengan keyboard, pratinjau penempatan valid/tidak valid, tombol tanpa status mati | Perilaku kritis UX |
| E2E | Playwright | Menu, acak armada, mulai, beberapa tembakan, sampai hasil | Satu smoke test di CI |
| Manual | - | Chrome, Firefox, Safari, Edge terbaru; pembaca layar; mode kurangi gerakan | Daftar periksa di M9 |

## 14. Tooling, CI/CD, konvensi

**Skrip npm:** `dev`, `build`, `preview`, `lint`, `typecheck` (`tsc --noEmit`), `test`, `test:coverage`, `test:e2e`, `format`.

**TypeScript:** `strict`, ditambah `noUncheckedIndexedAccess` dan `exactOptionalPropertyTypes`. Tanpa `any` kecuali dikomentari alasannya.

**CI (GitHub Actions)** pada setiap push dan pull request: `npm ci`, lint, typecheck, test dengan ambang cakupan, build. Smoke test Playwright berjalan pada pull request ke `main`. Pull request yang merah tidak digabung.

**CD:** Vercel terhubung ke repositori. Setiap pull request mendapat URL pratinjau, dan `main` dideploy ke produksi.

**Git:** satu cabang per milestone atau potongan kerja, pull request kecil, gabung ke `main` setelah CI hijau. Pesan commit mengikuti Conventional Commits (`feat:`, `fix:`, `test:`, `docs:`, `chore:`).

**Dokumentasi:** README (tangkapan layar, cara menjalankan, arsitektur ringkas, tautan ke dokumen ini) dan catatan keputusan di bagian 2.

## 15. Performa

- Muatan JavaScript awal maksimal 150 KB gzip. Dipantau lewat laporan build.
- Hanya subset Latin bobot 400 dan 500 untuk kedua font, format `woff2`, dengan `font-display: swap`.
- Tanpa pustaka animasi, ikon, atau komponen UI pihak ketiga pada MVP.
- Lighthouse performa dan aksesibilitas minimal 90 (metrik PRD).

## 16. Kesiapan mode online (bukan bagian MVP)

Hal yang sudah disiapkan oleh rancangan ini, tanpa membangunnya sekarang:
- Engine tanpa DOM dan tanpa waktu global, dapat dijalankan di Node.
- State dan catatan tembakan berupa JSON murni, mudah dikirim.
- `Rng` disuntik, sehingga server dapat menentukan seed.
- Informasi tersembunyi sudah terpisah secara tipe (`AiView` tidak memuat kapal lawan). Server nanti akan mengirim "tampilan pemain" serupa dan tidak pernah mengirim posisi kapal lawan.
- Jalur ekstraksi: pindahkan `src/engine` ke `packages/engine` (npm workspace), impor dari klien dan server.

Hal yang sengaja belum dirancang: protokol pesan, sinkronisasi, penanganan putus koneksi, dan matchmaking.

## 17. Risiko teknis

| # | Risiko | Dampak | Mitigasi |
|---|---|---|---|
| R1 | Balapan animasi (klik cepat, pindah layar saat animasi) | State rusak atau animasi hantu | Fase giliran + `runId` + `cancelAll()` + tes dengan director palsu |
| R2 | `Tab` sebagai pintasan saklar mengganggu navigasi fokus standar | Masalah aksesibilitas | `V` selalu terpasang; `Tab` di balik konstanta dan diputuskan ulang di M8 |
| R3 | Perilaku animasi SVG berbeda di Safari | Tampilan atau performa tidak konsisten | Uji manual lintas browser di M9; pakai `transform` dan `opacity` |
| R4 | Kunci terjemahan tertinggal | Teks campur bahasa | Kunci diketik + tes kelengkapan |
| R5 | `localStorage` tidak tersedia | Preferensi tidak tersimpan | `try/catch`, default aman |
| R6 | React StrictMode memanggil efek dua kali | Animasi atau listener ganda | Efek dan `cancelAll()` idempoten |
| R7 | Cakupan proyek membengkak | MVP tak selesai | Backlog tegas di PRD; fitur baru setelah M9 |

## 18. Pertanyaan terbuka

Tidak ada yang menghalangi implementasi. Hal kecil yang diputuskan saat pengerjaan: versi pasti React dan pustaka (dikunci di `package.json` saat setup M0), dan ambang rata-rata tembakan AI untuk tes simulasi (ditetapkan setelah simulasi pertama).

---

## Riwayat revisi

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 26 Nov 2026 | Draf awal: arsitektur, model data, engine, AI, alur giliran, animasi, i18n, pengujian, CI/CD |
