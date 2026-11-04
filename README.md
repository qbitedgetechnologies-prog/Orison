# Orison International General Trading — website

Static website for Orison International General Trading (Al Satwa, Dubai).
New and pre-owned mobiles, laptops, accessories and networking equipment, phone and laptop
repair services, and B2B/wholesale supply.

## Hosting

- **GitHub Pages** serves the site from the `main` branch, repository root
  (Pages setting: "Deploy from a branch"). There is no GitHub Actions workflow in this
  repo — every push to `main` rebuilds and redeploys automatically, usually within a minute.
- **Cloudflare** sits in front as CDN / DNS for the custom domain (proxied).

## Structure

- `index.html` — English master page. Edit this file, not the generated locale pages.
- `i18n/en.json`, `i18n/ar.json`, `i18n/ur.json` — translation dictionaries (174 keys each).
- `tools/build-locales.js` — generates `ar/index.html`, `ur/index.html` and `sitemap.xml`.
- `tools/check-site.js` — validates links, SEO tags, hreflang, JSON-LD and translations.
- `ar/index.html`, `ur/index.html` — **generated** Arabic and Urdu pages. Do not hand-edit.
- `sitemap.xml` — **generated** from the page list in `tools/build-locales.js`.
- `js/analytics.js` — conversion events for WhatsApp, phone, email, social and language
  clicks plus form submits and the repair triage. WhatsApp events include the link's
  `intent`. GA4 stays off until a measurement ID is set.
- `#triage` in `index.html` — three-step repair check with a prefilled WhatsApp summary.
  All other WhatsApp links also get a localized prefilled message from the hidden
  `#waTemplates` block, selected by `data-wa-intent`.
- `privacy-policy/index.html` — Privacy Policy (English only).
- `refund-policy/index.html` — Refund and Return Policy (English only).
- `terms-and-conditions/index.html` — Terms and Conditions (English only).
- `404.html` — branded "page not found" page, served by Pages for unknown URLs.
- `css/legal.css` — shared styles for the policy pages and the 404 page.
- `assets/` — photography plus the 1200×630 social share image (`og-image.jpg`).
- `robots.txt` — search-engine discovery; points at `sitemap.xml`.
- `PLAN.md` — prioritised SEO and local-growth backlog. Read this before making changes.
- `AGENTS.md` — build, edit and testing conventions for AI agents.
- `COMPLIANCE.md` — compliance review record and outstanding business decisions.
- `.nojekyll` — tells Pages to serve the files as-is (no Jekyll processing).
- `.gitattributes` — normalises line endings to LF.
- `CNAME` — holds the apex custom domain (`orisonigt.com`).

## Build

Requires Node.js 18 or newer. There are no npm dependencies.

```bash
npm run build   # regenerate ar/, ur/ and sitemap.xml from index.html + i18n/*.json
npm run check   # validate links, SEO tags, hreflang, JSON-LD and translations
```

Run both before every commit. `npm run build` fails if a locale is missing a key used by
`index.html`, so add new strings to all three dictionaries at the same time.

To preview locally:

```bash
python -m http.server 8137
# open http://127.0.0.1:8137/
```

## Language URLs

Each language has its own crawlable URL:

| Language | URL | `hreflang` |
| --- | --- | --- |
| English | `/` | `en` |
| Arabic | `/ar/` | `ar` |
| Urdu | `/ur/` | `ur` |
| Default | `/` | `x-default` |

The switcher is plain links, not JavaScript. Do not reintroduce a client-side text swap:
search engines need the translated content in the HTML.

## Editing

- **Contact details** — WhatsApp number (`wa.me/971563480513`), phone (`tel:+971563480513`),
  email (`salesorison@gmail.com`), address and opening-hours wording.
- **Social links** — TikTok, Instagram, WhatsApp and email in the contact section.
- **WhatsApp messages** — each WhatsApp link has a `data-wa-intent` value. The matching
  `wa.*` string in the dictionaries becomes the prefilled `?text=`. Add a new intent to
  all three dictionaries and to the hidden `#waTemplates` block before using it.
- **Products / B2B copy** — feature blocks, category tiles, pricing cards and the B2B band.
- **SEO** — title, description, canonical, Open Graph and Twitter tags carry `data-seo`
  markers. The build rewrites them for each locale. Keep the English values in `index.html`
  and the translations in `i18n/*.json`.
- **Structured data** — the `Store` / `ElectronicsStore` and `WebSite` JSON-LD block in the
  `index.html` head. Do not add prices, ratings, opening hours or a `geo` position until the
  business has confirmed them.
- **Language strings** — edit `i18n/en.json`, `i18n/ar.json` and `i18n/ur.json`, then run
  `npm run build`. HTML-bearing keys are listed in `HTML_KEYS` inside the build script.
- **Legal pages** — edit the three policy pages and keep their "Last updated" date current.
  They are English-only by business decision.

Commit and push to `main`; the site redeploys automatically.

## Analytics

`js/analytics.js` always pushes events to `window.dataLayer` and only loads Google Analytics
when `GA4_ID` is set. Before enabling GA4, update the Privacy Policy to describe analytics
cookies and add a consent mechanism if required.

Events:

- `contact_click` — `method` is `phone`, `whatsapp`, `email`, `tiktok`, `instagram`,
  `language_switch` or `directions`; WhatsApp events also carry `intent` (`general`, `stock`,
  `repair`, `mobiles`, `laptops`, `accessories`, `networking`, `b2b`, `triage`).
- `form_submit` — the contact form.
- `triage_step`, `triage_complete`, `triage_restart` — the repair wizard.

Components that own their own state dispatch an `orison:track` event on `document` with
`{ detail: { event, params } }`; analytics.js forwards it to the same destinations.

## Compliance and plan

The site was updated against the compliance content pack dated 20 October 2026. See
`COMPLIANCE.md` for what was fixed and what still needs the business to confirm (legal
entity name, trade-licence address, monitored contact details, genuine product prices and
opening hours).

See `PLAN.md` for the prioritised local-SEO backlog and `AGENTS.md` for agent conventions.
