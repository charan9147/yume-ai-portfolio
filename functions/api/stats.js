/**
 * YUME AI — private read-only stats
 * GET /api/stats
 * Header: x-yume-key: <ANALYTICS_KEY>
 *
 * Requires two environment settings in Cloudflare Pages:
 *   YUME_STATS    KV namespace binding
 *   ANALYTICS_KEY secret used to unlock this endpoint
 *
 * Returns aggregate numbers only. No visitor data exists to leak.
 */

const TOTAL_KEY = 'totals';
const DAYS = 14;

const blank = () => ({ pv: 0, ss: 0, durSum: 0, durN: 0, countries: {} });

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex',
    },
  });
}

function parse(raw) {
  let value = null;
  try {
    value = JSON.parse(raw || 'null');
  } catch (error) {
    value = null;
  }
  if (!value || typeof value !== 'object') return blank();

  const countries = value.countries && typeof value.countries === 'object'
    ? Object.fromEntries(
        Object.entries(value.countries)
          .filter(([code, n]) => /^[A-Z]{2}$/.test(code) && Number.isFinite(Number(n)) && Number(n) >= 0)
          .map(([code, n]) => [code, Number(n)])
      )
    : {};

  return {
    pv: Math.max(0, Number(value.pv) || 0),
    ss: Math.max(0, Number(value.ss) || 0),
    durSum: Math.max(0, Number(value.durSum) || 0),
    durN: Math.max(0, Number(value.durN) || 0),
    countries,
  };
}

function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export async function onRequestGet({ request, env }) {
  const store = env.YUME_STATS;
  if (!store) return json({ ok: false, error: 'analytics-storage-not-configured' }, 503);

  const expected = env.ANALYTICS_KEY;
  if (!expected) return json({ ok: false, error: 'dashboard-key-not-set' }, 501);

  const url = new URL(request.url);
  const provided = request.headers.get('x-yume-key') || url.searchParams.get('key') || '';
  if (!safeEqual(provided, expected)) return json({ ok: false, error: 'unauthorized' }, 401);

  const totals = parse(await store.get(TOTAL_KEY));

  const now = Date.now();
  const dates = Array.from({ length: DAYS }, (_, index) => {
    const d = new Date(now - (DAYS - 1 - index) * 86400000);
    return d.toISOString().slice(0, 10);
  });

  const rawDays = await Promise.all(dates.map((date) => store.get(`day:${date}`)));
  const series = dates.map((date, index) => {
    const day = parse(rawDays[index]);
    return { date, pv: day.pv, ss: day.ss };
  });

  const topCountries = Object.entries(totals.countries)
    .map(([code, n]) => ({ code, n: Number(n) || 0 }))
    .sort((a, b) => b.n - a.n)
    .slice(0, 8);

  return json({
    ok: true,
    visitors: totals.ss,
    pageviews: totals.pv,
    countries: Object.keys(totals.countries).length,
    avgDuration: totals.durN ? Math.round(totals.durSum / totals.durN) : 0,
    sessionsMeasured: totals.ss,
    series,
    topCountries,
    updated: new Date().toISOString(),
  });
}
