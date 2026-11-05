# Compliance review — Orison website

Source: `Orison Website document - compliance checklist.docx` (content pack last modified
20 October 2026).

Review date: 2 November 2026.

## What was changed

### 1. Legal pages

- Added `/privacy-policy/`, `/refund-policy/` and `/terms-and-conditions/` as standalone,
  publicly accessible pages with a clear page title and a "Last updated" date.
- Used the policy text from the compliance content pack, with drafting notes removed and
  placeholder fields replaced with the business details currently used on the site.
- Added a shared `css/legal.css` stylesheet so the pages work on desktop and mobile.
- Added `sitemap.xml` and `robots.txt` so the pages can be discovered.

### 2. Footer and contact form

- Footer now shows the legal name, full address, phone/WhatsApp, email and links to all
  three policies.
- Footer links follow the content pack: Home, Products & Services, B2B Trading, Contact,
  Privacy Policy, Refund Policy, Terms & Conditions.
- Contact form now has the required privacy notice and a direct link to the Privacy Policy.
- Added a `tel:` link alongside the WhatsApp link so the phone number can be tested/called.

### 3. Homepage wording and claims

- Replaced the hero headline and supporting copy with the content-pack wording.
- Replaced the trust strip with the three approved service highlights.
- Replaced the product/service category descriptions with the approved wording.
- Replaced the B2B section with the approved wholesale wording and "Request a B2B quotation".
- Replaced the contact section wording with the approved version.
- Removed unsupported or unverified claims from the public copy:
  - "Same-day repairs" / "often same day"
  - "Screens & batteries while you wait"
  - "All major brands in stock"
  - "Bulk pricing" / "Reseller pricing"
  - "Open daily 12pm–12am" (opening hours now say "contact us to confirm")
  - "Fixed" / guaranteed repair outcomes
- Added a "Featured products & prices" section. Because no genuine product/price data was
  supplied, each card says "Price on request" and the section explains that the exact model,
  condition, specifications, price and VAT treatment are confirmed in a written quotation.

### 4. Language support

- Moved the English, Arabic and Urdu dictionaries out of the inline JavaScript into
  `i18n/en.json`, `i18n/ar.json` and `i18n/ur.json` (179 keys each).
- Added crawlable localized URLs: `/ar/` and `/ur/` are generated from `index.html` by
  `tools/build-locales.js`, with the correct `lang`/`dir`, translated title and description,
  self-referencing canonical, `hreflang` for `en`/`ar`/`ur`/`x-default`, and localized
  Open Graph tags.
- Replaced the JavaScript language dropdown with plain links, so search engines see each
  language's content in the HTML instead of only after a client-side text swap.
- Fixed the old `&amp;` entity leak in `data-i18n` strings (text was being set with
  `textContent`, so entities were displayed literally).
- The Arabic and Urdu copy is generated from the existing translations and still needs a
  native review before it is treated as final (tracked as B6 in `PLAN.md`).

### 5. Technical checks

- Confirmed the three policy URLs were 404 on the live site before this change.
- Added `sitemap.xml` and `robots.txt`; both were also 404 before this change.
- Added a branded `404.html` ("You found a Work in Progress") so unknown URLs no longer
  show GitHub's default error page. It is marked `noindex, follow`.
- The previous deployment was re-tested live (desktop 1440px and mobile 390px): no console
  or page errors, no failed requests, no horizontal overflow, all images loaded, all policy
  links returning 200, language switching (EN/AR/UR) working, and the contact form validating.
- External destinations checked and returning 200: `wa.me/971563480513`,
  `formsubmit.co/salesorison@gmail.com`, TikTok and Instagram profiles.

### 6. SEO implementation (3 November 2026)

- Added canonical tags, Open Graph and Twitter card tags, and a 1200×630 share image at
  `assets/og-image.jpg`.
- Added `Store`/`ElectronicsStore` and `WebSite` JSON-LD. The address is the one already
  published on the site; opening hours, geo coordinates, prices and ratings are deliberately
  omitted until the business confirms them.
- Added conversion tracking in `js/analytics.js` for phone, WhatsApp, email, social and
  language clicks plus form submits. Google Analytics remains disabled until a measurement
  ID is set and the Privacy Policy is updated.
- Added `npm run build` and `npm run check`. The checker validates internal links and assets,
  locale attributes, canonical/hreflang/OG tags, JSON-LD, translation key parity, the sitemap,
  `robots.txt` and the responsive image files.
- Converted the photography to AVIF and WebP with JPEG fallbacks through `<picture>`.
  Original pixel dimensions are retained, so `width`/`height` and layout are unchanged.
  Measured savings against the JPEGs: AVIF 68–82%, WebP 38–73%. `og-image.jpg` stays JPEG for
  social crawlers.
- Local testing of `/`, `/ar/` and `/ur/` at 1440, 768, 430, 390, 360 and 320px found no
  horizontal overflow, no console errors, no failed requests, and all images loaded after
  scrolling. The localized pages still need a live re-test after deployment.
- The full prioritised backlog, including items that need the business, is in `PLAN.md`.

### 7. Accessibility audit (4 November 2026)

- Ran axe-core 4 against all seven pages at 320, 360, 430, 768 and 1440px. The final run
  reports **zero** WCAG 2.0/2.1/2.2 A and AA violations and zero best-practice violations.
