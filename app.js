// ---------- Data ----------
const ICONS = {
  Laptops: '<svg viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="11" rx="1.5"/><path d="M2 19h20"/></svg>',
  Desktops: '<svg viewBox="0 0 24 24"><rect x="7" y="3" width="10" height="18" rx="1.5"/><circle cx="12" cy="16" r="2"/><path d="M10 7h4M10 10h4"/></svg>',
  Monitors: '<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></svg>',
  Components: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="1"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v4M15 2v4M9 18v4M15 18v4M2 9h4M2 15h4M18 9h4M18 15h4"/></svg>',
  Phones: '<svg viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  Tablets: '<svg viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 18h2"/></svg>',
  Wearables: '<svg viewBox="0 0 24 24"><rect x="6" y="6" width="12" height="12" rx="3"/><path d="M9 6V2h6v4M9 18v4h6v-4"/></svg>',
  Audio: '<svg viewBox="0 0 24 24"><path d="M4 15v-3a8 8 0 0 1 16 0v3"/><rect x="3" y="14" width="4" height="7" rx="1.5"/><rect x="17" y="14" width="4" height="7" rx="1.5"/></svg>',
  Gaming: '<svg viewBox="0 0 24 24"><path d="M6 8h12a4 4 0 0 1 4 4v3a3 3 0 0 1-5.4 1.8L15 15H9l-1.6 1.8A3 3 0 0 1 2 15v-3a4 4 0 0 1 4-4z"/><path d="M7 11v3M5.5 12.5h3"/></svg>',
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
  // optional colour options: [{ name, hex, image }]
  colors: (Array.isArray(p.colors) ? p.colors : []).filter(c => c && c.name).map(c => ({
    name: esc(c.name),
    hex: /^#[0-9a-f]{3,8}$/i.test(c.hex) ? c.hex : '#cbd5e1',
    image: c.image ? esc(c.image) : '',
  })),
}));

const CATEGORIES = ['All', ...Object.keys(ICONS)];
const FEATURED_BRANDS = ['Apple', 'Samsung', 'Xiaomi', 'vivo', 'Lenovo', 'ASUS', 'Sony', 'Microsoft', 'Nintendo', 'Valve', 'Google', 'Dell', 'HP', 'NVIDIA', 'AMD', 'Logitech']
  .filter(b => PRODUCTS.some(p => p.brand === b));
// Product photo if one is set, otherwise a picture for the category
const CATEGORY_IMAGES = {
  Laptops: 'images/laptop.svg', Desktops: 'images/desktop.svg', Monitors: 'images/monitor.svg', Components: 'images/component.svg',
  Phones: 'images/phone.svg', Tablets: 'images/tablet.svg', Wearables: 'images/wearable.svg', Audio: 'images/audio.svg', Gaming: 'images/gaming.svg', Accessories: 'images/accessory.svg',
};
// Picture for a product in a given colour (falls back to the product photo, then the category picture)
const imageFor = (p, ci = 0) => p.colors[ci]?.image || p.image || CATEGORY_IMAGES[p.category];
const media = (p, ci = 0) => `<img src="${imageFor(p, ci)}" alt="${p.brand} ${p.name}" loading="lazy" onerror="this.onerror=null;this.src='${CATEGORY_IMAGES[p.category]}'">`;
const swatches = (p, ci, attr) => p.colors.map((c, i) =>
  `<button type="button" class="swatch${i === ci ? ' on' : ''}" style="--c:${c.hex}" ${attr}="${p.id}:${i}" title="${c.name}" aria-label="${c.name}" aria-pressed="${i === ci}"></button>`).join('');

// Cart lines are keyed "id" or "id:colourIndex"
const keyFor = (p, ci) => (p.colors.length ? `${p.id}:${ci}` : `${p.id}`);
function lineOf(key) {
  const [id, ci = '0'] = String(key).split(':');
  const p = PRODUCTS.find(x => x.id == id);
  if (!p || (p.colors.length && !p.colors[+ci])) return null;
  return { p, ci: +ci, color: p.colors[+ci] };
}
const cardColor = {}; // colour picked on each product card

