# Xochi Face — Brand Kit assets

Source: `Xochi-Face-Brand-Kit-2026.pdf` (Chie / Eani Creative, v0.1 Spring 2026).

All artwork here was extracted programmatically from the PDF. The embedded images
were Flate-encoded bitmaps with separate soft-mask alpha channels, so they were
decoded and recomposited into transparent PNGs.

## Shipped assets — `public/brand/`

- `mark/portrait-mark.png` — primary portrait mark, 1125×1126, Sienna 900 (#3B1D04) on transparent.
- `mark/portrait-mark-750.png` — same artwork at 750×751.
- `ornaments/*.png` — the twelve garden ornaments, 180×180, transparent.
- `borders/*.png` — the three repeating strips, 600×100, transparent. Tile horizontally.

## Reference only — not served

- `reference/founders-letter-comp.png` — the long-form letter layout from the deck.
- `reference/instagram-tile-0*.png` — the six 1080×1440 social tiles, showing the
  design language already applied. Best available evidence of intended pacing.
- `raw/` — the complete unfiltered extraction (51 files), kept so nothing is lost.
- `brand-kit-text.txt` — full text of the deck.

## Known gaps

- **Ornament vectors.** These PNGs are 180px — fine as small accents, too small for
  display use. The deck links a Drive folder for source files:
  `https://drive.google.com/drive/folders/1d41YSG-AU72jtI0iFBkRzIrU7pgYoCUE`
  (not accessible here). SVG originals should replace these when available.
- **`ornaments/flower-04.png`** — the deck names eleven of the twelve motifs
  (xochitl, six-petal, marigold, sun, double moon, branch, agave, seed, sprout,
  hummingbird, offering). This fourth flower's name did not survive extraction.
  Filename is a placeholder pending confirmation.
- **The wordmark and primary lockup are not raster assets.** "xochi face." is set
  live in Fraunces Light/350, so it is reproduced as text, not an image.
- **No photography** ships with the kit.
