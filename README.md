# YUME AI — 夢

**A cinematic research portfolio for Sai Charan — India 🇮🇳 × Japan 🇯🇵.**

> Building robots that understand humans.
> An aspiring AI, Machine Learning and Robotics researcher from India,
> working towards studying and conducting research in Japan.

**One Vision. Four Languages. One Intelligent Future.**

**Live:** https://yume-ai.pages.dev · **Private dashboard:** https://yume-ai.pages.dev/dashboard
(repo: https://github.com/charan9147/yume-ai-portfolio)

---

## 1. Run it

React + TypeScript + Vite + Tailwind. Node 20+ recommended.

```powershell
npm ci          # install exactly what the lockfile pins
npm run dev     # http://127.0.0.1:5173
```

Production build:

```powershell
npm run build   # tsc --noEmit + vite build → dist/
npm run preview # serve the built output locally
```

| Script | Does |
|---|---|
| `npm run dev` | Vite dev server with HMR |
| `npm run build` | Typecheck, then bundle into `dist/` |
| `npm run preview` | Serve `dist/` locally |
| `npm run typecheck` | `tsc --noEmit` on its own |

`dist/` is generated and gitignored — never commit it. The `dev-frame.html`
responsive harness (see §9) is also gitignored and never ships.

---

## 2. What is inside

### Source (`src/`)

| Path | Purpose |
|---|---|
| `src/App.tsx` | Page composition and the robot/chat wiring |
| `src/components/Nav.tsx` | Sticky nav, section links, language menu, mobile sheet |
| `src/components/Hero.tsx` | Cinematic hero: red sun, sakura, name, tagline |
| `src/components/About.tsx` | Who Sai Charan is, real facts only |
| `src/components/Mission.tsx` | YUME AI — Listen · Understand · Act · Care |
| `src/components/Projects.tsx` | YUME Tutor / Companion / Bridge (all PROPOSED) |
| `src/components/Robotics.tsx` | Robotics & automation direction |
| `src/components/Research.tsx` | Technology research and the 2026–2029+ timeline |
| `src/components/Budget.tsx` | Project development stages + interactive estimator |
| `src/components/Contact.tsx` | Gmail, WhatsApp, phone |
| `src/components/Footer.tsx` | Waving robot, thanks in English + Japanese |
| `src/components/Chat.tsx` | Floating Yumi assistant |
| `src/components/Robot.tsx` | The SVG mascot: walk, point, wave, dock |
| `src/components/Sakura.tsx` | Canvas petal drift (pauses when hidden) |
| `src/components/Reveal.tsx`, `Section.tsx` | Shared scroll-reveal + section shell |
| `src/i18n/en.ts` | The canonical message schema |
| `src/i18n/locales/*.ts` | 14 translated locale files |
| `src/i18n/index.tsx` | Language context, RTL, persistence, script fonts, meta |
| `src/lib/brain.ts` | Multilingual intent matcher for scripted chatbot answers |
| `src/lib/budget.ts` | Budget estimator model |
| `src/index.css` | Tailwind theme tokens, keyframes, reduced-motion, script fonts |

### Assets and deployment (`public/` + `functions/`)

| File | Purpose |
|---|---|
| `public/assets/sai-charan-portrait.jpg` | Your photograph, cropped to remove the original frame (1600 × 1017) |
| `public/assets/sai-charan-card.jpg` | Smaller copy used by the floating profile card (1000 × 635) |
| `public/assets/sai-charan-founder.jpg` | The founder photograph used in the founder section (632 × 580) |
| `public/assets/sai-charan.png` | Original upload, kept as the master for future re-crops |
| `public/favicon.svg` | The 夢 mark in the browser tab |
| `public/404.html` | Styled not-found page |
| `public/analytics.js` | Privacy-first visit counter (fails silently) |
| `public/dashboard.html` | Private dashboard (unlisted, `noindex`, key-gated) |
| `public/_headers` | Security headers, CSP and cache rules for Cloudflare Pages |
| `public/robots.txt` / `public/sitemap.xml` | Crawler rules and sitemap |
| `functions/api/track.js` | Pages Function — writes aggregate counters to KV |
| `functions/api/stats.js` | Pages Function — reads them, key-protected |
| `functions/api/chat.js` | Pages Function — Workers AI fallback for the chatbot |
| `.github/workflows/` | Uptime check + weekly maintenance issue |
| `docs/preview-*.png` | Screenshots of the v1 site |
| `LICENSE` | MIT — the code only, not the photographs |

### The page, in order

1. **Hero** — cinematic arrival: red sun, drifting sakura, name, the vision line.
2. **About** — the real story: Class 11 completed, mathematics, programming and
   Japanese, aiming at undergraduate study and research in Japan.
3. **Mission** — YUME AI and its four pillars: Listen · Understand · Act · Care.
4. **AI & ML projects** — YUME Tutor, YUME Companion, YUME Bridge (PROPOSED).
5. **Robotics & automation** — perception, control and sim-to-real direction.
6. **Research** — the questions being studied and the 2026–2029+ timeline (PLANNED / VISION).
7. **Budget** — project development stages and an interactive planning estimator.
8. **Contact** — Gmail, WhatsApp and phone.
9. **Footer** — the mascot waves, with *Thank you for exploring YUME AI.* /
   *ありがとう！ また会いましょう！*

---

## 3. The 15 languages

The interface ships in **English, Telugu, Japanese, Portuguese, Hindi, Sanskrit,
Urdu, Chinese, Spanish, Arabic, French, Bengali, Russian, German and Korean**.
The dropdown sits at the top-right of the nav (and inside the mobile sheet).

- **Instant swap** — no reload; the whole page re-renders from the dictionary.
- **Persisted** — the choice is stored under `yume:lang` in `localStorage`.
- **RTL** — Urdu and Arabic flip `dir="rtl"` on `<html>`.
- **Script fonts** — the correct Noto family loads per language (Nastaliq for
  Urdu, Naskh for Arabic, Japanese/Chinese/Korean faces as needed).
- **Metadata** — `<title>`, `lang`, `dir` and the description all follow the
  active language.

`src/i18n/en.ts` is the **canonical schema**. Every other locale is a
`DeepPartial<Messages>` merged over English, so a key that has not been
translated falls back to English rather than rendering empty:

```ts
// src/i18n/dictionaries.ts
te: merge<Messages>(en, te),
ja: merge<Messages>(en, ja),
// …one line per locale
```

> **Translation caveat.** The 14 non-English locales are a careful first draft,
> not professional translations. Spot-review the copy before treating any
> wording as final; native review is welcome. The chatbot's scripted answers and
> suggestion chips are translated, and the intent matcher recognises keywords
> across all fifteen languages.

---

## 4. The Yumi assistant (chatbot)

A floating button opens the assistant. It is **scripted-first**: a multilingual
intent matcher (`src/lib/brain.ts`) maps the question to one of eight topics —
about, projects, tech, budget, stages, founder, contact, robotics — and answers
from the active dictionary, so it replies in the visitor's chosen language.

- Typing animation, suggested question chips, and a clear fallback when the
  question is outside the scripted set.
- **Budget answers never invent prices.** Every figure is labelled a planning
  estimate, never a quotation.
- When the scripted answer misses, `Chat.tsx` POSTs to `/api/chat`
  (`functions/api/chat.js`), an optional Cloudflare Workers AI fallback. If the
  binding is absent the function returns `503` and the UI falls back to the
  scripted text — the assistant never breaks.
- The function caps input at 400 characters, applies a per-day KV cap
  (`CHAT_DAILY_LIMIT`, default 300) and **does not log visitor messages**.
- No API keys live in the client. If you wire a model, its credentials belong in
  Cloudflare bindings, never in the repo.

---

## 5. Make it yours

### The photographs

Your photos are used exactly as uploaded — no generative replacement. The main
portrait was cropped by 70 px on each side to remove the thin grey frame in the
original.

The hero, the floating card and the profile view all point at the same files, so
replacing `public/assets/sai-charan-portrait.jpg` and
`public/assets/sai-charan-card.jpg` updates every appearance at once. The founder
section uses its own file: `public/assets/sai-charan-founder.jpg`.

### Contact details

Already wired in — no placeholders left:

| Where | Value |
|---|---|
| Gmail | `ksaicharan961@gmail.com` |
| WhatsApp | `+91 89773 30221` → `https://wa.me/918977330221` |
| Phone | `tel:+918977330221` |

Search `src/` for `ksaicharan961` or `8977330221` to change them. They also appear
in the footer and in the WhatsApp deep links with a pre-filled greeting.

### Honesty

The site deliberately does not claim achievements, degrees, awards or admission.
Research directions are labelled **PROPOSED**, timeline items **PLANNED /
VISION**, and the architecture note says it is a design proposal. Budget numbers
are illustrative planning ranges, explicitly **not a quotation**. Keep that
framing if you edit — it is a strength, not a weakness.

---

## 6. Publish it (free) — GitHub + Cloudflare Pages

The recommended stack, all on free plans:

| Piece | What it does | Cost |
|---|---|---|
| **GitHub** | Public source repository + history | Free |
| **Cloudflare Pages** | Builds and hosts the site, rebuilds on every push | Free |
| **Cloudflare Web Analytics** | Extra privacy-first traffic + Core Web Vitals | Free |
| **This repo's own counter** | The numbers on `/dashboard` | Free (KV free tier) |
| **Workers AI** (optional) | The chatbot's fallback answers | Free tier |
| Custom domain | `yourname.com` instead of `*.pages.dev` | Optional, paid |

> **Drag-and-drop will not work.** Cloudflare Pages only runs the code in
> `functions/` (the `/api/*` routes) when the project is connected to a Git
> repository. Use the Git integration below.

### 6.1 Push the code to GitHub

The repository already exists: <https://github.com/charan9147/yume-ai-portfolio>.
Use a **personal access token** or the GitHub CLI (`gh auth login`) when Git asks
for a password. Never paste a password into a file in this repo.

### 6.2 Connect Cloudflare Pages

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
2. Authorize GitHub and pick the `yume-ai-portfolio` repository.
3. Build settings — this is a Vite app:

   | Setting | Value |
   |---|---|
   | Framework preset | **None** (or *Vite*) |
   | Build command | `npm ci && npm run build` |
   | Build output directory | `dist` |
   | Root directory | *(leave empty)* |

4. **Save and Deploy.** The first build takes a couple of minutes and gives you
   a `*.pages.dev` address.

From then on, **every `git push` to the production branch redeploys
automatically**. Nothing else to run.

### 6.3 Enable Web Analytics

In the Pages project → **Metrics** → enable **Web Analytics**. Cloudflare injects
its own beacon automatically **on the next deployment** (no snippet to paste).
This gives you Core Web Vitals and an independent visitor count that never uses
cookies or fingerprints.

The beacon loads from `https://static.cloudflareinsights.com` and reports to
`https://cloudflareinsights.com`, so both hosts are allowed in the
`Content-Security-Policy` in `public/_headers`. If you ever disable Web
Analytics, you can remove those two entries.

### 6.4 Replace the placeholder domain

These files mention `https://yume-ai.pages.dev/`. Change them to your real Pages
URL (or custom domain) once you know it:

- `public/robots.txt` → the `Sitemap:` line
- `public/sitemap.xml` → the `<loc>` element
- `index.html` → the canonical and `og:image` URLs

### Alternatives, if you skip Cloudflare

- **Netlify** — connect the repo, build `npm ci && npm run build`, publish `dist`.
  Port the `functions/` routes to Netlify Functions for the dashboard and chat.
- **Vercel** — same idea; `functions/` would need porting to `api/`.
- **GitHub Pages** — *Deploy from a branch* with a build action. No functions, so
  the private dashboard and the chat fallback will not work.

---

## 7. Your private visitor dashboard

The site ships its own counter, so you are not dependent on a third-party
dashboard for the numbers you asked for.

**What it shows** (`/dashboard`): total visitors, page views, distinct
countries/regions, average visit duration, a 14-day bar chart and the top
countries — all aggregate, all time, refreshed on demand.

**What it never does**: no cookies, no IP address is read, stored or hashed, no
fingerprinting, no cross-site tracking, no visitor can be identified. Visitors
with **Do Not Track** enabled are not counted at all. The code is short enough to
audit: `public/analytics.js` (browser), `functions/api/track.js` (write),
`functions/api/stats.js` (read).

### One-time setup

1. **Create the KV namespace**
   Cloudflare dashboard → **Storage & Databases** → **KV** → **Create namespace**
   → name it `yume_stats`.

2. **Bind it to the Pages project**
   Pages project → **Settings** → **Bindings** → **Add** → variable name
   **`YUME_STATS`** → select `yume_stats`.

3. **Set the dashboard key**
   Pages project → **Settings** → **Variables and Secrets** → **Add** →
   type **Secret** → name **`ANALYTICS_KEY`** → value: a long random string.
   Generate one with `openssl rand -hex 24` or any password manager.

4. *(Optional)* Set **`CHAT_DAILY_LIMIT`** to cap chatbot fallback calls per day,
   and bind **`AI`** to the Workers AI binding for the model fallback.

5. **Redeploy** (push a commit, or *Deployments* → *Retry*) so the bindings apply.

6. Open `https://your-site.pages.dev/dashboard`, paste the key, unlock.

The key is kept in `sessionStorage` — it disappears when the tab closes and is
never written to a server. `/dashboard`, `/api/*` are marked `noindex` in
`robots.txt`, `_headers` and a meta tag, and the page is not linked from the
public site.

### If something is wrong

| Message | Meaning | Fix |
|---|---|---|
| *storage is not connected* | `YUME_STATS` binding missing | Step 1–2, then redeploy |
| *dashboard key is not set* | `ANALYTICS_KEY` missing | Step 3, then redeploy |
| *key was not accepted* | wrong value | re-enter the secret exactly |
| *stats API is not deployed* | no `functions/` support | connect via Git (6.2), not drag-and-drop |

Counts start at zero; a visit is recorded the first time a real visitor loads the
site after the bindings exist.

### Free-tier limits (and what to do)

Each visit sends **two** small requests: one page view (with the session flag) at
load, one duration at exit. That is 4 KV writes per visit, so the free KV
allowance (1,000 writes/day) covers roughly **250 visits a day** — far above what
a personal portfolio sees. If you ever outgrow it:

- Cloudflare **Web Analytics** (enabled in 6.3) keeps counting independently and
  has no such limit — treat it as the authoritative number.
- Or upgrade the KV plan, or move the counters to D1 / Workers Analytics Engine
  (the `functions/` code is small enough to port).

KV is eventually consistent and not built for high-frequency counters; two
visitors landing in the same second can collide. For a portfolio that trade-off
is fine, and it is why the dashboard shows aggregates only, never an exact count
you would bill on.

---

## 8. Maintenance

Two GitHub Actions workflows are included:

- **`uptime.yml`** — every 6 hours it fetches the homepage, favicon, sitemap,
  robots, beacon, both photos and a 404 page, verifies the hashed Vite bundles
  are wired up, and pings `/api/chat`. If anything fails it opens (or comments
  on) an issue labelled `uptime`; when the site recovers it comments and closes
  the issue.
- **`weekly-maintenance.yml`** — every Monday it opens a short checklist issue
  labelled `maintenance`. Close it when done; next week's issue only appears once
  the previous one is closed.

Add a repository **variable** so both know your address: repo → **Settings** →
**Secrets and variables** → **Actions** → **Variables** → **New variable** →
name `SITE_URL`, value `https://your-site.pages.dev`. Without it they fall back
to `https://yume-ai.pages.dev`.

**The routine:** edit `src/` → `npm run build` locally if you want to check →
`git commit` → `git push` → Cloudflare rebuilds → confirm on the live URL → skim
the dashboard → close the weekly issue.

---

## 9. How it is built

- **React 19 + TypeScript**, bundled by **Vite**, styled with **Tailwind v4**
  (theme tokens live in `src/index.css`).
- **Motion.** Framer Motion for reveals, the mascot and the chat overlay;
  IntersectionObserver-style scroll progress; a canvas sakura drift.
- **The mascot** is layered SVG, not WebGL. At ≥1280 px it walks the reserved
  left rail; below that it docks bottom-left so it never covers a heading. It
  points at the projects and waves in the footer.
- **Accessibility.** Skip link, focus styles, keyboard-navigable menus with
  `aria` roles, and full `prefers-reduced-motion` support (animations collapse,
  the petal canvas renders nothing).
- **SEO.** `index.html` carries the metadata; per-language `title`, `lang`, `dir`
  and description are updated at runtime.
- **Privacy.** No third-party scripts beyond the fonts and Cloudflare's own
  analytics beacon; the CSP in `public/_headers` allows nothing else.

### Local responsive harness

`dev-frame.html` is a dev-only page (`npm run dev` → `/dev-frame.html?w=390&h=844`)
that loads the app in a resizable iframe for quick breakpoint checks. It is
gitignored and excluded from the production build.

---

## 10. Browser support

Chrome, Edge, Firefox and Safari (recent versions). `backdrop-filter`, CSS
`aspect-ratio`, ES modules and `Intl` are required for the full effect; older
browsers degrade gracefully.

---

Built with intent, between India and Japan. 夢を追いかけて。
