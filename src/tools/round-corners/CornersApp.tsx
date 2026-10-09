import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['corners'];
  common: Dict['common'];
}

function roundedRectPath(ctx: CanvasRenderingContext2D, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(w, 0, w, h, r);
  ctx.arcTo(w, h, 0, h, r);
  ctx.arcTo(0, h, 0, 0, r);
  ctx.arcTo(0, 0, w, 0, r);
  ctx.closePath();
}

export default function CornersApp({ t, common }: Props) {
  const [radius, setRadius] = useState(20); // percent of min dimension
  const [circle, setCircle] = useState(false);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const c = createCanvas(f.width, f.height);
        const ctx = c.getContext('2d')!;
        if (circle) {
          const r = Math.min(f.width, f.height) / 2;
          ctx.beginPath();
          ctx.arc(f.width / 2, f.height / 2, r, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
        } else {
          const r = (Math.min(f.width, f.height) * radius) / 100;
          roundedRectPath(ctx, f.width, f.height, r);
          ctx.clip();
        }
        ctx.drawImage(f.img, 0, 0);
        const blob = await canvasToBlob(c, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', circle ? '-circle' : '-rounded'),
          width: f.width,
          height: f.height,
          originalSize: f.size,
        };
      }),
    );
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-lg space-y-5">
          <label className="flex cursor-pointer items-center gap-3 text-sm font-medium text-ink">
            <input
              type="checkbox"
              checked={circle}
              onChange={(e) => setCircle(e.target.checked)}
              className="h-5 w-5 accent-brand"
            />
            {t.circle}
          </label>
          {!circle && (
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-sm font-semibold text-ink">{t.radius}</label>
                <span className="rounded-lg bg-brand-soft px-3 py-1 text-sm font-bold text-brand">{radius}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                className="w-full accent-brand"
              />
            </div>
          )}
        </div>
      }
    />
  );
}