// ---------- Shipping ----------
// Edit prices, delivery times and zones here. Countries not listed in a zone use "Rest of world".
// Add country codes to `blocked` to stop shipping there.
const SHIPPING = {
  zones: [
    { name: 'United States', countries: ['US'], price: 9.99, freeOver: 99, days: '2–5', tax: 0.08 },
    { name: 'Canada & Mexico', countries: ['CA', 'MX'], price: 19.99, freeOver: 499, days: '4–8' },
    { name: 'Europe', countries: 'AD AL AT BA BE BG CH CY CZ DE DK EE ES FI FR GB GR HR HU IE IS IT LI LT LU LV MC MD ME MK MT NL NO PL PT RO RS SE SI SK SM UA VA XK'.split(' '), price: 24.99, freeOver: 999, days: '5–10' },
    { name: 'Rest of world', countries: [], price: 39.99, freeOver: null, days: '7–14' },
  ],
  blocked: [],
};
const COUNTRY_CODES = ('AD AE AF AG AI AL AM AO AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GT GU GW GY HK HN HR HT HU ID IE IL IM IN IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW')
  .split(' ').filter(c => !SHIPPING.blocked.includes(c));
const regionNames = (() => { try { return new Intl.DisplayNames(['en'], { type: 'region' }); } catch { return null; } })();
const countryName = code => (code === 'XK' ? 'Kosovo' : regionNames?.of(code)) || code;
const COUNTRIES = COUNTRY_CODES.map(code => ({ code, name: countryName(code) })).sort((a, b) => a.name.localeCompare(b.name));
const zoneFor = code => SHIPPING.zones.find(z => z.countries.includes(code)) || SHIPPING.zones[SHIPPING.zones.length - 1];
const countryOptions = selected => COUNTRIES.map(c => `<option value="${c.code}"${c.code === selected ? ' selected' : ''}>${esc(c.name)}</option>`).join('');

function initialCountry() {
  try { const saved = localStorage.getItem('djava-country'); if (COUNTRY_CODES.includes(saved)) return saved; } catch {}
  for (const lang of navigator.languages || [navigator.language]) {
    const region = (lang || '').split('-')[1]?.toUpperCase();
    if (COUNTRY_CODES.includes(region)) return region;
  }
  return 'US';
}
let country = initialCountry();
function setCountry(code) {
  if (!COUNTRY_CODES.includes(code)) return;
  country = code;
  try { localStorage.setItem('djava-country', code); } catch {}
}
const BRANDS = ['All brands', ...[...new Set(PRODUCTS.map(p => p.brand))].sort()];
const money = n => n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const $ = s => document.querySelector(s);

// ---------- State ----------
const PAGE = 24; // products shown before "Show more"
const state = { category: 'All', brand: 'All brands', query: '', sort: 'featured', limit: PAGE };
let cart = load();

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem('djava-cart')) || {};
    // drop products that were removed from the catalog
    return Object.fromEntries(Object.entries(saved).filter(([key, q]) => lineOf(key) && q > 0));
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
    (!q || [p.brand, p.name, p.category, ...p.specs, ...p.colors.map(c => c.name)].join(' ').toLowerCase().includes(q)));
  const sorters = {
    'price-asc': (a, b) => a.price - b.price,
    'price-desc': (a, b) => b.price - a.price,
    rating: (a, b) => b.rating - a.rating,
  };
  if (sorters[state.sort]) list = [...list].sort(sorters[state.sort]);
  return list;
}

