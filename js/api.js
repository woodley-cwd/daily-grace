import { generateQuoteId } from './storage.js';

const MODEL = 'claude-sonnet-4-6';
const SYSTEM = 'You are a quote curator for a warm, uplifting quotes app. Return ONLY valid JSON — no markdown, no explanation. Follow the category instructions exactly.';

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

const CATEGORY_PROMPTS = {
  'Bible': 'Generate a warm, uplifting Bible scripture or quote from a Christian author. This is the ONLY category that should be religious or scripture-based.',
  'Inspirational': 'Generate a secular inspirational quote from a well-known figure (e.g. Maya Angelou, Helen Keller, Einstein, Oprah). NO religious or Bible content.',
  'Motivational': 'Generate a secular motivational quote about achievement, perseverance, or personal growth. NO religious or Bible content. Think coaches, athletes, leaders, authors.',
  'Family and Love': 'Generate a warm quote about family, love, relationships, or parenting. NO religious or Bible content. Keep it heartfelt and human.',
  'Faith and Hope': 'Generate a spiritual quote about hope, inner strength, or belief — can reference God, the universe, or a higher power in a broad sense, but NOT Bible scripture and NOT tied to any specific religion.',
  'Encouragement': 'Generate a cheerful, uplifting quote to brighten someone\'s day. NO religious content. Think warm, feel-good, human encouragement.',
};

export async function fetchDailyQuote() {
  const categories = Object.keys(CATEGORY_PROMPTS);
  const category = categories[Math.floor(Math.random() * categories.length)];
  return callClaude(
    `${CATEGORY_PROMPTS[category]} Return JSON: {"text":"...","source":"...","category":"${category}","theme":"..."} where theme is one of: faith, nature, family, strength, hope, light, peace`
  );
}

export async function fetchCategoryQuote(category) {
  const instruction = CATEGORY_PROMPTS[category] || CATEGORY_PROMPTS['Inspirational'];
  return callClaude(
    `${instruction} Return JSON: {"text":"...","source":"...","category":"${category}","theme":"..."} where theme is one of: faith, nature, family, strength, hope, light, peace`
  );
}
