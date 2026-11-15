# YUME AI — 夢

**A cinematic 3D research portfolio for Sai Charan.**

> Building robots that understand humans.
> An aspiring AI, Machine Learning and Robotics researcher from India,
> working towards studying and conducting research in Japan.

One Vision. Four Languages. One Intelligent Future. · India 🇮🇳 × Japan 🇯🇵

---

## 1. Run it

No build step, no framework, no install.

**Just double-click `index.html`.** It opens in any modern browser.

Three.js and the fonts load from a CDN, so the first visit needs an internet
connection. If the 3D is blocked (some browsers are strict about local files),
serve the folder locally:

```powershell
# from this folder
npx serve .
# or, with Python installed
python -m http.server 8000
```

Then open `http://localhost:8000`.

---

## 2. What is inside

| File | Purpose |
|---|---|
| `index.html` | All content + the interaction layer (3D scene, scroll story) |
| `styles.css` | Design system: tokens, layout, glass, motion, responsive rules |
| `assets/sai-charan-portrait.jpg` | Your photograph, cropped to remove the original frame (1600 × 1017) |
| `assets/sai-charan-card.jpg` | Smaller copy used by the floating profile card (1000 × 635) |
| `assets/sai-charan-founder.jpg` | The founder photograph used in the Founder section (632 × 580) |
| `assets/sai-charan.png` | Original upload, kept as the master for future re-crops |
| `favicon.svg` | The 夢 mark in the browser tab |
| `preview-desktop.png` / `preview-mobile.png` | Screenshots of the finished site |
| `404.html` | Styled not-found page |
| `analytics.js` | Privacy-first visit counter (fails silently) |
| `functions/api/track.js` | Cloudflare Pages Function — writes aggregate counters to KV |
| `functions/api/stats.js` | Cloudflare Pages Function — reads them, key-protected |
| `dashboard.html` | Private dashboard (unlisted, `noindex`, key-gated) |
| `_headers` | Security headers, CSP and cache rules for Cloudflare Pages |
| `robots.txt` / `sitemap.xml` | Crawler rules and sitemap (update the domain) |
| `.github/workflows/` | Uptime check + weekly maintenance issue |
| `LICENSE` | MIT — the code only, not the photographs |

### The page, in order

1. **Act I — Arrival.** Cinematic portrait, particles, name and introduction.
2. **Act II — The Researcher.** The same photograph as a floating 3D profile card
   that tilts with your pointer and parallaxes as you scroll.
3. **Act III — The Profile.** The same face inside the professional profile:
   education, research interests, career vision.
4. **Problem space.** Six India–Japan challenges.
5. **The mission.** YUME AI — Listen · Understand · Act · Care.
6. **Architecture.** A draggable, clickable 3D system graph with six subsystems.
7. **Timeline.** Foundations → specialisation → application → research.
8. **Japan.** The MEXT / KOSEN pathway and language goal.
9. **Founder.** Your founder photograph with direct Gmail and WhatsApp contact.
10. **Contact.** Email, WhatsApp and phone, plus a floating WhatsApp button on
    every screen.

---

## 3. Make it yours

### The photograph

Your photos are used exactly as uploaded — no generative replacement. The main
portrait was cropped by 70 px on each side to remove the thin grey frame in the
original.

Three copies of the portrait are shown (`hero`, floating card, profile). They all
point at the same files, so replacing `assets/sai-charan-portrait.jpg` and
`assets/sai-charan-card.jpg` updates every appearance at once.

The Founder section uses its own file: `assets/sai-charan-founder.jpg`. Replace
that file to change the founder photo.

**Framing.** If your face sits low or high in the crop, change one line near the
top of `styles.css`:

```css
:root {
  --photo-pos: 50% 30%;   /* horizontal % , vertical % */
}
```

`50% 20%` moves the crop up (more headroom shown), `50% 45%` moves it down.
The founder photo has its own focal point (`.founder-photo img` →
`object-position: 50% 38%`).

### Contact details

Already wired in — no placeholders left:

| Where | Value |
|---|---|
| Gmail | `ksaicharan961@gmail.com` |
| WhatsApp | `+91 89773 30221` → `https://wa.me/918977330221` |
| Phone | `tel:+918977330221` |

They appear in the Founder section, the Contact section, the footer, the floating
WhatsApp button, and the structured data (`application/ld+json`). To change them,
search `index.html` for `ksaicharan961` or `8977330221`.

The WhatsApp links open a chat with a pre-filled greeting. Edit the
`?text=Hi%20Sai%20Charan...` part of the URL to change that message.

