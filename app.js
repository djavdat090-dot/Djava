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

// Products live in products.js (edit them on admin.html).
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const PRODUCTS = (window.PRODUCTS || []).map(p => ({
  ...p,
  id: +p.id, price: +p.price, was: p.was ? +p.was : undefined, rating: +p.rating || 0, reviews: +p.reviews || 0,
  brand: esc(p.brand), name: esc(p.name), image: p.image ? esc(p.image) : '',
  category: ICONS[p.category] ? p.category : 'Accessories',
  specs: (p.specs || []).map(esc),
}));

const CATEGORIES = ['All', ...Object.keys(ICONS)];
const FEATURED_BRANDS = ['Apple', 'ASUS', 'Samsung', 'Dell', 'Lenovo', 'HP', 'Microsoft', 'Google', 'Sony', 'NVIDIA', 'AMD', 'Logitech']
  .filter(b => PRODUCTS.some(p => p.brand === b));
// Product photo if one is set, otherwise the category icon
const media = p => p.image
  ? `<img src="${p.image}" alt="" loading="lazy" onerror="this.replaceWith(document.createRange().createContextualFragment(ICONS['${p.category}']))">`
  : ICONS[p.category];
const BRANDS = ['All brands', ...[...new Set(PRODUCTS.map(p => p.brand))].sort()];
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const $ = s => document.querySelector(s);

// ---------- State ----------
const state = { category: 'All', brand: 'All brands', query: '', sort: 'featured' };
let cart = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('djava-cart')) || {};
    // drop products that were removed from the catalog
    return Object.fromEntries(Object.entries(saved).filter(([id, q]) => PRODUCTS.some(p => p.id == id) && q > 0));
  } catch { return {}; }
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
      <button class="card-media" style="background:${p.image ? 'var(--photo-bg)' : GRADIENTS[p.category]}" data-view="${p.id}" aria-label="View ${p.brand} ${p.name}">
        <span class="brand-tag">${p.brand}</span>
        ${p.was ? `<span class="badge">-${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}
        ${media(p)}
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
      <div class="modal-media" style="background:${p.image ? 'var(--photo-bg)' : GRADIENTS[p.category]}">${media(p)}</div>
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
      <div class="line-thumb" style="background:${p.image ? 'var(--photo-bg)' : GRADIENTS[p.category]}">${media(p)}</div>
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
  const t = $('#toast'); t.innerHTML = msg; t.classList.add('show');
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
