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
  // Laptops
  { id: 1, brand: 'Apple', name: 'MacBook Air 13" (M4)', category: 'Laptops', price: 999, rating: 4.8, reviews: 2140,
    specs: ['Apple M4 chip, 10-core CPU', '16 GB unified memory', '256 GB SSD', '13.6" Liquid Retina display', 'Up to 18 hours battery'] },
  { id: 2, brand: 'Apple', name: 'MacBook Pro 14" (M4 Pro)', category: 'Laptops', price: 1999, rating: 4.9, reviews: 1388,
    specs: ['Apple M4 Pro chip', '24 GB unified memory', '512 GB SSD', '14.2" Liquid Retina XDR display', 'Thunderbolt 5 ports'] },
  { id: 3, brand: 'ASUS', name: 'ROG Zephyrus G14', category: 'Laptops', price: 1799, was: 1999, rating: 4.7, reviews: 864,
    specs: ['AMD Ryzen AI 9 processor', 'NVIDIA GeForce RTX 5070 Ti', '14" 3K OLED 120Hz', '32 GB RAM, 1 TB SSD', 'Aluminum CNC chassis'] },
  { id: 4, brand: 'ASUS', name: 'Zenbook 14 OLED', category: 'Laptops', price: 949, was: 1099, rating: 4.6, reviews: 612,
    specs: ['Intel Core Ultra 7', '14" 3K OLED touch display', '16 GB RAM, 1 TB SSD', '1.2 kg', 'Wi-Fi 7'] },
  { id: 5, brand: 'Lenovo', name: 'ThinkPad X1 Carbon', category: 'Laptops', price: 1749, rating: 4.7, reviews: 530,
    specs: ['Intel Core Ultra 7', '14" 2.8K OLED', '32 GB RAM, 1 TB SSD', 'Under 1.1 kg', 'MIL-STD tested'] },
  { id: 6, brand: 'Lenovo', name: 'Legion Pro 7i', category: 'Laptops', price: 2499, rating: 4.8, reviews: 402,
    specs: ['Intel Core Ultra 9', 'NVIDIA GeForce RTX 5080', '16" 2.5K 240Hz OLED', '32 GB RAM, 2 TB SSD'] },
  { id: 7, brand: 'Dell', name: 'XPS 14', category: 'Laptops', price: 1499, was: 1699, rating: 4.5, reviews: 377,
    specs: ['Intel Core Ultra 7', '14.5" 3.2K OLED touch', '32 GB RAM, 1 TB SSD', 'Haptic touchpad'] },
  { id: 8, brand: 'HP', name: 'Spectre x360 14', category: 'Laptops', price: 1449, rating: 4.6, reviews: 455,
    specs: ['2-in-1 convertible', 'Intel Core Ultra 7', '14" 2.8K OLED 120Hz', 'Pen included'] },
  { id: 9, brand: 'Microsoft', name: 'Surface Laptop 13.8"', category: 'Laptops', price: 999, rating: 4.5, reviews: 690,
    specs: ['Snapdragon X Elite', '16 GB RAM, 512 GB SSD', '13.8" PixelSense touch', 'Copilot+ PC'] },

  // Desktops
  { id: 10, brand: 'Apple', name: 'iMac 24" (M4)', category: 'Desktops', price: 1299, rating: 4.8, reviews: 920,
    specs: ['Apple M4 chip', '24" 4.5K Retina display', '16 GB memory, 256 GB SSD', 'Magic Keyboard & Mouse included'] },
  { id: 11, brand: 'Apple', name: 'Mac mini (M4)', category: 'Desktops', price: 599, rating: 4.9, reviews: 1810,
    specs: ['Apple M4 chip', '16 GB unified memory', '256 GB SSD', '5×5" compact design', 'Front USB-C ports'] },
  { id: 12, brand: 'Dell', name: 'Alienware Aurora Gaming Desktop', category: 'Desktops', price: 2299, was: 2499, rating: 4.6, reviews: 288,
    specs: ['Intel Core Ultra 9', 'NVIDIA GeForce RTX 5080', '32 GB DDR5', '2 TB SSD, liquid cooling'] },
  { id: 13, brand: 'ASUS', name: 'ROG Strix G16CH Desktop', category: 'Desktops', price: 1899, rating: 4.5, reviews: 164,
    specs: ['Intel Core i7', 'NVIDIA GeForce RTX 5070', '32 GB DDR5', '1 TB SSD, RGB case'] },

  // Monitors
  { id: 14, brand: 'Apple', name: 'Studio Display', category: 'Monitors', price: 1599, rating: 4.6, reviews: 744,
    specs: ['27" 5K Retina', '600 nits brightness', '12 MP Center Stage camera', 'Six-speaker sound'] },
  { id: 15, brand: 'Samsung', name: 'Odyssey OLED G9 49"', category: 'Monitors', price: 1199, was: 1599, rating: 4.7, reviews: 518,
    specs: ['49" Dual QHD curved OLED', '240Hz, 0.03 ms', 'HDR True Black 400', 'Smart TV apps built in'] },
  { id: 16, brand: 'ASUS', name: 'ROG Swift OLED 27" 4K', category: 'Monitors', price: 999, rating: 4.8, reviews: 301,
    specs: ['27" 4K QD-OLED', '240Hz refresh', 'DisplayPort 2.1', 'Custom heatsink'] },
  { id: 17, brand: 'Dell', name: 'UltraSharp 27 4K USB-C Hub', category: 'Monitors', price: 579, rating: 4.7, reviews: 866,
    specs: ['27" 4K IPS Black', '120Hz', 'USB-C 140W charging', 'Built-in Ethernet & hub'] },

  // Phones
  { id: 18, brand: 'Apple', name: 'iPhone 17 Pro', category: 'Phones', price: 1099, rating: 4.8, reviews: 3120,
    specs: ['6.3" Super Retina XDR, ProMotion', 'A19 Pro chip', '48 MP Pro camera system', '256 GB'] },
  { id: 19, brand: 'Apple', name: 'iPhone 17', category: 'Phones', price: 799, rating: 4.7, reviews: 2650,
    specs: ['6.3" display, 120Hz', 'A19 chip', '48 MP Dual Fusion camera', '256 GB'] },
  { id: 20, brand: 'Samsung', name: 'Galaxy S25 Ultra', category: 'Phones', price: 1099, was: 1299, rating: 4.7, reviews: 2215,
    specs: ['6.9" QHD+ AMOLED', 'Snapdragon 8 Elite for Galaxy', '200 MP camera, 5× zoom', 'Built-in S Pen'] },
  { id: 21, brand: 'Google', name: 'Pixel 10 Pro', category: 'Phones', price: 999, rating: 4.6, reviews: 980,
    specs: ['6.3" Super Actua display', 'Google Tensor G5', '50 MP triple camera, 5× zoom', '7 years of updates'] },

  // Components
  { id: 22, brand: 'NVIDIA', name: 'GeForce RTX 5090 Founders Edition', category: 'Components', price: 1999, rating: 4.8, reviews: 640,
    specs: ['32 GB GDDR7', 'DLSS 4 with Multi Frame Generation', 'PCIe 5.0', 'Double flow-through cooler'] },
  { id: 23, brand: 'NVIDIA', name: 'GeForce RTX 5070', category: 'Components', price: 549, rating: 4.6, reviews: 1104,
    specs: ['12 GB GDDR7', 'DLSS 4', 'Ray tracing cores', 'PCIe 5.0'] },
  { id: 24, brand: 'AMD', name: 'Ryzen 7 9800X3D', category: 'Components', price: 449, was: 479, rating: 4.9, reviews: 2380,
    specs: ['8 cores / 16 threads', '2nd-gen 3D V-Cache', 'Up to 5.2 GHz', 'AM5 socket'] },
  { id: 25, brand: 'Samsung', name: '990 PRO 2 TB NVMe SSD', category: 'Components', price: 169, was: 199, rating: 4.9, reviews: 4510,
    specs: ['Up to 7,450 MB/s read', 'PCIe 4.0 NVMe', 'Heatsink option', '5-year warranty'] },
  { id: 26, brand: 'Corsair', name: 'Vengeance 32 GB DDR5-6000', category: 'Components', price: 109, rating: 4.8, reviews: 3020,
    specs: ['2×16 GB kit', '6000 MT/s, CL30', 'Intel XMP / AMD EXPO', 'Low-profile heat spreader'] },

  // Audio
  { id: 27, brand: 'Apple', name: 'AirPods Pro 3', category: 'Audio', price: 249, rating: 4.7, reviews: 3890,
    specs: ['Active Noise Cancellation', 'Heart-rate sensing', 'Up to 8 hours listening', 'USB-C MagSafe case'] },
  { id: 28, brand: 'Sony', name: 'WH-1000XM6', category: 'Audio', price: 429, was: 449, rating: 4.8, reviews: 1430,
    specs: ['Industry-leading noise cancelling', '30-hour battery', 'Foldable design', 'Multipoint Bluetooth'] },
  { id: 29, brand: 'Samsung', name: 'Galaxy Buds3 Pro', category: 'Audio', price: 199, was: 249, rating: 4.4, reviews: 870,
    specs: ['Adaptive ANC', '24-bit Hi-Fi audio', 'IP57', 'Wireless charging case'] },

  // Accessories
  { id: 30, brand: 'Logitech', name: 'MX Master 3S Mouse', category: 'Accessories', price: 99, rating: 4.8, reviews: 6120,
    specs: ['8K DPI sensor', 'Quiet clicks', 'MagSpeed scroll wheel', 'Up to 70 days battery'] },
  { id: 31, brand: 'Logitech', name: 'MX Keys S Keyboard', category: 'Accessories', price: 109, rating: 4.7, reviews: 3340,
    specs: ['Smart backlighting', 'Multi-device (3)', 'USB-C rechargeable', 'Mac & Windows layouts'] },
  { id: 32, brand: 'Apple', name: 'Magic Keyboard with Touch ID', category: 'Accessories', price: 149, rating: 4.6, reviews: 1270,
    specs: ['Touch ID for Mac', 'Numeric keypad', 'USB-C charging', 'Wireless'] },
  { id: 33, brand: 'Razer', name: 'BlackWidow V4 Pro', category: 'Accessories', price: 199, was: 229, rating: 4.6, reviews: 905,
    specs: ['Razer mechanical switches', 'Command dial + macro keys', 'Chroma RGB', 'Magnetic wrist rest'] },
];

