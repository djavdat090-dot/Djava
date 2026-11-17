// Djava Tech admin: add, edit and delete products, then publish products.js to GitHub.
const CATEGORIES = ['Laptops', 'Desktops', 'Monitors', 'Components', 'Phones', 'Audio', 'Gaming', 'Accessories'];
const DRAFT_KEY = 'djava-admin-draft';
const CONN_KEY = 'djava-admin-conn';
const FILE_PATH = 'products.js';
const MAX_IMAGE = 2 * 1024 * 1024;

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => (+n).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
const clone = x => JSON.parse(JSON.stringify(x));
const store = {
  get(k, session) { try { return JSON.parse((session ? sessionStorage : localStorage).getItem(k)); } catch { return null; } },
  set(k, v, session) { try { (session ? sessionStorage : localStorage).setItem(k, JSON.stringify(v)); } catch {} },
  del(k) { try { localStorage.removeItem(k); sessionStorage.removeItem(k); } catch {} },
};

// ---------- State ----------
let published = clone(window.PRODUCTS || []);    // what the live store has
let products = clone(published);                  // what you're editing
let sha = null;                                   // GitHub file version, needed to publish
let conn = null;                                  // { owner, repo, branch, token }
let editingId = null;
let previewOverride = '';                         // local preview of a just-uploaded photo

const draft = store.get(DRAFT_KEY);
if (draft && Array.isArray(draft.products)) { products = draft.products; published = draft.published || published; }

// ---------- GitHub ----------
function utf8ToB64(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
const b64ToUtf8 = b64 => new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), c => c.charCodeAt(0)));

