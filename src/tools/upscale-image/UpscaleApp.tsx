import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['upscale'];
  common: Dict['common'];
}

/** Simple 3x3 sharpen convolution for the "enhance details" option. */
function sharpen(ctx: CanvasRenderingContext2D, w: number, h: number, amount: number) {
  const src = ctx.getImageData(0, 0, w, h);
  const dst = ctx.createImageData(w, h);
  const s = src.data;
  const d = dst.data;
  const k = amount;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      for (let c = 0; c < 3; c++) {
        const center = s[i + c];
        const up = s[((Math.max(y - 1, 0) * w + x) * 4) + c];
        const down = s[((Math.min(y + 1, h - 1) * w + x) * 4) + c];
        const left = s[((y * w + Math.max(x - 1, 0)) * 4) + c];
        const right = s[((y * w + Math.min(x + 1, w - 1)) * 4) + c];
        d[i + c] = Math.max(0, Math.min(255, center + k * (center - (up + down + left + right) / 4)));
      }
      d[i + 3] = s[i + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}

export default function UpscaleApp({ t, common }: Props) {
  const [scale, setScale] = useState<2 | 4>(2);
  const [enhance, setEnhance] = useState(true);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const w = f.width * scale;
        const h = f.height * scale;
        const c = createCanvas(w, h);
        const ctx = c.getContext('2d')!;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(f.img, 0, 0, w, h);
        if (enhance) sharpen(ctx, w, h, 0.5);
        const blob = await canvasToBlob(c, 'png');
        // Never-bigger guarantee
        const finalBlob = blob.size >= f.size ? f.blob : blob;
        const grew = finalBlob === f.blob;
        return {
          blob: finalBlob,
          name: grew ? f.name : withExtension(f.name, 'png', `-${scale}x`),
          width: grew ? f.width : w,
          height: grew ? f.height : h,
          originalSize: f.size,
        };
      }),
    );
  };

  const radio =
    'flex cursor-pointer items-center gap-2 rounded-card border border-line px-4 py-3 text-sm font-medium text-ink transition-colors has-checked:border-brand has-checked:bg-brand-soft has-checked:text-brand';

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg space-y-5">
          <div>
            <p className="mb-2 text-sm font-semibold text-ink">{t.scale}</p>
            <div className="grid grid-cols-2 gap-3">
              <label className={radio}>
                <input type="radio" name="scale" checked={scale === 2} onChange={() => setScale(2)} className="accent-brand" />
                {t.twoX}
              </label>
              <label className={radio}>
                <input type="radio" name="scale" checked={scale === 4} onChange={() => setScale(4)} className="accent-brand" />
                {t.fourX}
              </label>
            </div>
          </div>
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={enhance}
              onChange={(e) => setEnhance(e.target.checked)}
              className="h-5 w-5 accent-brand"
            />
            {t.enhance}
          </label>
        </div>
      }
    />
  );
}
