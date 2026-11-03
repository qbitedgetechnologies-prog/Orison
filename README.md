# Orison International General Trading — website

Static website for Orison International General Trading (Al Satwa, Dubai).
New and pre-owned mobiles, laptops, accessories, networking equipment, phone and laptop
repair services, and B2B/wholesale supply.

## Hosting

- **GitHub Pages** builds and serves the site via the `Deploy static site to GitHub Pages`
  workflow (`.github/workflows/deploy-pages.yml`). Every push to `main` redeploys.
- **Cloudflare** sits in front as CDN / DNS for the custom domain (proxied).

## Structure

No build step. Google Fonts is the only external dependency.

- `index.html` — the main site (inline CSS, inline SVG and a small vanilla-JS snippet for
  the language switcher, mobile menu, skyline parallax and footer year).
- `privacy-policy/index.html` — Privacy Policy.
- `refund-policy/index.html` — Refund and Return Policy.
- `terms-and-conditions/index.html` — Terms and Conditions.
- `css/legal.css` — shared styles for the three policy pages.
- `sitemap.xml`, `robots.txt` — search-engine discovery.
- `assets/` — photography used on the home page.
- `.nojekyll` — tells Pages to serve the files as-is (no Jekyll processing).
- `.gitattributes` — normalises line endings to LF.
- `CNAME` — holds the apex custom domain (`orisonigt.com`).

## Editing

Open `index.html` and edit directly. Key spots:

- **Contact details** — WhatsApp number (`wa.me/971563480513`), phone (`tel:+971563480513`),
  email (`salesorison@gmail.com`), address and opening-hours wording.
- **Social links** — TikTok, Instagram, WhatsApp and email in the contact section.
- **Products / B2B copy** — the feature blocks, category tiles, pricing cards and B2B band.
- **Legal pages** — edit the three policy pages and keep their "Last updated" date current.
- **Language strings** — the `I18N` object near the bottom of `index.html` holds English,
  Arabic and Urdu copy. When changing an English string, update the other two dictionaries
  as well, or the language switcher will fall back to the old wording.

Commit and push to `main`; the site redeploys automatically.

## Compliance

The site was updated against the compliance content pack dated 20 October 2026. See
`COMPLIANCE.md` for what was fixed and what still needs the business to confirm (legal
entity name, trade-licence address, monitored contact details, genuine product prices and
opening hours).
