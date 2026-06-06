import {
  getUserName, saveUserName,
  getTodayQuote, saveDailyQuote,
  getQuoteHistory,
  getFavorites, saveFavorite, removeFavorite, isFavorite,
  getSettings, saveSettings,
} from './storage.js';
import { fetchDailyQuote, fetchCategoryQuote, getApiKey, saveApiKey } from './api.js';
import { getIllustration } from './illustrations.js';

// ── Font size map ──
const FONT_SIZES = { sm: '18px', md: '22px', lg: '28px' };
const FONT_LABELS = { sm: 'Small', md: 'Medium', lg: 'Large' };

// ── Toast ──
export function showToast(msg) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  document.getElementById('toast-container').appendChild(el);
  setTimeout(() => el.remove(), 2100);
}

// ── Confirm dialog ──
function confirm(title, msg) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog">
        <div class="dialog-title">${title}</div>
        <div class="dialog-msg">${msg}</div>
        <div class="dialog-actions">
          <button class="dialog-cancel">Cancel</button>
          <button class="dialog-confirm">Delete</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    overlay.querySelector('.dialog-cancel').onclick = () => { overlay.remove(); resolve(false); };
    overlay.querySelector('.dialog-confirm').onclick = () => { overlay.remove(); resolve(true); };
  });
}

// ── Greeting ──
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Apply settings on load ──
function applySettings() {
  const s = getSettings();
  if (s.darkMode) document.documentElement.classList.add('dark');
  document.documentElement.style.setProperty('--quote-font-size', FONT_SIZES[s.fontSize] || FONT_SIZES.md);
}

// ── Screen switcher ──
let currentScreen = null;
function showScreen(id) {
  if (currentScreen) currentScreen.classList.remove('active');
  const el = document.getElementById(id);
  el.classList.add('active');
  currentScreen = el;
  // Update nav
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.screen === id);
  });
}

// ── Build persistent bottom nav ──
function buildNav() {
  const nav = document.createElement('nav');
  nav.className = 'bottom-nav';
  nav.innerHTML = `
    <button class="nav-btn" data-screen="screen-home"><span class="nav-icon">🏠</span>Home</button>
    <button class="nav-btn" data-screen="screen-favorites"><span class="nav-icon">❤️</span>Saved</button>
    <button class="nav-btn" data-screen="screen-history"><span class="nav-icon">🕐</span>History</button>
    <button class="nav-btn" data-screen="screen-settings"><span class="nav-icon">⚙️</span>Settings</button>`;
  nav.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'screen-favorites') renderFavorites();
      if (target === 'screen-history') renderHistory();
      if (target === 'screen-settings') renderSettings();
      showScreen(target);
    });
  });
  return nav;
}

// ── Quote card HTML ──
function quoteCardHTML(quote, opts = {}) {
  const fav = isFavorite(quote.id);
  const illus = getIllustration(quote.theme);
  return `
    <div class="quote-card" data-id="${quote.id}">
      <div class="illustration">${illus}</div>
      <span class="quote-mark">"</span>
      <p class="quote-text" title="Tap to copy">${escHtml(quote.text)}</p>
      <p class="quote-source">— ${escHtml(quote.source)} <span class="category-badge">${escHtml(quote.category)}</span></p>
    </div>
    <div class="quote-actions">
      <button class="action-btn fav-btn ${fav ? 'saved' : ''}" data-id="${quote.id}">
        ${fav ? '❤️' : '🤍'} ${fav ? 'Saved' : 'Save'}
      </button>
      <button class="action-btn share-btn">📤 Share</button>
      <button class="action-btn copy-btn">📋 Copy</button>
    </div>`;
}

function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function wireQuoteActions(container, quote) {
  container.querySelector('.quote-text')?.addEventListener('click', () => copyText(quote.text));
  container.querySelector('.copy-btn')?.addEventListener('click', () => copyText(quote.text));
  container.querySelector('.share-btn')?.addEventListener('click', () => shareQuote(quote));
  container.querySelector('.fav-btn')?.addEventListener('click', (e) => toggleFav(quote, e.currentTarget));
}

function copyText(text) {
  navigator.clipboard.writeText(text).then(() => showToast('Copied!'));
}

