#!/usr/bin/env node
/* Validates the committed static site.
 *
 * Run after `npm run build`:
 *   npm run check
 *
 * Checks: required pages, locale attributes, SEO tags, hreflang, switcher
 * state, JSON-LD, internal links/assets, responsive images, accessibility
 * invariants, translation key parity, sitemap and robots.txt. Exits non-zero
 * if anything fails.
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://orisonigt.com';
const problems = [];
const notes = [];

function fail(message) {
  problems.push(message);
}

function read(rel) {
  const file = path.join(ROOT, rel);
  if (!fs.existsSync(file)) {
    fail('missing file: ' + rel);
    return '';
  }
  return fs.readFileSync(file, 'utf8');
}

function one(html, re) {
  const m = html.match(re);
  return m ? m[1] : null;
}

function attr(tag, name) {
  const m = tag.match(new RegExp('\\b' + name + '="([^"]*)"'));
  return m ? m[1] : null;
}

const LOCAL_PAGES = [
  'index.html',
  'ar/index.html',
  'ur/index.html',
  'privacy-policy/index.html',
  'refund-policy/index.html',
  'terms-and-conditions/index.html',
  '404.html'
];

const LOCALES = [
  { file: 'index.html', lang: 'en', dir: 'ltr', prefix: '/' },
  { file: 'ar/index.html', lang: 'ar', dir: 'rtl', prefix: '/ar/' },
  { file: 'ur/index.html', lang: 'ur', dir: 'rtl', prefix: '/ur/' }
];

/* ---------- pages ---------- */

for (const rel of LOCAL_PAGES) {
  const html = read(rel);
  if (!html) continue;

  if (!/<title[^>]*>[\s\S]*?\S[\s\S]*?<\/title>/.test(html)) {
    fail(rel + ': empty or missing <title>');
  }

  if (/\{year\}/.test(html)) fail(rel + ': contains an unbuilt {year} placeholder');
  if (html.includes('\uFFFD')) fail(rel + ': contains a Unicode replacement character');

  const ld = one(html, /<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (ld) {
    try {
      JSON.parse(ld);
    } catch (e) {
      fail(rel + ': invalid JSON-LD (' + e.message + ')');
    }
  }

  // Local root-relative links and assets must resolve to a real file.
  const refs = new Set();
  const re = /\b(?:src|href)="(\/[^"#?]*)"/g;
  let m;
  while ((m = re.exec(html))) refs.add(m[1]);

  const srcsetRe = /\bsrcset="([^"]+)"/g;
  while ((m = srcsetRe.exec(html))) {
    for (const part of m[1].split(',')) {
      const url = part.trim().split(/\s+/)[0];
      if (url.startsWith('/')) refs.add(url);
    }
  }

  for (const ref of refs) {
    let target;
    if (ref === '/') target = 'index.html';
    else if (ref.endsWith('/')) target = ref.slice(1) + 'index.html';
    else target = ref.slice(1);

    if (!fs.existsSync(path.join(ROOT, target))) {
      fail(rel + ': broken internal reference ' + ref + ' (expected ' + target + ')');
    }
  }

  // Every <picture> must offer AVIF, WebP and a sized JPEG fallback.
  const pictures = html.match(/<picture\b[\s\S]*?<\/picture>/g) || [];
  for (const pic of pictures) {
    if (!/type="image\/avif"/.test(pic)) fail(rel + ': <picture> is missing an AVIF source');
    if (!/type="image\/webp"/.test(pic)) fail(rel + ': <picture> is missing a WebP source');

    const img = pic.match(/<img\b[^>]*\bsrc="(\/[^"]+\.jpg)"[^>]*>/);
    if (!img) {
      fail(rel + ': <picture> is missing a JPEG <img> fallback');
      continue;
    }
    if (!/\bwidth="\d+"/.test(img[0]) || !/\bheight="\d+"/.test(img[0])) {
      fail(rel + ': <picture> fallback image is missing width/height');
    }

    const base = img[1].replace(/\.jpg$/, '');
    for (const ext of ['.avif', '.webp']) {
      if (!pic.includes(base + ext)) {
        fail(rel + ': <picture> does not reference ' + base + ext);
      }
      if (!fs.existsSync(path.join(ROOT, (base + ext).slice(1)))) {
        fail(rel + ': missing generated image ' + base + ext);
      }
    }
  }
  if (pictures.length) notes.push(rel + ': ' + pictures.length + ' responsive pictures');

  // Accessibility invariants (PLAN.md S14).
  const markup = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');

  const h1Count = (markup.match(/<h1\b/g) || []).length;
  if (h1Count !== 1) fail(rel + ': expected exactly one <h1>, found ' + h1Count);

  const levels = [...markup.matchAll(/<h([1-6])\b/g)].map(m => Number(m[1]));
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      fail(rel + ': heading order jumps from h' + levels[i - 1] + ' to h' + levels[i]);
      break;
    }
  }

  for (const tag of markup.match(/<svg\b[^>]*>/g) || []) {
    const decorative = /\baria-hidden="true"/.test(tag);
    const labelled = /\brole="img"/.test(tag) && /\baria-label(?:ledby)?="/.test(tag);
    if (!decorative && !labelled) {
      fail(rel + ': <svg> needs aria-hidden="true" or role="img" with a name');
    }
  }

  const mainTag = one(markup, /(<main\b[^>]*>)/);
  if (!mainTag) {
    fail(rel + ': missing <main> landmark');
  } else if (!/\btabindex="-1"/.test(mainTag)) {
    fail(rel + ': <main> needs tabindex="-1" so the skip link can move focus');
  }

  const labelFor = new Set([...markup.matchAll(/<label\b[^>]*\bfor="([^"]+)"/g)].map(m => m[1]));
  for (const tag of markup.match(/<(?:input|textarea)\b[^>]*>/g) || []) {
    if (/\btype="hidden"/.test(tag) || /\baria-hidden="true"/.test(tag)) continue;
    if (/\baria-label(?:ledby)?="/.test(tag)) continue;
    const id = attr(tag, 'id');
    if (!id || !labelFor.has(id)) {
      fail(rel + ': form control without a <label for> or aria-label: ' + tag.slice(0, 60));
    }
  }

  for (const tag of markup.match(/<a\b[^>]*\btarget="_blank"[^>]*>/g) || []) {
    if (!/\brel="[^"]*(?:noopener|noreferrer)/.test(tag)) {
      fail(rel + ': target="_blank" link needs rel="noopener"');
    }
  }

  for (const tag of markup.match(/<[^>]*data-i18n-aria="[^"]+"[^>]*>/g) || []) {
    if (!/\baria-label="/.test(tag)) {
      fail(rel + ': data-i18n-aria is set but aria-label is missing');
    }
  }

  const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const tag of markup.match(/<[^>]*aria-controls="[^"]+"[^>]*>/g) || []) {
    const target = attr(tag, 'aria-controls');
    if (!ids.has(target)) fail(rel + ': aria-controls points at missing id ' + target);
  }

  if (rel === 'index.html') {
    if (!/<[^>]*id="triageSummary"[^>]*role="status"/.test(html)) {
      fail('index.html: triage summary needs role="status" so results are announced');
    }
    if (!/<[^>]*id="triageStepLabel"[^>]*aria-live="polite"/.test(html)) {
      fail('index.html: triage step label needs aria-live="polite"');
    }
    if (!/<[^>]*id="quoteSummary"[^>]*role="status"/.test(html)) {
      fail('index.html: quote summary needs role="status" so results are announced');
    }
    if (!/<[^>]*id="quoteWhatsApp"[^>]*data-wa-intent="b2b"/.test(html)) {
      fail('index.html: quote WhatsApp handoff needs data-wa-intent="b2b"');
    }
    const quoteTemplate = one(html, /<div[^>]*id="quoteWaTemplate"[^>]*>([\s\S]*?)<\/div>/);
    for (const token of ['{category}', '{quantity}', '{condition}', '{company}']) {
      if (!quoteTemplate || quoteTemplate.indexOf(token) === -1) {
        fail('index.html: quote WhatsApp template is missing ' + token);
      }
    }
  }
}

