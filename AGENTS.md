# Agent guide — Orison website

Read `PLAN.md` before changing anything. It is the shared backlog; update the relevant row
when you finish work.

## What this repo is

A static marketing site for Orison International General Trading, deployed by GitHub Pages
from the `main` branch at the repository root. There is no framework, no bundler and no
GitHub Actions workflow. Cloudflare fronts the custom domain `orisonigt.com`.

## Source of truth

| File | Role |
| --- | --- |
| `index.html` | English master page. **Edit this file.** |
| `i18n/en.json` | English strings used by the build and the checker |
| `i18n/ar.json`, `i18n/ur.json` | Arabic and Urdu strings |
| `tools/build-locales.js` | Generates locale pages and the sitemap |
| `tools/check-site.js` | Validates the committed site |
| `tools/optimize-images.py` | Regenerates the AVIF and WebP variants from the JPEGs |
| `js/analytics.js` | Conversion events; GA4 is off until `GA4_ID` is set |
| `css/legal.css` | Policy pages and 404 styles |

The home page also contains the repair triage wizard (`#triage`) and the hidden
`#waTemplates` block. Both are plain HTML and inline JavaScript; there is no separate build
step for them.

**Generated — never hand-edit:** `ar/index.html`, `ur/index.html`, `sitemap.xml`.

If a change affects shared markup or CSS, make it in `index.html` and run the build. If it
affects copy, change the dictionaries and run the build.

## Commands

```bash
npm run build   # regenerate ar/, ur/ and sitemap.xml
npm run check   # validate pages, links, SEO tags, hreflang, JSON-LD, translations
```

Both must pass before a commit. The build fails when a locale is missing a key that
`index.html` uses, so add new strings to all three dictionaries at once.

Preview locally:

```bash
python -m http.server 8137
# http://127.0.0.1:8137/
```

There is no test runner in the repo. Use a browser (or a temporary Playwright script outside
the repo) for visual and interaction checks.

## Translation workflow

1. Add or change the key in `i18n/en.json`.
2. Add the same key to `i18n/ar.json` and `i18n/ur.json`.
3. Add `data-i18n="key"` (or `data-i18n-html`, `data-i18n-ph`, `data-i18n-aria`) in
   `index.html`.
4. Run `npm run build` and `npm run check`.

Notes:

- Keys listed in `HTML_KEYS` in `tools/build-locales.js` may contain HTML (`<em>`, `<br>`,
  entities) and are inserted as HTML. All other keys are escaped as text.
- `{year}` in `footer.cr` is replaced with `<span data-year>YYYY</span>`; the page script
  updates `[data-year]` at runtime.
- The Arabic and Urdu pages are generated from the English markup, so keep IDs, classes and
  section anchors stable.
- WhatsApp links use `data-wa-intent="..."`. The page script copies the matching
  `[data-wa-template]` text into `?text=`. When adding an intent, add the template and the
  `wa.*` key to all three dictionaries.
- The triage wizard keeps its own state and dispatches `orison:track` events on `document`;
  `js/analytics.js` forwards them. Do not push directly to `dataLayer` from page markup.
- `data-i18n-aria="key"` only rewrites an `aria-label` that is already present on the element.
  Add both attributes; `npm run check` fails if the marker has no `aria-label`.

## SEO invariants

- `/` is English, `/ar/` is Arabic, `/ur/` is Urdu. Each page must keep:
  - the correct `<html lang>` and `dir`
  - a self-referencing canonical
  - `hreflang` for `en`, `ar`, `ur` and `x-default`
  - `og:url` and `og:locale` matching the page
  - exactly one `aria-current="page"` in the language switcher
- SEO slots in the head use `data-seo` markers. The build rewrites them for each locale.
  Do not remove the markers.
- `sitemap.xml` is generated from the page list in `tools/build-locales.js`. Add new public
  pages there.
- Do not add `Product`/`Offer` prices, `aggregateRating`, `openingHoursSpecification` or
  `geo` coordinates until the business has confirmed the underlying facts.