### Honesty

The site deliberately does not claim achievements, degrees, awards or
admission. Research directions are labelled **PROPOSED**, timeline items
**PLANNED / VISION**, and the architecture note says it is a design proposal.
Keep that framing if you edit — it is a strength, not a weakness.

---

## 4. Publish it (free) — GitHub + Cloudflare Pages

The recommended stack, all on free plans:

| Piece | What it does | Cost |
|---|---|---|
| **GitHub** | Public source repository + history | Free |
| **Cloudflare Pages** | Hosts the site, rebuilds on every push | Free |
| **Cloudflare Web Analytics** | Extra privacy-first traffic + Core Web Vitals | Free |
| **This repo's own counter** | The numbers on `/dashboard.html` | Free (KV free tier) |
| Custom domain | `yourname.com` instead of `*.pages.dev` | Optional, paid |

> **Drag-and-drop will not work for analytics.** Cloudflare Pages only runs the
> code in `functions/` (the `/api/*` routes) when the project is connected to a
> Git repository. Use the Git integration below.

### 4.1 Push the code to GitHub

Create an empty **public** repository named `yume-ai-portfolio` at
<https://github.com/new> — no README, no `.gitignore`, no license (this folder
already has them). Then, in this folder:

```bash
git init -b main
git add -A
git commit -m "YUME AI portfolio: first public release"
git remote add origin https://github.com/<your-username>/yume-ai-portfolio.git
git push -u origin main
```

Use a **personal access token** or the GitHub CLI (`gh auth login`) when Git asks
for a password. Never paste a password into a file in this repo.

### 4.2 Connect Cloudflare Pages

1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** →
   **Pages** → **Connect to Git**.
2. Authorize GitHub and pick the `yume-ai-portfolio` repository.
3. Build settings — this is a static site, so:

   | Setting | Value |
   |---|---|
   | Framework preset | **None** |
   | Build command | *(leave empty)* |
   | Build output directory | `.` |
   | Root directory | *(leave empty)* |

4. **Save and Deploy.** The first build takes under a minute and gives you
   `https://yume-ai-portfolio.pages.dev` (the exact name depends on availability).

From then on, **every `git push` to `main` redeploys automatically**. Nothing else
to run.

### 4.3 Enable Web Analytics

In the Pages project → **Metrics** → enable **Web Analytics**. Cloudflare injects
its own beacon automatically (no snippet to paste). This gives you Core Web Vitals
and an independent visitor count that never uses cookies or fingerprints.

### 4.4 Replace the placeholder domain

These three files mention `https://yume-ai.pages.dev/`. Change them to your real
Pages URL (or custom domain) once you know it:

- `robots.txt` → `Sitemap:` line
- `sitemap.xml` → `<loc>` element
- `index.html` → the `og:image` / canonical URLs, if you add them

```html
<meta property="og:image" content="https://your-domain.com/assets/sai-charan-portrait.jpg" />
```

### Alternatives, if you skip Cloudflare

- **GitHub Pages** — Settings → Pages → *Deploy from a branch* → `main` / root.
  Live at `https://<username>.github.io/<repo>/`. No functions, so the private
  dashboard will not work — Web Analytics only if you use Cloudflare's DNS.
- **Netlify** — connect the repo, build command empty, publish directory `.`.
  Add the `functions/` routes as Netlify Functions if you want the dashboard.
- **Vercel** — same idea; `functions/` would need porting to `api/`.

---

## 5. Your private visitor dashboard

The site ships its own counter, so you are not dependent on a third-party
dashboard for the four numbers you asked for.

**What it shows** (`/dashboard.html`): total visitors, page views, distinct
countries/regions, average visit duration, a 14-day bar chart and the top
countries — all aggregate, all time, refreshed on demand.

**What it never does**: no cookies, no IP address is read, stored or hashed, no
fingerprinting, no cross-site tracking, no visitor can be identified. Visitors
with **Do Not Track** enabled are not counted at all. The code is short enough to
audit: `analytics.js` (browser), `functions/api/track.js` (write),
`functions/api/stats.js` (read).

### One-time setup

1. **Create the KV namespace**
   Cloudflare dashboard → **Storage & Databases** → **KV** → **Create namespace**
   → name it `yume_stats`.

2. **Bind it to the Pages project**
   Pages project → **Settings** → **Bindings** (or *Functions* → *KV namespace
   bindings*) → **Add** → variable name **`YUME_STATS`** → select `yume_stats`.

