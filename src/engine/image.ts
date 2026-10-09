/**
 * Shared client-side image engine.
 * Everything runs in the browser (Canvas 2D API). No uploads, no server.
 * HEIC/HEIF input is decoded via a lazily-loaded WASM decoder (heic2any).
 */

export type OutFormat = 'jpeg' | 'png' | 'webp';

export const FORMAT_META: Record<OutFormat, { mime: string; ext: string; label: string; supportsQuality: boolean }> = {
  jpeg: { mime: 'image/jpeg', ext: 'jpg', label: 'JPG', supportsQuality: true },
  png: { mime: 'image/png', ext: 'png', label: 'PNG', supportsQuality: false },
  webp: { mime: 'image/webp', ext: 'webp', label: 'WEBP', supportsQuality: true },
};

export interface LoadedImage {
  img: HTMLImageElement;
  width: number;
  height: number;
  name: string;
  size: number;
  type: string;
  blob: Blob;
}

const HEIC_TYPES = ['image/heic', 'image/heif'];
const HEIC_EXTS = ['.heic', '.heif'];

export function isHeicFile(file: File): boolean {
  if (HEIC_TYPES.includes(file.type.toLowerCase())) return true;
  const n = file.name.toLowerCase();
  return HEIC_EXTS.some((e) => n.endsWith(e));
}

export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || isHeicFile(file);
}

