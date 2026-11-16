/**
 * YUME AI — optional AI fallback for the site assistant
 * POST /api/chat   { message: string, lang: string }
 *
 * Design:
 *  - The client answers every question it can from the scripted brain, in the
 *    selected language. This endpoint is only reached for questions the script
 *    does not cover.
 *  - If no `AI` binding is configured, it returns 503 so the client falls back
 *    to its own "outside what I have scripted" reply. Nothing breaks.
 *  - A daily KV counter caps usage so a free-tier allowance cannot be drained.
 *  - Messages are never logged or stored. Only a per-day counter is kept.
 *
 * Bindings: AI (Workers AI), YUME_STATS (KV, optional cap storage)
 * Env:      CHAT_DAILY_LIMIT (optional, default 300)
 */

const MAX_BODY = 1200;
const MAX_MESSAGE = 400;
const LANGS = new Set([
  'en', 'te', 'ja', 'pt', 'hi', 'sa', 'ur', 'zh', 'es',
  'ar', 'fr', 'bn', 'ru', 'de', 'ko',
]);

const NAMES = {
  en: 'English', te: 'Telugu', ja: 'Japanese', pt: 'Portuguese', hi: 'Hindi',
  sa: 'Sanskrit', ur: 'Urdu', zh: 'Chinese', es: 'Spanish', ar: 'Arabic',
  fr: 'French', bn: 'Bengali', ru: 'Russian', de: 'German', ko: 'Korean',
};

const SYSTEM = `You are Yumi, the guide inside YUME AI — the research portfolio of Sai Charan, a student from India building towards AI, machine learning and robotics research in Japan.

Facts you may use:
- YUME AI stands for "dream" (夢). It is a PROPOSED research platform, not a finished product.
- Four pillars: Listen, Understand, Act, Care.
- Three project proposals: YUME Tutor (multilingual study companion), YUME Companion (assistive home robot for elderly users), YUME Bridge (real-time engineering translation between Japanese and Indian languages).
- Eight development stages: design, responsive frontend, multilingual system, chatbot, robot animation, budget calculator, testing, deployment.
- Contact: ksaicharan961@gmail.com, WhatsApp +91 89773 30221.
- Education: Class 11 completed; aiming at the MEXT / KOSEN route in Japan, subject to eligibility and selection.

Rules:
- Never invent confirmed prices, quotations, achievements, awards, degrees, admissions or partnerships. The budget figures on the site are illustrative planning ranges for a student-scale build, never quotations.
- If asked something you do not know, say so and suggest email or WhatsApp.
- Be warm, concise (under 110 words) and concrete. No markdown headings, no emojis, no bullet lists longer than three items.
- Answer in the requested language. If the request is in another language, mirror that language instead.`;

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

export async function onRequestPost({ request, env }) {
  const length = Number(request.headers.get('content-length') || 0);
  if (length > MAX_BODY) return json({ ok: false, error: 'payload-too-large' }, 413);

  let body;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: 'invalid-json' }, 400);
  }

  const message = typeof body?.message === 'string' ? body.message.trim() : '';
  if (!message) return json({ ok: false, error: 'empty-message' }, 400);
  if (message.length > MAX_MESSAGE) return json({ ok: false, error: 'message-too-long' }, 400);

  const lang = LANGS.has(body?.lang) ? body.lang : 'en';

  const ai = env.AI;
  if (!ai || typeof ai.run !== 'function') {
    return json({ ok: false, error: 'ai-not-configured' }, 503);
  }

  // Soft daily cap. If KV is missing the endpoint still works, uncapped.
  const store = env.YUME_STATS;
  const limit = Math.max(1, Number(env.CHAT_DAILY_LIMIT) || 300);
  const key = `chat:${new Date().toISOString().slice(0, 10)}`;

  if (store) {
    try {
      const used = Number(await store.get(key)) || 0;
      if (used >= limit) return json({ ok: false, error: 'daily-limit-reached' }, 429);
      await store.put(key, String(used + 1), { expirationTtl: 60 * 60 * 48 });
    } catch {
      // Never fail the request because the counter failed.
    }
  }

  try {
    const result = await ai.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        { role: 'system', content: `${SYSTEM}\n\nReply in ${NAMES[lang]}. The visitor's interface language is ${NAMES[lang]}.` },
        { role: 'user', content: `${message}\n\n(Answer in ${NAMES[lang]}.)` },
      ],
      max_tokens: 320,
      temperature: 0.4,
    });

    const answer =
      (result && typeof result.response === 'string' && result.response.trim()) ||
      (result && typeof result.result === 'string' && result.result.trim()) ||
      '';

    if (!answer) return json({ ok: false, error: 'empty-completion' }, 502);
    return json({ ok: true, answer: answer.slice(0, 1400), lang });
  } catch {
    return json({ ok: false, error: 'model-unavailable' }, 503);
  }
}

export function onRequestGet() {
  return json({ ok: false, error: 'use-post' }, 405);
}