async function shareQuote(quote) {
  const shareData = { title: 'Daily Grace', text: `"${quote.text}" — ${quote.source}` };
  if (navigator.share) {
    try { await navigator.share(shareData); } catch {}
  } else {
    navigator.clipboard.writeText(shareData.text).then(() => showToast('Copied to clipboard!'));
  }
}

function toggleFav(quote, btn) {
  if (isFavorite(quote.id)) {
    removeFavorite(quote.id);
    btn.className = 'action-btn fav-btn';
    btn.innerHTML = '🤍 Save';
    showToast('Removed from favorites');
  } else {
    saveFavorite(quote);
    btn.className = 'action-btn fav-btn saved';
    btn.innerHTML = '❤️ Saved';
    showToast('Saved to favorites ❤️');
  }
}

// ══════════════════════════════
// SCREEN 1 — ONBOARDING
// ══════════════════════════════
function buildOnboarding() {
  const el = document.createElement('div');
  el.id = 'screen-onboarding';
  el.className = 'screen';
  el.innerHTML = `
    <div class="onboarding-logo">✦</div>
    <h1 class="onboarding-title">Daily Grace</h1>
    <p class="onboarding-tagline">Quotes for the soul</p>
    <form class="onboarding-form" id="onboarding-form">
      <label class="onboarding-label" for="name-input">What should we call you?</label>
      <input class="onboarding-input" id="name-input" type="text" placeholder="Your first name…" autocomplete="given-name" maxlength="40">
      <p class="onboarding-helper">We'll use this to greet you each day</p>
      <button class="btn-primary" type="submit">Get started ✦</button>
    </form>`;
  el.querySelector('#onboarding-form').addEventListener('submit', e => {
    e.preventDefault();
    const name = el.querySelector('#name-input').value.trim();
    if (!name) return;
    saveUserName(name);
    renderHome();
    showScreen('screen-home');
  });
  return el;
}

// ══════════════════════════════
// SCREEN 2 — HOME
// ══════════════════════════════
function buildHome() {
  const el = document.createElement('div');
  el.id = 'screen-home';
  el.className = 'screen';

  const topBar = document.createElement('div');
  topBar.className = 'top-bar';
  topBar.innerHTML = `
    <div class="greeting" id="home-greeting"></div>
    <div class="font-controls">
      <button class="font-btn" id="font-dec">A−</button>
      <button class="font-btn" id="font-inc">A+</button>
    </div>`;

  const content = document.createElement('div');
  content.className = 'screen-content';
  content.id = 'home-content';

  el.appendChild(topBar);
  el.appendChild(content);
  return el;
}

function renderHome() {
  const name = getUserName();
  const greetingEl = document.getElementById('home-greeting');
  if (greetingEl) greetingEl.innerHTML = `${getGreeting()}, <strong>${escHtml(name)}</strong> ✨`;

  wireFontControls();

  const content = document.getElementById('home-content');
  content.innerHTML = loadingHTML('Finding today\'s quote…');

  const cached = getTodayQuote();
  if (cached) {
    displayHomeQuote(cached);
    return;
  }

  if (!getApiKey()) {
    displayHomeError('no-key');
    return;
  }

  fetchDailyQuote()
    .then(quote => { saveDailyQuote(quote); displayHomeQuote(quote); })
    .catch(err => {
      if (err.message === 'NO_API_KEY') displayHomeError('no-key');
      else displayHomeError('fail');
    });
}

function displayHomeQuote(quote) {
  const content = document.getElementById('home-content');
  content.innerHTML = `
    ${quoteCardHTML(quote)}
    <p class="section-label">Explore by category</p>
    <div class="pills">
      <button class="pill" data-cat="Bible">📖 Bible</button>
      <button class="pill" data-cat="Inspirational">🌟 Inspire</button>
      <button class="pill" data-cat="Motivational">💪 Motivate</button>
      <button class="pill" data-cat="Family and Love">❤️ Family</button>
      <button class="pill" data-cat="Faith and Hope">🙏 Faith</button>
      <button class="pill" data-cat="Encouragement">😊 Cheer</button>
    </div>`;
  wireQuoteActions(content, quote);
  content.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      renderCategory(pill.dataset.cat, pill.textContent.trim());
      showScreen('screen-category');
    });
  });
}