const CATEGORIES = ['All', ...Object.keys(ICONS)];
const FEATURED_BRANDS = ['Apple', 'ASUS', 'Samsung', 'Dell', 'Lenovo', 'HP', 'Microsoft', 'Google', 'Sony', 'NVIDIA', 'AMD', 'Logitech'];
const BRANDS = ['All brands', ...[...new Set(PRODUCTS.map(p => p.brand))].sort()];
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const $ = s => document.querySelector(s);

// ---------- State ----------
const state = { category: 'All', brand: 'All brands', query: '', sort: 'featured' };
let cart = load();

function load() {
  try { return JSON.parse(localStorage.getItem('djava-cart')) || {}; } catch { return {}; }
}
function save() {
  try { localStorage.setItem('djava-cart', JSON.stringify(cart)); } catch {}
}

// ---------- Rendering ----------
function renderBrands() {
  $('#brandSelect').innerHTML = BRANDS.map(b => `<option${b === state.brand ? ' selected' : ''}>${b}</option>`).join('');
  $('#brandStrip').innerHTML = FEATURED_BRANDS.map(b =>
    `<button class="brand-tile${b === state.brand ? ' active' : ''}" data-brand="${b}">${b}<small>${(n => `${n} product${n === 1 ? '' : 's'}`)(PRODUCTS.filter(p => p.brand === b).length)}</small></button>`).join('');
}

