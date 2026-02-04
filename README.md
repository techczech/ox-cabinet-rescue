# Cabinet Prototype

Prototype React app that renders Cabinet (Oxford) source/exhibition entries from local JSON, with rich text, full-size images scraped from Cabinet pages, and a 3D astrolabe demo model.

## What’s Included

- Scraper that pulls content from `https://www.cabinet.ox.ac.uk` and replaces mock placeholders.
- Rich HTML formatting preserved in `description`/`commentary` (paragraphs, italics, bold, links).
- Full-size images (thumbnails normalized to originals).
- Backfill of images by following related-source links when a page has no direct images.
- 3D model for the astrolabe demo using a public Sketchfab embed.

## Key Files

- `scripts/scrape_cabinet.py`
  - Scrapes Cabinet pages.
  - Normalizes images to full-size.
  - Preserves rich HTML in descriptions.
  - Backfills images via related-source links.

- `src/components/RichText.tsx`
  - Renders HTML when present, falls back to plain text.

- `src/pages/SourceDetail.tsx`
  - Uses `RichText` for descriptions.
  - Supports Sketchfab embeds for 3D models.

- `src/pages/ExhibitionObject.tsx`
  - Uses `RichText` for descriptions/commentary.

- `src/pages/ExhibitionDetail.tsx`
  - Uses `RichText` for exhibition descriptions.

- `src/data/sources/astrolabe.json`
  - Updated to a real 3D astrolabe model (Sketchfab embed).

## Scraping Cabinet Content

Run the scraper to refresh all JSON entries with `cabinetUrl`:

```bash
python scripts/scrape_cabinet.py
```

This updates:
- `description` and `commentary` (rich HTML)
- `tags`
- `images`
- `cabinetFields` (raw field data)
- `scrapedFromCabinet`, `imageSource`, and `isMockData`

## Dev

```bash
npm install
npm run dev
```

Hard refresh after a scrape to ensure JSON imports are reloaded.

## Notes

- Some Cabinet pages do not expose images directly in HTML; the scraper pulls them from `source_media` (Drupal settings) and related-source links.
- Sketchfab embed is used for the astrolabe demo. If you need local hosting of a GLB, swap `model3d.url` to a local asset and use `<model-viewer>`.