function displayHomeError(type) {
  const content = document.getElementById('home-content');
  if (type === 'no-key') {
    content.innerHTML = `
      <div class="error-card">
        <div class="error-icon">🔑</div>
        <div class="error-title">API Key Required</div>
        <div class="error-msg">Add your Claude API key in Settings to get started</div>
        <button class="btn-secondary" id="go-settings">Go to Settings</button>
      </div>`;
    content.querySelector('#go-settings').onclick = () => {
      renderSettings(); showScreen('screen-settings');
    };
  } else {
    content.innerHTML = `
      <div class="error-card">
        <div class="error-icon">🌧️</div>
        <div class="error-title">Couldn't load a quote</div>
        <div class="error-msg">Tap to try again</div>
        <button class="btn-secondary" id="retry-home">Try again</button>
      </div>`;
    content.querySelector('#retry-home').onclick = renderHome;
  }
}

function loadingHTML(msg) {
  return `<div class="loading-card"><div class="pulse"></div><p class="loading-text">${msg}</p></div>`;
}

function wireFontControls() {
  const sizes = ['sm', 'md', 'lg'];
  const s = getSettings();
  let current = sizes.indexOf(s.fontSize || 'md');
  if (current === -1) current = 1;

  document.getElementById('font-dec')?.addEventListener('click', () => {
    if (current > 0) { current--; applyFontSize(sizes[current]); }
  });
  document.getElementById('font-inc')?.addEventListener('click', () => {
    if (current < sizes.length - 1) { current++; applyFontSize(sizes[current]); }
  });
}

function applyFontSize(size) {
  document.documentElement.style.setProperty('--quote-font-size', FONT_SIZES[size]);
  saveSettings({ fontSize: size });
  // Update settings screen if visible
  const label = document.getElementById('settings-font-label');
  if (label) label.textContent = FONT_LABELS[size];
}

// ══════════════════════════════
// SCREEN 3 — CATEGORY
// ══════════════════════════════
function buildCategory() {
  const el = document.createElement('div');
  el.id = 'screen-category';
  el.className = 'screen';

  const header = document.createElement('div');
  header.className = 'back-header';
  header.innerHTML = `<button class="back-btn" id="cat-back">←</button><h1 id="cat-title">Quotes</h1>`;

  const content = document.createElement('div');
  content.className = 'screen-content';
  content.id = 'cat-content';

  el.appendChild(header);
  el.appendChild(content);
  el.querySelector('#cat-back').addEventListener('click', () => showScreen('screen-home'));
  return el;
}

function renderCategory(category, label) {
  const titleEl = document.getElementById('cat-title');
  if (titleEl) titleEl.textContent = label + ' quotes';

  const content = document.getElementById('cat-content');
  const pills = [
    { cat: 'Bible', label: '📖 Bible' },
    { cat: 'Inspirational', label: '🌟 Inspire' },
    { cat: 'Motivational', label: '💪 Motivate' },
    { cat: 'Family and Love', label: '❤️ Family' },
    { cat: 'Faith and Hope', label: '🙏 Faith' },
    { cat: 'Encouragement', label: '😊 Cheer' },
  ];
  content.innerHTML = `
    <div class="pills" style="margin-bottom:16px">
      ${pills.map(p => `<button class="pill ${p.cat===category?'active':''}" data-cat="${p.cat}">${p.label}</button>`).join('')}
    </div>
    ${loadingHTML('Finding a quote…')}`;

  content.querySelectorAll('.pill').forEach(pill => {
    pill.addEventListener('click', () => {
      renderCategory(pill.dataset.cat, pill.textContent.trim());
      const titleEl2 = document.getElementById('cat-title');
      if (titleEl2) titleEl2.textContent = pill.textContent.trim() + ' quotes';
    });
  });

  fetchCategoryQuote(category)
    .then(quote => displayCategoryQuote(quote, category))
    .catch(() => {
      const quoteArea = content.querySelector('.loading-card');
      if (quoteArea) quoteArea.outerHTML = `<div class="error-card"><div class="error-icon">🌧️</div><div class="error-title">Couldn't load a quote</div><button class="btn-secondary" id="cat-retry">Try again</button></div>`;
      document.getElementById('cat-retry')?.addEventListener('click', () => renderCategory(category, label));
    });
}