function renderProducts(keepLimit) {
  if (!keepLimit) state.limit = PAGE;
  const all = filtered();
  const list = all.slice(0, state.limit);
  $('#resultCount').textContent = `${all.length} product${all.length === 1 ? '' : 's'}`;
  const rest = all.length - list.length;
  $('#more').innerHTML = rest > 0 ? `<button class="btn btn-ghost" data-more>Show more (${rest} more)</button>` : '';
  $('#products').innerHTML = list.length ? list.map(p => {
    const ci = cardColor[p.id] || 0;
    return `
    <article class="card" data-card="${p.id}">
      <button class="card-media" style="background:var(--photo-bg)" data-view="${p.id}" aria-label="View ${p.brand} ${p.name}">
        <span class="brand-tag">${p.brand}</span>
        ${p.was ? `<span class="badge">-${Math.round((1 - p.price / p.was) * 100)}%</span>` : ''}
        ${p.colors.length > 1 ? `<span class="colors-pill"><i style="background:conic-gradient(${p.colors.map((c, i, a) => `${c.hex} ${i / a.length * 360}deg ${(i + 1) / a.length * 360}deg`).join(',')})"></i>${p.colors.length} colors</span>` : ''}
        ${media(p, ci)}
      </button>
      <div class="card-body">
        <span class="card-cat">${p.brand} · ${p.category}</span>
        <h3 class="card-title">${p.brand} ${p.name}</h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating} (${p.reviews})</span></div>
        ${p.colors.length ? `<div class="swatch-row"><div class="swatches">${swatches(p, ci, 'data-swatch')}</div><span class="swatch-name">${p.colors[ci].name}</span></div>` : ''}
        <div class="price"><strong>${money(p.price)}</strong>${p.was ? `<s>${money(p.was)}</s>` : ''}</div>
        <button class="btn btn-primary" data-add="${p.id}">Add to cart</button>
      </div>
    </article>`;
  }).join('')
    : `<p class="empty">No products match your filters. Try another search, brand or category.</p>`;
}

// Change the colour shown on a product card without redrawing the grid
function pickCardColor(id, ci) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p?.colors[ci]) return;
  cardColor[id] = ci;
  const card = document.querySelector(`[data-card="${id}"]`);
  if (!card) return;
  card.querySelector('.card-media img').src = imageFor(p, ci);
  card.querySelectorAll('.swatch').forEach((s, i) => { s.classList.toggle('on', i === ci); s.setAttribute('aria-pressed', i === ci); });
  card.querySelector('.swatch-name').innerHTML = p.colors[ci].name;
}

function openProduct(id) {
  const p = PRODUCTS.find(x => x.id === id);
  let qty = 1;
  let ci = cardColor[id] || 0;
  const modal = $('#productModal');
  modal.innerHTML = `
    <div class="modal-grid">
      <div class="modal-media" style="background:var(--photo-bg)">${media(p, ci)}</div>
      <div class="modal-body">
        <button class="icon-btn" data-close aria-label="Close">✕</button>
        <span class="card-cat">${p.brand} · ${p.category}</span>
        <h3>${p.brand} ${p.name}</h3>
        <div class="rating">${stars(p.rating)} <span>${p.rating} · ${p.reviews} reviews</span></div>
        <div class="price"><strong>${money(p.price)}</strong>${p.was ? `<s>${money(p.was)}</s>` : ''}</div>
        ${p.colors.length ? `<div class="color-pick">
          <div class="color-label">Color: <b id="mcolor">${p.colors[ci].name}</b></div>
          <div class="swatches big">${swatches(p, ci, 'data-mcolor')}</div>
        </div>` : ''}
        <ul class="specs">${p.specs.map(s => `<li>${s}</li>`).join('')}</ul>
        <div class="qty"><button data-q="-1" aria-label="Decrease">−</button><span id="mq">1</span><button data-q="1" aria-label="Increase">+</button></div>
        <button class="btn btn-primary btn-block" data-madd>Add to cart</button>
      </div>
    </div>`;
  modal.onclick = e => {
    if (e.target === modal || e.target.closest('[data-close]')) modal.close();
    const q = e.target.closest('[data-q]');
    if (q) { qty = Math.max(1, Math.min(10, qty + +q.dataset.q)); $('#mq').textContent = qty; }
    const sw = e.target.closest('[data-mcolor]');
    if (sw) {
      ci = +sw.dataset.mcolor.split(':')[1];
      modal.querySelector('.modal-media img').src = imageFor(p, ci);
      modal.querySelectorAll('.swatch').forEach((s, i) => { s.classList.toggle('on', i === ci); s.setAttribute('aria-pressed', i === ci); });
      $('#mcolor').innerHTML = p.colors[ci].name;
      pickCardColor(p.id, ci);
    }
    if (e.target.closest('[data-madd]')) { addToCart(p.id, qty, ci); modal.close(); }
  };
  modal.showModal();
}

