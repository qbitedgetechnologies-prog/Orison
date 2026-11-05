#!/usr/bin/env python3
"""Generate WebP and AVIF versions of the site photography.

The JPEG stays as the final fallback, so run this after adding or replacing a
photo in assets/ and reference all three files from a <picture> element.

Requirements: Python 3 with Pillow built with WebP and AVIF support.
    python -m pip install --upgrade pillow

Usage:
    python tools/optimize-images.py

Notes:
- Images keep their original pixel dimensions so width/height attributes and
  layout stay unchanged (no cumulative layout shift).
- og-image.jpg is skipped: social crawlers are most reliable with JPEG.
- EXIF is not copied into the generated files.
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
ASSETS = ROOT / "assets"
SKIP = {"og-image.jpg"}

WEBP_QUALITY = 80
AVIF_QUALITY = 50
AVIF_SPEED = 4


def human(size):
    return f"{size / 1024:.0f} KB"


def main():
    sources = sorted(p for p in ASSETS.glob("*.jpg") if p.name not in SKIP)
    if not sources:
        raise SystemExit("No JPEG sources found in assets/")

    for src in sources:
        with Image.open(src) as im:
            im = im.convert("RGB")
            width, height = im.size

            webp = src.with_suffix(".webp")
            avif = src.with_suffix(".avif")

            im.save(webp, "WEBP", quality=WEBP_QUALITY, method=6)
            im.save(avif, "AVIF", quality=AVIF_QUALITY, speed=AVIF_SPEED)

        original = src.stat().st_size
        webp_size = webp.stat().st_size
        avif_size = avif.stat().st_size
        print(
            f"{src.name} {width}x{height}: "
            f"jpg {human(original)} | "
            f"webp {human(webp_size)} ({(1 - webp_size / original) * 100:.0f}% smaller) | "
            f"avif {human(avif_size)} ({(1 - avif_size / original) * 100:.0f}% smaller)"
        )


if __name__ == "__main__":
    main()
