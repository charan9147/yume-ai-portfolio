/**
 * YUME AI — aggregate visit counter
 * POST /api/track
 *
 * Privacy design:
 *  - No cookies.
 *  - No IP addresses are read, stored or hashed.
 *  - No visitor identifiers of any kind.
 *  - Only counters are stored: page views, sessions, country totals, duration sum.
 *
 * Storage: one KV namespace bound as `YUME_STATS`.
 * Keys: `totals` (all time) and `day:YYYY-MM-DD` (per day).
 */

const TOTAL_KEY = 'totals';
const MAX_BODY = 2048;

const blank = () => ({ pv: 0, ss: 0, durSum: 0, durN: 0, countries: {} });

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
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
          .filter(([code, n]) => /^[A-Z]{2}$/.test(code) && Number.isFinite(Number(n)))
          .slice(0, 260)
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

export async function onRequestPost({ request, env }) {
  const store = env.YUME_STATS;
  if (!store) {
    return json({ ok: false, error: 'analytics-storage-not-configured' }, 503);
  }

  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY) return json({ ok: false, error: 'payload-too-large' }, 413);

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return json({ ok: false, error: 'invalid-json' }, 400);
  }

  const type = body && body.type;
  if (type !== 'view' && type !== 'session' && type !== 'duration') {
    return json({ ok: false, error: 'unknown-type' }, 400);
  }

  const seconds = Math.min(3600, Math.max(0, Math.round(Number(body.seconds) || 0)));
  if (type === 'duration' && seconds < 2) {
    return json({ ok: true, ignored: 'too-short' });
  }

  const today = new Date().toISOString().slice(0, 10);
  const dayKey = `day:${today}`;

  const [dayRaw, totalsRaw] = await Promise.all([store.get(dayKey), store.get(TOTAL_KEY)]);
  const day = parse(dayRaw);
  const totals = parse(totalsRaw);

  if (type === 'view') {
    day.pv += 1;
    totals.pv += 1;

    // A new session is sent on the same request to halve KV writes.
    if (body.session === true) {
      day.ss += 1;
      totals.ss += 1;
    }

    const country = (request.cf && request.cf.country) || 'XX';
    if (/^[A-Z]{2}$/.test(country)) {
      day.countries[country] = (day.countries[country] || 0) + 1;
      totals.countries[country] = (totals.countries[country] || 0) + 1;
    }
  } else if (type === 'session') {
    day.ss += 1;
    totals.ss += 1;
  } else {
    day.durSum += seconds;
    day.durN += 1;
    totals.durSum += seconds;
    totals.durN += 1;
  }

  await Promise.all([
    store.put(dayKey, JSON.stringify(day), { expirationTtl: 60 * 60 * 24 * 400 }),
    store.put(TOTAL_KEY, JSON.stringify(totals)),
  ]);

  return json({ ok: true });
}

export function onRequestGet() {
  return json({ ok: false, error: 'use-post' }, 405);
}
