import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['resize'];
  common: Dict['common'];
}

export default function ResizeApp({ t, common }: Props) {
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [percent, setPercent] = useState(50);
  const [lock, setLock] = useState(true);

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        let w: number, h: number;
        if (mode === 'percent') {
          w = Math.round((f.width * percent) / 100);
          h = Math.round((f.height * percent) / 100);
        } else if (lock) {
          const s = Math.min(width / f.width, height / f.height);
          w = Math.round(f.width * s);
          h = Math.round(f.height * s);
        } else {
          w = width;
          h = height;
        }
        w = Math.max(1, w);
        h = Math.max(1, h);
        const canvas = drawScaled(f.img, w, h);
        const blob = await canvasToBlob(canvas, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-resized'),
          width: w,
          height: h,
          originalSize: f.size,
        };
      }),
    );
  };

  const numCls =
    'w-full rounded-lg border border-line px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none';

  return (
    <ToolShell
      t={common}
      actionLabel={t.resizeBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-md">
          <p className="mb-2 text-sm font-medium text-ink">{t.mode}</p>
          <div className="mb-5 inline-flex rounded-full border border-line p-1">
            {(['pixels', 'percent'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
                  mode === m ? 'bg-brand text-white' : 'text-muted hover:text-ink'
                }`}
              >
                {m === 'pixels' ? t.byPixels : t.byPercent}
              </button>
            ))}
          </div>

          {mode === 'pixels' ? (
            <div>
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="mb-1 block text-sm text-muted">
                    {common.width} ({common.pixels})
                  </span>
                  <input type="number" min={1} value={width} onChange={(e) => setWidth(Number(e.target.value))} className={numCls} />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm text-muted">
                    {common.height} ({common.pixels})
                  </span>
                  <input type="number" min={1} value={height} onChange={(e) => setHeight(Number(e.target.value))} className={numCls} />
                </label>
              </div>
              <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink">
                <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="h-4 w-4 accent-[#4d90fe]" />
                {t.lockAspect}
              </label>
            </div>
          ) : (
            <div>
              <label className="mb-2 flex items-center justify-between text-sm font-medium text-ink">
                <span>{t.percent}</span>
                <span className="rounded-full bg-brand-soft px-3 py-0.5 font-semibold text-brand">{percent}%</span>
              </label>
              <input
                type="range"
                min={1}
                max={200}
                value={percent}
                onChange={(e) => setPercent(Number(e.target.value))}
                className="slider w-full"
              />
            </div>
          )}
        </div>
      }
    />
  );
}