function displayCategoryQuote(quote, category) {
  const content = document.getElementById('cat-content');
  const quoteArea = content.querySelector('.loading-card, .error-card');
  const div = document.createElement('div');
  div.innerHTML = quoteCardHTML(quote) + `
    <button class="refresh-btn" id="cat-refresh">🔄 Give me another one</button>`;
  if (quoteArea) quoteArea.replaceWith(div);
  else content.appendChild(div);
  wireQuoteActions(content, quote);
  const pillLabel = content.querySelector(`.pill[data-cat="${category}"]`)?.textContent.trim() || category;
  document.getElementById('cat-refresh')?.addEventListener('click', function() {
    this.disabled = true;
    this.textContent = 'Loading…';
    const cardEl = content.querySelector('.quote-card');
    if (cardEl) { cardEl.nextElementSibling.remove(); cardEl.remove(); }
    content.querySelector('.refresh-btn')?.remove();
    content.insertAdjacentHTML('beforeend', loadingHTML('Finding another quote…'));
    fetchCategoryQuote(category)
      .then(q => { content.querySelector('.loading-card')?.remove(); displayCategoryQuote(q, category); })
      .catch(() => { content.querySelector('.loading-card')?.remove(); displayCategoryQuote(quote, category); });
  });
}

// ══════════════════════════════
// SCREEN 4 — FAVORITES
// ══════════════════════════════
function buildFavorites() {
  const el = document.createElement('div');
  el.id = 'screen-favorites';
  el.className = 'screen';
  el.innerHTML = `
    <div class="list-header"><h1>My favorites ❤️</h1></div>
    <div class="screen-content" id="favs-content"></div>`;
  return el;
}

function renderFavorites() {
  const content = document.getElementById('favs-content');
  const favs = getFavorites();
  if (!favs.length) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">❤️</div><div class="empty-title">No favorites yet</div><div class="empty-msg">Tap the ❤️ on any quote to save it here</div></div>`;
    return;
  }
  content.innerHTML = favs.map(q => `
    <div class="quote-list-item" data-id="${q.id}">
      <div class="item-meta"><span class="item-dot"></span>${formatDate(q.dateSaved)} · ${escHtml(q.category)}</div>
      <p class="item-text">"${escHtml(q.text)}"</p>
      <p class="item-source">— ${escHtml(q.source)}</p>
      <div class="item-actions" style="display:none">
        <button class="item-action-btn share-fav">📤 Share</button>
        <button class="item-action-btn copy-fav">📋 Copy</button>
        <button class="item-action-btn danger remove-fav" data-id="${q.id}">🗑️ Remove</button>
      </div>
    </div>`).join('');

  content.querySelectorAll('.quote-list-item').forEach(item => {
    const id = item.dataset.id;
    const q = favs.find(f => f.id === id);
    item.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      item.classList.toggle('expanded');
      item.querySelector('.item-actions').style.display = item.classList.contains('expanded') ? 'flex' : 'none';
    });
    item.querySelector('.share-fav')?.addEventListener('click', () => shareQuote(q));
    item.querySelector('.copy-fav')?.addEventListener('click', () => copyText(q.text));
    item.querySelector('.remove-fav')?.addEventListener('click', async () => {
      const ok = await confirm('Remove favorite?', 'This will remove the quote from your favorites. Are you sure?');
      if (ok) { removeFavorite(id); showToast('Removed from favorites'); renderFavorites(); }
    });
  });
}

// ══════════════════════════════
// SCREEN 5 — HISTORY
// ══════════════════════════════
function buildHistory() {
  const el = document.createElement('div');
  el.id = 'screen-history';
  el.className = 'screen';
  el.innerHTML = `
    <div class="list-header"><h1>Quote history 🕐</h1></div>
    <div class="screen-content" id="history-content"></div>`;
  return el;
}

