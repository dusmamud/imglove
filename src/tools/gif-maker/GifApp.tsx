import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['gif'];
  common: Dict['common'];
}

export default function GifApp({ t, common }: Props) {
  const [delay, setDelay] = useState(500);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const { GIFEncoder, quantize, applyPalette } = await import('gifenc');
    // Use the first image's dimensions; scale others to fit
    const base = files[0];
    const maxDim = 600;
    const scale = Math.min(1, maxDim / Math.max(base.width, base.height));
    const w = Math.max(2, Math.round(base.width * scale));
    const h = Math.max(2, Math.round(base.height * scale));

    const gif = GIFEncoder();
    gif.writeHeader();
    for (const f of files) {
      const c = createCanvas(w, h);
      const ctx = c.getContext('2d')!;
      // Fill background (GIF has no partial transparency handling here)
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      // Contain-fit the frame
      const r = Math.min(w / f.width, h / f.height);
      const dw = Math.round(f.width * r);
      const dh = Math.round(f.height * r);
      ctx.drawImage(f.img, Math.round((w - dw) / 2), Math.round((h - dh) / 2), dw, dh);
      const data = ctx.getImageData(0, 0, w, h).data;
      const palette = quantize(data, 256, { format: 'rgba4444' });
      const index = applyPalette(data, palette, 'rgba4444');
      gif.writeFrame(index, w, h, { palette, delay });
    }
    gif.finish();
    const bytes = gif.bytes();
    const blob = new Blob([bytes.buffer as ArrayBuffer], { type: 'image/gif' });
    return [
      {
        blob,
        name: withExtension(base.name, 'gif', '-animated'),
        width: w,
        height: h,
        originalSize: files.reduce((s, f) => s + f.size, 0),
      },
    ];
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-ink">{t.delay}</label>
            <span className="rounded-lg bg-brand-soft px-3 py-1 text-sm font-bold text-brand">
              {delay} {t.ms}
            </span>
          </div>
          <input
            type="range"
            min={100}
            max={2000}
            step={50}
            value={delay}
            onChange={(e) => setDelay(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>100 {t.ms}</span>
            <span>2000 {t.ms}</span>
          </div>
        </div>
      }
    />
  );
}
