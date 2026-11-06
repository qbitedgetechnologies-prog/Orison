# Orison website — SEO and local-growth plan

Last updated: 4 November 2026

This is the shared backlog for everyone working on the site. Read it before making changes,
and update the status in the same commit as the work. Do not mark an item **Done** without
evidence: a command output, a live URL, a screenshot, or a written business confirmation.

Status key: **Done** · **In progress** · **Blocked** (needs business/account access) ·
**Not started** · **User action**

Priority key: **P0** blocks trust or indexing · **P1** highest organic impact ·
**P2** content and local reach · **P3** measurement and iteration.

## Guardrails (apply to every item)

- Never publish invented prices, warranties, opening hours, delivery promises, repair
  timeframes or company facts. Use "Price on request" / "contact us to confirm" until the
  business supplies verified wording.
- Legal documents stay English-only by business decision. The EN/AR/UR experience applies
  to the marketing site.
- Do not create a fake Abu Dhabi branch, doorway pages for neighbourhoods, fake reviews,
  bought links, or `aggregateRating` markup for third-party reviews.
- Keep the name, address and phone number (NAP) identical everywhere: site, schema, Google
  Business Profile, directories and social profiles.
- Do not hand-edit `ar/index.html`, `ur/index.html` or `sitemap.xml`. They are generated.

## Current baseline (4 November 2026)

| Area | State |
| --- | --- |
| English site | `index.html`, single page with section anchors |
| Arabic site | `/ar/`, static generated page, `lang="ar" dir="rtl"` |
| Urdu site | `/ur/`, static generated page, `lang="ur" dir="rtl"` |
| Language switching | Plain links; `hreflang` and `x-default` in every page head |
| Canonicals | Present on `/`, `/ar/`, `/ur/` and the three policy pages |
| Social sharing | Open Graph + Twitter tags; `assets/og-image.jpg` (1200×630) |
| Images | AVIF + WebP through `<picture>`, JPEG fallback; original dimensions retained |
| Structured data | `Store`/`ElectronicsStore` + `WebSite` JSON-LD (no hours, geo or ratings yet) |
| Sitemap | Generated, includes locale alternates |
| 404 | Branded, `noindex, follow`, returns HTTP 404 for unknown paths |
| Analytics | `dataLayer` events for call/WhatsApp/email/social/language/form, plus `intent` on WhatsApp, triage events, `quote_complete`/`quote_restart` and the checklist enquiry; GA4 inert |
| Accessibility | axe-core 4: 0 WCAG 2.2 AA violations on 7 pages at 320–1440px; skip link, visible focus, landmarks, live triage and quote results |
| Conversion tools | Repair triage wizard at `#triage`, B2B quote builder at `#quote` and used-phone checklist at `#checklist`; every WhatsApp link carries a prefilled, localized message |
| Build | `npm run build`, validated by `npm run check` |
| HTTPS | Not enforced; `http://orisonigt.com/` still returns 200 |
| Google Business Profile | Not confirmed as claimed/completed |

## P0 — trust, access and verified facts

| ID | Task | Owner | Status | Acceptance criteria |
| --- | --- | --- | --- | --- |
| B1 | Confirm exact legal entity name, trade-licence address, monitored phone/email and trade-licence number | Business | Blocked | Written confirmation; update footer, policy pages, schema and `COMPLIANCE.md` together |
| B2 | Confirm real opening hours | Business | Blocked | Hours published consistently in footer, contact section, schema `openingHoursSpecification` and Google Business Profile — or left off everywhere |
| B3 | Supply genuine product/service prices and VAT treatment | Business | Blocked | Real model, condition, specs, price and VAT wording; replace "Price on request" cards and add `Product`/`Offer` schema only then |
| B4 | Confirm claims the business can honour (same-day repair, warranty, delivery, returns) | Business | Blocked | Exact terms in writing; add only in compliant wording |
| B5 | Legal review of Privacy, Refund and Terms | Business / legal | Blocked | Reviewer sign-off; update "Last updated" dates |
| B6 | Native Arabic and Urdu review of all 245 strings | Business / translator | Not started | Native reviewer signs off `i18n/ar.json` and `i18n/ur.json`; fix tone, dialect and technical terms |
| T1 | Enforce HTTPS | Account admin | Blocked | `http://` 301-redirects to `https://`; HSTS enabled; no mixed content |
| T2 | Verify the domain in Google Search Console and Bing Webmaster Tools; submit `sitemap.xml` | User | User action | Both properties verified; sitemap accepted with no errors |
| L1 | Claim and fully complete the Google Business Profile | Business | Not started | Verified; correct primary category, hours, phone, website, attributes, services, products and 10+ real photos |

## P1 — technical SEO foundation

