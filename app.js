// ---------- Data ----------
const ICONS = {
  Laptops: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/></svg>',
  Desktops: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="1.5"/><circle cx="12" cy="16" r="2"/><path d="M10 7h4M10 10h4"/></svg>',
  Monitors: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>',
  Components: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  Phones: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  Audio: '<svg viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
  Accessories: '<svg viewBox="0 0 24 24"><rect x="2" y="7" width="20" height="11" rx="2"/><path d="M6 11h1M9 11h1M12 11h1M15 11h1M18 11h0M7 14h10"/></svg>',
};

const GRADIENTS = {
  Laptops: 'linear-gradient(135deg,#6d5dfc,#22d3ee)',
  Desktops: 'linear-gradient(135deg,#0f172a,#7c3aed)',
  Monitors: 'linear-gradient(135deg,#0ea5e9,#6366f1)',
  Components: 'linear-gradient(135deg,#059669,#22d3ee)',
  Phones: 'linear-gradient(135deg,#f43f5e,#f59e0b)',
  Audio: 'linear-gradient(135deg,#8b5cf6,#ec4899)',
  Accessories: 'linear-gradient(135deg,#334155,#64748b)',
};

const PRODUCTS = [
  { id: 1, name: 'AeroBook Pro 14"', category: 'Laptops', price: 1299, was: 1499, rating: 4.8, reviews: 412,
    specs: ['14" 2.8K 120Hz display', '16-core CPU, 32 GB RAM', '1 TB NVMe SSD', '18-hour battery'] },
  { id: 2, name: 'Titan G16 Gaming Laptop', category: 'Laptops', price: 1899, rating: 4.7, reviews: 238,
    specs: ['16" QHD+ 240Hz', 'RTX-class 8 GB GPU', '32 GB DDR5', 'Per-key RGB keyboard'] },
  { id: 3, name: 'Slate 13 Ultralight', category: 'Laptops', price: 849, was: 949, rating: 4.5, reviews: 190,
    specs: ['13.3" FHD touchscreen', '0.98 kg aluminum body', '16 GB RAM, 512 GB SSD', 'Wi-Fi 7'] },
  { id: 4, name: 'Forge X Gaming Tower', category: 'Desktops', price: 2199, rating: 4.9, reviews: 156,
    specs: ['12-core CPU, liquid cooled', 'RTX-class 16 GB GPU', '64 GB DDR5', '2 TB Gen4 SSD'] },
  { id: 5, name: 'Studio Mini PC', category: 'Desktops', price: 699, was: 799, rating: 4.6, reviews: 98,
    specs: ['Palm-sized chassis', '8-core CPU', '16 GB RAM, 1 TB SSD', 'Dual 4K output'] },
  { id: 6, name: 'Vista 27" 4K IPS', category: 'Monitors', price: 379, rating: 4.7, reviews: 521,
    specs: ['27" 3840×2160 IPS', '98% DCI-P3', 'USB-C 90W', 'Height-adjustable stand'] },
  { id: 7, name: 'Hyper 32" Curved 165Hz', category: 'Monitors', price: 449, was: 549, rating: 4.6, reviews: 302,
    specs: ['32" 1440p VA 1500R', '165Hz, 1ms', 'HDR400', 'Adaptive sync'] },
  { id: 8, name: 'Nova RTX GPU 16 GB', category: 'Components', price: 899, rating: 4.8, reviews: 344,
    specs: ['16 GB GDDR6X', 'Ray tracing + AI upscaling', 'Triple-fan cooler', 'PCIe 4.0'] },
  { id: 9, name: 'Quantum 2 TB NVMe SSD', category: 'Components', price: 149, was: 189, rating: 4.9, reviews: 1204,
    specs: ['7,400 MB/s read', 'PCIe Gen4 x4', 'Heatsink included', '5-year warranty'] },
  { id: 10, name: 'Velocity 32 GB DDR5 Kit', category: 'Components', price: 119, rating: 4.7, reviews: 640,
    specs: ['2×16 GB, 6000 MT/s', 'CL30 low latency', 'XMP / EXPO profiles', 'Low-profile heat spreader'] },
  { id: 11, name: 'Pixelon 9 Smartphone', category: 'Phones', price: 799, rating: 4.6, reviews: 877,
    specs: ['6.4" OLED 120Hz', '50 MP triple camera', '256 GB storage', 'All-day battery'] },
  { id: 12, name: 'Pixelon 9a', category: 'Phones', price: 449, was: 499, rating: 4.5, reviews: 432,
    specs: ['6.1" OLED', '48 MP camera', '128 GB storage', '5G'] },
  { id: 13, name: 'Echo ANC Headphones', category: 'Audio', price: 279, was: 349, rating: 4.8, reviews: 990,
    specs: ['Adaptive noise cancelling', '40-hour battery', 'Multipoint Bluetooth', 'Spatial audio'] },
  { id: 14, name: 'Pulse Wireless Earbuds', category: 'Audio', price: 129, rating: 4.4, reviews: 512,
    specs: ['ANC + transparency', '8h + 24h case', 'IPX4', 'Wireless charging'] },
  { id: 15, name: 'Keystroke Mechanical Keyboard', category: 'Accessories', price: 109, rating: 4.7, reviews: 715,
    specs: ['Hot-swappable switches', 'Wireless + USB-C', 'PBT keycaps', 'RGB backlight'] },
  { id: 16, name: 'Glide Pro Wireless Mouse', category: 'Accessories', price: 69, was: 89, rating: 4.6, reviews: 468,
    specs: ['26K DPI sensor', '63 g ultralight', '90-hour battery', '2.4 GHz + Bluetooth'] },
];

