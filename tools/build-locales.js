#!/usr/bin/env node
/* Builds the localized pages and sitemap.
 *
 * Source of truth:
 *   index.html        English page (hand-edited)
 *   i18n/en.json      English strings (reference)
 *   i18n/ar.json      Arabic strings
 *   i18n/ur.json      Urdu strings
 *
 * Output (generated, committed, do not hand-edit):
 *   ar/index.html
 *   ur/index.html
 *   sitemap.xml
 *
 * Usage:  npm run build      (or: node tools/build-locales.js)
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const SITE = 'https://orisonigt.com';
const YEAR = new Date().getFullYear();

const LOCALES = {
  ar: {
    prefix: 'ar/',
    lang: 'ar',
    dir: 'rtl',
    ogLocale: 'ar_AE',
    fonts: 'family=Manrope:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800'
  },
  ur: {
    prefix: 'ur/',
    lang: 'ur',
    dir: 'rtl',
    ogLocale: 'ur_PK',
    fonts: 'family=Manrope:wght@400;500;600;700;800&family=Tajawal:wght@400;500;700;800&family=Noto+Nastaliq+Urdu:wght@400;500;600;700'
  }
};

const HTML_KEYS = new Set(['promo', 'hero.h1', 'form.privacy', 'footer.cr', 'quote.consent']);

/* ---------- helpers ---------- */

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeAttr(value) {
  return escapeHtml(value).replace(/"/g, '&quot;');
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function replaceTextNode(html, key, value) {
  const re = new RegExp(
    '(<([a-zA-Z][a-zA-Z0-9-]*)\\b[^>]*\\bdata-i18n="' + escapeRegExp(key) + '"[^>]*>)([\\s\\S]*?)(</\\2>)',
    'g'
  );
  return html.replace(re, (match, open, tag, inner, close) => open + escapeHtml(value) + close);
}

function replaceHtmlNode(html, key, value) {
  const re = new RegExp(
    '(<([a-zA-Z][a-zA-Z0-9-]*)\\b[^>]*\\bdata-i18n-html="' + escapeRegExp(key) + '"[^>]*>)([\\s\\S]*?)(</\\2>)',
    'g'
  );
  return html.replace(re, (match, open, tag, inner, close) => open + value + close);
}

function replaceAttrByMarker(html, marker, attr, dict) {
  const tagRe = new RegExp('<[^>]*\\b' + marker + '="[^"]+"[^>]*>', 'g');
  const keyRe = new RegExp('\\b' + marker + '="([^"]+)"');
  const attrRe = new RegExp('\\b' + attr + '="[^"]*"');

  return html.replace(tagRe, tag => {
    const m = tag.match(keyRe);
    if (!m) return tag;
    const value = dict[m[1]];
    if (value == null) return tag;
    if (!attrRe.test(tag)) return tag;
    return tag.replace(attrRe, attr + '="' + escapeAttr(value) + '"');
  });
}

function setSeoAttr(html, marker, attr, value) {
  const re = new RegExp('(<[^>]*\\bdata-seo="' + marker + '"[^>]*\\b' + attr + '=")[^"]*(")');
  if (!re.test(html)) throw new Error('SEO slot not found: ' + marker + '/' + attr);
  return html.replace(re, (m, open, close) => open + escapeAttr(value) + close);
}

function setTitle(html, value) {
  const re = /(<title[^>]*>)[\s\S]*?(<\/title>)/;
  if (!re.test(html)) throw new Error('title element not found');
  return html.replace(re, (m, open, close) => open + escapeHtml(value) + close);
}

function assertKeys(html, dict, locale) {
  const keys = new Set();
  const re = /data-i18n(?:-html|-ph|-aria)?="([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) keys.add(m[1]);
  const missing = [...keys].filter(k => !(k in dict));
  if (missing.length) {
    throw new Error(locale + ': missing translations for ' + missing.join(', '));
  }
}

/* ---------- build one locale ---------- */

function buildLocale(code) {
  const cfg = LOCALES[code];
  const dict = JSON.parse(fs.readFileSync(path.join(ROOT, 'i18n', code + '.json'), 'utf8'));
  let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

  assertKeys(html, dict, code);

  const url = SITE + '/' + cfg.prefix;

  html = html.replace(/<html lang="en">/, '<html lang="' + cfg.lang + '" dir="' + cfg.dir + '">');
  html = setTitle(html, dict['meta.title']);
  html = setSeoAttr(html, 'desc', 'content', dict['meta.desc']);
  html = setSeoAttr(html, 'canonical', 'href', url);
  html = setSeoAttr(html, 'ogurl', 'content', url);
  html = setSeoAttr(html, 'oglocale', 'content', cfg.ogLocale);
  html = setSeoAttr(html, 'ogtitle', 'content', dict['meta.title']);
  html = setSeoAttr(html, 'ogdesc', 'content', dict['meta.desc']);
  html = setSeoAttr(html, 'twtitle', 'content', dict['meta.title']);
  html = setSeoAttr(html, 'twdesc', 'content', dict['meta.desc']);

  html = html.replace(
    /(<link[^>]*id="fontLink"[^>]*href=")[^"]*(")/,
    (m, open, close) => open + 'https://fonts.googleapis.com/css2?' + cfg.fonts + '&display=swap' + close
  );

  // Mark the current language in the switcher
  html = html.replace(/(<a\b[^>]*\bdata-lang="(en|ar|ur)"[^>]*)>/g, (m, attrs, lang) => {
    attrs = attrs.replace(/\s*aria-current="page"/, '');
    if (lang === code) attrs += ' aria-current="page"';
    return attrs + '>';
  });

  // Footer "Home" link points at the locale root
  html = html.replace(
    '<a href="/" data-i18n="foot.home">',
    '<a href="/' + cfg.prefix + '" data-i18n="foot.home">'
  );

  // Text, HTML and attribute translations
  for (const [key, value] of Object.entries(dict)) {
    if (key === 'meta.title' || key === 'meta.desc') continue;
    if (HTML_KEYS.has(key)) {
      html = replaceHtmlNode(html, key, value.replace('{year}', '<span data-year>' + YEAR + '</span>'));
    } else {
      html = replaceTextNode(html, key, value);
    }
  }
  html = replaceAttrByMarker(html, 'data-i18n-ph', 'placeholder', dict);
  html = replaceAttrByMarker(html, 'data-i18n-aria', 'aria-label', dict);

  const outDir = path.join(ROOT, cfg.prefix.replace(/\/$/, ''));
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');
  console.log('built', cfg.prefix + 'index.html', Buffer.byteLength(html) + ' bytes');
}

/* ---------- sitemap ---------- */

function buildSitemap() {
  const lastmod = new Date().toISOString().slice(0, 10);
  const alternates = [
    ['en', SITE + '/'],
    ['ar', SITE + '/ar/'],
    ['ur', SITE + '/ur/'],
    ['x-default', SITE + '/']
  ];

  const pages = [
    { loc: SITE + '/', changefreq: 'weekly', priority: '1.0', alt: true },
    { loc: SITE + '/ar/', changefreq: 'weekly', priority: '0.9', alt: true },
    { loc: SITE + '/ur/', changefreq: 'weekly', priority: '0.9', alt: true },
    { loc: SITE + '/privacy-policy/', changefreq: 'yearly', priority: '0.4' },
    { loc: SITE + '/refund-policy/', changefreq: 'yearly', priority: '0.4' },
    { loc: SITE + '/terms-and-conditions/', changefreq: 'yearly', priority: '0.4' }
  ];

  const body = pages.map(p => {
    const links = p.alt
      ? alternates
          .map(a => '    <xhtml:link rel="alternate" hreflang="' + a[0] + '" href="' + a[1] + '"/>\n')
          .join('')
      : '';
    return (
      '  <url>\n' +
      '    <loc>' + p.loc + '</loc>\n' +
      '    <lastmod>' + lastmod + '</lastmod>\n' +
      '    <changefreq>' + p.changefreq + '</changefreq>\n' +
      '    <priority>' + p.priority + '</priority>\n' +
      links +
      '  </url>\n'
    );
  }).join('');

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n' +
    '        xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
    body +
    '</urlset>\n';

  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml, 'utf8');
  console.log('built sitemap.xml', Buffer.byteLength(xml) + ' bytes');
}

/* ---------- run ---------- */

for (const code of Object.keys(LOCALES)) buildLocale(code);
buildSitemap();
