import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import {
  drawScaled, canvasToBlob, withExtension,
  type LoadedImage, type OutFormat, FORMAT_META,
} from '../../engine/image';

interface Props {
  t: Dict['convert'];
  common: Dict['common'];
}

export default function ConvertApp({ t, common }: Props) {
  const [format, setFormat] = useState<OutFormat>('jpeg');
  const [quality, setQuality] = useState(90);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const canvas = drawScaled(f.img, f.width, f.height, {
          background: format === 'jpeg' ? '#ffffff' : undefined,
        });
        const blob = await canvasToBlob(canvas, format, quality / 100);
        return {
          blob,
          name: withExtension(f.name, FORMAT_META[format].ext),
          width: canvas.width,
          height: canvas.height,
          originalSize: f.size,
        };
      }),
    );
  };

  const meta = FORMAT_META[format];

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.convertBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-sm font-medium text-ink">{t.format}</p>
          <div className="mb-5 flex gap-2">
            {(Object.keys(FORMAT_META) as OutFormat[]).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                className={`flex-1 rounded-card border-2 px-4 py-3 text-sm font-semibold transition-colors ${
                  format === f ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-brand'
                }`}
              >
                {FORMAT_META[f].label}
              </button>
            ))}
          </div>
          {meta.supportsQuality && (
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
                <span>{common.quality}</span>
                <span className="rounded-full bg-brand-soft px-3 py-0.5 font-semibold text-brand">{quality}%</span>
              </label>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          )}
        </div>
      }
    />
  );
}
