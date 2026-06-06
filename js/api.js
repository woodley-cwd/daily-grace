import { generateQuoteId } from './storage.js';

const MODEL = 'claude-sonnet-4-20250514';
const SYSTEM = 'You are a quote curator for a devotional app used by elderly women who love faith, family, and encouragement. Return ONLY valid JSON — no markdown, no explanation. Generate warm, uplifting quotes.';

export function getApiKey() {
  return localStorage.getItem('dg_api_key') || '';
}
export function saveApiKey(key) {
  localStorage.setItem('dg_api_key', key.trim());
}

async function callClaude(userMessage) {
  const key = getApiKey();
  if (!key) throw new Error('NO_API_KEY');

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 300,
      system: SYSTEM,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${res.status}`);
  }

  const data = await res.json();
  const text = data.content?.[0]?.text || '';
  const cleaned = text.replace(/```json\n?|\n?```/g, '').trim();
  const quote = JSON.parse(cleaned);
  quote.id = generateQuoteId(quote);
  quote.dateGenerated = new Date().toISOString();
  return quote;
}

export async function fetchDailyQuote() {
  return callClaude(
    'Generate an uplifting quote from one of these categories: Bible, Inspirational, Motivational, Family and Love, Faith and Hope, or Encouragement. Return JSON: {"text":"...","source":"...","category":"...","theme":"..."} where theme is one of: faith, nature, family, strength, hope, light, peace'
  );
}

export async function fetchCategoryQuote(category) {
  return callClaude(
    `Generate an uplifting quote specifically from the "${category}" category. Return JSON: {"text":"...","source":"...","category":"...","theme":"..."} where theme is one of: faith, nature, family, strength, hope, light, peace`
  );
}