async function gh(path, opts = {}) {
  const url = `https://api.github.com/repos/${encodeURIComponent(conn.owner)}/${encodeURIComponent(conn.repo)}/contents/${path}`;
  const res = await fetch(url + (opts.method ? '' : `?ref=${encodeURIComponent(conn.branch)}`), {
    cache: 'no-store',
    ...opts,
    headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${conn.token}`, 'X-GitHub-Api-Version': '2022-11-28' },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = {
      401: 'The token is invalid or expired.',
      403: 'The token does not have permission. It needs “Contents: Read and write” on this repository.',
      404: 'Repository, branch or file not found. Check the owner, repository and branch names.',
      409: 'The store was changed somewhere else. Reconnect to load the latest products, then try again.',
    }[res.status] || data.message || `GitHub error ${res.status}`;
    throw Object.assign(new Error(msg), { status: res.status });
  }
  return data;
}

function parseProducts(text) {
  const json = text.replace(/^[\s\S]*?window\.PRODUCTS\s*=\s*/, '').replace(/;\s*$/, '');
  const list = JSON.parse(json);
  if (!Array.isArray(list)) throw new Error('products.js does not contain a product list.');
  return list;
}
const serialize = list => '// Product catalog. Edited from admin.html — or by hand.\nwindow.PRODUCTS = ' + JSON.stringify(list, null, 2) + ';\n';

async function connect(c, remember) {
  conn = c;
  setStatus('Connecting…');
  try {
    const file = await gh(FILE_PATH);
    const remote = parseProducts(b64ToUtf8(file.content));
    sha = file.sha;
    const hadChanges = changes().total > 0;
    published = remote;
    if (!hadChanges) products = clone(remote);
    store.set(CONN_KEY, { owner: c.owner, repo: c.repo, branch: c.branch, token: c.token }, !remember);
    if (remember) sessionStorage.removeItem(CONN_KEY); else localStorage.removeItem(CONN_KEY);
    setStatus('Connected', true);
    toast(hadChanges ? 'Connected. Your unpublished changes were kept.' : `Connected — loaded ${remote.length} products`);
    saveDraft(); renderAll();
  } catch (e) {
    conn = null; sha = null;
    setStatus('Not connected');
    toast(e.message, true);
  }
}

async function publish() {
  if (!changes().total) return toast('Nothing to publish.');
  if (!conn) {
    toast('Connect to GitHub first — or use “Download products.js”.', true);
    $('#connectPanel').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  const btn = $('#publish'); btn.disabled = true; btn.textContent = 'Publishing…';
  try {
    const c = changes();
    const res = await gh(FILE_PATH, {
      method: 'PUT',
      body: JSON.stringify({
        message: `Update products from admin (${[c.added && `${c.added} added`, c.edited && `${c.edited} edited`, c.removed && `${c.removed} removed`].filter(Boolean).join(', ')})`,
        content: utf8ToB64(serialize(products)),
        sha,
        branch: conn.branch,
      }),
    });
    sha = res.content.sha;
    published = clone(products);
    store.del(DRAFT_KEY);
    toast('Published! The live store updates in about 1–2 minutes.');
    renderAll();
  } catch (e) {
    toast(e.message, true);
  } finally {
    btn.disabled = false; btn.textContent = 'Publish to store';
  }
}

async function uploadImage(file) {
  if (!conn) return toast('Connect to GitHub to upload photos, or paste a photo URL.', true);
  if (!/^image\/(png|jpeg|webp)$/.test(file.type)) return toast('Use a PNG, JPG or WebP image.', true);
  if (file.size > MAX_IMAGE) return toast('That photo is over 2 MB. Please use a smaller one.', true);
  const dataUrl = await new Promise((ok, fail) => { const r = new FileReader(); r.onload = () => ok(r.result); r.onerror = fail; r.readAsDataURL(file); });
  const ext = { 'image/png': 'png', 'image/jpeg': 'jpg', 'image/webp': 'webp' }[file.type];
  const base = (file.name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'photo').slice(0, 40);
  const path = `images/${Date.now()}-${base}.${ext}`;
  $('#uploadHint').textContent = 'Uploading…';
  try {
    await gh(path, { method: 'PUT', body: JSON.stringify({ message: `Add product photo ${path}`, content: dataUrl.split(',')[1], branch: conn.branch }) });
    $('#productForm').image.value = path;
    previewOverride = dataUrl;
    renderPreview();
    $('#uploadHint').textContent = 'Photo uploaded. Save the product, then publish.';
  } catch (e) {
    $('#uploadHint').textContent = 'Upload failed.';
    toast(e.message, true);
  }
}

// ---------- Changes ----------
function changes() {
  const before = new Map(published.map(p => [p.id, JSON.stringify(p)]));
  const after = new Map(products.map(p => [p.id, JSON.stringify(p)]));
  let added = 0, edited = 0, removed = 0;
  for (const [id, v] of after) if (!before.has(id)) added++; else if (before.get(id) !== v) edited++;
  for (const id of before.keys()) if (!after.has(id)) removed++;
  return { added, edited, removed, total: added + edited + removed };
}
function saveDraft() {
  if (changes().total) store.set(DRAFT_KEY, { products, published }); else store.del(DRAFT_KEY);
}

// ---------- Form ----------
const form = $('#productForm');
form.category.innerHTML = CATEGORIES.map(c => `<option>${c}</option>`).join('');

function readForm() {
  const f = form;
  const num = v => (v === '' ? undefined : +v);
  const p = {
    id: editingId ?? Math.max(0, ...products.map(x => +x.id || 0)) + 1,
    brand: f.brand.value.trim(),
    name: f.name.value.trim(),
    category: f.category.value,
    price: num(f.price.value),
  };
  const was = num(f.was.value);
  if (was && was > p.price) p.was = was;
  p.rating = Math.min(5, Math.max(0, num(f.rating.value) ?? 0));
  p.reviews = Math.max(0, Math.round(num(f.reviews.value) ?? 0));
  p.specs = f.specs.value.split('\n').map(s => s.trim()).filter(Boolean);
  const image = f.image.value.trim();
  if (image) p.image = image;

  const errors = [];
  const colors = [];
  for (const line of f.colors.value.split('\n').map(l => l.trim()).filter(Boolean)) {
    const [name, hex, img] = line.split(',').map(x => x.trim());
    if (!name || !/^#[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex || '')) { errors.push(`a color like “Black, #000000” (check “${line}”)`); continue; }
    colors.push(img ? { name, hex, image: img } : { name, hex });
  }
  if (colors.length) {
    p.colors = colors;
    if (!p.image && colors[0].image) p.image = colors[0].image;
  }
  if (!p.brand) errors.push('brand');
  if (!p.name) errors.push('product name');
  if (!(p.price > 0)) errors.push('a price above 0');
  if (image && !/^(https:\/\/|images\/)/.test(image)) errors.push('a photo URL starting with https:// (or an uploaded photo)');
  return { p, errors };
}

function fillForm(p) {
  form.brand.value = p?.brand ?? '';
  form.name.value = p?.name ?? '';
  form.category.value = p?.category ?? CATEGORIES[0];
  form.price.value = p?.price ?? '';
  form.was.value = p?.was ?? '';
  form.rating.value = p?.rating ?? '';
  form.reviews.value = p?.reviews ?? '';
  form.specs.value = (p?.specs ?? []).join('\n');
  form.colors.value = (p?.colors ?? []).map(c => [c.name, c.hex, c.image].filter(Boolean).join(', ')).join('\n');
  form.image.value = p?.image ?? '';
  $('#imageFile').value = '';
  previewOverride = '';
  $('#formError').textContent = '';
  renderPreview();
}

function startEdit(id) {
  const p = products.find(x => x.id === id);
  if (!p) return;
  editingId = id;
  fillForm(p);
  $('#formTitle').textContent = `Edit: ${p.brand} ${p.name}`;
  $('#saveBtn').textContent = 'Save changes';
  $('#cancelEdit').hidden = false;
  form.scrollIntoView({ behavior: 'smooth', block: 'center' });
  form.brand.focus({ preventScroll: true });
}

function stopEdit() {
  editingId = null;
  fillForm(null);
  $('#formTitle').textContent = 'Add a product';
  $('#saveBtn').textContent = 'Add product';
  $('#cancelEdit').hidden = true;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const { p, errors } = readForm();
  if (errors.length) { $('#formError').textContent = 'Please add ' + errors.join(', ') + '.'; return; }
  const wasEditing = editingId !== null;
  if (wasEditing) products = products.map(x => (x.id === p.id ? p : x));
  else products = [p, ...products];
  toast(wasEditing ? `Saved ${p.brand} ${p.name}` : `Added ${p.brand} ${p.name}. Publish to put it in the store.`);
  stopEdit();
  saveDraft(); renderAll();
});
$('#cancelEdit').onclick = stopEdit;
form.image.addEventListener('input', () => { previewOverride = ''; renderPreview(); });
$('#imageFile').addEventListener('change', e => e.target.files[0] && uploadImage(e.target.files[0]));