/** Load a File into an <img>. HEIC is converted to PNG in-browser first. */
export async function loadImage(file: File): Promise<LoadedImage> {
  let blob: Blob = file;
  let name = file.name;
  if (isHeicFile(file)) {
    const { default: heic2any } = await import('heic2any');
    const out = await heic2any({ blob: file, toType: 'image/png' });
    const first = Array.isArray(out) ? out[0] : out;
    blob = first as Blob;
    name = file.name.replace(/\.(heic|heif)$/i, '.png');
  }
  const url = URL.createObjectURL(blob);
  try {
    const img = await new Promise<HTMLImageElement>((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Could not read this image file.'));
      el.src = url;
    });
    // Browsers apply EXIF orientation when decoding into <img>; naturalWidth/Height are oriented.
    return { img, width: img.naturalWidth, height: img.naturalHeight, name, size: file.size, type: file.type, blob };
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function createCanvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = Math.max(1, Math.round(w));
  c.height = Math.max(1, Math.round(h));
  return c;
}

/** Draw an image (or canvas) onto a new canvas at the given size. */
export function drawScaled(
  src: CanvasImageSource,
  dw: number,
  dh: number,
  opts: { background?: string } = {},
): HTMLCanvasElement {
  const c = createCanvas(dw, dh);
  const ctx = c.getContext('2d')!;
  if (opts.background) {
    ctx.fillStyle = opts.background;
    ctx.fillRect(0, 0, c.width, c.height);
  }
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(src, 0, 0, c.width, c.height);
  return c;
}

export function canvasToBlob(canvas: HTMLCanvasElement, format: OutFormat, quality = 0.85): Promise<Blob> {
  const meta = FORMAT_META[format];
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Encoding failed in this browser.'))),
      meta.mime,
      meta.supportsQuality ? quality : undefined,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

export function withExtension(name: string, ext: string, suffix = ''): string {
  const base = name.replace(/\.[a-z0-9]+$/i, '');
  return `${base}${suffix}.${ext}`;
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

/** dataURL of a canvas, for previews */
export function canvasPreview(canvas: HTMLCanvasElement, maxDim = 900): string {
  const scale = Math.min(1, maxDim / Math.max(canvas.width, canvas.height));
  if (scale >= 1) return canvas.toDataURL('image/jpeg', 0.85);
  const c = drawScaled(canvas, canvas.width * scale, canvas.height * scale);
  return c.toDataURL('image/jpeg', 0.85);
}

/** Copy a canvas (used as a working surface). */
export function cloneCanvas(src: HTMLCanvasElement): HTMLCanvasElement {
  const c = createCanvas(src.width, src.height);
  c.getContext('2d')!.drawImage(src, 0, 0);
  return c;
}

/**
 * Median-cut color quantization to 256 colors (for real PNG size savings).
 * Alpha channel is preserved as-is.
 */
export function quantize(src: ImageData, maxColors: number): ImageData {
  const data = src.data;
  const n = src.width * src.height;
  // Collect opaque-ish pixel indices
  const idx: number[] = [];
  for (let i = 0; i < n; i++) idx.push(i);
  interface Box { pixels: number[]; rmin: number; rmax: number; gmin: number; gmax: number; bmin: number; bmax: number }
  const channel = (i: number, c: number) => data[i * 4 + c];
  function makeBox(pixels: number[]): Box {
    let rmin = 255, rmax = 0, gmin = 255, gmax = 0, bmin = 255, bmax = 0;
    for (const i of pixels) {
      const r = data[i * 4], g = data[i * 4 + 1], b = data[i * 4 + 2];
      if (r < rmin) rmin = r; if (r > rmax) rmax = r;
      if (g < gmin) gmin = g; if (g > gmax) gmax = g;
      if (b < bmin) bmin = b; if (b > bmax) bmax = b;
    }
    return { pixels, rmin, rmax, gmin, gmax, bmin, bmax };
  }
  let boxes: Box[] = [makeBox(idx)];
  const target = Math.max(2, Math.min(256, Math.round(maxColors)));
  while (boxes.length < target) {
    // Split the box with the largest channel range * pixel count
    let bi = -1, best = -1;
    boxes.forEach((b, i) => {
      if (b.pixels.length < 2) return;
      const range = Math.max(b.rmax - b.rmin, b.gmax - b.gmin, b.bmax - b.bmin);
      const score = range * b.pixels.length;
      if (score > best) { best = score; bi = i; }
    });
    if (bi < 0) break;
    const box = boxes[bi];
    const ranges = [box.rmax - box.rmin, box.gmax - box.gmin, box.bmax - box.bmin];
    const c = ranges.indexOf(Math.max(...ranges));
    const sorted = [...box.pixels].sort((a, b2) => channel(a, c) - channel(b2, c));
    const mid = Math.floor(sorted.length / 2);
    boxes.splice(bi, 1, makeBox(sorted.slice(0, mid)), makeBox(sorted.slice(mid)));
  }
  const palette = boxes.map((b) => {
    let r = 0, g = 0, bl = 0;
    for (const i of b.pixels) { r += data[i * 4]; g += data[i * 4 + 1]; bl += data[i * 4 + 2]; }
    const k = Math.max(1, b.pixels.length);
    return [Math.round(r / k), Math.round(g / k), Math.round(bl / k)];
  });
  const out = new ImageData(src.width, src.height);
  const boxOf = new Map<number, number>();
  boxes.forEach((b, bi2) => { for (const i of b.pixels) boxOf.set(i, bi2); });
  for (let i = 0; i < n; i++) {
    const p = palette[boxOf.get(i) ?? 0];
    out.data[i * 4] = p[0]; out.data[i * 4 + 1] = p[1]; out.data[i * 4 + 2] = p[2];
    out.data[i * 4 + 3] = data[i * 4 + 3];
  }
  return out;
}

/** Back-compat wrapper: quantize to 256 colors. */
export function quantizeTo256(src: ImageData): ImageData {
  return quantize(src, 256);
}

/**
 * Map a 10-100 quality value to a PNG palette size.
 * PNG is lossless so the quality slider must drive color reduction.
 */
export function pngQualityToColors(quality: number): number {
  if (quality >= 95) return 0; // lossless: no quantization
  if (quality >= 80) return 256;
  if (quality >= 65) return 128;
  if (quality >= 50) return 64;
  if (quality >= 35) return 32;
  if (quality >= 20) return 16;
  return 8;
}