/* ---------- locale pages ---------- */

for (const loc of LOCALES) {
  const html = read(loc.file);
  if (!html) continue;

  const htmlTag = one(html, /(<html\b[^>]*>)/);
  if (!htmlTag) {
    fail(loc.file + ': missing <html> tag');
    continue;
  }
  if (attr(htmlTag, 'lang') !== loc.lang) {
    fail(loc.file + ': expected <html lang="' + loc.lang + '">, got ' + attr(htmlTag, 'lang'));
  }
  if ((attr(htmlTag, 'dir') || 'ltr') !== loc.dir) {
    fail(loc.file + ': expected dir="' + loc.dir + '"');
  }

  const canonical = one(html, /<link rel="canonical"[^>]*href="([^"]+)"/);
  if (canonical !== SITE + loc.prefix) {
    fail(loc.file + ': canonical should be ' + SITE + loc.prefix + ', got ' + canonical);
  }

  const ogUrl = one(html, /<meta property="og:url"[^>]*content="([^"]+)"/);
  if (ogUrl !== SITE + loc.prefix) {
    fail(loc.file + ': og:url should be ' + SITE + loc.prefix + ', got ' + ogUrl);
  }

  const desc = one(html, /<meta name="description"[^>]*content="([^"]*)"/);
  if (!desc || desc.trim().length < 50) fail(loc.file + ': meta description missing or too short');

  const hreflangs = {};
  const hre = /<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g;
  let m;
  while ((m = hre.exec(html))) hreflangs[m[1]] = m[2];
  for (const [code, prefix] of [['en', '/'], ['ar', '/ar/'], ['ur', '/ur/'], ['x-default', '/']]) {
    if (hreflangs[code] !== SITE + prefix) {
      fail(loc.file + ': hreflang ' + code + ' should be ' + SITE + prefix + ', got ' + hreflangs[code]);
    }
  }

  const current = one(html, /data-lang="(en|ar|ur)"[^>]*aria-current="page"/);
  if (current !== loc.lang) {
    fail(loc.file + ': language switcher should mark ' + loc.lang + ' as current, got ' + current);
  }

  const markup = html
    .replace(/<style[\s\S]*?<\/style>/g, '')
    .replace(/<script[\s\S]*?<\/script>/g, '');
  const currentCount = (markup.match(/aria-current="page"/g) || []).length;
  if (currentCount !== 1) {
    fail(loc.file + ': expected exactly one aria-current="page", found ' + currentCount);
  }

  const fontLink = one(html, /id="fontLink"[^>]*href="([^"]+)"/);
  if (!fontLink) fail(loc.file + ': missing #fontLink');
  if (loc.lang === 'ur' && !/Noto\+Nastaliq\+Urdu/.test(fontLink || '')) {
    fail(loc.file + ': Urdu page must load Noto Nastaliq Urdu');
  }
  if (loc.lang !== 'ur' && /Noto\+Nastaliq\+Urdu/.test(fontLink || '')) {
    fail(loc.file + ': non-Urdu page must not load the Urdu font');
  }

  if (!/<script src="\/js\/analytics\.js" defer><\/script>/.test(html)) {
    fail(loc.file + ': missing deferred /js/analytics.js');
  }
}

