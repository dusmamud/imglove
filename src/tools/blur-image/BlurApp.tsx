import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { createCanvas, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['blur'];
  common: Dict['common'];
}

export default function BlurApp({ t, common }: Props) {
  const [intensity, setIntensity] = useState(12);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const c = createCanvas(f.width, f.height);
        const ctx = c.getContext('2d')!;
        ctx.filter = `blur(${intensity}px)`;
        ctx.drawImage(f.img, 0, 0);
        ctx.filter = 'none';
        const blob = await canvasToBlob(c, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-blurred'),
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
        <div className="mx-auto max-w-lg">
          <div className="mb-2 flex items-center justify-between">
            <label className="text-sm font-semibold text-ink">{t.intensity}</label>
            <span className="rounded-lg bg-brand-soft px-3 py-1 text-sm font-bold text-brand">{intensity}px</span>
          </div>
          <input
            type="range"
            min={1}
            max={50}
            value={intensity}
            onChange={(e) => setIntensity(Number(e.target.value))}
            className="w-full accent-brand"
          />
          <div className="mt-1 flex justify-between text-xs text-muted">
            <span>1px</span>
            <span>50px</span>
          </div>
        </div>
      }
    />
  );
}