| ID | Task | Status | Notes / acceptance criteria |
| --- | --- | --- | --- |
| S1 | Separate crawlable URLs for EN/AR/UR | Done | `/`, `/ar/`, `/ur/`; switcher uses links; `npm run check` enforces it |
| S2 | Canonical + `hreflang` + `x-default` | Done | Absolute URLs; all three locales reference each other and the sitemap repeats the alternates |
| S3 | Open Graph and Twitter cards with a real share image | Done | `assets/og-image.jpg`, 1200×630; absolute URLs |
| S4 | Baseline local-business structured data | Done | `Store`/`ElectronicsStore` + `WebSite`; enrich only after B1/B2 |
| S5 | Conversion events | Done | `contact_click` and `form_submit` in `js/analytics.js`; GA4 waits for an ID |
| S6 | Load the Urdu font only on the Urdu page | Done | English and Arabic load Manrope/Tajawal only |
| S7 | Branded 404 | Done | Returns HTTP 404 and `noindex, follow` |
| S8 | Generated sitemap | Done | Regenerated by `npm run build`; submission tracked in T2 |
| S9 | Move from one long page to intent-specific URLs | Not started | Build the pages in the URL map below, one at a time |
| S10 | Breadcrumbs + `Service` schema on service pages | Not started | `BreadcrumbList` and `Service` per page; no invented prices |
| S11 | Internal linking between service, category and contact pages | Not started | Every page reachable in ≤2 clicks from home; descriptive anchor text |
| S12 | Convert photography to WebP/AVIF with fallbacks | Done | `<picture>` with AVIF, WebP and JPEG fallback; dimensions unchanged; AVIF 68–82% and WebP 38–73% lighter than the JPEGs; `npm run check` enforces all three files |
| S13 | Performance budget and LCP check | Not started | Mobile LCP < 2.5s on a throttled connection; no CLS; document results |
| S14 | Accessibility audit | Done | axe-core 4 reports 0 WCAG 2.2 AA violations on 7 pages at 320–1440px; fixed WhatsApp button contrast (3.00 → 5.16:1), hero gradient text contrast, input focus rings, heading order, promo landmark, icon-only link name, mobile-menu focus return, skip-link focus target and triage live regions; `npm run check` now enforces the markup invariants |
| S15 | Security headers | Not started | Cloudflare: HSTS, `X-Content-Type-Options`, `Referrer-Policy`, frame protection, CSP after testing |

### Planned URL map

Build these only when there is genuine content and, where relevant, verified service details.
Each page needs a unique title, description, H1 and 400–800 words of original copy.

| URL | Primary intent | Status |
| --- | --- | --- |
| `/` | Brand + Satwa, Dubai positioning | Live |
| `/phone-repair-satwa/` | "phone repair Satwa", "iPhone repair Dubai" | Not started |
| `/laptop-repair-dubai/` | "laptop repair Dubai", "MacBook repair" | Not started |
| `/buy-used-phones-dubai/` | "used phones Dubai", "second hand mobile Dubai" | Not started |
| `/wholesale-mobile-phones-dubai/` | "mobile phone wholesale Dubai", "phone supplier UAE" | Not started |
| `/networking-equipment-dubai/` | "networking equipment supplier Dubai" | Not started |
| `/accessories/` | Chargers, cases, power banks, cables | Not started |
| `/about/` | Entity, licence, team, trust signals | Not started |
| `/contact/` | NAP, map link, hours, directions | Not started |

Abu Dhabi: only add location or delivery content if the business genuinely serves it. A page
saying "we supply businesses across the UAE, including Abu Dhabi" is acceptable when true;
a fake branch page is a doorway page and must not be built.

## P2 — local content, citations and reviews

| ID | Task | Owner | Status | Acceptance criteria |
| --- | --- | --- | --- | --- |
| C1 | Write the service pages in the URL map | Content + business | Not started | Each page meets the page definition of done below; facts verified |
| C2 | Build `/about/` and `/contact/` | Content | Not started | Licence and NAP visible; map link; no invented history |
| C3 | Publish four genuinely useful local guides | Content | Not started | Topics: checking a used phone in Satwa; iPhone screen repair options; new vs refurbished laptops; small-office networking in the UAE |
| C4 | Build consistent citations | Business | Not started | Apple Business Connect, Bing Places, 2GIS, Waze, Yandex Maps, Yellow Pages UAE, Dubai Chamber; identical NAP |
| C5 | Set up a review request routine | Business | Not started | Ask satisfied customers in person; reply to every review; never incentivise or fake reviews |
| C6 | Post to Google Business Profile weekly | Business | Not started | Real stock, offers or repair notes; no unverified claims |
| C7 | Maintain marketplace presence | Business | Not started | Dubizzle, Noon and Amazon.ae listings drive brand searches; link back where allowed |
| C8 | Earn local links | Business | Not started | Supplier/partner pages, Satwa business groups, Dubai SME communities, local tech blogs, one local event |
| C9 | Evaluate Abu Dhabi expansion | Business | Blocked | Only if there is a real location, delivery service or B2B coverage; otherwise keep it as an `areaServed` statement |