/* ---------- translation key parity ---------- */

const dicts = {};
for (const code of ['en', 'ar', 'ur']) {
  const file = path.join(ROOT, 'i18n', code + '.json');
  if (!fs.existsSync(file)) {
    fail('missing translation file i18n/' + code + '.json');
    continue;
  }
  try {
    dicts[code] = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    fail('i18n/' + code + '.json is not valid JSON (' + e.message + ')');
  }
}

if (Object.keys(dicts).length === 3) {
  const base = Object.keys(dicts.en).sort();
  for (const code of ['ar', 'ur']) {
    const keys = Object.keys(dicts[code]).sort();
    const missing = base.filter(k => !(k in dicts[code]));
    const extra = keys.filter(k => !(k in dicts.en));
    if (missing.length) fail('i18n/' + code + '.json missing keys: ' + missing.join(', '));
    if (extra.length) fail('i18n/' + code + '.json has unknown keys: ' + extra.join(', '));
  }

  const html = read('index.html');
  const used = new Set();
  const re = /data-i18n(?:-html|-ph|-aria)?="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) used.add(m[1]);
  const untranslated = [...used].filter(k => !(k in dicts.en));
  if (untranslated.length) fail('index.html uses missing i18n keys: ' + untranslated.join(', '));
  notes.push(used.size + ' translation keys in use');
}

/* ---------- sitemap and robots ---------- */

const sitemap = read('sitemap.xml');
if (sitemap) {
  if (!/xmlns="http:\/\/www\.sitemaps\.org\/schemas\/sitemap\/0\.9"/.test(sitemap)) {
    fail('sitemap.xml: missing sitemap namespace');
  }
  if (!/xmlns:xhtml="http:\/\/www\.w3\.org\/1999\/xhtml"/.test(sitemap)) {
    fail('sitemap.xml: missing xhtml namespace for hreflang');
  }
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  for (const loc of ['/', '/ar/', '/ur/', '/privacy-policy/', '/refund-policy/', '/terms-and-conditions/']) {
    if (!locs.includes(SITE + loc)) fail('sitemap.xml: missing ' + SITE + loc);
  }
  for (const loc of locs) {
    if (!loc.startsWith(SITE + '/')) fail('sitemap.xml: unexpected host in ' + loc);
  }
  const altCount = (sitemap.match(/hreflang="/g) || []).length;
  if (altCount < 12) fail('sitemap.xml: expected hreflang alternates for all three locales');
}

const robots = read('robots.txt');
if (robots && !robots.includes('Sitemap: ' + SITE + '/sitemap.xml')) {
  fail('robots.txt: missing sitemap directive');
}

if (!fs.existsSync(path.join(ROOT, 'assets', 'og-image.jpg'))) {
  fail('missing assets/og-image.jpg (referenced by og:image and twitter:image)');
}

/* ---------- report ---------- */

console.log('Checked ' + LOCAL_PAGES.length + ' pages, ' + (sitemap ? 'sitemap.xml' : 'no sitemap') + ', robots.txt');
for (const note of notes) console.log('note: ' + note);

if (problems.length) {
  console.error('\n' + problems.length + ' problem(s):');
  for (const p of problems) console.error(' - ' + p);
  process.exit(1);
}

console.log('All checks passed.');