// ---------- Cart ----------
function addToCart(id, qty = 1, ci = 0) {
  const p = PRODUCTS.find(x => x.id === id);
  const key = keyFor(p, ci);
  cart[key] = Math.min(10, (cart[key] || 0) + qty);
  save(); renderCart();
  toast(`Added ${p.brand} ${p.name}${p.colors[ci] ? ` (${p.colors[ci].name})` : ''} to cart`);
  const c = $('#cartCount'); c.classList.remove('bump'); void c.offsetWidth; c.classList.add('bump');
}

function totals() {
  const subtotal = Object.entries(cart).reduce((s, [key, q]) => s + lineOf(key).p.price * q, 0);
  const zone = zoneFor(country);
  const shipping = subtotal === 0 || (zone.freeOver != null && subtotal >= zone.freeOver) ? 0 : zone.price;
  const tax = subtotal * (zone.tax || 0);
  return { subtotal, shipping, tax, total: subtotal + shipping + tax, zone };
}

// Price rows shared by the cart and checkout
function summaryRows(t) {
  const free = t.zone.freeOver != null && t.shipping > 0
    ? `<div class="ship-note">Add ${money(t.zone.freeOver - t.subtotal)} more for free shipping to ${esc(countryName(country))}</div>` : '';
  return `
    <div class="row"><span>Subtotal</span><span>${money(t.subtotal)}</span></div>
    <div class="row"><span>Shipping <small>(${t.zone.days} business days)</small></span><span>${t.shipping ? money(t.shipping) : 'Free'}</span></div>
    ${free}
    ${t.zone.tax ? `<div class="row"><span>Sales tax (${Math.round(t.zone.tax * 100)}%)</span><span>${money(t.tax)}</span></div>`
      : '<div class="ship-note">Import duties and taxes may be charged on delivery.</div>'}
    <div class="row total"><span>Total</span><span>${money(t.total)}</span></div>`;
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
    const { p, ci, color } = lineOf(id);
    return `<div class="line">
      <div class="line-thumb" style="background:var(--photo-bg)">${media(p, ci)}</div>
      <div>
        <div class="line-title">${p.brand} ${p.name}</div>
        ${color ? `<div class="line-color"><span class="dot" style="--c:${color.hex}"></span>${color.name}</div>` : ''}
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
    <label class="ship-to"><span>Ship to</span><select id="cartCountry" autocomplete="country">${countryOptions(country)}</select></label>
    ${summaryRows(t)}
    <button class="btn btn-primary btn-block" data-checkout>Checkout</button>`;
  $('#cartCountry').onchange = e => { setCountry(e.target.value); renderCart(); };
}

function renderCheckoutFoot() {
  const t = totals();
  const open = $('#cartFoot .summary-details')?.open ? ' open' : '';
  $('#cartFoot').innerHTML = `
    <details class="summary-details"${open}>
      <summary><span>Order total <small>(details)</small></span><strong>${money(t.total)}</strong></summary>
      <div class="summary-body">${summaryRows(t)}</div>
    </details>
    <button class="btn btn-primary btn-block" type="submit" form="checkoutForm">Place order</button>
    <button class="btn btn-ghost btn-block" data-back>Back to cart</button>`;
}

function updateAddressLabels(form) {
  const us = country === 'US';
  form.zip.placeholder = us ? 'ZIP code' : 'Postal code';
  form.region.placeholder = us ? 'State' : 'State / Province / Region' + (['CA', 'AU'].includes(country) ? '' : ' (optional)');
  form.region.required = ['US', 'CA', 'AU'].includes(country);
  $('#deliveryNote').textContent = `Delivery to ${countryName(country)}: ${zoneFor(country).days} business days`;
}