function renderHistory() {
  const content = document.getElementById('history-content');
  const history = getQuoteHistory();
  if (!history.length) {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">📖</div><div class="empty-title">No history yet</div><div class="empty-msg">Your quote history will appear here day by day</div></div>`;
    return;
  }
  const today = new Date().toISOString().slice(0, 10);
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
  content.innerHTML = history.map(q => {
    const day = q.dateGenerated?.slice(0, 10) || '';
    let dateLabel = day === today ? 'Today' : day === yesterday ? 'Yesterday' : formatShortDate(day);
    const fav = isFavorite(q.id);
    return `
      <div class="history-item" data-id="${q.id}">
        <div class="history-date">${dateLabel}</div>
        <div class="history-content">
          <div class="history-text">"${escHtml(q.text)}"</div>
          <div class="history-source">— ${escHtml(q.source)}</div>
          <div class="history-expanded">
            <div class="item-actions" style="margin-top:0">
              <button class="item-action-btn share-hist">📤 Share</button>
              <button class="item-action-btn copy-hist">📋 Copy</button>
            </div>
          </div>
        </div>
        <button class="history-fav-btn" data-id="${q.id}" title="Toggle favorite">${fav ? '❤️' : '🤍'}</button>
      </div>`;
  }).join('');

  content.querySelectorAll('.history-item').forEach(item => {
    const id = item.dataset.id;
    const q = history.find(h => h.id === id);
    item.addEventListener('click', e => {
      if (e.target.closest('button')) return;
      item.classList.toggle('expanded');
    });
    item.querySelector('.share-hist')?.addEventListener('click', () => shareQuote(q));
    item.querySelector('.copy-hist')?.addEventListener('click', () => copyText(q.text));
    item.querySelector('.history-fav-btn')?.addEventListener('click', e => {
      const btn = e.currentTarget;
      if (isFavorite(id)) {
        removeFavorite(id); btn.textContent = '🤍'; showToast('Removed from favorites');
      } else {
        saveFavorite(q); btn.textContent = '❤️'; showToast('Saved to favorites ❤️');
      }
    });
  });
}