// ---------- Rendering ----------
function thumb(p, src) {
  const url = src || p.image;
  return url ? `<img src="${esc(url)}" alt="" loading="lazy">` : `<span>${esc(p.category?.[0] ?? '?')}</span>`;
}

function renderPreview() {
  const url = previewOverride || form.image.value.trim();
  $('#imagePreview').innerHTML = url && /^(https:\/\/|images\/|data:image\/)/.test(url)
    ? `<img src="${esc(url)}" alt="Photo preview">` : '<span>No photo</span>';
}

function renderTable() {
  const q = $('#filter').value.trim().toLowerCase();
  const before = new Map(published.map(p => [p.id, JSON.stringify(p)]));
  const list = products.filter(p => !q || `${p.brand} ${p.name} ${p.category}`.toLowerCase().includes(q));
  $('#productTotal').textContent = `(${products.length})`;
  $('#productTable').innerHTML = list.length ? list.map(p => {
    const tag = !before.has(p.id) ? '<span class="tag new">New</span>' : before.get(p.id) !== JSON.stringify(p) ? '<span class="tag edited">Edited</span>' : '';
    return `<div class="prow">
      <div class="pthumb">${thumb(p)}</div>
      <div class="pinfo">
        <div class="pname">${esc(p.brand)} ${esc(p.name)} ${tag}</div>
        <div class="muted">${esc(p.category)} · ${money(p.price)}${p.was ? ` <s>${money(p.was)}</s>` : ''}${(p.colors || []).length
          ? ` · <span class="mini-swatches">${p.colors.map(c => `<i style="background:${/^#[0-9a-f]{3,8}$/i.test(c.hex) ? c.hex : '#ccc'}" title="${esc(c.name)}"></i>`).join('')}</span>` : ''}</div>
      </div>
      <div class="pactions">
        <button class="btn btn-ghost btn-sm" data-edit="${p.id}">Edit</button>
        <button class="btn btn-ghost btn-sm danger" data-del="${p.id}">Delete</button>
      </div>
    </div>`;
  }).join('') : '<p class="muted empty-row">No products found.</p>';
  $('#brandList').innerHTML = [...new Set(products.map(p => p.brand))].sort().map(b => `<option value="${esc(b)}">`).join('');
}