- Fixed a real contrast failure: white text on the WhatsApp buttons measured 3.00:1, below
  the 4.5:1 requirement for normal text. The button green is now `#0f7b6c`, which measures
  5.16:1. The hero gradient headline also started at 2.30:1 against white; the gradient now
  starts at `#0898ae` (3.44:1), which clears the 3:1 threshold for large text.
- Restored visible keyboard focus on the contact form and triage inputs. A later
  `outline:none` rule had been overriding the global `:focus-visible` style, leaving only a
  low-contrast border change.
- Corrected the heading outline: the two product/repair feature headings are now `h2` and the
  category captions are `h3`, so the page no longer jumps from `h1` to `h3` or `h2` to `h4`.
- Wrapped the promo bar in an `aside` landmark so it is no longer outside every landmark.
- Fixed the header WhatsApp link, which had no accessible name between 561px and 900px
  because its visible label was `display:none`. The label is now visually hidden instead of
  removed, so screen readers still announce it.
- The mobile menu now declares `aria-controls`, and Escape returns focus to the menu button
  instead of leaving it on a hidden link.
- The skip link now moves focus into `<main tabindex="-1">`; the same fix was applied to the
  policy pages and the 404 page.
- Triage step changes are announced through `aria-live="polite"`, and the result summary is
  a `role="status"` region. Focus already moved to each new heading.
- Marked every decorative SVG `aria-hidden="true"` and localised the new landmark labels
  into Arabic and Urdu (5 new strings, 179 in each dictionary).
- `npm run check` now fails on a missing or duplicate `h1`, a skipped heading level, an
  unlabelled SVG or form control, a `target="_blank"` link without `rel="noopener"`, a
  `data-i18n-aria` element without `aria-label`, an `aria-controls` pointing at a missing id,
  or a `<main>` that the skip link cannot focus.

No business information, prices, hours or claims were changed by this audit.

## Decisions recorded

- **Legal documents are English-only.** The Privacy Policy, Refund and Return Policy and
  Terms and Conditions are published in English by business decision. The EN/AR/UR switcher
  applies to the marketing site only. Each policy page notes that translations are available
  on request.
- **Contact form delivery is confirmed by the business.** The form posts to FormSubmit with
  captcha, honeypot and a table template; no further action is required.
- **"Price on request"** is used instead of invented prices until genuine price data is supplied.

## Still needs the business / compliance team

These items cannot be safely completed from the code alone. They need verified company
information or a business decision.

1. **Exact legal entity name.** The site and policies currently use "Orison International
   General Trading". A public directory lists "ORISON INTERNATIONAL GENERAL TRADING CO
   (L.L.C)". Confirm the exact name on the UAE trade licence and update the policy pages,
   footer and `COMPLIANCE.md` if it differs.
2. **Full verified business address.** The site now uses "Ozair Suroor Salem Building 1,
   327 Al Satwa Road, Al Satwa, Dubai, United Arab Emirates", sourced from a public business
   directory. Confirm it against the trade licence / tenancy contract before publishing.
3. **Monitored phone and email.** Confirm that `+971 56 348 0513` and
   `salesorison@gmail.com` are monitored and correct. The content pack flags both as
   "[verify before publishing]".
4. **Opening hours.** The site no longer states specific hours. Confirm the real hours and
   decide whether to publish them; if published, add them back consistently in the promo bar,
   hero, contact section and footer.
5. **Genuine product and service prices.** The content pack asks for a selection of real
   products with exact model, condition, specifications, price and VAT treatment. No price
   data was supplied, so the site currently says "Price on request". If the compliance team
   requires a priced selection, supply the rows and they can replace the pricing cards.
6. **Repair pricing table (optional).** The content pack says to include this only if the
   business has genuine approved prices. It is intentionally omitted.
7. **Claims the business can actually honour.** If the business genuinely offers same-day
   repairs, a defined warranty, delivery, returns or repair timeframes, confirm the exact
   terms and they can be added back in compliant wording. Until then, the site avoids
   promising them.
8. **Legal review of the three policies.** The content pack says the drafts are not legal
   advice. Have the policies reviewed against actual practices and applicable UAE law.
9. **On-device link test (optional).** Open the WhatsApp, `tel:` and `mailto:` links from a
   phone to confirm they launch the right apps. The web form itself is confirmed working.
10. **Send the evidence to the compliance team.** Once this change is deployed and re-tested,
    send the live URLs and screenshots for sign-off, as the developer checklist requires.
11. **Native review of Arabic and Urdu.** The `/ar/` and `/ur/` pages are generated from the
    existing translations. A native speaker should review tone, dialect and technical terms
    across all 179 strings before the localized pages are treated as final.
12. **HTTPS enforcement.** `http://orisonigt.com/` still returns 200 without redirecting.
    Enable "Always Use HTTPS" (or HSTS) at Cloudflare / the Pages account level.
13. **SEO backlog ownership.** `PLAN.md` lists the remaining local-SEO work, including the
    Google Business Profile, citations, service pages and verified business data.

## Assumptions made in this change

- The legal name, address, phone and email above are the best available from the existing
  site and public listings, not from the trade licence.
- "Price on request" is preferable to publishing invented prices. The content pack explicitly
  says to publish only real products and real current selling prices.
- The removal of same-day/opening-hours claims is a conservative compliance position, not a
  statement that the business does not offer those things.
