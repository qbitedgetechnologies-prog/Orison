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
- Local link and layout checks are listed in the hand-off notes below.

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
9. **Contact form test.** The form posts to FormSubmit (`formsubmit.co/salesorison@gmail.com`).
   Submit one test enquiry and confirm the email arrives, the spam/activation flow works and
   the privacy notice is displayed. Also test the WhatsApp link, `tel:` link and `mailto:` link
   on a real phone.
10. **Deploy and re-test.** Merge/deploy the changes, then test every page and link on the
    live domain (desktop and mobile). Send the live URLs and screenshots to the compliance
    team as required by the developer checklist.
11. **Optional: translate the policy pages.** The main site is available in English, Arabic
    and Urdu, but the three policy pages are English-only. Add translations if the compliance
    team requires them.

## Assumptions made in this change

- The legal name, address, phone and email above are the best available from the existing
  site and public listings, not from the trade licence.
- "Price on request" is preferable to publishing invented prices. The content pack explicitly
  says to publish only real products and real current selling prices.
- The removal of same-day/opening-hours claims is a conservative compliance position, not a
  statement that the business does not offer those things.