function renderBar() {
  const c = changes();
  const parts = [c.added && `${c.added} added`, c.edited && `${c.edited} edited`, c.removed && `${c.removed} deleted`].filter(Boolean);
  $('#changeCount').textContent = c.total ? `Unpublished changes: ${parts.join(', ')}` : 'No unpublished changes';
  $('#publishBar').classList.toggle('dirty', c.total > 0);
  $('#publish').disabled = $('#discard').disabled = !c.total;
  $('#publishNote').textContent = c.total
    ? (conn ? 'Publish to update the live store.' : 'Connect to GitHub to publish, or download the file.')
    : 'Changes are kept in this browser until you publish.';
}

function renderAll() { renderTable(); renderBar(); }

$('#productTable').addEventListener('click', e => {
  const edit = e.target.closest('[data-edit]');
  const del = e.target.closest('[data-del]');
  if (edit) startEdit(+edit.dataset.edit);
  if (del) {
    const p = products.find(x => x.id === +del.dataset.del);
    if (p && confirm(`Delete ${p.brand} ${p.name}?`)) {
      products = products.filter(x => x !== p);
      if (editingId === p.id) stopEdit();
      saveDraft(); renderAll();
      toast(`Deleted ${p.brand} ${p.name}`);
    }
  }
});
$('#filter').addEventListener('input', renderTable);

// ---------- Publish bar ----------
$('#publish').onclick = publish;
$('#discard').onclick = () => {
  if (!confirm('Discard all unpublished changes?')) return;
  products = clone(published); store.del(DRAFT_KEY); stopEdit(); renderAll(); toast('Changes discarded');
};
$('#download').onclick = () => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([serialize(products)], { type: 'text/javascript' }));
  a.download = 'products.js';
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

// ---------- Connection ----------
function setStatus(text, ok) {
  $('#status').textContent = text;
  $('#status').classList.toggle('ok', !!ok);
  $('#disconnect').hidden = !ok;
  $('#uploadLabel').classList.toggle('disabled', !ok);
}

const cf = $('#connectForm');
(function prefill() {
  const saved = store.get(CONN_KEY) || store.get(CONN_KEY, true);
  const host = location.hostname.match(/^([^.]+)\.github\.io$/);
  cf.owner.value = saved?.owner || (host ? host[1] : 'djavdat090-dot');
  cf.repo.value = saved?.repo || (host && location.pathname.split('/')[1]) || 'Djava';
  cf.branch.value = saved?.branch || 'claude/bold-ritchie-ci0v9r';
  if (saved?.token) {
    cf.token.value = saved.token;
    cf.remember.checked = !!store.get(CONN_KEY);
    connect(saved, cf.remember.checked);
  }
})();

cf.addEventListener('submit', e => {
  e.preventDefault();
  connect({ owner: cf.owner.value.trim(), repo: cf.repo.value.trim(), branch: cf.branch.value.trim(), token: cf.token.value.trim() }, cf.remember.checked);
});
$('#disconnect').onclick = () => {
  conn = null; sha = null; store.del(CONN_KEY); cf.token.value = ''; setStatus('Not connected'); renderBar(); toast('Disconnected');
};

// ---------- Toast ----------
let toastTimer;
function toast(msg, isError) {
  const t = $('#toast');
  t.textContent = msg;
  t.classList.toggle('error', !!isError);
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), isError ? 5000 : 3000);
}

renderPreview();
renderAll();
