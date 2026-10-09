import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['border'];
  common: Dict['common'];
}

export default function BorderApp({ t, common }: Props) {
  const [width, setWidth] = useState(5); // percent of min dimension
  const [color, setColor] = useState('#4d90fe');

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const bw = Math.max(1, Math.round((Math.min(f.width, f.height) * width) / 100));
        const c = createCanvas(f.width + bw * 2, f.height + bw * 2);
        const ctx = c.getContext('2d')!;
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(f.img, bw, bw);
        const blob = await canvasToBlob(c, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-border'),
          width: c.width,
          height: c.height,
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
          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="text-sm font-semibold text-ink">{t.width}</label>
              <span className="rounded-lg bg-brand-soft px-3 py-1 text-sm font-bold text-brand">{width}%</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="w-full accent-brand"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-semibold text-ink">{t.color}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-11 w-16 cursor-pointer rounded-lg border border-line bg-white p-1"
              />
              <span className="text-sm text-muted">{color}</span>
            </div>
          </div>
        </div>
      }
    />
  );
}