function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}
function formatShortDate(iso) {
  if (!iso) return '';
  return new Date(iso + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ══════════════════════════════
// SCREEN 6 — SETTINGS
// ══════════════════════════════
function buildSettings() {
  const el = document.createElement('div');
  el.id = 'screen-settings';
  el.className = 'screen';
  el.innerHTML = `
    <div class="list-header"><h1>Settings ⚙️</h1></div>
    <div class="screen-content" id="settings-content"></div>`;
  return el;
}

function renderSettings() {
  const s = getSettings();
  const name = getUserName();
  const apiKey = getApiKey();
  const favCount = getFavorites().length;
  const histCount = getQuoteHistory().length;
  const content = document.getElementById('settings-content');

  content.innerHTML = `
    <!-- Display -->
    <div class="settings-section">
      <div class="settings-section-title">Display</div>
      <div class="settings-row">
        <div class="settings-item">
          <span class="settings-label">Dark mode</span>
          <label class="toggle">
            <input type="checkbox" id="dark-toggle" ${s.darkMode ? 'checked' : ''}>
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="settings-item">
          <span class="settings-label">Font size</span>
          <div class="font-size-control">
            <button class="font-btn" id="settings-font-dec">A−</button>
            <span class="font-size-label" id="settings-font-label">${FONT_LABELS[s.fontSize || 'md']}</span>
            <button class="font-btn" id="settings-font-inc">A+</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Profile -->
    <div class="settings-section">
      <div class="settings-section-title">Profile</div>
      <div class="settings-row">
        <div class="settings-item" id="name-row" style="cursor:pointer">
          <span class="settings-label">Your name</span>
          <span class="settings-value">${escHtml(name)} ✏️</span>
        </div>
        <div class="settings-edit-row" id="name-edit-row">
          <input class="settings-input" id="name-edit-input" type="text" value="${escHtml(name)}" placeholder="Your first name…">
          <button class="settings-save-btn" id="name-save-btn">Save</button>
        </div>
      </div>
    </div>

    <!-- API -->
    <div class="settings-section">
      <div class="settings-section-title">API</div>
      <div class="settings-row">
        <div class="settings-item" id="api-row" style="cursor:pointer">
          <span class="settings-label">API Key</span>
          <span class="settings-value">${apiKey ? '••••••••' : 'Not set ⚠️'}</span>
        </div>
        <div class="settings-edit-row" id="api-edit-row">
          <input class="settings-input" id="api-edit-input" type="password" placeholder="sk-ant-…" autocomplete="off">
          <button class="settings-save-btn" id="api-save-btn">Save</button>
        </div>
        <p class="settings-note">Your key is stored only on this device and never sent anywhere else</p>
      </div>
    </div>

    <!-- Data -->
    <div class="settings-section">
      <div class="settings-section-title">Data</div>
      <div class="settings-row">
        <div class="settings-item">
          <span class="settings-label">Saved favorites</span>
          <span class="settings-value">${favCount} quote${favCount !== 1 ? 's' : ''}</span>
        </div>
        <div class="settings-item">
          <span class="settings-label">Quote history</span>
          <span class="settings-value">${histCount} day${histCount !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>

    <!-- Danger -->
    <div class="settings-section">
      <div class="settings-section-title">Danger zone</div>
      <button class="btn-danger" id="clear-data-btn">Clear all data</button>
    </div>`;

  // Dark mode toggle
  document.getElementById('dark-toggle').addEventListener('change', e => {
    const dark = e.target.checked;
    document.documentElement.classList.toggle('dark', dark);
    saveSettings({ darkMode: dark });
  });

  // Font size in settings
  const sizes = ['sm', 'md', 'lg'];
  let cur = sizes.indexOf(s.fontSize || 'md'); if (cur === -1) cur = 1;
  document.getElementById('settings-font-dec').addEventListener('click', () => {
    if (cur > 0) { cur--; applyFontSize(sizes[cur]); }
  });
  document.getElementById('settings-font-inc').addEventListener('click', () => {
    if (cur < sizes.length - 1) { cur++; applyFontSize(sizes[cur]); }
  });

  // Name edit
  document.getElementById('name-row').addEventListener('click', () => {
    document.getElementById('name-edit-row').classList.toggle('visible');
  });
  document.getElementById('name-save-btn').addEventListener('click', () => {
    const val = document.getElementById('name-edit-input').value.trim();
    if (val) { saveUserName(val); showToast('Name saved!'); renderSettings(); }
  });

  // API key edit
  document.getElementById('api-row').addEventListener('click', () => {
    document.getElementById('api-edit-row').classList.toggle('visible');
  });
  document.getElementById('api-save-btn').addEventListener('click', () => {
    const val = document.getElementById('api-edit-input').value.trim();
    if (val) { saveApiKey(val); showToast('API key saved!'); renderSettings(); }
  });

  // Clear data
  document.getElementById('clear-data-btn').addEventListener('click', async () => {
    const ok = await confirm('Clear all data?', 'This will delete your name, favorites, and history. Are you sure?');
    if (ok) {
      localStorage.clear();
      showToast('All data cleared');
      setTimeout(() => location.reload(), 600);
    }
  });
}

// ══════════════════════════════
// INIT
// ══════════════════════════════
function init() {
  applySettings();

  const app = document.getElementById('app');

  // Build all screens
  app.appendChild(buildOnboarding());
  app.appendChild(buildHome());
  app.appendChild(buildCategory());
  app.appendChild(buildFavorites());
  app.appendChild(buildHistory());
  app.appendChild(buildSettings());

  // Build nav (shared)
  const nav = buildNav();

  // Attach nav to screens that need it (all except onboarding and category)
  ['screen-home', 'screen-favorites', 'screen-history', 'screen-settings'].forEach(id => {
    document.getElementById(id).appendChild(nav.cloneNode(true));
  });
  // Re-wire cloned navs
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.screen;
      if (target === 'screen-favorites') renderFavorites();
      if (target === 'screen-history') renderHistory();
      if (target === 'screen-settings') renderSettings();
      showScreen(target);
    });
  });

  // First screen
  const name = getUserName();
  if (!name) {
    showScreen('screen-onboarding');
  } else {
    renderHome();
    showScreen('screen-home');
  }

  // Register service worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

init();
