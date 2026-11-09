# TUKU – Halaman Menu

Implementasi halaman **08 – "Mau TUKU apa?"** dari wireframe aplikasi TUKU (Tugas 1)
menggunakan HTML semantik, CSS murni, dan JavaScript vanilla.

## Deskripsi
Pengguna dapat memilih kategori menu, menambahkan kopi ke keranjang, mengubah jumlah,
melihat total harga, lalu mengisi data pengambil dengan validasi form.

## Komponen utama
| # | Komponen | Elemen semantik |
|---|----------|-----------------|
| 1 | Header + tombol toggle | `<header>`, `<button aria-expanded>` |
| 2 | Drawer navigasi | `<nav>` |
| 3 | Tab kategori | `role="tablist"` pada `<section>` |
| 4 | Daftar menu | `<ul>`, `<li>`, `<article>` |
| 5 | Ringkasan keranjang | `<aside>` |
| 6 | Form data pengambil | `<form>`, `<label>`, `<input>` |
| 7 | Navigasi bawah | `<footer>` |

## Fitur JavaScript
- Toggle drawer (dengan `aria-expanded`)
- Filter menu berdasarkan kategori
- Penghitung & total keranjang (tambah, kurangi, kosongkan)
- Validasi form (nama min. 3 karakter, nomor telepon format Indonesia, keranjang tidak kosong)

## Struktur proyek
```
tuku-menu/
├── index.html   # struktur halaman
├── styles.css   # gaya + custom property (warna & spacing)
├── script.js    # interaktivitas
└── README.md
```

## Cara menjalankan
1. Unduh/ekstrak folder `tuku-menu`.
2. Buka `index.html` langsung di browser (klik dua kali), **atau** jalankan server lokal:
   ```bash
   cd tuku-menu
   python3 -m http.server 8000
   ```
   lalu buka `http://localhost:8000`.

Tidak memerlukan instalasi library atau proses build.

## Catatan
Data keranjang hanya disimpan di memori halaman (hilang saat dimuat ulang). Pembayaran bersifat simulasi.
