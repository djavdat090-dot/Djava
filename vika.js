// "Вика" mode: every word on the page becomes "Вика" (numbers and prices stay).
// A button in the corner turns it on and off; the choice is remembered in this browser.
// To turn it off for everyone by default, set VIKA_DEFAULT to false.
(() => {
  const VIKA_DEFAULT = true;
  const KEY = 'djava-vika';
  const WORD = /\p{L}+(?:['’-]\p{L}+)*/gu;
  const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
  const SKIP = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA']);

  let on = VIKA_DEFAULT;
  try { const saved = localStorage.getItem(KEY); if (saved !== null) on = saved === '1'; } catch {}

  // Keep the case of the original word: "iPhone" → "Вика", "and" → "вика", "USB" → "ВИКА"
  const vika = w => (w.length > 1 && w === w.toUpperCase() && w !== w.toLowerCase()) ? 'ВИКА'
    : (w[0] === w[0].toLowerCase() && w[0] !== w[0].toUpperCase()) ? 'вика' : 'Вика';
  const convert = s => s.replace(WORD, vika);

  const skipped = el => !el || el.closest('[data-no-vika]') || SKIP.has(el.nodeName);

  function fixText(node) {
    if (skipped(node.parentElement)) return;
    const next = convert(node.nodeValue);
    if (next !== node.nodeValue) node.nodeValue = next;
  }
  function fixAttrs(el) {
    if (skipped(el)) return;
    for (const a of ATTRS) {
      const v = el.getAttribute(a);
      if (v) { const next = convert(v); if (next !== v) el.setAttribute(a, next); }
    }
  }
  function fixTree(root) {
    if (root.nodeType === Node.TEXT_NODE) return fixText(root);
    if (root.nodeType !== Node.ELEMENT_NODE || skipped(root)) return;
    fixAttrs(root);
    root.querySelectorAll('[placeholder],[aria-label],[title],[alt]').forEach(fixAttrs);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let n = walker.nextNode(); n; n = walker.nextNode()) fixText(n);
  }

  function addToggle() {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'vika-toggle';
    btn.setAttribute('data-no-vika', '');
    btn.textContent = on ? 'Режим «Вика»: вкл' : 'Режим «Вика»: выкл';
    btn.setAttribute('aria-pressed', on);
    btn.onclick = () => {
      try { localStorage.setItem(KEY, on ? '0' : '1'); } catch {}
      location.reload();
    };
    document.body.appendChild(btn);
  }

  function start() {
    addToggle();
    if (!on) return;
    document.title = convert(document.title);
    fixTree(document.body);
    // The store redraws products, the cart and messages all the time, so convert new text as it appears
    new MutationObserver(list => {
      for (const m of list) {
        if (m.type === 'characterData') fixText(m.target);
        else if (m.type === 'attributes') fixAttrs(m.target);
        else m.addedNodes.forEach(fixTree);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