function renderCategories() {
  $('#categories').innerHTML = CATEGORIES.map(c =>
    `<button class="chip" role="tab" aria-selected="${c === state.category}" data-cat="${c}">${c}</button>`).join('');
}

function filtered() {
  const q = state.query.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.category === 'All' || p.category === state.category) &&
    (state.brand === 'All brands' || p.brand === state.brand) &&
    (!q || (p.brand + ' ' + p.name + ' ' + p.category + ' ' + p.specs.join(' ')).toLowerCase().includes(q)));
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
      <button class="card-media" style="background:${GRADIENTS[p.category]}" data-view="${p.id}" aria-label="View ${p.brand} ${p.name}">
        <span class="brand-tag">${p.brand}</span>
        ${p.was ? `<span class="badge">-${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}
        ${ICONS[p.category]}
      </button>
      <div class="card-body">
        <span class="card-cat">${p.brand} · ${p.category}</span>
        <h3 class="card-title">${p.brand} ${p.name}</h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
        <div class="price"><strong>${money(p.price)}</strong>${p.was ? `<s>${money(p.was)}</s>` : ''}</div>
        <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`).join('')
    : `<p class="empty">No products match your filters. Try another search, brand or category.</p>`;
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
        <span class="card-cat">${p.brand} · ${p.category}</span>
        <h3>${p.brand} ${p.name}</h3>
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
  toast(`Added ${p.brand} ${p.name} to cart`);
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
        <div class="line-title">${p.brand} ${p.name}</div>
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
  const el = e.target.closest('[data-brand],[data-cat],[data-add],[data-view],[data-inc],[data-dec],[data-remove],[data-checkout],[data-back],[data-closecart],[data-jump]');
  if (!el) return;
  const d = el.dataset;
  if (d.brand) {
    state.brand = state.brand === d.brand ? 'All brands' : d.brand;
    state.category = 'All'; renderBrands(); renderCategories(); renderProducts();
    document.getElementById('shop').scrollIntoView({ block: 'start' });
  }
  else if (d.cat) { state.category = d.cat; renderCategories(); renderProducts(); }
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
$('#brandSelect').onchange = e => { state.brand = e.target.value; renderBrands(); renderProducts(); };
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

renderBrands();
renderCategories();
renderProducts();
renderCart();
