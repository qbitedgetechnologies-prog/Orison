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

- Updated the English, Arabic and Urdu dictionaries so switching language no longer
  restores the old, non-compliant claims.
- Fixed the old `&amp;` entity leak in `data-i18n` strings (text was being set with
  `textContent`, so entities were displayed literally).

### 5. Technical checks

- Confirmed the three policy URLs were 404 on the live site before this change.
- Added `sitemap.xml` and `robots.txt`; both were also 404 before this change.
- Added a branded `404.html` ("You found a Work in Progress") so unknown URLs no longer
  show GitHub's default error page. It is marked `noindex, follow`.
- After deployment, re-tested the live site (desktop 1440px and mobile 390px): no console or
  page errors, no failed requests, no horizontal overflow, all images loaded, all policy links
  returning 200, language switching (EN/AR/UR) working, and the contact form validating.
- External destinations checked and returning 200: `wa.me/971563480513`,
  `formsubmit.co/salesorison@gmail.com`, TikTok and Instagram profiles.

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
10. **Send the evidence to the compliance team.** The changes are deployed and re-tested;
    send the live URLs and screenshots for sign-off, as the developer checklist requires.

## Assumptions made in this change

- The legal name, address, phone and email above are the best available from the existing
  site and public listings, not from the trade licence.
- "Price on request" is preferable to publishing invented prices. The content pack explicitly
  says to publish only real products and real current selling prices.
- The removal of same-day/opening-hours claims is a conservative compliance position, not a
  statement that the business does not offer those things.