3. **Set the dashboard key**
   Pages project → **Settings** → **Variables and Secrets** → **Add** →
   type **Secret** → name **`ANALYTICS_KEY`** → value: a long random string.
   Generate one with `openssl rand -hex 24` or any password manager.

4. **Redeploy** (push a commit, or *Deployments* → *Retry*) so the bindings apply.

5. Open `https://your-site.pages.dev/dashboard.html`, paste the key, unlock.

The key is kept in `sessionStorage` — it disappears when the tab closes and is
never written to a server. `/dashboard.html`, `/api/*` and the dashboard are
marked `noindex` in `robots.txt`, `_headers` and a meta tag, and the page is not
linked from the public site.

### If something is wrong

| Message | Meaning | Fix |
|---|---|---|
| *storage is not connected* | `YUME_STATS` binding missing | Step 1–2, then redeploy |
| *dashboard key is not set* | `ANALYTICS_KEY` missing | Step 3, then redeploy |
| *key was not accepted* | wrong value | re-enter the secret exactly |
| *stats API is not deployed* | no `functions/` support | connect via Git (4.2), not drag-and-drop |

Counts start at zero; a visit is recorded the first time a real visitor loads the
site after the bindings exist.

### Free-tier limits (and what to do)

Each visit sends **two** small requests: one page view (with the session flag) at
load, one duration at exit. That is 4 KV writes per visit, so the free KV
allowance (1,000 writes/day) covers roughly **250 visits a day** — far above what
a personal portfolio sees. If you ever outgrow it:

- Cloudflare **Web Analytics** (enabled in 4.3) keeps counting independently and
  has no such limit — treat it as the authoritative number.
- Or upgrade the KV plan, or move the counters to D1 / Workers Analytics Engine
  (the `functions/` code is small enough to port).

KV is eventually consistent and not built for high-frequency counters; two
visitors landing in the same second can collide. For a portfolio that trade-off
is fine, and it is why the dashboard shows aggregates only, never an exact count
you would bill on.

---

## 6. Maintenance

Two GitHub Actions workflows are included:

- **`uptime.yml`** — every 6 hours it fetches the homepage, stylesheet, beacon,
  both photos and a 404 page, and checks the HTML still contains `YUME AI`.
  If anything fails it opens (or comments on) an issue labelled `uptime`; when the
  site recovers it comments and closes the issue.
- **`weekly-maintenance.yml`** — every Monday it opens a short checklist issue
  labelled `maintenance`. Close it when done; next week's issue only appears once
  the previous one is closed.

Add a repository **variable** so both know your address: repo → **Settings** →
**Secrets and variables** → **Actions** → **Variables** → **New variable** →
name `SITE_URL`, value `https://your-site.pages.dev`. Without it they fall back to
`https://yume-ai.pages.dev`.

**The routine:** edit locally → `git commit` → `git push` → Cloudflare rebuilds →
confirm on the live URL → skim the dashboard → close the weekly issue.

---

## 7. How it is built

- **No dependencies to install.** Three.js r160 is imported as an ES module
  from jsDelivr inside `index.html`.
- **3D layer.** Two WebGL scenes: an ambient star field behind the page, and the
  interactive architecture graph (drag to rotate, click a node or its label).
- **CSS 3D** for the profile card — real perspective layers, no library.
- **Motion.** IntersectionObserver reveals, scroll progress, pointer parallax,
  scroll-linked card rotation.
- **Accessibility.** Skip link, focus styles, real `<button>` node labels,
  `aria-live` detail panel, visible reduced-motion support.
- **Performance.** No build, one image per section, lazy loading below the fold,
  capped pixel ratio, animations paused when the tab is hidden.
- **Resilience.** If WebGL or the CDN fails, the architecture falls back to a
  readable list, and the rest of the page works normally.

### Notes on the stage / 3D

If the browser blocks WebGL, the site still looks intentional: the graph becomes
a grid of selectable subsystem buttons.

---

## 8. Editing the 3D graph

Node content lives in the `NODES` array near the bottom of `index.html`:

```js
{ label: 'Perception', jp: '知覚', desc: '…', tags: ['Computer vision', 'Audio'] }
```

Each entry automatically gets a 3D node, an HTML label, and a row in the
detail panel. Add or remove entries and the ring re-balances itself.

---

## 9. Browser support

Chrome, Edge, Firefox and Safari (recent versions). `backdrop-filter`,
CSS `aspect-ratio` and ES modules are required for the full effect; older
browsers degrade gracefully.

---

Built with intent, between India and Japan. 夢を追いかけて。
