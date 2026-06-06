// ── Quote object shape ──
// { id, text, source, category, theme, dateSaved, dateGenerated }

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function saveUserName(name) {
  localStorage.setItem('dg_name', name.trim());
}
export function getUserName() {
  return localStorage.getItem('dg_name') || '';
}

export function saveDailyQuote(quote) {
  localStorage.setItem(`dg_daily_${todayKey()}`, JSON.stringify(quote));
  saveQuoteHistory(quote);
}
export function getTodayQuote() {
  const raw = localStorage.getItem(`dg_daily_${todayKey()}`);
  return raw ? JSON.parse(raw) : null;
}

export function saveQuoteHistory(quote) {
  const history = getQuoteHistory();
  const key = quote.dateGenerated?.slice(0, 10) || todayKey();
  const filtered = history.filter(q => q.dateGenerated?.slice(0, 10) !== key);
  filtered.unshift(quote);
  const pruned = filtered.slice(0, 14);
  localStorage.setItem('dg_history', JSON.stringify(pruned));
}
export function getQuoteHistory() {
  const raw = localStorage.getItem('dg_history');
  return raw ? JSON.parse(raw) : [];
}

export function saveFavorite(quote) {
  const favs = getFavorites();
  if (!favs.find(q => q.id === quote.id)) {
    favs.unshift({ ...quote, dateSaved: new Date().toISOString() });
    localStorage.setItem('dg_favorites', JSON.stringify(favs));
  }
}
export function removeFavorite(quoteId) {
  const favs = getFavorites().filter(q => q.id !== quoteId);
  localStorage.setItem('dg_favorites', JSON.stringify(favs));
}
export function getFavorites() {
  const raw = localStorage.getItem('dg_favorites');
  return raw ? JSON.parse(raw) : [];
}
export function isFavorite(quoteId) {
  return getFavorites().some(q => q.id === quoteId);
}

export function saveSettings(settings) {
  const current = getSettings();
  localStorage.setItem('dg_settings', JSON.stringify({ ...current, ...settings }));
}
export function getSettings() {
  const raw = localStorage.getItem('dg_settings');
  return raw ? JSON.parse(raw) : { darkMode: false, fontSize: 'md' };
}

export function generateQuoteId(quote) {
  const str = (quote.text || '') + (quote.source || '');
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return 'q_' + Math.abs(hash).toString(36);
}
