# Orison International General Trading — website

Static one-page site for Orison International General Trading (Al Satwa, Dubai).
New & used mobiles, laptops, accessories, networking gear, and B2B/wholesale trading.

## Hosting

- **GitHub Pages** builds and serves the site via the `Deploy static site to GitHub Pages`
  workflow (`.github/workflows/deploy-pages.yml`). Every push to `main` redeploys.
- **Cloudflare** sits in front as CDN / DNS for the custom domain (proxied).

## Structure

Single self-contained file — no build step, no dependencies except Google Fonts (CDN):

- `index.html` — the entire site (inline CSS + inline SVG + a small vanilla-JS snippet
  for the mobile menu and footer year).
- `.nojekyll` — tells Pages to serve the files as-is (no Jekyll processing).
- `.gitattributes` — normalizes line endings to LF.
- `CNAME` — present only once a custom domain is configured; holds the apex domain.

## Editing

Open `index.html` and edit directly. Key spots:

- **Contact details** — WhatsApp number (`wa.me/971563480513`), email
  (`salesorison@gmail.com`), address, and **business hours** (currently a placeholder).
- **Social links** — TikTok, Instagram, WhatsApp in the contact section.
- **Products / B2B copy** — the four product cards and the B2B band.

Commit and push to `main`; the site redeploys automatically.
