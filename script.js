/* =========================================================
   script.js – Interaktivitas halaman Menu TUKU
   Fitur: toggle drawer, filter kategori, keranjang (hitung &
   total), validasi form. Tanpa library eksternal.
   ========================================================= */
'use strict';

/* ---------- Helper ---------- */
const $  = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];
// Format angka ke Rupiah, mis. 23000 -> "Rp23.000"
const rupiah = n => 'Rp' + n.toLocaleString('id-ID');

/* ---------- State ---------- */
// Keranjang disimpan sebagai objek: { id: {name, price, qty} }
let cart = {};

/* ---------- 1) Toggle menu drawer ---------- */
const menuToggle = $('#menuToggle');
const drawer = $('#drawer');

menuToggle.addEventListener('click', () => {
  const open = drawer.hidden;           // jika tersembunyi, berarti akan dibuka
  drawer.hidden = !open;
  menuToggle.setAttribute('aria-expanded', String(open));
});
// Tutup drawer setelah salah satu tautan dipilih
drawer.addEventListener('click', e => {
  if (e.target.tagName === 'A') { drawer.hidden = true; menuToggle.setAttribute('aria-expanded', 'false'); }
});

/* ---------- 2) Filter kategori (tab) ---------- */
const tabs = $$('.tab');
const cards = $$('.card');

function filterMenu(cat) {
  cards.forEach(c => { c.hidden = c.dataset.cat !== cat; });
  tabs.forEach(t => {
    const active = t.dataset.filter === cat;
    t.classList.toggle('is-active', active);
    t.setAttribute('aria-selected', String(active));
  });
}
tabs.forEach(t => t.addEventListener('click', () => filterMenu(t.dataset.filter)));
filterMenu('kopi-susu'); // tampilan awal

/* ---------- 3) Keranjang ---------- */
const cartCount = $('#cartCount');
const cartItems = $('#cartItems');
const cartEmpty = $('#cartEmpty');
const cartTotal = $('#cartTotal');

// Render ulang isi keranjang + penghitung badge
function renderCart() {
  const items = Object.entries(cart);
  const count = items.reduce((a, [, i]) => a + i.qty, 0);
  const total = items.reduce((a, [, i]) => a + i.qty * i.price, 0);

  cartCount.textContent = count;
  cartTotal.textContent = rupiah(total);
  cartEmpty.hidden = items.length > 0;

  cartItems.innerHTML = items.map(([id, i]) => `
    <li>
      <span>${i.name}<br><small class="muted">${rupiah(i.price)}</small></span>
      <span class="qty">
        <button type="button" data-act="dec" data-id="${id}" aria-label="Kurangi ${i.name}">−</button>
        <strong>${i.qty}</strong>
        <button type="button" data-act="inc" data-id="${id}" aria-label="Tambah ${i.name}">+</button>
      </span>
    </li>`).join('');
}

// Tambah item dari tombol "Tambah" (event delegation pada daftar menu)
$('#menuList').addEventListener('click', e => {
  const btn = e.target.closest('.add');
  if (!btn) return;
  const { id, name, price } = btn.closest('.card').dataset;
  cart[id] = cart[id] || { name, price: Number(price), qty: 0 };
  cart[id].qty++;
  renderCart();
});

// Ubah jumlah dari dalam keranjang
cartItems.addEventListener('click', e => {
  const b = e.target.closest('button[data-act]');
  if (!b) return;
  const item = cart[b.dataset.id];
  item.qty += b.dataset.act === 'inc' ? 1 : -1;
  if (item.qty <= 0) delete cart[b.dataset.id];
  renderCart();
});

$('#cartClear').addEventListener('click', () => { cart = {}; renderCart(); });
$('#cartOpen').addEventListener('click', () => $('#keranjang').scrollIntoView());

/* ---------- 4) Validasi form ---------- */
const form = $('#orderForm');
const msg = $('#formMsg');

// Aturan validasi: kembalikan pesan error, atau '' jika valid
const rules = {
  nama: v => v.trim().length < 3 ? 'Nama minimal 3 karakter.' : '',
  hp:   v => /^(08|\+628)\d{8,11}$/.test(v.replace(/\s|-/g, '')) ? '' : 'Nomor tidak valid (contoh: 081234567890).'
};

function validateField(name) {
  const input = form.elements[name];
  const error = rules[name](input.value);
  $('#' + name + 'Err').textContent = error;
  input.classList.toggle('invalid', Boolean(error));
  return !error;
}

// Validasi langsung saat pengguna selesai mengisi kolom
Object.keys(rules).forEach(n => form.elements[n].addEventListener('blur', () => validateField(n)));

form.addEventListener('submit', e => {
  e.preventDefault();
  msg.textContent = '';
  const valid = Object.keys(rules).map(validateField).every(Boolean);
  if (!valid) return;
  if (!Object.keys(cart).length) { msg.style.color = 'var(--color-error)'; msg.textContent = 'Keranjang masih kosong.'; return; }

  msg.style.color = '';
  msg.textContent = `Terima kasih, ${form.elements.nama.value.trim()}! Pesanan ${cartTotal.textContent} sedang disiapkan (simulasi).`;
  cart = {}; renderCart(); form.reset();
});

renderCart(); // render awal