const CATEGORIES = ['All', ...Object.keys(ICONS)];
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const $ = s => document.querySelector(s);

// ---------- State ----------
const state = { category: 'All', query: '', sort: 'featured' };
let cart = load();

function load() {
  try { return JSON.parse(localStorage.getItem('djava-cart')) || {}; } catch { return {}; }
}
function save() {
  try { localStorage.setItem('djava-cart', JSON.stringify(cart)); } catch {}
}

// ---------- Rendering ----------
function renderCategories() {
  $('#categories').innerHTML = CATEGORIES.map(c =>
    `<button class="chip" role="tab" aria-selected="${c === state.category}" data-cat="${c}">${c}</button>`).join('');
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.category === 'All' || p.category === state.category) &&
    (!q || (p.name + ' ' + p.category + ' ' + p.specs.join(' ')).toLowerCase().includes(q)));
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  return list;
}

function renderProducts() {
  const list = filtered();
  $('#resultCount').textContent = `${list.length} product${list.length === 1 ? '' : 's'}`;
  $('#products').innerHTML = list.length ? list.map(p => `
    <article class="card">
      <button class="card-media" style="background:${GRADIENTS[p.category]}" data-view="${p.id}" aria-label="View ${p.name}">
        ${p.was ? `<span class="badge">-${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}
        ${ICONS[p.category]}
      </button>
      <div class="card-body">
        <span class="card-cat">${p.category}</span>
        <h3 class="card-title">${p.name}</h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
        <div class="price"><strong>${money(p.price)}</strong>${p.was ? `<s>${money(p.was)}</s>` : ''}</div>
        <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`).join('')
    : `<p class="empty">No products match “${state.query.replace(/[<>&"]/g, "")}”. Try another search.</p>`;
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  let qty = 1;
  const modal = $('#productModal');
  modal.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media" style="background:${GRADIENTS[p.category]}">${ICONS[p.category]}</div>
      <div class="modal-body">
        <button class="icon-btn" data-close aria-label="Close">✕</button>
        <span class="card-cat">${p.category}</span>
        <h3>${p.name}</h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
        <div class="price"><strong>${money(p.price)}</strong>${p.was ? `<s>${money(p.was)}</s>` : ''}</div>
        <ul class="specs">${p.specs.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="mq">1</span><button data-q="1" aria-label="Increase">+</button></div>
        <button class="btn btn-primary btn-block" data-madd>Add to cart</button>
      </div>
    </div>`;
  modal.onclick = e => {
    if (e.target === modal || e.target.closest('[data-close]')) modal.close();
    const q = e.target.closest('[data-q]');
    if (q) { qty = Math.max(1, Math.min(10, qty + +q.dataset.q)); $('#mq').textContent = qty; }
    if (e.target.closest('[data-madd]')) { addToCart(p.id, qty); modal.close(); }
  };
  modal.showModal();
}

// ---------- Cart ----------
function addToCart(id, qty = 1) {
  cart[id] = Math.min(10, (cart[id] || 0) + qty);
  save(); renderCart();
  const p = PRODUCTS.find(x => x.id === id);
  toast(`Added ${p.name} to cart`);
  const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}

function totals() {
  const subtotal = Object.entries(cart).reduce((s, [id, q]) => s + PRODUCTS.find(p => p.id == id).price * q, 0);
  const shipping = subtotal === 0 || subtotal >= 99 ? 0 : 9.99;
  const tax = subtotal * 0.08;
  return { subtotal, shipping, tax, total: subtotal + shipping + tax };
}

function renderCart() {
  const entries = Object.entries(cart);
  $('#cartCount').textContent = entries.reduce((s, [, q]) => s + q, 0);
  if (!entries.length) {
    $('#cartItems').innerHTML = '<p class="empty">Your cart is empty.</p>';
    $('#cartFoot').innerHTML = '<button class="btn btn-ghost btn-block" data-closecart>Continue shopping</button>';
    return;
  }
  $('#cartItems').innerHTML = entries.map(([id, q]) => {
    const p = PRODUCTS.find(x => x.id == id);
    return `<div class="line">
      <div class="line-thumb" style="background:${GRADIENTS[p.category]}">${ICONS[p.category]}</div>
      <div>
        <div class="line-title">${p.name}</div>
        <div class="line-meta">
          <div class="qty"><button data-dec="${id}" aria-label="Decrease">−</button><span>${q}</span><button data-inc="${id}" aria-label="Increase">+</button></div>
          <button class="line-remove" data-remove="${id}">Remove</button>
        </div>
      </div>
      <strong>${money(p.price * q)}</strong>
    </div>`;
  }).join('');
  const t = totals();
  $('#cartFoot').innerHTML = `
    <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div class="row"><span>Shipping</span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
    <div class="row"><span>Tax (8%)</span><span>${money(t.tax)}</span></div>
    <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
    <button class="btn btn-primary btn-block" data-checkout>Checkout</button>`;
}

function renderCheckout() {
  const t = totals();
  $('#cartItems').innerHTML = `
    <form class="form" id="checkoutForm">
      <h3>Shipping details</h3>
      <input required name="name" placeholder="Full name" autocomplete="name">
      <input required type="email" name="email" placeholder="Email" autocomplete="email" inputmode="email">
      <input required name="address" placeholder="Street address" autocomplete="street-address">
      <div class="two"><input required name="city" placeholder="City" autocomplete="address-level2"><input required name="zip" placeholder="ZIP / Postal code" autocomplete="postal-code"></div>
      <h3>Payment</h3>
      <p class="row" style="font-size:.85rem">Demo store — no card is charged and no payment data is stored.</p>
      <input required name="card" placeholder="Card number (demo)" inputmode="numeric" autocomplete="cc-number" pattern="[0-9 ]{12,23}">
      <div class="two"><input required name="exp" placeholder="MM/YY" inputmode="numeric" autocomplete="cc-exp" pattern="(0[1-9]|1[0-2])/[0-9]{2}"><input required name="cvc" placeholder="CVC" inputmode="numeric" autocomplete="cc-csc" pattern="[0-9]{3,4}"></div>
    </form>`;
  $('#cartFoot').innerHTML = `
    <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>
    <button class="btn btn-primary btn-block" type="submit" form="checkoutForm">Place order</button>
    <button class="btn btn-ghost btn-block" data-back>Back to cart</button>`;
  $('#checkoutForm').onsubmit = e => {
    e.preventDefault();
    const name = new FormData(e.target).get('name').split(' ')[0];
    const order = 'DJ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    cart = {}; save();
    $('#cartCount').textContent = 0;
    $('#cartItems').innerHTML = `<div class="success"><div class="check">✓</div>
      <h3>Thank you, ${name.replace(/[<>&"]/g, '')}!</h3><p>Order <b>${order}</b> is confirmed. A receipt is on its way.</p></div>`;
    $('#cartFoot').innerHTML = '<button class="btn btn-primary btn-block" data-closecart>Keep shopping</button>';
  };
}

function openCart() {
  renderCart();
  $('#toast').classList.remove('show');
  $('#cart').classList.add('open'); $('#cart').setAttribute('aria-hidden', 'false');
  $('#overlay').hidden = false;
  document.body.classList.add('locked');
}
function closeCart() {
  $('#cart').classList.remove('open'); $('#cart').setAttribute('aria-hidden', 'true');
  $('#overlay').hidden = true;
  document.body.classList.remove('locked');
}

let toastTimer;
function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(() => t.classList.remove('show'), 2200);
}

// ---------- Events ----------
document.addEventListener('click', e => {
  const el = e.target.closest('[data-cat],[data-add],[data-view],[data-inc],[data-dec],[data-remove],[data-checkout],[data-back],[data-closecart],[data-jump]');
  if (!el) return;
  const d = el.dataset;
  if (d.cat) { state.category = d.cat; renderCategories(); renderProducts(); }
  else if (d.jump) { state.category = d.jump; renderCategories(); renderProducts(); }
  else if (d.add) addToCart(+d.add);
  else if (d.view) openProduct(+d.view);
  else if (d.inc) { cart[d.inc] = Math.min(10, cart[d.inc] + 1); save(); renderCart(); }
  else if (d.dec) { cart[d.dec]--; if (cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
  else if (d.remove) { delete cart[d.remove]; save(); renderCart(); }
  else if ('checkout' in d) renderCheckout();
  else if ('back' in d) renderCart();
  else if ('closecart' in d) closeCart();
});

$('#cartOpen').onclick = openCart;
$('#cartClose').onclick = closeCart;
$('#overlay').onclick = closeCart;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCart(); });

$('#search').addEventListener('input', e => {
  state.query = e.target.value;
  renderProducts();
  const shop = document.getElementById('shop');
  if (state.query && shop.getBoundingClientRect().top > window.innerHeight * 0.6) shop.scrollIntoView({ block: 'start' });
});
$('#sort').onchange = e => { state.sort = e.target.value; renderProducts(); };
$('#newsletter').onsubmit = e => { e.preventDefault(); e.target.reset(); toast('Thanks for subscribing!'); };
$('#year').textContent = new Date().getFullYear();

// Swipe right to close the cart on touch screens
let touchX = null;
$('#cart').addEventListener('touchstart', e => { touchX = e.touches[0].clientX; }, { passive: true });
$('#cart').addEventListener('touchend', e => {
  if (touchX !== null && e.changedTouches[0].clientX - touchX > 80) closeCart();
  touchX = null;
});
// Swipe down on the product sheet to close it
let sheetY = null;
$('#productModal').addEventListener('touchstart', e => { sheetY = $('#productModal').scrollTop === 0 ? e.touches[0].clientY : null; }, { passive: true });
$('#productModal').addEventListener('touchend', e => {
  if (sheetY !== null && e.changedTouches[0].clientY - sheetY > 100) $('#productModal').close();
  sheetY = null;
});

// Installable app + offline support (only works when served over http/https)
if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}

renderCategories();
renderProducts();
renderCart();