function renderCheckout() {
  $('#cartItems').innerHTML = `
    <form class="form" id="checkoutForm">
      <h3>Shipping details</h3>
      <label class="field-label" for="shipCountry">Country / Region</label>
      <select required name="country" id="shipCountry" autocomplete="country">${countryOptions(country)}</select>
      <p class="ship-note" id="deliveryNote"></p>
      <input required name="name" placeholder="Full name" autocomplete="name">
      <input required type="email" name="email" placeholder="Email" autocomplete="email" inputmode="email">
      <input required type="tel" name="phone" placeholder="Phone (for the courier)" autocomplete="tel" inputmode="tel">
      <input required name="address" placeholder="Street address, apartment" autocomplete="street-address">
      <div class="two"><input required name="city" placeholder="City" autocomplete="address-level2"><input required name="zip" placeholder="Postal code" autocomplete="postal-code"></div>
      <input name="region" placeholder="State / Province / Region" autocomplete="address-level1">
      <h3>Payment</h3>
      <p class="row" style="font-size:.85rem">Demo store — no card is charged and no payment data is stored.</p>
      <input required name="card" placeholder="Card number (demo)" inputmode="numeric" autocomplete="cc-number" pattern="[0-9 ]{12,23}">
      <div class="two"><input required name="exp" placeholder="MM/YY" inputmode="numeric" autocomplete="cc-exp" pattern="(0[1-9]|1[0-2])/[0-9]{2}"><input required name="cvc" placeholder="CVC" inputmode="numeric" autocomplete="cc-csc" pattern="[0-9]{3,4}"></div>
    </form>`;
  const form = $('#checkoutForm');
  renderCheckoutFoot();
  updateAddressLabels(form);
  form.country.onchange = e => { setCountry(e.target.value); updateAddressLabels(form); renderCheckoutFoot(); };
  form.onsubmit = e => {
    e.preventDefault();
    const name = new FormData(e.target).get('name').split(' ')[0];
    const where = `${esc(form.city.value.trim())}, ${esc(countryName(country))}`;
    const days = zoneFor(country).days;
    const order = 'DJ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    cart = {}; save();
    $('#cartCount').textContent = 0;
    $('#cartItems').innerHTML = `<div class="success"><div class="check">✓</div>
      <h3>Thank you, ${esc(name)}!</h3><p>Order <b>${order}</b> is confirmed. A receipt is on its way.</p>
      <p class="ship-note">Shipping to ${where} · arrives in ${days} business days</p></div>`;
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
  const sw = e.target.closest('[data-swatch]');
  if (sw) { const [id, ci] = sw.dataset.swatch.split(':'); pickCardColor(+id, +ci); return; }
  const el = e.target.closest('[data-more],[data-brand],[data-cat],[data-add],[data-view],[data-inc],[data-dec],[data-remove],[data-checkout],[data-back],[data-closecart],[data-jump]');
  if (!el) return;
  const d = el.dataset;
  if (d.brand) {
    state.brand = state.brand === d.brand ? 'All brands' : d.brand;
    state.category = 'All'; renderBrands(); renderCategories(); renderProducts();
    document.getElementById('shop').scrollIntoView({ block: 'start' });
  }
  else if (d.cat) { state.category = d.cat; renderCategories(); renderProducts(); }
  else if (d.jump) { state.category = d.jump; renderCategories(); renderProducts(); }
  else if (d.add) addToCart(+d.add, 1, cardColor[+d.add] || 0);
  else if (d.view) openProduct(+d.view);
  else if (d.inc) { cart[d.inc] = Math.min(10, cart[d.inc] + 1); save(); renderCart(); }
  else if (d.dec) { cart[d.dec]--; if (cart[d.dec] <= 0) delete cart[d.dec]; save(); renderCart(); }
  else if (d.remove) { delete cart[d.remove]; save(); renderCart(); }
  else if ('more' in d) { state.limit += PAGE; renderProducts(true); }
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
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' }).then(r => r.update()).catch(() => {});
}

renderBrands();
renderCategories();
renderProducts();
renderCart();