- The Urdu page loads Noto Nastaliq Urdu; the other pages must not.
- Every photo uses `<picture>` with AVIF, WebP and a JPEG `<img>` fallback that keeps its
  original `width` and `height`. Never point an `<img>` directly at a photo when a
  `<picture>` is expected. Run `python tools/optimize-images.py` after changing a JPEG;
  `npm run check` enforces the three files and the fallback dimensions.

## Accessibility invariants

- One `h1` per page; never skip a heading level. Feature headings are `h2`, category and
  card headings are `h3`, triage result sub-blocks are `h4`.
- `<main>` carries `tabindex="-1"` so the skip link moves focus into it.
- Keep `:focus-visible`. Never add `outline:none` to a `:focus` rule: it overrides the global
  focus ring and fails keyboard users.
- Every decorative `<svg>` needs `aria-hidden="true"`; icon-only links need an `aria-label`.
- Body text needs 4.5:1 contrast, large text 3:1. The WhatsApp button is `#0f7b6c` (5.16:1
  with white); do not lighten it back to the brand green.
- Text hidden only for layout reasons must stay in the DOM for assistive tech. The header
  WhatsApp label is visually hidden, not `display:none`, so the link keeps its name.
- Triage: `#triageStepLabel` stays `aria-live="polite"` and `#triageSummary` stays
  `role="status"`, so step and result changes are announced.
- Mobile menu: `aria-controls="navLinks"`; Escape closes it and returns focus to `#menuBtn`.
- Landmark labels use `data-i18n-aria`; the element must already have an `aria-label`.

## Content guardrails

- No invented prices, warranties, opening hours, delivery promises, repair timeframes,
  licence numbers, awards or company history.
- Legal pages (Privacy, Refund, Terms) stay English-only. The language switcher applies to
  the marketing site.
- No fake Abu Dhabi branch, doorway pages, fake reviews or bought links.
- Keep NAP (name, address, phone) identical across the site, schema, Google Business Profile
  and directories.
- When a fact is unknown, use "Price on request" or "contact us to confirm" rather than
  guessing.

## Testing checklist

Before pushing:

1. `npm run build` and `npm run check` pass.
2. Load `/`, `/ar/`, `/ur/` at 1440px, 768px, 390px and 320px.
3. No horizontal overflow, console errors or failed requests.
4. Images load; `og-image.jpg` exists; `currentSrc` is the AVIF file and the WebP/JPEG
   fallbacks decode at the same dimensions.
5. Language links go to the right URL and mark the current language.
6. Anchors (`#shop`, `#repairs`, `#categories`, `#b2b`, `#contact`) resolve on every locale.
7. Policy links return 200 and the 404 page returns HTTP 404.
8. Keyboard: skip link moves focus to `main`, language switcher, mobile menu and Escape-to-close
   (focus returns to the menu button) work, and every control shows a visible focus ring.
9. Repair triage: step transitions, back, restart, result chips, prefilled WhatsApp summary,
   focus move to the new heading and the `aria-live`/`role="status"` announcements work in all
   three locales.
10. Every `a[data-wa-intent]` has a non-empty `?text=` in the visitor's language, and the
    `contact_click` event includes the right `intent`.
11. Run an axe-core pass on all seven pages at 320, 360, 430, 768 and 1440px. The 768px case
    matters: the header WhatsApp link is icon-only there.

## Deploying

Commit and push to `main`. GitHub Pages rebuilds automatically; there is no workflow to run.
Wait for the Pages build to finish, then verify the live URLs, not just localhost:

- `https://orisonigt.com/`
- `https://orisonigt.com/ar/`
- `https://orisonigt.com/ur/`
- `https://orisonigt.com/sitemap.xml`

HTTPS is currently **not enforced** at the account level; do not claim it is fixed unless
`http://orisonigt.com/` returns a redirect to `https://`.

## Commits

- Keep commits focused and describe the user-visible change.
- Include regenerated locale pages and `sitemap.xml` in the same commit as the source change.
- Update `PLAN.md` status and `COMPLIANCE.md` when a task or business decision changes.