## P2 — conversion tools

These turn existing traffic into WhatsApp conversations. They must stay factual: no invented
prices, repair timeframes or diagnosis guarantees.

| ID | Task | Owner | Status | Acceptance criteria |
| --- | --- | --- | --- | --- |
| W1 | Repair triage wizard | Dev | Done | `#triage` on the home page; three steps, result view, back and restart; EN/AR/UR; prefilled WhatsApp summary; `triage_step`, `triage_complete`, `triage_restart` events; tested 1440–320px |
| W2 | Prefilled WhatsApp links by intent | Dev | Done | Every WhatsApp link carries `data-wa-intent`; localized hidden templates build `?text=`; `contact_click` includes `intent`; verified on all three locales |
| W3 | Sell or trade-in request flow | Dev + business | Not started | Model, storage, condition and photos; no instant valuation unless real pricing rules exist; prefilled WhatsApp or email handoff |
| W4 | B2B quote builder | Done | `#quote` section on the home page: category, quantity band, condition, company and optional contact details produce a localized summary and prefilled WhatsApp (`intent=b2b`) or email RFQ; no prices, lead times or automatic submission; `npm run check` enforces the live region and template tokens |
| W5 | Used-phone buying checklist | Done | `#checklist` section on the home page: six inspection cards (IMEI and paperwork, activation lock, battery health, screen and body, calls/data/Wi-Fi, what is included) plus a prefilled WhatsApp enquiry (`intent=checklist`); general guidance only, no condition guarantees or prices; `npm run check` enforces the matching template |
| W6 | Device Passport pilot | Business | Not started | QR tag on 20 used devices showing tested checklist, condition and what is included; only real, approved data |
| W7 | Review wall / repair stories | Business | Not started | Real customer outcomes with written consent; no stock-photo testimonials |

## P3 — measurement and iteration

| ID | Task | Owner | Status | Acceptance criteria |
| --- | --- | --- | --- | --- |
| M1 | Enable GA4 and update the Privacy Policy | Dev + business | Blocked | `GA4_ID` set; consent/cookie wording approved; events visible in GA4 |
| M2 | Track priority queries monthly | Business | Not started | "phone repair Satwa", "mobile wholesale Dubai", "used phones Dubai", "laptop repair Dubai" |
| M3 | Monthly report: Search Console + GBP + GA4 | Business | Not started | Impressions, clicks, calls, direction requests, WhatsApp clicks, form submits |
| M4 | Fix pages with impressions but no clicks | Content | Not started | Rewrite title/meta or improve content based on real query data |

## Definition of done for a new page

1. Unique `<title>`, meta description, canonical and one `<h1>`.
2. 400–800 words of original, fact-checked copy; no invented prices, hours or warranties.
3. Descriptive internal links from the home page and at least two sibling pages.
4. `BreadcrumbList` and, where relevant, `Service` JSON-LD.
5. Added to `tools/build-locales.js` sitemap list (and translated if the page is localized).
6. `npm run build` and `npm run check` pass.
7. Tested at 1440px, 768px, 390px and 320px: no overflow, no console errors, all images load.
8. NAP matches the footer and Google Business Profile exactly.

## Suggested sequencing

**Now (week 1):** B1–B3, T1, T2, L1. Nothing else compounds until NAP and HTTPS are settled.

**Weeks 2–3:** B6 native translation review, S9–S11 first two service pages, C2 contact page.

**Weeks 4–6:** remaining service pages, C3 guides, C4 citations, C5 review routine.

**Ongoing:** C6 weekly GBP posts, M2–M4 monthly measurement, one useful article a month.

## Change log

| Date | Change |
| --- | --- |
| 2026-11-03 | Localized `/ar/` and `/ur/` URLs, hreflang, canonicals, OG/Twitter, JSON-LD, analytics events, conditional Urdu font, generated sitemap, branded 404, `npm run build`/`check`, this plan |
| 2026-11-03 | Repair triage wizard and intent-tagged prefilled WhatsApp links; 174 strings in each dictionary; W1/W2 marked Done |
| 2026-11-03 | Photography converted to AVIF/WebP with JPEG fallbacks through `<picture>`; S12 marked Done |
| 2026-11-04 | Accessibility audit: contrast, focus rings, heading order, landmarks, live regions and menu focus fixed; axe-core clean at 320–1440px; S14 marked Done |
| 2026-11-04 | B2B quote builder at `#quote`: localized form, summary chips and prefilled WhatsApp/email RFQ; 226 strings in each dictionary; W4 marked Done |
| 2026-11-05 | Used-phone checklist at `#checklist`: six localized inspection cards, nav link and prefilled WhatsApp enquiry; 245 strings in each dictionary; W5 marked Done |
