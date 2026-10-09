# ImgLove — Free Online Image Tools

An iloveimg.com-style image tools website. **100% of image processing runs in the
browser** (Canvas 2D API + WebAssembly decoders) — no server, no uploads, no accounts.

## Stack

- **Astro 5** (static, 20 locales × 12 pages) + **React 18** islands (`client:only`) for tools
- **Tailwind CSS 3** with CSS-variable design tokens (verified against iloveimg.com's live CSS)
- **Phosphor icons** (`@phosphor-icons/react` in tools, `astro-icon` + `@iconify-json/ph` in pages)
- **i18n**: 20 locales (`en hi bn as es pt fr ar ur zh ja ko ru id de tr it vi th ta`),
  `/{locale}/…` URLs, hreflang + x-default, sitemap, RTL for ar/ur
- **Image engine** (`src/engine/image.ts`): canvas pipeline, median-cut PNG quantization,
  lazy WASM HEIC decode (`heic2any`), ZIP batch download (`jszip`)

## Tools (all client-side)

| Slug | What it does |
|---|---|
| `compress-image` | Quality slider; JPEG/WebP re-encode, PNG median-cut quantization |
| `resize-image` | Pixels or percent, aspect-lock |
| `crop-image` | Pointer-driven crop box, aspect presets |
| `convert-image` | JPG / PNG / WEBP output (+HEIC input via WASM) |
| `rotate-image` | 90° steps + horizontal/vertical flip |
| `watermark-image` | Text, 6 positions, opacity, size, color |
| `meme-generator` | Impact-style top/bottom captions |
| `photo-editor` | 7 filters + brightness/contrast/saturation/blur |

Shared UI lives in `src/components/react/ToolShell.tsx` (dropzone → files → settings →
process → results → download/ZIP). New tool = settings JSX + `process()` function.

## Design

Clean minimalist light theme matching iloveimg.com (verified 2026-10-09 via live CSS audit):
brand blue `#4d90fe` (hover `#2c64c0`), page `#f5f5fa`, ink `#33333b`, 8px buttons,
12px cards, 60px fixed header, dark `#26262e` footer. No gradients, no glow.

## Develop / build

```bash
npm install
npm run dev      # http://localhost:4321/en/
npm run build    # static output in dist/
```
