import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['resize'];
  common: Dict['common'];
}

const PERCENT_PRESETS = [25, 50, 75];

export default function ResizeApp({ t, common }: Props) {
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  // null = follow the uploaded image's real dimensions
  const [width, setWidth] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [percent, setPercent] = useState(50);
  const [lock, setLock] = useState(true);
  const [noEnlarge, setNoEnlarge] = useState(false);

  const effW = (f: LoadedImage) => width ?? f.width;
  const effH = (f: LoadedImage) => height ?? f.height;

  const dimsFor = (f: LoadedImage): [number, number] => {
    let w: number, h: number;
    if (mode === 'percent') {
      w = Math.round((f.width * percent) / 100);
      h = Math.round((f.height * percent) / 100);
    } else if (lock) {
      const s = Math.min(effW(f) / f.width, effH(f) / f.height);
      w = Math.round(f.width * s);
      h = Math.round(f.height * s);
    } else {
      w = effW(f);
      h = effH(f);
    }
    if (noEnlarge) {
      w = Math.min(w, f.width);
      h = Math.min(h, f.height);
    }
    return [Math.max(1, w), Math.max(1, h)];
  };

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    return Promise.all(
      files.map(async (f) => {
        const [w, h] = dimsFor(f);
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

  const settings = (files: LoadedImage[]) => {
    const first = files[0];
    const outPrev = first ? (
      <p className="mt-3 rounded-lg bg-soft px-3 py-2 text-xs text-muted">
        {t.outputSize}: <span className="font-semibold text-ink">{dimsFor(first)[0]} × {dimsFor(first)[1]} {common.pixels}</span>
      </p>
    ) : null;
    return (
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
                <input
                  type="number"
                  min={1}
                  value={first ? effW(first) : ''}
                  onChange={(e) => setWidth(Number(e.target.value) || null)}
                  className={numCls}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm text-muted">
                  {common.height} ({common.pixels})
                </span>
                <input
                  type="number"
                  min={1}
                  value={first ? effH(first) : ''}
                  onChange={(e) => setHeight(Number(e.target.value) || null)}
                  className={numCls}
                />
              </label>
            </div>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={lock} onChange={(e) => setLock(e.target.checked)} className="h-4 w-4 accent-[#4d90fe]" />
              {t.lockAspect}
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={noEnlarge} onChange={(e) => setNoEnlarge(e.target.checked)} className="h-4 w-4 accent-[#4d90fe]" />
              {t.noEnlarge}
            </label>
            {outPrev}
          </div>
        ) : (
          <div>
            <div className="mb-4 flex gap-2">
              {PERCENT_PRESETS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercent(p)}
                  className={`flex-1 rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                    percent === p ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-brand'
                  }`}
                >
                  {p}%
                </button>
              ))}
            </div>
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
            {outPrev}
          </div>
        )}
      </div>
    );
  };

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.resizeBtn}
      process={process}
      settings={settings}
    />
  );
}
