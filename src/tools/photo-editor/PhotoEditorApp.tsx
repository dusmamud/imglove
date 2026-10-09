import { useState } from 'react';
import type { Dict } from '../../i18n/dicts';
import ToolShell, { type ProcessedImage } from '../../components/react/ToolShell';
import { drawScaled, canvasToBlob, withExtension, type LoadedImage } from '../../engine/image';

interface Props {
  t: Dict['editor'];
  common: Dict['common'];
}

type FilterKey = 'none' | 'grayscale' | 'mono' | 'sepia' | 'invert' | 'vintage' | 'polaroid' | 'kodachrome' | 'technicolor' | 'brownie' | 'cool' | 'warm';

const FILTERS: Record<FilterKey, string> = {
  none: 'none',
  grayscale: 'grayscale(1)',
  mono: 'grayscale(1) contrast(1.3) brightness(1.05)',
  sepia: 'sepia(0.9)',
  invert: 'invert(1)',
  vintage: 'sepia(0.4) contrast(1.1) brightness(0.95) saturate(0.85)',
  polaroid: 'sepia(0.35) saturate(1.5) contrast(1.08) brightness(1.06)',
  kodachrome: 'sepia(0.55) saturate(1.6) contrast(1.25) brightness(0.95)',
  technicolor: 'saturate(1.9) contrast(1.35) brightness(1.02)',
  brownie: 'sepia(0.65) contrast(1.15) brightness(0.92) saturate(1.1)',
  cool: 'saturate(1.1) hue-rotate(-12deg) brightness(1.03)',
  warm: 'saturate(1.15) hue-rotate(10deg) sepia(0.25)',
};

export default function PhotoEditorApp({ t, common }: Props) {
  const [filter, setFilter] = useState<FilterKey>('none');
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturate, setSaturate] = useState(100);
  const [blur, setBlur] = useState(0);

  const filterString = () => {
    const parts = [FILTERS[filter]];
    if (brightness !== 100) parts.push(`brightness(${brightness / 100})`);
    if (contrast !== 100) parts.push(`contrast(${contrast / 100})`);
    if (saturate !== 100) parts.push(`saturate(${saturate / 100})`);
    if (blur > 0) parts.push(`blur(${blur / 10}px)`);
    return parts.filter((p) => p !== 'none').join(' ') || 'none';
  };

  const process = async (files: LoadedImage[]): Promise<ProcessedImage[]> => {
    const fs = filterString();
    return Promise.all(
      files.map(async (f) => {
        const canvas = drawScaled(f.img, f.width, f.height);
        if (fs !== 'none') {
          const ctx = canvas.getContext('2d')!;
          ctx.filter = fs;
          ctx.drawImage(canvas, 0, 0);
          ctx.filter = 'none';
        }
        const blob = await canvasToBlob(canvas, 'png');
        return {
          blob,
          name: withExtension(f.name, 'png', '-edited'),
          width: canvas.width,
          height: canvas.height,
          originalSize: f.size,
        };
      }),
    );
  };

  const resetAll = () => {
    setFilter('none');
    setBrightness(100);
    setContrast(100);
    setSaturate(100);
    setBlur(0);
  };

  const filterLabels: Record<FilterKey, string> = {
    none: t.none,
    grayscale: t.grayscale,
    mono: t.mono,
    sepia: t.sepia,
    invert: t.invert,
    vintage: t.vintage,
    polaroid: t.polaroid,
    kodachrome: t.kodachrome,
    technicolor: t.technicolor,
    brownie: t.brownie,
    cool: t.cool,
    warm: t.warm,
  };

  const sliders = [
    { label: t.brightness, value: brightness, set: setBrightness, min: 0, max: 200, unit: '%' },
    { label: t.contrast, value: contrast, set: setContrast, min: 0, max: 200, unit: '%' },
    { label: t.saturate, value: saturate, set: setSaturate, min: 0, max: 200, unit: '%' },
    { label: t.blur, value: blur, set: setBlur, min: 0, max: 50, unit: '' },
  ];

  return (
    <ToolShell
      t={common}
      settingsInfo={t.info}
      actionLabel={t.applyBtn}
      process={process}
      settings={
        <div className="mx-auto max-w-2xl">
          <p className="mb-2 text-sm font-medium text-ink">{t.filters}</p>
          <div className="mb-6 flex flex-wrap gap-2">
            {(Object.keys(FILTERS) as FilterKey[]).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setFilter(k)}
                className={`rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${
                  filter === k ? 'border-brand bg-brand-soft text-brand' : 'border-line text-muted hover:border-brand hover:text-brand'
                }`}
              >
                {filterLabels[k]}
              </button>
            ))}
          </div>
          <p className="mb-2 text-sm font-medium text-ink">{t.adjust}</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {sliders.map((s) => (
              <div key={s.label}>
                <label className="mb-1 flex justify-between text-sm text-ink">
                  <span>{s.label}</span>
                  <span className="font-medium text-brand">
                    {s.value}
                    {s.unit}
                  </span>
                </label>
                <input
                  type="range"
                  min={s.min}
                  max={s.max}
                  value={s.value}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="slider w-full"
                />
              </div>
            ))}
          </div>
          <button type="button" onClick={resetAll} className="mt-4 text-sm text-muted underline hover:text-ink">
            {common.reset}
          </button>
        </div>
      }
    />
  );
}
